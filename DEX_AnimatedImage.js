/*:
 * @plugindesc v1.00 Show an image with animation
 * @author Procraftynation - https://github.com/procraftynation
 * =====================================================================
 * Usage
 * =====================================================================
 * This plugin uses PLUGIN COMMANDS
 * There are 4 steps in plugin commands that are available
 *  1. CreateAnimation - setup and load the image for animation
 *  2. DoAnimation - adds the image to the scene and executes specified animation
 *  3. WaitAnimation - wait to finish previous animation before proceeding to next event command
 *  4. RemoveAnimation - stop and removes animation and image from current scene
 *  
 * Command Format:
 *  1. CreateAnimation [ID] [IMAGE] [x] [y]
 *  2. DoAnimation [ID] [ANIMATION] [ARG1] [ARG...]
 *  3. WaitAnimation [ID]
 *  4. RemoveAnimation [ID]
 *  NOTE: [ID] is any text that would identify the Animated Image from others.
 *        [IMAGE] is the filename found in the /pictures folder without the file extension.
 *        
 * Available DoAnimations and Arguments(all are optional)
 *  1. DoAnimaion [ID] FadeIn [speed]
 *      - [speed] is a number from 1-255 that is added to the opacity with each frame. 
 *          Default: 10
 *  2. DoAnimation [ID] FadeOut [speed]
 *      - [speed] is a number from 1-255 that is added to the opacity with each frame. 
 *          Default: 10
 *  3. DoAnimation [ID] Bounce [distance]
 *      - [distance] is the number of pixels to bounce up from the initial position.
 *          Default: the height of the image
 *  4. DoAnimation [ID] Flash [count] [speed]
 *      - [count] is the number of times the image flashes(fadeout then fadein) in the screen.
 *          Default: 2
 *      - [speed] is a number from 1-255 that is added to the opacity with each frame. 
 *          Default: 20 
 *  5. DoAnimation [ID] Pulse [scale size] [speed] [pause]
 *      - [scale size] is the maximum scaling the image will have before going back to original scale
 *          Default: 1.5    Note: This means the image will scale up to 150% of original size
 *      - [speed] is the number added to the original size until it reaches the [scale size]
 *          Default: 0.05
 *      - [pause] is the number of frames to wait before going back to original size of 100%;
 *  6. DoAnimation [ID] Stretch [direction] [hold]
 *      - [direction] is the direction to which the image will stretch to
 *          Default: h      Values: h=horizontal, v=vertical
 *      - [hold] is the number of frames to wait before releasing the initial stretch.
 *          Default: 10
 *  7. DoAnimation [ID] Shake [orientation] [count] [speed] [distance]
 *      - [orientation] is the direction to which the image will shake to
 *          Default: h      Values: h=horizontal(left-right), v=vertical(up-down)
 *      - [count] is the number of times the image moves from left to right.
 *          Default: 10     Note: 10 moves, means 5 left/up and 5 right/down
 *      - [speed] is the number of pixels/frame the image moves from left/up or right/down
 *          Default: 3
 *      - [distance] is the number of pixels from original position the image is allowed to move to
 *          Default: 10
 * 
 * =====================================================================
 * Example: (one line is equivalent to 1 plugin command in event editor in rpg maker mv
 * =====================================================================
 * CreateAnimation 1 MyImage 100 150
 * DoAnimaion abcID FadeIn 10
 * DoAnimation abcID Bounce
 * DoAnimation abcID Flash 5 15
 * DoAnimation abcID Pulse 
 * DoAnimation abcID Stretch h
 * DoAnimation abcID Shake h
 * DoAnimation abcID Stretch v
 * DoAnimation abcID Shake v
 * WaitAnimation abcdID
 * RemoveAnimation abcdID
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Free for use in non-commercial and commercial games just give credit
 * and link back to https://github.com/procraftynation/RMV.
 * If commercial, a free copy of the game is awesome but optional.
 * =====================================================================*/

