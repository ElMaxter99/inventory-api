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

describe("Items + public access", () => {
  it("creates zone/item and allows public edit via locator", async () => {
    const email = "owner2@example.com";
    const password = "password123";
    await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password, name: "Owner 2" })
      .expect(201);
    const resLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password })
      .expect(200);
    const token = resLogin.body.data.access;

    const invRes = await request(app)
      .post("/api/v1/inventories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Casa 2" })
      .expect(201);
    const invId = invRes.body.data._id;

    const zoneRes = await request(app)
      .post(`/api/v1/inventories/${invId}/zones`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Salón" })
      .expect(201);
    const zoneId = zoneRes.body.data._id;

    const itemRes = await request(app)
      .post(`/api/v1/inventories/${invId}/items`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Caja A", type: "container", zoneId })
      .expect(201);
    const itemId = itemRes.body.data._id;

    await request(app)
      .post(`/api/v1/inventories/${invId}/public/enable`)
      .set("Authorization", `Bearer ${token}`)
      .send({ allowPublicEdit: true })
      .expect(200);

    const locatorRes = await request(app)
      .post(`/api/v1/inventories/${invId}/locators`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        targetType: "item",
        targetId: itemId,
        mode: "public",
        publicEdit: true,
      })
      .expect(201);

    const locatorToken = locatorRes.body.data.token;
    await request(app)
      .get(`/api/v1/locators/${locatorToken}`)
      .expect(200);

    const updateRes = await request(app)
      .patch(`/api/v1/public/items/${locatorToken}`)
      .send({ name: "Caja A+ actualizado" })
      .expect(200);
    expect(updateRes.body.data.name).toBe("Caja A+ actualizado");
  });
});
