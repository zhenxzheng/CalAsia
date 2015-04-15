var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	eventType:String,
	externalLink:String,
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
	description:String,//
	image:[String],
	speakers:[String],
	price:Number,//
	memberPrice:Number,
	sponsors:[String],
	regLink:String,
	registration:{
		url:String,
		date:{
			full:Date,
			string:String
		}
	},
	year:Number,
	past:Boolean
})
exports.Event = mongoose.model('Event',EventSchema);

var UpdateSchema = new mongoose.Schema({
	title:String,//
	date:{//
		full:Date,
		string:String,
	},
	description:String
})
exports.Update = mongoose.model('Update',UpdateSchema);

var BlogSchema = new mongoose.Schema({
	title:String,//
	date:{//
		full:Date,
		string:String,
	},
	text:String
})
exports.Blog = mongoose.model('Blog',BlogSchema);