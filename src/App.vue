<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { ref, computed, onMounted } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useUserStore } from './stores/user'
import { useProgressStore } from './stores/progress'
import type { RoadmapNode, RoadmapEdge } from './types/node.types'
import TitleNode from './components/nodes/TitleNode.vue'
import RequiredNode from './components/nodes/RequiredNode.vue'
import OptionalNode from './components/nodes/OptionalNode.vue'
import FloatingProgressMenu from './components/FloatingProgressMenu.vue'
import StatusDropdown from './components/StatusDropdown.vue'
import TechNodeModal from './components/TechNodeModal.vue'
import SpecializationMenu from './components/SpecializationMenu.vue'
import FixedResetButton from './components/FixedResetButton.vue'

// Register custom node types
const nodeTypes = {
  title: TitleNode,
  required: RequiredNode,
  optional: OptionalNode
} as any

// Stores
const userStore = useUserStore()
const progressStore = useProgressStore()

// VueFlow composable
const { setViewport, onInit } = useVueFlow()

// Ref para el componente de progreso flotante
const floatingProgressRef = ref<InstanceType<typeof FloatingProgressMenu> | null>(null)

// NODES con posicionamiento absoluto - Pirámide espaciada + nodos lejanos
const nodes = ref<RoadmapNode[]>([
  // 🏛️ FASE 0: FUNDAMENTOS ABSOLUTOS E INDISPENSABLES (cima de la pirámide)
  {
    id: 'phase-0',
    type: 'title',
    position: { x: 225, y: 100 },
    data: { 
      label: '🏛️ Fase 0: Fundamentos Absolutos e Indispensables', 
      type: 'phase',
      status: 'pending',
      description: '🎯 Base sólida para todo desarrollador web moderno',
      detailedDescription: 'Esta fase establece los cimientos fundamentales del desarrollo web. Aquí dominarás los lenguajes base (HTML/CSS/JavaScript), aprenderás control de versiones profesional con Git, y te familiarizarás con las herramientas esenciales como NPM. Es el punto de partida obligatorio que te preparará para frameworks y tecnologías avanzadas.',
      technologies: ['HTML/CSS Semántico', 'JavaScript ES6+', 'Git/GitHub', 'NPM/Yarn'],
      importance: 'Sin estos fundamentos sólidos, cualquier framework o tecnología avanzada será difícil de dominar. Esta fase te da la base técnica y metodológica necesaria.'
    }
  },
  
  // HTML/CSS - Segundo nivel de la pirámide (centrado perfectamente)
  {
    id: 'html-css-required',
    type: 'required',
    position: { x: 400, y: 370 },
    data: { 
      label: '🔥 HTML/CSS Basic 🌐', 
      type: 'required',
      status: 'pending',
      difficulty: 1,
      isPrincipal: true,
      estimatedTime: '2-4 semanas',
      description: 'Los lenguajes fundamentales de la web',
      detailedDescription: 'HTML y CSS son los pilares de cualquier página web. HTML proporciona la estructura semántica mientras CSS maneja la presentación visual. Dominar estos fundamentos es esencial antes de avanzar a cualquier framework o tecnología moderna.',
      keyConcepts: [
        { name: 'HTML Semántico', tooltip: 'Etiquetas apropiadas: header, nav, main, section, article' },
        { name: 'CSS Flexbox', tooltip: 'Sistema de layout unidimensional flexible' },
        { name: 'CSS Grid', tooltip: 'Sistema de layout bidimensional avanzado' },
        { name: 'Responsive Design', tooltip: 'Media queries y diseño adaptativo' },
        { name: 'CSS Variables', tooltip: 'Custom properties para temas dinámicos' }
      ],
      learningPath: [
        { step: 1, title: 'HTML básico y semántico', completed: false },
        { step: 2, title: 'CSS selectores y propiedades', completed: false },
        { step: 3, title: 'Flexbox y Grid', completed: false },
        { step: 4, title: 'Responsive design', completed: false },
        { step: 5, title: 'Proyecto web completo', completed: false }
      ],
      resources: {
        documentation: 'https://developer.mozilla.org/es/docs/Web',
        video: 'https://www.youtube.com/watch?v=XqFR2lqBYPs',
        additional: 'https://css-tricks.com/guides/'
      }
    }
  },
  // JavaScript - Tercer nivel de la pirámide (centrado perfectamente)
  {
    id: 'javascript-required',
    type: 'required',
    position: { x: 400, y: 615 },
    data: { 
      label: '🔥🔥🔥 JavaScript 🟨', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: true,
      estimatedTime: '4-8 semanas',
      description: 'El lenguaje de programación que da vida a la web moderna. JavaScript es esencial para cualquier desarrollador frontend, permitiendo crear interacciones dinámicas, manipular el DOM, gestionar eventos de usuario y comunicarse con APIs. Desde aplicaciones web simples hasta complejas SPAs, JavaScript es la tecnología central que hace posible la experiencia web interactiva que conocemos hoy.',
      detailedDescription: 'JavaScript es el corazón del desarrollo web moderno. Dominarás desde conceptos básicos hasta características avanzadas como ES6+, programación asíncrona, manipulación del DOM, y patrones de diseño. Es la base fundamental para cualquier framework o librería frontend.',
      keyConcepts: [
        { name: 'Variables y Tipos de Datos', tooltip: 'let, const, var - tipos primitivos y objetos' },
        { name: 'Funciones y Arrow Functions', tooltip: 'Declaración, expresión, funciones flecha y scope' },
        { name: 'ES6+ Features', tooltip: 'Destructuring, spread, template literals, modules' },
        { name: 'Async/Await y Promises', tooltip: 'Programación asíncrona y manejo de APIs' },
        { name: 'DOM Manipulation', tooltip: 'Selección, modificación y eventos del DOM' },
        { name: 'Event Handling', tooltip: 'Manejo de eventos de usuario e interactividad' }
      ],
      learningPath: [
        { step: 1, title: 'Sintaxis Básica y Variables', completed: false },
        { step: 2, title: 'Funciones y Control de Flujo', completed: false },
        { step: 3, title: 'Objetos y Arrays Avanzados', completed: false },
        { step: 4, title: 'ES6+ y Módulos', completed: false },
        { step: 5, title: 'Async/Await y APIs', completed: false },
        { step: 6, title: 'DOM y Proyecto Final', completed: false }
      ],
      resources: {
        documentation: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
        video: 'https://www.youtube.com/watch?v=ivdTnPl1ND0',
        additional: 'https://javascript.info/'
      }
    }
  },
  // Git/GitHub - Cuarto nivel izquierdo de la pirámide (alineado horizontalmente)
  {
    id: 'git-github-required',
    type: 'required',
    position: { x: 100, y: 860 },
    data: { 
      label: '🔥🔥 Git/GitHub 🐙', 
      type: 'required',
      status: 'pending',
      difficulty: 2,
      isPrincipal: true,
      estimatedTime: '1-2 semanas',
      description: 'Sistema de control de versiones esencial para todo desarrollador profesional. Git te permite gestionar cambios en tu código de forma segura, colaborar en equipo sin conflictos, y mantener un historial completo de tu proyecto. GitHub complementa Git con herramientas de colaboración, almacenamiento remoto y funcionalidades sociales que son estándar en la industria del desarrollo de software.',
      detailedDescription: 'Git es la herramienta fundamental para el control de versiones y colaboración en equipos. Aprenderás los comandos básicos, flujos de trabajo, y cómo usar GitHub para almacenar y compartir código. Es indispensable en cualquier entorno de desarrollo profesional.',
      keyConcepts: [
        { name: 'Repositorios y Commits', tooltip: 'Inicialización, staging y commits básicos' },
        { name: 'Branches y Merging', tooltip: 'Ramas de desarrollo y fusión de código' },
        { name: 'GitHub Workflow', tooltip: 'Push, pull, clone y repositorios remotos' },
        { name: 'Pull Requests', tooltip: 'Revisión de código y colaboración' },
        { name: 'Issues y Projects', tooltip: 'Gestión de tareas y seguimiento' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración inicial de Git', completed: false },
        { step: 2, title: 'Comandos básicos (add, commit)', completed: false },
        { step: 3, title: 'Trabajo con repositorios remotos', completed: false },
        { step: 4, title: 'Branches y merge conflicts', completed: false },
        { step: 5, title: 'GitHub y colaboración', completed: false }
      ],
      resources: {
        documentation: 'https://git-scm.com/doc',
        video: 'https://www.youtube.com/watch?v=HiXLkL42tMU',
        additional: 'https://learngitbranching.js.org/'
      }
    }
  },
  // NPM - Cuarto nivel derecho de la pirámide (alineado horizontalmente)
  {
    id: 'npm-required',
    type: 'required',
    position: { x: 700, y: 860 },
    data: { 
      label: '🔥 NPM 🟥', 
      type: 'required',
      status: 'pending',
      difficulty: 1,
      isPrincipal: false,
      estimatedTime: '1 semana',
      description: 'Gestor de paquetes esencial para el ecosistema de Node.js y desarrollo moderno de JavaScript',
      detailedDescription: 'NPM (Node Package Manager) es el gestor de paquetes más grande del mundo. Te permite instalar librerías, gestionar dependencias, crear scripts de automatización y compartir tu código. Es fundamental para cualquier proyecto JavaScript moderno, desde frontend hasta backend.',
      keyConcepts: [
        { name: 'Package.json', tooltip: 'Archivo de configuración y metadatos del proyecto' },
        { name: 'Instalación de Paquetes', tooltip: 'npm install, dependencias y devDependencies' },
        { name: 'Scripts NPM', tooltip: 'Automatización de tareas con npm run' },
        { name: 'Versionado Semántico', tooltip: 'Sistema de versiones mayor.menor.parche' },
        { name: 'NPM Registry', tooltip: 'Repositorio público de paquetes JavaScript' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración inicial de NPM', completed: false },
        { step: 2, title: 'Instalación y gestión de paquetes', completed: false },
        { step: 3, title: 'Scripts de automatización', completed: false },
        { step: 4, title: 'Publicación de paquetes', completed: false }
      ],
      resources: {
        documentation: 'https://docs.npmjs.com/',
        video: 'https://www.youtube.com/watch?v=P3aKRdUyr0s',
        additional: 'https://npmjs.com/package/npm'
      }
    }
  },

  // 🧱 FASE 1: CIMIENTOS DEL FRONTEND MODERNO (centrado debajo de la pirámide)
  {
    id: 'phase-1',
    type: 'title',
    position: { x: 190, y: 1105 },
    data: { 
      label: '🧱 Fase 1: Cimientos del Frontend Moderno con JavaScript', 
      type: 'phase',
      status: 'pending',
      description: '🚀 Herramientas y frameworks modernos para desarrollo frontend',
      detailedDescription: 'Aquí das el salto hacia el desarrollo profesional moderno. Dominarás herramientas de build como Vite, frameworks reactivos como Vue.js y React, y tecnologías de estilado avanzado. Esta fase te convierte en un desarrollador frontend competente con las herramientas que usa la industria actual.',
      technologies: ['Vite (Build Tool)', 'Vue.js Framework', 'React Library', 'Modern CSS/Tailwind', 'TypeScript (Opcional)', 'Firebase (Opcional)'],
      importance: 'Los frameworks son esenciales en el desarrollo moderno. Esta fase te da las herramientas para crear aplicaciones web reactivas, escalables y mantenibles que cumplen estándares industriales.'
    }
  },
  
  // Nodos Fase 1 - Obligatorios (fila horizontal debajo de la pirámide)
  {
    id: 'vite-required',
    type: 'required',
    position: { x: 400, y: 1375 },
    data: { 
      label: '🔥 Vite 🟣', 
      type: 'required',
      status: 'pending',
      difficulty: 1,
      isPrincipal: false,
      estimatedTime: '1 semana',
      description: 'Herramienta de build ultrarrápida para desarrollo moderno',
      detailedDescription: 'Vite es la herramienta de build más rápida y moderna para proyectos frontend. Desarrollada por el creador de Vue.js, ofrece hot reload instantáneo, optimizaciones automáticas y una configuración mínima. Es la evolución natural de Webpack.',
      keyConcepts: [
        { name: 'Dev Server', tooltip: 'Servidor de desarrollo con hot reload instantáneo' },
        { name: 'Build Optimization', tooltip: 'Bundling optimizado para producción' },
        { name: 'Plugin System', tooltip: 'Ecosistema de plugins para frameworks' },
        { name: 'PWA Concepts Basic', tooltip: 'Plugin para crear Progressive Web Apps básicas' },
        { name: 'Asset Handling', tooltip: 'Gestión automática de assets y recursos' },
        { name: 'Environment Variables', tooltip: 'Variables de entorno y configuración' }
      ],
      learningPath: [
        { step: 1, title: 'Instalación y proyecto básico', completed: false },
        { step: 2, title: 'Configuración para Vue/React', completed: false },
        { step: 3, title: 'Assets y recursos estáticos', completed: false },
        { step: 4, title: 'Build para producción', completed: false },
        { step: 5, title: 'PWA básica con vite-plugin-pwa', completed: false }
      ],
      resources: {
        documentation: 'https://vitejs.dev/guide/',
        video: 'https://www.youtube.com/watch?v=KCrXgy8qtjM',
        additional: 'https://github.com/vitejs/awesome-vite'
      }
    }
  },
  {
    id: 'vue-required',
    type: 'required',
    position: { x: 700, y: 1865 },
    data: { 
      label: '🔥🔥🔥 Vue.js 🟢', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: true,
      estimatedTime: '4-6 semanas',
      description: 'Framework progresivo y accesible para interfaces modernas',
      detailedDescription: 'Vue.js es un framework progresivo que combina lo mejor de React y Angular con una curva de aprendizaje suave. Aprenderás arquitectura de componentes, reactividad, routing, state management y cómo construir SPAs completas. Es perfecto para proyectos desde pequeños hasta empresariales.',
      keyConcepts: [
        { name: 'Componentes y Templates', tooltip: 'Estructura de componentes y sintaxis de template' },
        { name: 'Reactividad y Data Binding', tooltip: 'Sistema reactivo y enlace de datos bidireccional' },
        { name: 'Directivas y Eventos', tooltip: 'v-if, v-for, v-model y manejo de eventos' },
        { name: 'Vue Router', tooltip: 'Navegación entre vistas y rutas dinámicas' },
        { name: 'Composition API', tooltip: 'API moderna para lógica reutilizable' },
        { name: 'State Management', tooltip: 'Pinia para gestión de estado global' }
      ],
      learningPath: [
        { step: 1, title: 'Fundamentos y Templates', completed: false },
        { step: 2, title: 'Componentes y Props', completed: false },
        { step: 3, title: 'Reactividad y Computed', completed: false },
        { step: 4, title: 'Vue Router y Navegación', completed: false },
        { step: 5, title: 'Composition API', completed: false },
        { step: 6, title: 'Proyecto SPA Completo', completed: false }
      ],
      resources: {
        documentation: 'https://vuejs.org/guide/',
        video: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c',
        additional: 'https://vue-course.vercel.app/'
      }
    }
  },
  {
    id: 'react-required',
    type: 'required',
    position: { x: 100, y: 1865 },
    data: { 
      label: '🔥🔥🔥 React ⚛️', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: true,
      estimatedTime: '4-6 semanas',
      description: 'Biblioteca poderosa para crear interfaces de usuario modernas',
      detailedDescription: 'React es la biblioteca más popular para desarrollo frontend. Creada por Facebook, se basa en componentes reutilizables y un flujo de datos unidireccional. Dominar React te abre las puertas a React Native, Next.js y un ecosistema enorme de librerías.',
      keyConcepts: [
        { name: 'JSX y Componentes', tooltip: 'Sintaxis JSX y arquitectura de componentes' },
        { name: 'Props y State', tooltip: 'Paso de datos y estado local de componentes' },
        { name: 'Hooks', tooltip: 'useState, useEffect y hooks personalizados' },
        { name: 'Event Handling', tooltip: 'Manejo de eventos y formularios' },
        { name: 'React Router', tooltip: 'Navegación entre páginas' },
        { name: 'Context API', tooltip: 'Estado global sin librerías externas' }
      ],
      learningPath: [
        { step: 1, title: 'JSX y componentes básicos', completed: false },
        { step: 2, title: 'Props y comunicación', completed: false },
        { step: 3, title: 'State y useState Hook', completed: false },
        { step: 4, title: 'useEffect y ciclo de vida', completed: false },
        { step: 5, title: 'React Router y navegación', completed: false },
        { step: 6, title: 'Proyecto SPA completo', completed: false }
      ],
      resources: {
        documentation: 'https://react.dev/learn',
        video: 'https://www.youtube.com/watch?v=T_5zuuxmKoM',
        additional: 'https://reactjs.org/tutorial/tutorial.html'
      }
    }
  },
  {
    id: 'modern-css-required',
    type: 'required',
    position: { x: 400, y: 1620 },
    data: { 
      label: '🔥🔥 Modern CSS 🎨', 
      type: 'required',
      status: 'pending',
      difficulty: 2,
      isPrincipal: false,
      estimatedTime: '2-3 semanas',
      description: 'CSS moderno con Grid, Flexbox, Variables CSS y metodologías avanzadas',
      detailedDescription: 'El CSS moderno va mucho más allá de los estilos básicos. Dominarás Flexbox y CSS Grid para layouts complejos, variables CSS para temas dinámicos, preprocesadores como Sass, y frameworks como Tailwind CSS. También aprenderás metodologías como BEM y arquitecturas CSS escalables.',
      keyConcepts: [
        { name: 'Flexbox Layout', tooltip: 'Sistema de layout flexible para componentes' },
        { name: 'CSS Grid', tooltip: 'Layout bidimensional para interfaces complejas' },
        { name: 'CSS Variables', tooltip: 'Variables nativas para temas y configuración' },
        { name: 'Responsive Design', tooltip: 'Media queries y diseño adaptativo' },
        { name: 'Sass/SCSS', tooltip: 'Preprocesador CSS con variables y mixins' },
        { name: 'Tailwind CSS', tooltip: 'Framework utility-first para desarrollo rápido' }
      ],
      learningPath: [
        { step: 1, title: 'Flexbox y CSS Grid', completed: false },
        { step: 2, title: 'CSS Variables y funciones', completed: false },
        { step: 3, title: 'Responsive Design avanzado', completed: false },
        { step: 4, title: 'Sass/SCSS y metodologías', completed: false },
        { step: 5, title: 'Tailwind CSS framework', completed: false },
        { step: 6, title: 'Proyecto con diseño complejo', completed: false }
      ],
      resources: {
        documentation: 'https://developer.mozilla.org/es/docs/Web/CSS',
        video: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        additional: 'https://css-tricks.com/guides/'
      }
    }
  },
  
  // Nodos Fase 1 - Opcionales (fila inferior)
  {
    id: 'typescript-optional',
    type: 'optional',
    position: { x: 785, y: 1375 },
    data: { 
      label: '🔥🔥🔥 TypeScript 📘', 
      type: 'optional',
      status: 'pending',
      difficulty: 3,
      isPrincipal: false,
      estimatedTime: '2-4 semanas',
      description: 'JavaScript con tipado estático para código más robusto',
      detailedDescription: 'TypeScript añade un sistema de tipos estático a JavaScript, mejorando la calidad del código y la experiencia de desarrollo. Con un buen dominio de JavaScript, TypeScript es una extensión natural que te permite detectar errores en tiempo de compilación y tener mejor autocompletado.',
      keyConcepts: [
        { name: 'Tipos Básicos', tooltip: 'string, number, boolean, array, object' },
        { name: 'Interfaces y Types', tooltip: 'Definición de contratos y tipos personalizados' },
        { name: 'Generics', tooltip: 'Tipos reutilizables y flexibles' },
        { name: 'Union Types', tooltip: 'Combinación de múltiples tipos' },
        { name: 'TypeScript con Vue', tooltip: 'Integración en proyectos Vue.js' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración y tipos básicos', completed: false },
        { step: 2, title: 'Interfaces y objetos tipados', completed: false },
        { step: 3, title: 'Funciones y métodos tipados', completed: false },
        { step: 4, title: 'Generics y tipos avanzados', completed: false },
        { step: 5, title: 'Integración con Vue.js', completed: false }
      ],
      resources: {
        documentation: 'https://www.typescriptlang.org/docs/',
        video: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
        additional: 'https://typescript.ejercicioscoding.com/'
      }
    }
  },
  {
    id: 'firebase-optional',
    type: 'optional',
    position: { x: 15, y: 1375 },
    data: { 
      label: '🔥🔥🔥 Firebase ☁️', 
      type: 'optional',
      status: 'pending',
      difficulty: 3,
      isPrincipal: false,
      estimatedTime: '2-3 semanas',
      description: 'Plataforma de desarrollo de aplicaciones móviles y web de Google',
      detailedDescription: 'Firebase es una plataforma completa de Backend-as-a-Service (BaaS) que te permite desarrollar aplicaciones sin crear tu propio backend. Incluye base de datos en tiempo real, autenticación, hosting, analytics, notificaciones push y mucho más. Es perfecto para prototipos rápidos y aplicaciones completas.',
      keyConcepts: [
        { name: 'Firestore Database', tooltip: 'Base de datos NoSQL en tiempo real' },
        { name: 'Authentication', tooltip: 'Sistema de autenticación con múltiples proveedores' },
        { name: 'Hosting', tooltip: 'Hosting rápido y seguro para aplicaciones web' },
        { name: 'Cloud Functions', tooltip: 'Funciones serverless para lógica backend' },
        { name: 'Storage', tooltip: 'Almacenamiento de archivos en la nube' },
        { name: 'Analytics', tooltip: 'Análisis de uso y comportamiento de usuarios' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración del proyecto', completed: false },
        { step: 2, title: 'Firestore y operaciones CRUD', completed: false },
        { step: 3, title: 'Authentication con diferentes proveedores', completed: false },
        { step: 4, title: 'Hosting y deployment', completed: false },
        { step: 5, title: 'Cloud Functions básicas', completed: false }
      ],
      resources: {
        documentation: 'https://firebase.google.com/docs',
        video: 'https://www.youtube.com/watch?v=9kRgVxULbag',
        additional: 'https://firebase.google.com/codelabs'
      }
    }
  },

  // 🌍 FASE 2: BACKEND, TESTING Y META-FRAMEWORKS (lado derecho separado)
  {
    id: 'phase-2',
    type: 'title',
    position: { x: 102, y: 2100 },
    data: { 
      label: '🌍 Fase 2: Backend, Testing, Automatización y Meta-Frameworks Frontend', 
      type: 'phase',
      status: 'pending',
      description: '🛠️ Desarrollo fullstack y metodologías profesionales',
      detailedDescription: 'Te conviertes en un desarrollador fullstack completo. Aprenderás backend con Express.js, testing automatizado, y meta-frameworks como Nuxt.js que combinan frontend y backend con funcionalidades PWA integradas. Esta fase te prepara para proyectos empresariales con metodologías profesionales de desarrollo.',
      technologies: ['Testing (Vitest/Jest)', 'Express.js Backend', 'Nuxt.js Meta-Framework (con PWA)', 'GraphQL (Opcional)', 'Testing Library', 'Deployment Profesional'],
      importance: 'El salto hacia fullstack es crucial para proyectos reales. Testing y meta-frameworks son estándares en equipos profesionales. Esta fase te hace un desarrollador integral.'
    }
  },
  
  // Nodos Fase 2 - Obligatorios (columna vertical lado derecho)
  {
    id: 'testing-vitest-required',
    type: 'required',
    position: { x: 15, y: 2350 },
    data: { 
      label: '🔥🔥🔥 Testing Vitest/Jest 🧪', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: false,
      estimatedTime: '2-3 semanas',
      description: 'Frameworks de testing automatizado para JavaScript y aplicaciones web',
      detailedDescription: 'Testing es fundamental en el desarrollo profesional. Vitest (creado por el equipo de Vite) y Jest son los frameworks más populares para testing en JavaScript. Aprenderás testing unitario, de integración, mocking, y cómo integrar testing en tu flujo de desarrollo para crear código más confiable.',
      keyConcepts: [
        { name: 'Unit Testing', tooltip: 'Pruebas de funciones y componentes individuales' },
        { name: 'Integration Testing', tooltip: 'Pruebas de interacción entre componentes' },
        { name: 'Mocking', tooltip: 'Simulación de dependencias externas' },
        { name: 'Test Coverage', tooltip: 'Cobertura de código y métricas de testing' },
        { name: 'Snapshots', tooltip: 'Pruebas de renderizado y cambios visuales' },
        { name: 'E2E Testing', tooltip: 'Testing de extremo a extremo con herramientas como Cypress' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración de Vitest/Jest', completed: false },
        { step: 2, title: 'Pruebas unitarias básicas', completed: false },
        { step: 3, title: 'Testing de componentes Vue/React', completed: false },
        { step: 4, title: 'Mocking y pruebas asíncronas', completed: false },
        { step: 5, title: 'Coverage y CI/CD integration', completed: false }
      ],
      resources: {
        documentation: 'https://vitest.dev/guide/',
        video: 'https://www.youtube.com/watch?v=7r4xVDI2vho',
        additional: 'https://jestjs.io/docs/getting-started'
      }
    }
  },
  {
    id: 'express-required',
    type: 'required',
    position: { x: 785, y: 2350 },
    data: { 
      label: '🔥🔥🔥 Express.js 🚀', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: true,
      estimatedTime: '2-3 semanas',
      description: 'Framework web minimalista y poderoso para Node.js',
      detailedDescription: 'Express.js es el framework web más popular de Node.js. Te permite crear APIs REST, servidores web completos y aplicaciones backend robustas. Es la puerta de entrada al desarrollo fullstack y la base para muchos otros frameworks de Node.js.',
      keyConcepts: [
        { name: 'Routing y Middleware', tooltip: 'Manejo de rutas y funciones intermedias' },
        { name: 'APIs REST', tooltip: 'Creación de endpoints GET, POST, PUT, DELETE' },
        { name: 'Request/Response', tooltip: 'Manejo de peticiones y respuestas HTTP' },
        { name: 'Error Handling', tooltip: 'Gestión centralizada de errores' },
        { name: 'Static Files', tooltip: 'Servir archivos estáticos y assets' },
        { name: 'Template Engines', tooltip: 'Integración con motores de plantillas' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración inicial y routing', completed: false },
        { step: 2, title: 'Middleware y manejo de requests', completed: false },
        { step: 3, title: 'APIs REST básicas', completed: false },
        { step: 4, title: 'Conexión con base de datos', completed: false },
        { step: 5, title: 'Authentication y seguridad', completed: false },
        { step: 6, title: 'Deploy y producción', completed: false }
      ],
      resources: {
        documentation: 'https://expressjs.com/es/',
        video: 'https://www.youtube.com/watch?v=JmJ1WUoUIK4',
        additional: 'https://github.com/expressjs/express/tree/main/examples'
      }
    }
  },
  {
    id: 'nuxt-required',
    type: 'required',
    position: { x: 400, y: 2600 },
    data: { 
      label: '🔥🔥🔥 Nuxt.js 🌟', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: true,
      estimatedTime: '2-4 semanas',
      description: 'Meta-framework de Vue.js para aplicaciones production-ready',
      detailedDescription: 'Nuxt.js es un meta-framework que extiende Vue.js con funcionalidades avanzadas como SSR, SSG, routing automático y optimizaciones de rendimiento. Con Vue dominado, Nuxt es principalmente configuración y conceptos de arquitectura web moderna.',
      keyConcepts: [
        { name: 'Pages y Routing', tooltip: 'Sistema de routing automático basado en carpetas' },
        { name: 'SSR/SSG', tooltip: 'Server-Side Rendering y Static Site Generation' },
        { name: 'Layouts y Components', tooltip: 'Estructura de layouts y componentes globales' },
        { name: 'Middleware', tooltip: 'Funciones que se ejecutan antes de renderizar páginas' },
        { name: 'Modules', tooltip: 'Extensiones y plugins del ecosistema Nuxt' },
        { name: 'PWA Concepts Advanced', tooltip: 'Progressive Web Apps con service workers y funcionalidad offline' },
        { name: 'Deploy Strategies', tooltip: 'Estrategias de despliegue (SPA, SSR, SSG)' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración y estructura', completed: false },
        { step: 2, title: 'Pages y routing automático', completed: false },
        { step: 3, title: 'Layouts y components globales', completed: false },
        { step: 4, title: 'SSR vs SSG vs SPA', completed: false },
        { step: 5, title: 'Modules y plugins', completed: false },
        { step: 6, title: 'Deploy en producción', completed: false },
        { step: 7, title: 'PWA con @nuxtjs/pwa (offline, installable)', completed: false }
      ],
      resources: {
        documentation: 'https://nuxt.com/docs/getting-started/introduction',
        video: 'https://www.youtube.com/watch?v=GBdO5myZNsQ',
        additional: 'https://nuxtjs.org/examples'
      }
    }
  },
  
  // Nodos Fase 2 - Opcionales (columna derecha)
  {
    id: 'graphql-optional',
    type: 'optional',
    position: { x: 936, y: 2600 },
    data: { 
      label: '🔥🔥🔥🔥🔥 GraphQL 🟣', 
      type: 'optional',
      status: 'pending',
      difficulty: 5,
      isPrincipal: true,
      estimatedTime: '4-6 semanas',
      description: 'Lenguaje de consulta revolucionario para APIs modernas',
      detailedDescription: 'GraphQL es un lenguaje de consulta y runtime para APIs que permite a los clientes solicitar exactamente los datos que necesitan. Desarrollado por Facebook, resuelve los problemas de over-fetching y under-fetching de REST. Es una tecnología avanzada que requiere un buen dominio de APIs REST primero.',
      keyConcepts: [
        { name: 'Schema y Types', tooltip: 'Definición de esquemas y tipos de datos' },
        { name: 'Queries y Mutations', tooltip: 'Consultas de lectura y operaciones de escritura' },
        { name: 'Resolvers', tooltip: 'Funciones que resuelven campos de GraphQL' },
        { name: 'Apollo Client/Server', tooltip: 'Herramientas populares del ecosistema GraphQL' },
        { name: 'Subscriptions', tooltip: 'Actualizaciones en tiempo real' },
        { name: 'Federation', tooltip: 'Arquitectura de microservicios con GraphQL' }
      ],
      learningPath: [
        { step: 1, title: 'Fundamentos y sintaxis GraphQL', completed: false },
        { step: 2, title: 'Schemas, Types y Resolvers', completed: false },
        { step: 3, title: 'Apollo Server básico', completed: false },
        { step: 4, title: 'Apollo Client en frontend', completed: false },
        { step: 5, title: 'Subscriptions en tiempo real', completed: false },
        { step: 6, title: 'Proyecto fullstack GraphQL', completed: false }
      ],
      resources: {
        documentation: 'https://graphql.org/learn/',
        video: 'https://www.youtube.com/watch?v=ed8SzALpx1Q',
        additional: 'https://www.apollographql.com/docs/'
      }
    }
  },
  {
    id: 'testing-library-optional',
    type: 'optional',
    position: { x: -141, y: 2600 },
    data: { 
      label: '🔥🔥🔥 Testing Library 🧪', 
      type: 'optional',
      status: 'pending',
      difficulty: 3,
      isPrincipal: false,
      estimatedTime: '1-2 semanas',
      description: 'Conjunto de utilidades para testing de componentes de UI',
      detailedDescription: 'Testing Library es una familia de paquetes que ayuda a testear componentes de UI de manera que se asemeje a cómo los usuarios interactúan con tu aplicación. Con filosofía "testing implementation details", se enfoca en testing funcional más que en testing de implementación interna.',
      keyConcepts: [
        { name: 'User-Centric Testing', tooltip: 'Testing desde la perspectiva del usuario' },
        { name: 'Vue Testing Library', tooltip: 'Utilidades específicas para componentes Vue' },
        { name: 'React Testing Library', tooltip: 'Utilidades específicas para componentes React' },
        { name: 'Queries y Assertions', tooltip: 'Métodos para encontrar elementos y verificar estado' },
        { name: 'User Events', tooltip: 'Simulación de interacciones del usuario' },
        { name: 'Accessibility Testing', tooltip: 'Verificación de accesibilidad en componentes' }
      ],
      learningPath: [
        { step: 1, title: 'Filosofía y configuración', completed: false },
        { step: 2, title: 'Testing de componentes básicos', completed: false },
        { step: 3, title: 'User events y interacciones', completed: false },
        { step: 4, title: 'Testing de formularios', completed: false },
        { step: 5, title: 'Accessibility testing', completed: false }
      ],
      resources: {
        documentation: 'https://testing-library.com/docs/',
        video: 'https://www.youtube.com/watch?v=JKO9fEjNiio',
        additional: 'https://testing-library.com/docs/vue-testing-library/intro/'
      }
    }
  },
  {
    id: 'deployment-hosting-optional',
    type: 'optional',
    position: { x: 400, y: 2350 },
    data: { 
      label: '🔥🔥 Deployment & Hosting 🌐', 
      type: 'optional',
      status: 'pending',
      difficulty: 2,
      isPrincipal: false,
      estimatedTime: '1-2 semanas',
      description: 'Despliegue y hosting de aplicaciones web en producción',
      detailedDescription: 'Aprender a llevar tus aplicaciones desde desarrollo a producción es crucial. Dominarás plataformas como Vercel, Netlify, GitHub Pages, y servicios cloud como AWS. También aprenderás sobre dominios, SSL, CDNs, CI/CD pipelines y mejores prácticas de deployment.',
      keyConcepts: [
        { name: 'Static Hosting', tooltip: 'Hosting de sitios estáticos (Vercel, Netlify, GitHub Pages)' },
        { name: 'Domain & SSL', tooltip: 'Configuración de dominios personalizados y certificados SSL' },
        { name: 'CI/CD Pipelines', tooltip: 'Integración y despliegue continuo automatizado' },
        { name: 'Environment Variables', tooltip: 'Gestión de variables de entorno en producción' },
        { name: 'Performance Optimization', tooltip: 'Optimización de carga y rendimiento' },
        { name: 'Monitoring', tooltip: 'Monitoreo de aplicaciones en producción' }
      ],
      learningPath: [
        { step: 1, title: 'Deploy en Vercel/Netlify', completed: false },
        { step: 2, title: 'Configuración de dominio personalizado', completed: false },
        { step: 3, title: 'CI/CD con GitHub Actions', completed: false },
        { step: 4, title: 'Variables de entorno y secretos', completed: false },
        { step: 5, title: 'Optimización para producción', completed: false }
      ],
      resources: {
        documentation: 'https://vercel.com/docs',
        video: 'https://www.youtube.com/watch?v=1wceHp7SLzw',
        additional: 'https://docs.netlify.com/'
      }
    }
  },

  // 🚀 FASE 3: NUEVOS HORIZONTES Y PLATAFORMAS (lado derecho inferior)
  {
    id: 'phase-3',
    type: 'title',
    position: { x: 117, y: 2850 },
    data: { 
      label: '🚀 Fase 3: Explorando Nuevos Horizontes y Plataformas con JavaScript', 
      type: 'phase',
      status: 'pending',
      description: '🌌 Tecnologías avanzadas y desarrollo multiplataforma',
      detailedDescription: 'Esta es la fase de especialización avanzada donde expandes JavaScript más allá del navegador. Desarrollarás aplicaciones desktop con Electron, sitios estáticos ultrarrápidos con Astro, aplicaciones móviles con React Native, y dominarás herramientas de DevOps como contenedores. Te conviertes en un especialista versátil.',
      technologies: ['Electron (Desktop Apps)', 'Astro (Static Sites)', 'React Native (Mobile)', 'AdonisJS (Backend Avanzado)', 'Inertia.js (SPA Architecture)', 'Podman/Docker (DevOps)'],
      importance: 'La versatilidad es clave en el mercado actual. Esta fase te permite especializarte en nichos específicos y te convierte en un desarrollador que puede trabajar en cualquier plataforma con JavaScript.'
    }
  },
  
  // Nodos Fase 3 - Obligatorios (columna vertical lado derecho)
  {
    id: 'electron-required',
    type: 'required',
    position: { x: -75, y: 3160 },
    data: { 
      label: '🔥🔥🔥🔥 Electron ⚡', 
      type: 'required',
      status: 'pending',
      difficulty: 4,
      isPrincipal: true,
      estimatedTime: '3-5 semanas',
      description: 'Framework para crear aplicaciones de escritorio con tecnologías web',
      detailedDescription: 'Electron permite crear aplicaciones de escritorio multiplataforma usando HTML, CSS y JavaScript. Aplicaciones como Discord, Slack, WhatsApp Desktop y VS Code están construidas con Electron. Con tu conocimiento de Vue.js/React, podrás crear aplicaciones desktop profesionales.',
      keyConcepts: [
        { name: 'Main Process', tooltip: 'Proceso principal que controla el ciclo de vida de la aplicación' },
        { name: 'Renderer Process', tooltip: 'Procesos que renderizan la interfaz de usuario' },
        { name: 'IPC Communication', tooltip: 'Comunicación entre procesos principales y renderizadores' },
        { name: 'Native APIs', tooltip: 'Acceso a APIs nativas del sistema operativo' },
        { name: 'Packaging & Distribution', tooltip: 'Empaquetado y distribución de aplicaciones' },
        { name: 'Security', tooltip: 'Mejores prácticas de seguridad en aplicaciones Electron' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración y primera app', completed: false },
        { step: 2, title: 'Main y Renderer processes', completed: false },
        { step: 3, title: 'IPC y comunicación entre procesos', completed: false },
        { step: 4, title: 'Integración con Vue.js/React', completed: false },
        { step: 5, title: 'APIs nativas y file system', completed: false },
        { step: 6, title: 'Packaging y distribución', completed: false }
      ],
      resources: {
        documentation: 'https://www.electronjs.org/docs/latest/',
        video: 'https://www.youtube.com/watch?v=kN1Czs0m1SU',
        additional: 'https://github.com/electron/electron-quick-start'
      }
    }
  },
  {
    id: 'astro-required',
    type: 'required',
    position: { x: -400, y: 2850 },
    data: { 
      label: '🔥🔥🔥 Astro 🚀', 
      type: 'required',
      status: 'pending',
      difficulty: 3,
      isPrincipal: false,
      estimatedTime: '2-3 semanas',
      description: 'Framework moderno para sitios web estáticos ultrarrápidos',
      detailedDescription: 'Astro es un framework de sitios estáticos que permite usar cualquier framework UI (Vue, React, Svelte) pero genera sitios estáticos super rápidos. Con arquitectura "Islands", solo hidrata JavaScript donde es necesario, resultando en sitios web extremadamente optimizados para SEO y rendimiento.',
      keyConcepts: [
        { name: 'Static Site Generation', tooltip: 'Generación de sitios estáticos optimizados' },
        { name: 'Islands Architecture', tooltip: 'Hidratación selectiva de componentes interactivos' },
        { name: 'Component Integrations', tooltip: 'Uso de Vue, React, Svelte en el mismo proyecto' },
        { name: 'Content Collections', tooltip: 'Gestión de contenido markdown y CMS' },
        { name: 'SEO Optimization', tooltip: 'Optimización automática para motores de búsqueda' },
        { name: 'Performance First', tooltip: 'Arquitectura centrada en rendimiento web' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración y estructura básica', completed: false },
        { step: 2, title: 'Páginas y routing', completed: false },
        { step: 3, title: 'Componentes e integraciones', completed: false },
        { step: 4, title: 'Content collections y markdown', completed: false },
        { step: 5, title: 'Deploy y optimización', completed: false }
      ],
      resources: {
        documentation: 'https://docs.astro.build/en/getting-started/',
        video: 'https://www.youtube.com/watch?v=dsTXcSeAZq8',
        additional: 'https://github.com/withastro/astro/tree/main/examples'
      }
    }
  },
  {
    id: 'expo-rn-required',
    type: 'required',
    position: { x: 885, y: 3160 },
    data: { 
      label: '🔥🔥🔥🔥🔥 Expo (RN) 📱', 
      type: 'required',
      status: 'pending',
      difficulty: 5,
      isPrincipal: true,
      estimatedTime: '6-8 semanas',
      description: 'Desarrollo de aplicaciones móviles nativas con React Native y Expo',
      detailedDescription: 'React Native te permite crear aplicaciones móviles nativas para iOS y Android usando React. Expo es una plataforma que simplifica el desarrollo RN con herramientas, servicios y un flujo de trabajo optimizado. Con React dominado, es principalmente aprender las diferencias de desarrollo móvil y APIs nativas.',
      keyConcepts: [
        { name: 'React Native Components', tooltip: 'Componentes nativos como View, Text, ScrollView' },
        { name: 'Navigation', tooltip: 'Navegación entre pantallas con React Navigation' },
        { name: 'Expo SDK', tooltip: 'APIs para cámara, ubicación, notificaciones, etc.' },
        { name: 'Styling', tooltip: 'StyleSheet y diseño responsivo móvil' },
        { name: 'State Management', tooltip: 'Gestión de estado con Context API o Zustand' },
        { name: 'Build & Distribution', tooltip: 'Compilación y distribución en app stores' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración de Expo y primera app', completed: false },
        { step: 2, title: 'Componentes básicos y styling', completed: false },
        { step: 3, title: 'Navegación entre pantallas', completed: false },
        { step: 4, title: 'APIs nativas (cámara, GPS, etc.)', completed: false },
        { step: 5, title: 'State management y async storage', completed: false },
        { step: 6, title: 'Build y deployment', completed: false }
      ],
      resources: {
        documentation: 'https://docs.expo.dev/',
        video: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
        additional: 'https://reactnative.dev/docs/getting-started'
      }
    }
  },
  
  // Nodos Fase 3 - Opcionales (columna derecha)
  {
    id: 'adonisjs-optional',
    type: 'optional',
    position: { x: 400, y: 3120 },
    data: { 
      label: '🔥🔥🔥🔥 AdonisJS 🟡', 
      type: 'optional',
      status: 'pending',
      difficulty: 4,
      isPrincipal: false,
      estimatedTime: '4-6 semanas',
      description: 'Framework fullstack para Node.js con arquitectura MVC',
      detailedDescription: 'AdonisJS es un framework fullstack para Node.js inspirado en Laravel. Proporciona un ecosistema completo con ORM, autenticación, validación, y herramientas de desarrollo. Es perfecto para crear aplicaciones web robustas con una arquitectura bien definida y convenciones establecidas.',
      keyConcepts: [
        { name: 'MVC Architecture', tooltip: 'Arquitectura Modelo-Vista-Controlador estructurada' },
        { name: 'Lucid ORM', tooltip: 'ORM integrado para bases de datos relacionales' },
        { name: 'Authentication', tooltip: 'Sistema de autenticación y autorización' },
        { name: 'Validation', tooltip: 'Validación robusta de datos de entrada' },
        { name: 'Edge Templates', tooltip: 'Motor de plantillas para vistas' },
        { name: 'Middleware', tooltip: 'Sistema de middleware para HTTP' }
      ],
      learningPath: [
        { step: 1, title: 'Instalación y estructura MVC', completed: false },
        { step: 2, title: 'Routing y controladores', completed: false },
        { step: 3, title: 'Lucid ORM y migraciones', completed: false },
        { step: 4, title: 'Authentication y middleware', completed: false },
        { step: 5, title: 'APIs y validación', completed: false },
        { step: 6, title: 'Deploy y configuración', completed: false }
      ],
      resources: {
        documentation: 'https://docs.adonisjs.com/guides/introduction',
        video: 'https://www.youtube.com/watch?v=5wzcRtrRVd4',
        additional: 'https://github.com/adonisjs/core/tree/main/examples'
      }
    }
  },
  {
    id: 'podman-optional',
    type: 'optional',
    position: { x: 1200, y: 2850 },
    data: { 
      label: '🔥🔥🔥🔥🔥 Podman 🐳', 
      type: 'optional',
      status: 'pending',
      difficulty: 5,
      isPrincipal: false,
      estimatedTime: '3-4 semanas',
      description: 'Containerización daemonless y segura para desarrollo moderno',
      detailedDescription: 'Podman es una alternativa a Docker que no requiere daemon y ofrece mejor seguridad. Permite ejecutar contenedores como usuario normal, tiene mejor integración con systemd, y es compatible con Docker. Es la evolución natural de la containerización, especialmente popular en entornos Linux y empresariales.',
      keyConcepts: [
        { name: 'Daemonless Architecture', tooltip: 'Arquitectura sin daemon central, más segura' },
        { name: 'Rootless Containers', tooltip: 'Contenedores que corren sin privilegios de root' },
        { name: 'Pod Management', tooltip: 'Gestión de pods de contenedores relacionados' },
        { name: 'Docker Compatibility', tooltip: 'Compatibilidad con comandos y formato Docker' },
        { name: 'Systemd Integration', tooltip: 'Integración nativa con systemd para servicios' },
        { name: 'Kubernetes YAML', tooltip: 'Generación de YAML para Kubernetes' }
      ],
      learningPath: [
        { step: 1, title: 'Instalación y configuración', completed: false },
        { step: 2, title: 'Contenedores básicos sin root', completed: false },
        { step: 3, title: 'Pods y networking', completed: false },
        { step: 4, title: 'Volúmenes y persistencia', completed: false },
        { step: 5, title: 'Systemd y servicios', completed: false }
      ],
      resources: {
        documentation: 'https://docs.podman.io/en/latest/',
        video: 'https://www.youtube.com/watch?v=Za36qHbrf3g',
        additional: 'https://github.com/containers/podman/tree/main/docs/tutorials'
      }
    }
  },
  {
    id: 'inertia-optional',
    type: 'optional',
    position: { x: 400, y: 3440 },
    data: { 
      label: '🔥🔥🔥🔥 Inertia.js 🔗', 
      type: 'optional',
      status: 'pending',
      difficulty: 4,
      isPrincipal: false,
      estimatedTime: '2-3 semanas',
      description: 'Adaptador moderno para crear SPAs con backend tradicional',
      detailedDescription: 'Inertia.js permite construir Single Page Applications usando frameworks frontend clásicos (Vue, React) pero con un backend tradicional (Laravel, Rails, etc.). Elimina la necesidad de crear APIs REST separadas, permitiendo un desarrollo fullstack más directo y eficiente con el mejor rendimiento.',
      keyConcepts: [
        { name: 'Server-driven SPAs', tooltip: 'SPAs controladas desde el servidor sin APIs REST' },
        { name: 'Vue.js Adapter', tooltip: 'Integración directa con Vue.js en el frontend' },
        { name: 'Laravel Integration', tooltip: 'Integración estrecha con Laravel backend' },
        { name: 'Page-based Routing', tooltip: 'Routing basado en páginas del servidor' },
        { name: 'Form Handling', tooltip: 'Manejo avanzado de formularios y validación' },
        { name: 'Asset Versioning', tooltip: 'Versionado automático de assets' }
      ],
      learningPath: [
        { step: 1, title: 'Configuración con Laravel + Vue', completed: false },
        { step: 2, title: 'Páginas y componentes Inertia', completed: false },
        { step: 3, title: 'Formularios y validación', completed: false },
        { step: 4, title: 'Shared data y props', completed: false },
        { step: 5, title: 'Proyecto SPA completo', completed: false }
      ],
      resources: {
        documentation: 'https://inertiajs.com/',
        video: 'https://www.youtube.com/watch?v=VrQRKuNVF_g',
        additional: 'https://github.com/inertiajs/inertia/tree/master/examples'
      }
    }
  }
])

// EDGES - Conexiones temporalmente removidas para reorganización manual
const edges = ref<RoadmapEdge[]>([
  // FASE 0 - Conexiones fundamentales
  {
    id: 'e1',
    source: 'phase-0',
    target: 'html-css-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e2', 
    source: 'html-css-required',
    target: 'javascript-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e3',
    source: 'javascript-required', 
    target: 'git-github-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e4',
    source: 'javascript-required',
    target: 'npm-required', 
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  // Conexiones de Git y NPM a Fase 1
  {
    id: 'e5',
    source: 'git-github-required',
    target: 'phase-1',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e6',
    source: 'npm-required',
    target: 'phase-1',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  // FASE 1 - Conexiones obligatorias
  {
    id: 'e7',
    source: 'phase-1',
    target: 'vite-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e8',
    source: 'vite-required',
    target: 'modern-css-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e9',
    source: 'modern-css-required',
    target: 'react-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e10',
    source: 'modern-css-required',
    target: 'vue-required',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e11',
    source: 'react-required',
    target: 'phase-2',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  {
    id: 'e12',
    source: 'vue-required',
    target: 'phase-2',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: '#FF79C6', strokeWidth: 3.60 },
    markerEnd: { type: 'arrowclosed', color: '#FF79C6' }
  },
  // FASE 1 - Conexiones opcionales (tecnologías opcionales apuntan a obligatorias)
  {
    id: 'e13',
    source: 'firebase-optional',
    target: 'vite-required',
    type: 'straight',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e14',
    source: 'typescript-optional',
    target: 'vite-required',
    type: 'straight',
    sourceHandle: 'left',
    targetHandle: 'right',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  
  // FASE 2 - Conexiones obligatorias desde los lados
  {
    id: 'e15',
    source: 'phase-2',
    target: 'testing-vitest-required',
    type: 'smoothstep',
    sourceHandle: 'left',
    targetHandle: 'left',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e16',
    source: 'phase-2',
    target: 'express-required',
    type: 'smoothstep',
    sourceHandle: 'right',
    targetHandle: 'right',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  
  // Conexión opcional desde Deployment & Hosting hacia Fase 2
  {
    id: 'e17',
    source: 'deployment-hosting-optional',
    target: 'phase-2',
    type: 'smoothstep',
    sourceHandle: 'top',
    targetHandle: 'target-bottom',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  
  // Conexiones desde Testing y Express hacia Nuxt
  {
    id: 'e18',
    source: 'testing-vitest-required',
    target: 'nuxt-required',
    type: 'step',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e19',
    source: 'express-required',
    target: 'nuxt-required',
    type: 'step',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  
  // Conexión desde Nuxt hacia Fase 3
  {
    id: 'e20',
    source: 'nuxt-required',
    target: 'phase-3',
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  
  // Conexiones opcionales hacia nodos obligatorios
  {
    id: 'e21',
    source: 'testing-library-optional',
    target: 'testing-vitest-required',
    type: 'step',
    sourceHandle: 'top',
    targetHandle: 'target-bottom',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e22',
    source: 'graphql-optional',
    target: 'express-required',
    type: 'step',
    sourceHandle: 'top',
    targetHandle: 'target-bottom',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  
  // Conexiones desde Fase 3 hacia Astro y Electron
  {
    id: 'e23',
    source: 'phase-3',
    target: 'astro-required',
    type: 'step',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e24',
    source: 'phase-3',
    target: 'electron-required',
    type: 'step',
    sourceHandle: 'left',
    targetHandle: 'target-top',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  },
  
  // Cadena de conexiones opcionales: Inertia.js → AdonisJS → Fase 3
  {
    id: 'e25',
    source: 'inertia-optional',
    target: 'adonisjs-optional',
    type: 'step',
    sourceHandle: 'top',
    targetHandle: 'target-bottom',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e26',
    source: 'adonisjs-optional',
    target: 'phase-3',
    type: 'step',
    sourceHandle: 'top',
    targetHandle: 'target-bottom',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  
  // Conexiones desde el lado derecho de Fase 3
  {
    id: 'e27',
    source: 'podman-optional',
    target: 'phase-3',
    type: 'step',
    sourceHandle: 'left',
    targetHandle: 'right-1',
    style: { 
      stroke: '#BD93F9', 
      strokeWidth: 3.60, 
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#BD93F9',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e28',
    source: 'phase-3',
    target: 'expo-rn-required',
    type: 'step',
    sourceHandle: 'right-2',
    targetHandle: 'target-top',
    style: { 
      stroke: '#FF79C6', 
      strokeWidth: 3.60 
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#FF79C6',
      width: 15,
      height: 15
    }
  }
] as any[])

// Selected node tracking
const selectedNode = ref<RoadmapNode | null>(null)

// Click handler for nodes
function onNodeClick(event: any) {
  if (event.node && event.node.data) {
    selectedNode.value = event.node as RoadmapNode
  }
}

// Helper to determine if it's a phase node
const isPhaseNode = computed(() => {
  return selectedNode.value?.data?.type === 'phase'
})

// Helper to determine if it's a tech node (required or optional)
const isTechNode = computed(() => {
  return selectedNode.value?.data?.type === 'required' || selectedNode.value?.data?.type === 'optional'
})

// Get difficulty name from number
function getDifficultyName(difficulty: number): string {
  const names = {
    1: 'Muy Fácil',
    2: 'Fácil',
    3: 'Medio',
    4: 'Difícil',
    5: 'Muy Difícil'
  }
  return names[difficulty as keyof typeof names] || 'Desconocido'
}

// Get color style for difficulty
function getDifficultyColorStyle(difficulty: number): string {
  const colors = {
    1: '#8be9fd', // Cyan
    2: '#50fa7b', // Verde
    3: '#ffb86c', // Naranja
    4: '#ff5555', // Rojo
    5: '#6272a4'  // Gris
  }
  return `color: ${colors[difficulty as keyof typeof colors] || '#f8f8f2'};`
}

// Get color style for type
function getTypeColorStyle(type: string): string {
  const colors = {
    'phase': '#bd93f9',     // Púrpura
    'required': '#ff9999',  // Rojo más ligero
    'optional': '#6272a4'   // Gris
  }
  return `color: ${colors[type as keyof typeof colors] || '#f8f8f2'};`
}

// Get deployment recommendations for phase
function getDeploymentRecommendations(phaseId: string): string {
  const recommendations = {
    'phase-0': 'Herramientas de deployment & hosting recomendadas para la fase 0: GitHub Pages (HTML/CSS/JS básico)',
    'phase-1': 'Herramientas de deployment & hosting recomendadas para la fase 1: Netlify (Vue.js/React apps)',
    'phase-2': 'Herramientas de deployment & hosting recomendadas para la fase 2: Railway (Express.js APIs)',
    'phase-3': 'Herramientas de deployment & hosting recomendadas para la fase 3: Vercel (Nuxt.js/Astro)'
  }
  return recommendations[phaseId as keyof typeof recommendations] || 'No hay recomendaciones específicas para esta fase.'
}

// Función para manejar cambios de estado
function handleStatusChange() {
  // Actualizar el menú flotante cuando cambie el estado
  if (floatingProgressRef.value) {
    floatingProgressRef.value.updateStats()
  }
}

// Close modal when clicking outside
function closeModal() {
  selectedNode.value = null
}

// Función para centrar la vista exactamente en JavaScript
function centerView() {
  // Nodo JavaScript está en { x: 400, y: 615 }
  // Calcular el centrado exacto basado en el viewport
  const nodeX = 400
  const nodeY = 615
  const zoom = 0.8
  
  // Obtener el tamaño actual del viewport
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Calcular las coordenadas exactas para centrar el nodo
  const centerX = -(nodeX * zoom - viewportWidth / 2)
  const centerY = -(nodeY * zoom - viewportHeight / 2)
  
  setViewport({ x: centerX, y: centerY, zoom })
}

// Inicialización
onMounted(() => {
  // Inicializar nodos en el store de progreso
  progressStore.initializeNodes(nodes.value)
})

// Centrar automáticamente en JavaScript cuando esté listo
onInit(() => {
  setTimeout(() => {
    centerView()
  }, 100)
})
</script>

<template>
  <div class="roadmap-container">
    <!-- Menú flotante de progreso -->
    <FloatingProgressMenu 
      ref="floatingProgressRef"
    />

    <!-- Botón Reset Fijo -->
    <FixedResetButton />
    
    <!-- Botón de Centrar Vista -->
    <button @click="centerView" class="center-view-button" title="Centrar vista en JavaScript">
      🎯
    </button>
    
    <!-- Menú de Especialización (fuera del header para evitar limitaciones de z-index) -->
    <SpecializationMenu />

    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1 class="title">🗺️ Roadmap Interactivo de JavaScript & Vue.js <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="Vue.js" style="width: 40px; height: 40px; vertical-align: middle; margin-left: 10px;"></h1>
        <p class="subtitle">
          Tu guía paso a paso hacia el dominio del desarrollo frontend
        </p>
        <div class="creator-info">
          <div class="creator-links">
            <span class="creator-text">👨‍💻 Creador: FabianQ-S</span>
            <a href="https://github.com/FabianQ-S" target="_blank" rel="noopener noreferrer" class="github-link">
              🐙 GitHub Personal
            </a>
            <span class="separator">•</span>
            <a href="https://github.com/FabianQ-S/Roadmap-Interactivo-de-VITE-y-REACT" target="_blank" rel="noopener noreferrer" class="github-link">
              📚 Proyecto GitHub
            </a>
          </div>
        </div>
        <p class="progress-info">
          🎯 {{ userStore.userName || 'Desarrollador' }} • 
          📈 Progreso: {{ progressStore.progressStats.completed }}/{{ progressStore.progressStats.total }} nodos • 
          🔥 Dificultad por Colores • Sólido=Obligatorio • Punteado=Opcional
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Vue Flow Diagram -->
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :node-types="nodeTypes"
        @node-click="onNodeClick"
        :default-zoom="0.4"
        :min-zoom="0.05"
        :max-zoom="1.0"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :edges-updatable="false"
        :default-viewport="{ x: -280, y: -390, zoom: 0.8 }"
        class="vue-flow"
      >
        <Background pattern-color="#6272a4" :gap="20" />
      </VueFlow>
    </div>

    <!-- Nuevo Modal para nodos tecnológicos -->
    <TechNodeModal 
      v-if="selectedNode && isTechNode"
      :node="selectedNode"
      @close="closeModal"
    />

    <!-- Modal para nodos de fase (mantenido original) -->
    <div 
      v-if="selectedNode && isPhaseNode" 
      class="modal-overlay"
      @click="closeModal"
    ></div>

    <div 
      v-if="selectedNode && isPhaseNode" 
      class="modal-panel"
    >
      <h2 style="font-size: 24px; font-weight: bold; color: #f8f8f2; margin: 0 0 20px 0;">✨ {{ selectedNode?.data?.label }}</h2>
      
      <div style="margin-bottom: 20px;">
        <!-- Descripción básica -->
        <p style="font-size: 16px; line-height: 1.6; color: #f8f8f2; margin: 0 0 16px 0;">
          {{ selectedNode?.data?.description || 'Descripción de la fase seleccionada' }}
        </p>
        
        <!-- Descripción detallada -->
        <div v-if="selectedNode?.data?.detailedDescription" style="margin-bottom: 20px; padding: 16px; border-radius: 8px; background-color: rgba(139, 233, 253, 0.1); border: 1px solid rgba(139, 233, 253, 0.3);">
          <h3 style="font-size: 16px; font-weight: bold; color: #8be9fd; margin: 0 0 8px 0;">📚 Descripción Detallada</h3>
          <p style="font-size: 14px; line-height: 1.5; color: #f8f8f2; margin: 0;">
            {{ selectedNode.data.detailedDescription }}
          </p>
        </div>
        
        <!-- Tecnologías de la fase -->
        <div v-if="selectedNode?.data?.technologies" style="margin-bottom: 20px; padding: 16px; border-radius: 8px; background-color: rgba(189, 147, 249, 0.1); border: 1px solid rgba(189, 147, 249, 0.3);">
          <h3 style="font-size: 16px; font-weight: bold; color: #bd93f9; margin: 0 0 8px 0;">🛠️ Tecnologías Principales</h3>
          <ul style="color: #f8f8f2; margin: 0; padding-left: 20px;">
            <li v-for="tech in selectedNode.data.technologies" :key="tech" style="margin-bottom: 4px;">{{ tech }}</li>
          </ul>
        </div>
        
        <!-- Importancia -->
        <div v-if="selectedNode?.data?.importance" style="margin-bottom: 20px; padding: 16px; border-radius: 8px; background-color: rgba(80, 250, 123, 0.1); border: 1px solid #50fa7b;">
          <h3 style="font-size: 16px; font-weight: bold; color: #50fa7b; margin: 0 0 8px 0;">💡 ¿Por qué es importante?</h3>
          <p style="font-size: 14px; line-height: 1.5; color: #f8f8f2; margin: 0;">
            {{ selectedNode.data.importance }}
          </p>
        </div>
        
        <!-- Información de deployment & hosting -->
        <div style="margin-top: 20px; padding: 16px; border-radius: 8px; background-color: rgba(255, 184, 108, 0.1); border: 1px solid #ffb86c;">
          <h3 style="font-size: 16px; font-weight: bold; color: #ffb86c; margin: 0 0 8px 0;">🚀 Deployment & Hosting</h3>
          <p style="font-size: 14px; line-height: 1.5; color: #f8f8f2; margin: 0;">
            {{ getDeploymentRecommendations(selectedNode?.id || '') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container principal */
.roadmap-container {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #282a36 0%, #44475a 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Header */
.header {
  background: rgba(40, 42, 54, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #6272a4;
  padding: 20px 24px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #f8f8f2;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.subtitle {
  font-size: 18px;
  color: #8be9fd;
  margin: 0 0 12px 0;
  font-style: italic;
  text-align: center;
}

.progress-info {
  font-size: 14px;
  color: #f8f8f2;
  margin: 0;
  opacity: 0.8;
  text-align: center;
}

.creator-info {
  margin: 8px 0;
  padding: 8px 16px;
  background: rgba(189, 147, 249, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(189, 147, 249, 0.3);
}

.creator-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.creator-text {
  font-size: 14px;
  color: #bd93f9;
  font-weight: 600;
}

.github-link {
  font-size: 14px;
  color: #8be9fd;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.github-link:hover {
  background: rgba(139, 233, 253, 0.1);
  border-color: rgba(139, 233, 253, 0.3);
  transform: translateY(-1px);
}

.separator {
  color: #6272a4;
  font-size: 12px;
}

/* Main content */
.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.vue-flow {
  height: 100%;
  width: 100%;
}

/* Modal overlay for phase nodes */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* Panel central modal */
.modal-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: linear-gradient(135deg, #44475a 0%, #282a36 100%);
  border: 2px solid #bd93f9;
  border-radius: 20px;
  padding: 32px;
  z-index: 1001;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

/* Panel lateral derecho - 25% de la pantalla */
.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 25%;
  height: 100vh;
  background: linear-gradient(135deg, #44475a 0%, #282a36 100%);
  border-left: 2px solid #50fa7b;
  border-radius: 20px 0 0 20px;
  padding: 24px;
  z-index: 1001;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

/* Backdrop for sidebar */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 25%;
  bottom: 0;
  background: transparent;
  z-index: 1000;
}

/* Vue Flow custom styles */
:deep(.vue-flow__background) {
  background: #282a36;
}

:deep(.vue-flow__controls) {
  background: rgba(40, 42, 54, 0.9);
  border: 1px solid #6272a4;
  border-radius: 8px;
}

/* Eliminar posibles bordes azules específicos */
:deep(.vue-flow__pane) {
  border-left: none !important;
}

:deep(.vue-flow__renderer) {
  border-left: none !important;
}

:deep(.vue-flow__controls button) {
  background: transparent;
  border: none;
  color: #f8f8f2;
  font-size: 16px;
}

:deep(.vue-flow__controls button:hover) {
  background: rgba(98, 114, 164, 0.2);
}

/* Botón de centrar vista */
.center-view-button {
  position: fixed;
  bottom: 140px;
  right: 80px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #8be9fd;
  background: rgba(40, 42, 54, 0.95);
  color: #8be9fd;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-view-button:hover {
  background: rgba(139, 233, 253, 0.2);
  border-color: #50fa7b;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(139, 233, 253, 0.4);
}

/* Responsive design */
@media (max-width: 1024px) {
  .sidebar-panel {
    width: 30%;
  }
  
  .sidebar-backdrop {
    right: 30%;
  }
}

@media (max-width: 768px) {
  .sidebar-panel {
    width: 100%;
    left: 0;
    right: 0;
  }
  
  .sidebar-backdrop {
    display: none;
  }
  
  .modal-panel {
    width: 95%;
    padding: 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 12px;
  }
}
</style>

<!-- Fix específico para borde azul sin afectar el roadmap -->
<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  overflow-x: hidden;
}

/* Solo eliminar bordes azules específicos de VueFlow */
.vue-flow {
  border: none !important;
  outline: none !important;
}
</style>
