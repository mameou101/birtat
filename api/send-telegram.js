export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    // Get the bot token from Vercel Environment Variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // Your Telegram chat ID
    const chatId = "7090048683";

    if (!botToken) {
      return res.status(500).json({
        error: "TELEGRAM_BOT_TOKEN is not configured"
      });
    }

    const {
      orderNumber,
      customerName,
      phone,
      service,
      fileName,
      fileUrl,
      pages,
      copies,
      colorMode,
      price,
      delivery,
      blockNumber,
      houseNumber
    } = req.body || {};

    const message = `
🖨️ NEW BIRTAT ORDER

📋 Order: ${orderNumber || "-"}

👤 Customer: ${customerName || "-"}
📱 Phone: ${phone || "-"}

🖨️ Service: ${service || "-"}
📄 File: ${fileName || "No file"}

📑 Pages: ${pages || "-"}
📚 Copies: ${copies || "-"}
🎨 Color: ${colorMode || "-"}

💰 Price: ${price || "-"}

🚚 Delivery: ${delivery || "-"}
🏠 Block: ${blockNumber || "-"}
🏠 House: ${houseNumber || "-"}

${fileUrl ? `📎 File:\n${fileUrl}` : ""}
`;

    // Send message through Telegram Bot API
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramData = await telegramResponse.json();

    // Telegram rejected the request
    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram API error:", telegramData);

      return res.status(500).json({
        error: "Telegram notification failed",
        telegram: telegramData
      });
    }

    // Everything worked
    return res.status(200).json({
      success: true,
      message: "Telegram notification sent"
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
