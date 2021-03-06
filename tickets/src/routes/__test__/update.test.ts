import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";
import { signIn } from "../../test/setup";

const { expect } = chai;

chai.use(chaiHttp);

let cookie: any;
let ticketId: any;

describe("tickets", () => {
  beforeAll((done) => {
    cookie = signIn();
    chai
      .request(app)
      .post(`/api/tickets`)
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
        ticketId = res.body.id;
        expect(res.body.title).to.be.equal("Sample Title");
        expect(res.body.price).to.be.equal(10);
        expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
        done();
      });
  });

  it("returns a 401 unauthorized when getting all tickets without authorization", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({
        title: "Title Sample",
        price: 5,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it("returns a 200 when updating a ticket with authorization", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({
        title: "Title Sample",
        price: 5,
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("userId");
        expect(res.body).to.have.property("id");
        expect(res.body.title).to.be.equal("Title Sample");
        expect(res.body.price).to.be.equal(5);
        expect(res.body.userId).to.be.equal("FakeIdFakeIdFakeIdFakeId");
        done();
      });
  });

  it("returns a 400 when updating a new ticket without title", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
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

  it("returns a 400 when updating a new ticket without price", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
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

  it("returns a 400 when updating a new ticket without title and price", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({})
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when updating a new ticket with short title", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
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

  it("returns a 400 when updating a new ticket with large title", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
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

  it("returns a 400 when updating a new ticket with negative price", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({
        title: "Sample Title",
        price: "-10.00",
      })
      .set("Cookie", cookie)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns a 400 when updating a new ticket with invalid price", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
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

  it("returns a 400 when updating a new ticket with large price", (done) => {
    chai
      .request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({
        title: "Sample Title",
        price: "17890123456789012",
      })
      .set("Cookie", cookie)
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
      .put(`/api/tickets/${id}`)
      .send({
        title: "Sample Title",
        price: 10,
      })
      .set("Cookie", cookie)
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
