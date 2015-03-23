models = require("../models");

exports.events = function(req, res){
	models.Event
		.find()
		.sort('-date')
		.exec(renderEvents);
	function renderEvents (err, events){
		if(err) console.log(err);
		res.json(events);
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