/*:
 * @plugindesc v1.00 Adds weight limit to party inventory
 * @author Procraftynation (http://procraftynation.rocks)
 *
 * @param Actor Weight Limit
 * @desc The default weight limit for each actor
 * Values: Number or Formula (see help: WeightLimitFormula)
 * @default 100
 * 
 * @param Party Weight Limit
 * @desc The default weight limit of the whole party
 * @default 0
 * 
 * @param Item Weight
 * @desc The default weight of an item, weapon or armor
 * @default 1
 * 
 * @param Gold Weight
 * @desc The weight of 1 gold
 * @default 0
 * 
 * @param Text Before 
 * @desc Text inserted before the weight display
 * @default Weight:
 * 
 * @param Text After
 * @desc Text inserted after the weight display
 * @default 
 * 
 * @param Text Unit
 * @desc Example: kg, kilos, (any text)...
 * @default 
 * 
 * @param Overweight Text Color
 * @desc Color based on window skin colors (img/system/Window.png)
 * @default 17
 * 
 * @param Disable Dash
 * @desc Disabled dashing when overweight.
 * @default true
 * 
 * @param Normal Speed
 * @desc The movement speed of party when overweight.
 * Values: 1,2,3,4,5,6
 * @default 4
 * 
 * @param Overweight Speed
 * @desc The movement speed of party when overweight.
 * Values: 1,2,3,4,5,6
 * @default 2
 *  
 * @help
 * =====================================================================
 * TAGS
 * 1. Item Tags - placed in the Note section of an Item in the Database
 *  <Weight: [AMOUNT]>
 *      Specify the weight of an item
 *      Example: <Weight: 10>
 *  <WeightLimitAdd: [AMOUNT]>
 *      Increase the weight limit by the amount specified.
 *      Note: 
 *          For consumable items, weight limit is only increased permanently when item is used.
 *          For non-consumable items, weight limit is increased when item is in inventory.
 *      Example: <WeightLimitAdd: 100>
 *      
 * 2. Equipment Tags - placed in the Note section of a Weapon, Armor or Accessory in the Database
 *  <Weight: [AMOUNT]>
 *      Specify the weight of a weapon, armor or accessory.
 *      Example: <Weight: 15>
 *  <WeightLimitAdd: [AMOUNT]>
 *      Increase the weight limit by the amount specified when equipped.
 *      Example: <WeightLimitAdd: 50>
 * 3. Actor Tags - placed in the Note section of an Actor in the Database
 *  <WeightLimit: [AMOUNT]>
 *      Set the weight limit of an actor. Amount will be added to the party weight limit.
 *      Example: <WeightLimit: 100>
 *  <WeightLimitFormula: [FORMULA]>
 *      Set the weight limit of an actor dynamically using a formula.
 *      You can use actor attributes (inspect Game_Actor class for more details):
 *          atk, def, mat, mdf, agi, luk, hit, eva, hp, mp, tp, mhp, mmp, ...
 *      Example: 
 *          <WeightLimitFormula: this.atk*10>
 *              In this example, the weight limit of the actor will be it's attack value times 10.
 *          <WeightLimitFormula: (this.atk*10)-(this.agi*2)>
 *              In this example, the weight limit is based on attack and agility. 
 *              Higher attack increases the weight limit but higher agility lowers the weight limit.
 *      Note: If computed value is negative, it will be set to 0.
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Please visit http://procraftynation.rocks/terms-of-use
 * =====================================================================*/
