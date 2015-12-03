/*:
 * @plugindesc v1.0 Tries to load jpg files if no png found
 * @author Procraftynation - procrastination done right!
 * 
 * @param Prioritize JPG
 * @desc Tries to load jpg files first before trying png
 * Values: true | false
 * @default false
 */

var Imported = Imported || {};
Imported.DEX_TryJPG = true;
(function() { 
   var DEX = DEX || {}; //DEX's main object
   DEX.TryJPG = DEX.TryJPG || {}; // tombstone object for functions and aliases
   
   DEX.TryJPG.jpgFirst = String(PluginManager.parameters('DEX_TryJPG')["Prioritize JPG"]);//true or false
   
   //'function overrides' will depend on the Prioritize JPG flag.
   if(eval(DEX.TryJPG.jpgFirst)) {
      ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
         if (filename) {
           var path = folder + encodeURIComponent(filename) + '.jpg';//changed from png to jpg
           var bitmap = this.loadNormalBitmap(path, hue || 0);
           bitmap.smooth = smooth;
           return bitmap;
         } else {
           return this.loadEmptyBitmap();
         }
      };
      Bitmap.prototype._onError = function() {
         if(!this._triedPNG) {
            //change extension file to png assuming the last 3 characters of src is jpg
            this._image.src = this._image.src.substr(0,this._image.src.length-3) + 'png';
            this._triedPNG = true;
         } else {
            this._hasError = true;
         }
      };
   } else {
      Bitmap.prototype._onError = function() {
         if(!this._triedJPG) {
            //change extension file to jpg assuming the last 3 characters of src is png
            this._image.src = this._image.src.substr(0,this._image.src.length-3) + 'jpg';
            this._triedJPG = true;
         } else {
            this._hasError = true;
         }
      };
   }
})();
