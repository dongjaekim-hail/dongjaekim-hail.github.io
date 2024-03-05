import { basicTrainMap } from '../configs/basicTrainMap.js';
import { basicMap } from '../configs/basicMap.js';
import { undoTrainMap } from '../configs/undoTrainMap.js';
import { undoMap } from '../configs/undoMap.js';

// //Pavlovia data saving pipeline
// //import * as data from "../../lib/data-2020.2.js";
// import {PsychoJS} from '../../lib/core-2020.2.js';
// //skip built-in error intercept
// // PsychoJS.prototype._captureErrors = () => {};

// //initialise PsychoJS object for saving task data
// window.psychoJS = new PsychoJS({ debug: true });   //attached to window object so as to be globally available (across scenes)

var subID;

export default class BootScene extends Phaser.Scene {

	constructor() {
		super('BootScene');

		//Pavlovia data saving pipeline, change expName.
		(async function startPsychoJS() {
			// The experiment handler needed to save our data would
			// be inaccessible before this call resolves. Because of
			// a bug in PsychoJS, please make `expInfo` an empty object
			// instead of skipping if not required
			await psychoJS.start({ expName: 'rc-phaser', expInfo: {} })
		})();
	}

	preload() {
		// load fullscreen icon
		this.load.spritesheet('fullscreen', './images/fullscreen.png', { frameWidth: 64, frameHeight: 64 });

		// get exp start time
		var time = new Date();
		this.registry.set('expStartTime', formatDate(time));

		// add config
		this.registry.set('timeLimit', 10000) // ms
		this.registry.set('shortBreak', 1000 * 60 * 5) // ms
		this.registry.set('remainTime', 1000 * 60 * 90) // ms 90

		this.registry.set('shortDisplay', 1000 * 2.5) // ms

		// add configurations to registry
		this.registry.set('basicTrainMap', basicTrainMap);
		this.registry.set('basicMap', basicMap);
		this.registry.set('undoTrainMap', undoTrainMap);
		this.registry.set('undoMap', undoMap);

		this.registry.set('gameTrialNrBlk', 23);
		this.registry.set('gameTrialNr', this.registry.values.gameTrialNrBlk * 4);
		this.registry.set('trainTrialNrBlr', 10);

		this.registry.set('basicNr', 0); // initialize
		this.registry.set('undoNr', 0); // initialize
		this.registry.set('trialCounter', 0) // intialize how many trials have done
		this.registry.set('trialCounterM', 0) // intialize how many trials have done
		var cond = [3,2,2,3]
		this.registry.set('cond', cond);
		this.registry.set('condTrain', [2,3]);

		var ManiTrialInd = this.getManiTrialInd();
		this.registry.set('ManiTrialInd', ManiTrialInd);
		console.log(ManiTrialInd)

		this.registry.set('fullscreenOn', 0);

		// create random index for group and single condition trials
		var basicInd = Array.from(Array(this.registry.values.gameTrialNr / 2).keys());
		this.shuffleArray(basicInd)
		//localStorage.setItem('groupInd', JSON.stringify(groupInd));
		this.registry.set('basicInd', basicInd);

		var undoInd = Array.from(Array(this.registry.values.gameTrialNr / 2).keys());
		this.shuffleArray(undoInd)
		// localStorage.setItem('singleInd',  JSON.stringify(singleInd));
		this.registry.set('undoInd', undoInd);


	}

	create() {
		//auto-grab ID from recruitment platform
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		subID = urlParams.get('prolific_pid');
		this.registry.set('subID', subID);
		console.log(subID);
		console.log(window.psychoJS)

		this.scene.start("TitleScene");
	}

	// helper functions
	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	getManiTrialInd() {
		var maniTrialInd = [];
		for (var j = 0; j <= 4 - 1; j++) {
			var Temp = Math.floor(Math.random() * 20) + 1;  // returns a random integer from 1 to 22-2
			maniTrialInd.push(j * this.registry.values.gameTrialNrBlk + Temp)
		}

		return maniTrialInd
	}
}