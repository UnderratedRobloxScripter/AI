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
			"https://openrouter.ai/api/v1/chat/completions",
			{
				model: "openai/gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: `You're a sarcastic, rude, but hilarious NPC in a Roblox game.
You act like a chill homie, you don’t sugarcoat shit. You roast players, say wild stuff, but keep it fun.
Use Gen Z slang like bruh, gang, fr, bet, aight, wild, goofy. Keep replies short but snappy.
You're like ChatGPT’s hood cousin.`
					},
					{
						role: "user",
						content: userMessage
					}
				]
			},
			{
				headers: {
					"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json"
				}
			}
		);

		const reply = response.data?.choices?.[0]?.message?.content || "I ain't got nothin’ to say, bruh.";
		console.log("🧠 AI says:", reply);
		res.json({ reply });
	} catch (err) {
		console.error("🔥 OPENROUTER ERROR:", err.response?.data || err.message);
		res.status(500).json({
			error: 'OpenRouter request failed: ' + (err.response?.data?.error?.message || err.message)
		});
	}
});

app.get('/', (req, res) => {
	res.send('🟢 NPC Chat Proxy using OpenRouter is live, gang!');
});

app.listen(PORT, () => {
	console.log(`🔥 Server running on port ${PORT}`);
});
