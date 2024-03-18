import { Map, scorebar } from '../elements/Map.js';

// basic condition training session
export default class ExplicitTrial extends Phaser.Scene {

  constructor() {
    super('ExplicitTrial');
  }

  init(data) {
    // [DONGJAE] sometimes scene.max is not flushed so force to flush it.
    // if (typeof this.max !== 'undefined') {
    //   delete this.max
    // }

    this.cond = data.cond;
    if (this.cond == 4) {
      // time 
      this.start = getTime();

      // set colors
      this.black = 0x000000;
      this.green = 0x25A35A;
      this.red = 0xB93D30;
      this.white = 0xFDFEFE;
      this.colorText = '#1C2833'; // black
      this.warnColorText = '#943126'; // red

      // trial parameters
      this.trialInd = data.trialInd;
      // this.cond = data.cond;
      this.mapInfo = data.mapInfo;
      this.mapContent = this.registry.values.undoTrainMap[this.trialInd];
      this.undoObj = this.input.keyboard.addKey('z');  // Get key object
      this.nextObj = this.input.keyboard.addKey('enter');  // Get key object}

      // draw cities
      drawCity(this, this.mapInfo, this.black, this.red);
      drawBudget(this, this.mapInfo, this.green, this.input.mousePointer)

      // draw scorebar
      this.scorebar = new scorebar(this, this.mapInfo, this.black)

      // // draw move
      // this.input.on('pointermove', function (pointer) {
      //   drawBudget(this, this.mapInfo, this.green, pointer)
      //   budgetUpdate(this.mapInfo);
      //   dataChoice(this.mapInfo, [pointer.x, pointer.y], elapsed); // time


      // }, this);

      // // redraw road
      // if (typeof this.road !== 'undefined') {
      //   this.roadGraphics.clear()
      // }
      // drawRoad(this, this.mapInfo, this.black)


    }
    else {
      // time 
      this.start = getTime();

      // set colors
      this.black = 0x000000;
      this.green = 0x25A35A;
      this.red = 0xB93D30;
      this.white = 0xFDFEFE;
      this.colorText = '#1C2833'; // black
      this.warnColorText = '#943126'; // red

      // trial parameters
      this.trialInd = data.trialInd;

      if (this.cond === 2) {
        this.mapContent = this.registry.values.basicTrainMap[this.trialInd];
      } else {
        this.mapContent = this.registry.values.undoTrainMap[this.trialInd];
      }

      this.undoObj = this.input.keyboard.addKey('z');  // Get key object
      this.nextObj = this.input.keyboard.addKey('enter');  // Get key object}
    }
  }

  preload() {
  }

