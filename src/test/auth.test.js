// tests/auth.test.js
import request from "supertest";
import { createApp } from "../../index.js";
import { AuthModel } from "../models/mongodb/authMongodb.js";
import { OrderModel } from "../models/mongodb/orderMongodb.js";

const app = createApp({ orderModel: OrderModel, authModel: AuthModel });

describe("Auth endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty("message", "User successfully logged in");
  });
});
