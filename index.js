require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
// Menggunakan middleware express.static untuk folder public
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        const prompt = req.body.message;
        console.log("Pesan diterima:", prompt); // Cek apakah pesan masuk ke server

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        console.log("Respon dari Gemini sukses!"); // Log jika berhasil
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("--- ERROR DETAIL ---");
        // Cek jika error adalah karena kuota habis (429)
        if (error.status === 429 || error.message.includes("429")) {
            res.status(429).json({ 
                reply: "Duh, kuota gratis harian aku sudah habis nih. Kita ngobrol lagi besok ya, atau coba beberapa saat lagi! 🙏" 
            });
        } else {
            res.status(500).json({ 
                reply: "Maaf, ada gangguan teknis. Coba cek koneksi internetmu ya!" 
            });
    }
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));