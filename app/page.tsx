import { MontajApp } from "@/components/montaj/montaj-app";
import { RehberBolumu } from "@/components/montaj/rehber-bolumu";
import { KLIPLER } from "@/lib/montaj";
import "./montaj.css";

export default function MontajPage() {
  const opus = KLIPLER.filter((k) => k.kaynak === "opus55").length;
  return (
    <div lang="tr">
      <MontajApp klipler={KLIPLER} />
      <RehberBolumu toplam={KLIPLER.length} opus={opus} />
    </div>
  );
}
