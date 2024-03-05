import { Map, scorebar } from '../elements/Map.js';

// basic condition training session
export default class TrainScene extends Phaser.Scene {

  constructor() {
    super('TrainScene');
  }

  
  init(data) {
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
    this.cond = data.cond;

    if (this.cond === 2) {
      this.mapContent = this.registry.values.basicTrainMap[this.trialInd];
    } else {
      this.mapContent = this.registry.values.undoTrainMap[this.trialInd];
    }

    this.undoObj = this.input.keyboard.addKey('z');  // Get key object
    this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
  }

  preload() {
  }

  create() {
    // add fullscreen button
    fullscreen(this);

    // time + mouse
    var time = new Date();
    var elapsed = time.getTime() - this.start;
    var mouse = [this.input.mousePointer.x.toString().substr(0, 6), this.input.mousePointer.y.toString().substr(0, 6)]
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
            dataChoice(this.mapInfo, [pointer.x.toString().substr(0, 6), pointer.y.toString().substr(0, 6)], elapsed); // time

            // check end again
            var notEnd = checkEnd(this.mapInfo);
            if (notEnd != 1) {
              this.warningText.setVisible(true);
            }
 
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

          } else {
          };
        } else {
          this.warningText.setVisible(true);
        };
      };
    }, this);

    // add text
    this.add.text(20, 120, "Press RETURN to submit.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
    this.warningText = this.add.text(20, 150, "You are out of budget!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
    this.warningText.setVisible(false);
    this.warningSubmit = this.add.text(20, 200, "You must connect at least 1 city to submit!", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.warnColorText });
    this.warningSubmit.setVisible(false);

    if (this.cond === 3) {
      // this.add.text(20, 80, "Press Z to UNDO", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      this.add.text(20, 50, "You are playing \"Road construction with undo.\" \nPress Z to UNDO", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
    } else {
      // this.add.text(20, 80, "You CANNOT undo in this trial.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
      this.add.text(20, 50, "You are playing \"Road construction without undo.\" \nYou CANNOT undo in this trial.", { fontFamily: 'Comic Sans MS', fontSize: '26px', color: this.colorText });
    }


  }

  update() {
    if (!window.navigator.onLine) {
      window.confirm("You turned offline!\nPlease check your internet connection and resume by clicking the OK button.\nIMPORTANT: If you force to close the window while you are disconnected from the internet, your results will not be saved.")
    }

    // check undo
    if (this.cond === 3 && Phaser.Input.Keyboard.JustDown(this.undoObj) && this.mapInfo.choiceDyn.length > 1) {
      var time = new Date();
      var elapsed = time.getTime() - this.start;
      var mouse = [this.input.mousePointer.x.toString().substr(0, 6), this.input.mousePointer.y.toString().substr(0, 6)]

      this.max = this.mapInfo.cityNr.reduce(function (a, b) {
        return Math.max(a, b);
      });

      // best result marker
      if (typeof this.scorebar.whiteTriangle !== 'undefined') {
        this.scorebar.whiteTriangle.clear();
        this.scorebar.whiteIndicator(this, this.white);
      } else {
        this.scorebar.whiteIndicator(this, this.white);
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

    if (Phaser.Input.Keyboard.JustDown(this.nextObj)) {
      if (this.mapInfo.choiceDyn.length > 1) {
        if (this.scale.isFullscreen) {
          this.next();
        }
        else {
          window.alert("You should play the game in full-screen mode!\nClick the button in the top-right corner.")
        }
        // this.next();
      }else {
        this.warningSubmit.setVisible(true);
      }
    }
  }

  next() {
    if (this.cond === 2) {
      if (this.trialInd < this.registry.values.trainTrialNrBlr-1) {
        this.trialInd = this.trialInd + 1
        this.scene.start("TrainScene", { trialInd: this.trialInd, cond: 2 });
      } else {
        this.scene.start("InstructionScene", { part: 2 });
      }
    } else {
      if (this.trialInd < this.registry.values.trainTrialNrBlr-1) {
        this.trialInd = this.trialInd + 1

        this.scene.start("TrainScene", { trialInd: this.trialInd, cond: 3 });
      } else {
        this.scene.start("InstructionScene", { part: 3 });
      }
    }
  }
}

