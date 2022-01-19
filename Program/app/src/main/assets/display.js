const Display = function(canvas)
{
    // Set up buffer and canvas context
    this.buffer  = document.createElement("canvas").getContext("2d"),
    this.context = canvas.getContext("2d");

    // Draw tilemap
    this.drawMap = function (image, imageColumns, map, mapColumns, tileSize)
    {
        // Loop through whole tile map and draw it to screen
        for(let index = map.length - 1; index > -1; -- index)
        {
            let value = map[index];
            let sourceX = (value % imageColumns) * tileSize;
            let sourceY = Math.floor(value / imageColumns) * tileSize;
            let destinationX = (index % mapColumns) * tileSize;
            let destinationY = Math.floor(index / mapColumns) * tileSize;

            this.buffer.drawImage(image, sourceX, sourceY, tileSize, tileSize, destinationX, destinationY, tileSize, tileSize);
        }
    };

    // Draw an Object at given area.
    this.drawObject = function(image, sourceX, sourceY, destinationX, destinationY, width, height)
    {
        this.buffer.drawImage(image, sourceX, sourceY, width, height, Math.round(destinationX), Math.round(destinationY), width, height);
    };

    // Resize canvas to fit the screen
    this.resize = function(width, height, heightWidthRatio)
    {
        // If the current height width ratio is greater than the pre set one
        if (height / width > heightWidthRatio)
        {
            // Resize the canvas to match width
            this.context.canvas.height = width * heightWidthRatio;
            this.context.canvas.width = width;

        } else
        {
            // Resize to match height
            this.context.canvas.height = height;
            this.context.canvas.width = height / heightWidthRatio;

        }

        // Enable smooth transition
        this.context.imageSmoothingEnabled = false;

    };

};

// Inherit a constructor and render function
Display.prototype =
{

    constructor : Display,

    render:function()
    {
        this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
     },

};