/*:
 * @plugindesc v1.0 A plugin that adds a little spice in your game's gameplay.
 * @author Procraftynation - procrastination done right!
 
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
 * Determining Results:
 * Result of the gauge action is determined by the cursor's width and position.
 * a. If the fill is within the cursor's width until the timer runs out, it means success.
 * b. If the fill is outside of the cursor's width until the timer runs out, it means failure.
 * c. If the cancel button is pressed, it means cancel... Of course.
 * The result is then saved to a Game Variable specified
 * Variable values: 1 - success, 2 - failure, 3 - canceled
 *
 * Event Call
 * a. Map Event - a map event ID can be specified to be called when the gauge action's lifetime is out
 * b. Common Event - a common event ID can be specified to be called when the gauge action's lifetime is out
 *
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
 * There are currently two(2) script calls you can use easily that are attached to the Game_System
 * 1. $gameSystem.newGaugeMapEvent(mapEventId, variableId, 
 *       fillImage,cursorImage,lifetimeImage,backgroundImage,foregroundImage,
 *       position,cursorPoint,fillOffsetX,fillOffsetY,lifetimeOffsetX,lifetimeOffsetY,
 *       fillSpeed, lifetime, resetFill);
 *    This script call creates a gauge and calls a map event when lifetime is out
 * 2. $gameSystem.newGaugeCommonEvent(commontEventId, variableId, 
 *       fillImage,cursorImage,lifetimeImage,backgroundImage,foregroundImage,
 *       position,cursorPoint,fillOffsetX,fillOffsetY,lifetimeOffsetX,lifetimeOffsetY,
 *       fillSpeed, lifetime, resetFill);
 *    This script call creates a gauge and calls a common event when lifetime is out
 *
 * Parameter descriptions:
 * 1. mapEventId/commontEventId - the event id to be called when the lifetime specified is out
 * 2. variableId - the variable ID to be used in storing gauge results: 
 *       success(1), failure(2), cancelled(3)
 * 3. fillImage - the image name of the Fill component found in img/pictures.
 * 4. cursorImage - the image name of the Cursor component found in img/pictures.
 * 5. lifetimeImage - the image name of the Lifetime component found in img/pictures.
 * 6. backgroundImage - the image name of the Background component found in img/pictures.
 * 7. foregroundImage - the image name of the Foreground component found in img/pictures.
 * 8. position - the position of the gauge on the screen based on the numpad position
 *       7     8     9
 *       4     5     6
 *       1     2     3
 * 9. cursorPoint - the position in percentage of the cursor along the Fill component's width.
 *       For example the Fill component's width is 200 and the specified cursor point is 50,
 *       the cursor image will be placed in the middle of the Fill component since the cursor point
 *       is specified as 50 percent.
 *       Values: 1 - 100
 * 10. fillOffsetX - the x position of the Fill component relative to the background image.
 * 11. fillOffsetY - the y position of the Fill component relative to the background image.
 * 12. lifetimeOffsetX - the x position of the Lifetime component relative to the background image.
 * 13. lifetimeOffsetY - the y position of the Lifetime component relative to the background image.
 * 14. fillSpeed - the speed the gauge is filled/emptied when OK button pressed and OK button released.
 *       NOTE: This is relative to the Fill image's width. Rate/second = Width/fillSpeed
 * 15. lifetime - the number of frames the gauge will run. 60 frames = 1 second.
 * 16. resetFill - true or false. When the gauge is filled to the max and OK button is still preseed,
 *       will it return to 0 or remain "full" untill OK button is released.
 * ============================================================================
 * SAMPLE USAGE
 * ============================================================================
 * $gameSystem.newGaugeMapEvent(15, 25,"DemoFill","DemoCursor","DemoTimer","DemoBackground","DemoForeground",8,50,81,27,81,77,5, 240);
 *
 * ============================================================================
 * ADVANCED USAGE
 * ============================================================================
 * If you want to change the speed to which the gauge is emptied 
 * OR change the fade out speed
 * OR how long will the gauge pause for how many frames when lifetime is out
 * OR not include a background/foreground
 * OR event remove the lifetime fill image
 * use the CHAINED PUBLIC METHODS to create the gauge
 * 
 * There are two(2) script calls that can be used along with the CHAINED PUBLIC METHODS
 * 1. $gameSystem.newBlankGaugeMapEvent(mapEventId, variableId);
 * 2. $gameSystem.newBlankGaugeCommonEvent(commonEventId, variableId);
 * ============================================================================
 * SAMPLE ADVANCED USAGE
 * ============================================================================
 * No background, no foreground, no lifetime indicator, 5 seconds lifetime,
 * cursor at 75 percent, with empty speed of 4, position at center of screen,
 * and fill at offsets 0,0. 
      $gameSystem.newBlankGaugeMapEvent(15,25)
         .fill("DemoFill",0,0).fillSpeed(5).emptySpeed(4)
         .cursor("DemoCursor",75)
         .lifetimeValue(300)
         .centerCenter()
         .start();
 * NOTE: always call the start() at the end!
 *
 *=============================================================================*/
 (function() {
   var Imported = Imported || {};
   Imported.DEX_GAS = true;
   var DEX = DEX || {};
   DEX.GAS = DEX.GAS || {};
   DEX.GAS.CONS = {
      HORIZONTAL:0,
      VERTICAL: 1,
      EMPTY_POSITION_START: 0,
      EMPTY_POSITION_END: 1,
      POS_LOWER_LEFT: 1,
      POS_LOWER_CENTER: 2,
      POS_LOWER_RIGHT: 3,
      POS_CENTER_LEFT: 4,
      POS_CENTER_CENTER: 5,
      POS_CENTER_RIGHT: 6,
      POS_UPPER_LEFT: 7,
      POS_UPPER_CENTER: 8,
      POS_UPPER_RIGHT: 9,
      RESULT_SUCCESS: 1,
      RESULT_FAILURE: 2,
      RESULT_CANCEL: 3
   };

   function GaugeComponent() { this.initialize.apply(this, arguments); };
   GaugeComponent.prototype = Object.create(Sprite.prototype);
   GaugeComponent.prototype.constructor = GaugeComponent;
   GaugeComponent.prototype.initialize = function(bitmap) {
      Sprite.prototype.initialize.call(this);
      this.bitmap = bitmap;
   };
   GaugeComponent.prototype.isComponentReady = function() {
      //checks if the bitmap is really loaded with height and width. called on update()
      if(this.bitmap.height !=0 && this.bitmap.width !=0)
         return true;
      return false;
   };
   /*
    * GaugeAction Class
    * 
    */
   function GaugeAction() { this.initialize.apply(this, arguments); };
   GaugeAction.prototype = Object.create(Sprite.prototype);
   GaugeAction.prototype.constructor = GaugeAction;
   GaugeAction.prototype.initialize = function() {
      Sprite.prototype.initialize.call(this);
      this.width = 0; // auto computed based on child images
      this.height = 0; // auto computed based on child images
      //To avoid collision with Sprite variables we use double underscores (__) as variable prefixes
      
      //IMAGES
      this.__fillImage = null;
      this.__cursorImage = null;
      this.__backgroundImage = null;
      this.__foregroundImage = null;
      this.__lifetimeImage = null;
      //POSITIONING
      this.__gaugePosition = DEX.GAS.CONS.POS_UPPER_CENTER;
      this.__gaugeOrientation = DEX.GAS.CONS.HORIZONTAL;
      this.__xOffset = 0;
      this.__yOffset = 0;
      this.__fillOffsetX = 0;
      this.__fillOffsetY = 0;
      this.__lifetimeOffsetX = 0;
      this.__lifetimeOffsetY = 0;
      this.__cursorPoint = 80;//percentage center position based on fill width. 1-100
      
      //FILL OPTIONS
      this.__fillSpeed = 1;//1px per frame! very slow!
      this.__fillValue = 0;//start from 0
      this.__emptySpeed = 0;//if 0 empty speed will use fillspeed
      this.__resetFill = true;//reset fillvalue to 0 when reaches max
      //FADE OUT OPTIONS
      this.__fadeOutSpeed = 10;
      this.__pauseBeforeFadeOut = 30;
      //AFTER ACTION OPTIONS
      //ON SUCCESS
      this.__mapEventId = 0;
      this.__commonEventId = 0;
      //ACTION VARIABLE
      this.__resultVariableId = 0;//values 1,2,3 which indicates success, failure & cancel respectively
      
      this.__lifetime = 300;//5 seconds, 60=1s
      this.__lifeConsumed = 0;
      
      //flags used inside plugin only
      this.__componentsDisplayed = false;
      this.__isCancelled = false;
      this.__isDead = false;
      this.__isFinished = false;
      
   };
   GaugeAction.prototype.update = function(){
      Sprite.prototype.update.call(this);
      //setup
      if(!this.__componentsDisplayed) {
         this.__setUpComponents();
         this.__start();
      }
      this.__handleCancel();//iscanceled
      if(this.__isDead || this.__isCancelled) {
         this.__finish();
         this.__updateFadeOut();
         return;//stop code to reach handleFilling
      }
      //do the gauge filling here
      this.__handleFilling();
      this.__handleLifetime();//isdead
   };
   //====================================
   // Called after setup through chained methods
   //====================================
   GaugeAction.prototype.start = function() {
      //load images and add them to 'this' main gauge sprite
      this._gaugeFill = new GaugeComponent(ImageManager.loadPicture(this.__fillImage));
      //this._gaugeCursor = new Sprite(ImageManager.loadPicture(cursorImage));
      this._gaugeCursor = new GaugeComponent(ImageManager.loadPicture(this.__cursorImage));
      if(this.__backgroundImage !== null) {
         this._gaugeBackground = new Sprite(ImageManager.loadPicture(this.__backgroundImage));
         this.addChild(this._gaugeBackground);//rendered first if present
      }
      if(this.__lifetimeImage !== null) {
         this._lifetimeFill = new Sprite(ImageManager.loadPicture(this.__lifetimeImage));
         this.addChild(this._lifetimeFill);//rendered 2nd if present
      }
      this.addChild(this._gaugeFill);//rendered 3nd
      this.addChild(this._gaugeCursor);//rendered 4th
      if(this.__foregroundImage !== null) {
         this._gaugeForeground = new Sprite(ImageManager.loadPicture(this.__foregroundImage));
         this.addChild(this._gaugeForeground);//rendered last if present
      }
      SceneManager._scene.addChild(this);
   };
   //=====================================
   // CHAINED PUBLIC METHODS for setting up gauge
   //=====================================
   GaugeAction.prototype.fill = function(imageName,xOffset,yOffset) {
      this.fillImage(imageName);
      this.fillOffset(xOffset,yOffset);
      return this;
   };
   GaugeAction.prototype.cursor = function(imageName,cursorPoint) {
      this.cursorImage(imageName);
      this.cursorPoint(cursorPoint);
      return this;
   }
   GaugeAction.prototype.lifetime = function(imageName,lifetimeValue) {
      this.lifetimeImage(imageName);
      this.lifetimeValue(lifetimeValue);
      return this;
   }
   GaugeAction.prototype.fillImage = function(imageName) {
      this.__fillImage = imageName;
      return this;
   };
   GaugeAction.prototype.cursorImage = function(imageName) {
      this.__cursorImage = imageName;
      return this;
   };
   GaugeAction.prototype.lifetimeImage = function(imageName) {
      this.__lifetimeImage = imageName;
      return this;
   };
   GaugeAction.prototype.background = function(imageName) {
      this.__backgroundImage = imageName;
      return this;
   };
   GaugeAction.prototype.foreground = function(imageName) {
      this.__foregroundImage = imageName;
      return this;
   };
   //ORIENTATION
   GaugeAction.prototype.horizontal = function() {this.__gaugeOrientation = DEX.GAS.HORIZONTAL; return this;};
   GaugeAction.prototype.vertical = function() {this.__gaugeOrientation = DEX.GAS.VERTICAL; return this;};
   //POSITIONING
   GaugeAction.prototype.gaugePosition = function(position) {this.__gaugePosition = position;return this;};
   GaugeAction.prototype.upperLeft = function() {this.__gaugePosition = DEX.GAS.CONS.POS_UPPER_LEFT;return this;};
   GaugeAction.prototype.upperCenter = function() {this.__gaugePosition = DEX.GAS.CONS.POS_UPPER_CENTER;return this;};
   GaugeAction.prototype.upperRight = function() {this.__gaugePosition = DEX.GAS.CONS.POS_UPPER_RIGHT;return this;};
   GaugeAction.prototype.centerLeft = function() {this.__gaugePosition = DEX.GAS.CONS.POS_CENTER_LEFT;return this;};
   GaugeAction.prototype.centerCenter = function() {this.__gaugePosition = DEX.GAS.CONS.POS_CENTER_CENTER;return this;};
   GaugeAction.prototype.centerRight = function() {this.__gaugePosition = DEX.GAS.CONS.POS_CENTER_RIGHT;return this;};
   GaugeAction.prototype.lowerLeft = function() {this.__gaugePosition = DEX.GAS.CONS.POS_LOWER_LEFT;return this;};
   GaugeAction.prototype.lowerCenter = function() {this.__gaugePosition = DEX.GAS.CONS.POS_LOWER_CENTER;return this;};
   GaugeAction.prototype.lowerRight = function() {this.__gaugePosition = DEX.GAS.CONS.POS_LOWER_RIGHT;return this;};
   GaugeAction.prototype.offset = function(x,y) {
      this._xOffset = x;
      this._yOffset = y;
      return this;
   };
   GaugeAction.prototype.fillOffset = function(x,y) {
      this.__fillOffsetX = x;
      this.__fillOffsetY = y;
      return this;
   };
   GaugeAction.prototype.lifetimeOffset = function(x,y) {
      this.__lifetimeOffsetX = x;
      this.__lifetimeOffsetY = y;
      return this;
   };
   //FILL OPTiONS
   GaugeAction.prototype.fillSpeed = function(fillSpeed) {
      this.__fillSpeed = fillSpeed;
      return this;
   };
   GaugeAction.prototype.emptySpeed = function(emptySpeed) {
      this.__emptySpeed = emptySpeed;
      return this;
   }
   GaugeAction.prototype.resetFill = function() {
      this.__resetFill = true;
      return this;
   };
   GaugeAction.prototype.cursorPoint = function(cursorPoint) {
      this.__cursorPoint = cursorPoint;
      return this;
   };
   GaugeAction.prototype.fadeOutSpeed = function(fadeOutSpeed) {
      this.__fadeOutSpeed = fadeOutSpeed;
      return this;
   };
   GaugeAction.prototype.pauseBeforeFadeOut = function(pauseFrames) {
      this.__pauseBeforeFadeOut = pauseFrames;
      return this;
   };
   GaugeAction.prototype.mapEventId = function(mapEventId) {
      this.__mapEventId = mapEventId;
      return this;
   };
   GaugeAction.prototype.commonEventId = function(commonEventId) {
      this.__commonEventId = commonEventId;
      return this;
   };
   GaugeAction.prototype.resultVariableId = function(variableId) {
      this.__resultVariableId = variableId;
      return this;
   };
   GaugeAction.prototype.lifetimeValue = function(lifetime) {
      this.__lifetime = lifetime;
      return this;
   };
   //==================
   // Private methods
   //==================
   GaugeAction.prototype.__start = function() {
      //stop player movement
      $gameTemp._gaugeActionStart();
      //disable menu too
      $gameSystem.disableMenu();
   };
   GaugeAction.prototype.__finish = function() {
      if(this.__isFinished) return;
      //call only once common event or map event
      if(this.__commonEventId !== 0) {
         $gameTemp.reserveCommonEvent(this.__commonEventId);
      } else if(this.__mapEventId !== 0) {
         $gameMap.event(this.__mapEventId).start();
      }
      $gameTemp._gaugeActionStop();
      $gameSystem.enableMenu();      
      this.__isFinished = true;
   }
   GaugeAction.prototype.__updateFadeOut = function() {
      this.__pauseBeforeFadeOut--;
      if(this.__pauseBeforeFadeOut <=0) {
         this.opacity -= this.__fadeOutSpeed;
         if(this.opacity <= 0) {
            //only remove from scene if not visible anymore
            SceneManager._scene.removeChild(this);
         }
      }
   };
   GaugeAction.prototype.__handleFilling = function() {
      if((Input.isPressed("ok") || TouchInput.isPressed())) {
         //increment
         //fill horizontal, TODO: vertical
         this.__fillValue += this.__fillSpeed;
         this._gaugeFill.setFrame(0, 0, this.__fillValue, this._gaugeFill.bitmap.height);
         if(this.__fillValue > this._gaugeFill.bitmap.width && !this.__resetFill)  
            this.__fillValue = this._gaugeFill.bitmap.width;
         else if(this.__fillValue > this._gaugeFill.bitmap.width && this.__resetFill)  
            this.__fillValue = 0;
      } else {
         //decrement
         if(this.__emptySpeed == 0) this.__fillValue -= this.__fillSpeed;
         else  this.__fillValue -= this.__emptySpeed;
         this._gaugeFill.setFrame(0, 0, this.__fillValue, this._gaugeFill.bitmap.height);
         //
         if(this.__fillValue < 0) this.__fillValue = 0;
      }
   };
   GaugeAction.prototype.__handleLifetime = function() {
      this.__lifeConsumed ++;
      if(this.__lifetimeImage !== null) {
         var lifeTimeFillValue = this.__lifeConsumed*(this._lifetimeFill.bitmap.width/this.__lifetime);
         this._lifetimeFill.setFrame(0, 0, lifeTimeFillValue, this._lifetimeFill.bitmap.height);
      }
      if(this.__lifeConsumed == this.__lifetime) {
         //check if success or failure
         var minSuccessPoint = this._gaugeCursor.x;
         var maxSuccessPoint = this._gaugeCursor.x + this._gaugeCursor.bitmap.width;
         var resultPoint = this._gaugeFill.width + this.__fillOffsetX;
         //check if between range points
         if(resultPoint >= minSuccessPoint && resultPoint <= maxSuccessPoint) {
            if(this.__resultVariableId !== 0)
               $gameVariables.setValue(this.__resultVariableId, DEX.GAS.CONS.RESULT_SUCCESS);
         } else {
            if(this.__resultVariableId !== 0)
               $gameVariables.setValue(this.__resultVariableId, DEX.GAS.CONS.RESULT_FAILURE);
         }
         //end!
         this.__isDead = true;
      }
   };
   
   GaugeAction.prototype.__handleCancel = function() {
      if(Input.isTriggered('cancel') || TouchInput.isCancelled()) {
         if(this.__resultVariableId !== 0)
            $gameVariables.setValue(this.__resultVariableId, DEX.GAS.CONS.RESULT_CANCEL);
         this.__isCancelled = true;
      }
   };
   
   GaugeAction.prototype.__setUpComponents = function() {
      if(this._gaugeFill.isComponentReady() && this._gaugeCursor.isComponentReady()
         && !this.__componentsDisplayed) {
         this.__computeDimensions();
         this.__moveGaugeToPosition();
         this.__positionComponents();
         //enable flag
         this.__componentsDisplayed = true;
         
      }
   };
   GaugeAction.prototype.__positionComponents = function() {
      //TODO: function for this
      this._gaugeFill.x += this.__fillOffsetX;
      this._gaugeFill.y += this.__fillOffsetY;
      
      //center cursor to fill component
      this._gaugeCursor.y += this.__fillOffsetY;
      this._gaugeCursor.y += (this._gaugeFill.bitmap.height - this._gaugeCursor.bitmap.height)/2;
      
      //move cursor to correct position in percentage based on _gaugeFill width/height
      //move within x axis
      this._gaugeCursor.x = this._gaugeFill.bitmap.width * this.__cursorPoint - this._gaugeCursor.bitmap.width / 2;
      //check if out of border, should be within gaugeFill's width only
      if(this._gaugeCursor.x + this._gaugeCursor.bitmap.width > this._gaugeFill.bitmap.width) {
         this._gaugeCursor.x = this._gaugeFill.bitmap.width - this._gaugeCursor.bitmap.width;
      } else if(this._gaugeCursor.x - this._gaugeCursor.bitmap.width < 0) {
         this._gaugeCursor.x = 0;//this is relative to parent
      }
      
      //move lifetime fill
      if(this.__lifetimeImage !== null) {
         this._lifetimeFill.x += this.__lifetimeOffsetX;
         this._lifetimeFill.y += this.__lifetimeOffsetY;
      }
   };
   GaugeAction.prototype.__moveGaugeToPosition = function() {
      var x;
      var y;
      var baseWidth = Graphics.width;
      var baseHeight = Graphics.height;
         
      switch(this.__gaugePosition) {
         case DEX.GAS.CONS.POS_LOWER_LEFT:
               x = this.__xOffset; 
               y = this.__yOffset + baseHeight - this.height; 
               break;
         case DEX.GAS.CONS.POS_LOWER_CENTER:
               x = this.__xOffset + baseWidth/2 - this.width/2; 
               y = this.__yOffset + baseHeight - this.height; 
               break; 
         case DEX.GAS.CONS.POS_LOWER_RIGHT:
               x = this.__xOffset + baseWidth - this.width;
               y = this.__yOffset + baseHeight - this.height;
               break;
         case DEX.GAS.CONS.POS_CENTER_LEFT:
               x = this.__xOffset; 
               y = this.__yOffset + baseHeight/2 - this.height/2; 
               break;
         case DEX.GAS.CONS.POS_CENTER_CENTER:
               x = this.__xOffset + baseWidth/2 - this.width/2; 
               y = this.__yOffset + baseHeight/2 - this.height/2;
               break;
         case DEX.GAS.CONS.POS_CENTER_RIGHT:
               x = this.__xOffset + baseWidth - this.width;
               y = this.__yOffset + baseHeight/2 - this.height/2; 
               break;
         case DEX.GAS.CONS.POS_UPPER_LEFT:
               x = this.__xOffset; 
               y = this.__yOffset;
               break;
         case DEX.GAS.CONS.POS_UPPER_CENTER:
               x = this.__xOffset + baseWidth/2 - this.width/2;
               y = this.__yOffset;
               break;
         case DEX.GAS.CONS.POS_UPPER_RIGHT:
               x = this.__xOffset + baseWidth - this.width;
               y = this.__yOffset;
               break;
      }
      this.x = x;
      this.y = y;
   };
   GaugeAction.prototype.__computeDimensions = function(){
      //dimension are based on the highest of fill, cursor or background
      if(this.__backgroundImage !== null) {
         this.height = this._gaugeBackground.bitmap.height;
         this.width = this._gaugeBackground.bitmap.width;
      } else {
         this.height = Math.max(this._gaugeFill.bitmap.height,this._gaugeCursor.bitmap.height);
         this.width = Math.max(this._gaugeFill.bitmap.width,this._gaugeCursor.bitmap.width);
      }
      
   };
   
   //=============================
   // GAUGE BUILDER FUNCTIONS
   //=============================
   function DEX_GAS_newBlankGaugeMapEvent(mapEventId, variableId) {
      var gauge = new GaugeAction();
      gauge.resultVariableId(variableId).mapEventId(mapEventId);
      return gauge;
   }
   function DEX_GAS_newBlankGaugeCommonEvent(commonEventId, variableId) {
      var gauge = new GaugeAction();
      gauge.resultVariableId(variableId).commonEventId(commonEventId);
      return gauge;
   }
   function DEX_GAS_newNormalGaugeMapEvent(
      //required on finish
      mapEventId, variableId, 
      //images
      fillImage,cursorImage,lifetimeImage,backgroundImage,foregroundImage,
      //positioning
      position,cursorPoint,fillOffsetX,fillOffsetY,lifetimeOffsetX,lifetimeOffsetY,
      //speed 
      fillSpeed, lifetime, resetFill
      ) {
      var gauge = new GaugeAction();
      if(resetFill == true) {
         gauge.resetFill();
      }
      gauge.resultVariableId(variableId)
         .mapEventId(mapEventId)
         .fillImage(fillImage)
         .cursorImage(cursorImage)
         .lifetimeImage(lifetimeImage)
         .background(backgroundImage)
         .foreground(foregroundImage)
         .gaugePosition(position)
         .cursorPoint(cursorPoint)
         .fillOffset(fillOffsetX,fillOffsetY)
         .lifetimeOffset(lifetimeOffsetX,lifetimeOffsetY)
         .fillSpeed(fillSpeed)
         .lifetimeValue(lifetime)
         .start();
   }
   function DEX_GAS_newNormalGaugeCommonEvent(
      //required on finish
      commonEventId, variableId, 
      //images
      fillImage,cursorImage,lifetimeImage,backgroundImage,foregroundImage,
      //positioning
      position,cursorPoint,fillOffsetX,fillOffsetY,lifetimeOffsetX,lifetimeOffsetY,
      //speed 
      fillSpeed, lifetime, resetFill
      ) {
      var gauge = new GaugeAction();
      if(resetFill == true) {
         gauge.resetFill();
      }
      gauge.resultVariableId(variableId)
         .commonEventId(commonEventId)
         .fillImage(fillImage)
         .cursorImage(cursorImage)
         .lifetimeImage(lifetimeImage)
         .background(backgroundImage)
         .foreground(foregroundImage)
         .gaugePosition(position)
         .cursorPoint(cursorPoint)
         .fillOffset(fillOffsetX,fillOffsetY)
         .lifetimeOffset(lifetimeOffsetX,lifetimeOffsetY)
         .fillSpeed(fillSpeed)
         .lifetimeValue(lifetime)
         .start();
   }
   
   //==================================
   // Attach builder functions Game_System
   //==================================
   Game_System.prototype.newBlankGaugeMapEvent = DEX_GAS_newBlankGaugeMapEvent;
   Game_System.prototype.newGaugeMapEvent = DEX_GAS_newNormalGaugeMapEvent;
   Game_System.prototype.newBlankGaugeCommonEvent = DEX_GAS_newBlankGaugeCommonEvent;
   Game_System.prototype.newGaugeCommonEvent = DEX_GAS_newNormalGaugeCommonEvent;
   //============================================================
   // Game_Temp:
   //============================================================
   Game_Temp.prototype._gaugeActionStart  = function() {
      this._gaugeActionRunning = true;
      
   };
   Game_Temp.prototype._gaugeActionStop = function() {
      this._gaugeActionRunning = false;
   };
   Game_Temp.prototype._isGaugeActionRunning = function() {
      return this._gaugeActionRunning;
   };
   //============================================================
   // Game_Player
   //============================================================
   DEX.GAS.Game_Player_canMove = Game_Player.prototype.canMove;
   Game_Player.prototype.canMove = function() {
      //disable movement if enabled
      if($gameTemp._isGaugeActionRunning() === true) return false;
      //else call original method
      return DEX.GAS.Game_Player_canMove.call(this);
   };
 })();
