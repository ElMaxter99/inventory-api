import request from "supertest";
import app from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Auth", () => {
  it("register + login flow", async () => {
    const email = "test@example.com";
    const password = "password123";
    await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password, name: "Tester" })
      .expect(201);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password })
      .expect(200);
    expect(res.body.data).toHaveProperty("access");
    expect(res.body.data).toHaveProperty("refresh");
  });
});
