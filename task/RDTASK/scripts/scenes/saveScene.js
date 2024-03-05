import { Map, scorebar } from '../elements/Map.js';
import * as data from "../../lib/data-2020.2.js";
import { MonotonicClock, offerDataForDownload } from '../../lib/util-2020.2.js';

var subID;

export default class saveScene extends Phaser.Scene {

    constructor() {
        super("saveScene");
    }
    init(data) {
        window.psychoJS.experiment.save(window.psychoJS.experiment)

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

    create() {
        // add fullscreen button
        fullscreen(this);

        var nextSign = `Please wait... we are saving your data to server. It will save local copy as well.\nYou will be asked to send the locally saved one if your data is not saved properly on the server.`;
        this.add.text(this.screenCenterX, this.sys.game.config.height - 500, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '33px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
    }

    update() {
        if (!window.navigator.onLine) {
            window.confirm("You turned offline!\nPlease check your internet connection and resume by clicking the OK button.\nIMPORTANT: If you force to close the window while you are disconnected from the internet, your results will not be saved.")
        }
        else {
        }
        this.next();
    }
    next() {
        // this.scene.start("EndScene");
        this.scene.start("RandomPollScene");
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
