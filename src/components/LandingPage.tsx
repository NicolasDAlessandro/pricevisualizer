import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; 
import landing1 from "../assets/landing1.png";
import landing2 from "../assets/landing2.png";
import landing3 from "../assets/landing3.png";

const fadeIn = (direction: "left" | "right" = "left") => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
});

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center items-center text-center pt-10 px-6 py-20 mb-20 gap-5">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          <span className="text-gray-350">Sistema de gestión de precios</span>
        </motion.h1>

        {/* 👇 Renderizado condicional del botón de login */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition"
            >
              Iniciar Sesión
            </Link>
          </motion.div>
        ) : (<></>)}
      </main>

      {/* Features */}
      <section id="features" className="py-24 space-y-32">
        {/* Feature 1 */}
        <motion.div
          variants={fadeIn("left")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 flex flex-row items-center justify-between gap-12"
        >
          {/* Imagen izquierda */}
          <div className="flex-1 flex justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900 w-full max-w-[500px] h-[22rem]">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <iframe
                src="https://www.gasloni.com.ar"
                title="Sitio web de la empresa"
                className="w-full h-[20rem] border-0"
                loading="lazy"
              ></iframe>
              <a
                href="https://www.gasloni.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 bg-transparent cursor-pointer"
              ></a>
            </div>
          </div>

          {/* Texto centrado */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center">
              Conocé nuestra empresa
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Visitá nuestro sitio oficial y descubrí más sobre los productos, servicios y valores que impulsan nuestra compañía.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          variants={fadeIn("right")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 flex flex-row-reverse items-center justify-between gap-20"
        >
          {/* Imagen derecha */}
          <div className="flex-1 flex justify-center">
            <div className="rounded-xl bg-gray-900 flex justify-center items-center overflow-hidden shadow-2xl w-full max-w-[550px] h-[22rem]">
              <img
                src={landing1}
                alt="Gestión de productos"
                className="object-contain h-full w-full p-4"
              />
            </div>
          </div>

          {/* Texto centrado */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center">
              Gestión de Productos
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Administra tu catálogo con precios y stock actualizado en todo momento.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          variants={fadeIn("left")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 flex flex-row items-center justify-between gap-12"
        >
          <div className="flex-1 flex justify-center">
            <div className="rounded-xl bg-gray-900 overflow-hidden shadow-2xl w-full max-w-[550px] h-[22rem]">
              <img
                src={landing2}
                alt="Carrito de compras"
                className="object-contain h-full w-full p-4"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center">
              Carrito de Compras
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Crea y gestiona carritos dinámicos para clientes con rapidez y facilidad.
            </p>
          </div>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          variants={fadeIn("right")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 flex flex-row-reverse items-center justify-between gap-20"
        >
          <div className="flex-1 flex justify-center">
            <div className="rounded-xl bg-gray-900 overflow-hidden shadow-2xl w-full max-w-[550px] h-[22rem]">
              <img
                src={landing3}
                alt="Presupuestos PDF"
                className="object-contain h-full w-full p-4"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center">
              Presupuestos Profesionales
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Genera y envía presupuestos claros y atractivos en PDF en segundos.
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} PriceVisualizer. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
