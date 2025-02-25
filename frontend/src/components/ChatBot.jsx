import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 📌 Función para enviar mensajes al chatbot
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true); // 📌 Muestra el indicador de carga

    try {
      const response = await axios.post("http://localhost:3100/chatbot", {
        message: input,
      });

      const data = response.data;
      const botMessages = [];

      if (typeof data === "object" && data !== null) {
        // 📌 Caso: Respuesta simple
        if (data.response) {
          botMessages.push({ sender: "bot", text: data.response });
        }

        // 📌 Caso: Si hay datos estructurados
        if (data.datos && Array.isArray(data.datos)) {
          data.datos.forEach((mov) => {
            botMessages.push({
              sender: "bot",
              text: `Movimiento #${mov.id}\nUsuario: ${mov.usuario}\nFecha: ${mov.fecha}`,
            });

            mov.detalles.forEach((detalle) => {
              botMessages.push({
                sender: "bot",
                text: `Concepto: ${detalle.concepto}\nImporte: ${detalle.importe}\nFecha Operación: ${detalle.fechaOperacion}`,
              });
            });
          });
        }
      } else {
        botMessages.push({ sender: "bot", text: "Respuesta no válida." });
      }

      setMessages([...newMessages, ...botMessages]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error en el servidor." }], error);
    } finally {
      setLoading(false); // 📌 Oculta el indicador de carga
    }
  };

  // 📌 Autoscroll al final del chat cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* 📌 Botón flotante para abrir/cerrar el chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
      </button>

      {/* 📌 Contenedor del chat */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg mt-3 flex flex-col">
          {/* 📌 Header del chat */}
          <div className="bg-blue-600 text-white p-3 text-center font-semibold rounded-t-lg">
            Chatbot AI
          </div>

          {/* 📌 Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 max-w-xs ${
                  msg.sender === "user" ? "bg-blue-500 text-white self-end rounded-l-lg" : "bg-gray-200 text-gray-900 self-start rounded-r-lg"
                } whitespace-pre-wrap`}
              >
                {msg.text}
              </div>
            ))}

            {/* 📌 Indicador de carga */}
            {loading && (
              <div className="p-2 max-w-xs bg-gray-300 text-gray-700 self-start rounded-r-lg">
                Pensando...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 📌 Input y botón de enviar */}
          <div className="p-3 flex border-t">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-lg outline-none"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
