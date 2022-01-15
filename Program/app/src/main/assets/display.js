const Display = function(canvas)
{

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");


  this.drawMap = function (image, imageColumns, map, mapColumns, tileSize)
  {
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

  this.drawObject = function(image, sourceX, sourceY, destinationX, destinationY, width, height)
  {
        this.buffer.drawImage(image, sourceX, sourceY, width, height, Math.round(destinationX), Math.round(destinationY), width, height);
  };


  this.resize = function(width, height, heightWidthRatio)
  {

    if (height / width > heightWidthRatio)
    {

      this.context.canvas.height = width * heightWidthRatio;
      this.context.canvas.width = width;

    } else
    {

      this.context.canvas.height = height;
      this.context.canvas.width = height / heightWidthRatio;

    }

    this.context.imageSmoothingEnabled = false;

  };

};


Display.prototype =
{

  constructor : Display,

  render:function()
  {
       this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  },

};