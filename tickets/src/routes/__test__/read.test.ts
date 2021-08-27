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

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let num of numbers) {
      chai
        .request(app)
        .post("/api/tickets")
        .send({
          title: `Sample Title ${num}`,
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
          expect(res.body.title).to.be.equal(`Sample Title ${num}`);
          expect(res.body.price).to.be.equal("10.00");
          expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
          done();
        });
    }
  });

  it("returns a 200 with a list of tickets", (done) => {
    chai
      .request(app)
      .get("/api/tickets")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(10);
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
    const id = new mongoose.Types.ObjectId().toHexString();
    chai
      .request(app)
      .get(`/api/tickets/${id}`)
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
