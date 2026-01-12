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

describe("Inventories", () => {
  it("create inventory and enable public", async () => {
    const email = "owner@example.com";
    const password = "password123";
    await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password, name: "Owner" })
      .expect(201);
    const resLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password })
      .expect(200);
    const token = resLogin.body.data.access;
    const invRes = await request(app)
      .post("/api/v1/inventories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Casa" })
      .expect(201);
    const id = invRes.body.data._id;
    await request(app)
      .post(`/api/v1/inventories/${id}/public/enable`)
      .set("Authorization", `Bearer ${token}`)
      .send({ allowPublicEdit: true })
      .expect(200);
  });
});