  create() {
    if (this.cond == 4) {
      // add fullscreen button
      fullscreen(this);

      // time + mouse
      var time = new Date();
      var elapsed = time.getTime() - this.start;
      var mouse = [this.input.mousePointer.x, this.input.mousePointer.y]
      // create map and data saving structure
      // this.mapInfo = new Map(this.cond, this.mapContent, this.cameras.main.width, this.cameras.main.height, -1, this.trialInd, this.trialInd, mouse, elapsed);     //mapContent, width, height, blockID, trialID, mapID, mouse, time    

      // draw cities
      // drawCity(this, this.mapInfo, this.black, this.red);
      // this.budgetGraphics.clear()
      // drawBudget(this, this.mapInfo, this.green, this.input.mousePointer)
      drawRoad(this, this.mapInfo, this.black)

      // draw scorebar
      this.scorebar.triangle.clear();
      // this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      // if (typeof this.max !== 'undefined') {
      //   this.scorebar.whiteTriangle.clear();
      // }
      // best result marker
      // if (typeof this.max !== 'undefined') {
      //   // this.scorebar.whiteTriangle.clear();
      //   try { this.scorebar.whiteTriangle.clear(); }
      //   catch { console.log('something went wrong') }
      //   this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      // } else {
      //   this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      // }
      this.scorebar = new scorebar(this, this.mapInfo, this.black)
      // 여기에 newmax가 문제가 생길때 항상 newmax를 3으로 고정하는 등.

      // draw budget and move
      this.input.on('pointermove', function (pointer) {

        if (typeof this.line !== 'undefined') {
          this.budgetGraphics.clear()
        }

        drawBudget(this, this.mapInfo, this.green, pointer)

      }, this);

      // make choice
      this.input.on('pointerdown', function (pointer) {

        var time = new Date();
        var elapsed = time.getTime() - this.start;

        if (pointer.leftButtonDown()) {
          var notEnd = checkEnd(this.mapInfo);

          if (notEnd) { // if the trial not end
            makeChoice(this.mapInfo, pointer.x, pointer.y);

            if (this.mapInfo.check == 1) { // if this is valid choice
              budgetUpdate(this.mapInfo);
              dataChoice(this.mapInfo, [pointer.x, pointer.y], elapsed); // time

              // clear best marker if neccessary
              this.newMax = this.mapInfo.cityNr.reduce(function (a, b) {
                return Math.max(a, b);
              });
              if (typeof this.scorebar.whiteTriangle !== 'undefined' && this.newMax > this.max) {
                this.scorebar.whiteTriangle.clear();
              }

              // redraw road
              if (typeof this.road !== 'undefined') {
                this.roadGraphics.clear()
              }
              drawRoad(this, this.mapInfo, this.black)

              this.scorebar.triangle.clear();
              this.scorebar.indicator(this, this.mapInfo, this.black);

              // check end again
              var notEnd = checkEnd(this.mapInfo);
              if (notEnd != 1) {
                this.warningText.setVisible(true);
              }

            } else {
            };
          } else {
            this.warningText.setVisible(true);
          };
        };
      }, this);
    }
    else {

      // add fullscreen button
      fullscreen(this);

      // time + mouse
      var time = new Date();
      var elapsed = time.getTime() - this.start;
      var mouse = [this.input.mousePointer.x, this.input.mousePointer.y]
      // create map and data saving structure
      this.mapInfo = new Map(this.cond, this.mapContent, this.cameras.main.width, this.cameras.main.height, -1, this.trialInd, this.trialInd, mouse, elapsed);     //mapContent, width, height, blockID, trialID, mapID, mouse, time    

      // draw cities
      drawCity(this, this.mapInfo, this.black, this.red);
      drawBudget(this, this.mapInfo, this.green, this.input.mousePointer)

      // draw scorebar
      this.scorebar = new scorebar(this, this.mapInfo, this.black)

      // draw budget and move
      this.input.on('pointermove', function (pointer) {

        if (typeof this.line !== 'undefined') {
          this.budgetGraphics.clear()
        }

        drawBudget(this, this.mapInfo, this.green, pointer)

      }, this);

      // make choice
      this.input.on('pointerdown', function (pointer) {

        var time = new Date();
        var elapsed = time.getTime() - this.start;

        if (pointer.leftButtonDown()) {
          var notEnd = checkEnd(this.mapInfo);

          if (notEnd) { // if the trial not end
            makeChoice(this.mapInfo, pointer.x, pointer.y);

            if (this.mapInfo.check == 1) { // if this is valid choice
              budgetUpdate(this.mapInfo);
              dataChoice(this.mapInfo, [pointer.x, pointer.y], elapsed); // time

              // clear best marker if neccessary
              this.newMax = this.mapInfo.cityNr.reduce(function (a, b) {
                return Math.max(a, b);
              });
              if (typeof this.scorebar.whiteTriangle !== 'undefined' && this.newMax > this.max) {
                this.scorebar.whiteTriangle.clear();
              }

              // redraw road
              if (typeof this.road !== 'undefined') {
                this.roadGraphics.clear()
              }
              drawRoad(this, this.mapInfo, this.black)

              this.scorebar.triangle.clear();
              this.scorebar.indicator(this, this.mapInfo, this.black);

              // check end again
              var notEnd = checkEnd(this.mapInfo);
              if (notEnd != 1) {
                this.warningText.setVisible(true);
              }

            } else {
            };
          } else {
            this.warningText.setVisible(true);
          };
        };
      }, this);
    }

    // this.add.text(20, 120, "Press RETURN to submit.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
    // this.warningText = this.add.text(20, 150, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
    // this.warningText.setVisible(false);


    //if (this.cond === 3) {
    //    this.add.text(20, 80, "Press Z to UNDO", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
    //}
    if (this.cond === 3) {
      // this.add.text(20, 80, "Press Z to UNDO", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });

      // add text
      this.add.text(20, 50, "(Step 1 of 2) Please connect exactly 3 cities (not including the starting city) and submit your result.\nYou can use Z to UNDO.\nPress RETURN to submit", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      // this.warningText = this.add.text(20, 110, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText = this.add.text(20, 150, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText.setVisible(false);
    }
    else if (this.cond == 4) {
      // this.add.text(20, 80, "Press Z to UNDO", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });

      // add text
      this.add.text(20, 50, "(Step 2 of 2) Please undo three times and submit your result (you will connect 0 city).\nYou can use Z to UNDO.\nPress RETURN to submit", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      // this.warningText = this.add.text(20, 110, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText = this.add.text(20, 150, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText.setVisible(false);
    }
    else {
      // this.add.text(20, 80, "You CANNOT undo in this trial.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      //   this.add.text(20, 50, "You are playing \"Road construction without undo.\" \nYou CANNOT undo in this trial.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });

      // add text
      this.add.text(20, 50, "Please connect exactly 3 cities (not including the starting city).\nYou CANNOT undo in this trial.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      // this.warningText = this.add.text(20, 110, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText = this.add.text(20, 120, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
      this.warningText.setVisible(false);


    }


  }

  update() {

    if (this.cond === 4) {

      // best result marker
      if (typeof this.max !== 'undefined') {
        try { this.scorebar.whiteTriangle.clear(); }
        catch { console.log('something went wrong') }

        this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      } else {
        this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      }
      this.scorebar.triangle.clear();
      this.scorebar.indicator(this, this.mapInfo, this.black);

    }


    // check undo
    if (((this.cond === 3) || (this.cond === 4)) && Phaser.Input.Keyboard.JustDown(this.undoObj) && this.mapInfo.choiceDyn.length > 1) {
      var time = new Date();
      var elapsed = time.getTime() - this.start;
      var mouse = [this.input.mousePointer.x, this.input.mousePointer.y]

      // best result marker
      if (typeof this.max !== 'undefined') {
        try { this.scorebar.whiteTriangle.clear(); }
        catch { console.log('something went wrong') }

        this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      } else {
        this.scorebar.whiteIndicator(this, this.mapInfo, this.white);
      }

      dataUndo(this.mapInfo, mouse, elapsed); // time

      // draw current indicator
      this.scorebar.triangle.clear();
      this.scorebar.indicator(this, this.mapInfo, this.black);

      // redraw budget line
      this.mapInfo.budgetRemain = this.mapInfo.budgetDyn[this.mapInfo.budgetDyn.length - 1];
      this.budgetGraphics.clear()
      drawBudget(this, this.mapInfo, this.green, this.input.mousePointer)

      // redraw road
      this.roadGraphics.clear()
      drawRoad(this, this.mapInfo, this.black)

      // clear warning text
      if (typeof this.warningText !== 'undefined') {
        this.warningText.setVisible(false);
      }
    }

    if (this.nextObj.isDown) {
      this.next();
    }

  }

  next() {
    if (this.cond === 2) {
      // next scene
      if (this.mapInfo.cityNr[this.mapInfo.cityNr.length - 1] === 3) {
        // when they performed as instructed 
        // this.scene.start("ExplicitTrial", { trialInd: 0, cond: 3 });
        this.scene.start("InstructionScene", { part: 6 });
      } else {
        // when they performed wrongly
        window.alert("You didn't follow the instruction! Please follow the instruction in the top-left corner of the screen.")
        this.scene.start("ExplicitTrial", { trialInd: 0, cond: 2 });
      }

    }
    else if (this.cond == 3) {
      // next scene
      if (this.mapInfo.cityNr[this.mapInfo.cityNr.length - 1] === 3) {
        // cut to top three of them
        while (this.mapInfo.choiceLocDyn.length - 1 > 3) {
          this.mapInfo.choiceLocDyn.pop()
        }
        // when they performed as instructed 
        this.scene.start("ExplicitTrial", { trialInd: 0, cond: 4, mapInfo: this.mapInfo });
      } else {
        // when they performed wrongly
        window.alert("You didn't follow the instruction! Please follow the instruction in the top-left corner of the screen.")
        this.scene.start("ExplicitTrial", { trialInd: 0, cond: 3 });
      }
    }

    else if (this.cond == 4) {
      if (this.mapInfo.cityNr[this.mapInfo.cityNr.length - 1] === 0) {
        // when they performed as instructed 
        this.scene.start("InstructionScene", { part: 1 });
      } else {
        window.alert("You didn't follow the instruction! Please follow the instruction in the top-left corner of the screen.")
        this.scene.start("ExplicitTrial", { trialInd: 0, cond: 4, mapInfo: this.mapInfo });
      }

    }


  }
}

