const Game = function()
{
    // Initialise game world
    this.world = new Game.World();

     this.update = function()
    {
        this.world.update();
    };

};

// Inherit constructor
Game.prototype  =
{
    constructor : Game,
};

// Function to initilaise animation
Game.Animator = function(frameSet, delay, mode = "loop")
{
    this.count = 0;
    this.delay = (delay >=1) ? delay : 1;
    this.frameSet = frameSet;
    this.frameIndex = 0;
    this.frameValue = frameSet[0];
    this.mode = mode;
};

// Inherit Constructor and Animations
Game.Animator.prototype  =
{
    constructor: Game.Animator,

    animate: function()
    {
        switch(this.mode)
        {
            case "loop": this.loop(); break;
            case "pause": break;
        }
    },

    changeFrames(frameSet, mode, delay = 10, frameIndex = 0)
    {
        if(this.frameSet === frameSet) {return;}

        this.count = 0;
        this.delay = delay;
        this.frameSet = frameSet;
        this.frameIndex = frameIndex;
        this.frameValue = frameSet[frameIndex];
        this.mode = mode;
    },

    loop:function()
    {
        this.count ++;

        while(this.count > this.delay)
        {
            this.count -= this.delay;
            this.frameIndex = (this.frameIndex < this.frameSet.length - 1) ? this.frameIndex + 1 : 0;

            this.frameValue = this.frameSet[this.frameIndex];
        }
    }
};

// Collider function
Game.Collider = function()
{

    this.collide = function(value, object, tileX, tileY, tileSize)
    {
        // Which value does the tile from the collision map have and trigger collision functions accordingly
        switch(value)
        {

            case  1: this.collideTop      (object, tileY); break;

            case  2: this.collideRight    (object, tileX + tileSize); break;

            case  3: if (this.collideTop  (object, tileY))             return; //If the player is already colliding, there is no need to check
                     this.collideRight    (object, tileX + tileSize); break;

            case  4: this.collideBottom   (object, tileY + tileSize); break;

            case  5: if (this.collideTop  (object, tileY))             return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case  6: if (this.collideRight(object, tileX + tileSize)) return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case  7: if (this.collideTop  (object, tileY))             return;
                     if (this.collideRight(object, tileX + tileSize)) return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case  8: this.collideLeft     (object, tileX );            break;

            case  9: if (this.collideTop  (object, tileY))             return;
                     this.collideLeft     (object, tileX);             break;

            case 10: if (this.collideLeft (object, tileX))             return;
                     this.collideRight    (object, tileX + tileSize); break;

            case 11: if (this.collideTop  (object, tileY))             return;
                     if (this.collideLeft (object, tileX))             return;
                     this.collideRight    (object, tileX + tileSize); break;

            case 12: if (this.collideLeft (object, tileX))             return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case 13: if (this.collideTop  (object, tileY))             return;
                     if (this.collideLeft (object, tileX))             return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case 14: if (this.collideLeft (object, tileX))             return;
                     if (this.collideRight(object, tileX + tileSize)) return;
                     this.collideBottom   (object, tileY + tileSize); break;

            case 15: if (this.collideTop  (object, tileY))             return;
                     if (this.collideLeft (object, tileX))             return;
                     if (this.collideRight(object, tileX + tileSize)) return;
                     this.collideBottom   (object, tileY + tileSize); break;
        }
    }
};

// Inherited collision functions
Game.Collider.prototype   =
{
    constructor: Game.Collider,

    /*
        If the top of the object is above the bottom of a tile (aka inside the tile) and if in the previous frame, the
        top of the object was below the bottom of the tile. This means we have entered into this tile and therefore, have
        collided with it.

    */

    collideTop: function(object, tileTop)
    {
        if(object.getBottom() > tileTop && object.getOldBottom() <= tileTop)
        {
            object.setBottom(tileTop - 0.01 ); //Move the bottom of the player to the top of the tile colliding
                                              //Note the 0.01, this is to resolve rounding issues
            object.velocityY = 0; //Stop moving in the downward direction
            object.jumping = false; //Allow the player to jump again
            return true; //return true as there was a collision
        }
        return false; //otherwise return false since there must have been no collision
    },

    /*
        The rest of the collision functions are similar, with changes for each side of a tile
    */

    collideBottom: function(object, tileBottom)
    {
        if(object.getTop() < tileBottom && object.getOldTop() >= tileBottom)
        {
            object.setTop(tileBottom);
            object.velocityY = 0;
            return true;
        }
        return false;
    },

    collideLeft: function(object, tileLeft)
    {
        if(object.getRight() > tileLeft && object.getOldRight() <= tileLeft)
        {
            object.setRight(tileLeft - 0.01);
            object.velocityX = 0;
            return true;
        }
        return false;
    },

    collideRight: function(object, tileRight)
    {
        if(object.getLeft() < tileRight && object.getOldLeft() >= tileRight)
        {
            object.setLeft(tileRight);
            object.velocityX = 0;
            return true;
        }
        return false;
    }
};

