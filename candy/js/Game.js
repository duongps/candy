Candy.Game = function(game){
};

Candy.Game.prototype = {
	create: function(){
		var me = this;

		//Declare assets that will be used as tiles
		me.tileTypes = [
				'blue',
				'green',
				'red',
				'yellow'
		];

		//Keep track of the users score
		me.score = 0;

		//Keep track of the tiles the user is trying to swap (if any)
		me.activeTile1 = null;
		me.activeTile2 = null;

		//Controls whether the player can make a move or not
		me.canMove = false;

		//Grab the weigh and height of the tiles (assumes same size for all tiles)
		me.tileWidth = me.game.cache.getImage('blue').width;
		me.tileHeight = me.game.cache.getImage('blue').height;

		console.log("me.tileWidth: " + me.tileWidth);
		console.log("me.tileHeight: " + me.tileHeight);

		//This will hold all of the tile sprites
		me.tiles = me.game.add.group();

		//Initialise tile grid, this array will hold the positions of the tiles
		//Create whatever shape you'd like
		me.tileGrid = [
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null]
		];

		//margin left for tile group
		me.tileMarginLeft = (me.world.width - me.tileWidth * me.tileGrid.length) / 2;
		me.tileMarginTop = (me.world.height - me.tileHeight * me.tileGrid.length) / 2;

		//Create a random data generator to use later
		var seed = Date.now();
		me.random = new Phaser.RandomDataGenerator([seed]);

		me.initTiles();

		me.createScore();
	},

	initTiles: function(){
    var me = this;

    //Loop through each column in the grid
    for(var i = 0; i < me.tileGrid.length; i++){
        //Loop through each position in a specific column, starting from the top
        for(var j = 0; j < me.tileGrid.length; j++){

            //Add the tile to the game at this grid position
            var tile = me.addTile(i, j);

            //Keep a track of the tiles position in our tileGrid
            me.tileGrid[i][j] = tile;
        }
    }

    //Once the tiles are ready, check for any matches on the grid
    me.game.time.events.add(600, function(){
				console.log('initTiles checkMatch');
        me.checkMatch();
    });
	},

	addTile: function(x, y){
    var me = this;

    //Choose a random tile to add
    var tileToAdd = me.tileTypes[me.random.integerInRange(0, me.tileTypes.length - 1)];

    //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
    var tile = me.tiles.create(me.tileMarginLeft + (x * me.tileWidth) + me.tileWidth / 2, me.tileMarginTop, tileToAdd);

    //Animate the tile into the correct vertical position
    me.game.add.tween(tile).to({y:y*me.tileHeight+(me.tileHeight/2) + me.tileMarginTop}, 500, Phaser.Easing.Linear.In, true)

    //Set the tiles anchor point to the center
    tile.anchor.setTo(0.5, 0.5);

    //Enable input on the tile
    tile.inputEnabled = true;

    //Keep track of the type of tile that was added
    tile.tileType = tileToAdd;

    //Trigger the tileDown function whenever the user clicks or taps on this tile
    tile.events.onInputDown.add(me.tileDown, me);

    return tile;
	},

	tileDown: function(tile, pointer){

    var me = this;

    //Keep track of where the user originally clicked
		console.log('tileDown canMove: ' + me.canMove);
    if(me.canMove){
        me.activeTile1 = tile;

        me.startPosX = (tile.x - me.tileMarginLeft - me.tileWidth/2) / me.tileWidth;
        me.startPosY = (tile.y - me.tileMarginTop - me.tileHeight/2) / me.tileHeight;
    }
	},

	update: function() {

    var me = this;

    //The user is currently dragging from a tile, so let's see if they have dragged
    //over the top of an adjacent tile
    if(me.activeTile1 && !me.activeTile2){
        //Get the location of where the pointer is currently
        var hoverX = me.game.input.x;
        var hoverY = me.game.input.y;

        //Figure out what position on the grid that translates to
        var hoverPosX = Math.floor((hoverX - me.tileMarginLeft)/me.tileWidth);
        var hoverPosY = Math.floor((hoverY - me.tileMarginTop)/me.tileHeight);

        //See if the user had dragged over to another position on the grid
        var difX = (hoverPosX - me.startPosX);
        var difY = (hoverPosY - me.startPosY);

        //Make sure we are within the bounds of the grid
        if(!(hoverPosY > me.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > me.tileGrid.length - 1 || hoverPosX < 0)){

            //If the user has dragged an entire tiles width or height in the x or y direction
            //trigger a tile swap
						console.log('Math.abs(difX): ' + Math.abs(difX));
						console.log('difY: ' + difY);
            if((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY ==0)){

                //Prevent the player from making more moves whilst checking is in progress
                me.canMove = false;

                //Set the second active tile (the one where the user dragged to)
                me.activeTile2 = me.tileGrid[hoverPosX][hoverPosY];

                //Swap the two active tiles
								console.log("swapTiles 158");
                me.swapTiles();

                //After the swap has occurred, check the grid for any matches
                me.game.time.events.add(500, function(){
										console.log('update checkMatch');
                    me.checkMatch();
                });
            }

        }

    }
	},

	swapTiles: function(){
		console.log('swapTiles');
    var me = this;

    //If there are two active tiles, swap their positions
    if(me.activeTile1 && me.activeTile2){

        var tile1Pos = {x:(me.activeTile1.x - me.tileMarginLeft - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile1.y - me.tileMarginTop - me.tileHeight / 2) / me.tileHeight};
        var tile2Pos = {x:(me.activeTile2.x - me.tileMarginLeft - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile2.y - me.tileMarginTop - me.tileHeight / 2) / me.tileHeight};

        //Swap them in our "theoretical" grid
				console.log("tile1Pos.x: " + tile1Pos.x);
				console.log("tile1Pos.y: " + tile1Pos.y);

				console.log("tile2Pos.x: " + tile2Pos.x);
				console.log("tile2Pos.y: " + tile2Pos.y);

        me.tileGrid[tile1Pos.x][tile1Pos.y] = me.activeTile2;
        me.tileGrid[tile2Pos.x][tile2Pos.y] = me.activeTile1;

        //Actually move them on the screen
        me.game.add.tween(me.activeTile1).to({x:tile2Pos.x * me.tileWidth + (me.tileWidth/2) + me.tileMarginLeft,
					y:tile2Pos.y * me.tileHeight + (me.tileHeight/2) + me.tileMarginTop}, 200, Phaser.Easing.Linear.In, true);
        me.game.add.tween(me.activeTile2).to({x:tile1Pos.x * me.tileWidth + (me.tileWidth/2) + me.tileMarginLeft,
					y:tile1Pos.y * me.tileHeight + (me.tileHeight/2) + me.tileMarginTop}, 200, Phaser.Easing.Linear.In, true);

        me.activeTile1 = me.tileGrid[tile1Pos.x][tile1Pos.y];
        me.activeTile2 = me.tileGrid[tile2Pos.x][tile2Pos.y];

    }

},

