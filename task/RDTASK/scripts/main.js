import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import InstructionScene from './scenes/InstructionScene.js';
import TrainScene from './scenes/TrainScene.js';
import GameScene from './scenes/GameScene.js';
import CheckScene from './scenes/CheckScene.js';
import CheckScenePre from './scenes/CheckScenePre.js';
import CheckScenePost from './scenes/CheckScenePost.js';
import BreakScene from './scenes/BreakScene.js';
import EndScene from './scenes/EndScene.js';
import RandomPollScene from './scenes/RandomPollScene.js';
import RedirectScene from './scenes/RedirectScene.js';
import saveScene from './scenes/saveScene.js';
//Pavlovia data saving pipeline
//import * as data from "../../lib/data-2020.2.js";
import { PsychoJS } from '../lib/core-2020.2.js';
//skip built-in error intercept
// PsychoJS.prototype._captureErrors = () => {};

//initialise PsychoJS object for saving task data
window.psychoJS = new PsychoJS({ debug: true });   //attached to window object so as to be globally available (across scenes)

// //Pavlovia data saving pipeline, change expName.
//   async function startPsychoJS() {
//     // The experiment handler needed to save our data would
//     // be inaccessible before this call resolves. Because of
//     // a bug in PsychoJS, please make `expInfo` an empty object
//     // instead of skipping if not required
//     await psychoJS.start({ expName: 'rc-phaser', expInfo: {} })
//     };



// Load our scenes
var bootScene = new BootScene();
var titleScene = new TitleScene();
var preloadScene = new PreloadScene();
var instructionScene = new InstructionScene();
var trainScene = new TrainScene();
var gameScene = new GameScene();
var checkScene = new CheckScene();
var checkScenePre = new CheckScenePre();
var checkScenePost = new CheckScenePost();
var breakScene = new BreakScene();
var endScene = new EndScene();
var randomPollScene = new RandomPollScene();
var redirectScene = new RedirectScene();
var saveSCene = new saveScene()

//set the game configuration 
var config = {
  parent: 'game-container',    //ID of the DOM element to add the canvas to
  fullscreenTarget: 'game-container',
  type: Phaser.AUTO,
  width: 1400,
  height: 800,
  backgroundColor: "#C8C6C5",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  //dom: {
  //  createContainer: true    //to allow text input DOM element
  //}
};


var game = new Phaser.Game(config);

// load scenes
game.scene.add('BootScene', bootScene);
game.scene.add('TitleScene', titleScene);
game.scene.add('PreloadScene', preloadScene);
game.scene.add('InstructionScene', instructionScene);
game.scene.add("TrainScene", trainScene);
game.scene.add("GameScene", gameScene);
game.scene.add("CheckScene", checkScene);
game.scene.add("CheckScenePre", checkScenePre);
game.scene.add("CheckScenePost", checkScenePost);
game.scene.add("BreakScene", breakScene);
game.scene.add("EndScene", endScene);
game.scene.add("RandomPollScene", randomPollScene);
game.scene.add("RedirectScene", redirectScene);
game.scene.add("saveScene", saveSCene);

// start 
game.scene.start("BootScene");