Game.Frame = function(x, y, width, height, offsetX, offsetY)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
};

Game.Frame.prototype  = { constructor: Game.Frame };


Game.Object = function(x,y,width, height)
{
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

};

Game.Object.prototype  =
{
    constructor: Game.Object,

    collideObject:function(object)
    {

      if (this.getRight()  < object.getLeft()  ||
          this.getBottom() < object.getTop()   ||
          this.getLeft()   > object.getRight() ||
          this.getTop()    > object.getBottom()) return false;

      return true;

    },

    collideObjectCenter: function(object)
    {
        let centerX = object.getCenterX();
        let centerY = object.getCenterY();

        if(centerX < this.getLeft() || centerX > this.getRight() ||
           centerY < this.getTop() || centerY > this.getBottom()) return false;

        return true;
    },

     getBottom : function()  { return this.y + this.height;       },
     getCenterX: function()  { return this.x + this.width  * 0.5; },
     getCenterY: function()  { return this.y + this.height * 0.5; },
     getLeft   : function()  { return this.x;                     },
     getRight  : function()  { return this.x + this.width;        },
     getTop    : function()  { return this.y;                     },
     setBottom : function(y) { this.y = y - this.height;          },
     setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
     setCenterY: function(y) { this.y = y - this.height * 0.5;    },
     setLeft   : function(x) { this.x = x;                        },
     setRight  : function(x) { this.x = x - this.width;           },
     setTop    : function(y) { this.y = y;                        }
};


Game.MovingObject =  function(x, y, width, height, velocityMax = 15)
{
    Game.Object.call(this, x, y, width, height);

    this.jumping = false;
    this.velocityMax = velocityMax;
    this.velocityX = 0;
    this.velocityY = 0;
    this.oldX = x;
    this.oldY = y;

};


Game.MovingObject.prototype  =
{


    getOldTop: function(){return this.oldY},
    getOldBottom: function(){return this.oldY + this.height;},
    getOldLeft: function(){return this.oldX;},
    getOldRight: function(){return this.oldX + this.width;},

    setOldTop: function(y) {this.oldY = y;},
    setOldBottom: function(y){this.oldY = y - this.height;},
    setOldLeft: function(x){this.oldX = x;},
    setOldRight: function(x){this.oldX = x - this.width;},

    getOldCenterX: function() {return this.oldX + this.width * 0.5;},
    getOldCenterY: function() {return this.oldY + this.height * 0.5;},
    setOldCenterX: function() {this.oldX = x - this.width * 0.5;},
    setOldCenterY: function() {this.oldY = y - this.height * 0.5;}

};

Object.assign(Game.MovingObject.prototype , Game.Object.prototype );
Game.MovingObject.prototype.constructor = Game.MovingObject;

Game.Collectible = function(x,y)
{
    Game.Object.call(this, x,y,7,14);
    Game.Animator.call(this, Game.Collectible.prototype.frameSets["collectable"], 20);

    this.frameIndex = Math.floor(Math.random()* 2);

    //This section is used to make the collectible move in place
    this.baseX = x;
    this.baseY = y;
    this.posX = Math.random() * Math.PI * 2;
    this.posY = this.posX * 2;
};

Game.Collectible.prototype  =
{
    frameSets: {"collectable":[12,13]},

    updatePos: function()
    {
        this.posX += 0.1;
        this.posY += 0.2;

        this.x = this.baseX + Math.cos(this.posX) * 2;
        this.y = this.basY + Math.sin(this.posY);
    }
};

Object.assign(Game.Collectible.prototype , Game.Animator.prototype );
Object.assign(Game.Collectible.prototype , Game.Object.prototype );

Game.Collectible.prototype.constructor = Game.Collectible;


Game.Grass = function(x,y)
{
    Game.Animator.call(this, Game.Grass.prototype.frameSets["move"], 20);

    this.x = x;
    this.y = y;

};

Game.Grass.prototype  =
{
    frameSets: { "move": [14,15,16,15]}
};

