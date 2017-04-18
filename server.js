var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main'});

app.set('port', process.env.PORT || 3000)
	.engine('handlebars', handlebars.engine)
	.set('view engine', 'handlebars')
	// static 파일 전송
	.use(express.static(__dirname + '/public'));






// Route
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	var randomeFortune = 
	res.render('about', {fortune: fortune.getFortune()});
});

app.use(function(req, res, next) {
	res.status(404);
	res.render('404') 
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500') 
});

app.listen(app.get('port'), function() {
	console.log('Express statred on port ' + app.get('port'));

}) 