var Imported = Imported || {};
Imported.DEX_IWL = true;
var DEX = DEX || {};
DEX.IWL = DEX.IWL || {};
//=====================================
// Plugin parameters
//=====================================
DEX.IWL.Param = DEX.IWL.Param || {};
DEX.IWL.Param.partyWeightLimit = Number(PluginManager.parameters('DEX_WeightLimit')["Party Weight Limit"]);
DEX.IWL.Param.actorWeightLimit = PluginManager.parameters('DEX_WeightLimit')["Actor Weight Limit"];
DEX.IWL.Param.itemWeight = Number(PluginManager.parameters('DEX_WeightLimit')["Item Weight"]);
DEX.IWL.Param.goldWeight = Number(PluginManager.parameters('DEX_WeightLimit')["Gold Weight"]);
DEX.IWL.Param.showInItemWindow = PluginManager.parameters('DEX_WeightLimit')["Show In Items"];
DEX.IWL.Param.textBefore = PluginManager.parameters('DEX_WeightLimit')["Text Before"];
DEX.IWL.Param.textAfter = PluginManager.parameters('DEX_WeightLimit')["Text After"];
DEX.IWL.Param.textUnit = PluginManager.parameters('DEX_WeightLimit')["Text Unit"];
DEX.IWL.Param.disableDash = eval(String(PluginManager.parameters('DEX_WeightLimit')["Disable Dash"]));
DEX.IWL.Param.normalSpeed = Number(PluginManager.parameters('DEX_WeightLimit')["Normal Speed"]);
DEX.IWL.Param.overweightSpeed = Number(PluginManager.parameters('DEX_WeightLimit')["Overweight Speed"]);
DEX.IWL.Param.overweightTextColor = Number(PluginManager.parameters('DEX_WeightLimit')["Overweight Text Color"]);
DEX.IWL.Game_Party_initialize = Game_Party.prototype.initialize;
//=====================================
// Game_Party
//=====================================
Game_Party.prototype.initialize = function () {
    DEX.IWL.Game_Party_initialize.call(this);
    this.__weightUsed = 0;
    this.__weightLimit = 0;
    this.__weightLimitBonus = 0;//permantent bonus added by consumable items
};
Game_Party.prototype.weightUsed = function () {
    return this.__weightUsed;
};
Game_Party.prototype.weightLimit = function () {
    return this.__weightLimit;
};
Game_Party.prototype.weightLimitBonus = function () {
    return this.__weightLimitBonus;
};

Game_Party.prototype.refreshWeightValues = function () {
    this.computeWeightLimit();
    this.computeWeightUsed();
    //if overweight, change speed
    if (this.isOverweight()) {
        $gamePlayer.setMoveSpeed(DEX.IWL.Param.overweightSpeed);
    } else {
        $gamePlayer.setMoveSpeed(DEX.IWL.Param.normalSpeed);
    }
};
Game_Party.prototype.computeWeightUsed = function () {
    var used = 0;
    //get gold weight.
    used += DEX.IWL.Param.goldWeight * this.gold();
    //loop through all items in inventory
    for (var i = 0; i < this.allItems().length; i++) {
        used += this.computeTotalItemWeight(this.allItems()[i]);
    }
    //loop through members and equips
    for (var i = 0; i < this.members().length; i++) {
        used += this.members()[i].computeWeightUsed();
    }
    this.__weightUsed = used;
    return used;
}
Game_Party.prototype.computeWeightLimit = function () {
    var limit = DEX.IWL.Param.partyWeightLimit;
    //get members weight limit
    for (var i = 0; i < this.members().length; i++) {
        limit += this.members()[i].computeWeightLimit();
    }
    //get items only, no equips
    for (var i = 0; i < this.items().length; i++) {
        if (this.items()[i].consumable === false) {
            limit += this.items()[i].meta.WeightLimitAdd ? Number(this.items()[i].meta.WeightLimitAdd) : 0;
        }
    }
    this.__weightLimit = limit + this.__weightLimitBonus;
    return limit;
};
Game_Party.prototype.computeTotalItemWeight = function (item) {
    //get single item weight, if no meta found, get default from param
    var itemWeight = item.meta.Weight ? Number(item.meta.Weight) : DEX.IWL.Param.itemWeight;
    // and multiply to item count in inventory
    var itemCount = this.numItems(item);
    return itemWeight * itemCount;
};
Game_Party.prototype.isOverweight = function () {
    return this.weightUsed() > this.weightLimit();
};
Game_Party.prototype.addWeightLimitBonus = function (amount) {
    this.__weightLimitBonus += amount;
};
DEX.IWL.Game_Party_consumeItem = Game_Party.prototype.consumeItem;
Game_Party.prototype.consumeItem = function (item) {
    DEX.IWL.Game_Party_consumeItem.call(this, item);
    //check if item has meta value to add to weight limit permanently, consumable items only
    if (DataManager.isItem(item) && item.consumable) {
        var amountToAdd = item.meta.WeightLimitAdd ? Number(item.meta.WeightLimitAdd) : 0;
        if (amountToAdd !== 0) {
            this.addWeightLimitBonus(amountToAdd);
        }
    }
};
DEX.IWL.Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
    DEX.IWL.Game_Party_gainItem.call(this, item, amount, includeEquip);
    //refresh weight values
    this.refreshWeightValues();
};
//=====================================
// Game_Actor
//=====================================
Game_Actor.prototype.computeWeightUsed = function () {
    var used = 0;
    for (var i = 0; i < this.equips().length; i++) {
        if (this.equips()[i]) {
            var itemWeight = this.equips()[i].meta.Weight ? Number(this.equips()[i].meta.Weight) : DEX.IWL.Param.itemWeight;
            used += itemWeight;
        }
    }
    return used;
};
Game_Actor.prototype.computeWeightLimit = function () {
    //compute based on initial limit set and/or formula
    var limit = 0;
    var limitFormula = this.actor().meta.WeightLimitFormula ? this.actor().meta.WeightLimitFormula : null;//param default
    if (limitFormula !== null) {
        limit = eval(limitFormula);
    } else {
        //default formula or value
        limit = eval(DEX.IWL.Param.actorWeightLimit);
    }
    if (limit < 0) {
        limit = 0;
    }
    var actorLimit = this.actor().meta.WeightLimit ? Number(this.actor().meta.WeightLimit) : 0;
    limit += actorLimit;
    for (var i = 0; i < this.equips().length; i++) {
        if (this.equips()[i]) {
            var additionalLimit = this.equips()[i].meta.WeightLimitAdd ? Number(this.equips()[i].meta.WeightLimitAdd) : 0;
            limit += additionalLimit;
        }
    }
    return limit;
};
//=====================================
// Game_Map
//=====================================
DEX.IWL.Game_Map_isDashDisabled = Game_Map.prototype.isDashDisabled;
Game_Map.prototype.isDashDisabled = function () {
    if (DEX.IWL.Param.disableDash && $gameParty.isOverweight()) {
        return true;
    }
    return DEX.IWL.Game_Map_isDashDisabled.call(this);
};
//=====================================
// Window_WeightLimit
//=====================================
function Window_WeightLimit() {
    this.initialize.apply(this, arguments);
}

