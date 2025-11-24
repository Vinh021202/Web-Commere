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

//get all products
export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By CatId
export async function getAllProductsByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By name
export async function getAllProductsByCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catName: request.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products Sub CatId
export async function getAllProductsBySubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCatId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By Sub Cat Name
export async function getAllProductsBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCat: request.query.subCat })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products Third Laver Sub CatId
export async function getAllProductsBySubThirdLaveCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By Third Laver Sub Cat Name
export async function getAllProductsBySubThirdLaveCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCat: request.query.thirdsubCat,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By price
export async function getAllProductsByPrice(request, response) {
  try {
    let productList = [];

    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: request.query.catId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: request.query.subCatId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    if (
      request.query.thirdsubCatId !== "" &&
      request.query.thirdsubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdsubCatId: request.query.thirdsubCatId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    const filteredProducts = productList.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseFloat(request.query.minPrice)
      ) {
        return false;
      }
      if (
        request.query.maxPrice &&
        product.price > parseFloat(request.query.maxPrice)
      ) {
        return false;
      }
      return true;
    });

    return response.status(200).json({
      products: filteredProducts,
      totalPages: 0,
      page: 0,
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
