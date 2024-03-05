import { Map, scorebar } from '../elements/Map.js';
import * as data from "../../lib/data-2020.2.js";
import { MonotonicClock, offerDataForDownload } from '../../lib/util-2020.2.js';

var subID;

export default class RandomPollScene extends Phaser.Scene {

    constructor() {
        super("RandomPollScene");
    }
    init(data) {
        window.psychoJS.experiment.save(window.psychoJS.experiment)

        var condition2 = []; var condition3 = [];
        for (var step = 0; step < window.psychoJS.experiment._trialsData.length; step++) {
            if (window.psychoJS.experiment._trialsData[step]["submit"] == 1) {
                if (window.psychoJS.experiment._trialsData[step]["condition"] == 2) {
                    condition2.push(window.psychoJS.experiment._trialsData[step]["cityNr"])
                }
                else if (window.psychoJS.experiment._trialsData[step]["condition"] == 3) {
                    condition3.push(window.psychoJS.experiment._trialsData[step]["cityNr"])
                }

            }
        }

        // Rewards from condition2
        this.cond2_reward = Math.pow(condition2[this.getRandomInt(0, condition2.length - 1)], 2) * 2 + Math.pow(condition2[this.getRandomInt(0, condition2.length - 1)], 2) * 2

        // Rewards from condition3
        this.cond3_reward = Math.pow(condition3[this.getRandomInt(0, condition3.length - 1)], 2) * 2 + Math.pow(condition3[this.getRandomInt(0, condition3.length - 1)], 2) * 2

        this.reward = this.cond2_reward + this.cond3_reward

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
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

        // const worksheet = XLSX.utils.json_to_sheet(window.psychoJS.experiment._trialsData);
        // const csv = XLSX.utils.sheet_to_csv(worksheet);
        // const key = window.psychoJS.experiment.extraInfo.participant + '_' + window.psychoJS.config.experiment.name + '_' + window.psychoJS.experiment.extraInfo.date + '.csv';
        // offerDataForDownload(key, csv, 'text/csv');


        // if (subID == undefined) { window.psychoJS.experiment.extraInfo.participant = "FIN" + "_PARTICIPANT" }
        // else { window.psychoJS.experiment.extraInfo.participant = "FIN" + "_" + subID }

        // window.psychoJS.experiment.extraInfo.date = MonotonicClock.getDateStr() + "_REWARD" + (this.reward).toString()
        // window.psychoJS.experiment.save(window.psychoJS.experiment)

        const worksheet = XLSX.utils.json_to_sheet(window.psychoJS.experiment._trialsData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        if (subID == undefined) {
            var key = "FIN" + "_" + "PARTICIPANT" + '_' + MonotonicClock.getDateStr() + "_REWARD" + (this.reward).toString() + '.csv';
        }
        else {
            var key = "FIN" + '_' + subID + '_' + MonotonicClock.getDateStr("YYYY-MM-DD") + "_REWARD" + (this.reward).toString() + '.csv';
        }
        offerDataForDownload(key, csv, 'text/csv');
        var sync = false
        if (!(window.psychoJS.experiment._psychoJS.getEnvironment().toString() === 'Symbol(LOCAL)')) {
            window.psychoJS.experiment._psychoJS.serverManager.uploadData(key, csv, sync);
        }



        this.type = data.type;

        this.textColor = '#1C2833';
        this.warnColor = '#943126';

        this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

    }

    create() {
        // add fullscreen button
        fullscreen(this);
        var text = 'We are calculating your bonus...\n' + 'Your bonus: ' + Math.floor(this.reward / 100).toString() + ' dollars  ' + (this.reward - Math.floor(this.reward / 100) * 100) + ' cents!\nYou will be paid within 3~5 business days through Prolific.\nPress Return to End the game! You will be redicrected to Prolific completion page.'
        this.add.text(this.screenCenterX, 400, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', fontStyle: '', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
    }

    update() {
        if (!window.navigator.onLine) {
            window.confirm("You turned offline!\nPlease check your internet connection and resume by clicking the OK button.\nIMPORTANT: If you force to close the window while you are disconnected from the internet, your results will not be saved.")
        }
        else {
        }

        if (this.nextObj.isDown) {
            this.next();
        }
    }
    next() {
        // this.scene.start("EndScene");
        this.scene.start("RedirectScene");
    }

    createExpData() {
        var expData = {
            timeUp: 1
        };
        return expData;
    }

    // random int function
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
