const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const { exampleReview } = require("./constants");
const { faker } = require("@faker-js/faker");
const Review = require("../models/reviewModel");
// const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT_TEST || 3002;

let testApp;

let signupUserToken;
let createdReviewId;
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
        signupUserId = user.body._id;

        exampleReview.userId = signupUserId;

        const response = await supertest(testApp)
          .post(`/api/v1/reviews`)
          .set("Authorization", `Bearer ${user.body.token}`)
          .send(exampleReview);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        createdReviewId = response.body.doc._id;

        expect(response.body).toEqual({
          status: "success",
          message: "posted successfully...",
          doc: {
            createdAt: expect.any(String),
            comment: "Great product...",
            ratings: "5 star",
            user: expect.any(Array),
            product: expect.any(Array),
            _id: expect.any(String),
            updatedAt: expect.any(String),
            __v: 0,
          },
        });
      });
    });
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        // expect(true).toBe(true);
        const reviewId = "658c3c5251b363d5f5b18000";

        await supertest(testApp).get(`/api/v1/reviews/${reviewId}`).expect(404);
      });
    });
    describe("given the product does exist", () => {
      it("should return a 200", async () => {
        // expect(true).toBe(true);
        // const productId = 658c3c5251b363d5f5b18410;

        const response = await supertest(testApp).get(
          `/api/v1/reviews/${createdReviewId}`
        );

        // console.log(response);
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          status: "success",
          message: "found the document...",
          doc: {
            _id: createdReviewId,
            createdAt: expect.any(String),
            comment: "Great product...",
            ratings: "5 star",
            user: expect.any(Array),
            product: expect.any(Array),
            updatedAt: expect.any(String),
            __v: 0,
          },
        });
      });
    });

    describe("given the user logged in and order was updated", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .patch(`/api/v1/reviews/${createdReviewId}`)
          .set("Authorization", `Bearer ${signupUserToken}`)
          .send({ ratings: "4 star" });

        // console.log(response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          status: "success",
          message: "ducument updated successfully....",
          doc: {
            _id: createdReviewId,
            createdAt: expect.any(String),
            comment: "Great product...",
            ratings: "4 star",
            user: expect.any(Array),
            product: expect.any(Array),
            updatedAt: expect.any(String),
            __v: 0,
          },
        });
      });
    });
    describe("given the user logged in and deleted a order", () => {
      it("should return a 200", async () => {
        const response = await supertest(testApp)
          .delete(`/api/v1/reviews/${createdReviewId}`)
          .set("Authorization", `Bearer ${signupUserToken}`);

        // console.log(response.body);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("Review unit testing", () => {
    describe("given the review data", () => {
      it("should create a review and return it", async () => {
        if (!signupUserId) {
          exampleReview.userId = "65890e98e5acf76b89364c10";
          signupUserId = "65890e98e5acf76b89364c10";
        }

        let response = await Review.create(exampleReview);

        response = response.toObject();

        createdReviewId = response._id;

        expect(response).toEqual({
          createdAt: expect.any(Date),
          comment: "Great product...",
          ratings: "5 star",
          user: expect.any(Array),
          product: expect.any(Array),
          _id: expect.any(Object),
          updatedAt: expect.any(Date),
          __v: 0,
        });
      });
    });
    describe("given the review id", () => {
      it("should return the review ", async () => {
        if (!signupUserId) {
          exampleReview.userId = "65890e98e5acf76b89364c10";
          signupUserId = "65890e98e5acf76b89364c10";
        }

        let response = await Review.findById(createdReviewId);

        response = response.toObject();

        expect(response).toEqual({
          createdAt: expect.any(Date),
          comment: "Great product...",
          ratings: "5 star",
          user: expect.any(Array),
          product: expect.any(Array),
          _id: expect.any(Object),
          updatedAt: expect.any(Date),
          __v: 0,
        });
      });
    });
    describe("given the review id and updated data", () => {
      it("should update and return the review ", async () => {
        if (!signupUserId) {
          exampleReview.userId = "65890e98e5acf76b89364c10";
          signupUserId = "65890e98e5acf76b89364c10";
        }
        let data = {
          ratings: "4",
        };

        let response = await Review.findByIdAndUpdate(
          createdReviewId,
          { ratings: "4" },
          {
            new: true,
          }
        );

        response = response.toObject();

        expect(response).toEqual({
          createdAt: expect.any(Date),
          comment: "Great product...",
          ratings: data.ratings,
          user: expect.any(Array),
          product: expect.any(Array),
          _id: expect.any(Object),
          updatedAt: expect.any(Date),
          __v: 0,
        });
      });
    });
    describe("given the review id ", () => {
      it("should delete and return the review ", async () => {
        if (!signupUserId) {
          exampleReview.userId = "65890e98e5acf76b89364c10";
          signupUserId = "65890e98e5acf76b89364c10";
        }
        let data = {
          ratings: "4",
        };

        let response = await Review.findByIdAndDelete(createdReviewId);

        response = response.toObject();

        expect(response).toEqual({
          createdAt: expect.any(Date),
          comment: "Great product...",
          ratings: data.ratings,
          user: expect.any(Array),
          product: expect.any(Array),
          _id: expect.any(Object),
          updatedAt: expect.any(Date),
          __v: 0,
        });
      });
    });
  });
});

module.exports = testApp;
