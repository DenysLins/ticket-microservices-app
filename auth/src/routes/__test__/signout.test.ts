import chai from "chai";
import chaiHttp from "chai-http";

import { app } from "../../app";

const { expect } = chai;

chai.use(chaiHttp);

describe("signout", () => {
  it("returns a valid currentUser when there is an authorized request", (done) => {
    chai
      .request(app)
      .post("/api/users/signout")
      .send({})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header("Set-Cookie");
        expect(res.header["set-cookie"][0]).to.be.equal(
          "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
        );
        expect(res.body).to.have.property("status");
        expect(res.body.status).to.be.not.undefined;
        expect(res.body.status).to.be.equal("ok");
        done();
      });
  });
});
