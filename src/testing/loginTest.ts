// import chai from 'chai';
// import router from '../routers/userRoute'
// import chaiHttp from 'chai-http'
// //assertion style
// // chai.use('chaiHttp')
// chai.should();

// describe('testing Login API', () => {

//    describe("test if user credentials are valid", () => {
//         // in case of valid credentials and user is found in database

//         it("it should return status code of 200", (done) => {
//             chai
//             .request(router)
//             .post('/user/login')
//             .end((err:any, response:any) => {
//                 response.should.have.status(200);
//                 response.body.should.have.keys('status','token');
//                 done()
//             })
//         })

//         // check if user is not found in database
//         it("it should return status code of 400 with User not found message", (done) => {
//             chai
//             .request(router)
//             .post('/user/login')
//             .end((err:any, response:any) => {
//                 response.should.have.status(400);
//                 response.body.should.have.property('message').equal('User not found')
//                 done()
//             })
//         })


//         // test if password is matching patterner before checking to the database

//         it("it should return status code of 400 with relevant message", (done) => {
//             chai
//             .request(router)
//             .post('/user/login')
//             .end((err:any, response:any) => {
//                 response.should.have.status(400);
//                 response.body.should.have.keys('status','data', 'message');
//                 response.body.should.have.property('message').equal('Please provide a password with At least one special character (@#$%^&+=!), ')
//                 done()
//             })
//         })

//         //check if  username  and password are provided or not
//         it("it should return status code of 400 with message ", (done) => {
//             chai
//             .request(router)
//             .post('/user/login')
//             .end((err:any, response:any) => {
//                 response.should.have.status(400); 
//                 response.body.should.have.keys('status','data', 'message');
//                 response.body.should.have.property('message').equal('User not found')
//                 done()
//             })
//         })
//     })

//     //test if user exists in database
// })