checkMatch: function(){

    var me = this;

    //Call the getMatches function to check for spots where there is
    //a run of three or more tiles in a row
		console.log('getMatches');
    var matches = me.getMatches(me.tileGrid);
		console.log('matches.length: ' + matches.length);

    //If there are matches, remove them
    if(matches.length > 0){

        //Remove the tiles
        me.removeTileGroup(matches);

        //Move the tiles currently on the board into their new positions
        me.resetTile();

        //Fill the board with new tiles wherever there is an empty spot
        me.fillTile();

        //Trigger the tileUp event to reset the active tiles
        me.game.time.events.add(500, function(){
            me.tileUp();
        });

        //Check again to see if the repositioning of tiles caused any new matches
        me.game.time.events.add(600, function(){
						console.log('continue checkMatch');
            me.checkMatch();
        });

    }
    else {

        //No match so just swap the tiles back to their original position and reset
				console.log("swapTiles 235");
        me.swapTiles();
        me.game.time.events.add(500, function(){
            me.tileUp();
            me.canMove = true;
        });
    }
	},

	tileUp: function(){

    //Reset the active tiles
    var me = this;
    me.activeTile1 = null;
    me.activeTile2 = null;

	},

	getMatches: function(tileGrid){

    var matches = [];
    var groups = [];

    //Check for horizontal matches
    for (var i = 0; i < tileGrid.length; i++)
    {
        var tempArr = tileGrid[i];
        groups = [];
        for (var j = 0; j < tempArr.length; j++)
        {
            if(j < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2])
                {
                    if (tileGrid[i][j].tileType == tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType == tileGrid[i][j+2].tileType)
                    {
                        if (groups.length > 0)
                        {
                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1)
                        {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i][j+1]) == -1)
                        {
                            groups.push(tileGrid[i][j+1]);
                        }
                        if (groups.indexOf(tileGrid[i][j+2]) == -1)
                        {
                            groups.push(tileGrid[i][j+2]);
                        }
                    }
                }
        }
        if(groups.length > 0) matches.push(groups);
    }

    //Check for vertical matches
    for (j = 0; j < tileGrid.length; j++)
    {
        var tempArr = tileGrid[j];
        groups = [];
        for (i = 0; i < tempArr.length; i++)
        {
            if(i < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i+1][j] && tileGrid[i+2][j])
                {
                    if (tileGrid[i][j].tileType == tileGrid[i+1][j].tileType && tileGrid[i+1][j].tileType == tileGrid[i+2][j].tileType)
                    {
                        if (groups.length > 0)
                        {
                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1)
                        {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i+1][j]) == -1)
                        {
                            groups.push(tileGrid[i+1][j]);
                        }
                        if (groups.indexOf(tileGrid[i+2][j]) == -1)
                        {
                            groups.push(tileGrid[i+2][j]);
                        }
                    }
                }
        }
        if(groups.length > 0) matches.push(groups);
    }

    return matches;
	},

	removeTileGroup: function(matches){

	    var me = this;

	    //Loop through all the matches and remove the associated tiles
	    for(var i = 0; i < matches.length; i++){
	        var tempArr = matches[i];

	        for(var j = 0; j < tempArr.length; j++){

	            var tile = tempArr[j];
	            //Find where this tile lives in the theoretical grid
	            var tilePos = me.getTilePos(me.tileGrid, tile);

	            //Remove the tile from the screen
	            me.tiles.remove(tile);

	            //Increase the users score
	            me.incrementScore();

	            //Remove the tile from the theoretical grid
	            if(tilePos.x != -1 && tilePos.y != -1){
	                me.tileGrid[tilePos.x][tilePos.y] = null;
	            }

	        }
	    }
	},

	getTilePos: function(tileGrid, tile)
	{
    var pos = {x:-1, y:-1};

    //Find the position of a specific tile in the grid
    for(var i = 0; i < tileGrid.length ; i++)
    {
        for(var j = 0; j < tileGrid[i].length; j++)
        {
            //There is a match at this position so return the grid coords
            if(tile == tileGrid[i][j])
            {
                pos.x = i;
                pos.y = j;
                break;
            }
        }
    }

    return pos;
	},

	resetTile: function(){

    var me = this;

    //Loop through each column starting from the left
    for (var i = 0; i < me.tileGrid.length; i++)
    {

        //Loop through each tile in column from bottom to top
        for (var j = me.tileGrid[i].length - 1; j > 0; j--)
        {

            //If this space is blank, but the one above it is not, move the one above down
            if(me.tileGrid[i][j] == null && me.tileGrid[i][j-1] != null)
            {
                //Move the tile above down one
                var tempTile = me.tileGrid[i][j-1];
                me.tileGrid[i][j] = tempTile;
                me.tileGrid[i][j-1] = null;

                me.game.add.tween(tempTile).to({y:me.tileMarginTop + (me.tileHeight*j)+(me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);

                //The positions have changed so start this process again from the bottom
                //NOTE: This is not set to me.tileGrid[i].length - 1 because it will immediately be decremented as
                //we are at the end of the loop.
                j = me.tileGrid[i].length;
            }
        }
    }
	},

	fillTile: function(){

    var me = this;

    //Check for blank spaces in the grid and add new tiles at that position
    for(var i = 0; i < me.tileGrid.length; i++){

        for(var j = 0; j < me.tileGrid.length; j++){

            if (me.tileGrid[i][j] == null)
            {
                //Found a blank spot so lets add animate a tile there
                var tile = me.addTile(i, j);

                //And also update our "theoretical" grid
                me.tileGrid[i][j] = tile;
            }

        }
    }
	},

	createScore: function(){

    var me = this;
    var scoreFont = "50px Arial";

    me.scoreLabel = me.game.add.text(me.world.width - 10, 10, "0", {font: scoreFont, fill: "#fff"});
    me.scoreLabel.anchor.setTo(1, 0);
    me.scoreLabel.align = 'center';
	},

	incrementScore: function(){
	  var me = this;

	  me.score += 10;
	  me.scoreLabel.text = me.score;
	},


};
