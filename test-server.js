var express = require('express');
var app = express();

var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        // extname: '.hbs',
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));


// test middleware
app.use(function(req, res, next) {
   console.log('processing request for "' + req.url + '".....');
   next();
});

app.use(function(req, res, next) {
    console.log('terminating request');
    res.send('thankd for playing!');
    // next()를 호출 하지 않음. 요청은 여기서 종료됨!!!!
});

app.use(function(req, res, next) {
    console.log('whoops, i\'ll never get called!');
});



// Route
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});













// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
	res.status(404);
	res.render('404') ;
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express statred on port ' + app.get('port'));
});


