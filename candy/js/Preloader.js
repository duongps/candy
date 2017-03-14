Candy.Preloader = function(game){
};

Candy.Preloader.prototype = {
	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = '#2FC8DD';

		this.load.spritesheet('btnStart','img/btnstart.png', 220, 50);

		this.game.load.image('blue', 'img/gemblue.png');
    this.game.load.image('green', 'img/gemgreen.png');
    this.game.load.image('red', 'img/gemred.png');
    this.game.load.image('yellow', 'img/gemyellow.png');
	},

	create: function(){
		// start the MainMenu state
		this.state.start('MainMenu');
	}
};
