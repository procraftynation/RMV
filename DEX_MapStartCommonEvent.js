/*:
 * @plugindesc v1.00 Allows a common event to run on start of a Scene_Map, without creating an autorun.
 * @author Procraftynation - https://www.youtube.com/c/procraftynation
 *                         - https://github.com/procraftynation
 * @help
 * =====================================================================
 * Usage Syntax to be placed on a Map's Note:
 * <OnMapStartCommonEvent:COMMON_EVENT_ID>
 * Example:
 * <OnMapStartCommonEvent:1>
 *   - Calls the Common Event 1 when the map is just started.
 * NOTE: Only 1 common event can run on map start
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Free for use in non-commercial and commercial games just give credit
 * and link back to https://www.youtube.com/c/procraftynation.
 * If commercial, a free copy of the game is awesome but optional.
 * =====================================================================
 */

var DEX = DEX || {};
DEX.MSCE = DEX.MSCE || {};
DEX.MSCE.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function () {
    DEX.MSCE.Scene_Map_start.call(this);
    var commonEventId = $dataMap.meta.OnMapStartCommonEvent;
    if (commonEventId) {
        $gameTemp.reserveCommonEvent(commonEventId);
    }
};