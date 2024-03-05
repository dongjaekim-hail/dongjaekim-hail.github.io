import { Map, scorebar } from '../elements/Map.js';
//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";
import { MonotonicClock, offerDataForDownload } from '../../lib/util-2020.2.js';


// basic condition training session
export default class GameScene extends Phaser.Scene {

  constructor() {
    super('GameScene');
  }


  init() {
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
    this.basicNr = parseInt(this.registry.values.basicNr); // localStorage.getItem('groupNr')
    this.undoNr = parseInt(this.registry.values.undoNr); // localStorage.getItem('singleNr')

    if ((this.basicNr + this.undoNr) != this.registry.values.trialCounter) { // in case there is mismatch
      this.registry.values.trialCounter--;
    }

    this.trialCounter = this.registry.values.trialCounter;
    this.blockInd = Math.floor(this.trialCounter / this.registry.values.gameTrialNrBlk);
    this.cond = this.registry.values.cond[this.blockInd]; // JSON.parse(localStorage.getItem('oneAll'))[this.blockInd]	

    this.basicInd = this.registry.values.basicInd;//JSON.parse(localStorage.getItem('groupInd'));
    this.undoInd = this.registry.values.undoInd;//JSON.parse(localStorage.getItem('singleInd'));

    if (this.cond === 2) {
      this.trialInd = this.basicInd[this.basicNr];
      this.mapContent = this.registry.values.basicMap[this.trialInd];
    } else {
      this.trialInd = this.undoInd[this.undoNr];
      this.mapContent = this.registry.values.undoMap[this.trialInd];
    }

    this.undoObj = this.input.keyboard.addKey('z');  // Get key object
    this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
  }

  preload() {
  }

