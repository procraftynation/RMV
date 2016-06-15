/*:
 * @plugindesc v1.0 Detect aspect ratio and change resolution based on options specified
 * @author Procraftynation - https://www.youtube.com/c/procraftynation
 *
 * @param 4:3 Width
 * @desc The replacement width when user's aspect ratio is 4:3
 *
 * @param 4:3 Height
 * @desc The replacement height when user's aspect ratio is 4:3
 * 
 * @param 16:9 Width
 * @desc The replacement width when user's aspect ratio is 16:9
 *
 * @param 16:9 Height
 * @desc The replacement height when user's aspect ratio is 16:9
 *
 * @param 21:9 Width
 * @desc The replacement width when user's aspect ratio is 21:9
 *
 * @param 21:9 Height
 * @desc The replacement height when user's aspect ratio is 21:9
 * 
 * @param 8:5 Width
 * @desc The replacement width when user's aspect ratio is 8:5
 *
 * @param 8:5 Height
 * @desc The replacement height when user's aspect ratio is 8:5
 *
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Free for use in non-commercial and commercial games just give credit
 * and link back to https://www.youtube.com/c/procraftynation.
 * If commercial, a free copy of the game is awesome but optional.
 * =====================================================================*/

var Imported = Imported || {};
Imported.DEX_SRBR = true;
var DEX = DEX || {};
DEX.SRBR = DEX.SRBR || {};
//=====================================
// Plugin constants
//=====================================
DEX.SRBR = DEX.SRBR || {};
DEX.SRBR.CONS = {
    RATIO_4_3: "4:3",
    RATIO_16_9: "16:9",
    RATIO_21_9: "21:9",
    RATIO_8_5: "8:5",
};
//=====================================
// Plugin parameters
//=====================================
DEX.SRBR.Param = DEX.SRBR.Param || {};
DEX.SRBR.Param.width_4_3 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["4:3 Width"]);
DEX.SRBR.Param.height_4_3 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["4:3 Height"]);
DEX.SRBR.Param.width_16_9 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["16:9 Width"]);
DEX.SRBR.Param.height_16_9 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["16:9 Height"]);
DEX.SRBR.Param.width_21_9 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["21:9 Width"]);
DEX.SRBR.Param.height_21_9 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["21:9 Height"]);
DEX.SRBR.Param.width_8_5 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["8:5 Width"]);
DEX.SRBR.Param.height_8_5 = Number(PluginManager.parameters('DEX_SwitchResoByRatio')["8:5 Height"]);

//=====================================
// Plugin methods
//=====================================
DEX.SRBR.getGCD = function (a, b) {
    return (b === 0) ? a : this.getGCD(b, a % b);
};
DEX.SRBR.calculateAspectRatio = function () {
    this.gcd = this.getGCD(window.screen.width, window.screen.height);
    this.aspectRatio = window.screen.width / this.gcd + ":" + window.screen.height / this.gcd;
    //and set newheight and new width
    if (this.aspectRatio === DEX.SRBR.CONS.RATIO_4_3) {
        this.newWidth = DEX.SRBR.Param.width_4_3 || -1;
        this.newHeight = DEX.SRBR.Param.height_4_3 || -1;
    } else if (this.aspectRatio === DEX.SRBR.CONS.RATIO_16_9) {
        this.newWidth = DEX.SRBR.Param.width_16_9 || -1;
        this.newHeight = DEX.SRBR.Param.height_16_9 || -1;
    } else if (this.aspectRatio === DEX.SRBR.CONS.RATIO_21_9) {
        this.newWidth = DEX.SRBR.Param.width_21_9 || -1;
        this.newHeight = DEX.SRBR.Param.height_21_9 || -1;
    } else if (this.aspectRatio === DEX.SRBR.CONS.RATIO_8_5) {
        this.newWidth = DEX.SRBR.Param.width_8_5 || -1;
        this.newHeight = DEX.SRBR.Param.height_8_5 || -1;
    } else {
        this.newWidth = -1;
        this.newHeight = -1;
    }
};
DEX.SRBR.switchResolution = function () {
    this.calculateAspectRatio();
    if (this.newWidth === -1 || this.newHeight === -1) {
        return; //don't change resolution
    }
    SceneManager._screenWidth = this.newWidth;
    SceneManager._screenHeight = this.newHeight;
    SceneManager._boxWidth = this.newWidth;
    SceneManager._boxHeight = this.newHeight;
};
//=====================================
// SceneManager: overriden methods
//=====================================
DEX.SRBR.SceneManager_run = SceneManager.run;
SceneManager.run = function (sceneClass) {
    DEX.SRBR.SceneManager_run.call(this, sceneClass);
    if (!Imported.YEP_CoreEngine) {
        var resizeWidth = Graphics.boxWidth - window.innerWidth;
        var resizeHeight = Graphics.boxHeight - window.innerHeight;
        window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
        window.resizeBy(resizeWidth, resizeHeight);
    }
};
//=====================================
// Plugin execution
//=====================================
DEX.SRBR.switchResolution();
