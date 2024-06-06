const supertest = require("supertest");
const productController = require("../controllers/productController");
const Product = require("../models/productModel");
const app = require("../app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const { exampleProduct } = require("./constants");
const { faker } = require("@faker-js/faker");
const { mockRequest, mockResponse, mockNext } = require("jest-express");
const express = require("express");

const factory = require("../controllers/handlerFactory");

// const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT_TEST || 3002;

let testApp;

let signupUserToken;
let createdProductId;

describe("product", () => {
  beforeAll(async () => {
    setTimeout(() => {
      console.log("End");
    }, 5000);
    testApp = await app.listen(port, () => {
      console.log(`Server running on port : ${port}`);
    });
    await mongoose
      .connect(process.env.DATABASE, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connection Successfull...");
      });
  });

  afterAll(async () => {
    await testApp.close();

    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("get product route", () => {
    describe("given the user logged in creating a product", () => {
      it("should return a 200", async () => {
        // expect(true).toBe(true);
        // const productId = 658c3c5251b363d5f5b18410;
        const userData = {
          //   username: "jest user",
          email: "jest@gmail.com",
          password: "1234567890",
          //   passwordConfirm: "1234567890",
        };

        const user = await supertest(testApp)
          .post(`/api/v1/users/login`)
          //   .set("Content-Type", "application/json")
          .send(userData);

        // console.log(
        //   "--------------------------------------------------------------------------------------------"
        // );
        // console.log(user.body);
        // console.log(
        //   "--------------------------------------------------------------------------------------------"
        // );
        // console.log(user.body.token);

        signupUserToken = user.body.token;

        const response = await supertest(testApp)
          .post(`/api/v1/products`)
          .set("Authorization", `Bearer ${user.body.token}`)
          .send(exampleProduct);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        createdProductId = response.body.doc._id;

        expect(response.body).toEqual({
          status: "success",
          message: "posted successfully...",
          doc: {
            availableColours: "Silver, Black, Blue",
            model: "XYZ123",
            processor: "Intel Core i7",
            ram: "16GB DDR4",
            storage: "512GB SSD",
            display: "15.6-inch FHD",
            graphics: "NVIDIA GeForce RTX 3080",
            weight: "2.5 kg",
            battery: "Lithium-ion, 6-cell",
            keyboardBacklight: "keyboard backlights",
            yearsOfWarranty: "2",
            windows: "Windows 10 Home",
            title: "Laptop XYZ",
            category: "Electronics",
            subCategory: "Laptops",
            price: 999.99,
            discount: 10,
            quantity: 50,
            createdAt: expect.any(String),
            images: [],
            description:
              "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
            user: [],
            _id: expect.any(String),
            updatedAt: expect.any(String),

            // status: expect.any(String),
            __v: 0,
          },
        });
      });
    });
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        // expect(true).toBe(true);
        const productId = "658c3c5251b363d5f5b18000";

        await supertest(testApp)
          .get(`/api/v1/products/${productId}`)
          .expect(404);
      });
    });
    describe("given the product does exist", () => {
      it("should return a 200", async () => {
        // expect(true).toBe(true);
        // const productId = 658c3c5251b363d5f5b18410;

        const response = await supertest(testApp).get(
          `/api/v1/products/${createdProductId}`
        );

        // console.log(response);
        expect(response.statusCode).toBe(200);
      });
    });

    describe("given the user logged in and product was updated", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .patch(`/api/v1/products/${createdProductId}`)
          .set("Authorization", `Bearer ${signupUserToken}`)
          .send({ model: "JEST_TEST_MODEL" });

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          status: "success",
          message: "ducument updated successfully....",
          doc: {
            availableColours: "Silver, Black, Blue",
            model: "JEST_TEST_MODEL",
            processor: "Intel Core i7",
            ram: "16GB DDR4",
            storage: "512GB SSD",
            display: "15.6-inch FHD",
            graphics: "NVIDIA GeForce RTX 3080",
            weight: "2.5 kg",
            battery: "Lithium-ion, 6-cell",
            keyboardBacklight: "keyboard backlights",
            yearsOfWarranty: "2",
            windows: "Windows 10 Home",
            title: "Laptop XYZ",
            category: "Electronics",
            subCategory: "Laptops",
            price: 999.99,
            discount: 10,
            quantity: 50,
            createdAt: expect.any(String),
            images: expect.any(Array),
            description:
              "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
            user: [],
            _id: createdProductId,
            updatedAt: expect.any(String),

            // status: expect.any(String),
            __v: 0,
          },
        });
      });
    });
    describe("given the user logged in and deleted a product", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .delete(`/api/v1/products/${createdProductId}`)
          .set("Authorization", `Bearer ${signupUserToken}`);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);
      });
    });
  });
  describe("product unit testing", () => {
    // Unit Testing

    describe("given the product data create a product", () => {
      it("should return a newly created product", async () => {
        // testApp.post("/test", productController.createOneProduct);

        let response = await Product.create(exampleProduct);

        response = await response.toObject();

        console.log(
          response,
          "mock response----------------------------------------"
        );
        // expect(response.statusCode).toBe(200);

        createdProductId = response._id;

        expect(response).toEqual({
          availableColours: "Silver, Black, Blue",
          model: "XYZ123",
          processor: "Intel Core i7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6-inch FHD",
          graphics: "NVIDIA GeForce RTX 3080",
          weight: "2.5 kg",
          battery: "Lithium-ion, 6-cell",
          keyboardBacklight: "keyboard backlights",
          yearsOfWarranty: "2",
          windows: "Windows 10 Home",
          title: "Laptop XYZ",
          category: "Electronics",
          subCategory: "Laptops",
          price: 999.99,
          discount: 10,
          quantity: 50,
          createdAt: expect.any(Date),
          images: [],
          description:
            "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
          user: [],
          _id: expect.any(Object),
          updatedAt: expect.any(Date),

          // status: expect.any(String),
          __v: 0,
        });
      });
    });
    describe("given the product id", () => {
      it("should return a product belong to that id", async () => {
        // testApp.post("/test", productController.createOneProduct);

        let response = await Product.findById(createdProductId);

        response = await response.toObject();

        console.log(
          response,
          "mock response----------------------------------------"
        );
        // expect(response.statusCode).toBe(200);

        expect(response).toEqual({
          availableColours: "Silver, Black, Blue",
          model: "XYZ123",
          processor: "Intel Core i7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6-inch FHD",
          graphics: "NVIDIA GeForce RTX 3080",
          weight: "2.5 kg",
          battery: "Lithium-ion, 6-cell",
          keyboardBacklight: "keyboard backlights",
          yearsOfWarranty: "2",
          windows: "Windows 10 Home",
          title: "Laptop XYZ",
          category: "Electronics",
          subCategory: "Laptops",
          price: 999.99,
          discount: 10,
          quantity: 50,
          createdAt: expect.any(Date),
          images: [],
          description:
            "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
          user: [],
          _id: createdProductId,
          updatedAt: expect.any(Date),

          // status: expect.any(String),
          __v: 0,
        });
      });
    });
    describe("given the product id and updated data", () => {
      it("should return the updated product", async () => {
        // testApp.post("/test", productController.createOneProduct);
        let data = {
          model: "TEST WORKED",
        };

        let response = await Product.findByIdAndUpdate(createdProductId, data, {
          new: true,
        });

        response = await response.toObject();

        console.log(
          response,
          "mock response----------------------------------------"
        );
        // expect(response.statusCode).toBe(200);

        expect(response).toEqual({
          availableColours: "Silver, Black, Blue",
          model: data.model,
          processor: "Intel Core i7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6-inch FHD",
          graphics: "NVIDIA GeForce RTX 3080",
          weight: "2.5 kg",
          battery: "Lithium-ion, 6-cell",
          keyboardBacklight: "keyboard backlights",
          yearsOfWarranty: "2",
          windows: "Windows 10 Home",
          title: "Laptop XYZ",
          category: "Electronics",
          subCategory: "Laptops",
          price: 999.99,
          discount: 10,
          quantity: 50,
          createdAt: expect.any(Date),
          images: [],
          description:
            "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
          user: [],
          _id: createdProductId,
          updatedAt: expect.any(Date),

          // status: expect.any(String),
          __v: 0,
        });
      });
    });
    describe("given the product id ", () => {
      it("should delete the product", async () => {
        // testApp.post("/test", productController.createOneProduct);
        let data = {
          model: "TEST WORKED",
        };

        let response = await Product.findByIdAndDelete(createdProductId);

        response = await response.toObject();

        console.log(
          response,
          "mock response----------------------------------------"
        );
        // expect(response.statusCode).toBe(200);

        expect(response).toEqual({
          availableColours: "Silver, Black, Blue",
          model: data.model,
          processor: "Intel Core i7",
          ram: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6-inch FHD",
          graphics: "NVIDIA GeForce RTX 3080",
          weight: "2.5 kg",
          battery: "Lithium-ion, 6-cell",
          keyboardBacklight: "keyboard backlights",
          yearsOfWarranty: "2",
          windows: "Windows 10 Home",
          title: "Laptop XYZ",
          category: "Electronics",
          subCategory: "Laptops",
          price: 999.99,
          discount: 10,
          quantity: 50,
          createdAt: expect.any(Date),
          images: [],
          description:
            "Introducing the TechMaster XYZ, a cutting-edge gaming laptop designed for unmatched performance. With an Intel Core i9-10th Gen processor and 32GB DDR4 RAM, this laptop ensures seamless multitasking and powerful computing. The 17.3-inch 240Hz Full HD IPS display, coupled with the NVIDIA GeForce RTX 3080 graphics, delivers an immersive gaming experience. Store games on the 1TB NVMe SSD for quick access. Featuring a backlit keyboard, sleek design options, and a long-lasting battery, the XYZ is perfect for extended gaming sessions. Pre-installed with Windows 11 Home and backed by a 3-year warranty, the TechMaster XYZ is your gateway to high-performance gaming.",
          user: [],
          _id: createdProductId,
          updatedAt: expect.any(Date),

          // status: expect.any(String),
          __v: 0,
        });
      });
    });
  });
});

module.exports = testApp;