Window_WeightLimit.prototype = Object.create(Window_Base.prototype);
Window_WeightLimit.prototype.constructor = Window_WeightLimit;

Window_WeightLimit.prototype.initialize = function (x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this.refresh();
};

Window_WeightLimit.prototype.refresh = function () {
    this.contents.clear();
    $gameParty.refreshWeightValues();
    var used = $gameParty.weightUsed() + "" + DEX.IWL.Param.textUnit;
    var limit = $gameParty.weightLimit() + "" + DEX.IWL.Param.textUnit;
    var weightText = DEX.IWL.Param.textBefore + "" + used + "/" + limit + DEX.IWL.Param.textAfter;
    if ($gameParty.isOverweight()) {
        this.changeTextColor(this.textColor(DEX.IWL.Param.overweightTextColor));
    }
    this.drawText(weightText, 0, 0);
    this.resetTextColor();
};

//=====================================
// Scene_Item
//=====================================
DEX.IWL.Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
Scene_Item.prototype.createItemWindow = function () {
    DEX.IWL.Scene_Item_createItemWindow.call(this);
    this.createWeightLimitWindow();
};

Scene_Item.prototype.createWeightLimitWindow = function () {
    var wx = this._itemWindow.x;
    var ww = this._itemWindow.width;
    var wh = this._itemWindow.fittingHeight(1);
    this._itemWindow.height = this._itemWindow.height - wh;
    this._itemWindow.refresh();
    var wy = this._itemWindow.y + this._itemWindow.height;
    this._weightLimitWindow = new Window_WeightLimit(wx, wy, ww, wh);
    this.addWindow(this._weightLimitWindow);
};

DEX.IWL.Scene_Item_useItem = Scene_Item.prototype.useItem;
Scene_Item.prototype.useItem = function () {
    DEX.IWL.Scene_Item_useItem.call(this);
    if (this._weightLimitWindow) {
        this._weightLimitWindow.refresh();
    }
};