var Imported = Imported || {};
Imported.DEX_ANI = true;
var DEX = DEX || {};
DEX.ANI = DEX.ANI || {};
DEX.ANI.CONS = {
    POS_LOWER_LEFT: 1, POS_LOWER_CENTER: 2, POS_LOWER_RIGHT: 3, POS_CENTER_LEFT: 4,
    POS_CENTER_CENTER: 5, POS_CENTER_RIGHT: 6, POS_UPPER_LEFT: 7, POS_UPPER_CENTER: 8,
    POS_UPPER_RIGHT: 9,
    DIR_UP: -1, DIR_DOWN: 1, DIR_LEFT: -1, DIR_RIGHT: 1,
    DIR_H: "h", DIR_V: "v",
    COMMAND_CREATE: "CreateAnimation", COMMAND_DO: "DoAnimation",
    COMMAND_REMOVE: "RemoveAnimation", COMMAND_WAIT: "WaitAnimation",
};
DEX.ANI.CONS.ANIMATIONS = [
    //entrances
    "fadein",
    //attention seekers
    "bounce",
    "flash",
    "pulse",
    "stretch",
    "shake",
    //exits
    "fadeout",
    "wait",
    "remove"
];
function Sprite_Animated() {
    this.initialize.apply(this, arguments);
}
Sprite_Animated.prototype = Object.create(Sprite.prototype);
Sprite_Animated.prototype.constructor = Sprite_Animated;
Sprite_Animated.prototype.initialize = function (bitmap, x, y) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.__unEvalX = x;
    this.__unEvalY = y;
    this.__originalX = null;
    this.__originalY = null;
    this.__animations = [];
    this.__current = null;
    this.opacity = 0;

    //animation triggers
    this.__bouncing = false;
    this.__flashing = false;
    this.__shaking = false;
    this.__stretching = false;
    this.__pulsing = false;
    this.__fadingIn = false;
};
Sprite_Animated.prototype.start = function () {
    SceneManager._scene.addChild(this);

};
Sprite_Animated.prototype.stop = function () {
    SceneManager._scene.removeChild(this);
};

Sprite_Animated.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.__started === false || (this.height === 0 && this.width === 0)) {
        //don't animate yet when image is not ready
        return;
    }
    if (this.__originalX === null || this.__originalY === null) {
        //evaluate x and y only when image is ready
        this.x = this.__originalX = eval(this.__unEvalX);
        this.y = this.__originalY = eval(this.__unEvalY);
    }
    this._doAnimationQueue();
};
Sprite_Animated.prototype._addAnimation = function (name, opts) {
    this.__animations.push({name: name.toLowerCase(), opts: opts});
};
Sprite_Animated.prototype._nextAnimation = function () {
    this.__current = this.__animations.shift();
};
Sprite_Animated.prototype._doAnimationQueue = function () {
    var done = false;
    if (!this.__current && this.__animations.length > 0) {
        this._nextAnimation();
    } else if (!this.__current && this.__animations.length <= 0) {
        //done, wait for animations be added unless removed
        return true;
    }

    var fn = this["_do_" + this.__current.name];
    if (typeof fn !== 'function') {
        //invalid animation
        return false;
    }
    done = fn.apply(this, this.__current.opts);
    if (done) {

        this._nextAnimation();
    }
};

