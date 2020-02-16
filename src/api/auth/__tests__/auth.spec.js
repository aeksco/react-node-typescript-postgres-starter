const request = require("supertest");
const app = require("../../../app");
const User = require("../../user/user.model");
const { JWT_PAYLOAD, JWT_HEADER } = require("../../../test/utils");
const { buildUser } = require("../../../test/mocks");

// // // //

const API_ROOT = "/api/auth";

describe("Auth API", () => {
    describe("POST /api/auth/register", () => {
        let newUserOne = buildUser();
        let newUserTwo = buildUser();

        // Creates newUserOne record before running tests
        before(() => {
            let user = new User(newUserOne);
            return user.save();
        });

        // Destroys user records after running tests
        after(async () => {
            await User.deleteOne({ email: newUserOne.email });
            return User.deleteOne({ email: newUserTwo.email });
        });

        // Valid user registration
        it("should register user", done => {
            request(app)
                .post(API_ROOT + "/register")
                .send(newUserTwo)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // User already exists - return 409 Conflict
        it("should NOT register user", done => {
            request(app)
                .post(API_ROOT + "/register")
                .send(newUserOne)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    describe("POST /api/auth/login", () => {
        // Creates loginUser record before running tests
        let loginUser = buildUser();
        before(() => {
            let user = new User(loginUser);
            return user.save();
        });

        // Destroys loginUser record after running tests
        after(() => {
            return User.deleteOne({ email: loginUser.email });
        });

        // Valid user authentication
        it("should authenticate user", done => {
            // Pulls email & password from loginUser
            const { email, password } = loginUser;

            request(app)
                .post(API_ROOT + "/login")
                .send({ email, password })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // Invalid password
        it("should NOT authenticate user", done => {
            // Pulls email & password from loginUser, defines invalid password
            const { email } = loginUser;
            const password = "not-actually-the-password";

            request(app)
                .post(API_ROOT + "/login")
                .send({ email, password })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    describe("POST /api/auth/forgot_password", () => {
        let user = buildUser();

        // Creates user record before running tests
        before(() => {
            return new User(user).save();
        });

        // Destroys user record after running tests
        after(() => {
            return User.deleteOne({ email: user.email });
        });

        // User exists, valid request
        it("valid email should return 200", done => {
            request(app)
                .post(API_ROOT + "/forgot_password")
                .send({ email: user.email })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // User does not exist, invalid request
        it("unregistered email should return 400", done => {
            request(app)
                .post(API_ROOT + "/forgot_password")
                .send({ email: buildUser().email })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // Email parameter is missing, invalid request
        it("missing email should return 400", done => {
            request(app)
                .post(API_ROOT + "/forgot_password")
                .send({ email: "" })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    describe("POST /api/auth/reset_password", () => {
        // Scopes user for use inside `it` block
        let user;
        let userData = buildUser();

        // Creates userData record before running tests
        before(() => {
            user = new User(userData);
            return user.generatePasswordResetToken();
        });

        // Destroys userData record after running tests
        after(() => {
            return User.deleteOne({ email: userData.email });
        });

        // Sends valid password_reset_token
        it("valid user.password_reset_token should return 200", done => {
            request(app)
                .post(API_ROOT + "/reset_password")
                .send({
                    password: "my-new-password",
                    password_reset_token: user.password_reset_token
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // Sends invalid password_reset_token
        it("invalid user.password_reset_token should return 401", done => {
            request(app)
                .post(API_ROOT + "/reset_password")
                .send({
                    password: "my-new-password",
                    password_reset_token: "some-invalid-token"
                })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // Sends invalid request (missing password)
        it("mising password request should return 401", done => {
            request(app)
                .post(API_ROOT + "/reset_password")
                .send({
                    password: "",
                    password_reset_token: user.password_reset_token
                })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });

        // Sends invalid request (missing password_reset_token)
        it("mising password request should return 401", done => {
            request(app)
                .post(API_ROOT + "/reset_password")
                .send({
                    password: "my-new-password",
                    password_reset_token: ""
                })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object);
                    done();
                });
        });
    });

    // // // //

    // TODO - this should be moved to the user.spec.js
    // NOTE - we don't create a database level user for this test
    // We skip this step because in order to possess a valid token,
    // the user must exist in the database. Here we simply pass a valid
    // token in and receive a subset of its verified return value
    // describe('GET /api/auth/profile', () => {
    //   it('should respond with current user', (done) => {
    //     request(app)
    //     .get(API_ROOT + '/profile')
    //     .set('authorization', JWT_HEADER)
    //     .expect(200, JWT_PAYLOAD)
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       res.body.should.be.instanceof(Object);
    //       done();
    //     });
    //   });

    //   it('should NOT respond with current user', (done) => {
    //     const token = "not even close to a valid token are you joking";

    //     request(app)
    //     .get(API_ROOT + '/profile')
    //     .set('authorization', token)
    //     .expect(403)
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       res.body.should.be.instanceof(Object);
    //       done();
    //     });
    //   });
    // });
});
