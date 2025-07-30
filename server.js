require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post('/', async (req, res) => {
	const userMessage = req.body.message;

	if (!userMessage) {
		return res.status(400).json({ error: "Missing message in request." });
	}

	console.log("💬 Player said:", userMessage);

	try {
		const response = await axios.post(
			`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.API_KEY}`,
			{
				contents: [
					{
						role: "user",
						parts: [{ text: userMessage }]
					}
				]
			},
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I got nothin’ to say, bruh.";
		console.log("🧠 AI says:", reply);
		res.json({ reply });
	} catch (err) {
		console.error("🔥 GOOGLE API ERROR:", err.response?.data || err.message);
		res.status(500).json({
			error: 'AI request failed: ' + (err.response?.data?.error?.message || err.message)
		});
	}
});

app.get('/', (req, res) => {
	res.send('🟢 NPC Chat Proxy is Live, gang!');
});

app.listen(PORT, () => {
	console.log(`🔥 Server running on port ${PORT}`);
});
