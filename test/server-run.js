"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const mocha_1 = require("mocha");
const app_1 = __importDefault(require("../src/app"));
chai_1.default.use(chai_http_1.default);
const { expect } = chai_1.default;
(0, mocha_1.describe)('API Tests', () => {
    (0, mocha_1.it)('should return Welcome to the API!👋🏽👋🏽', done => {
        chai_1.default
            .request(app_1.default)
            .get('/')
            .end((err, res) => {
            expect(res.body.message).to.equal('Welcome to the API!👋🏽👋🏽');
            done();
        });
    });
});
