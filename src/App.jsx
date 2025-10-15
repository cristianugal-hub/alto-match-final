import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [photo, setPhoto] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
      <motion.h1
        className="text-6xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Alto Match
     <motion.h1
  className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  Alto Match
</motion.h1>


      {!showForm ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-300 transition"
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
            className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 transition w-full"
          >
            Enviar
          </button>
        </motion.form>
      )}
    </div>
  );
}
