var express = require('express'),
	five = require("johnny-five"),
	app = express(),
	board, pins,
	setup = {
		fwd: 2,
		back: 3,
		left: 4,
		right: 5
	},
	map = {
		37: "left",
		38: "fwd",
		39: "right",
		40: "back"
	};

app.set('port', 3001);
app.use(express.bodyParser());
app.use(express.static(__dirname+ '/public'));

app.post('/', function(req, res) {
	Object.keys( map ).forEach( function( keyCode ) {
		if ( req.body[ keyCode ] ) {
			pins[ map[ keyCode ] ].high();
		} else {
			pins[ map[ keyCode ] ].low();
		}
	} );
	res.send(req.body);
});

board = new five.Board();
board.on("ready", function() {
	pins = Object.keys( setup ).reduce(function( initialized, pin ) {
		initialized[ pin ] = new five.Pin( setup[pin] ).on("high", function( value ) {
			console.log( pin + " high" );
		}).on("low", function( value ) {
			console.log( pin + " low" );
		});
		return initialized;
	}, {});

	this.repl.inject({
		pins: pins
	});

	app.listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});