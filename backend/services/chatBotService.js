import OpenAI from "openai";
import prisma from "../data/prisma.js";
 
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});
 
// 🔹 Diccionario de meses para detección en preguntas
const meses = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
};
 
// 🔹 Función para procesar la consulta
export async function getDeepSeekResponse(message) {
    try {
        const lowerMessage = message.toLowerCase();
 
        // 📌 **Caso 1: Consulta de Movimientos por Mes**
        const matchMes = Object.keys(meses).find(m => lowerMessage.includes(m));
        if (matchMes) {
            const mes = meses[matchMes];
            const año = new Date().getFullYear(); // Tomamos el año actual si no se menciona
 
            const movimientosMes = await prisma.movimientosCuenta.findMany({
                where: {
                    createdAt: {
                        gte: new Date(año, mes - 1, 1), // Inicio del mes
                        lte: new Date(año, mes, 0) // Fin del mes
                    }
                },
                include: { detalles: true, usuario: { select: { nombre: true } } }
            });
 
            if (movimientosMes.length === 0) return { response: `No se encontraron movimientos en ${matchMes} de ${año}.` };
 
            return {
                response: `Aquí están los movimientos registrados en ${matchMes} de ${año}.`,
                datos: movimientosMes.map(mov => ({
                    id: mov.id,
                    usuario: mov.usuario.nombre,
                    fecha: mov.createdAt.toISOString().split("T")[0],
                    detalles: mov.detalles.map(detalle => ({
                        concepto: detalle.concepto,
                        importe: `$${detalle.importe.toFixed(2)}`,
                        fechaOperacion: detalle.fechaOperacion.toISOString().split("T")[0]
                    }))
                }))
            };
        }
 
        // 📌 **Caso 2: Búsqueda de transacciones por importe**
        const matchImporte = lowerMessage.match(/mayores a (\d+)/);
        if (matchImporte) {
            const importeMinimo = parseFloat(matchImporte[1]);
 
            const movimientosFiltrados = await prisma.movimientosCuenta.findMany({
                where: { detalles: { some: { importe: { gte: importeMinimo } } } },
                include: { detalles: true, usuario: { select: { nombre: true } } }
            });
 
            if (movimientosFiltrados.length === 0) return { response: `No hay movimientos mayores a $${importeMinimo}.` };
 
            return {
                response: `Aquí están los movimientos mayores a $${importeMinimo}.`,
                datos: movimientosFiltrados.map(mov => ({
                    id: mov.id,
                    usuario: mov.usuario.nombre,
                    fecha: mov.createdAt.toISOString().split("T")[0],
                    detalles: mov.detalles.map(detalle => ({
                        concepto: detalle.concepto,
                        importe: `$${detalle.importe.toFixed(2)}`,
                        fechaOperacion: detalle.fechaOperacion.toISOString().split("T")[0]
                    }))
                }))
            };
        }
 
        // 📌 **Caso 3: Consulta General (DeepSeek) con respuestas cortas**
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Responde en un máximo de 30 palabras." },
                { role: "user", content: message }
            ],
            model: "deepseek-chat",
            max_tokens: 50, // 🔹 Reducimos el tamaño de la respuesta
        });
 
        return { response: completion.choices[0].message.content };
    } catch (error) {
        console.error("Error en el chatbot:", error);
        return { response: "Hubo un error al procesar tu solicitud." };
    }
}