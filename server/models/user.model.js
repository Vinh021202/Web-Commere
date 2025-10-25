// import { verify } from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      requered: [true, "Provide name"],
    },
    email: {
      type: String,
      requered: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String,
      requered: [true, "Provide password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    verify_email: {
      type: Boolean,
      default: true,
    },
    access_token: {
      type: String,
      default: "",
    },
    refresh_token: {
      type: String,
      default: "",
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
