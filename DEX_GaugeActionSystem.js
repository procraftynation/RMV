/*:
 * @plugindesc v2.01 A gauge plugin that is useful in many ways. See help for details.
 * @author Procraftynation - https://github.com/procraftynation
 *
 * @help
 * ============================================================================
 * DOCUMENTATION: (Loooooooong description: help me shorten it)
 *
 * Overview:
 * Gauge Action System captures the OK button pressed down and fills the gauge
 * until the OK button is released. The gauge is emptied when the OK button is 
 * released. Only the system will stop when the lifetime specified is consumed
 * and results are determined. 
 * 
 * As of this version, there are 3 types of gauge:
 *  1. Filling - default. The gauge is being filled when OK button is pressed
 *          and emptied when OK button is released.
 *  2. Moving Cursor - Instead of filling and emptying the gauge, the cursor
 *          moves along the fill image and waits for OK button to be pressed 
 *          at a specified success point.
 *  3. No Action - only requires lifetime. Like a casting gauge only.
 *          If a success point is specified, a random result will be determined
 *          using success point as percentage of success.
 * ============================================================================
 * IMAGE COMPONENTS
 * ============================================================================
 * 1. Fill - part of a gauge that displays how much it is filled.
 * 2. Cursor - part of a gauge that indicates where to fill only (range)
 * 3. Lifetime - similar to Fill image but is filled based on the lifetime specified
 * 4. Background - for aesthetics. Rendered first
 * 5. Foreground - for aesthetics. Rendered last
 * ============================================================================
 * USAGE
 * ============================================================================
 * To setup a gauge, create an event with a script call:
 *   $gameSystem.gauge("gaugeId");
 *   Replace 'gaugeId' to any text. This is used for identifying and managing multiple gauges
 * (see Chained Functions Reference for setup options)
 * Determining Results:
 *   Depending on the type, the results can be placed on a variable: 
 *      1 - success, 2 - failure, 3 - canceled
 *   Also, an alternative and more flexible way is to use:
 *      a. $gameSystem.("gaugeId").isSuccess()
 *      b. $gameSystem.("gaugeId").isFailed()
 *      c. $gameSystem.("gaugeId").isCancelled()
 * 
 * ============================================================================
 * Functions Reference:
 * ============================================================================
 * FILL Options:
 *   $gameSystem.gauge("gaugeId").fill(imageName, offsetX, offsetY);
 *      Sets the fill image of the gauge. Offsets are relative to the background.
 *      Offsets are optional and defaults to 0.
 *   $gameSystem.gauge("gaugeId").fillSpeed(value);
 *      Sets the speed in frames of the filling motion of the gauge. Default 1
 *   $gameSystem.gauge("gaugeId").emptySpeed(value);
 *      Sets the speed in frames of the emptying motion of the gauge. 
 *      If not set, emptySpeed will take fillSpeed's value
 *   $gameSystem.gauge("gaugeId").fillReset();
 *      Sets reset fill to true. The filling motion will return to 0 when gauge 
 *      is filled to the max and OK button is still pressed. Default false.
 *      
 * CURSOR Options:
 *   $gameSystem.gauge("gaugeId").cursor(imageName);
 *      Sets the cursor image of the gauge. Cursor is automatically centered vertically to
 *      the fill image and is positioned horizontally based on the successPoint specified.
 *   $gameSystem.gauge("gaugeId").movingCursor();
 *      Sets the cursor to move along the horizontal width of the fill image.
 *      If this is called, the fill is 'filled' to the max and will wait for OK button to
 *      determine the result based on the successPoint specified.
 *   $gameSystem.gauge("gaugeId").bounceCursor();
 *      Sets the cursor to move back and forth along the horizontal width of the fill image.
 *      This will only take effect if the cursor is moving. 
 *      Default movement is it resets the position to the starting point.
 *   $gameSystem.gauge("gaugeId").cursorStartLeft();
 *      Sets the start position of the moving cursor to the left most part of the fill image.
 *   $gameSystem.gauge("gaugeId").cursorStartRight();
 *      Sets the start position of the moving cursor to the right most part of the fill image.
 *   $gameSystem.gauge("gaugeId").cursorSpeed(value);
 *      Sets the speed in frames the cursor will be moving.
 *      
 * LIFETIME Options:
 *   $gameSystem.gauge("gaugeId").lifetime(imageName, offsetX, offsetY);
 *      Sets the lifetime/timer image of the gauge. Offsets are relative to the background.
 *      Offsets are optional and defaults to 0.
 *   $gameSystem.gauge("gaugeId").lifetimeValue(value);
 *      Sets the life value in frames. In normal circumstances, 60 frames = 1 second
 *   $gameSystem.gauge("gaugeId").eternalLife();
 *      Sets the life of the gauge to be 'infinite'. If this is called, only OK and cancel buttons
 *      can stop the gauge(aside from the refresh button).
 *   $gameSystem.gauge("gaugeId").lifetimeDecreasing();
 *      Sets the fill type of the lifetime image to be from 'full' to 'empty'.
 *      By default, lifetime is decreasing.
 *   $gameSystem.gauge("gaugeId").lifetimeIncreasing();
 *      Sets the fill type of the lifetime image to be from 'empty' to 'full'.
 *      By default, lifetime is decreasing.
 *      
 * ROTATION Options:
 *   $gameSystem.gauge("gaugeId").rotateClockwise90();
 *      Sets the rotation of the whole gauge to 90 degrees clockwise.
 *   $gameSystem.gauge("gaugeId").rotateCounter90();
 *      Sets the rotation of the whole gauge to 90 decrees counter clockwise or -90.
 *   $gameSystem.gauge("gaugeId").rotateClockwise(degrees);
 *      Sets the rotation of the whole gauge to the specified degrees clockwise.
 *   $gameSystem.gauge("gaugeId").rotateCounter(degrees);
 *      Sets the rotation of the whole gauge to the specified degrees counter clockwise.
 *   NOTE: rotation options may mess up the positioning. 
 *      $gameSystem.gauge("gaugeId").offset(x,y) should be used to this.
 *      
 * POSITIONING Options:
 *   $gameSystem.gauge("gaugeId").upperLeft();
 *      Sets the position of the gauge to the upper left of the screen.
 *   $gameSystem.gauge("gaugeId").upperCenter();
 *      Sets the position of the gauge to the upper center of the screen.
 *   $gameSystem.gauge("gaugeId").upperRight();
 *      Sets the position of the gauge to the upper right of the screen.
 *   $gameSystem.gauge("gaugeId").centerLeft();
 *      Sets the position of the gauge to the center left of the screen.
 *   $gameSystem.gauge("gaugeId").centerCenter();
 *      Sets the position of the gauge to the center of the screen.
 *   $gameSystem.gauge("gaugeId").centerRight();
 *      Sets the position of the gauge to the center right of the screen.
 *   $gameSystem.gauge("gaugeId").lowerLeft();
 *      Sets the position of the gauge to the lower left of the screen.
 *   $gameSystem.gauge("gaugeId").lowerCenter();
 *      Sets the position of the gauge to the lower center of the screen.
 *   $gameSystem.gauge("gaugeId").lowerRight();
 *      Sets the position of the gauge to the lower right of the screen.
 *   $gameSystem.gauge("gaugeId").abovePlayer();
 *      Sets the position of the gauge to be above the player.
 *   $gameSystem.gauge("gaugeId").belowPlayer();
 *      Sets the position of the gauge to be below the player.
 *   $gameSystem.gauge("gaugeId").aboveEvent(mapEventId);
 *      Sets the position of the gauge to be above a specified map event.
 *   $gameSystem.gauge("gaugeId").belowEvent(mapEventId);
 *      Sets the position of the gauge to be below a specified map event.
 *   $gameSystem.gauge("gaugeId").offset(x, y);
 *      Moves the gauge by the specifed offsets x and y. This is relative to the position
 *      specified above.
 *      
 * SUCCESS and AFTER ACTION Related Options:
 *   $gameSystem.gauge("gaugeId").successPoint(value);
 *      Sets the position in percentage of the cursor along the Fill component's width.
 *      For example the Fill component's width is 200 and the specified cursor point is 50,
 *      the cursor image will be placed in the middle of the Fill component since the cursor point
 *      is specified as 50 percent.
 *      Values: 1 - 100
 *   $gameSystem.gauge("gaugeId").successPointAbove();
 *      Sets that the success result will be determined above the success point specified.
 *      For example: successPoint = 75. Success result will be from 75-100
 *   $gameSystem.gauge("gaugeId").successPointBelow();
 *      Sets that the success result will be determined below the success point specified.
 *      For example: successPoint = 75. Success result will be from 0-75
 *   $gameSystem.gauge("gaugeId").successPointRange(min, max);
 *      Sets the success point as a range. This overwrites the success point specified.
 *   $gameSystem.gauge("gaugeId").mapEventId(mapEventId);
 *      Sets the map event id to be called once the gauge action is finished
 *      NOTE: common event will override this
 *   $gameSystem.gauge("gaugeId").commonEventId(commonEventId);
 *      Sets the common event id to be called once the gauge action is finished
 *   $gameSystem.gauge("gaugeId").resultVariableId(variableId);
 *      Sets the result value to the variable specified.
 *      1 - success, 2 - failure, 3 - canceled
 *      
 * OTHER functions:
 *   $gameSystem.gauge("gaugeId").background(imageName, offsetX, offsetY);
 *      Sets the background image of the gauge. Offsets are relative to the whole gauge.
 *      Offsets are optional and defaults to 0.
 *   $gameSystem.gauge("gaugeId").foreground(imageName, offsetX, offsetY);
 *      Sets the foreground image of the gauge. Offsets are relative to the whole gauge.
 *      Offsets are optional and defaults to 0.
 *   $gameSystem.gauge("gaugeId").noAction();
 *      Sets the gauge to not handle any action, OK/cancel button. 
 *      If this is called, lifetime image is the only required image. 
 *      This is used for casting only gauges.
 *   $gameSystem.gauge("gaugeId").allowMovement();
 *      If this is called, player can move around while the gauge is running.
 *   $gameSystem.gauge("gaugeId").pauseBeforeFadeOut(frames);
 *      Sets the number of frames the gauge will display after an action and result has been
 *      determined and before starting fade out.
 *   $gameSystem.gauge("gaugeId").fadeOutSpeed(value);
 *      Sets how fast the gauge will fade out. 
 *   $gameSystem.gauge("gaugeId").fadeOutInstant();
 *      Sets the fade out speed to 255 to completely fadeout in 1 frame.
 *   $gameSystem.gauge("gaugeId").waitToFinish(); 
 *      Prevents the event(where this gauge is called to start) to proceed to the next command
 *      in the event's command queue.
 *  
 * START function: 
 *   $gameSystem.gauge("gaugeId").start();
 *      called to start and display the gauge.
 *       
 * RESULT RELATED functions: Usually called used Conditional Branches in events.
 *   $gameSystem.gauge("gaugeId").isMoving();
 *      Returns true if the gauge is currently moving. Where the fill is 'filling'
 *      or the cursor is moving.
 *   $gameSystem.gauge("gaugeId").isDead();
 *      Returns true if the gauge's lifetime is consumed. Gauge is considered dead
 *      if the action is canceled also.
 *   $gameSystem.gauge("gaugeId").isSuccess();
 *      Returns true if the result is success!
 *   $gameSystem.gauge("gaugeId").isFailed();
 *      Returns true if the result is failed!
 *   $gameSystem.gauge("gaugeId").isCancelled();
 *      Returns true if the action is cancelled!
 *      
 * ============================================================================
 * Chained Functions:
 * ============================================================================
 * Most of the above functions, except RESULT RELATED functions are chained functions.
 * Chained functions can be called together in a single line without repeating $gameSystem.gauge("gaugeId")
 * Example: 
 *      $gameSystem.gauge("fishing").fill("DefaultFill",81,27).cursor("DefaultCursor");
 *      $gameSystem.gauge("fishing").background("DefaultBackground").foreground("FishingIcon");
 *      $gameSystem.gauge("fishing").lifetime("DefaultTimer",81,77);
 *      $gameSystem.gauge("fishing").waitToFinish().start();
 * 
 * ============================================================================
 * Gauge Setup Events
 * ============================================================================
 * Gauges setup script calls can now be placed in a 1 time running map event.
 * You can have 1 map event that setups all gauges on map and when you want to 
 * use the gauge you can call the start() function any time. 
 * Be sure that you don't call the start() function in the setup event.
 * 
 * Example:
 *  Map Event 001: Setup gauge "fishing", "drilling"
 *  Map Event 002: Call and display the fishing gauge
 *      $gameSystem.gauge("fishing").start();
 *  Map Event 003: Call and display the drilling gauge    
 *      $gameSystem.gauge("drilling").start();
 *  Map Event 004: Call and display the fishing gauge again without repeating the setup
 *      $gameSystem.gauge("fishing").start();
 * ============================================================================
 * Change Log
 * ============================================================================
 * v2.01 - Rewrite plugin. NOT COMPATIBLE with older versions. Version based on number of changes detected by git.
 *       - Changed and removed a lot of functions. See documentation for available functions.
 *       - Added gaugeId for managing MULTIPLE gauges. Allows gauge setup on a different event.
 *       - Added new feature MOVING CURSOR.
 *       - Added new feature NO ACTION - only requires lifetime. Like a casting gauge only.
 *       - Added positioning options ABOVE/BELOW a map event.
 *       - Added lifetime option to be eternal.
 * v1.08 - Moved call to __finish. Called only when gauge fades out completly.
 *       - Added option to position gauge above or below player character.
 *       - Added option to make lifetime image decrease instead of increasing.
 *       - Added $gameSystem function $gameSystem.gauge() for easier access of gauge.
 *       - New gauge functions: isMoving(), isDead(), isSuccess(), isFailed() and isCancelled().
 *           Ex: $gameSystem.isMoving()
 *       - Added new option for success point to be above or below cursor point.
 *       - Changed orientation to rotation for future display options.
 * v1.01 - Fixed cursor positioning.
 * v1.00 - Initial release!
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Free for use in non-commercial and commercial games just give credit
 * and link back to https://github.com/procraftynation/RMV.
 * If commercial, a free copy of the game is awesome but optional.
 * =====================================================================*/
