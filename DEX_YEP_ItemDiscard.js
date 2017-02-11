/*:
 * @plugindesc v1.00 Adds a Discard option in Yanfly's Item Core window
 * @author Procraftynation (http://procraftynation.rocks)
 * This plugin extends Yep_ItemCore addCustomCommandsA to add discard option in items.
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Please visit http://procraftynation.rocks/terms-of-use
 * =====================================================================*/
var Imported = Imported || {};
Imported.DEX_DISCARD = true;
var DEX = DEX || {};
DEX.DISCARD = DEX.DISCARD || {};
//override/use YEP_ItemCore Window_ItemActionCommand.prototype.addCustomCommandsA
Window_ItemActionCommand.prototype.addCustomCommandsA = function () {
    var enabled = this.isDiscardable(this._item);
    var fmt = 'Discard %1';
    text = '\\i[' + this._item.iconIndex + ']';
    if (this._item.textColor !== undefined) {
        text += '\\c[' + this._item.textColor + ']';
    }
    text += this._item.name;
    text = fmt.format(text);
    this.addCommand(text, 'discard', enabled);
};
Window_ItemActionCommand.prototype.isDiscardable = function (item) {
    if (DataManager.isItem(item)) {
        if (item.itypeId === 2) {
            return false;
        }
        return true;
    }
    //else should be an equipment!
    //if equipped - disable!
    for (var i = 0; i < $gameParty.members().length; i++) {
        if ($gameParty.members()[i].equips().contains(item)) {
            return false;
        }

    }
    return true;
};
DEX.DISCARD.Scene_Item_createActionWindow = Scene_Item.prototype.createActionWindow;
Scene_Item.prototype.createActionWindow = function () {
    DEX.DISCARD.Scene_Item_createActionWindow.call(this);
    this._itemActionWindow.setHandler('discard', this.onActionDiscard.bind(this));
    this.addWindow(this._itemActionWindow);
};

Scene_Item.prototype.onActionDiscard = function () {
    this._itemActionWindow.hide();
    this._itemActionWindow.deactivate();
    SoundManager.playMiss();//TODO PARAM
    $gameParty.loseItem(this.item(), 1, true);
    this.activateItemWindow();
};
