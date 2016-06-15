/*:
 * @plugindesc v1.0 A new game plus (NG Plus) script that reads a switch inside saved files.
 * A new game plus mode switch is enabled when a new game plus save file is loaded
 * @author Procraftynation - https://www.youtube.com/c/procraftynation
 *
 * @param Menu Text
 * @desc The text to be displayed for the New Game + Menu
 * @default New Game +
 *
 * @param Display Mode
 * @desc Disable or Hide New Game + menu
 * Values: disable | hide
 * @default disable
 *
 * @param Game Complete Switch
 * @desc The switch ID enabled in-game to tell that the game is completed.
 * @default 1
 *
 * @param NG Plus Mode Switch
 * @desc The switch ID that tells you are in New Game Plus Mode
 * @default 2
 *
 * @help
 * A new game plus (NG Plus) script that reads a switch (Game Complete Switch) inside saved files.
 * When a saved file is selected from New Game + menu, a switch (NG Plus Mode Switch) is enabled.
 * =====================================================================
 * Terms of Use
 * =====================================================================
 * Free for use in non-commercial and commercial games just give credit
 * and link back to https://www.youtube.com/c/procraftynation.
 * If commercial, a free copy of the game is awesome but optional.
 * =====================================================================*/
 
(function() {
	var DEX = DEX || {}; // DEX's main object
	DEX.ngPlus = DEX.ngPlus || {}; // Object Alias
	//plugin parameters
	DEX.ngPlus.menuText = PluginManager.parameters('DEX_NGPlus')["Menu Text"];
	DEX.ngPlus.displayMode = PluginManager.parameters('DEX_NGPlus')["Display Mode"].toLowerCase();
	DEX.ngPlus.gameCompleteSwitchId = PluginManager.parameters('DEX_NGPlus')["Game Complete Switch"];
	DEX.ngPlus.ngPlusModeSwitchId = PluginManager.parameters('DEX_NGPlus')["NG Plus Mode Switch"];
	
	DEX.ngPlus.ngPlusCommandSelected = false;
	//override from rpg_windows.js
	Window_TitleCommand.prototype.makeCommandList = function() {
		this.addCommand(TextManager.newGame,   'newGame');
		
		//add the new game plus menu to the second
		if(DEX.ngPlus.isNGPlusEnabled()) {
			this.addCommand(DEX.ngPlus.menuText,'ngPlus' , true);
		} else if(DEX.ngPlus.displayMode == "disable") {
			this.addCommand(DEX.ngPlus.menuText,'ngPlus' , false);
		}
		
		this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
		this.addCommand(TextManager.options,   'options');
		
    };    
	//override from rpg_scenes.js
	Scene_Title.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
        this._commandWindow.setHandler('ngPlus', this.commandNGPlus.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };
	
	//override from rpg_windows.js
	DEX.ngPlus.Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
	Window_SavefileList.prototype.drawItem = function(index) {
		if(DEX.ngPlus.ngPlusCommandSelected) {
			//override draw	
			var id = index + 1;
			var isValidForNGPlus = DEX.ngPlus.isGameCompleteSwitchOn(id);
			var valid = DataManager.isThisGameFile(id);
			var info = DataManager.loadSavefileInfo(id);
			var rect = this.itemRectForText(index);
			this.resetTextColor();
			if (this._mode === 'load') {
				this.changePaintOpacity(isValidForNGPlus);
				
			}
			this.drawFileId(id, rect.x, rect.y);
			if (info) {
				this.changePaintOpacity(isValidForNGPlus);
				this.drawContents(info, rect, valid);
				this.changePaintOpacity(valid);
			}
		} else {
			//call default drawItem
			DEX.ngPlus.Window_SavefileList_drawItem.call(this, index);
		}
	};
	
	//loads the Continue Screen
	Scene_Title.prototype.commandNGPlus = function() {
        this._commandWindow.close();
		//set new game plus selected
		DEX.ngPlus.ngPlusCommandSelected = true;
		SceneManager.push(Scene_Load);
    };
	//override from rpg_scenes.js
	//called when a save file is selected in the load scene
	Scene_Load.prototype.onSavefileOk = function() {
		//call default method
		Scene_File.prototype.onSavefileOk.call(this);
		//from ngplus menu and game complete switch is false.
		if(DEX.ngPlus.ngPlusCommandSelected && 
			!DEX.ngPlus.isGameCompleteSwitchOn(this.savefileId())) {
				this.onLoadFailure();
		} else {
			if (DataManager.loadGame(this.savefileId())) {
				this.onLoadSuccess();
			} else {
				this.onLoadFailure();
			}
		}
	};
	
	DEX.ngPlus.Scene_Load_terminate = Scene_Load.prototype.terminate;
	Scene_Load.prototype.terminate = function() {
		DEX.ngPlus.Scene_Load_terminate.call(this);
		//turn off ngPlus checking if load screen is terminated.
		DEX.ngPlus.ngPlusCommandSelected = false;
	};
	
	
	DEX.ngPlus.Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
	Scene_Load.prototype.onLoadSuccess = function() {
		//load normal saved game
		DEX.ngPlus.Scene_Load_onLoadSuccess.call(this);
		try {
			
			if(DEX.ngPlus.ngPlusCommandSelected) {
				//set new game plus mode on loaded game
				$gameSwitches.setValue(DEX.ngPlus.ngPlusModeSwitchId, true);
				
			}
		} catch (e) {
			console.error(e);
			//do nothing
		}
	}
	
	DEX.ngPlus.isNGPlusEnabled = function() {
		//based from DataManager.loadGlobalInfo
		var json;
		try {
			json = StorageManager.load(0);
		} catch (e) {
			console.error(e);
			return [];
		}
		if (json) {
			var globalInfo = JSON.parse(json);
			var isNGplusEnabled = false;
			for (var i = 1; i <= DataManager.maxSavefiles(); i++) {
				if (StorageManager.exists(i)) {
					if(DEX.ngPlus.isGameCompleteSwitchOn(i)) {
						//just one
						return true;
					}
				}
			}
			return false;
		} else {
			return false;
		}
	}
	DEX.ngPlus.isGameCompleteSwitchOn = function(saveFileId) {
		//based from DataManager.loadGlobalInfo
		var json;
		try {
			json = StorageManager.load(saveFileId);
		} catch (e) {
			console.error(e);
			return false;
		}
		if (json) {
			var saveFileData = JSON.parse(json);
			var isNGplus = saveFileData.switches._data[DEX.ngPlus.gameCompleteSwitchId];
			
			return isNGplus;
		} else {
			return false;
		}
	};
})();
