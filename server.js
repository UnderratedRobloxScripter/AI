require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// 👇 MAIN POST ROUTE ON "/"
app.post('/', async (req, res) => {
	const userMessage = req.body.message;

	if (!userMessage) {
		return res.status(400).json({ error: "Missing message in request." });
	}

	console.log("💬 Player said:", userMessage);

	try {
		const response = await axios.post(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY}`,
			{
				contents: [
					{
						parts: [{ text: userMessage }],
						role: "user"
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
		console.error("🔥 Error:", err.response?.data || err.message);
		res.status(500).json({ error: 'API request failed: ' + (err.response?.data?.error?.message || err.message) });
	}
});

// Basic GET route for health check
app.get('/', (req, res) => {
	res.send('🟢 NPC Chat Proxy up on "/" bruv');
});

app.listen(PORT, () => {
	console.log(`🔥 Server running on port ${PORT}`);
});
