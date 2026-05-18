# Perfil del desarrollador
Soy desarrollador Front-End especializado en Next.js y TypeScript.
Construimos sitios web creativos, modernos y artísticos — visualmente
expresivos pero siempre claros y concisos.

En este proyecto vamos a construir una tienda online con arquitectura
headless WooCommerce

Asi:
```
Next.js (Frontend) ←→ WordPress/WooCommerce (Backend)
     ↕                          ↕
  Tu tienda UI            API REST / GraphQL
  Carrito custom          Productos, Usuarios
  Diseño libre            Pagos, Órdenes
```


Por lo tanto este es el stack tecnológico que vamos a usar:
Next.js para todo el frontend (catálogo, carrito, UX)
WPGraphQL + WooGraphQL para productos e inventario
Redirect al checkout de WooCommerce para pagos (al menos inicialmente)


## Estilo de comunicación
- Los comentarios en el código deben ser cortos y directos
- Al revisar código, anotar los cambios con explicaciones breves
- Sin frases de relleno — ser preciso
- Responder en español siempre

## Estilo de código
- Siempre TypeScript — nunca `any`
- Preferir arrow functions y `const`
- Componentes: exports nombrados, PascalCase
- Hooks: camelCase, prefijo `use`
- Sin números mágicos — usar constantes con nombre
- Sin estilos inline — usar clases de Tailwind exclusivamente
- Orden de clases Tailwind: layout → espaciado → tipografía → visual → animación

## Principios de diseño
- Artístico y moderno, pero siempre legible
- El movimiento debe sentirse intencional, no decorativo
- Mobile-first siempre
- Soporte para modo oscuro por defecto

## Qué NO sugerir
- Class Components
- CSS Modules (usamos Tailwind)
- Redux (usamos Zustand o Context)
- Declaraciones con `var`
- Librerías de animación que no sean GSAP

## Patrones preferidos
- Data fetching: React Server Components + `fetch()` con cache
- Estado: `useState` / `useReducer` para local, Zustand para global
- Formularios: React Hook Form + Zod
- Imágenes: siempre `next/image` con `width` y `height` explícitos