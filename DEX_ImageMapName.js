/*:
 * @plugindesc v1.00 Replace map name display with an image and animate it!
 * @author Procraftynation - procrastination done right!
 *  
 * @param Position
 * @desc Position based on the keyboard numpad positions
 * Values: 1,2,4,5,6,7,8,9
 * @default 7 
 
 * @param Show Count
 * @desc Number of frames to display image after fade in or move in
 * @default 150
 * 
 * @param Display Opacity
 * @desc The opacity of the image when displayed.
 * Values: 1-255.
 * @default 255
 * 
 * @param Fade In Speed
 * @desc Fade speed in frames. Place 0 to disabled fade
 * @default 16
 * 
 * @param Fade Out Speed
 * @desc Fade speed in frames. Place 0 to disabled fade
 * @default 16
 * 
 * @param Move In From
 * @desc Direction from which the image moves/slides from to Position
 * Values:left|right|top|bottom|topleft|topright|bottomleft|bottomright
 * @default 
 * 
 * @param Move Out To
 * @desc Direction to which the image moves/slides to from Position
 * Values:left|right|top|bottom|topleft|topright|bottomleft|bottomright
 * @default 
 * 
 * @param Move In Speed
 * @desc Movement speed in frames
 * @default 16
 * 
 * @param Move Out Speed
 * @desc Movement speed in frames
 * @default 16
 * 
 * @param Padding Left
 * @desc Left padding in pixels or code
 * @default this.standardPadding()
 * 
 * @param Padding Right
 * @desc Right padding in pixels or code
 * @default this.standardPadding()
 * 
 * @param Padding Top
 * @desc Top padding in pixels or code
 * @default this.standardPadding()
 * 
 * @param Padding Bottom
 * @desc Bottom padding in pixels or code
 * @default this.standardPadding()
 * 
 * @help
 * ============================================================================
 * To use an image as map name simple create an <img:[imagename]> tag and place 
 * it in the 'Display Name' in your map options in RPG Maker MV where you 
 * normally place your map name. The [imagename] should be replaced with your image file name found in img/pictures.
 * 
 * Example: <img:MyAwesomeMapImageName>
 * 
 * ============================================================================
 * Additional Options
 * ============================================================================
 * In this section you will learn how to add options on where/how to display
 * your awesome map image.
 * 
 * Here is an example: 
 * <img:SomeAwesomeImage,position:1,showcount:200,moveinfrom:bottom,moveoutto:bottom>
 * 
 * In the above example we have 4 additional options! Setting the position to lower left,
 * displaying the image for 200 frames and making the entrance to appear from bottom
 * and exit effect to dissappear moving down!
 * 
 * Format: <img:[imagename],[option:value],[option:value]...>
 * 
 * Below is a list of options you can use:
 * 
 * 1. showcount - the number of frames the image is displayed.
 *      Note: counting is started only after fadein/movein
 * 2. position - placement of the image in the screen based on the numpad position.
 *      7     8     9
 *      4     5     6
 *      1     2     3
 * 3. opacity - the opacity of the image when displayed. 
 *      Values: 1-255
 *      Note: fadein will increment until it will reach the opacity value provided.
 * 4. fadeinspeed - the speed on which the image fades in. 
 *      Note: this is the number added to the opacity per frame. 
 *      Actual speed in seconds = (255/fadeinspeed/60) -->60 frames per second.
 *      This note is the same for all speed.
 * 5. fadeoutspeed - the speed on which the image fades out.
 * 6. moveinfrom - move the image from outside of screen to 'position'.
 *      For example if 'left' is specifed and position is 5, the image will
 *      appear moving from left of screen to center screen(position=5).
 *      Values: left|right|top|bottom|topleft|topright|bottomleft|bottomright.
 * 7. moveoutto - move the image from 'position' to outside of screen.
 *      Values: left|right|top|bottom|topleft|topright|bottomleft|bottomright.
 * 8. moveinspeed - the speed on which the image moves towards the position specified.
 * 9. moveoutspeed - the speed on which the image moves from position specified to outside of screen.
 * 10. padleft - number of pixels padded to the left of the image.
 * 11. padright - number of pixels padded to the right of the image.
 * 12. padtop - number of pixels padded to the top of the image.
 * 13. padbottom - number of pixels padded to the bottom of the image.
 *
 * ============================================================================
 * More examples!
 * ============================================================================
 * 1. <img:NomadCampMapName,position:5>
 * 2. <img:ForestMapName,position:1,moveinfrom:bottom,moveoutto:bottom,fadeoutspeed:0,padBottom:0>
 * 3. <img:ForestMapName1,position:7,moveinfrom:left,moveoutto:top,fadeoutspeed:0,padLeft:0,padTop:0>
 * 4. <img:ForestMapName2,position:9,moveinfrom:top,moveoutto:right,fadeoutspeed:0,padTop:0>
 * 5. <img:ForestMapName3,position:9,moveinspeed:20,moveinfrom:right,moveoutto:bottom,fadeoutspeed:5,padtop:0,padright:0>
 *
 */

