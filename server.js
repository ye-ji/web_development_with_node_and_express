var express = require('express');
var fortune = require('./lib/fortune.js');
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


// credential
var credentials = require('./credentials');

app.use(require('cookie-parser')(credentials.coockieSecret));
// session
app.use(require('express-session')());
/*app.use(require('express-session')({
    resave: false,
    saveUninitialize: false,
    secret: credentials.coockieSecret
}));*/


// body-parser
app.use(require('body-parser')());


// middleware
// test mode
app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});


// flash message middleware
app.use(function(req, res, next) {
    // 플래시 메세지가 있다면 콘텍스트에 전달한 다음 지웁니다.
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

app.post('/newsletter', function(req, res) {
    var name = req.body.name || '',
        email = req.body.email || '';
    // 입력 유효성 검사
    if(!email.match(VALID_EMAIL_REGEX)) {
        if(req.xhr)
            return res.json({error: 'Invalid name email adress.'});
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid!',
        };
        return res.redirect(303, '/newsletter/archive');
    }

    // NewsletterSignup은 내가 만들게 될 객체 예제!
    // 프로젝트에따라 정확한 구현 내용이나 인터페이스는 모두 달라질테고, 그건 나의 몫!
    // 일반적인 익스프레스 프로그램이어떤모양인지 참고만 하시게나!
    new NewsletterSignup({name: name, email: email}).save(function (err)  {
       if(err) {
           if(req.xhr) return res.json({error: 'Database error'});
           req.session.flash ={
               type: 'danger',
               intro: 'Database error',
               message: 'There was a database error; please try again later',
           }
           return res.redirect(303, '/newsletter/archive');
       }

       if(req.xhr) return res.json({success: true});
       req.session.flash = {
           type: 'success',
           intro: 'Thank you!',
           message: 'You have now been signed up for the newsletter',
       };
       return res.redirect(303, '/newsletter/archive');
    });
})






// mocked weather data
function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

// middleware to add weather data to context
app.use(function(req, res, next){
    if(!res.locals.partialsData) res.locals.partialsData = {};
    res.locals.partialsData.weather = getWeatherData();
    next();
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

app.get('/tours/hood-river', function(req, res) {
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

app.get('/jquery-test', function(req, res){
    res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});



app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.get('/newsletter', function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
})


// formidable for file upload
var formidable = require('formidable');
app.get('/contest/vacation-photo', function(req, res){
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});


app.post('/contest/vacation-photo/:year/:month', function(req, res) {
   var form = new formidable.IncomingForm();
   form.parse(req, function(err, fields, files) {
       if(err) return res.redirect(303, '/error');
       console.log('received fields:');
       console.log(fields);
       console.log('received files:');
       console.log(files);
       res.redirect(303, '/thank-you');
   })
});

// ajax file upload
var jqupload = require('jquery-file-upload-middleware');
app.use('/upload', function(req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function() {
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function () {
            return '/uploads/' + now;
        }
    })(req, res, next);
});

app.post('/process', function(req, res){

    /*console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);*/

    if(req.xhr || req.accepts('json,html')==='json'){
        res.send({success: true});
        // 에러가 있다면, {error: 'error description'} 을 보냅니다.
    } else {
        res.redirect(303, '/thank-you');
    }
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


