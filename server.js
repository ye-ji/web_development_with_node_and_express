var express = require('express');
var app = express();
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main'});

app.set('port', process.env.PORT || 3000)
	.engine('handlebars', handlebars.engine)
	.set('view engine', 'handlebars')
	// static 파일 전송
	.use(express.static(__dirname + '/public'));


var fortunes = [
	'Conquer your fears or the will conquer you',
	'Rivers need springs.',
	'Do not fear what you don\'t know',
	'You will have a pleasant surprise'
];



// Route
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	var randomeFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', {fortune: randomeFortune});
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