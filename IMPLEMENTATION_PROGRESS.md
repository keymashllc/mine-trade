# Implementation Progress

## ✅ Completed

1. **Icon System**
   - Created `lib/game/icons.ts` with icon mappings
   - Created `components/ResourceIcon.tsx` component
   - Set up `public/images/` directory structure

2. **Constants Updated**
   - Added Depth Track constants (5 nodes, multipliers, hazard chances)
   - Added mode modifiers (Drill/Blast)
   - Added inventory slot constants
   - Added market anomaly constants
   - Added market anti-dump constants

3. **Database Schema Updates**
   - Added `stashSlots`, `stashSlotsUsed`, `slotUpgradeUsed` to Run
   - Added `depthTrackNode`, `depthTrackExtracted` to DayState
   - Added `journalUnlocks` to User
   - Added `MarketAnomaly` model
   - Added `MarketDump` model

4. **Depth Track Core Logic**
   - Created `lib/game/depthTrack.ts` with node calculation
   - Added hazard checking and choice system

## 🚧 In Progress

5. **Mining System Refactor**
   - Need to replace shift-based mining with depth track
   - Update `lib/game/mining.ts`
   - Update `app/actions/mining.ts`

## ⏳ Pending

6. **Server Actions**
   - Depth track node execution
   - Hazard choice handling
   - Inventory slot management
   - Market anomaly system
   - Market dump tracking

7. **UI Components**
   - Run HUD (sticky top bar)
   - Depth Track UI (5 nodes, Continue/Extract)
   - Hazard Modal (choice system)
   - Reward Reveal Animation
   - Payment Screen (auto-liquidate)
   - Market Anomaly Timer

8. **Journal Unlocks**
   - Metal Mastery unlock
   - Ultra Trio unlock
   - Biome Trio unlock
   - Unlock notification system

## 📝 Notes

- Resource images need to be moved from `/resource` to `/public/images/`
- Image files should be named: `{iconName}.png`
- All icons mapped in `lib/game/icons.ts`

