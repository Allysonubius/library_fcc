/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../model/Book");


module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
			try{
				const Books = await Book.find({});
				if(Books){
					return res.status(200).json(Books)
				}else{
					return res.json({error:"Some error"})
				}
				//response will be array of book objects
				//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			}catch(err){
				consol.log(err)
				return res.json({error:err.message})
			}

    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
