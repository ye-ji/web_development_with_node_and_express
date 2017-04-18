var fortunes = [
	'Conquer your fears or the will conquer you',
	'Rivers need springs.',
	'Do not fear what you don\'t know',
	'You will have a pleasant surprise'
];

exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortunes.length);
	return fortunes[idx];
};