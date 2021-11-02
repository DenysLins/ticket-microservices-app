import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";
import { signIn } from "../../test/setup";

const { expect } = chai;

chai.use(chaiHttp);

let cookie = "";
let orderId = "";

describe("orders", () => {
  beforeAll((done) => {
    cookie = signIn();

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const num of numbers) {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          title: `Sample Title ${num}`,
          price: 10,
        })
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("title");
          expect(res.body).to.have.property("price");
          expect(res.body).to.have.property("userId");
          expect(res.body).to.have.property("id");
          orderId = res.body.id;
          expect(res.body.title).to.be.equal(`Sample Title ${num}`);
          expect(res.body.price).to.be.equal(10);
          expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
          done();
        });
    }
  });

  it("returns a 200 with a list of orders", (done) => {
    chai
      .request(app)
      .get("/api/orders")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(10);
        done();
      });
  });

  it("returns a 200 with an existent order id", (done) => {
    chai
      .request(app)
      .get(`/api/orders/${orderId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("returns a 400 with an invalid order id", (done) => {
    chai
      .request(app)
      .get("/api/orders/xpto")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 404 with an inexistent order id", (done) => {
    const id = new mongoose.Types.ObjectId().toHexString();
    chai
      .request(app)
      .get(`/api/orders/${id}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });
});
