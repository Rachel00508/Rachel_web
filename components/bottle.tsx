type Props = { variant: string; className?: string };

export function Bottle({ variant, className = "" }: Props) {
  return <div className={`product-art art-${variant} ${className}`} role="img" aria-label="Illustration of a Rachel perfume bottle">
    <div className="art-orbit" />
    <div className="bottle-shadow" />
    <div className="bottle">
      <div className="bottle-cap" />
      <div className="bottle-neck" />
      <div className="bottle-glass"><div className="bottle-label"><span>RACHEL</span><strong>{variant === "santal" ? "SANTAL MUSE" : variant === "fleur" ? "FLEUR NOIRE" : variant === "solstice" ? "SOLSTICE" : "AFTERGLOW"}</strong><small>EAU DE PARFUM · 50 ML</small></div></div>
    </div>
  </div>;
}
