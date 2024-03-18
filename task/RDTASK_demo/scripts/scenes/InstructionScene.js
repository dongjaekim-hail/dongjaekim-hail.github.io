/*
This contains the instructions for the task extended from the Phaser scene
Class. It use setVisible function to display text.
Not completed flow of instructions
*/

export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super('InstructionScene');
  }

  init(data) {
    this.part = data.part;
    this.textColor = '#1C2833';
    this.nextObj = this.input.keyboard.addKey('enter');  // Get key object

    this.flag = data.flag;
    this.start = getTime();
  };

  preload() {
  };

  create() {
    // add fullscreen button
    fullscreen(this);
    this.timedEvent = this.time.addEvent({ delay: this.registry.values.remainTime, callback: this.end, callbackScope: this });

    // add title
    if (this.part == 1) {
      this.trainInstruction();
    } else if (this.part == 2) {
      this.transition()
    } else {
      this.gameInstruction();
    }
  };

  update() {
    // timing
    var time = new Date();
    var elapsed = time.getTime() - this.start;
    this.registry.values.remainTime = this.registry.values.remainTime - elapsed;
    this.start = time.getTime()

    if (this.nextObj.isDown) {
      if (this.scale.isFullscreen) {
        this.nextScene();
      }
      else {
        window.alert("You should play the game in full-screen mode!\nClick the button in the top-right corner.")
      }
    }
  };

  end() {
    this.scene.start("EndScene", { type: 'time' });
  }

  gameInstruction() {
    /*       var title      = 'Instruction Part 1';
          const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
          this.add.text(screenCenterX, 50, title, { fontFamily: 'Comic Sans MS', fontSize: '37px', fontStyle: 'bold', color: this.textColor, aligh: 'center'}).setOrigin(0.5);
     */
    //var text = 'Now you will read the instruction for Road Construction.\nIn Road Construction, you will see a map and a green line as your budget.\nYour goal is to connect as many cities as possible with the given budget.\nThe score bar on the right will show cents you have earned in respect to the number of cities connected.\nPress RETURN to try two examples.'
    if (this.flag == undefined) {
      var text = 'Now you will start the demo game, i.e. shorter game than the formal one. \nRemember every connected cities will be counted towards your performance for that map.\nPress ENTER to start.'
      this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
    }
    else {
      var text = '\n\n\nPress ENTER to start.'
      this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
    }
    // what is coming next
    this.trialCounter = this.registry.values.trialCounter;
    this.nextBlockInd = Math.floor(this.trialCounter / this.registry.values.gameTrialNrBlk);
    this.nextOneAll = this.registry.values.cond[this.nextBlockInd];

    if (this.nextOneAll === 2) {
      var condition = '"Road construction without undo"';
    } else {
      var condition = '"Road construction with undo"';
    }

    var nextSign = `The next group of trials are ${condition} trials.`
    this.add.text(50, 400, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
    // this.add.text(this.screenCenterX, this.sys.game.config.height - 500, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '37px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
  }

  trainInstruction() {
    var text = 'Press ENTER to start the training. \nThe result of training trials will not be recorded and will not affect your final reward.'
    this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });

    // what is coming next
    this.nextOneAll = this.registry.values.condTrain[0];

    if (this.nextOneAll === 2) {
      var condition = '"Road construction without undo"';
    } else {
      var condition = '"Road construction with undo"';
    }

    var nextSign = `The next group of trials are ${condition} trials.`
    this.add.text(50, 300, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
    // this.add.text(this.screenCenterX, this.sys.game.config.height - 500, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '37px', color: this.textColor, aligh: 'center' }).setOrigin(0.5);
  }

  transition() {
    var text = 'You are still in the training session.\n Press ENTER to continue.'
    this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });

    // what is coming next
    this.nextOneAll = this.registry.values.condTrain[1];

    if (this.nextOneAll === 2) {
      var condition = '"Road construction without undo"';
    } else {
      var condition = '"Road construction with undo"';
    }

    var nextSign = `The next group of trials are ${condition} trials.`
    this.add.text(50, 300, nextSign, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
  }

  nextScene() {
    //change scenes on key press command
    if (this.part == 1) {
      this.scene.start('TrainScene', { trialInd: 0, cond: 2 });
    } else if (this.part == 2) {
      this.scene.start('TrainScene', { trialInd: 0, cond: 3 });
      //    } else if (this.part == 3) {
    } else {
      this.scene.start('GameScene');
    }

  }
  // basicInstruction() {
  //   /*       var title      = 'Instruction Part 1';
  //         const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
  //         this.add.text(screenCenterX, 50, title, { fontFamily: 'Comic Sans MS', fontSize: '37px', fontStyle: 'bold', color: this.textColor, aligh: 'center'}).setOrigin(0.5);
  //    */
  //   //var text = 'Now you will read the instruction for Road Construction.\nIn Road Construction, you will see a map and a green line as your budget.\nYour goal is to connect as many cities as possible with the given budget.\nThe score bar on the right will show cents you have earned in respect to the number of cities connected.\nPress RETURN to try two examples.'
  //   var text = 'Press RETURN to try two examples of basic Road Construction without undo.'
  //   this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
  // }

  // undoInstruction() {
  //   /*       var title      = 'Instruction Part 2';
  //         const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
  //         this.add.text(screenCenterX, 50, title, { fontFamily: 'Comic Sans MS', fontSize: '37px', fontStyle: 'bold', color: this.textColor, aligh: 'center'}).setOrigin(0.5);
  //    */
  //   //var text = 'Now you will read the instruction for Road Construction with Undo.\nIn Road Construction with Undo, you will see a map and a green line as your budget.\nYour goal is to connect as many cities as possible with the given budget.\nIn addition, you can press Z to undo your connections.\nThe score bar on the right will show cents you have earned in respect to the number of cities connected.\nand a record of your highest score achieved.\nPress RETURN to try two examples.'
  //   var text = 'Press RETURN to try two examples of Road Construction with undo.'
  //   this.add.text(50, 200, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', color: this.textColor, aligh: 'center' });
  // }
}
