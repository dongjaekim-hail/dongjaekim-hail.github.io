import { Map, scorebar } from '../elements/Map.js';
//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";

// basic condition training session
export default class CheckScenePre extends Phaser.Scene {

	constructor() {
		super('CheckScenePre');
	}


	init() {
		this.textColor = '#1C2833';
		this.warnColor = '#943126';

		this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		this.nextObj = this.input.keyboard.addKey('enter');  // Get key object

		this.start = getTime();

		// add configurations to registry
		//this.validCode   = this.registry.values.validCode;
	}

	create() {
		// add fullscreen button
		fullscreen(this);
		this.timedEvent = this.time.addEvent({ delay: this.registry.values.remainTime, callback: this.end, callbackScope: this });

		// add next sign
		// this.timedEvent = this.time.addEvent({ delay: this.registry.values.shortDisplay, callback: this.next, callbackScope: this });

		// add next sign
		var nextSign = 'You are now going to play an attention check trial.\nPlease connect cities as instructed on the top-left corner of the panel.\nPress RETURN to start.'
		//var nextSign      = 'After entering your code, press ENTER to start training';
		this.add.text(this.screenCenterX, this.sys.game.config.height - 350, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
		//this.add.text(this.screenCenterX, 300, 'Enter your code:', { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor }).setOrigin(0.5);;

		// add identifier input
		//this.textEntry = this.add.text(this.screenCenterX, 400, '', { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor}).setOrigin(0.5);;

		//this.input.keyboard.on('keydown', function (event) {
		//	if (event.keyCode === 8 && this.textEntry.text.length > 0) // delete
		//	{
		//		this.textEntry.text = this.textEntry.text.substr(0, this.textEntry.text.length - 1);
		//	}
		//	else if (event.keyCode >= 48 && event.keyCode < 58) // number 
		//	{
		//		this.textEntry.text += event.key;
		//	}	
		//},this);

	}

	update() {
		// timing
		var time = new Date();
		var elapsed = time.getTime() - this.start;
		this.registry.values.remainTime = this.registry.values.remainTime - elapsed;
		this.start = time.getTime()

		if (this.nextObj.isDown) {
			//    var hasMatch =false;
			//    for (var index = 0; index < this.validCode.length; ++index) {

			//        var entry = this.validCode[index];

			//        if(entry.code == this.textEntry.text){
			//            hasMatch = true;
			//            if (entry.group === 1){
			//                var cond = [3,2,2,3]
			//                this.registry.set('cond', cond); 
			//            }else{
			//                var cond = [2,3,3,2]
			//                this.registry.set('cond', cond); 
			//            }
			//            break;
			//        }
			//    }
			//	if (hasMatch)	{	
			this.next();
			//	} else {
			//		this.add.text(this.screenCenterX, 500, 'Please enter a valid code!', { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.warnColor }).setOrigin(0.5);
			//	}
		}
	}

	end() {
		this.scene.start("EndScene", { type: 'time' });
	}


	next() {
		//localStorage.setItem('code', this.textEntry.text);
		//this.registry.set('code', this.textEntry.text);
		// this.scene.start("PreloadScene");
		this.scene.start("CheckScene");
	}

}