//BOUNCE ANIMATIONS
Sprite_Animated.prototype._do_bounce = function (bounceDistance) {
    bounceDistance = bounceDistance || this.height;
    if (this.__bouncing === false) {
        this.__bouncing = true;
        this.__bounceGravity = 1.5;

        this.opacity = 255;
        this.__bounceFloor = this.y;
        //compute initial velocity
        this.__bounceVelocity = -1 * this.__bounceGravity * (Math.sqrt((2 * bounceDistance / this.__bounceGravity)));
    }
    this.__bounceVelocity += this.__bounceGravity;
    this.y += Math.round(this.__bounceVelocity);
    if (this.y >= this.__bounceFloor) {
        this.y = this.__bounceFloor;
        this.__bounceVelocity = -(this.__bounceVelocity / this.__bounceGravity);
    }
    if (this.__bounceVelocity < this.__bounceGravity && this.__bounceVelocity > -this.__bounceGravity
            && this.__bounceFloor === this.y) {
        //reset
        this.__bounceVelocity = 0;
        this.__bouncing = false;
        return true;
    }
    return false;
};
Sprite_Animated.prototype._do_flash = function (flashCount, speed) {
    if (this.__flashing === false) {
        this.__flashing = true;
        this.__flashCount = eval(flashCount) || 2;
        speed = eval(speed) || 20;
        this.__flashSpeed = -(Math.abs(speed));//force negative
    }
    this.opacity += this.__flashSpeed;
    if (this.opacity >= 255) {
        this.__flashCount--;
        this.__flashSpeed = -this.__flashSpeed;
    } else if (this.opacity <= 0) {
        this.__flashSpeed = -this.__flashSpeed;
    }
    if (this.__flashCount === 0) {
        this.__flashing = false;
        return true;
    }
    return false;

};
Sprite_Animated.prototype._do_pulse = function (pulseScaleSize, pulseSpeed, pulsePauseCount) {
    if (this.__pulsing === false) {
        this.__pulsing = true;
        this.opacity = 255;
        this.__pulseScaleSize = eval(pulseScaleSize) || 1.5;
        this.__pulseSpeed = eval(pulseSpeed) || 0.05;
        this.__pulseSpeedOrig = this.__pulseSpeed;
        this.__pulsePauseCount = eval(pulsePauseCount) || 5;//frames
    }
    this.__scaleFromCenterX(this.__pulseSpeed, true);
    this.__scaleFromCenterY(this.__pulseSpeed, true);
    if (this.scale.x >= this.__pulseScaleSize) {
        //start subtracting
        this.__pulseSpeed = 0;
        this.__pulsePauseCount--;
        if (this.__pulsePauseCount === 0) {
            this.__pulseSpeed = -this.__pulseSpeedOrig;
        }
    }
    if (this.scale.x < 1) {
        //reset
        this.__scaleFromCenterX(1);
        this.__scaleFromCenterY(1);
        this.__pulsing = false;
        return true;
    }
    return false;
};
Sprite_Animated.prototype._do_stretch = function (stretchDirection, stretchHold) {
    if (this.__stretching === false) {
        this.__stretching = true;
        this.opacity = 255;
        this.__stretchBorderMin = .75;
        this.__stretchBorderMax = 1.5;
        this.__stretchSpeed = 0.05;
        this.__stretchDirection = (stretchDirection || DEX.ANI.CONS.DIR_H).toLowerCase();
        this.__stretchHold = eval(stretchHold) || 10;//frames before releasing from first stretch

        this.__bounceCount = 0;
        this.__bounceMax = 3;

        if (this.__stretchDirection === DEX.ANI.CONS.DIR_H) {
            this.__stretchAxisPull = "x";
            this.__stretchAxisOther = "y";
            this.__stretchDimPull = "width";
            this.__stretchDimOther = "height";
            this.__stretchPosPull = this.x;
            this.__stretchPosOther = this.y;
        } else {
            this.__stretchAxisPull = "y";
            this.__stretchAxisOther = "x";
            this.__stretchDimPull = "height";
            this.__stretchDimOther = "width";
            this.__stretchPosPull = this.y;
            this.__stretchPosOther = this.x;
        }
    }
    if (this.__stretchDirection === DEX.ANI.CONS.DIR_H) {
        this.__scaleFromCenterX(this.__stretchSpeed, true);
        this.__scaleFromCenterY(-this.__stretchSpeed, true);
    } else {
        this.__scaleFromCenterY(this.__stretchSpeed, true);
        this.__scaleFromCenterX(-this.__stretchSpeed, true);
    }

    if (this.scale[this.__stretchAxisPull] > this.__stretchBorderMax) {

        this.__stretchHold--;
        this.__stretchSpeed = 0;//stop scaling
        if (this.__stretchHold > 0) {
            return false;//hold it!
        } else {
            //release! double the speed and negate
            this.__stretchSpeed = -0.05 * 2;
            //reduce stretchBorderMax
            this.__stretchBorderMax *= .9;
            if (this.__stretchBorderMax < 1) {
                this.__stretchBorderMax = 1;
            }
        }
    }
    if (this.scale[this.__stretchAxisPull] < this.__stretchBorderMin) {
        this.__stretchBorderMin = .9;
        this.__stretchSpeed = Math.abs(this.__stretchSpeed);
        this.__bounceCount++;
    }
    if (this.__bounceCount === 2) {
        this.__stretchBorderMax = 1.25;
    }
    if (this.__bounceCount === this.__bounceMax) {
        this.__stretching = false;
        //reset
        this.__scaleFromCenterX(1);
        this.__scaleFromCenterY(1);
        return true;
    }
    return false;
};
Sprite_Animated.prototype._do_shake = function (shakeOrientation, shakeCount, shakeSpeed, shakeDistance) {
    if (this.__shaking === false) {
        this.__shaking = true;
        this.opacity = 255;
        this.__shakeDistance = eval(shakeDistance) || 10;//pixels
        this.__shakeSpeed = eval(shakeSpeed) || 3;

        this.shakeOrientation = (shakeOrientation || DEX.ANI.CONS.DIR_H).toLowerCase();
        this.__shakeAxis = (this.shakeOrientation === DEX.ANI.CONS.DIR_H) ? "x" : "y";

        this.__shakeDirection = -1;
        this.__shakeOrigPos = this[this.__shakeAxis];
        this.__shakeCount = eval(shakeCount) || 10;
    }

    this[this.__shakeAxis] += this.__shakeSpeed * this.__shakeDirection;

    if (Math.abs(this[this.__shakeAxis] - this.__shakeOrigPos) >= this.__shakeDistance) {
        this[this.__shakeAxis] = this.__shakeOrigPos + (this.__shakeDirection * this.__shakeDistance);
        this.__shakeDirection = -this.__shakeDirection;
        this.__shakeCount--;
    }
    if (this.__shakeCount <= 0) {
        this.__shaking = false;
        this[this.__shakeAxis] = this.__shakeOrigPos;
        return true;
    }
    return false;

};

