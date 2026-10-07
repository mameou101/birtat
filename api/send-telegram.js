export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = "7090048683";

    if (!botToken) {
      return res.status(500).json({
        error: "TELEGRAM_BOT_TOKEN is not configured"
      });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🔥 TEST MESSAGE\n\nBirtat Telegram connection is working!"
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      return res.status(500).json({
        error: "Telegram failed",
        telegram: telegramData
      });
    }

    return res.status(200).json({
      success: true,
      message: "Telegram test message sent!"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