Object.assign(Game.Grass.prototype, Game.Animator.prototype );

Game.Player = function(x, y)
{
    Game.MovingObject.call(this, x, y, 7,12);

    Game.Animator.call(this, Game.Player.prototype .frameSets["idleLeft"], 10);

    this.jumping = true;
    this.directionX = -1;

    this.velocityX = 0;
    this.velocityY = 0;

};

Game.Player.prototype =
{

    frameSets:
    {
        "idleLeft" : [0],
        "jumpLeft" : [1],
        "moveLeft" : [2,3,4,5],

        "idleRight" : [6],
        "jumpRight" : [7],
        "moveRight" : [8,9,10,11]
    },


    jump:function()
    {
        if (!this.jumping)
        {
            this.jumping = true;
            this.velocityY -= 13;
        }
    },

    //Remember to update the player direction
    moveLeft:function()  { this.directionX = -1; this.velocityX -= 0.5; },
    moveRight:function() { this.directionX = 1; this.velocityX += 0.5; },

    updateAnimation: function()
    {
    //This section checks to see what way the player is moving and with that information it displays the correct sprite
        if(this.velocityY < 0)
        {
            if(this.directionX < 0)
            {
                this.changeFrames(this.frameSets["jumpLeft"], "pause");
            }
            else
            {
                this.changeFrames(this.frameSets["jumpRight"], "pause");
            }
        }
        else if(this.directionX < 0)
        {
            if(this.velocityX < -0.1)
            {
                this.changeFrames(this.frameSets["moveLeft"], "loop", 5);
            }
            else
            {
                this.changeFrames(this.frameSets["idleLeft"], "pause");
            }
        }
        else if(this.directionX > 0)
        {
            if(this.velocityX > 0.1)
            {
                this.changeFrames(this.frameSets["moveRight"], "loop", 5);
            }
            else
            {
                this.changeFrames(this.frameSets["idleRight"], "pause");
            }
        }

        this.animate();

    },

    updatePos:function(gravity, friction)
    {
    this.oldX = this.x;
    this.oldY = this.y;

    this.velocityY += gravity;
    this.velocityX *= friction;

    //Cannot exceed the maximum velocity set, this is to stop 'tunneling'
    if (Math.abs(this.velocityX) > this.velocityMax)
    this.velocityX = this.velocityMax * Math.sign(this.velocityX);

    if (Math.abs(this.velocityY) > this.velocityMax)
    this.velocityY = this.velocityMax * Math.sign(this.velocityY);

    this.x    += this.velocityX;
    this.y    += this.velocityY;


    }

};

Object.assign(Game.Player.prototype , Game.MovingObject.prototype );
Object.assign(Game.Player.prototype , Game.Animator.prototype );

Game.Player.prototype .constructor = Game.Player;


Game.TileSet = function(numOfColumns, tileSize )
{
    this.columns = numOfColumns;
    this.tileSize = tileSize;

    let theFrame = Game.Frame;
    // An array of the frames from the spritesheet
    this.frames = [new theFrame(115,  96, 13, 16, 0, -4), // IdleLeft
                   new theFrame( 50,  96, 13, 16, 0, -4), // JumpLeft
                   new theFrame(102,  96, 13, 16, 0, -4), new theFrame(89, 96, 13, 16, 0, -4), new theFrame(76, 96, 13, 16, 0, -4), new theFrame(63, 96, 13, 16, 0, -4), // MoveLeft
                   new theFrame(  0, 112, 13, 16, 0, -4), // IdleRight
                   new theFrame( 65, 112, 13, 16, 0, -4), // JumpRight
                   new theFrame( 13, 112, 13, 16, 0, -4), new theFrame(26, 112, 13, 16, 0, -4), new theFrame(39, 112, 13, 16, 0, -4), new theFrame(52, 112, 13, 16, 0, -4), // MoveRight
                   new theFrame( 81, 112, 14, 16), new theFrame(96, 112, 16, 16), // Collectible
                   new theFrame(112, 115, 16,  4), new theFrame(112, 124, 16, 4), new theFrame(112, 119, 16, 4) // Grass
                  ];
};

Game.TileSet.prototype  = { constructor: Game.TileSet };

