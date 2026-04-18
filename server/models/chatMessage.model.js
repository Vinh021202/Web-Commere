import mongoose from "mongoose";

const chatEntrySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    messages: {
      type: [chatEntrySchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const ChatMessageModel = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessageModel;
