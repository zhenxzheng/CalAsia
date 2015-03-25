models = require("../models");

exports.events = function(req, res){
	checkPastEvents();
	models.Event
		.find()
		.sort('-date.full')
		.exec(renderEvents);
	function renderEvents (err, events){
		if(err) console.log(err);
		res.json(events);
	}
}
exports.upcomingEvents = function (req, res){
	checkPastEvents();
	models.Event
		.find({past:false})
		.sort('-date.full')
		.exec(renderEvents);
	function renderEvents (err, events){
		if(err) console.log(err);
		res.json(events);
	}
}
exports.pastEvents = function(req, res){
	checkPastEvents();
	models.Event
		.find({past:true})
		.sort('-date.full')
		.exec(renderEvents);
	function renderEvents (err, events){
		if(err) console.log(err);
		res.json(events);
	}
}
exports.oneEvent=function(req,res){
	var id = req.params.id
	models.Event
		.findOne({'_id':id})
		.exec(callback);
	function callback(err,result){
		if(err){
			console.log(err);
			res.json(false);
		}
		var today = new Date();
		if (today > new Date(result.date.full)){
			result.past = true;
			result.save(function(err){
				if(err) res.send(500);
			})
		}
		res.json({event:result});
    }
}

exports.addEvent = function (req, res){
	var newEvent = new models.Event(req.body);
	newEvent.save(afterSaving);
	function afterSaving(err){
		if(err){
			console.log(err);
			res.send(500);
		}
		res.json(newEvent);
	}
}
exports.editEvent = function (req, res){
	var id = req.params.id
	models.Event
		.findOne({'_id':id})
		.exec(callback);
	function callback(err, result){
		if(err) console.log(err);
	    if(!result) res.json(false);
	    else{
	    	result.eventType = req.body.eventType;
			result.name = req.body.name;
			result.date.full = req.body.date.full;
			result.date.string = req.body.date.string;
			result.eventTime.full = req.body.eventTime.full;
			result.eventTime.string = req.body.eventTime.string;
			result.location = req.body.location;
			result.capacity = req.body.capacity;
			result.description = req.body.description;
			result.image = req.body.image;
			result.speakers = req.body.speakers;
			result.price = req.body.price;
			result.sponsor = req.body.sponsor;
			result.regLink = req.body.regLink;
			result.schedule = req.body.schedule;
			result.registration.url = req.body.registration.url;
			result.registration.date = req.body.registration.date;
			result.past = req.body.past;
			result.save(function(err){
				if(err) res.send(500);
				res.json(true);
			});
	    }
	}
}
exports.deleteEvent = function (req, res){
	var id = req.params.id
	models.Event
		.findOne({'_id':id})
		.remove()
		.exec(afterRemove);
	function afterRemove(err, event){
		if(err){
			console.log(err);
			res.json(false);
		}
		res.json(true);
	}
}

function checkPastEvents(){
	models.Event
		.find({past:false})
		.sort('-date.full')
		.exec(renderEvents);
	function renderEvents (err, events){
		if(err) {
			console.log(err);
			return false;
		}
		var today = new Date();
		events.forEach(function(item, i){
			if (today > new Date(item.date.full)){
				item.past = true;
				item.save(function(err){
					if(err) res.send(500);
				})
			}
		})
	}
}