var Imported = Imported || {};
Imported.DEX_IMN = true;
var DEX = DEX || {};
DEX.IMN = DEX.IMN || {};
//=====================================
// Plugin constants
//=====================================
DEX.IMN.CONS = {
    POS_LOWER_LEFT: 1, POS_LOWER_CENTER: 2, POS_LOWER_RIGHT: 3, POS_CENTER_LEFT: 4,
    POS_CENTER_CENTER: 5, POS_CENTER_RIGHT: 6, POS_UPPER_LEFT: 7, POS_UPPER_CENTER: 8,
    POS_UPPER_RIGHT: 9,
    MOV_LEFT: "left", MOV_RIGHT: "right", MOV_TOP: "top", MOV_BOTTOM: "bottom",
    MOV_TOPLEFT: "topleft", MOV_TOPRIGHT: "topright", MOV_BOTTOMLEFT: "bottomleft", MOV_BOTTOMRIGHT: "bottomright"
};
//=====================================
// Plugin parameters
//=====================================
DEX.IMN.Param = DEX.IMN.Param || {};
DEX.IMN.Param.position = Number(PluginManager.parameters('DEX_ImageMapName')["Position"]);
DEX.IMN.Param.fadeInSpeed = Number(PluginManager.parameters('DEX_ImageMapName')["Fade In Speed"]);
DEX.IMN.Param.fadeOutSpeed = Number(PluginManager.parameters('DEX_ImageMapName')["Fade Out Speed"]);
DEX.IMN.Param.moveInFrom = String(PluginManager.parameters('DEX_ImageMapName')["Move In From"]);
DEX.IMN.Param.moveOutTo = String(PluginManager.parameters('DEX_ImageMapName')["Move Out To"]);
DEX.IMN.Param.moveInSpeed = Number(PluginManager.parameters('DEX_ImageMapName')["Move In Speed"]);
DEX.IMN.Param.moveOutSpeed = Number(PluginManager.parameters('DEX_ImageMapName')["Move Out Speed"]);
DEX.IMN.Param.showCount = Number(PluginManager.parameters('DEX_ImageMapName')["Show Count"]);
DEX.IMN.Param.displayOpacity = Number(PluginManager.parameters('DEX_ImageMapName')["Display Opacity"]);
DEX.IMN.Param.paddingLeft = String(PluginManager.parameters('DEX_ImageMapName')["Padding Left"]);
DEX.IMN.Param.paddingRight = String(PluginManager.parameters('DEX_ImageMapName')["Padding Right"]);
DEX.IMN.Param.paddingTop = String(PluginManager.parameters('DEX_ImageMapName')["Padding Top"]);
DEX.IMN.Param.paddingBottom = String(PluginManager.parameters('DEX_ImageMapName')["Padding Bottom"]);

//=====================================
// Window_MapName: Overriden Methods
//=====================================
DEX.IMN.Window_MapName_initialize = Window_MapName.prototype.initialize;
Window_MapName.prototype.initialize = function () {
    //init boolean flags
    this.__fadingInFinished = false;
    this.__fadingOutFinished = false;
    this.__movingInFinished = false;
    this.__movingOutFinished = false;
    this.__showFinished = false;
    this.__isImage = false;
    this.parseMapNameForImageOpts();

    DEX.IMN.Window_MapName_initialize.call(this);
};

DEX.IMN.Window_MapName_open = Window_MapName.prototype.open;
Window_MapName.prototype.open = function () {
    if (this.__isImage === false) {
        DEX.IMN.Window_MapName_open.call(this);
    }
    this.refresh();
    this.__isMapNameShowed = false;
};

