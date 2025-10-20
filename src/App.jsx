import { useState } from "react";
import { motion } from "framer-motion";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "./firebase";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    estado: "",
    musica: "",
    lugar: "",
    clima: "",
    estilo: "",
    motivacion: "",
  });

  const db = getDatabase(app);

  const handleRegister = () => {
    if (!formData.nombre || !formData.correo) {
      alert("Por favor completa al menos nombre y correo");
      return;
    }
    setShowSurvey(true);
  };

  const handleSurveySubmit = () => {
    const usuariosRef = ref(db, "usuarios");
    push(usuariosRef, {
      ...formData,
      foto: photo ? photo.name : "Sin foto",
    });
    alert("🎉 Registro completado con éxito");
    setShowSurvey(false);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
      <motion.h1
        className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Alto Match
      </motion.h1>

      {!showForm && !showSurvey && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-300 transition"
        >
          Registrarse
        </motion.button>
      )}

      {/* FORMULARIO DE REGISTRO */}
      {showForm && !showSurvey && (
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
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="Tu nombre"
          />

          <label className="block mb-2 text-yellow-400 font-medium">
            Correo electrónico:
          </label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="tucorreo@email.com"
          />

          <label className="block mb-2 text-yellow-400 font-medium">
            Estado:
          </label>
          <select
            value={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
            className="w-full p-2 mb-4 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona tu estado</option>
            <option value="libre">Libre</option>
            <option value="comprometido">Comprometido</option>
            <option value="buscando">Buscando algo</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">
            Foto (opcional):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-white mb-4"
          />

          <button
            type="button"
            onClick={handleRegister}
            className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 transition w-full"
          >
            Continuar ➡️
          </button>
        </motion.form>
      )}

      {/* ENCUESTA DE AFINIDADES */}
      {showSurvey && (
        <motion.div
          className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
            Conocerte mejor 💛
          </h2>

          <label className="block mb-2 text-yellow-400 font-medium">
            Tipo de música favorita:
          </label>
          <select
            value={formData.musica}
            onChange={(e) =>
              setFormData({ ...formData, musica: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Rock</option>
            <option>Pop</option>
            <option>Reggaetón</option>
            <option>Electrónica</option>
            <option>Jazz</option>
            <option>Clásica</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">
            Lugar favorito:
          </label>
          <select
            value={formData.lugar}
            onChange={(e) =>
              setFormData({ ...formData, lugar: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Playa</option>
            <option>Montaña</option>
            <option>Campo</option>
            <option>Ciudad</option>
            <option>Bosque</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">
            Clima preferido:
          </label>
          <select
            value={formData.clima}
            onChange={(e) =>
              setFormData({ ...formData, clima: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Frío</option>
            <option>Calor</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">
            Estilo social:
          </label>
          <select
            value={formData.estilo}
            onChange={(e) =>
              setFormData({ ...formData, estilo: e.target.value })
            }
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Extrovertido</option>
            <option>Introvertido</option>
            <option>Equilibrado</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">
            ¿Qué te motiva en este momento?
          </label>
          <select
            value={formData.motivacion}
            onChange={(e) =>
              setFormData({ ...formData, motivacion: e.target.value })
            }
            className="w-full p-2 mb-4 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Nuevos proyectos</option>
            <option>Amistades</option>
            <option>Inspiración</option>
            <option>Relaciones</option>
          </select>

          <button
            onClick={handleSurveySubmit}
            className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 transition w-full"
          >
            Finalizar registro 🎉
          </button>
        </motion.div>
      )}
    </div>
  );
}











