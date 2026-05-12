export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },

        body: JSON.stringify({

          model: "qwen/qwen3-32b:free",

          messages: [
            {
              role: "system",
              content: "คุณคือผู้ช่วย AI ภาษาไทย"
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const aiReply =
      data.choices?.[0]?.message?.content ||
      "เกิดข้อผิดพลาด";

    res.status(200).json({
      reply: aiReply
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}