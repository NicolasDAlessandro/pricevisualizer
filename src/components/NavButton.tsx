import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import logo from "../assets/LOGO.png";

const NavButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleClick = () => {
    
    setOpen(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3" onClick={() => handleClick()}>
          <img src={logo} className="h-16 w-auto" alt="Logo" />
        </Link>

        {/* Menú */}
        <ul className="flex space-x-8 font-medium items-center">
          {/* Visible para todos */}
          <li> 
            <Link 
                to="/budget-stats" 
                className="text-gray-900 hover:text-blue-700" 
                onClick={() => handleClick()} >
                Estadísticas 
             </Link> 
          </li>
          <li>
            <Link
              to="/products"
              className="text-gray-900 hover:text-blue-700"
              onClick={() => handleClick()}
            >
              Productos
            </Link>
          </li>

          {/* Solo admin */}
          {user?.role === "admin" && (
            <li>
              <Link
                to="/upload"
                className="text-gray-900 hover:text-blue-700"
                onClick={() => handleClick()}
              >
                Actualizar Productos
              </Link>
            </li>
          )}

          {/* Dropdown modificaciones */}
          {(user?.role === "admin" || user?.role === "gerente") && (
            <li className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                Modificaciones
                <svg
                  className={`w-2.5 h-2.5 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute z-10 mt-2 w-44 bg-white rounded-lg shadow-sm border">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/create-payment"
                        onClick={() => handleClick()}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Agregar Método
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/update-payment"
                        onClick={() => handleClick()}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Actualizar Método
                      </Link>
                    </li>
                    {user?.role === "admin" && (
                      <>
                        <li>
                          <Link
                            to="/register-seller"
                            onClick={() => handleClick()}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            Registrar Vendedor
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/register"
                            onClick={() => handleClick()}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            Registrar Usuario
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </li>
          )}

          {/* Presupuesto visible a todos */}
          <li>
            <Link
              to="/cart"
              className="text-gray-900 hover:text-blue-700"
              onClick={() => handleClick()}
            >
              Presupuesto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavButton;
