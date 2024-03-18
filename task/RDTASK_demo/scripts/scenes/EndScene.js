import { MonotonicClock, offerDataForDownload } from '../../lib/util-2020.2.js';
var subID;
export default class EndScene extends Phaser.Scene {

	constructor() {
		super("EndScene");
	}
	init(data) {
		// local save
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);


		// Force to save [DONGJAE]
		subID = urlParams.get('prolific_pid');
		this.registry.set('subID', subID);

		// if (subID == undefined) {
		// 	window.psychoJS.experiment.extraInfo.participant = "PARTICIPANT"
		// 	window.psychoJS.experiment.extraInfo.date = MonotonicClock.getDateStr()
		// }
		// else {
		// 	window.psychoJS.experiment.extraInfo.participant = "PARTICIPANT" + "_" + subID
		// 	window.psychoJS.experiment.extraInfo.date = MonotonicClock.getDateStr("YYYY-MM-DD")
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

		this.type = data.type;

		this.textColor = '#1C2833';
		this.warnColor = '#943126';

		this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
		this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

	}

	create() {
		// add fullscreen button
		fullscreen(this);

		if (this.type === 'fail') {
			var text = 'Unfortunately you have failed the attention check.\nYou cannot continue this game.\nYou can now close this webpage.'
			this.add.text(this.screenCenterX, 400, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', fontStyle: '', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
		} else if (this.type === 'time') {
			var allData = this.createExpData();
			saveTrialData(allData);

			var text = 'You have reached the maximum time for this task.\nThank you for your participation.\n'
			this.add.text(this.screenCenterX, 400, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', fontStyle: '', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
		}
		else {
			var text = 'Your data saved locally and to the server.\nThank you for your participation!'
			this.add.text(this.screenCenterX, 400, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', fontStyle: '', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
		}

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
		this.scene.start("saveScene")
		// if (this.type === 'fail') {
		// 	this.scene.start("RedirectScene", { type: 'fail' });
		// } else if (this.type === 'time') {
		// 	this.scene.start("RedirectScene", { type: 'fail' });
		// } else {
		// 	this.scene.start("RedirectScene", { type: 'success' });
		// }
	}

	createExpData() {
		var expData = {
			timeUp: 1
		};
		return expData;
	}


}
