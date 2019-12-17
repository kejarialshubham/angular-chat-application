var Sentiment = require('sentiment');
var sentiment = new Sentiment();

// var docx = sentiment.analyze("I am good,thanks.");
// console.log(docx);

// Applying to An Array
 var mydocx = ["I love apples","I don't eat pepper","the movie was very nice","this book is the best","Are you stupid?","Who created you?","Go to hell please."]

mydocx.forEach(function(s){
	console.log(sentiment.analyze(s));
})