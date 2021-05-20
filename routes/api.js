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
				//response will be array of book objects
				//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
					return res.status(200).json(Books)
				}else{
					return res.json({error:"Some error"})
				}
			}catch(err){
				console.log(err)
				return res.json({error:err.message})
			}

    })
    
    .post(async function (req, res){
			if(req.body.title){
				let title = req.body.title;
				const newBook = await Book.create({title});
				//response will contain new book object including atleast _id and title
				return res.status(200).json({title:newBook.title,_id:newBook._id})
			}
			return res.status(200).send('missing required field title')
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
				await Book.deleteMany({});
				// await Book.save();
				return res.status(200).send('complete delete successful')
    });



  app.route('/api/books/:id')
    .get( async function (req, res){
				let bookid = req.params.id;
				let foundBook = await Book.findById(bookid).populate("comments");
				if(foundBook){
						 //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
				return res.status(200).json(foundBook)
				}
				return res.status(200).send('no book exists')
    })
    
    .post(async function(req, res){
		
			if(req.body.comment &&req.body.comment !== ""){
				let bookid = req.params.id;
				let comment = req.body.comment;
				let foundBook = await Book.findById(bookid)
				if(foundBook){
					foundBook.comments.push(comment);
					await foundBook.save();
					//json res format same as .get
					return res.status(200).json(foundBook)
				}else{
					return res.status(200).send('no book exists')
				}
			
			}else{
				return res.status(200).send('missing required field comment')
			}
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
			const deletedBook = await Book.findByIdAndDelete(bookid);
			if(deletedBook){
				return res.status(200).send('delete successful')
      //if successful response will be 'delete successful'
			}
			return res.status(200).send('no book exists')
    });
  
};
