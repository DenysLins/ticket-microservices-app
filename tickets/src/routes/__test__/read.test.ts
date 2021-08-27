import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";
import { signIn } from "../../test/setup";

const { expect } = chai;

chai.use(chaiHttp);

let cookie: string = "";
let ticketId: string = "";

describe("tickets", () => {
  beforeAll((done) => {
    cookie = signIn();
    chai
      .request(app)
      .post("/api/tickets")
      .send({
        title: "Sample Title",
        price: "10.00",
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("userId");
        expect(res.body).to.have.property("id");
        ticketId = res.body.id;
        expect(res.body.title).to.be.equal("Sample Title");
        expect(res.body.price).to.be.equal("10.00");
        expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
        done();
      });
  });

  it("returns a 200 with a list of tickets", (done) => {
    chai
      .request(app)
      .get("/api/tickets")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("returns a 200 with an existent ticket id", (done) => {
    chai
      .request(app)
      .get(`/api/tickets/${ticketId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("returns a 400 with an invalid ticket id", (done) => {
    chai
      .request(app)
      .get("/api/tickets/xpto")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 404 with an inexistent ticket id", (done) => {
    chai
      .request(app)
      .get("/api/tickets/61283ee8e9f5115b7462fc99")
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
