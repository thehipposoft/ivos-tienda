"use client";

import { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

type HeroSlide = {
  tag: string;
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  image: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    tag: "Últimos ingresos",
    title: "REVESTIMIENTOS EXTERIORES",
    text: "Perfectos para utilizar en oficinas, restaurantes, salas de reuniones, bibliotecas, hoteles, residencias, entre otros.",
    buttonLabel: "Ver Productos",
    buttonHref: "/catalogo",
    image: "/assets/images/banner/banner1.jpg",
  },
  {
    tag: "Nueva colección",
    title: "Placas de PVC",
    text: "Revestimientos de pared ideales para colocar en espacios interiores y semiexteriores, impermeables e ignífugas!",
    buttonLabel: "Ver Productos",
    buttonHref: "/catalogo",
    image: "/assets/images/banner/banner2.jpg",
  },
  {
    tag: "Tendencia",
    title: "Paneles Acústicos",
    text: "Perfectos para utilizar en oficinas, restaurantes, salas de reuniones, bibliotecas, hoteles, residencias, entre otros.",
    buttonLabel: "Ver Productos",
    buttonHref: "/catalogo",
    image: "/assets/images/banner/banner3.jpg",
  },
];

const AUTOPLAY_DELAY = 5000;

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateContent = (index: number) => {
    const el = contentRefs.current[index];
    if (!el) return;
    gsap.fromTo(
      Array.from(el.children),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out", delay: 0.35 }
    );
  };

  const goTo = useCallback((next: number) => {
    const prev = currentRef.current;
    if (prev === next) return;

    currentRef.current = next;
    setCurrent(next);

    gsap.killTweensOf([slideRefs.current[prev], slideRefs.current[next]]);

    gsap.to(slideRefs.current[prev], {
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut",
    });
    gsap.fromTo(
      slideRefs.current[next],
      { opacity: 0 },
      { opacity: 1, duration: 0.9, ease: "power2.inOut" }
    );

    animateContent(next);
  }, []);

  // Initial content entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      animateContent(0);
    });
    return () => ctx.revert();
  }, []);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setTimeout(() => {
      goTo((currentRef.current + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [current, goTo]);

  const prev = () => goTo((currentRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((currentRef.current + 1) % HERO_SLIDES.length);

  return (
    <div className="relative h-[600px] max-h-[90vh] w-full overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          className={`absolute inset-0 ${i === 0 ? "opacity-100" : "opacity-0"}`}
        >
          {/* Background */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

          {/* Content */}
          <div
            ref={(el) => { contentRefs.current[i] = el; }}
            className="absolute inset-0 flex max-w-3xl flex-col justify-center px-12 lg:px-20"
          >
            <span className="mb-5 inline-block w-fit rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              {slide.tag}
            </span>
            <h1 className="mb-4 text-4xl font-bold uppercase leading-tight text-white">
              {slide.title}
            </h1>
            <p className="mb-8 max-w-sm text-base leading-relaxed text-white/80">
              {slide.text}
            </p>
            <Link
              href={slide.buttonHref}
              className="inline-block w-fit rounded-xl bg-brand-orange px-8 py-3.5 text-sm font-bold text-white duration-300 hover:bg-white/0 border border-brand-orange"
            >
              {slide.buttonLabel}
            </Link>
          </div>
        </div>
      ))}

      {/* Left arrow */}
      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-white/50 transition-colors duration-200 hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-white/50 transition-colors duration-200 hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full border-2 border-white transition-colors duration-400 ${
              i === current ? "bg-white" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
