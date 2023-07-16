import { Router } from "express";
import { ObjectId } from "mongodb";
import Joi from "joi";
import helpers from "../helpers.js";

import mongoose from "mongoose";

import { productsCollection } from "../config/mongoCollections.js";

const productSchema = helpers.productSchema;

export const addProduct = async (
  productName,
  productRibbon,
  productDescription,
  productCategory,
  additionalInfo,
  productSellPrice,
  productCostPrice,
  productInventoryStatus,
  productWeight,
  productStockCount,
  imageURL
) => {
  try {
    const product = {
      productName: productName,
      productRibbon: productRibbon,
      productDescription: productDescription,
      productCategory: productCategory,
      additionalInfo: additionalInfo,
      productSellPrice: productSellPrice,
      productCostPrice: productCostPrice,
      productInventoryStatus: productInventoryStatus,
      productWeight: productWeight,
      productStockCount: productStockCount,
      imageURL: imageURL,
    };

    const { error, value } = productSchema.validate(product);

    if (error) {
      console.log("Something fishy");
      throw new Error(`Invalid product data: ${error.message}`);
    }

    const productsTable = await productsCollection();

    const prod = await productsTable.findOne({
      productName: product.productName,
    });

    if (prod) {
      throw new Error(`A product with same Product Name "${prod.productName}". 
      Please try some other Product Name or add numbers at end to differentiate`);
    }

    const productData = {
      _id: new ObjectId(),
      productName: productName,
      productRibbon: productRibbon,
      productDescription: productDescription,
      productCategory: productCategory,
      additionalInfo: additionalInfo,
      productSellPrice: productSellPrice,
      productCostPrice: productCostPrice,
      productInventoryStatus: productInventoryStatus,
      productWeight: productWeight,
      productStockCount: productStockCount,
      imageURL: imageURL,
    };

    const insertInfo = await productsTable.insertOne(productData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not add Product");
    }

    return { insertedProduct: true };
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const productsTable = await productsCollection();

    const allProducts = await productsTable.find({}).toArray();

    if (!allProducts || allProducts.length === 0) {
      throw new Error("No products found");
    }

    return allProducts;
  } catch (error) {
    throw error;
  }
};

export default { addProduct, getAllProducts };
