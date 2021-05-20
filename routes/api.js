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
				console.log(err)
				return res.json({error:err.message})
			}

    })
    
    .post(async function (req, res){
			if(req.body.title){
				let title = req.body.title;
				const newBook = await Book.create({title});
				return res.status(200).json({title:newBook.title,_id:newBook._id})
			}
			return res.status(200).send('missing required field title')
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
			// let _id = req.body._id;
			// const deletedBook = await Book.findByIdAndDelete(_id);
			// return res.status(200).json({message:"Delete a book",deletedBook})
    });



  app.route('/api/books/:id')
    .get( async function (req, res){
      let bookid = req.params.id;
			let foundBook = await Book.findById(bookid).populate("comments");
			return res.status(200).json(foundBook)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
			let foundBook = await Book.findById(bookid).populate("comments");
			foundBook.comments.push(comment);
			await foundBook.save()
      //json res format same as .get
			return res.status(200).json(foundBook)
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
