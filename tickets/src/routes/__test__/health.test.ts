import chai from "chai";
import chaiHttp from "chai-http";

import { app } from "../../app";

const { expect } = chai;

chai.use(chaiHttp);

describe("health", () => {
  it("returns a status ok", (done) => {
    chai
      .request(app)
      .get("/api/tickets/health")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status");
        expect(res.body.status).to.be.equal("ok");
        done();
      });
  });
});
