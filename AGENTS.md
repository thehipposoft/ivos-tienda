# Agentes del proyecto

## Stack
- Framework: Next.js 14+ (App Router)
- Lenguaje: TypeScript (modo strict)
- Estilos: Tailwind CSS (utility-first, sin estilos inline)
- Animaciones: GSAP (ScrollTrigger, Timeline)
- React 18+

## Estructura del proyecto
app/           → rutas (App Router)
components/    → componentes de UI reutilizables
lib/           → utilidades, hooks, constantes
styles/        → globals, fuentes
types/         → tipos TypeScript compartidos
public/          → assets estáticos
  assets/
    images/
    fonts/

## Comandos
- `npm run dev`       → servidor de desarrollo
- `npm run build`     → build de producción
- `npm run lint`      → chequeo con ESLint
- `npm run typecheck` → tsc --noEmit

## Reglas para tareas autónomas
- No modificar `app/layout.tsx` sin preguntar antes
- No eliminar archivos — solo renombrar o refactorizar
- Siempre ejecutar typecheck antes de dar una tarea por terminada
- Si hay dudas sobre una decisión de diseño, preguntar antes de implementar
- Las animaciones van en un hook dedicado `useGsap` o en la carpeta `animations/`

## Convenciones GSAP
- Todos los timelines usan `useLayoutEffect` + cleanup con `tl.kill()`
- ScrollTrigger siempre registrado: `gsap.registerPlugin(ScrollTrigger)`
- Preferir `gsap.context()` para animaciones con scope de componente
- Los valores de animación usan custom properties de CSS cuando sea posible