  create() {
    // add timer for whole game
    this.timedEvent = this.time.addEvent({ delay: this.registry.values.remainTime, callback: this.end, callbackScope: this });

    // add fullscreen button
    fullscreen(this);

    // time + mouse
    var time = new Date();
    var elapsed = time.getTime() - this.start;
    var mouse = [this.input.mousePointer.x.toString().substr(0, 6), this.input.mousePointer.y.toString().substr(0, 6)]
    // create map and data saving structure
    this.mapInfo = new Map(this.cond, this.mapContent, this.cameras.main.width, this.cameras.main.height, this.blockInd, this.trialCounter, this.trialInd, mouse, elapsed);     //mapContent, width, height, blockID, trialID, mapID, mouse, time    

    // draw cities
    drawCity(this, this.mapInfo, this.black, this.red);
    drawBudget(this, this.mapInfo, this.green, this.input.mousePointer)

    // save static data every 0.1s
    this.time.addEvent({
      delay: 100,                // ms
      callback: this.staticDataTimer,      // save static data
      callbackScope: this,
      loop: true
    });

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

            var allData = this.createExpData_();
            saveTrialData(allData);

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

          }
          // else {
          //   dataStatic(this.mapInfo, [pointer.x.toString().substr(0, 6),pointer.y.toString().substr(0, 6)], elapsed); // time
          // };
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
      var allData = this.createExpData_();
      saveTrialData(allData);

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
      } else {
        this.warningSubmit.setVisible(true);
      }
    }
  }

  staticDataTimer() {
    var time = new Date();
    var elapsed = time.getTime() - this.start;
    var mouse = [this.input.mousePointer.x.toString().substr(0, 6), this.input.mousePointer.y.toString().substr(0, 6)]
    dataStatic(this.mapInfo, mouse, elapsed)
    var allData = this.createExpData_();
    saveTrialData(allData);
  }

  next() {
    var time = new Date();
    var elapsed = time.getTime() - this.start;
    this.registry.values.remainTime = this.registry.values.remainTime - elapsed;
    var mouse = [this.input.mousePointer.x.toString().substr(0, 6), this.input.mousePointer.y.toString().substr(0, 6)]

    dataSubmit(this.mapInfo, mouse, elapsed);
    var allData = this.createExpData_();
    saveTrialData(allData);


    if (this.cond === 2) {
      this.registry.values.basicNr += 1;
    } else {
      this.registry.values.undoNr += 1;
    }
    this.registry.values.trialCounter++; // move on to next trial

    //Data saving
    console.log(this.registry.values.trialCounter)
    /* 
    // [DONGJAE - SAVE LOCALLY]
    var info_ = window.psychoJS.experiment.extraInfo;
    var __experimentName_ = (typeof info_.expName !== 'undefined') ? info_.expName : window.psychoJS.config.experiment.name;
    var __participant_ = ((typeof info_.participant === 'string' && info_.participant.length > 0) ? info_.participant : 'PARTICIPANT');
    var __session_ = ((typeof info_.session === 'string' && info_.session.length > 0) ? info_.session : 'SESSION');
    var __datetime_ = ((typeof info_.date !== 'undefined') ? info_.date : MonotonicClock.getDateStr());
    // var gitlabConfig_ = this._psychoJS.config.gitlab;
    var gitlabConfig_ = window.psychoJS.experiment._psychoJS.config.gitlab;
    var __projectId = (typeof gitlabConfig_ !== 'undefined' && typeof gitlabConfig_.projectId !== 'undefined') ? gitlabConfig_.projectId : undefined;

    var worksheet_ = XLSX.utils.json_to_sheet(window.psychoJS.experiment._trialsData);
    var csv_ = XLSX.utils.sheet_to_csv(worksheet_);
    var key_ = __participant_ + '_' + __experimentName_ + '_' + __datetime_ + '.csv';

    offerDataForDownload(key_, csv_, 'text/csv'); 
    */
    // next scene
    if (this.registry.values.ManiTrialInd.includes(this.trialCounter)) {
      this.scene.start("CheckScenePre");
      //this.scene.start("CheckScene");
    } else if (this.registry.values.trialCounter === this.registry.values.gameTrialNr) {
      // this.scene.start("EndScene");
      this.scene.start("saveScene");
    } else if ((this.registry.values.trialCounter) % this.registry.values.gameTrialNrBlk === 0) {
      this.scene.start("BreakScene");
    } else {
      this.scene.start("GameScene");
    }
  }

  end() {
    this.scene.start("EndScene", { type: 'time' });
  }

  createExpData() {
    var expData = {
      subID: this.registry.values.subID,
      blockID: this.mapInfo.blockID,
      trialID: this.mapInfo.trialID,
      mapID: this.mapInfo.mapID,
      condition: this.mapInfo.condition,
      checkTrial: 0,

      fullscreenOn: this.registry.values.fullscreenOn,
      time: this.mapInfo.time,
      mousePos: this.mapInfo.mousePos,
      click: this.mapInfo.click, // only record click which is on the city
      undo: this.mapInfo.undo,
      submit: this.mapInfo.submit,

      choiceDyn: this.mapInfo.choiceDyn,
      choiceHis: this.mapInfo.choiceHis,
      choiceLocDyn: this.mapInfo.choiceLocDyn,
      choiceLoc: this.mapInfo.choiceLoc,

      budgetDyn: this.mapInfo.budgetDyn,
      budgetHis: this.mapInfo.budgetHis,

      cityNr: this.mapInfo.cityNr,
      checkEnd: this.mapInfo.checkEnd
    };
    return expData;
  }


  createExpData_() {
    var expData = {
      subID: this.registry.values.subID,
      blockID: this.mapInfo.blockID,
      trialID: this.mapInfo.trialID,
      mapID: this.mapInfo.mapID,
      condition: this.mapInfo.condition,
      checkTrial: 0,

      fullscreenOn: this.registry.values.fullscreenOn,
      time: this.mapInfo.time[this.mapInfo.time.length - 1], // length
      mousePos: this.mapInfo.mousePos[this.mapInfo.mousePos.length - 1], // length
      click: this.mapInfo.click[this.mapInfo.click.length - 1], // length // only record click which is on the city
      undo: this.mapInfo.undo[this.mapInfo.undo.length - 1], // length
      submit: this.mapInfo.submit[this.mapInfo.submit.length - 1], // length

      choiceDyn: this.mapInfo.choiceDyn,
      choiceHis: this.mapInfo.choiceHis[this.mapInfo.choiceHis.length - 1], // length
      choiceLocDyn: this.mapInfo.choiceLocDyn,
      choiceLoc: this.mapInfo.choiceLoc[this.mapInfo.choiceLoc.length - 1], // length

      budgetDyn: this.mapInfo.budgetDyn,
      budgetHis: this.mapInfo.budgetHis[this.mapInfo.budgetHis.length - 1], // length

      cityNr: this.mapInfo.cityNr[this.mapInfo.cityNr.length - 1], // length
      checkEnd: this.mapInfo.checkEnd
    };
    return expData;
  }
}

