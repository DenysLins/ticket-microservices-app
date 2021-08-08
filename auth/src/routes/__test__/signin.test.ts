import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";

const { expect } = chai;

chai.use(chaiHttp);

describe("signin", () => {
  beforeAll((done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("returns a cookie when there is a valid signin", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header("set-cookie");
        done();
      });
  });

  it("returns 401 with wrong password", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "654321",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it("returns 401 with wrong email", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "other@test.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it("returns 400 without email", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 with empty email", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 with invalid email", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 with email greater than 64 characters", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email:
          "testtesttesttesttesttesttesttesttesttesttesttesttesttest@test.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 without password", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 with empty password", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 when password is less than 6 characters", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "123",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 when password is greater than 16 characters", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "123456789abcdefgh",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 without email and password", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns 400 with invalid email and password", (done) => {
    chai
      .request(app)
      .post("/api/users/signin")
      .send({
        email: "test @ test . com",
        password: 123,
      })
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