Sprite_Animated.prototype._do_fadein = function (speed) {
    if (this.__fadingIn === false) {
        this.__fadingIn = true;
    }
    this.opacity += (eval(speed) || 10);

    if (this.opacity >= 255) {
        this.__fadingIn = false;
        return true;
    }
    return false;
};
Sprite_Animated.prototype._do_fadeout = function (speed) {
    this.opacity -= (eval(speed) || 10);
    if (this.opacity <= 0) {
        return true;
    }
    return false;
};
Sprite_Animated.prototype._do_wait = function () {
    $gameTemp.DEX_animationWait = false;
    return true;
};
Sprite_Animated.prototype._do_remove = function (id) {
    this.stop();
    delete $gameTemp.DEX_animatedImages[id];
    return true;
};
Sprite_Animated.prototype.__scaleFromCenterX = function (scaleX, update) {
    update = update || false;
    if (update) {
        this.scale.x += scaleX;
    } else {
        this.scale.x = scaleX;
    }

    this.x = this.__originalX + (this.width - (this.width * this.scale.x)) / 2;
};
Sprite_Animated.prototype.__scaleFromCenterY = function (scaleY, update) {
    update = update || false;
    if (update) {
        this.scale.y += scaleY;
    } else {
        this.scale.y = scaleY;
    }
    this.y = this.__originalY + (this.height - (this.height * this.scale.y)) / 2;
};

DEX.ANI.Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
Game_Interpreter.prototype.updateWait = function () {
    $gameTemp.DEX_animationWait = $gameTemp.DEX_animationWait || false;

    return $gameTemp.DEX_animationWait || DEX.ANI.Game_Interpreter_updateWait.call(this);
};

DEX.ANI.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    DEX.ANI.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === DEX.ANI.CONS.COMMAND_CREATE.toLowerCase()) {
        var id = args.shift();
        var image = args.shift();
        var x = args.shift();
        var y = args.shift();
        $gameTemp.DEX_animatedImages = $gameTemp.DEX_animatedImages || [];
        if (!(id in $gameTemp.DEX_animatedImages) && $gameTemp.DEX_animatedImages[id] === undefined) {
            $gameTemp.DEX_animatedImages[id] = new Sprite_Animated(ImageManager.loadPicture(image), x, y);
        }
    } else if (command.toLowerCase() === DEX.ANI.CONS.COMMAND_DO.toLowerCase()) {

        var id = args.shift();
        var animation = args.shift();
        $gameTemp.DEX_animatedImages = $gameTemp.DEX_animatedImages || [];
        if ((id in $gameTemp.DEX_animatedImages) && $gameTemp.DEX_animatedImages[id] !== undefined) {
            $gameTemp.DEX_animatedImages[id]._addAnimation(animation, args);
            $gameTemp.DEX_animatedImages[id].start();
        } else {
            console.log(command + " " + id + " does not exist. " +
                    "Call " + DEX.ANI.CONS.COMMAND_CREATE + " " + id + " before " + command);
        }
    } else if (command.toLowerCase() === DEX.ANI.CONS.COMMAND_REMOVE.toLowerCase()) {
        var id = args.shift();
        $gameTemp.DEX_animatedImages = $gameTemp.DEX_animatedImages || [];
        if ((id in $gameTemp.DEX_animatedImages) && $gameTemp.DEX_animatedImages[id] !== undefined) {
            $gameTemp.DEX_animatedImages[id]._addAnimation("remove", [id]);
//            $gameTemp.DEX_animatedImages[id].stop();
//            delete $gameTemp.DEX_animatedImages[id];
        } else {
            console.log(command + " " + id + " does not exist. Nothing to remove");
        }
    } else if (command.toLowerCase() === DEX.ANI.CONS.COMMAND_WAIT.toLowerCase()) {
        var id = args.shift();
        $gameTemp.DEX_animatedImages = $gameTemp.DEX_animatedImages || [];
        if ((id in $gameTemp.DEX_animatedImages) && $gameTemp.DEX_animatedImages[id] !== undefined) {
            $gameTemp.DEX_animatedImages[id]._addAnimation("wait", args);
            $gameTemp.DEX_animatedImages[id].start();
            $gameTemp.DEX_animationWait = true;
        }
    }
};
