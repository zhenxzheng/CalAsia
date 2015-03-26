var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	eventType:String,
	name:String,//
	date:{//
		full:Date,
		string:String,
	},
	eventTime:{
		full:Date,
		string:String
	},
	location:String,//
	capacity:Number,
	description:[String],//
	image:[String],
	speakers:[String],
	price:Number,//
	sponsors:[String],
	regLink:String,
	schedule:[String],
	registration:{
		url:String,
		date:{
			full:Date,
			string:String
		}
	},
	past:Boolean
})
exports.Event = mongoose.model('Event',EventSchema);