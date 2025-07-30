require('dotenv').config(); // Load env vars
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post('/talk', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Missing message in request." });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage?key=${process.env.API_KEY}`,
            {
                prompt: {
                    messages: [
                        { author: 'user', content: userMessage }
                    ]
                }
            }
        );

        const reply = response.data.candidates?.[0]?.content || "I got nothing to say, bruh.";
        res.json({ reply });
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'API request failed. ' + err.message });
    }
});

app.get('/', (req, res) => {
    res.send('🟢 NPC Chat Proxy is Live, bruv!');
});

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});
