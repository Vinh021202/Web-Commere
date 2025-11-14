import CategoryModel from "../models/category.model.js";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import e from "express";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

//image upload
var imagesArr = [];
// image upload
export async function uploadImages(request, response) {
  try {
    const images = request.files; // nhiều file

    // ===========================
    // UPLOAD ẢNH MỚI
    // ===========================
    const imagesArr = [];

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(uploaded.secure_url);

      // Xóa file tạm
      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      avatar: imagesArr[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create category
export async function createCategory(request, response) {
  try {
    // Validate name
    if (!request.body.name) {
      return response.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const files = request.files || [];
    const imagesArr = [];

    // ========== UPLOAD FILES ==========
    if (files.length > 0) {
      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "categories", // có thể bỏ nếu không muốn
        });

        console.log("Uploaded:", uploaded.secure_url);

        imagesArr.push(uploaded.secure_url);

        // Xóa file tạm trong server
        fs.unlinkSync(file.path);
      }
    }
    // ========== TẠO CATEGORY ==========
    const category = new CategoryModel({
      name: request.body.name,
      images: imagesArr, // nếu không có hình → []
      parentId: request.body.parentId || null,
      parentCatName: request.body.parentCatName || null,
    });

    const savedCategory = await category.save();

    return response.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get Categories
export async function getCategories(request, response) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    // Lưu theo string key
    categories.forEach((cat) => {
      const id = String(cat._id);
      categoryMap[id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      const id = String(cat._id);
      const parentId = cat.parentId ? String(cat.parentId) : null;

      if (parentId && categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[id]);
      } else {
        rootCategories.push(categoryMap[id]);
      }
    });

    return response.status(200).json({
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get category count
export async function getCategoryCount(request, response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });
    if (!categoryCount) {
      response.status(500).json({ success: false, error: true });
    } else {
      response.send({
        categoryCount: categoryCount,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
