import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [photo, setPhoto] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
      {showIntro ? (
        // PANTALLA INICIAL
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* LOGO */}
          <motion.img
            src="https://drive.google.com/uc?export=view&id=18f1_VZa0l_cooNt6RwGrS_TxTZetNV3t"
            alt="Logo Alto Match"
            className="w-40 h-auto mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
          />

          <motion.h1
            className="text-7xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            Alto Match
          </motion.h1>

          <motion.p
            className="text-gray-300 text-xl mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Bienvenido al encuentro que no termina ✨
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowIntro(false)}
            className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-8 py-3 rounded-full shadow-md hover:opacity-90 transition"
          >
            Entrar
          </motion.button>
        </motion.div>
      ) : (
        // PANTALLA PRINCIPAL
        <>
          <motion.h1
            className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Alto Match
          </motion.h1>

          <motion.p
            className="text-gray-300 text-xl mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            El encuentro no termina.
          </motion.p>

          {!showForm ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition"
            >
              Registrarse
            </motion.button>
          ) : (
            <motion.form
              className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <label className="block mb-2 text-yellow-400 font-medium">
                Nombre:
              </label>
              <input
                type="text"
                className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                placeholder="Tu nombre"
              />

              <label className="block mb-2 text-yellow-400 font-medium">
                Correo electrónico:
              </label>
              <input
                type="email"
                className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                placeholder="tucorreo@email.com"
              />

              <label className="block mb-2 text-yellow-400 font-medium">
                Empresa / Proyecto:
              </label>
              <input
                type="text"
                className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                placeholder="Nombre de empresa o proyecto"
              />

              <label className="block mb-2 text-yellow-400 font-medium">
                Foto (opcional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-full text-white mb-4"
              />

              {photo && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Vista previa:</p>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Vista previa"
                    className="rounded-lg border border-gray-700 max-h-40 mx-auto"
                  />
                </div>
              )}

              <label className="block mb-2 text-yellow-400 font-medium">
                ¿Cómo estás hoy?
              </label>
              <select className="w-full p-2 mb-4 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400">
                <option value="">Selecciona tu estado</option>
                <option value="libre">Libre</option>
                <option value="comprometido">Comprometido</option>
                <option value="buscando">Buscando algo</option>
              </select>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mt-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-4 py-2 rounded-full hover:opacity-90 transition w-full"
              >
                Enviar
              </button>
            </motion.form>
          )}
        </>
      )}
    </div>
  );
}


