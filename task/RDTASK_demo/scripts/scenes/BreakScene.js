import { MonotonicClock, offerDataForDownload } from '../../lib/util-2020.2.js';
var subID;
export default class BreakScene extends Phaser.Scene {
    constructor() {
        super("BreakScene");

    }

    init(data) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);


        // Force to save [DONGJAE]
        subID = urlParams.get('prolific_pid');
        this.registry.set('subID', subID);

        // if (subID == undefined) {
        //     window.psychoJS.experiment.extraInfo.participant = "PARTICIPANT"
        //     window.psychoJS.experiment.extraInfo.date = MonotonicClock.getDateStr()
        // }
        // else {
        //     window.psychoJS.experiment.extraInfo.participant = "PARTICIPANT" + "_" + subID
        //     window.psychoJS.experiment.extraInfo.date = MonotonicClock.getDateStr("YYYY-MM-DD")
        // }

        // window.psychoJS.experiment.save(window.psychoJS.experiment)

        const worksheet = XLSX.utils.json_to_sheet(window.psychoJS.experiment._trialsData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        if (subID == undefined) {
            var key = "PARTICIPANT" + '_' + MonotonicClock.getDateStr() + '.csv';
        }
        else {
            var key = "PARTICIPANT" + '_' + subID + '_' + MonotonicClock.getDateStr("YYYY-MM-DD") + '.csv';
        }
        offerDataForDownload(key, csv, 'text/csv');
        var sync = false
        if (!(window.psychoJS.experiment._psychoJS.getEnvironment().toString() === 'Symbol(LOCAL)')) {
            window.psychoJS.experiment._psychoJS.serverManager.uploadData(key, csv, sync);
        }

        this.code = this.registry.values.code; // localStorage.getItem('code') || 

        this.textColor = '#1C2833';
        this.warnColor = '#943126';

        this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        this.nextBlockInd = (this.registry.values.trialCounter) / this.registry.values.gameTrialNrBlk;
        //this.nextOneAll        = this.registry.values.cond[this.nextBlockInd];      
    }

    preload() {
    }

    create() {
        // add fullscreen button
        fullscreen(this);

        //if (this.nextOneAll === 2) {
        //    var condition = 'Basic "Road construction with"';

        //} else {
        //    var condition = '"Road construction with Undo"';
        //}

        // add next sign
        this.timedEvent = this.time.addEvent({ delay: this.registry.values.shortBreak, callback: this.next, callbackScope: this });
        // var nextSign = `Congratulations! You have finished ${this.nextBlockInd}/4 of your journey!\nThe next bunch of trials are ${condition} trials.\nYou can have a 5 min break now. When you are ready, press SPACE to continue. \nThe task will automatically continue if you don't press SPACE after 5 min.`;
        var nextSign = `Congratulations! You have finished ${this.nextBlockInd}/2 of your journey!\nYou can have a 5 min break now. When you are ready, press RETURN to continue. \nThe task will automatically continue if you don't press RETURN after 5 min.`;

        this.add.text(this.screenCenterX, this.sys.game.config.height - 500, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '33px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
        this.timerText = this.add.text(this.screenCenterX, 50, [], { fontFamily: 'Comic Sans MS', fontSize: '37px', fill: '#1C2833' }).setOrigin(0.5);
    }


    update() {
        var time_data = 0.0

        if (this.nextObj.isDown) {
            this.next()
        }

        // add timer text 		
        // this.timerText.setText('Remaining seconds: ' + this.timedEvent.getOverallRemainingSeconds().toString().substr(0, 4) + 's ')
        // add timer text 		
        // this.timerText.setText('Remaining seconds: ' + this.timedEvent.getOverallRemainingSeconds().toString().substr(0, 4) + 's ')
        time_data = this.timedEvent.getOverallRemainingSeconds()
        // this.timerText.setText('Remaining seconds: ' + Math.floor(time_data / 60).toString() + 'min ' + Math.round(time_data % 60).toString() + 's ')
        this.timerText.setText('Remaining seconds: ' + Math.floor(time_data / 60).toString() + 'min ' + Math.round(time_data % 60).toString() + 's ')

    }

    next() {
        this.scene.start("InstructionScene", { flag: 1 });
    }

    // random int function
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}

