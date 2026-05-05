"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Expand,
  Flame,
  Gauge,
  Layers3,
  Lightbulb,
  MonitorUp,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkshopContent = {
  meta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    duration: string;
    audience: string;
    promise: string;
  };
  principles: string[];
  cards: Array<{
    label: string;
    title: string;
    body: string;
  }>;
  slides: Array<{
    number: string;
    minutes: string;
    title: string;
    goal: string;
    beats: string[];
    note: string;
  }>;
  cases: Array<{
    name: string;
    tag: string;
    level: string;
    idea: string;
    ship: string;
    twist: string;
  }>;
  survey: string[];
};

const slideAccents = [
  "bg-[#e9ff58] text-[#171712]",
  "bg-[#ff6b4a] text-[#171712]",
  "bg-[#82f7ff] text-[#171712]",
  "bg-[#f2d4ff] text-[#171712]",
  "bg-[#d7ffb8] text-[#171712]",
  "bg-[#ffd166] text-[#171712]",
  "bg-[#fff3cf] text-[#171712]",
];

const caseAccents = [
  "border-[#e9ff58]/70 bg-[#e9ff58]/10",
  "border-[#ff6b4a]/70 bg-[#ff6b4a]/10",
  "border-[#82f7ff]/70 bg-[#82f7ff]/10",
  "border-[#f2d4ff]/70 bg-[#f2d4ff]/10",
];

