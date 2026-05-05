"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  Expand,
  Layers3,
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

const quickIdeas = [
  "No vienen a aprender sintaxis.",
  "Vienen a hacer mejores materiales.",
  "El criterio sigue siendo humano.",
  "Lo que importa: que se pueda usar.",
];

export function WorkshopDeck({ content }: { content: WorkshopContent }) {
  const [active, setActive] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const slide = content.slides[active];
  const accent = slideAccents[active % slideAccents.length];
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
        setShowOptions(false);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((current) => Math.max(current - 1, 0));
        setShowOptions(false);
      }

      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        setShowOptions((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [content.slides.length]);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  const showCases = active === content.slides.length - 2;
  const showSurvey = active === content.slides.length - 1;
  const options = showCases || showSurvey ? [] : slide.beats;

  return (
    <main className="min-h-screen bg-[#171712] text-[#fff7df]">
      <section className="relative grid min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#fff7df]/10">
          <div
            className="h-full bg-[#ff6b4a] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-normal text-[#fff7df]/62">
              <span className="border border-[#fff7df]/20 px-2.5 py-1">
                {content.meta.eyebrow}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {content.meta.duration}
              </span>
              <span>{content.meta.audience}</span>
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
                onClick={() => {
                  setActive((current) => Math.max(0, current - 1));
                  setShowOptions(false);
                }}
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
                onClick={() => {
                  setActive((current) =>
                    Math.min(content.slides.length - 1, current + 1),
                  );
                  setShowOptions(false);
                }}
                size="icon-lg"
                title="Siguiente"
                type="button"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_0.36fr]">
            <article className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 text-sm font-black uppercase",
                    accent,
                  )}
                >
                  Bloque {slide.number} · {slide.minutes}
                </div>
                <div className="flex gap-1.5">
                  {content.slides.map((item, index) => (
                    <button
                      aria-label={`Ir al bloque ${item.number}`}
                      className={cn(
                        "h-3 w-8 border border-[#fff7df]/20 transition",
                        active === index ? accent : "bg-[#fff7df]/12",
                      )}
                      key={item.number}
                      onClick={() => {
                        setActive(index);
                        setShowOptions(false);
                      }}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-2xl font-black uppercase leading-none text-[#fff7df]/45 sm:text-3xl">
                  {slide.title}
                </p>
                <h1 className="max-w-5xl text-6xl font-black leading-[0.9] sm:text-8xl lg:text-[7.8rem]">
                  {slide.goal}
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className={cn(
                    "h-12 gap-2 rounded-none px-5 text-base font-black",
                    showOptions
                      ? "bg-[#ff6b4a] text-[#171712] hover:bg-[#ff6b4a]"
                      : "bg-[#fff7df] text-[#171712] hover:bg-[#e9ff58]",
                  )}
                  onClick={() => setShowOptions((current) => !current)}
                  type="button"
                >
                  <ChevronDown
                    className={cn(
                      "size-5 transition",
                      showOptions && "rotate-180",
                    )}
                  />
                  {showOptions ? "Ocultar opciones" : "Mostrar opciones"}
                </Button>
                <div className="flex items-center gap-2 border border-[#fff7df]/15 px-4 text-sm font-black uppercase text-[#fff7df]/60">
                  O = opciones
                </div>
              </div>
            </article>

            <aside className="hidden gap-3 lg:grid">
              {quickIdeas.map((idea, index) => (
                <div
                  className={cn(
                    "border border-[#fff7df]/12 p-4 text-xl font-black leading-tight text-[#fff7df]/78",
                    index === 1 && "translate-x-8",
                    index === 2 && "-translate-x-4",
                  )}
                  key={idea}
                >
                  {idea}
                </div>
              ))}
            </aside>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-10 max-h-[58vh] overflow-y-auto border-t border-[#fff7df]/18 bg-[#fff7df] text-[#171712] shadow-2xl transition-transform duration-300",
            showOptions ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            {showCases ? (
              <CasesPanel cases={content.cases} />
            ) : showSurvey ? (
              <SurveyPanel survey={content.survey} />
            ) : (
              <IdeasPanel
                cards={active === 1 ? content.cards : []}
                options={options}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function IdeasPanel({
  cards,
  options,
}: {
  cards: WorkshopContent["cards"];
  options: string[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#171712] px-3 py-1.5 text-sm font-black uppercase text-[#fff7df]">
          <Sparkles className="size-4" />
          Para abrir en pantalla
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => (
            <div
              className="min-h-28 border border-[#171712]/12 bg-[#171712]/5 p-4 text-2xl font-black leading-tight"
              key={option}
            >
              <span className="mb-4 block text-sm text-[#ff6b4a]">
                0{index + 1}
              </span>
              {option}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-3",
          cards.length ? "sm:grid-cols-2" : "items-center",
        )}
      >
        {cards.length ? (
          cards.map((card) => (
            <Card
              className="rounded-lg border-[#171712]/12 bg-[#171712] py-4 text-[#fff7df] ring-0"
              key={card.title}
            >
              <CardHeader className="px-4">
                <div className="text-xs font-black uppercase text-[#e9ff58]">
                  {card.label}
                </div>
                <CardTitle className="text-2xl font-black leading-tight">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 text-base font-semibold leading-6 text-[#fff7df]/72">
                {card.body}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="border border-[#171712]/12 bg-[#171712]/5 p-6 text-3xl font-black leading-tight">
            Elegi que mostrar. La pantalla acompaña tu relato, no lo reemplaza.
          </div>
        )}
      </div>
    </div>
  );
}

function CasesPanel({ cases }: { cases: WorkshopContent["cases"] }) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 bg-[#171712] px-3 py-1.5 text-sm font-black uppercase text-[#fff7df]">
        <Layers3 className="size-4" />
        Opciones de ejercicio
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {cases.map((item) => (
          <Card
            className="rounded-lg border-[#171712]/12 bg-[#171712]/5 py-4 ring-0"
            key={item.name}
          >
            <CardHeader className="px-4">
              <div className="text-xs font-black uppercase text-[#ff6b4a]">
                {item.tag}
              </div>
              <CardTitle className="text-3xl font-black leading-none">
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 text-base font-bold leading-snug text-[#171712]/72">
              <p>{item.idea}</p>
              <p className="text-[#171712]">{item.ship}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SurveyPanel({ survey }: { survey: string[] }) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 bg-[#171712] px-3 py-1.5 text-sm font-black uppercase text-[#fff7df]">
        <MonitorUp className="size-4" />
        Cierre mostrable
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {survey.map((question, index) => (
          <div
            className="flex min-h-32 gap-3 border border-[#171712]/12 bg-[#171712]/5 p-4"
            key={question}
          >
            <BadgeCheck className="mt-1 size-5 shrink-0 text-[#ff6b4a]" />
            <div>
              <p className="mb-2 text-xs font-black uppercase text-[#171712]/45">
                {index + 1}
              </p>
              <p className="text-lg font-black leading-tight">{question}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
