'use client';

import { DEPTH_TRACK_NODES, DEPTH_TRACK_REWARD_MULTIPLIERS, DEPTH_TRACK_HAZARD_CHANCES } from '@/lib/game/constants';
import ResourceIcon from './ResourceIcon';
import { getHazardIcon } from '@/lib/game/icons';

interface DepthTrackProps {
  currentNode: number; // 0-4, or 5 if extracted
  mode: 'Drill' | 'Blast';
  biome: string;
  onContinue: () => void;
  onExtract: () => void;
  disabled?: boolean;
}

export default function DepthTrack({
  currentNode,
  mode,
  biome,
  onContinue,
  onExtract,
  disabled = false,
}: DepthTrackProps) {
  const isExtracted = currentNode >= DEPTH_TRACK_NODES;
  const canContinue = !isExtracted && currentNode < DEPTH_TRACK_NODES - 1;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Depth Track</h2>
        <div className="text-sm text-gray-400">
          Mode: <span className="font-semibold">{mode}</span> | Biome: <span className="font-semibold">{biome}</span>
        </div>
      </div>

      {/* Track Visualization */}
      <div className="flex items-center justify-between mb-6 relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2" />
        
        {Array.from({ length: DEPTH_TRACK_NODES }).map((_, i) => {
          const isCompleted = i < currentNode;
          const isCurrent = i === currentNode && !isExtracted;
          const multiplier = DEPTH_TRACK_REWARD_MULTIPLIERS[i];
          const hazardChance = DEPTH_TRACK_HAZARD_CHANCES[i];

          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              {/* Node */}
              <div
                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-green-600 border-green-400'
                    : isCurrent
                    ? 'bg-yellow-600 border-yellow-400 animate-pulse'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                {isCompleted ? (
                  <span className="text-2xl">✓</span>
                ) : isCurrent ? (
                  <span className="text-2xl">●</span>
                ) : (
                  <span className="text-gray-500">{i + 1}</span>
                )}
              </div>

              {/* Node Info */}
              <div className="mt-2 text-center min-w-[100px]">
                <div className="text-xs font-bold text-yellow-400">
                  {multiplier.toFixed(2)}x
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round(hazardChance * 100)}% hazard
                </div>
                {hazardChance > 0 && (
                  <div className="mt-1">
                    <ResourceIcon
                      iconName={getHazardIcon('cave_in')}
                      alt="Hazard"
                      size={16}
                      className="inline"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {canContinue && (
          <button
            onClick={onContinue}
            disabled={disabled}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold transition"
          >
            Continue Deeper
          </button>
        )}
        {!isExtracted && (
          <button
            onClick={onExtract}
            disabled={disabled}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold transition"
          >
            Extract Now
          </button>
        )}
        {isExtracted && (
          <div className="px-6 py-3 bg-gray-600 rounded font-semibold text-center">
            Extracted - Day Complete
          </div>
        )}
      </div>
    </div>
  );
}

