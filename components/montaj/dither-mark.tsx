// Sitedeki sürüm bu klaketi Canvas UI (MIT + Commons Clause) ile 3D dither'a çeviriyor.
// O bileşen yeniden dağıtılamadığı için açık kaynak sürümde düz SVG duruyor.
export function DitherKlaket({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* biome-ignore lint/performance/noImgElement: sabit SVG */}
      <img src="/montaj/klaket.svg" alt="" className="mx-auto size-2/3 opacity-85" />
    </div>
  );
}