DEX.IMN.Window_MapName_refresh = Window_MapName.prototype.refresh;
Window_MapName.prototype.refresh = function () {
    if (this.__isImage === false) {
        DEX.IMN.Window_MapName_refresh.call(this);
        return;
    }
    if ($gameMap.displayName()) {
        //recreate contents with the new width and height based on image map name
        this.width = this.__mapNameImage.width + this.__paddingLeft + this.__paddingRight;
        this.height = this.__mapNameImage.height + this.__paddingTop + this.__paddingBottom;
        this.createContents();
        this.contents.blt(this.__mapNameImage, 0, 0, this.__mapNameImage.width, this.__mapNameImage.height, this.__paddingLeft, this.__paddingTop);
        this.setPosition();
    }
};

DEX.IMN.Window_MapName_standardPadding = Window_MapName.prototype.standardPadding;
Window_MapName.prototype.standardPadding = function () {
    if (this.__isImage === false) {
        return DEX.IMN.Window_MapName_standardPadding.call(this);
    }
    return 0;
};

DEX.IMN.Window_MapName_update = Window_MapName.prototype.update;
Window_MapName.prototype.update = function () {
    if (this.__isImage === false) {
        DEX.IMN.Window_MapName_update.call(this);
        return;
    }
    if (this.__isMapNameShowed || !$gameMap.isNameDisplayEnabled()) {
        return;
    }
    if (this.__fadingInFinished === false || this.__movingInFinished === false) {
        this.updateFadeIn();
        this.updateMoveIn();

    } else if (this.__showFinished === false) {
        this.updateShow();

    } else if (this.__fadingOutFinished === false || this.__movingOutFinished === false) {
        this.updateMoveOut();
        
        //do not fade out until movement is finished if fadeout speed is 0
        if (this.__movingOutFinished === true) {
            this.updateFadeOut();
        }
        if(this.__movingOutFinished === false && this.__fadeOutSpeed > 0) {
            this.updateFadeOut();
        }
    } else {
        this.__isMapNameShowed = true;
    }
};
DEX.IMN.Window_MapName_updateFadeIn = Window_MapName.prototype.updateFadeIn;
Window_MapName.prototype.updateFadeIn = function () {
    if (this.__isImage === false) {
        DEX.IMN.Window_MapName_updateFadeIn.call(this);
        return;
    }
    if (this.__fadeInSpeed > 0) {
        this.contentsOpacity += this.__fadeInSpeed;
    } else {
        this.contentsOpacity = this.__displayOpacity;
    }
    if (this.contentsOpacity >= this.__displayOpacity) {
        this.__fadingInFinished = true;
    }
};
DEX.IMN.Window_MapName_updateFadeOut = Window_MapName.prototype.updateFadeOut;
Window_MapName.prototype.updateFadeOut = function () {
    if (this.__isImage === false) {
        DEX.IMN.Window_MapName_updateFadeOut.call(this);
        return;
    }
    if (this.__fadeOutSpeed > 0) {
        this.contentsOpacity -= this.__fadeOutSpeed;
    } else {
        this.contentsOpacity = 0;
    }
    if (this.contentsOpacity <= 0) {
        this.__fadingOutFinished = true;
    }
};

//=====================================
// Window_MapName: Custom Methods added
//=====================================
Window_MapName.prototype.parseMapNameForImageOpts = function () {
    var match = $gameMap.displayName().match(/[<][i][m][g][:]([^>]+)>/i);
    if (match) {
        var opts = match[1].trim().split(/,+/);
        this.__imageFileName = opts[0];//must be the image
        //set defaults from parameters
        this.__showCount = DEX.IMN.Param.showCount;
        this.__displayOpacity = DEX.IMN.Param.displayOpacity;
        this.__position = DEX.IMN.Param.position;
        this.__fadeInSpeed = DEX.IMN.Param.fadeInSpeed;
        this.__fadeOutSpeed = DEX.IMN.Param.fadeOutSpeed;
        this.__moveInFrom = DEX.IMN.Param.moveInFrom;
        this.__moveOutTo = DEX.IMN.Param.moveOutTo;
        this.__moveInSpeed = DEX.IMN.Param.moveInSpeed;
        this.__moveOutSpeed = DEX.IMN.Param.moveOutSpeed;
        this.__paddingLeft = eval(DEX.IMN.Param.paddingLeft);
        this.__paddingRight = eval(DEX.IMN.Param.paddingRight);
        this.__paddingTop = eval(DEX.IMN.Param.paddingTop);
        this.__paddingBottom = eval(DEX.IMN.Param.paddingBottom);

        for (var i = 0; i < opts.length; i++) {
            var keyValue = opts[i].split(/[\s]*:[\s]*/);
            if (keyValue[0].toLowerCase() == "showcount") {
                //using own showCount var
                this.__showCount = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "position") {
                this.__position = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "opacity") {
                this.__displayOpacity = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "fadeinspeed") {
                this.__fadeInSpeed = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "fadeoutspeed") {
                this.__fadeOutSpeed = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "moveinfrom") {
                this.__moveInFrom = keyValue[1];
            } else if (keyValue[0].toLowerCase() == "moveoutto") {
                this.__moveOutTo = keyValue[1];
            } else if (keyValue[0].toLowerCase() == "moveinspeed") {
                this.__moveInSpeed = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "moveoutspeed") {
                this.__moveOutSpeed = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "padding") {
                this.__padding = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "padleft") {
                this.__paddingLeft = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "padright") {
                this.__paddingRight = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "padtop") {
                this.__paddingTop = parseInt(keyValue[1], 10);
            } else if (keyValue[0].toLowerCase() == "padbottom") {
                this.__paddingBottom = parseInt(keyValue[1], 10);
            }
        }
        this.__isImage = true;
        this.__isMapNameShowed = true;//set to true until .open is called
        this.__mapNameImage = ImageManager.loadPicture(this.__imageFileName);
    }
};

