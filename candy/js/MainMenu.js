Candy.MainMenu = function(game){
};

Candy.MainMenu.prototype = {
	create: function(){
			//add button start
			this.btnStart = this.add.button(this.world.centerX, 400, 'btnStart', this.startGame, this, 1, 0, 2);
			this.btnStart.anchor.set(0.5);
			this.btnStart.inputEnabled = true;
	},

	startGame: function() {
			// start the Game state
			this.state.start('Game');
	}
};