export function WorkshopDeck({ content }: { content: WorkshopContent }) {
  const [active, setActive] = useState(0);
  const slide = content.slides[active];
  const progress = useMemo(
    () => ((active + 1) / content.slides.length) * 100,
    [active, content.slides.length],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setActive((current) =>
          Math.min(current + 1, content.slides.length - 1),
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [content.slides.length]);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  return (
    <main className="min-h-screen bg-[#171712] text-[#fff7df]">
      <section className="relative overflow-hidden border-b border-[#fff7df]/15">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <aside className="flex flex-col justify-between gap-8 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase text-[#fff7df]/70">
                <span className="border border-[#fff7df]/20 px-2.5 py-1">
                  {content.meta.eyebrow}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {content.meta.duration}
                </span>
                <span>{content.meta.audience}</span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-2xl text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
                  {content.meta.title}
                </h1>
                <p className="max-w-xl text-lg leading-7 text-[#fff7df]/72">
                  {content.meta.subtitle}
                </p>
              </div>

              <Card className="rounded-lg border-[#e9ff58]/50 bg-[#e9ff58] py-5 text-[#171712] ring-0">
                <CardHeader className="px-5">
                  <CardTitle className="flex items-center gap-2 text-sm uppercase">
                    <Sparkles className="size-4" />
                    Promesa
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 text-2xl font-black leading-tight">
                  {content.meta.promise}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {content.principles.map((principle, index) => (
                  <div
                    className={cn(
                      "min-h-24 border border-[#fff7df]/15 p-2 text-[0.68rem] font-bold uppercase leading-tight text-[#fff7df]/78",
                      index === 1 && "translate-y-4",
                      index === 3 && "-translate-y-3",
                    )}
                    key={principle}
                  >
                    {principle}
                  </div>
                ))}
              </div>
              <div className="h-1.5 bg-[#fff7df]/12">
                <div
                  className="h-full bg-[#ff6b4a] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {content.slides.map((item, index) => (
                  <button
                    className={cn(
                      "h-10 min-w-10 border border-[#fff7df]/15 px-3 text-sm font-black transition hover:border-[#fff7df]/45",
                      active === index
                        ? slideAccents[index % slideAccents.length]
                        : "text-[#fff7df]/68",
                    )}
                    key={item.number}
                    onClick={() => setActive(index)}
                    type="button"
                  >
                    {item.number}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  aria-label="Pantalla completa"
                  className="border-[#fff7df]/20 bg-transparent text-[#fff7df] hover:bg-[#fff7df]/10"
                  onClick={requestFullscreen}
                  size="icon-lg"
                  title="Pantalla completa"
                  type="button"
                  variant="outline"
                >
                  <Expand className="size-4" />
                </Button>
                <Button
                  aria-label="Anterior"
                  className="border-[#fff7df]/20 bg-transparent text-[#fff7df] hover:bg-[#fff7df]/10"
                  disabled={active === 0}
                  onClick={() => setActive((current) => Math.max(0, current - 1))}
                  size="icon-lg"
                  title="Anterior"
                  type="button"
                  variant="outline"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  aria-label="Siguiente"
                  className="bg-[#fff7df] text-[#171712] hover:bg-[#e9ff58]"
                  disabled={active === content.slides.length - 1}
                  onClick={() =>
                    setActive((current) =>
                      Math.min(content.slides.length - 1, current + 1),
                    )
                  }
                  size="icon-lg"
                  title="Siguiente"
                  type="button"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <article className="grid min-h-[560px] grid-cols-1 overflow-hidden border border-[#fff7df]/15 bg-[#211f1a] lg:grid-cols-[1fr_0.45fr]">
              <div className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">
                <div className="space-y-6">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-black uppercase",
                      slideAccents[active % slideAccents.length],
                    )}
                  >
                    <Gauge className="size-4" />
                    Bloque {slide.number} · {slide.minutes}
                  </div>

                  <div className="space-y-5">
                    <h2 className="max-w-3xl text-5xl font-black leading-none sm:text-7xl">
                      {slide.title}
                    </h2>
                    <p className="max-w-2xl text-2xl font-semibold leading-tight text-[#fff7df]/84">
                      {slide.goal}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {slide.beats.map((beat, index) => (
                    <div
                      className="border border-[#fff7df]/12 bg-[#171712]/60 p-4 text-lg font-semibold leading-snug text-[#fff7df]/82"
                      key={beat}
                    >
                      <span className="mb-5 block text-sm font-black text-[#ff6b4a]">
                        0{index + 1}
                      </span>
                      {beat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-[#fff7df]/15 bg-[#fff7df] p-6 text-[#171712] lg:border-l lg:border-t-0 lg:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase">
                    <Lightbulb className="size-4" />
                    Nota para presentar
                  </div>
                  <p className="text-3xl font-black leading-tight">
                    {slide.note}
                  </p>
                </div>

                <div className="mt-10 space-y-3 border-t border-[#171712]/15 pt-5">
                  <p className="text-xs font-black uppercase text-[#171712]/55">
                    Ritmo
                  </p>
                  <p className="text-lg font-bold">
                    Pedido chico, cambio visible, deploy, feedback.
                  </p>
                </div>
              </div>
            </article>

            <section className="grid gap-4 md:grid-cols-2">
              {content.cards.map((card) => (
                <Card
                  className="rounded-lg border-[#fff7df]/14 bg-[#fff7df]/6 py-5 text-[#fff7df] ring-0"
                  key={card.title}
                >
                  <CardHeader className="px-5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-[#e9ff58]">
                      <Flame className="size-4" />
                      {card.label}
                    </div>
                    <CardTitle className="text-2xl font-black leading-tight">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 text-base leading-7 text-[#fff7df]/72">
                    {card.body}
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[0.38fr_1fr] lg:px-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#ff6b4a] px-3 py-1.5 text-sm font-black uppercase text-[#171712]">
            <Layers3 className="size-4" />
            Casos para elegir
          </div>
          <h2 className="text-4xl font-black leading-none sm:text-5xl">
            Cuatro caminos, una regla: que se pueda jugar.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {content.cases.map((item, index) => (
            <Card
              className={cn(
                "rounded-lg border py-5 text-[#fff7df] ring-0",
                caseAccents[index % caseAccents.length],
              )}
              key={item.name}
            >
              <CardHeader className="px-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase text-[#fff7df]/58">
                  <span>{item.tag}</span>
                  <span className="border border-[#fff7df]/18 px-2 py-0.5">
                    {item.level}
                  </span>
                </div>
                <CardTitle className="text-3xl font-black">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-5">
                <p className="text-lg font-semibold leading-snug text-[#fff7df]/84">
                  {item.idea}
                </p>
                <div className="space-y-3 border-t border-[#fff7df]/12 pt-4 text-sm leading-6 text-[#fff7df]/70">
                  <p>
                    <span className="font-black text-[#e9ff58]">Ship: </span>
                    {item.ship}
                  </p>
                  <p>
                    <span className="font-black text-[#82f7ff]">Rareza: </span>
                    {item.twist}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-[#fff7df]/15 bg-[#fff7df] text-[#171712]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.45fr_1fr] lg:px-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#171712] px-3 py-1.5 text-sm font-black uppercase text-[#fff7df]">
              <MonitorUp className="size-4" />
              Cierre
            </div>
            <h2 className="text-4xl font-black leading-none sm:text-5xl">
              Medir interes sin matar el clima.
            </h2>
            <p className="text-lg font-semibold leading-7 text-[#171712]/68">
              El cierre releva perfil tecnico, deseo de seguir y debate sobre IA.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {content.survey.map((question, index) => (
              <div
                className="flex min-h-24 gap-4 border border-[#171712]/12 bg-[#171712]/5 p-4"
                key={question}
              >
                <BadgeCheck className="mt-1 size-5 shrink-0 text-[#ff6b4a]" />
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-[#171712]/45">
                    Pregunta {index + 1}
                  </p>
                  <p className="text-lg font-bold leading-snug">{question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
