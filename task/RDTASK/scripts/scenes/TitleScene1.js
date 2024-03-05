// after boot scene



var UpdateScreen = true
var screenCenterX_ = window.innerHeight + window.innerWidth / 2;
var screenCenterX__ = window.innerHeight + window.innerWidth / 2;


export default class TitleScene extends Phaser.Scene {

	constructor() {
		super("TitleScene");
	}

	init() {
		this.textColor = '#1C2833';
		this.warnColor = '#943126';

		// this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		this.nextObj = this.input.keyboard.addKey('enter');  // Get key object

		// add configurations to registry
		//this.validCode   = this.registry.values.validCode;

		// reisze

		var width_ = window.innerWidth
		var height_ = window.innerHeight
		var Desired_width = height_ * 16 / 9
		var Desired_height = height_ * .95
		Desired_width = Desired_width * .95
		this.screenCenterX = Desired_width / 2;
		this.screenCenterY = Desired_height / 2;

		this.scale.resize(Desired_width, Desired_height)
	}

	create() {
		// add fullscreen button
		fullscreen(this);

		var width_ = window.innerWidth
		var height_ = window.innerHeight
		var Desired_width = height_ * 16 / 9
		var Desired_height = height_ * .95
		Desired_width = Desired_width * .95

		// add next sign
		var nextSign = 'Welcome to the game.\nPlease click the button on the top-right corner to swith to full-screen mode.\nThen, press RETURN to start training';
		//var nextSign      = 'After entering your code, press ENTER to start training';
		//this.add.text(this.screenCenterX, this.sys.game.config.height - 50, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
		var mainText = this.add.text(this.screenCenterX, this.screenCenterY, nextSign, { fontFamily: 'Comic Sans MS', fontSize: (Desired_height * 30 / 800).toString() + 'px', color: this.textColor, aligh: 'center' });
		mainText.setOrigin(0.5);
		this.mainText = mainText

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
		// check need of udpate
		screenCenterX__ = window.innerHeight + window.innerWidth / 2;
		if (screenCenterX__ != screenCenterX_) {
			UpdateScreen = true
		}
		else {
			UpdateScreen = false
		}

		if (UpdateScreen) {
			this.mainText.destroy()
			/*
			*/

			// resacle and make it full screen.
			var width_ = window.innerWidth
			var height_ = window.innerHeight
			var Desired_width = height_ * 16 / 9
			var Desired_height = height_ * .95
			Desired_width = Desired_width * .95

			this.screenCenterX = Desired_width / 2
			this.screenCenterY = Desired_height / 2

			this.scale.resize(Desired_width, Desired_height)
			// add next sign
			var nextSign = 'Welcome to the game.\nPlease click the button on the top-right corner to swith to full-screen mode.\nThen, press RETURN to start training';
			//var nextSign      = 'After entering your code, press ENTER to start training';
			//this.add.text(this.screenCenterX, this.sys.game.config.height - 50, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
			// var mainText = this.add.text(Desired_width / 2, Desired_height / 2, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
			var mainText = this.add.text(Desired_width / 2, Desired_height / 2, nextSign, { fontFamily: 'Comic Sans MS', fontSize: (Desired_height * 30 / 800).toString() + 'px', color: this.textColor, aligh: 'center' });// rescale originally 30px for 800
			mainText.setOrigin(0.5);
			this.mainText = mainText


		}



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

			if (this.scale.isFullscreen) {
				this.next();
			}
			else {
				window.alert("You should play the game in full-screen mode!\nClick the button on the top-right corner.")
			}
			//	} else {
			//		this.add.text(this.screenCenterX, 500, 'Please enter a valid code!', { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.warnColor }).setOrigin(0.5);
			//	}
		}
	}

	next() {
		//localStorage.setItem('code', this.textEntry.text);
		//this.registry.set('code', this.textEntry.text);
		this.scene.start("PreloadScene");
	}

}