(function () {
    var Imported = Imported || {};
    Imported.DEX_GAS = true;
    var DEX = DEX || {};
    DEX.GAS = DEX.GAS || {};
    DEX.GAS.CONS = {
        ROTATE00: 0, ROTATE90C: 90, ROTATE90CC: -90,
        POS_LOWER_LEFT: 1,
        POS_LOWER_CENTER: 2,
        POS_LOWER_RIGHT: 3,
        POS_CENTER_LEFT: 4,
        POS_CENTER_CENTER: 5,
        POS_CENTER_RIGHT: 6,
        POS_UPPER_LEFT: 7,
        POS_UPPER_CENTER: 8,
        POS_UPPER_RIGHT: 9,
        POS_ABOVE_PLAYER: 10,
        POS_BELOW_PLAYER: 11,
        POS_ABOVE_EVENT: 12,
        POS_BELOW_EVENT: 13,
        RESULT_NONE: 0,
        RESULT_SUCCESS: 1,
        RESULT_FAILURE: 2,
        RESULT_CANCEL: 3,
        ACTION_NONE: 0,
        ACTION_FILL: 1,
        ACTION_CURSOR: 2,
        DIR_LEFT: -1,
        DIR_RIGHT: 1
    };
    /*
     * GaugeComponent Class
     */
    function GaugeComponent() {
        this.initialize.apply(this, arguments);
    }
    GaugeComponent.prototype = Object.create(Sprite.prototype);
    GaugeComponent.prototype.constructor = GaugeComponent;
    GaugeComponent.prototype.initialize = function (bitmap, offsetX, offsetY) {
        Sprite.prototype.initialize.call(this, bitmap);
        this.__offsetX = offsetX || 0;
        this.__offsetY = offsetY || 0;
        this.__isReady = false;
        this.__offsetUpdate = false;
    };
    GaugeComponent.prototype.isReady = function () {
        //checks if the bitmap is really loaded with height and width. called on update()
        if (this.bitmap && this.bitmap.height !== 0 && this.bitmap.width !== 0)
            return true;
        return false;
    };
    GaugeComponent.prototype.updateOffsetPosition = function () {
        if (this.__offsetUpdate) {
            return;
        }
        this.x += this.__offsetX;
        this.y += this.__offsetY;
        this.__offsetUpdate = true;
    };
    GaugeComponent.prototype.reset = function () {
        this.__offsetUpdate = false;
    };
    /*
     * GaugeFillComponent Class
     */
    function GaugeFillComponent() {
        this.initialize.apply(this, arguments);
    }
    GaugeFillComponent.prototype = Object.create(GaugeComponent.prototype);
    GaugeFillComponent.prototype.constructor = GaugeFillComponent;
    GaugeFillComponent.prototype.initialize = function (bitmap, offsetX, offsetY) {
        GaugeComponent.prototype.initialize.call(this, bitmap, offsetX, offsetY);
        this.__isMoving = true;
        this.__fillSpeed = 1;
        this.__emptySpeed = 0;//if 0, uses fillSpeed
        this.__startAt = 0;
        this.__reset = false;//moves back and forth, default to false, resets to 0
        //
        this.__value = 0;
    };
    GaugeFillComponent.prototype.handleFilling = function () {
        if (!this.__isMoving || !this.bitmap) {
            return false;
        }
        this.__value += this.__fillSpeed;


        if (this.__value >= this.bitmap.width) {
            if (this.__reset) {
                this.__value = this.bitmap.width;
            } else {
                this.__value = 0;
            }
        }
        this.setFrame(0, 0, this.__value, this.bitmap.height);
    };
    GaugeFillComponent.prototype.handleEmptying = function () {
        if (!this.__isMoving || !this.bitmap) {
            return false;
        }
        if (this.__emptySpeed === 0) {
            this.__value -= this.__fillSpeed;
        } else {
            this.__value -= this.__emptySpeed;
        }
        this.setFrame(0, 0, this.__value, this.bitmap.height);
        if (this.__value < 0) {
            this.__value = 0;
        }
    };
    GaugeFillComponent.prototype.reset = function () {
        this.__value = 0;
    };

    /*
     * GaugeCursorComponent Class
     */
    function GaugeCursorComponent() {
        this.initialize.apply(this, arguments);
    }
    GaugeCursorComponent.prototype = Object.create(GaugeComponent.prototype);
    GaugeCursorComponent.prototype.constructor = GaugeCursorComponent;
    GaugeCursorComponent.prototype.initialize = function (bitmap, offsetX, offsetY) {
        GaugeComponent.prototype.initialize.call(this, bitmap, offsetX, offsetY);
        this.__isMoving = false;
        this.__speed = 1;
        this.__bounce = false;
        this.__direction = DEX.GAS.CONS.DIR_RIGHT;
        this.__maxMovementX = 100;
        this.__minMovementX = 0;
        this.__unMovedX = -1;
    };
    GaugeCursorComponent.prototype.movementRange = function (min, max) {
        this.__minMovementX = min;
        this.__maxMovementX = max;
    };
    GaugeCursorComponent.prototype.handleMovement = function () {
        if (!this.__isMoving) {
            return;
        }
        if (this.__unMovedX === -1) {
            this.__unMovedX = this.x;
        }
        //move cursor
        this.x += (this.__direction * this.__speed);
        //move within container
        if (this.__direction === DEX.GAS.CONS.DIR_RIGHT &&
                this.x >= this.__maxMovementX - this.bitmap.width) {
            if (this.__bounce) {
                this.__direction = DEX.GAS.CONS.DIR_LEFT;
            } else {
                this.x = this.__minMovementX;
            }
        } else if (this.__direction === DEX.GAS.CONS.DIR_LEFT &&
                this.x <= this.__minMovementX) {
            if (this.__bounce) {
                this.__direction = DEX.GAS.CONS.DIR_RIGHT;
            } else {
                this.x = this.__maxMovementX - this.bitmap.width;
            }
        }
    };
    GaugeCursorComponent.prototype.reset = function () {
        this.x = this.__unMovedX;
        this.__direction = DEX.GAS.CONS.DIR_RIGHT;
    };
    /*
     * GaugeLifetimeComponent Class
     */
    function GaugeLifetimeComponent() {
        this.initialize.apply(this, arguments);
    }
    GaugeLifetimeComponent.prototype = Object.create(GaugeComponent.prototype);
    GaugeLifetimeComponent.prototype.constructor = GaugeLifetimeComponent;
    GaugeLifetimeComponent.prototype.initialize = function (bitmap, offsetX, offsetY) {
        GaugeComponent.prototype.initialize.call(this, bitmap, offsetX, offsetY);
        this.__life = 300; //frames
        this.__consumed = 0;
        this.__direction = DEX.GAS.CONS.DIR_LEFT;//decreasing
        this.__isDead = false;
        this.__isEternal = false;
    };
    GaugeLifetimeComponent.prototype.handleLifetime = function () {
        if (this.__isEternal || this.__isDead) {
            return false;
        }
        if (this.__consumed >= this.__life) {
            this.__isDead = true;
            return false;
        }
        if (this.bitmap) {
            var lifeTimeFillValue = this.__consumed * (this.bitmap.width / this.__life);
            if (this.__direction === DEX.GAS.CONS.DIR_LEFT) {
                lifeTimeFillValue = this.bitmap.width - lifeTimeFillValue;
            }
            this.setFrame(0, 0, lifeTimeFillValue, this.bitmap.height);
        }
        this.__consumed++;
    };
    GaugeLifetimeComponent.prototype.kill = function () {
        this.__consumed = this.__lifetime;
        this.__isDead = true;
    };
    GaugeLifetimeComponent.prototype.reset = function () {
        this.__consumed = 0;
        this.__isDead = false;
    };

    /*
     * GaugeContainer Class
     */
    function GaugeContainer() {
        this.initialize.apply(this, arguments);
    }
    GaugeContainer.prototype = Object.create(Sprite.prototype);
    GaugeContainer.prototype.constructor = GaugeContainer;
    GaugeContainer.prototype.initialize = function (gaugeId) {
        Sprite.prototype.initialize.call(this);
        this.width = 0; // auto computed based on child images
        this.height = 0; // auto computed based on child images
        //To avoid collision with Sprite variables we use double underscores (__) as variable prefixes
        this.__gaugeId = gaugeId;
        this.__action = DEX.GAS.CONS.ACTION_FILL;
        this.__waitToFinish = false;
        //IMAGE components
        this.__components = {};
        this.__components.fill = new GaugeFillComponent();
        this.__components.cursor = new GaugeCursorComponent();
        this.__components.lifetime = new GaugeLifetimeComponent();
        this.__components.background = new GaugeComponent();
        this.__components.foreground = new GaugeComponent();
        //POSITIONING
        this.__position = DEX.GAS.CONS.POS_UPPER_CENTER;
        this.__rotation = DEX.GAS.CONS.ROTATE00;
        this.__offsetX = 0;
        this.__offsetY = 0;
        this.__attachedMapEventId = 0;

        this.__successPoint = 50;//percentage center position based on fill width. 1-100
        this.__successPointAbove = false;
        this.__successPointBelow = false;
        this.__successPointMin = 0;
        this.__successPointMax = 0;
        //RESULT RELATED
        this.__result = DEX.GAS.CONS.RESULT_NONE;
        //ON SUCCESS
        this.__mapEventId = 0;
        this.__commonEventId = 0;
        //ACTION VARIABLE
        this.__resultVariableId = 0;//values 1,2,3 which indicates success, failure & cancel respectively

        this.__staringOpacity = 255;
        //FADE OUT OPTIONS
        this.__fadeOutSpeed = 10;//frames 
        this.__pauseBeforeFadeOut = 45;//frames
        this.__pausedFrames = 0;

        //flags used inside plugin only
        this.__componentsDisplayed = false;
        this.__isFinished = false;
    };
    GaugeContainer.prototype.update = function () {
        Sprite.prototype.update.call(this);
        //setup
        if (!this.__componentsDisplayed) {
            this.__setUpComponents();
        }
        if (this.__attachedMapEventId !== 0) {
            this.__moveGaugeToPosition();
        }
        this.__handleCancel();//iscanceled
        if (this.__components.lifetime.__isDead) {
            this.__updateFadeOut();
            return false; //stop code to reach handleFilling
        }
        //do the gauge filling here
        if (this.__components.cursor.__isMoving) {
            this.__handleMovingCursor();
        } else {
            this.__handleFilling();
        }


        this.__handleLifetime();
        this.__determineResult();
    };
    GaugeContainer.prototype.reset = function () {
        this.opacity = this.__staringOpacity;
        this.__componentsDisplayed = false;
        this.__pausedFrames = 0;
        this.__isFinished = false;
        this.__result = DEX.GAS.CONS.RESULT_NONE;
        //reset for reuse
        for (var key in this.__components) {
            this.__components[key].reset();
        }
    };
    //==================
    // Private methods
    //==================
    GaugeContainer.prototype.__finish = function () {
        if (this.__isFinished) {
            return false;
        }
        if (this.__resultVariableId !== 0) {
            $gameVariables.setValue(this.__resultVariableId, this.__result);
        }
        if (this.__commonEventId !== 0) {
            $gameTemp.reserveCommonEvent(this.__commonEventId);
        } else if (this.__mapEventId !== 0) {
            $gameMap.event(this.__mapEventId).start();
        }
        //enable character movement
        if (this.__action !== DEX.GAS.CONS.ACTION_NONE) {
            $gameTemp._gaugeActionStop();
            $gameSystem.enableMenu();
        }
        this.__isFinished = true;
        SceneManager._scene.removeChild(this);
    };
    GaugeContainer.prototype.__updateFadeOut = function () {
        this.__pausedFrames++;
        if (this.__pausedFrames >= this.__pauseBeforeFadeOut) {
            this.opacity -= this.__fadeOutSpeed;
            if (this.opacity <= 0) {
                //only remove from scene if not visible anymore
                this.__finish();
            }
        }
    };
    GaugeContainer.prototype.__handleMovingCursor = function () {

        if (this.__action !== DEX.GAS.CONS.ACTION_NONE
                && (Input.isTriggered("ok") || TouchInput.isTriggered())) {
            this.__components.lifetime.kill();
        } else {
            this.__components.cursor.handleMovement();
        }

    };
    GaugeContainer.prototype.__handleFilling = function () {
        if (this.__action !== DEX.GAS.CONS.ACTION_NONE
                && (Input.isPressed("ok") || TouchInput.isPressed())) {
            this.__components.fill.handleFilling();
        } else {
            this.__components.fill.handleEmptying();
        }
    };
    GaugeContainer.prototype.__handleLifetime = function () {
        this.__components.lifetime.handleLifetime();
    };
    GaugeContainer.prototype.__determineResult = function () {
        if (this.__action === DEX.GAS.CONS.ACTION_FILL && this.__components.lifetime.__isDead) {
            var minSuccessPoint = 0;
            var maxSuccessPoint = 0;
            var resultPoint = -1;
            if (this.__successPointMin === 0 && this.__successPointMax === 0) {
                if (this.__successPointAbove) {
                    minSuccessPoint = this.__components.cursor.x
                            + this.__components.cursor.bitmap.width / 2;//mid of cursor
                    maxSuccessPoint = this.__components.cursor.x
                            + this.__components.fill.bitmap.width;
                } else if (this.__successPointBelow) {
                    minSuccessPoint = 0;
                    maxSuccessPoint = this.__components.cursor.x
                            + this.__components.cursor.bitmap.width / 2;//mid of cursor
                } else {
                    minSuccessPoint = this.__components.cursor.x;
                    maxSuccessPoint = this.__components.cursor.x
                            + this.__components.cursor.bitmap.width;
                }
            } else {
                minSuccessPoint = this.__components.fill.bitmap.width * this.__successPointMin / 100;
                maxSuccessPoint = this.__components.fill.bitmap.width * this.__successPointMax / 100;
            }
            resultPoint = this.__components.fill.width + this.__components.fill.__offsetX;
            //check if between range points
            if (resultPoint >= minSuccessPoint && resultPoint <= maxSuccessPoint) {
                this.__result = DEX.GAS.CONS.RESULT_SUCCESS;
            } else {
                this.__result = DEX.GAS.CONS.RESULT_FAILURE;
            }
        } else if (this.__action === DEX.GAS.CONS.ACTION_CURSOR && this.__components.lifetime.__isDead) {
            var minSuccessPoint = 0;
            var maxSuccessPoint = 0;
            var resultPoint = -1;
            if (this.__successPointMin === 0 && this.__successPointMax === 0) {
                if (this.__successPointAbove) {
                    minSuccessPoint = (this.__components.fill.bitmap.width * this.__successPoint / 100)
                            - (this.__components.cursor.bitmap.width / 2);
                    maxSuccessPoint = this.__components.fill.bitmap.width;
                } else if (this.__successPointBelow) {
                    minSuccessPoint = 0
                    maxSuccessPoint = (this.__components.fill.bitmap.width * this.__successPoint / 100)
                            + (this.__components.cursor.bitmap.width / 2);
                } else {
                    minSuccessPoint = (this.__components.fill.bitmap.width * this.__successPoint / 100)
                            - (this.__components.cursor.bitmap.width / 2);
                    maxSuccessPoint = (this.__components.fill.bitmap.width * this.__successPoint / 100)
                            + (this.__components.cursor.bitmap.width / 2);
                }
            } else {
                minSuccessPoint = this.__components.fill.bitmap.width * this.__successPointMin / 100;
                maxSuccessPoint = this.__components.fill.bitmap.width * this.__successPointMax / 100;
            }
            resultPoint = this.__components.cursor.x
                    + (this.__components.cursor.bitmap.width / 2);
            if (resultPoint >= minSuccessPoint && resultPoint <= maxSuccessPoint) {
                this.__result = DEX.GAS.CONS.RESULT_SUCCESS;
            } else {
                this.__result = DEX.GAS.CONS.RESULT_FAILURE;
            }
        } else {
            //do a random success or fail
            if (this.__successPoint > 0) {
                if (this.__successPoint <= Math.floor((Math.random() * 100) + 1)) {
                    this.__result = DEX.GAS.CONS.RESULT_SUCCESS;
                } else {
                    this.__result = DEX.GAS.CONS.RESULT_FAILURE;
                }
            }
        }
    };
    GaugeContainer.prototype.__handleCancel = function () {
        if (this.__action !== DEX.GAS.CONS.ACTION_NONE
                && (Input.isTriggered('cancel') || TouchInput.isCancelled())) {
            this.__result = DEX.GAS.CONS.RESULT_CANCEL;
            this.__components.lifetime.kill();
        }
    };
    GaugeContainer.prototype.__setUpComponents = function () {
        if (this.__requiredComponentsReady()) {
            this.__computeDimensions();
            this.__moveGaugeToPosition();
            this.__positionComponents();
            this.__componentsDisplayed = true;
            if (this.__components.cursor.__isMoving) {
                this.__components.cursor.movementRange(this.__components.fill.x, this.__components.fill.x + this.__components.fill.bitmap.width);
            }
            //rotate gauge
            this.rotation = this.__rotation * Math.PI / 180;
        }
    };
    GaugeContainer.prototype.__requiredComponentsReady = function () {
        if (this.__action === DEX.GAS.CONS.ACTION_FILL
                || this.__action === DEX.GAS.CONS.ACTION_CURSOR) {
            return this.__components.fill.isReady() && this.__components.cursor.isReady();
        } else if (this.__action === DEX.GAS.CONS.ACTION_NONE) {
            return this.__components.lifetime.isReady();
        }
        return false;
    };
    GaugeContainer.prototype.__positionComponents = function () {
        //update offsets
        for (var key in this.__components) {
            this.__components[key].updateOffsetPosition();
        }
        if (this.__action === DEX.GAS.CONS.ACTION_NONE) {
            return false;
        }
        //vertically center cursor to fill
        this.__components.cursor.y = this.__components.fill.y + (this.__components.fill.bitmap.height - this.__components.cursor.bitmap.height) / 2;
        //move cursor based on successpoint
        if (!this.__components.cursor.__isMoving) {
            this.__components.cursor.x = this.__components.fill.x
                    + (this.__components.fill.bitmap.width * (this.__successPoint / 100))
                    - (this.__components.cursor.bitmap.width / 2);
            //bound to border only
            if (this.__components.cursor.x + this.__components.cursor.bitmap.width > this.__components.fill.bitmap.width) {
                this.__components.cursor.x = this.__components.fill.bitmap.width - this.__components.cursor.bitmap.width;
            } else if (this.__components.cursor.x - this.__components.cursor.bitmap.width < 0) {
                this.__components.cursor.x = 0;//this is relative to parent
            }
        }
    };
    GaugeContainer.prototype.__computeDimensions = function () {
        if (this.__components.background.isReady()) {
            this.height = this.__components.background.bitmap.height;
            this.width = this.__components.background.bitmap.width;
        } else {
            if (this.__action === DEX.GAS.CONS.ACTION_NONE) {
                this.height = this.__components.lifetime.bitmap.height;
                this.width = this.__components.lifetime.bitmap.width;
            } else {
                this.height = Math.max(this.__components.fill.bitmap.height, this.__components.cursor.bitmap.height);
                this.width = Math.max(this.__components.fill.bitmap.width, this.__components.cursor.bitmap.width);
            }
        }
    };
    GaugeContainer.prototype.__moveGaugeToPosition = function () {
        var x;
        var y;
        var baseWidth = Graphics.width;
        var baseHeight = Graphics.height;
        switch (this.__position) {
            case DEX.GAS.CONS.POS_ABOVE_EVENT:
                x = this.__offsetX + $gameMap.event(this.__attachedMapEventId).screenX() - this.width / 2;
                y = this.__offsetY + $gameMap.event(this.__attachedMapEventId).screenY() - this.height - $gameMap.tileHeight();
                break;
            case DEX.GAS.CONS.POS_BELOW_EVENT:
                x = this.__offsetX + $gameMap.event(this.__attachedMapEventId).screenX() - this.width / 2;
                y = this.__offsetY + $gameMap.event(this.__attachedMapEventId).screenY();
                break;
            case DEX.GAS.CONS.POS_ABOVE_PLAYER:
                x = this.__offsetX + $gamePlayer.screenX() - this.width / 2;
                y = this.__offsetY + $gamePlayer.screenY() - this.height - $gameMap.tileHeight();
                break;
            case DEX.GAS.CONS.POS_BELOW_PLAYER:
                x = this.__offsetX + $gamePlayer.screenX() - this.width / 2;
                y = this.__offsetY + $gamePlayer.screenY();
                break;
            case DEX.GAS.CONS.POS_LOWER_LEFT:
                x = this.__offsetX;
                y = this.__offsetY + baseHeight - this.height;
                break;
            case DEX.GAS.CONS.POS_LOWER_CENTER:
                x = this.__offsetX + baseWidth / 2 - this.width / 2;
                y = this.__offsetY + baseHeight - this.height;
                break;
            case DEX.GAS.CONS.POS_LOWER_RIGHT:
                x = this.__offsetX + baseWidth - this.width;
                y = this.__offsetY + baseHeight - this.height;
                break;
            case DEX.GAS.CONS.POS_CENTER_LEFT:
                x = this.__offsetX;
                y = this.__offsetY + baseHeight / 2 - this.height / 2;
                break;
            case DEX.GAS.CONS.POS_CENTER_CENTER:
                x = this.__offsetX + baseWidth / 2 - this.width / 2;
                y = this.__offsetY + baseHeight / 2 - this.height / 2;
                break;
            case DEX.GAS.CONS.POS_CENTER_RIGHT:
                x = this.__offsetX + baseWidth - this.width;
                y = this.__offsetY + baseHeight / 2 - this.height / 2;
                break;
            case DEX.GAS.CONS.POS_UPPER_LEFT:
                x = this.__offsetX;
                y = this.__offsetY;
                break;
            case DEX.GAS.CONS.POS_UPPER_CENTER:
                x = this.__offsetX + baseWidth / 2 - this.width / 2;
                y = this.__offsetY;
                break;
            case DEX.GAS.CONS.POS_UPPER_RIGHT:
                x = this.__offsetX + baseWidth - this.width;
                y = this.__offsetY;
                break;
        }
        this.x = x;
        this.y = y;
      
    };
    //====================================
    // Called after setup through chained methods
    //====================================
    GaugeContainer.prototype.start = function () {
        this.reset();
        //add children
        this.addChild(this.__components.background);
        this.addChild(this.__components.fill);
        this.addChild(this.__components.cursor);
        this.addChild(this.__components.lifetime);
        this.addChild(this.__components.foreground);
        SceneManager._scene.addChild(this);
        //only action gauge should stop movement or wait for action
        if (this.__action === DEX.GAS.CONS.ACTION_FILL
                || this.__action === DEX.GAS.CONS.ACTION_CURSOR) {
            $gameTemp._gaugeActionStart(this.__waitToFinish);
            $gameSystem.disableMenu();
        }
    };
    //=====================================
    // CHAINED PUBLIC METHODS for setting up gauge
    //=====================================

    //=====================================
    // GaugeFillComponent: setup methods
    //=====================================
    GaugeContainer.prototype.fill = function (imageName, offsetX, offsetY) {
        //immediately set up and add to child
        this.__components.fill.bitmap = ImageManager.loadPicture(imageName);
        this.__components.fill.__offsetX = offsetX || 0;
        this.__components.fill.__offsetY = offsetY || 0;
        return this;
    };
    GaugeContainer.prototype.fillSpeed = function (value) {
        this.__components.fill.__fillSpeed = value;
        return this;
    };
    GaugeContainer.prototype.emptySpeed = function (value) {
        this.__components.fill.__emptySpeed = value;
        return this;
    };
    GaugeContainer.prototype.fillReset = function () {
        this.__components.fill.__reset = true;
        return this;
    };
    //=====================================
    // GaugeCursorComponent: helper setup methods
    //=====================================
    GaugeContainer.prototype.cursor = function (imageName) {
        this.__components.cursor.bitmap = ImageManager.loadPicture(imageName);
        return this;
    };
    GaugeContainer.prototype.movingCursor = function () {
        this.__action = DEX.GAS.CONS.ACTION_CURSOR;
        this.__components.cursor.__isMoving = true;
        this.__components.fill.__isMoving = false;
        return this;
    };
    GaugeContainer.prototype.bounceCursor = function () {
        this.__components.cursor.__bounce = true;
        return this;
    };
    GaugeContainer.prototype.cursorStartLeft = function () {
        this.__components.cursor.__direction = DEX.GAS.CONS.DIR_RIGHT;
        return this;
    };
    GaugeContainer.prototype.cursorStartRight = function () {
        this.__components.cursor.__direction = DEX.GAS.CONS.DIR_LEFT;
        return this;
    };
    GaugeContainer.prototype.cursorSpeed = function (value) {
        this.__components.cursor.__speed = value;
        return this;
    };
    //=====================================
    // GaugeLifetimeComponent: helper setup methods
    //=====================================
    GaugeContainer.prototype.lifetime = function (imageName, offsetX, offsetY) {
        this.__components.lifetime.bitmap = ImageManager.loadPicture(imageName);
        this.__components.lifetime.__offsetX = offsetX || 0;
        this.__components.lifetime.__offsetY = offsetY || 0;
        return this;
    };
    GaugeContainer.prototype.lifetimeValue = function (value) {
        this.__components.lifetime.__life = value;
        return this;
    };
    GaugeContainer.prototype.eternalLife = function () {
        this.__components.lifetime.__isEternal = true;
        return this;
    };

    GaugeContainer.prototype.lifetimeDecreasing = function () {
        this.__components.lifetime.__direction = DEX.GAS.CONS.DIR_LEFT;
        return this;
    };
    GaugeContainer.prototype.lifetimeIncreasing = function () {
        this.__components.lifetime.__direction = DEX.GAS.CONS.DIR_RIGHT;
        return this;
    };

    //=====================================
    // Rotation functions
    //=====================================
    GaugeContainer.prototype.rotateClockwise90 = function () {
        this.__rotation = DEX.GAS.CONS.ROTATE90C;
        return this;
    };
    GaugeContainer.prototype.rotateCounter90 = function () {
        this.__rotation = DEX.GAS.CONS.ROTATE90CC;
        return this;
    };
    GaugeContainer.prototype.rotateClockwise = function (degrees) {
        this.__rotation = degrees;
        return this;
    };
    GaugeContainer.prototype.rotateCounter = function (degrees) {
        this.__rotation = -(degrees);
        return this;
    };
    //=====================================
    // Positioning functions
    //=====================================
    GaugeContainer.prototype.upperLeft = function () {
        this.__position = DEX.GAS.CONS.POS_UPPER_LEFT;
        return this;
    };
    GaugeContainer.prototype.upperCenter = function () {
        this.__position = DEX.GAS.CONS.POS_UPPER_CENTER;
        return this;
    };
    GaugeContainer.prototype.upperRight = function () {
        this.__position = DEX.GAS.CONS.POS_UPPER_RIGHT;
        return this;
    };
    GaugeContainer.prototype.centerLeft = function () {
        this.__gaugePosition = DEX.GAS.CONS.POS_CENTER_LEFT;
        return this;
    };
    GaugeContainer.prototype.centerCenter = function () {
        this.__position = DEX.GAS.CONS.POS_CENTER_CENTER;
        return this;
    };
    GaugeContainer.prototype.centerRight = function () {
        this.__position = DEX.GAS.CONS.POS_CENTER_RIGHT;
        return this;
    };
    GaugeContainer.prototype.lowerLeft = function () {
        this.__position = DEX.GAS.CONS.POS_LOWER_LEFT;
        return this;
    };
    GaugeContainer.prototype.lowerCenter = function () {
        this.__position = DEX.GAS.CONS.POS_LOWER_CENTER;
        return this;
    };
    GaugeContainer.prototype.lowerRight = function () {
        this.__position = DEX.GAS.CONS.POS_LOWER_RIGHT;
        return this;
    };
    GaugeContainer.prototype.abovePlayer = function () {
        this.__position = DEX.GAS.CONS.POS_ABOVE_PLAYER;
        return this;
    };
    GaugeContainer.prototype.belowPlayer = function () {
        this.__position = DEX.GAS.CONS.POS_BELOW_PLAYER;
        return this;
    };
    GaugeContainer.prototype.aboveEvent = function (mapEventId) {
        this.__position = DEX.GAS.CONS.POS_ABOVE_EVENT;
        this.__attachedMapEventId = mapEventId;
        return this;
    };
    GaugeContainer.prototype.belowEvent = function (mapEventId) {
        this.__position = DEX.GAS.CONS.POS_BELOW_EVENT;
        this.__attachedMapEventId = mapEventId;
        return this;
    };
    GaugeContainer.prototype.offset = function (x, y) {
        this.__offsetX = x;
        this.__offsetY = y;
        return this;
    };
    //=====================================
    // Finishing related functions
    //=====================================
    GaugeContainer.prototype.fadeOutSpeed = function (fadeOutSpeed) {
        this.__fadeOutSpeed = fadeOutSpeed;
        return this;
    };
    GaugeContainer.prototype.fadeOutInstant = function () {
        this.__fadeOutSpeed = 255;
        return this;
    };
    GaugeContainer.prototype.pauseBeforeFadeOut = function (pauseFrames) {
        this.__pauseBeforeFadeOut = pauseFrames;
        return this;
    };
    GaugeContainer.prototype.waitToFinish = function () {
        this.__waitToFinish = true;
        return this;
    };
    //=====================================
    // Result related functions
    //=====================================
    GaugeContainer.prototype.successPoint = function (value) {
        this.__successPoint = value;
        return this;
    };
    GaugeContainer.prototype.successPointAbove = function () {
        this.__successPointAbove = true;
        this.__successPointBelow = false;
        return this;
    };
    GaugeContainer.prototype.successPointBelow = function () {
        this.__successPointBelow = true;
        this.__successPointAbove = false;
        return this;
    };
    GaugeContainer.prototype.successPointRange = function (min, max) {
        this.__successPointMin = min;
        this.__successPointMax = max;
        return this;
    };
    GaugeContainer.prototype.mapEventId = function (mapEventId) {
        this.__mapEventId = mapEventId;
        return this;
    };
    GaugeContainer.prototype.commonEventId = function (commonEventId) {
        this.__commonEventId = commonEventId;
        return this;
    };
    GaugeContainer.prototype.resultVariableId = function (variableId) {
        this.__resultVariableId = variableId;
        return this;
    };
    GaugeContainer.prototype.isMoving = function () {
        return this.__components.fill.__value > 0;
    };
    GaugeContainer.prototype.isDead = function () {
        return this.__components.lifetime.__isDead;
    };
    GaugeContainer.prototype.isSuccess = function () {
        return this.__result === DEX.GAS.CONS.RESULT_SUCCESS;
    };
    GaugeContainer.prototype.isFailed = function () {
        return this.__result === DEX.GAS.CONS.RESULT_FAILURE;
    };
    GaugeContainer.prototype.isCancelled = function () {
        return this.__result === DEX.GAS.CONS.RESULT_CANCEL;
    };
    //=====================================
    // Other functions
    //=====================================
    GaugeContainer.prototype.background = function (imageName, offsetX, offsetY) {
        this.__components.background.bitmap = ImageManager.loadPicture(imageName);
        this.__components.background.__offsetX = offsetX || 0;
        this.__components.background.__offsetY = offsetY || 0;
        return this;
    };
    GaugeContainer.prototype.foreground = function (imageName, offsetX, offsetY) {
        this.__components.foreground.bitmap = ImageManager.loadPicture(imageName);
        this.__components.foreground.__offsetX = offsetX || 0;
        this.__components.foreground.__offsetY = offsetY || 0;
        return this;
    };
    GaugeContainer.prototype.noAction = function () {
        this.__action = DEX.GAS.CONS.ACTION_NONE;
        return this;
    };
    GaugeContainer.prototype.allowMovement = function () {
        this.__allowMovement = true;
        return this;
    };

    //=====================================
    // Returns the current gauge where you can call chained methods to update options.
    //=====================================
    Game_System.prototype.gauge = function (gaugeId) {
        this.__gauges = this.__gauges || {};
        gaugeId = gaugeId || "default";
        if (!(gaugeId in this.__gauges) && this.__gauges[gaugeId] === undefined) {
            //create new and add to gaugeactions
            this.__gauges[gaugeId] = new GaugeContainer(gaugeId);
        }
        return this.__gauges[gaugeId];
    };

    //=====================================
    // Game_Temp
    //=====================================
    Game_Temp.prototype._gaugeActionStart = function (waitToFinish) {
        this._gaugeActionRunning = true;
        this._gaugeActionWaitToFinish = waitToFinish;
    };
    Game_Temp.prototype._gaugeActionStop = function () {
        this._gaugeActionRunning = false;
        this._gaugeActionWaitToFinish = false;
    };
    Game_Temp.prototype._gaugeAction_Game_Player_canMove = function () {
        //determine context 
        if (SceneManager._scene instanceof Scene_Map) {
            return !this._gaugeActionRunning;
        }
        return true;
    };
    Game_Temp.prototype._gaugeAction_Game_Interpreter_updateWait = function () {
        //determine context 
        return this._gaugeActionWaitToFinish && this._gaugeActionRunning;
    };
    //=====================================
    // Game_Player
    //============================================================
    DEX.GAS.Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        return $gameTemp._gaugeAction_Game_Player_canMove()
                && DEX.GAS.Game_Player_canMove.call(this);
    };
    //============================================================
    // Game_Interpreter
    //============================================================
    DEX.GAS.Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
    Game_Interpreter.prototype.updateWait = function () {
        return $gameTemp._gaugeAction_Game_Interpreter_updateWait() || DEX.GAS.Game_Interpreter_updateWait.call(this);
    };
})();
