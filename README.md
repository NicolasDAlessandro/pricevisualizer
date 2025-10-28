# Visualizador de Precios

Aplicación web moderna para **gestionar, visualizar y generar presupuestos** con distintos métodos de pago.  
Incluye funciones de autenticación, carga de productos, generación de PDFs, estadísticas y más.  

Construida con **React 19**, **Vite 7**, **TypeScript** y **TailwindCSS 4**.

---

## Tecnologías principales

| Tipo | Tecnología |
|------|-------------|
| **Framework Frontend** | [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/) |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Estilos** | [TailwindCSS 4](https://tailwindcss.com/) + [Flowbite](https://flowbite.com/docs/getting-started/react/) |
| **Animaciones** | [Framer Motion](https://www.framer.com/motion/) |
| **Gráficos / Reportes** | [Recharts](https://recharts.org/en-US/) |
| **PDF Generator** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **Exportación Excel** | [xlsx](https://www.npmjs.com/package/xlsx) |
| **Ruteo** | [React Router v6.30](https://reactrouter.com/en/main) |
| **Linting** | [ESLint 9 + TypeScript ESLint](https://eslint.org/) |

---

##  Características

- **Gestión de productos:** carga, actualización y visualización de listas de precios.  
-  **Carrito interactivo:** selección de productos y cantidades con subtotal dinámico.  
-  **Múltiples métodos de pago:** configurables desde el panel administrativo.  
-  **Generación de presupuestos:** permite crear presupuestos combinados o por producto.  
-  **Exportación PDF:** descarga automática con logo, garantías y formas de pago.  
-  **Estadísticas y reportes:** gráficos de ventas o presupuestos con *Recharts*.  
-  **Autenticación y roles:** control de acceso según tipo de usuario (`admin`, `gerente`, `vendedor`).  
-  **Diseño responsive y moderno:** con TailwindCSS + Flowbite.  

---


##  Instalación

Cloná este repositorio:

```bash
git clone https://github.com/NicolasDAlessandro/pricevisualizer.git
cd visualizador-precios
npm install
npm run dev
