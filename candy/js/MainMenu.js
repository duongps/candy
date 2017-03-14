Candy.MainMenu = function(game){
};

Candy.MainMenu.prototype = {
	create: function(){
	},

	startGame: function() {
			// start the Game state
			this.state.start('Game');
	}
};
