import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

export default function App() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Leer mensajes de Firebase
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      } else {
        setMessages([]);
      }
    });
  }, []);

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

  if (!showChat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={logoUrl}
            alt="Logo Alto Match"
            className="w-40 h-auto mb-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.h1
            className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Alto Match
          </motion.h1>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-left max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">
              Registro
            </h2>

            <label className="block mb-2 text-yellow-400 font-medium">Nombre:</label>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:opacity-90 transition w-full"
            >
              Ir al chat 💬
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pantalla de chat
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-yellow-400 px-4">
      <motion.div
        className="bg-gray-800 p-4 rounded-2xl shadow-lg text-left w-full max-w-md flex flex-col h-[80vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-yellow-400">Chat en vivo ✨</h2>
          <button
            onClick={() => setShowChat(false)}
            className="text-yellow-300 hover:text-yellow-100 text-sm"
          >
            ← Volver
          </button>
        </div>

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
    </div>
  );
}







