window.addEventListener("load", function(evt)
{
    "use strict";



    const AssetManager = function()
    {
        this.tileSetImage = undefined;
    };

    AssetManager.prototype =
    {
        constructor: Game.AssetManager,
        getImage: function(fileLocation, callback)
        {
            this.tileSetImage = new Image();

            this.tileSetImage.addEventListener("load", function(evt)
            {
                callback();
            }, {once: true});

            this.tileSetImage.src = fileLocation;
        },
    };

    var keyDownUp = function(evt)
    {
        controller.keyDownUp(evt.type, evt.keyCode);
    };

    var resize = function(evt)
    {
        display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
        display.render();

        var rectangle = display.context.canvas.getBoundingClientRect();

        collectibleParagraph.style.left = rectangle.left + "px";
        collectibleParagraph.style.top = rectangle.top + "px";
        collectibleParagraph.style.fontStyle = game.world.tileSet.tileSize * rectangle.height / game.world.height + "px";
    };

    var render = function()
    {


        display.drawMap(assetManager.tileSetImage, game.world.tileSet.columns, game.world.graphicsMap, game.world.columns, game.world.tileSet.tileSize);

        var frame = undefined;

        frame = game.world.tileSet.frames[game.world.player.frameValue];

        display.drawObject(assetManager.tileSetImage,
        frame.x, frame.y,
        game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5 + frame.offsetX),
        game.world.player.y + frame.offsetY, frame.width, frame.height);
        length



        collectibleParagraph.innerHTML = "Arrow keys to move. :) ";

        display.render();
    };

    var update = function()
    {
        if (controller.left.active)  { game.world.player.moveLeft();  }
        if (controller.right.active) { game.world.player.moveRight(); }
        if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }

        game.update();
    };


    var assetManager = new AssetManager();
    var controller = new Controller();
    var display    = new Display(document.querySelector("canvas"));
    var game       = new Game();
    var engine     = new Engine(1000/30, render, update);

    var collectibleParagraph = document.createElement("p");
    collectibleParagraph.setAttribute("style", "color: #c05888; font-size: 2.0em; position: fixed;");
    collectibleParagraph.innerHTML = "Collectibles: 0";
    document.body.appendChild(collectibleParagraph);

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
    display.buffer.imageSmoothingEnabled = false;

    game.world.setup();
    assetManager.getImage("GroundTileset.png" , () =>
    {

        resize();
        engine.start();
    });


    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup",   keyDownUp);
    window.addEventListener("resize",  resize);

});