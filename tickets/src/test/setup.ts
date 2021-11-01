import jwt from "jsonwebtoken";
import Keygrip from "keygrip";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const JWT_KEY = process.env.JWT_KEY || "jwt_key";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || 3600;
const COOKIE_KEY_1 = process.env.COOKIE_KEY_1 || "key_1";
const COOKIE_KEY_2 = process.env.COOKIE_KEY_2 || "key_2";
let mongo: any;

jest.mock("../nats-wrapper");

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const signIn = () => {
  const payload = {
    id: "FakeIdFakeIdFakeIdFakeId",
    email: "test@test.com",
  };

  const token = jwt.sign(payload, JWT_KEY, {
    expiresIn: Number(JWT_EXPIRATION_TIME),
  });

  const cookie = Buffer.from(JSON.stringify({ jwt: token })).toString("base64");

  const kg = Keygrip([COOKIE_KEY_1, COOKIE_KEY_2]);

  const hash = kg.sign(`express:sess=${cookie}`);

  return `express:sess=${cookie}; express:sess.sig=${hash}`;
};
