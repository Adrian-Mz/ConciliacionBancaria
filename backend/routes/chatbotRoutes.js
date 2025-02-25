import express from "express";
import { getDeepSeekResponse } from "../services/chatBotService.js"; // ✅ Ahora sí existe
 
const router = express.Router();
 
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "El mensaje es obligatorio." });
        }
 
        const response = await getDeepSeekResponse(message);
        res.json(response);
    } catch (error) {
        console.error("Error en la ruta del chatbot:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});
 
export default router;