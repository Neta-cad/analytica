export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, system } = req.body

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: system + '\n\n' +
              messages.map(m => `${m.role}: ${m.content}`).join('\n')
            }]
          }],
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    )

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, try again.'
    res.status(200).json({ reply })

  } catch (error) {
    res.status(500).json({ error: 'AI service error' })
  }
}