'use strict';

var express = require('express'); 

var router = require('./api');

var app = express();

require('./database'); 
require('./seed');

app.use('/', express.static('public'));

app.use('/api', router); 

app.listen(3000, function() {
	console.log('Server is running on port 3000');
})
