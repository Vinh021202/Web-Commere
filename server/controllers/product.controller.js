import ProductModel from "../models/product.model.js";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";
import mongoose from "mongoose";

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
    const images = request.files;

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      // LƯU ảnh vào biến toàn cục
      imagesArr.push(uploaded.secure_url);

      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      avatar: imagesArr[0],
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create product
export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: imagesArr,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      thirdsubCat: request.body.thirdsubCat,
      thirdsubCatId: request.body.thirdsubCatId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
    });

    product = await product.save();

    if (!product) {
      response.status(500).json({
        success: false,
        error: error,
        message: "Product Not Created",
      });
    }

    imagesArr = [];

    response.status(201).json({
      message: "Product Created Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
