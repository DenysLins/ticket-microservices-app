import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";

const { expect } = chai;

chai.use(chaiHttp);

let jwtCookie: any;

describe("current-user", () => {
  beforeAll((done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .end((err, res) => {
        jwtCookie = res.header["set-cookie"];
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("returns a null currentUser when there is an unauthorized request", (done) => {
    chai
      .request(app)
      .get("/api/users/currentuser")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("currentUser");
        expect(res.body.currentUser).to.be.null;
        done();
      });
  });

  it("returns a valid currentUser when there is an authorized request", (done) => {
    chai
      .request(app)
      .get("/api/users/currentuser")
      .set("Cookie", `${jwtCookie[0]};${jwtCookie[1]}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("currentUser");
        expect(res.body.currentUser).to.be.not.undefined;
        expect(res.body.currentUser).to.have.property("email");
        expect(res.body.currentUser.email).to.be.equal("test@test.com");
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
