export default async function handler(req, res) {
  // Only allow POST requests from the order page
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "This endpoint must be triggered by an order submission."
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
      houseNumber,
      notes
    } = req.body || {};

    // Basic validation
    if (!orderNumber || !customerName || !phone) {
      return res.status(400).json({
        error: "Missing required order information"
      });
    }

    const message = `
🖨️ NEW BIRTAT ORDER

📋 Order: ${orderNumber}

👤 Customer: ${customerName}
📱 Phone: ${phone}

🖨️ Service: ${service || "-"}
📄 File: ${fileName || "No file"}

📑 Pages: ${pages || "-"}
📚 Copies: ${copies || "-"}
🎨 Color: ${colorMode || "-"}

💰 Price: ${price || "-"}

🚚 Receive: ${delivery || "-"}

🏠 Block: ${blockNumber || "-"}
🏠 House: ${houseNumber || "-"}

📝 Notes:
${notes || "No additional notes"}

${fileUrl ? `📎 File:\n${fileUrl}` : ""}
`;

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

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram API error:", telegramData);

      return res.status(500).json({
        error: "Telegram notification failed"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Telegram notification sent"
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
