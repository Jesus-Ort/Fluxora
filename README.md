# Fluxora

> Gestión financiera personal para controlar ingresos, gastos y objetivos de ahorro de forma sencilla.

**Fluxora** es una aplicación web de finanzas personales diseñada para ayudarte a entender mejor cómo utilizas tu dinero. Permite registrar ingresos y gastos, organizar movimientos mediante categorías y establecer una regla de ahorro para conocer cuánto dinero puedes gastar de forma segura.

🚧 **Estado:** En desarrollo

## Demo

**Aplicación:** [fluxora-app.vercel.app](https://fluxora-app.vercel.app/?utm_source=chatgpt.com)

---

## Características

* 🔐 Autenticación de usuarios.
* 💰 Registro de ingresos y gastos.
* 🗂️ Gestión de categorías.
* 📊 Dashboard financiero.
* 📈 Resumen mensual de ingresos y gastos.
* 💵 Cálculo del balance disponible.
* 🎯 Configuración de porcentaje de ahorro.
* 🧮 Cálculo del dinero disponible después del ahorro.
* 📊 Análisis del comportamiento financiero mensual.
* ⚠️ Indicadores de riesgo financiero.
* 🧾 Historial de transacciones recientes.
* 🔎 Filtrado de información.
* 🌙 Interfaz con soporte para diferentes temas.
* 📱 Interfaz adaptable a diferentes tamaños de pantalla.
* 🔒 Separación de datos por usuario.

---

## ¿Cómo funciona?

Fluxora parte de una idea sencilla:

> **No basta con saber cuánto dinero tienes; necesitas saber cuánto puedes gastar.**

La aplicación utiliza los ingresos registrados, los gastos y un porcentaje de ahorro definido por el usuario para proporcionar una visión más clara de su situación financiera.

El dashboard permite visualizar:

```text
Ingresos
   │
   ├── Gastos
   │
   ├── Ahorro objetivo
   │
   └── Dinero disponible
            │
            ▼
      Estado financiero
```

De esta manera, Fluxora no busca convertirse en un sistema contable complejo, sino en una herramienta sencilla para tomar mejores decisiones sobre el dinero cotidiano.

---

## Arquitectura

Fluxora utiliza una arquitectura desacoplada de frontend y backend:

```text
┌─────────────────────────────┐
│           Usuario           │
│          Navegador          │
└──────────────┬──────────────┘
               │
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│       Nuxt + Vue 3          │
│          Frontend           │
│                             │
│  • Dashboard                │
│  • Auth                     │
│  • Categories               │
│  • Transactions             │
└──────────────┬──────────────┘
               │
               │ Axios
               │ Bearer Token
               ▼
┌─────────────────────────────┐
│       Express 5 API         │
│          Backend            │
│                             │
│  • Authentication           │
│  • Authorization            │
│  • Business logic           │
│  • REST endpoints            │
└──────────────┬──────────────┘
               │
               │ Supabase SDK
               ▼
┌─────────────────────────────┐
│          Supabase           │
│                             │
│  PostgreSQL + Auth          │
│  Row Level Security         │
└─────────────────────────────┘
```

### Flujo de autenticación

```text
Usuario
   │
   ▼
Login / Register
   │
   ▼
Express API
   │
   ▼
Supabase Auth
   │
   ├── Access Token
   └── Refresh Token
          │
          ▼
      Frontend
          │
          ▼
  Requests autenticadas
          │
          ▼
    Express Middleware
          │
          ▼
     API protegida
```

---

## Stack tecnológico

### Frontend

| Tecnología                                   | Uso                        |
| -------------------------------------------- | -------------------------- |
| [Nuxt](https://nuxt.com/)                    | Framework principal        |
| [Vue.js](https://vuejs.org/)                 | Construcción de interfaces |
| [Nuxt UI](https://ui.nuxt.com/)              | Componentes de interfaz    |
| [Tailwind CSS](https://tailwindcss.com/)     | Estilos                    |
| [Axios](https://axios-http.com/)             | Comunicación con la API    |
| [VueUse](https://vueuse.org/)                | Composables y utilidades   |
| [Yup](https://github.com/jquense/yup)        | Validación de formularios  |
| [TanStack Table](https://tanstack.com/table) | Tablas de datos            |

### Backend

| Tecnología                                   | Uso                              |
| -------------------------------------------- | -------------------------------- |
| [Node.js](https://nodejs.org/)               | Runtime                          |
| [Express](https://expressjs.com/)            | API REST                         |
| [Supabase JS](https://supabase.com/)         | Acceso a Supabase                |
| [dotenv](https://github.com/motdotla/dotenv) | Variables de entorno             |
| [CORS](https://github.com/expressjs/cors)    | Control de acceso entre orígenes |
| [Nodemon](https://nodemon.io/)               | Desarrollo                       |

### Base de datos y autenticación

* PostgreSQL mediante Supabase.
* Supabase Auth.
* Row Level Security (RLS).
* Relaciones entre usuarios, categorías y transacciones.
* Vistas SQL para cálculos y análisis financieros.

### Deployment

* Frontend: Vercel.
* Backend: Render.
* Base de datos: Supabase.

---

## Modelo de datos

Las principales entidades de Fluxora son:

```text
┌──────────────┐
│   profiles   │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│  categories  │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│ transactions │
└──────────────┘
```

### Profiles

Contiene información asociada al usuario autenticado.

Entre sus datos se encuentran:

* Identificador del usuario.
* Nombre completo.
* Rol.
* Porcentaje de ahorro.
* Estado de actividad.

### Categories

Permite clasificar los movimientos financieros.

Una categoría pertenece a un usuario y puede representar:

* Ingreso.
* Gasto.

### Transactions

Representa cada movimiento financiero registrado por el usuario.

Incluye información como:

* Usuario.
* Categoría.
* Monto.
* Descripción.
* Fecha.
* Estado.

---

## Análisis financiero

Fluxora utiliza vistas de PostgreSQL para generar información derivada y evitar trasladar toda la lógica de cálculo al frontend.

Entre los análisis disponibles se encuentran:

### Balance

Permite obtener:

* Total de ingresos.
* Total de gastos.
* Balance disponible.

### Resumen mensual

Permite analizar los movimientos financieros agrupados por mes.

### Análisis de ahorro

Compara el comportamiento financiero con el porcentaje de ahorro establecido por el usuario.

### Análisis de riesgo

Fluxora clasifica la situación financiera mensual en diferentes estados:

```text
NO_INCOME
    │
    ├── No existen ingresos registrados.
    │
ON_TRACK
    │
    ├── El usuario cumple su objetivo de ahorro.
    │
BELOW_TARGET
    │
    ├── El ahorro está por debajo del objetivo.
    │
CRITICAL
    │
    └── La situación financiera requiere atención.
```

### Gastos por categoría

Permite identificar dónde se concentra el gasto del usuario.

---

## Estructura del proyecto

```text
Fluxora/
│
├── Backend/
│   ├── src/
│   │   ├── ...
│   │   └── app.js
│   │
│   ├── package.json
│   └── ...
│
├── Frontend/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   ├── types/
│   ├── app.vue
│   ├── nuxt.config.ts
│   └── package.json
│
└── README.md
```

---

## Requisitos

Antes de comenzar necesitas tener instalado:

* Node.js
* npm
* Una cuenta de Supabase
* Una base de datos PostgreSQL mediante Supabase

Puedes comprobar tu versión de Node.js con:

```bash
node --version
```

y npm con:

```bash
npm --version
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/Jesus-Ort/Fluxora.git
```

Entrar al proyecto:

```bash
cd Fluxora
```

---

## 2. Configurar el Backend

```bash
cd Backend
npm install
```

Crea un archivo `.env` dentro de `Backend/`.

Ejemplo:

```env
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

> No subas las credenciales reales al repositorio.

Inicia el servidor en desarrollo:

```bash
npm run dev
```

Para ejecutar el servidor normalmente:

```bash
npm start
```

---

## 3. Configurar el Frontend

Desde la raíz del proyecto:

```bash
cd Frontend
npm install
```

Configura las variables de entorno necesarias para conectar el frontend con la API.

Ejemplo:

```env
NUXT_PUBLIC_API_URL=http://localhost:3000
```

Inicia Nuxt:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

> Si el backend utiliza el mismo puerto durante el desarrollo, configura el frontend y backend con puertos diferentes.

---

# Scripts

## Frontend

Desde `Frontend/`:

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera la aplicación para producción.

```bash
npm run generate
```

Genera la aplicación estática.

```bash
npm run preview
```

Previsualiza la build de producción.

---

## Backend

Desde `Backend/`:

```bash
npm run dev
```

Inicia el servidor utilizando Nodemon.

```bash
npm start
```

Inicia el servidor en modo normal.

---

# Seguridad

Fluxora utiliza varias capas para proteger la información de los usuarios.

### Autenticación

La autenticación se gestiona mediante Supabase Auth.

El backend trabaja con tokens JWT proporcionados por Supabase.

### Middleware de autorización

Las rutas protegidas utilizan middleware para verificar el token enviado mediante:

```http
Authorization: Bearer <access_token>
```

### Separación de usuarios

Las operaciones relacionadas con información financiera están asociadas al usuario autenticado.

Esto permite evitar que un usuario pueda acceder directamente a los datos pertenecientes a otro usuario.

### Variables de entorno

Las credenciales y configuraciones sensibles no deben almacenarse directamente en el código fuente.

---

# API

El backend expone una API REST utilizada por el frontend.

Entre los principales módulos se encuentran:

```text
/api/v1/auth
    ├── register
    ├── login
    ├── logout
    └── refresh

/api/v1/...
    ├── categories
    ├── transactions
    └── ...
```

La autenticación utiliza tokens JWT para proteger los recursos privados.

---

# Desarrollo

Fluxora fue desarrollado con una separación clara de responsabilidades:

```text
Frontend
   │
   │ HTTP
   ▼
Backend
   │
   │ Supabase SDK
   ▼
Database
```

Esta separación permite:

* Mantener el frontend independiente de la base de datos.
* Centralizar la lógica de negocio en el backend.
* Proteger el acceso a Supabase.
* Facilitar el mantenimiento.
* Permitir cambiar o ampliar el frontend sin modificar la arquitectura principal del backend.

---

# Roadmap

Fluxora continúa en desarrollo.

Algunas mejoras previstas pueden incluir:

* [ ] Mejoras en el dashboard.
* [ ] Más análisis financieros.
* [ ] Gráficos históricos.
* [ ] Filtros avanzados de transacciones.
* [ ] Exportación de información.
* [ ] Transacciones recurrentes.
* [ ] Presupuestos.
* [ ] Metas de ahorro.
* [ ] Mejoras de experiencia móvil.
* [ ] Mejoras de rendimiento.
* [ ] Cobertura de pruebas automatizadas.
* [ ] Documentación completa de la API.

---

# Estado del proyecto

Fluxora es actualmente un proyecto en desarrollo utilizado para explorar y aplicar conceptos de:

* Desarrollo web full-stack.
* Arquitectura frontend/backend.
* APIs REST.
* Autenticación basada en JWT.
* PostgreSQL.
* Supabase.
* Seguridad mediante RLS.
* Diseño de interfaces.
* Gestión de estado y datos.
* Análisis financiero mediante SQL.
* Deployment de aplicaciones web.

---

# Autor

**Jesus Ort**

Ingeniero Informático orientado al desarrollo de aplicaciones web y sistemas full-stack.

GitHub: [@Jesus-Ort](https://github.com/Jesus-Ort?utm_source=chatgpt.com)

---

## Licencia

Este proyecto está bajo la licencia MIT.

---

> **Fluxora — entiende tu dinero antes de gastarlo.**
