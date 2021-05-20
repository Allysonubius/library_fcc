const mongoose 			= require('mongoose');
const Schema 	 			= mongoose.Schema;
// const CommentSchema = new Schema({
// 	type:String
// })
const BookSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	comments:{type:Array}
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
	id:false
});
BookSchema.virtual('commentcount').get(function(){
	return this.comments.length
})
const Book = mongoose.model('Book',BookSchema);

module.exports = Book;