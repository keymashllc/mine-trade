'use server';

import { prisma } from '@/lib/db';
import { mineDepthTrackNode } from '@/lib/game/depthTrackMining';
import { DEPTH_TRACK_NODES, STASH_MAX_SLOTS } from '@/lib/game/constants';

export async function executeDepthTrackNode(
  runId: string,
  userId: string,
  biome: string,
  mode: 'Drill' | 'Blast',
  noSpecimenChance: boolean = false
) {
  const run = await prisma.run.findUnique({
    where: { id: runId },
  });

  if (!run || run.userId !== userId) {
    throw new Error('Run not found');
  }

  if (run.status !== 'active') {
    throw new Error('Run is not active');
  }

  const dayState = await prisma.dayState.findFirst({
    where: {
      runId,
      day: run.currentDay,
    },
  });

  if (!dayState) {
    throw new Error('Day state not found');
  }

  if (dayState.depthTrackExtracted) {
    throw new Error('Already extracted for this day');
  }

  if (dayState.depthTrackNode >= DEPTH_TRACK_NODES) {
    throw new Error('All nodes completed');
  }

  const nodeIndex = dayState.depthTrackNode;
  const result = mineDepthTrackNode(
    nodeIndex,
    biome as 'Desert' | 'Rift' | 'Glacier',
    mode,
    noSpecimenChance
  );

  // Apply damage
  const newHP = Math.max(0, run.rigHP - result.damage);
  
  // Calculate new stash slots used
  let newSlotsUsed = run.stashSlotsUsed;
  
  // Add reward to stash
  if (result.reward) {
    if (result.reward.type === 'specimen') {
      // Specimen takes 1 slot
      newSlotsUsed += 1;
      
      // Create specimen
      await prisma.specimen.create({
        data: {
          runId,
          metalType: result.reward.metalType,
          form: result.reward.specimen!.form,
          grade: result.reward.specimen!.grade,
          biome: result.reward.specimen!.biome,
          depth: nodeIndex + 1,
          meltUnits: result.reward.specimen!.meltUnits,
        },
      });
    } else {
      // Units - check if metal already exists in stash
      const existingItem = await prisma.stashItem.findFirst({
        where: {
          runId,
          metalType: result.reward.metalType,
        },
      });

      if (existingItem) {
        // Stack units (no new slot)
        await prisma.stashItem.update({
          where: { id: existingItem.id },
          data: {
            units: existingItem.units + (result.reward.units || 0),
          },
        });
      } else {
        // New metal type - takes 1 slot
        newSlotsUsed += 1;
        await prisma.stashItem.create({
          data: {
            runId,
            metalType: result.reward.metalType,
            units: result.reward.units || 0,
          },
        });
      }
    }
  }

  // Check if stash is full
  if (newSlotsUsed > run.stashSlots) {
    throw new Error('Stash is full! Extract or sell items first.');
  }

  // Update run and day state
  const nextNode = nodeIndex + 1;
  await prisma.run.update({
    where: { id: runId },
    data: {
      rigHP: newHP,
      stashSlotsUsed: newSlotsUsed,
    },
  });

  await prisma.dayState.update({
    where: { id: dayState.id },
    data: {
      depthTrackNode: nextNode,
    },
  });

  return {
    node: result.node,
    reward: result.reward,
    damage: result.damage,
    hazardTriggered: result.hazardTriggered,
    newHP,
    stashSlotsUsed: newSlotsUsed,
  };
}

export async function extractFromDepthTrack(runId: string, userId: string) {
  const run = await prisma.run.findUnique({
    where: { id: runId },
  });

  if (!run || run.userId !== userId) {
    throw new Error('Run not found');
  }

  const dayState = await prisma.dayState.findFirst({
    where: {
      runId,
      day: run.currentDay,
    },
  });

  if (!dayState) {
    throw new Error('Day state not found');
  }

  if (dayState.depthTrackExtracted) {
    throw new Error('Already extracted');
  }

  await prisma.dayState.update({
    where: { id: dayState.id },
    data: {
      depthTrackExtracted: true,
    },
  });

  return { success: true };
}

export async function handleHazardChoiceAction(
  runId: string,
  userId: string,
  hazard: string,
  choice: 1 | 2,
  runData: {
    stashItems: any[];
    specimens: any[];
    credits: number;
    rigHP: number;
  }
) {
  const run = await prisma.run.findUnique({
    where: { id: runId },
  });

  if (!run || run.userId !== userId) {
    throw new Error('Run not found');
  }

  switch (hazard) {
    case 'cave_in':
      if (choice === 1) {
        // Lose random stash item
        const items = [...runData.stashItems, ...runData.specimens];
        if (items.length > 0) {
          const randomItem = items[Math.floor(Math.random() * items.length)];
          if (randomItem.metalType && !randomItem.form) {
            // It's a stash item
            await prisma.stashItem.delete({ where: { id: randomItem.id } });
          } else {
            // It's a specimen
            await prisma.specimen.delete({ where: { id: randomItem.id } });
          }
        }
      } else {
        // Pay to reinforce
        const cost = Math.floor(runData.credits * 0.1);
        if (runData.credits >= cost) {
          await prisma.run.update({
            where: { id: runId },
            data: { credits: runData.credits - cost },
          });
        } else {
          throw new Error('Not enough credits to reinforce');
        }
      }
      break;
    case 'gas_pocket':
      if (choice === 1) {
        // Take 1 damage
        await prisma.run.update({
          where: { id: runId },
          data: { rigHP: Math.max(0, runData.rigHP - 1) },
        });
      }
      // Choice 2 (extract) is handled in the client
      break;
    case 'equipment_jam':
      if (choice === 2) {
        // Melt 1 specimen
        const specimens = await prisma.specimen.findMany({
          where: { runId },
          orderBy: { createdAt: 'desc' },
          take: 1,
        });
        if (specimens.length > 0) {
          // Import melt function
          const { meltSpecimen } = await import('./mining');
          await meltSpecimen(specimens[0].id, runId, userId);
        }
      }
      // Choice 1 (no specimen chance) is handled in client state
      break;
    case 'misfire':
      if (choice === 1) {
        // Take 2 damage
        await prisma.run.update({
          where: { id: runId },
          data: { rigHP: Math.max(0, runData.rigHP - 2) },
        });
      } else {
        // Downgrade best item - melt highest value specimen
        const specimens = await prisma.specimen.findMany({
          where: { runId },
          orderBy: { meltUnits: 'desc' },
          take: 1,
        });
        if (specimens.length > 0) {
          const { meltSpecimen } = await import('./mining');
          await meltSpecimen(specimens[0].id, runId, userId);
        }
      }
      break;
  }

  return { success: true };
}

