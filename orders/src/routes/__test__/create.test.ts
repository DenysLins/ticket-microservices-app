import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";
import { signIn } from "../../test/setup";

const { expect } = chai;

chai.use(chaiHttp);

let cookie = "";

describe("orders", () => {
  beforeAll(async () => {
    cookie = signIn();
  });

  it("returns a 401 unauthorized when creating a new order without authorization", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
        price: 10,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it("returns a 201 when creating a new order with authorization", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
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
        expect(res.body.title).to.be.equal("Sample Title");
        expect(res.body.price).to.be.equal(10);
        expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
        done();
      });
  });

  it("returns a 400 when creating a new order with existent title, price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
        price: 10,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order without title", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        price: 10,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order without price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order without title and price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({})
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order with short title", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "ab",
        price: 10,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order with large title", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title:
          "bvgfdsertyudjfjaldjflakjdlkfjaldskjfalksdjflkajsdlfkjaldskfjalskl",
        price: 10,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order with negative price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
        price: -10,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order with invalid price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
        price: "invalid",
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when creating a new order with large price", (done) => {
    chai
      .request(app)
      .post("/api/orders")
      .send({
        title: "Sample Title",
        price: 17890123456789012,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
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
