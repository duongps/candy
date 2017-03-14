Candy.Preloader = function(game){
};

Candy.Preloader.prototype = {
	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = '#2FC8DD';
	},
	create: function(){
		// start the MainMenu state
		this.state.start('MainMenu');
	}
};
