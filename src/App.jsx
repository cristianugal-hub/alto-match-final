import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { ref, push, onValue, set, update } from "firebase/database";

export default function App() {
  const [view, setView] = useState("register");
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    estado: "",
    musica: "",
    lugar: "",
    clima: "",
    estilo: "",
    motivacion: "",
  });

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const [showPeople, setShowPeople] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [likesGivenSet, setLikesGivenSet] = useState(new Set());
  const [likesReceivedCount, setLikesReceivedCount] = useState(0);

  const currentUser = useMemo(
    () => ({
      nombre:
        form.nombre ||
        localStorage.getItem("am_nombre") ||
        "Anónimo",
      correo:
        form.correo ||
        localStorage.getItem("am_correo") ||
        "",
    }),
    [form.nombre, form.correo]
  );

  const emailKey = (email) =>
    (email || "")
      .trim()
      .toLowerCase()
      .replace(/\./g, ",");

  useEffect(() => {
    if (view !== "chat") return;
    const messagesRef = ref(db, "messages");
    const unsub = onValue(messagesRef, (snap) => {
      const data = snap.val();
      setMessages(data ? Object.values(data) : []);
    });
    return () => unsub();
  }, [view]);

  useEffect(() => {
    if (view !== "chat") return;
    const usersRef = ref(db, "usuarios");
    const unsubUsers = onValue(usersRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.values(data).filter(
        (u) => u?.correo && emailKey(u.correo) !== emailKey(currentUser.correo)
      );
      setParticipants(list);
    });

    const givenRef = ref(db, `likesGiven/${emailKey(currentUser.correo)}`);
    const unsubGiven = onValue(givenRef, (snap) => {
      const data = snap.val() || {};
      setLikesGivenSet(new Set(Object.keys(data)));
    });

    const receivedRef = ref(db, `likesReceived/${emailKey(currentUser.correo)}`);
    const unsubReceived = onValue(receivedRef, (snap) => {
      const data = snap.val() || {};
      setLikesReceivedCount(Object.keys(data).length);
    });

    return () => {
      unsubUsers();
      unsubGiven();
      unsubReceived();
    };
  }, [view, currentUser.correo]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const messagesRef = ref(db, "messages");
    push(messagesRef, {
      text: newMsg.trim(),
      name: currentUser.nombre || "Anónimo",
      time: new Date().toLocaleTimeString(),
    });
    setNewMsg("");
  };

  const initials = (name) =>
    (name || "A")
      .trim()
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");

  const logoUrl = "/logo.png";

  const handleRegisterContinue = () => {
    if (!form.nombre.trim() || !form.correo.trim() || !form.estado) {
      alert("Por favor, completa nombre, correo y estado.");
      return;
    }
    setView("survey");
  };

  const handleSurveyFinish = () => {
    const usersRef = ref(db, "usuarios");
    push(usersRef, {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      estado: form.estado,
      musica: form.musica || "",
      lugar: form.lugar || "",
      clima: form.clima || "",
      estilo: form.estilo || "",
      motivacion: form.motivacion || "",
      foto: photo ? photo.name : null,
      fechaRegistro: new Date().toLocaleString(),
    });
    localStorage.setItem("am_nombre", form.nombre.trim());
    localStorage.setItem("am_correo", form.correo.trim());
    setView("chat");
  };

  const handleLike = (otherEmail) => {
    if (!currentUser.correo) {
      alert("Debes tener correo para dar me gusta.");
      return;
    }
    const fromKey = emailKey(currentUser.correo);
    const toKey = emailKey(otherEmail);
    if (!toKey) return;

    const updates = {};
    updates[`likesGiven/${fromKey}/${toKey}`] = true;
    updates[`likesReceived/${toKey}/${fromKey}`] = true;
    update(ref(db), updates);
  };

  const overlayRef = useRef(null);
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      setShowPeople(false);
    }
  };

  if (view === "register") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
        <motion.img
          src={logoUrl}
          alt="Logo Alto Match"
          className="w-40 h-auto mb-6"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.h1
          className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Alto Match
        </motion.h1>

        <motion.div
          className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">
            Registro
          </h2>

          <label className="block mb-2 text-yellow-400 font-medium">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="Tu nombre"
          />

          <label className="block mb-2 text-yellow-400 font-medium">Correo</label>
          <input
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="tucorreo@email.com"
          />

          <label className="block mb-2 text-yellow-400 font-medium">¿Cómo estás hoy?</label>
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            className="w-full p-2 mb-4 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona tu estado</option>
            <option value="Libre">Libre</option>
            <option value="Comprometido">Comprometido</option>
            <option value="Buscando algo">Buscando algo</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">Foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-white mb-4"
          />

          {photo && (
            <div className="mb-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Vista previa</p>
              <img
                src={URL.createObjectURL(photo)}
                alt="Vista previa"
                className="rounded-lg border border-gray-700 max-h-32 mx-auto"
              />
            </div>
          )}

          <button
            onClick={handleRegisterContinue}
            className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:opacity-90 transition w-full"
          >
            Continuar ➡️
          </button>
        </motion.div>
      </div>
    );
  }

  if (view === "survey") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
        <motion.div
          className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
            Conocerte mejor 💛
          </h2>

          <label className="block mb-2 text-yellow-400 font-medium">Tipo de música favorita</label>
          <select
            value={form.musica}
            onChange={(e) => setForm({ ...form, musica: e.target.value })}
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

          <label className="block mb-2 text-yellow-400 font-medium">Lugar favorito</label>
          <select
            value={form.lugar}
            onChange={(e) => setForm({ ...form, lugar: e.target.value })}
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Playa</option>
            <option>Montaña</option>
            <option>Campo</option>
            <option>Ciudad</option>
            <option>Bosque</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">Clima preferido</label>
          <select
            value={form.clima}
            onChange={(e) => setForm({ ...form, clima: e.target.value })}
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Frío</option>
            <option>Calor</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">Estilo social</label>
          <select
            value={form.estilo}
            onChange={(e) => setForm({ ...form, estilo: e.target.value })}
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Extrovertido</option>
            <option>Introvertido</option>
            <option>Equilibrado</option>
          </select>

          <label className="block mb-2 text-yellow-400 font-medium">¿Qué te motiva hoy?</label>
          <select
            value={form.motivacion}
            onChange={(e) => setForm({ ...form, motivacion: e.target.value })}
            className="w-full p-2 mb-4 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            <option value="">Selecciona</option>
            <option>Nuevos proyectos</option>
            <option>Amistades</option>
            <option>Inspiración</option>
            <option>Relaciones</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setView("register")}
              className="w-1/3 border border-yellow-600 text-yellow-400 rounded-full px-4 py-2 hover:bg-gray-700 transition"
            >
              ← Volver
            </button>
            <button
              onClick={handleSurveyFinish}
              className="w-2/3 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Finalizar registro 🎉
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400">
      <div className="w-full max-w-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-600/20 border border-yellow-600 flex items-center justify-center text-yellow-300 font-bold">
            {initials(currentUser.nombre)}
          </div>
          <div className="leading-tight">
            <div className="font-semibold flex items-center gap-2">
              {currentUser.nombre}
              {likesReceivedCount > 0 && (
                <span className="text-xs bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-2 py-0.5 rounded-full">
                  💛 {likesReceivedCount}
                </span>
              )}
            </div>
            <div className="text-xs text-yellow-300/70">{currentUser.correo}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPeople(true)}
            className="text-sm bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-3 py-1.5 rounded-full hover:bg-yellow-500/25 transition"
          >
            Participantes 💛
          </button>
          <button
            onClick={() => setView("register")}
            className="text-yellow-300 hover:text-yellow-100 text-sm"
          >
            Salir
          </button>
        </div>
      </div>

      <motion.div
        className="w-full max-w-md px-4 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {messages.length === 0 && (
          <div className="text-center text-yellow-300/70 py-10">
            Aún no hay mensajes. ¡Sé el primero en saludar! ✨
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            className="bg-gray-800/70 rounded-2xl border border-gray-700 p-3 mb-3"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-yellow-600/20 border border-yellow-600 flex items-center justify-center text-yellow-300 text-sm font-bold">
                {initials(m.name)}
              </div>
              <div className="font-semibold text-yellow-400">{m.name}</div>
              <div className="text-xs text-yellow-300/60 ml-auto">{m.time}</div>
            </div>
            <div className="text-gray-200">{m.text}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pb-6">
        <div className="w-full max-w-md px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-2 flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Escribe algo para la comunidad..."
              className="flex-1 bg-transparent text-white outline-none px-2"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPeople && (
          <motion.div
            ref={overlayRef}
            onMouseDown={onOverlayClick}
            className="fixed inset-0 bg-black/50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[88%] sm:w-[420px] h-full bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-yellow-400">Participantes</h3>
                <button
                  onClick={() => setShowPeople(false)}
                  className="text-yellow-300 hover:text-yellow-100 text-sm"
                >
                  Cerrar ✕
                </button>
              </div>

              {participants.length === 0 && (
                <div className="text-yellow-300/70 text-sm">Aún no hay participantes visibles.</div>
              )}

              <div className="space-y-3">
                {participants.map((p, idx) => {
                  const targetKey = emailKey(p.correo);
                  const liked = likesGivenSet.has(targetKey);
                  return (
                    <div
                      key={idx}
                      className="bg-gray-800/70 border border-gray-700 rounded-2xl p-3 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-600/20 border border-yellow-600 flex items-center justify-center text-yellow-300 font-bold">
                        {initials(p.nombre)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-300 leading-tight">
                          {p.nombre}
                        </div>
                        <div className="text-xs text-yellow-300/70">{p.estado || "—"}</div>
                      </div>
                      <button
                        onClick={() => handleLike(p.correo)}
                        className={`px-3 py-1.5 rounded-full border transition ${
                          liked
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                            : "bg-gray-800 border-gray-600 text-yellow-300 hover:border-yellow-500"
                        }`}
                        title={liked ? "Ya le diste me gusta" : "Dar me gusta"}
                      >
                        💛
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}













