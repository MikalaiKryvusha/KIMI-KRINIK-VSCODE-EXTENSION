import { useExtensionImageUrl } from "./hooks/useExtensionImageUrl";

export function KimiLogo({ className }: { className?: string }) {
  const logoUrl = useExtensionImageUrl("resources/krinik-robot-logo.png");

  if (!logoUrl) {
    return null;
  }

  return <img src={logoUrl} alt="KIMI KRINIK" className={className} aria-label="KIMI KRINIK" />;
}
