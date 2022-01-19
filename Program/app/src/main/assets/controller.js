const Controller = function()
{
    this.left = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up = new Controller.ButtonInput();

    // Controls for keyboard

    // Check the type of button that is down
    this.keyDownUp = function(type, key_code)
    {
        var down = (type == "keydown") ? true : false;

        // Perform different actions depending on the type
        switch(key_code)
        {
            case 37: this.left.getInput(down);
            break;
            case 38: this.up.getInput(down);
            break;
            case 39: this.right.getInput(down);
        }
    };



};




// Inherit constructor
Controller.prototype =
{
    constructor : Controller
};

// Initialise the controller input
Controller.ButtonInput = function()
{
    this.active = this.down = false;
};

// If a button is pushed down set that button to being active
Controller.ButtonInput.prototype =
{
    constructor : Controller.ButtonInput,

    getInput: function(down)
    {
        if(this.down != down) this.active = down;
        this.down = down;
    }
};