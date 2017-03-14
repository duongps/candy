Candy.MainMenu = function(game){
};

Candy.MainMenu.prototype = {
	create: function(){
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.forceOrientation(false, true);
			this.scale.enterIncorrectOrientation.add(handleIncorrect);
      this.scale.leaveIncorrectOrientation.add(handleCorrect);

			//add button start
			this.btnStart = this.add.button(this.world.centerX, this.world.centerY, 'btnStart', this.startGame, this, 1, 0, 2);
			this.btnStart.anchor.set(0.5);
			this.btnStart.inputEnabled = true;
	},

	handleCorrect: function() {
		if(!game.device.desktop){
				//this.btnStart.x = this.world.centerX;
				//this.btnStart.y = this.world.centerY
     	}
	},

	handleIncorrect: function() {
		if(!game.device.desktop){
     			this.btnStart.x = this.world.centerX;
					this.btnStart.y = this.world.centerY;
     	}
	},

	startGame: function() {
			// start the Game state
			this.state.start('Game');
	}
};
