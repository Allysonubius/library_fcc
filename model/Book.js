const mongoose 			= require('mongoose');
const Schema 	 			= mongoose.Schema;
const CommentSchema = new Schema({
	type:String
})
const BookSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	comments:[{CommentSchema}]
});

const Book = mongoose.model('Book',BookSchema);

module.exports = Book;