var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Events = require("./models/events");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// Database connection
var db_url = "mongodb://madhav:madhav7@ds021943.mlab.com:21943/eventure001";
var db_url_local = "mongodb://localhost/events";
mongoose.connect(db_url, function(){
	console.log("Connected to database successfully.");
});

var router = express.Router();
//middleware definations
router.use(function(req, res, next){
	console.log("processing..");
	next();
});

router.get('/', function(req, res){
	res.json({
		message: "welcome to eventure app rest api."
	});
});

// genre route
router.route('/events')
.post(function(req, res){
	var event = new Events(req.body);

	event.save(function(err, data){
		if(err){
			res.send(err);
		}
		res.json(data);
	})
})
.get(function(req, res){
	Events.find(function(err, data){
		if(err){
			res.send(err);
		}
		res.json(data);
	})
});

// Single Route
router.route('/events/:id')
.get(function(req, res){
	Events.findById(req.params.id, function(err, data){
		if(err){
			 res.send(err);
		}
		res.json(data);
	});
})
.put(function(req, res){
	Events.findById(req.params.id, function(err, data){
		if(err){
			res.send(err);
		}
		data.name = req.body.name;

		data.save(function(err, data){
			if(err){
				res.send(err);
			}
			res.json(data);
		});
	});
})
.delete(function(req, res){
	Events.remove({
		_id: req.params.id
	}, function(err, data){
		if(err){
			res.send(err);
		}
		res.json({message: "Event Deleted"});
	});
});

app.use('/api', router);
 
app.listen(port);

console.log("connected");
