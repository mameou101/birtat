export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
    } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = "7090048683";

    if (!botToken) {
      return res.status(500).json({
        error: "TELEGRAM_BOT_TOKEN is not configured"
      });
    }

    const message = `
🖨️ NEW BIRTAT ORDER

📋 Order: ${orderNumber}

👤 Customer: ${customerName}
📱 Phone: ${phone}

🖨️ Service: ${service}
📄 File: ${fileName || "No file"}

📑 Pages: ${pages}
📚 Copies: ${copies}
🎨 Color: ${colorMode}

💰 Price: ${price}

🚚 Delivery: ${delivery}
🏠 Block: ${blockNumber || "-"}
🏠 House: ${houseNumber || "-"}

${fileUrl ? `📎 File: ${fileUrl}` : ""}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${8658293089:AAE2GpM8WMDKWkAh6avt3-ggt4cEidJVM30}/sendMessage`,
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

    if (!telegramResponse.ok) {
      console.error("Telegram error:", telegramData);

      return res.status(500).json({
        error: "Telegram notification failed"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