Window_MapName.prototype.setPosition = function () {
    switch (this.__position) {
        case DEX.IMN.CONS.POS_LOWER_LEFT:
            this.x = 0;
            this.y = Graphics.height - this.height;
            break;
        case DEX.IMN.CONS.POS_LOWER_CENTER:
            this.x = Graphics.width / 2 - this.width / 2;
            this.y = Graphics.height - this.height;
            break;
        case DEX.IMN.CONS.POS_LOWER_RIGHT:
            this.x = Graphics.width - this.width;
            this.y = Graphics.height - this.height;
            break;
        case DEX.IMN.CONS.POS_CENTER_LEFT:
            this.x = 0
            this.y = Graphics.height / 2 - this.height / 2;
            break;
        case DEX.IMN.CONS.POS_CENTER_CENTER:
            this.x = Graphics.width / 2 - this.width / 2;
            this.y = Graphics.height / 2 - this.height / 2;
            break;
        case DEX.IMN.CONS.POS_CENTER_RIGHT:
            this.x = Graphics.width - this.width;
            this.y = Graphics.height / 2 - this.height / 2;

            break;
        case DEX.IMN.CONS.POS_UPPER_LEFT:
            this.x = 0;
            this.y = 0;
            break;
        case DEX.IMN.CONS.POS_UPPER_CENTER:
            this.x = Graphics.width / 2 - this.width / 2;
            this.y = 0;

            break;
        case DEX.IMN.CONS.POS_UPPER_RIGHT:
            this.x = Graphics.width - this.width;
            this.y = 0;
            break;
    }
    if (this.__moveInSpeed > 0) {
        this.setMoveInPosition();
    }
    if (this.__moveOutSpeed > 0) {
        this.setMoveOutPosition();
    }
    if (this.__moveInSpeed > 0 || this.__moveOutSpeed > 0) {
        this.setMoveRatio();
    }
};
Window_MapName.prototype.setMoveInPosition = function () {
    //set from coordinates to outside of visible area
    //x
    this.__moveInDesPosX = this.x;
    this.__moveInDesPosY = this.y;

    if (this.isMoveLeft(this.__moveInFrom)) {
        this.x = 0 - this.width;
    } else if (this.isMoveRight(this.__moveInFrom)) {
        this.x = Graphics.width + this.width;
    }
    //y
    if (this.isMoveTop(this.__moveInFrom)) {
        this.y = 0 - this.height;
    } else if (this.isMoveBottom(this.__moveInFrom)) {
        this.y = Graphics.height + this.height;
    }
};
Window_MapName.prototype.setMoveOutPosition = function () {
    //set from coordinates to outside of visible area
    //x
    if (this.isMoveLeft(this.__moveOutTo)) {
        this.__moveOutDesPosX = 0 - this.width;
    } else if (this.isMoveRight(this.__moveOutTo)) {
        this.__moveOutDesPosX = Graphics.width + this.width;
    }
    //y
    if (this.isMoveTop(this.__moveOutTo)) {
        this.__moveOutDesPosY = 0 - this.height;
    } else if (this.isMoveBottom(this.__moveOutTo)) {
        this.__moveOutDesPosY = Graphics.height + this.height;
    }
};
Window_MapName.prototype.setMoveRatio = function () {
    //compute speed ratio for diagonal movement
    this.__moveRatioX = 1;
    this.__moveRatioY = 1;
    if (Graphics.width > Graphics.height) {
        //slow down the Y movement
        this.__moveRatioY = Graphics.height / Graphics.width;
    } else if (Graphics.width < Graphics.height) {
        //slow down the X movement
        this.__moveRatioX = Graphics.width / Graphics.height;
    }
};
Window_MapName.prototype.updateShow = function () {
    if (this.__showCount >= 0) {
        this.__showCount--;
    } else {
        this.__showFinished = true;
    }
};
Window_MapName.prototype.updateMoveIn = function () {

    var moveFinX = false;
    var moveFinY = false;
    if (this.isMoveLeft(this.__moveInFrom)) {
        this.x += this.__moveInSpeed * this.__moveRatioX;
        if (this.x >= this.__moveInDesPosX) {
            this.x = this.__moveInDesPosX;
            moveFinX = true;
        }
    } else if (this.isMoveRight(this.__moveInFrom)) {
        this.x -= this.__moveInSpeed * this.__moveRatioX;
        if (this.x <= this.__moveInDesPosX) {
            this.x = this.__moveInDesPosX;
            moveFinX = true;
        }
    } else {
        moveFinX = true;
    }
    if (this.isMoveTop(this.__moveInFrom)) {
        this.y += this.__moveInSpeed * this.__moveRatioY;
        if (this.y >= this.__moveInDesPosY) {
            this.y = this.__moveInDesPosY;
            moveFinY = true;
        }
    } else if (this.isMoveBottom(this.__moveInFrom)) {
        this.y -= this.__moveInSpeed * this.__moveRatioY;
        if (this.y <= this.__moveInDesPosY) {
            this.y = this.__moveInDesPosY;
            moveFinY = true;
        }
    } else {
        moveFinY = true;
    }
    if (moveFinX === true && moveFinY === true) {
        this.__movingInFinished = true;
    }
};
Window_MapName.prototype.updateMoveOut = function () {

    var moveFinX = false;
    var moveFinY = false;
    if (this.isMoveLeft(this.__moveOutTo)) {
        this.x -= this.__moveOutSpeed * this.__moveRatioX;
        if (this.x <= this.__moveOutDesPosX) {
            this.x = this.__moveOutDesPosX;
            moveFinX = true;
        }
    } else if (this.isMoveRight(this.__moveOutTo)) {
        this.x += this.__moveOutSpeed * this.__moveRatioX;
        if (this.x >= this.__moveOutDesPosX) {
            this.x = this.__moveOutDesPosX;
            moveFinX = true;
        }
    } else {
        moveFinX = true;
    }
    if (this.isMoveTop(this.__moveOutTo)) {
        this.y -= this.__moveOutSpeed * this.__moveRatioY;
        if (this.y <= this.__moveOutDesPosY) {
            this.y = this.__moveOutDesPosY;
            moveFinY = true;
        }
    } else if (this.isMoveBottom(this.__moveOutTo)) {
        this.y += this.__moveOutSpeed * this.__moveRatioY;
        if (this.y >= this.__moveOutDesPosY) {
            this.y = this.__moveOutDesPosY;
            moveFinY = true;
        }
    } else {
        moveFinY = true;
    }
    if (moveFinX === true && moveFinY === true) {
        this.__movingOutFinished = true;
    }
};
//=====================================
// Some Helper methods
//=====================================
Window_MapName.prototype.isMoveLeft = function (move) {
    if (move === DEX.IMN.CONS.MOV_LEFT || move === DEX.IMN.CONS.MOV_TOPLEFT
            || move === DEX.IMN.CONS.MOV_BOTTOMLEFT) {
        return true;
    }
    return false;
};
Window_MapName.prototype.isMoveRight = function (move) {
    if (move === DEX.IMN.CONS.MOV_RIGHT || move === DEX.IMN.CONS.MOV_TOPRIGHT
            || move === DEX.IMN.CONS.MOV_BOTTOMRIGHT) {
        return true;
    }
    return false;
};
Window_MapName.prototype.isMoveTop = function (move) {
    if (move === DEX.IMN.CONS.MOV_TOP || move === DEX.IMN.CONS.MOV_TOPLEFT
            || move === DEX.IMN.CONS.MOV_TOPRIGHT) {
        return true;
    }
    return false;
};
Window_MapName.prototype.isMoveBottom = function (move) {
    if (move === DEX.IMN.CONS.MOV_BOTTOM || move === DEX.IMN.CONS.MOV_BOTTOMLEFT
            || move === DEX.IMN.CONS.MOV_BOTTOMRIGHT) {
        return true;
    }
    return false;
};
