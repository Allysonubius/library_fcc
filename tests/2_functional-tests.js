/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/
// process.env.NODE_ENV === "test"
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../model/Book');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	// this.beforeEach(async()=>{
	// 	await Book.remove({});
	// })
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test.skip('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
				let book = new Book({title:'TEST_BOOK'});
				chai.request(server)
				.post('/api/books')
				.send(book)
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.body, 'title', 'Book should contain title');
					assert.propertyVal(res.body, 'title', 'TEST_BOOK','Books in array should contain title');
					assert.property(res.body, '_id', 'Books should contain _id');
					done();
				});
      });
      
      test('Test POST /api/books with no title given', function(done) {
				chai.request(server)
				.post('/api/books')
				.send({})
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.equal(res.text, 'missing required field title');
					done();
				});
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
				chai.request(server)
				.get('/api/books')
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.isArray(res.body, 'response should be an array');
					assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
					assert.property(res.body[0], 'title', 'Books in array should contain title');
					assert.property(res.body[0], '_id', 'Books in array should contain _id');
					done();
				});
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
				chai.request(server)
						.get('/api/books/ghf89993uu92344')
						.end((err,res)=>{
							if(err) return done(err);
							assert.equal(res.text,'no book exists')
					   done();
						})
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
				let book = new Book({title:'New_Book'});
				book.save((err,book)=>{
					chai.request(server)
					.get(`/api/books/${book._id}`)
					.end((err,res)=>{
						if(err) return done(err);
						assert.equal(res.status,200);
						assert.isObject(res.body,'response should be a book object')
						assert.propertyVal(res.body,'title','New_Book','Book should have "title" property')
						assert.property(res.body,'_id','Book should have unique id')
						assert.isArray(res.body.comments,'"comments" should be an array')
					 done();
					})
				})
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
				let book = new Book({title:"With_comment"});
				book.save((err,b)=>{
					if(err) return done(err);
					chai.request(server)
							.post(`/api/books/${b._id}`)
							.send({id:b._id,comment:'the book with comment'})
							.end((err,res)=>{
								assert.equal(res.status,200)
								assert.isObject(res.body,'response should be a book onject')
								assert.property(res.body,'comments','book has a comments property')
								assert.equal(res.body.comments.length,1);
								assert.equal(res.body.comments[0],'the book with comment')
								done()
							})
				})
        
      });

      test('Test POST /api/books/[id] without comment field', function(done){
				let book = new Book({title:"With_comment"});
				book.save((err,book)=>{
					if(err) return done(err);
					chai.request(server)
							.post(`/api/books/${book._id}`)
							.send({id:book._id})
							.end((err,res)=>{
								assert.equal(res.status,200)
								assert.equal(res.text,'missing required field comment')
								done()
							})
				})
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
				const id = '41224d776a326fb40f000001';
				chai.request(server)
							.post(`/api/books/${id}`)
							.send({id,comment:"comment"})
							.end((err,res)=>{
								assert.equal(res.status,200)
								assert.equal(res.text,'no book exists')
								done()
							})
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
				let book = new Book({title: 'Hello'});
				book.save((err,book)=>{
					if(err) return done(err);
					chai.request(server)
							.delete(`/api/books/${book._id}`)
							.end((err,res)=>{
								if(err) return done(err);
								assert.equal(res.status,200)
								assert.equal(res.text,'delete successful')
								done();
							})
				})
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const id = '41224d776a326fb40f000001';
				chai.request(server)
							.delete(`/api/books/${id}`)
							.end((err,res)=>{
								assert.equal(res.status,200)
								assert.equal(res.text,'no book exists')
								done()
							})
      });

    });

  });

});

