import { KimiLogo } from "./KimiLogo";
import { KimiMascot } from "./KimiMascot";
import { useWelcomeHint } from "@/hooks/useWelcomeHint";

export function WelcomeScreen() {
  const hint = useWelcomeHint();

  return (
    <div className="flex flex-col items-center gap-3 px-4">
      <div className="flex items-center justify-center gap-3">
        <KimiLogo className="h-12 w-auto shrink-0" />
        <KimiMascot className="h-12" />
      </div>
      {hint.component ? (
        hint.component
      ) : (
        <div className="text-center space-y-0.5">
          <p className="text-xs font-medium text-foreground">{hint.title}</p>
          <p className="text-xs text-muted-foreground">{hint.description}</p>
        </div>
      )}
    </div>
  );
}
