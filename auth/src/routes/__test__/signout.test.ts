import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

import { app } from "../../app";

const { expect } = chai;

chai.use(chaiHttp);

describe("signout", () => {
  it("returns a valid currentUser when there is an authorized request", (done) => {
    chai
      .request(app)
      .post("/api/users/signout")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header("Set-Cookie");
        expect(
          res.header["set-cookie"][0].split(";")[0].split("=")[0]
        ).to.be.equal("express:sess");
        expect(res.header["set-cookie"][0].split(";")[0].split("=")[1]).to.be
          .empty;
        expect(res.body).to.have.property("status");
        expect(res.body.status).to.be.not.undefined;
        expect(res.body.status).to.be.equal("ok");
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
