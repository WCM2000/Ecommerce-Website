const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const { exampleOrder, exampleOrderUnit } = require("./constants");
const { faker } = require("@faker-js/faker");
const Order = require("../models/orderModel");
// const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT_TEST || 3002;

let testApp;
let signupUserToken;
let createdOrderId;
let signupUserId;

describe("product", () => {
  beforeAll(async () => {
    // const mongoServer = await MongoMemoryServer.create();

    // await mongoose.connect(mongoServer.getUri());
    setTimeout(() => {
      console.log("End");
    }, 5000);
    testApp = app.listen(port, () => {
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
    setTimeout(() => {
      console.log("End");
    }, 5000);
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("get order route", () => {
    describe("given the user logged in creating a order", () => {
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
        signupUserId = user.body._id;

        exampleOrder.userId = signupUserId;

        const response = await supertest(testApp)
          .post(`/api/v1/orders`)
          .set("Authorization", `Bearer ${user.body.token}`)
          .send(exampleOrder);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        createdOrderId = response.body.doc._id;

        expect(response.body).toEqual({
          status: "success",
          message: "posted successfully...",
          doc: {
            userId: signupUserId,
            subTotal: "23",
            products: [
              {
                itemid: "65890e98e5acf76b89364c10",
                itemprice: 1200,
                itemtitle: "test update with images",
                itemimages:
                  "product-6588ebdb294cda52249904ac-1703483014198-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d6639",
              },
              {
                itemid: "6585c532f568a9e2fbefab9c",
                itemprice: 2090,
                itemtitle: "1M Quick Charge & Data Cable for Micro A100 Aspor",
                itemimages:
                  "product-6585a42e3dccfce8aed1e71d-1703266144902-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d663a",
              },
            ],
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            status: "processing",

            __v: 0,
          },
        });
      });
    });
    describe("given the order does not exist", () => {
      it("should return a 404", async () => {
        // expect(true).toBe(true);
        const orderId = "658c3c5251b363d5f5b18000";

        await supertest(testApp).get(`/api/v1/orders/${orderId}`).expect(404);
      });
    });
    describe("given the order does exist", () => {
      it("should return a 200", async () => {
        // expect(true).toBe(true);
        // const productId = 658c3c5251b363d5f5b18410;

        const response = await supertest(testApp).get(
          `/api/v1/orders/${createdOrderId}`
        );

        // console.log(response);
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          status: "success",
          message: "found the document...",
          doc: {
            userId: signupUserId,
            subTotal: "23",
            products: [
              {
                itemid: "65890e98e5acf76b89364c10",
                itemprice: 1200,
                itemtitle: "test update with images",
                itemimages:
                  "product-6588ebdb294cda52249904ac-1703483014198-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d6639",
              },
              {
                itemid: "6585c532f568a9e2fbefab9c",
                itemprice: 2090,
                itemtitle: "1M Quick Charge & Data Cable for Micro A100 Aspor",
                itemimages:
                  "product-6585a42e3dccfce8aed1e71d-1703266144902-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d663a",
              },
            ],
            _id: createdOrderId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            status: "processing",
            __v: 0,
          },
        });
      });
    });

    describe("given the user logged in and order was updated", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .patch(`/api/v1/orders/${createdOrderId}`)
          .set("Authorization", `Bearer ${signupUserToken}`)
          .send({ subTotal: "10" });

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          status: "success",
          message: "ducument updated successfully....",
          doc: {
            userId: signupUserId,
            subTotal: "10",
            status: "processing",
            products: [
              {
                itemid: "65890e98e5acf76b89364c10",
                itemprice: 1200,
                itemtitle: "test update with images",
                itemimages:
                  "product-6588ebdb294cda52249904ac-1703483014198-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d6639",
              },
              {
                itemid: "6585c532f568a9e2fbefab9c",
                itemprice: 2090,
                itemtitle: "1M Quick Charge & Data Cable for Micro A100 Aspor",
                itemimages:
                  "product-6585a42e3dccfce8aed1e71d-1703266144902-1.jpeg",
                count: 2,
                _id: "658adfb37461d8afdb5d663a",
              },
            ],
            _id: createdOrderId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: 0,
          },
        });
      });
    });
    describe("given the user logged in and deleted a order", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .delete(`/api/v1/orders/${createdOrderId}`)
          .set("Authorization", `Bearer ${signupUserToken}`);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("Order unit testing", () => {
    describe("given the order data", () => {
      it("should create a order and return data", async () => {
        if (!signupUserId) {
          exampleOrderUnit.userId = "65890e98e5acf76b89364c10";
          signupUserId = "65890e98e5acf76b89364c10";
        }

        let response = await Order.create(exampleOrderUnit);
        response = response.toObject();

        createdOrderId = response._id;

        expect(response).toEqual({
          userId: signupUserId,
          subTotal: "23",
          products: expect.any(Array),
          _id: createdOrderId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          status: "processing",

          __v: 0,
        });
      });
    });
    describe("given the order id", () => {
      it("should get the order mach to the given id", async () => {
        let response = await Order.findById(createdOrderId);
        response = response.toObject();

        expect(response).toEqual({
          userId: signupUserId,
          subTotal: "23",
          products: expect.any(Array),
          _id: createdOrderId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          status: "processing",

          __v: 0,
        });
      });
    });
    describe("given the order id and update details", () => {
      it("should update the order and return it", async () => {
        let data = {
          subTotal: "20",
        };
        let response = await Order.findByIdAndUpdate(
          createdOrderId,
          { subTotal: "20" },
          {
            new: true,
          }
        );
        response = response.toObject();

        expect(response).toEqual({
          userId: signupUserId,
          subTotal: data.subTotal,
          products: expect.any(Array),
          _id: createdOrderId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          status: "processing",

          __v: 0,
        });
      });
    });
    describe("given the order id ", () => {
      it("should delete the order", async () => {
        let data = {
          subTotal: "20",
        };
        let response = await Order.findByIdAndDelete(createdOrderId);
        response = response.toObject();

        expect(response).toEqual({
          userId: signupUserId,
          subTotal: data.subTotal,
          products: expect.any(Array),
          _id: createdOrderId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          status: "processing",

          __v: 0,
        });
      });
    });
  });
});

module.exports = testApp;
