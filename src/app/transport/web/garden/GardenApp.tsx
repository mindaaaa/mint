import { MobileGuard } from './layout/MobileGuard.jsx';

export function GardenApp() {
  return (
    <MobileGuard>
      <div className="min-h-screen bg-workbench-bg text-workbench-ink flex items-center justify-center font-serif">
        <div className="text-center px-8">
          <div className="text-xs tracking-[3px] uppercase text-workbench-green-deep italic mb-4">
            · · ·   workbench is being tended   · · ·
          </div>
          <div className="italic text-4xl leading-tight max-w-lg">
            새 정원을 조용히 짓고 있어요.
          </div>
          <div className="mt-4 text-sm text-workbench-ink-mute italic leading-relaxed max-w-md mx-auto">
            곧 같은 자리에서, 씨앗·밭·결과를 한눈에 볼 수 있는 워크벤치가 피어날 거예요.
          </div>
        </div>
      </div>
    </MobileGuard>
  );
}
