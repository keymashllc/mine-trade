'use client';

import ResourceIcon from './ResourceIcon';

interface RunHUDProps {
  day: number;
  due: number;
  credits: number;
  hp: number;
  maxHp: number;
  stashSlotsUsed: number;
  stashSlotsMax: number;
  activeSurge?: {
    metalType: string;
    timeLeft: number;
  };
}

export default function RunHUD({
  day,
  due,
  credits,
  hp,
  maxHp,
  stashSlotsUsed,
  stashSlotsMax,
  activeSurge,
}: RunHUDProps) {
  const hpPercentage = (hp / maxHp) * 100;
  const slotsPercentage = (stashSlotsUsed / stashSlotsMax) * 100;

  return (
    <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Day / Due */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-gray-400">Day</div>
              <div className="text-xl font-bold">{day}/12</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Due</div>
              <div className={`text-xl font-bold ${credits >= due ? 'text-green-400' : 'text-red-400'}`}>
                {due}
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center">
            <div className="text-xs text-gray-400">Credits</div>
            <div className="text-xl font-bold text-yellow-400">{credits.toLocaleString()}</div>
          </div>

          {/* HP Hearts */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">HP</div>
            <div className="flex gap-1">
              {Array.from({ length: maxHp }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < hp ? 'text-red-500' : 'text-gray-700'
                  }`}
                >
                  ♥
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-400 ml-2">{hp}/{maxHp}</div>
          </div>

          {/* Stash Slots */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">Stash</div>
            <div className="w-24 bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  slotsPercentage >= 100
                    ? 'bg-red-500'
                    : slotsPercentage >= 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, slotsPercentage)}%` }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {stashSlotsUsed}/{stashSlotsMax}
            </div>
          </div>

          {/* Active Surge Timer */}
          {activeSurge && (
            <div className="bg-green-600/20 border border-green-500 rounded px-3 py-1">
              <div className="text-xs text-green-400">SURGE</div>
              <div className="text-sm font-bold text-green-300">
                {activeSurge.metalType} +25%
              </div>
              <div className="text-xs text-green-400">
                {Math.ceil(activeSurge.timeLeft)}s
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

