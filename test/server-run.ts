import chai from "chai";
import axios from "axios"
import chaiHttp from "chai-http";
import app from "../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

describe("API Tests", () => {

   it("should return Welcome to the API!👋🏽👋🏽", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.body.message).to.equal("Welcome to the API!👋🏽👋🏽");
        done();
      });
  });
});
