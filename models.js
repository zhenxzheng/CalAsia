var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	name:String,//
	date:{//
		full:Date,
		date:String,
	},
	location:String,//
	description:[String],//
	image:[String],
	speakers:[String],
	price:Number,//
	sponsors:[String],
	regLink:String,
	schedule:[String],
	registration:{
		url:String,
		date:String
	}
})
exports.Event = mongoose.model('Event',EventSchema);