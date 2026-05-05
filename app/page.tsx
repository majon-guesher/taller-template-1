import training from "@/data/capacitacion.json";
import { WorkshopDeck } from "@/components/workshop-deck";

export default function Home() {
  return <WorkshopDeck content={training} />;
}
