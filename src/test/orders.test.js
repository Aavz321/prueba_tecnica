import request from "supertest";
import { createApp } from "../../index.js";
import { AuthModel } from "../models/mongodb/authMongodb.js";
import { OrderModel } from "../models/mongodb/orderMongodb.js";

const app = createApp({ orderModel: OrderModel, authModel: AuthModel });

describe("Order endpoints", () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register and login to get a token
    await request(app).post("/auth/register").send({
      username: "orderuser",
      password: "orderpassword",
    });

    const loginRes = await request(app).post("/auth/login").send({
      username: "orderuser",
      password: "orderpassword",
    });

    token = loginRes.headers["set-cookie"][0].split(";")[0].split("=")[1];
    userId = loginRes.body.userId;
  });

  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", [`access_token=${token}`])
      .send({
        items: [{ product_id: "66cc1954588e0a3aa1bc2cf6", quantity: 2 }],
        shipping_address: "123 Test St, Test City, TS 12345",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Order created successfully");
  });

  it("should get user orders", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/orders`)
      .set("Cookie", [`access_token=${token}`]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("orders");
  });
});
