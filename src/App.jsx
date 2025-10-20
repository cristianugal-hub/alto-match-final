import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

export default function App() {
  const [step, setStep] = useState("intro");
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (step === "chat") {
      const messagesRef = ref(db, "messages");
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedMessages = Object.values(data);
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      });
    }
  }, [step]);

  // Enviar mensaje
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const messagesRef = ref(db, "messages");
    push(messagesRef, {
      text: newMessage,
      name: name || "Anónimo",
      time: new Date().toLocaleTimeString(),
    });
    setNewMessage("");
  };

  const logoUrl = "/logo.png";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
      {/* ----------- PANTALLA DE INTRODUCCIÓN ----------- */}
      {step === "intro" && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-48 h-48 mb-6 flex items-center justify-center"
            animate={{
              filter: [
                "drop-shadow(0 0 10px rgba(255,215,0,0.3))",
                "drop-shadow(0 0 25px rgba(255,215,0,0.7))",
                "drop-shadow(0 0 10px rgba(255,215,0,0.3))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={logoUrl}
              alt="Logo Alto Match"
              className="w-40 h-auto rounded-full object-contain"
            />
          </motion.div>

          <motion.h1
            className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            Alto Match
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep("register")}
            className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-8 py-3 rounded-full shadow-md hover:opacity-90 transition"
          >
            Comenzar
          </motion.button>
        </motion.div>
      )}

      {/* ----------- PANTALLA DE REGISTRO ----------- */}
      {step === "register" && (
        <motion.div
          className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">
            Registro
          </h2>

          <label className="block mb-2 text-yellow-400 font-medium">
            Nombre:
          </label>
          <input
            type="text"
            className="w-full p-2 mb-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setStep("chat")}
            className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:opacity-90 transition w-full"
          >
            Entrar al chat
          </motion.button>
        </motion.div>
      )}

      {/* ----------- PANTALLA DE CHAT ----------- */}
      {step === "chat" && (
        <motion.div
          className="bg-gray-800 p-4 rounded-2xl shadow-lg text-left w-full max-w-md flex flex-col h-[80vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">
            Chat en vivo ✨
          </h2>

          <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 p-3 rounded-lg border border-gray-700">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold text-yellow-400">{msg.name}: </span>
                <span className="text-gray-200">{msg.text}</span>
                <span className="text-gray-500 text-xs ml-2">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-bold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              ➤
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}




