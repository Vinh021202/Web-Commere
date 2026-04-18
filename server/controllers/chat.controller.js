import mongoose from "mongoose";
import ChatMessageModel from "../models/chatMessage.model.js";
import ProductModel from "../models/product.model.js";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful AI assistant for an e-commerce website. Give concise, accurate, and friendly answers.";

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractKeywords(message = "") {
  const normalizedMessage = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ");

  const stopWords = new Set([
    "toi",
    "muon",
    "can",
    "tim",
    "cho",
    "va",
    "la",
    "co",
    "khong",
    "the",
    "nao",
    "nhung",
    "cua",
    "gi",
    "giup",
    "tu",
    "van",
    "san",
    "pham",
    "shop",
    "mua",
    "hang",
    "minh",
    "em",
    "anh",
    "chi",
    "voi",
    "de",
    "mot",
    "nhieu",
    "nhe",
  ]);

  return [...new Set(
    normalizedMessage
      .split(/\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 2 && !stopWords.has(item)),
  )].slice(0, 6);
}

async function findRelevantProducts(message = "") {
  const keywords = extractKeywords(message);
  const productFields = ["name", "brand", "catName", "subCat", "thirdsubCat"];

  if (keywords.length) {
    const keywordFilter = {
      $or: keywords.flatMap((keyword) =>
        productFields.map((field) => ({
          [field]: { $regex: escapeRegex(keyword), $options: "i" },
        })),
      ),
    };

    const matchedProducts = await ProductModel.find(keywordFilter)
      .select(
        "name price oldPrice discount images brand catName subCat thirdsubCat rating countInStock",
      )
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .limit(3)
      .lean();

    if (matchedProducts.length) {
      return matchedProducts;
    }
  }

  return ProductModel.find({ countInStock: { $gt: 0 } })
    .select(
      "name price oldPrice discount images brand catName subCat thirdsubCat rating countInStock",
    )
    .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
    .limit(3)
    .lean();
}

function buildProductContext(products = []) {
  if (!products.length) {
    return "";
  }

  return products
    .map((product, index) => {
      const priceText = Number(product.price || 0).toLocaleString("vi-VN");
      const oldPriceText = Number(product.oldPrice || 0).toLocaleString("vi-VN");

      return `${index + 1}. ${product.name} | gia ${priceText} VND${
        product.oldPrice ? ` | gia cu ${oldPriceText} VND` : ""
      }${product.brand ? ` | thuong hieu ${product.brand}` : ""}${
        product.catName ? ` | danh muc ${product.catName}` : ""
      }${product.rating ? ` | danh gia ${product.rating}/5` : ""}${
        typeof product.countInStock === "number"
          ? ` | ton kho ${product.countInStock}`
          : ""
      }`;
    })
    .join("\n");
}

function mapProductSuggestions(products = []) {
  return products.map((product) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    discount: product.discount,
    image: product.images?.[0] || "",
    brand: product.brand,
    catName: product.catName,
    subCat: product.subCat,
    rating: product.rating,
    countInStock: product.countInStock,
  }));
}

function sanitizeMessages(messages = []) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        ["system", "user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim(),
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

function buildTitle(message) {
  if (!message) {
    return "New chat";
  }

  return message.length > 60 ? `${message.slice(0, 57)}...` : message;
}

function extractAssistantContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.text || "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

export async function sendMessage(request, response) {
  try {
    const {
      message,
      sessionId,
      history = [],
      systemPrompt = DEFAULT_SYSTEM_PROMPT,
    } = request.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return response.status(400).json({
        message: "Provide message",
        error: true,
        success: false,
      });
    }

    if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
      return response.status(400).json({
        message: "Provide sessionId",
        error: true,
        success: false,
      });
    }

    if (!process.env.DASHSCOPE_API_KEY) {
      return response.status(500).json({
        message: "Missing DASHSCOPE_API_KEY in .env",
        error: true,
        success: false,
      });
    }

    const baseUrl =
      process.env.DASHSCOPE_BASE_URL ||
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
    const model = process.env.DASHSCOPE_MODEL || "qwen-plus";
    const relatedProducts = await findRelevantProducts(message.trim());
    const productContext = buildProductContext(relatedProducts);

    let chatSession = await ChatMessageModel.findOne({
      sessionId: sessionId.trim(),
    });

    const storedMessages = chatSession ? sanitizeMessages(chatSession.messages) : [];
    const requestHistory = chatSession ? [] : sanitizeMessages(history);
    const conversationHistory = [...storedMessages, ...requestHistory].filter(
      (item) => item.role !== "system",
    );
    const userMessage = {
      role: "user",
      content: message.trim(),
    };

    const dashscopeMessages = [
      {
        role: "system",
        content:
          `${
            typeof systemPrompt === "string" && systemPrompt.trim()
              ? systemPrompt.trim()
              : DEFAULT_SYSTEM_PROMPT
          }

If the user asks about products, prioritize the real store products below.
Only mention product details that are present in this product list.
When suitable, compare 2-3 options briefly and explain why they fit.

Available products:
${productContext || "No matching products found. Give general shopping guidance."}`,
      },
      ...conversationHistory,
      userMessage,
    ];

    const dashscopeResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: dashscopeMessages,
        temperature: 0.7,
      }),
    });

    const data = await dashscopeResponse.json();

    if (!dashscopeResponse.ok) {
      return response.status(dashscopeResponse.status).json({
        message:
          data?.error?.message ||
          data?.message ||
          "DashScope request failed",
        error: true,
        success: false,
      });
    }

    const assistantReply = extractAssistantContent(data);

    if (!assistantReply) {
      return response.status(500).json({
        message: "DashScope returned an empty response",
        error: true,
        success: false,
      });
    }

    const nextMessages = [...conversationHistory, userMessage, {
      role: "assistant",
      content: assistantReply,
    }];

    if (!chatSession) {
      chatSession = new ChatMessageModel({
        sessionId: sessionId.trim(),
        userId:
          request.userId && mongoose.Types.ObjectId.isValid(request.userId)
            ? request.userId
            : null,
        title: buildTitle(userMessage.content),
        messages: nextMessages,
        lastMessageAt: new Date(),
      });
    } else {
      chatSession.messages = nextMessages;
      chatSession.lastMessageAt = new Date();

      if (!chatSession.title) {
        chatSession.title = buildTitle(userMessage.content);
      }

      if (!chatSession.userId && request.userId) {
        chatSession.userId = request.userId;
      }
    }

    await chatSession.save();

    return response.status(200).json({
      message: "Chat response generated successfully",
      error: false,
      success: true,
      data: {
        sessionId: chatSession.sessionId,
        model,
        reply: assistantReply,
        productSuggestions: mapProductSuggestions(relatedProducts),
        usage: data?.usage || null,
        chat: chatSession,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getChatHistory(request, response) {
  try {
    const { sessionId } = request.params;

    const chat = await ChatMessageModel.findOne({ sessionId }).lean();

    if (!chat) {
      return response.status(404).json({
        message: "Chat session not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      data: chat,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getChatSessions(request, response) {
  try {
    const chats = await ChatMessageModel.find()
      .select("sessionId title userId lastMessageAt createdAt updatedAt")
      .sort({ lastMessageAt: -1 })
      .lean();

    return response.status(200).json({
      error: false,
      success: true,
      data: chats,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteChatSession(request, response) {
  try {
    const { sessionId } = request.params;

    const chat = await ChatMessageModel.findOneAndDelete({ sessionId });

    if (!chat) {
      return response.status(404).json({
        message: "Chat session not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Chat session deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
