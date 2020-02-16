const app = require("../../../app");
const request = require("supertest");
const Director = require("../director.model");
const { JWT_HEADER } = require("../../../test/utils");
const { buildDirector } = require("../../../test/mocks");

const API_ROOT = "/api/directors";

describe("Director API", () => {
    describe("GET /api/directors", () => {
        it("authenticated request should respond with JSON object", done => {
            request(app)
                .get(API_ROOT)
                .set("authorization", JWT_HEADER)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        it("unauthenticated request should respond with 403 forbidden", done => {
            request(app)
                .get(API_ROOT)
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    describe("POST /api/directors", () => {
        it("authenticated request should respond with JSON object", done => {
            request(app)
                .post(API_ROOT)
                .send(buildDirector())
                .set("authorization", JWT_HEADER)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        it("unauthenticated request should respond with 403 forbidden", done => {
            request(app)
                .post(API_ROOT)
                .send(buildDirector())
                .expect(401)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    describe("PUT /api/directors/:id", () => {
        // Stores director_instance in outer scope
        let director_instance;

        // Creates Director mock record before running tests
        before(() => {
            director_instance = new Director(buildDirector());
            return director_instance.save();
        });

        // Destroys Director mock record after running tests
        after(() => {
            return Director.deleteOne(director_instance);
        });

        it("should respond with JSON object", done => {
            request(app)
                .put(`${API_ROOT}/${director_instance._id}`)
                .send(director_instance)
                .set("authorization", JWT_HEADER)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    describe("GET /api/directors/:id", () => {
        // Stores director_instance in outer scope
        let director_instance;

        // Creates Director mock record before running tests
        before(() => {
            director_instance = new Director(buildDirector());
            return director_instance.save();
        });

        // Destroys Director mock record after running tests
        after(() => {
            return Director.deleteOne(director_instance);
        });

        it("should respond with JSON object", done => {
            request(app)
                .get(`${API_ROOT}/${director_instance._id}`)
                .set("authorization", JWT_HEADER)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    describe("DELETE /api/directors/:id", () => {
        // Stores director_instance in outer scope
        let director_instance;

        // Creates Director mock record before running tests
        before(() => {
            director_instance = new Director(buildDirector());
            return director_instance.save();
        });

        it("should respond with JSON object", done => {
            request(app)
                .delete(`${API_ROOT}/${director_instance._id}`)
                .set("authorization", JWT_HEADER)
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    // GET /api/directors/:id/movies showMovies

    describe("GET /api/directors/:id/movies", () => {
        // Stores director_instance in outer scope
        let director_instance;

        // Creates Director mock record before running tests
        before(() => {
            director_instance = new Director(buildDirector());
            return director_instance.save();
        });

        // Destroys Director mock record after running tests
        after(() => {
            return Director.deleteOne(director_instance);
        });

        it("authenticated request should respond with JSON object", done => {
            request(app)
                .get(`${API_ROOT}/${director_instance._id}/movies`)
                .set("authorization", JWT_HEADER)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    // // // //
});
