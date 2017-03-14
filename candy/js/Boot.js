var Candy = {};
Candy.Boot = function(game){};
Candy.Boot.prototype = {
	preload: function(){
	},

	create: function(){
		// set scale options
		// this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		// start the Preloader state
		this.state.start('Preloader');
	}
};