Game.World = function(friction = 0.8, gravity = 2)
{


        this.collider = new Game.Collider();

        this.collisionMap = [0,4,4,4,4,0,4,4,0,4,4,0,
                             2,0,0,0,0,10,0,0,14,0,0,8,
                             2,0,0,0,0,10,0,0,0,0,0,8,
                             0,3,0,0,13,4,7,0,0,0,13,0,
                             0,6,0,0,0,0,0,0,0,0,0,8,
                             2,0,0,1,0,0,0,0,11,0,0,8,
                             2,0,0,0,0,0,11,0,10,0,13,0,
                             0,3,0,0,11,0,10,0,10,0,0,8,
                             0,0,1,1,0,1,0,1,0,1,1,0];


        this.graphicsMap = [27,36,35,5,36,25,17,35,44,17,35,5,
                            30,39,39,39,39,11,31,39,19,31,39,7,
                            38,31,39,31,31,11,39,39,39,39,39,7,
                            30,3,31,39,4,23,6,31,31,39,4,14,
                            22,21,39,31,31,39,31,39,31,39,31,20,
                            38,39,39,47,39,31,39,39,3,39,31,12,
                            10,31,31,31,31,39,3,39,11,31,4,46,
                            40,2,39,39,3,39,11,39,11,31,39,8,
                            24,49,2,3,37,27,23,13,11,12,13,8];

        this.friction = friction;
        this.gravity = gravity;

        this.collectible = [];
        this.collectibleCount = 0;

        this.columns   = 12;
        this.rows      = 9;

        this.tileSet = new Game.TileSet(8, 16);
        this.player = new Game.Player(32,76);


        this.height   = this.tileSet.tileSize * this.rows;
        this.width    = this.tileSet.tileSize * this.columns;


};

Game.World.prototype  =
{
    constructor: Game.World,


    collideObject:function(object)
    {
        var top, bottom, left, right, value;

        //console.info("checking");

        top = Math.floor(object.getTop() / this.tileSet.tileSize);
        left = Math.floor(object.getLeft() / this.tileSet.tileSize);
        value = this.collisionMap[top * this.columns + left];
        this.collider.collide(value, object, left * this.tileSet.tileSize, top * this.tileSet.tileSize, this.tileSet.tileSize);

        top = Math.floor(object.getTop() / this.tileSet.tileSize);
        right = Math.floor(object.getRight() / this.tileSet.tileSize);
        value = this.collisionMap[top * this.columns + right];
        this.collider.collide(value, object, right * this.tileSet.tileSize, top * this.tileSet.tileSize, this.tileSet.tileSize);

        bottom = Math.floor(object.getBottom() / this.tileSet.tileSize);
        left = Math.floor(object.getLeft() / this.tileSet.tileSize);
        value = this.collisionMap[bottom * this.columns + left];
        this.collider.collide(value, object, left * this.tileSet.tileSize, bottom * this.tileSet.tileSize, this.tileSet.tileSize);

        bottom = Math.floor(object.getBottom() / this.tileSet.tileSize);
        right = Math.floor(object.getRight() / this.tileSet.tileSize);
        value = this.collisionMap[bottom * this.columns + right];
        this.collider.collide(value, object, right * this.tileSet.tileSize, bottom * this.tileSet.tileSize, this.tileSet.tileSize);

    },

    setup:function()
    {

        this.collectible = [[1, 2], [4, 2], [6, 2], [10, 2], [3, 4], [8, 4], [6, 5], [10, 5], [1, 6], [4, 6]];
        this.grass =    [[2, 7], [3, 7], [5, 7], [7, 7], [9, 7], [10, 7]];


        for(let index = this.collectible.length - 1; index > -1; --index)
        {
            this.collectible[index] = new Game.Collectible(this.collectible[0] * this.tileSet.tileSize + 5, this.collectible[1]* this.tileSet.tileSize - 2);
        }

        for(let index = this.grass.length- 1; index > -1; --index)
        {
            let grass = this.grass[index];
            this.grass[index] = new Game.Grass(grass[0]*this.tileSet.tileSize, grass[1] * this.tileSet.tileSize + 12);
        }
    },

    update:function()
    {
        this.player.updatePos(this.gravity, this.friction);

        this.collideObject(this.player);

        for(let index = this.collectible.length -1; index > -1; --index)
        {
            let collectible = this.collectible[index];

            collectible.updatePos();
            collectible.animate();

            if(collectible.collideObject(this.player))
            {
                this.collectible.splice(this.collectible.indexOf(collectible), 1);
                this.collectibleCount ++;
            }
        }

        for(let index = this.grass.length -1; index > -1; --index)
        {
            let grass = this.grass[index];
            grass.animate();
        }

        this.player.updateAnimation();
    }
};










