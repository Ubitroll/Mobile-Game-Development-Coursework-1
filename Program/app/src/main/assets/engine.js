const Engine = function(time_step, update, render) {


    this.accumulated_time        = 0;// Amount of time that's accumulated since the last update.
    this.animation_frame_request = undefined,
    this.time                    = undefined,// Most recent timestamp
    this.time_step               = time_step,

    this.updated = false;// Whether or not the update function has been called since the last cycle.

    this.update = update;
    this.render = render;

    // This is one cycle of the game loop
    this.run = function(time_stamp)
    {


        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
        this.accumulated_time += time_stamp - this.time;
        this.time = time_stamp;


        if (this.accumulated_time >= this.time_step * 3)
        {

            this.accumulated_time = this.time_step;

        }

        // If enough time has passed to meet or exceed the time step then set game to update
        while(this.accumulated_time >= this.time_step)
        {
            // If the game has updated, we need to draw it again.
            this.accumulated_time -= this.time_step;
            this.update(time_stamp);
            this.updated = true;

        }

        //This allows us to only draw when the game has updated.
        if (this.updated) {

          this.updated = false;
          this.render(time_stamp);

        }



    };

    this.handleRun = (time_step) => { this.run(time_step); };

};

// Inherit a start and stop function
Engine.prototype = {

  constructor:Engine,

  start:function() {

    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

  },

  stop:function() { window.cancelAnimationFrame(this.animation_frame_request); }

};