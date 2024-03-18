/*
This is the Map class that generate key map attributes, data saving, 
and update functions the constants location and dis_matrix below are 
for debug purpose when load json is not working
*/

export class Map{
  //the Phaser Scene will be passed in as a parameter to access time/mouse/location etc
  constructor(cond, mapContent, width, height, blockID, trialID, mapID, mouse, time){
    this.loadMap(mapContent, width, height);
    this.dataInit(cond, blockID, trialID, mapID, mouse, time);
  }

  loadMap(mapContent, width, height){
    
    this.cityAll        = mapContent['N'];
    this.radius        = 5; //radius of city
    this.budgetTotal   = mapContent['total'];
    this.budgetRemain  = mapContent['total']; // initialize
    this.x             = mapContent['x'].map(x => x + width/2);
    this.y             = mapContent['y'].map(y => y + height/2);
    var y              = this.y;
    this.xy            = this.x.map(function (value, index){
                                              return [value, y[index]]});
    this.cityStart     = this.xy[0];  
    this.cityDistMat   = mapContent['distance'];
  }

  //------------DATA-STRUCTURE--------------------------------------------------
  dataInit(cond, blockID, trialID, mapID, mouse, time) {

		// basic trial info
		this.blockID       =    blockID;
		this.trialID       =    trialID;
		this.mapID         =    mapID;
    this.condition     =    cond; // basic: 2; undo: 3

    // dynamic info
		this.time          =    [time]; 
		this.mousePos      =    [mouse]; 
		this.click         =    [0]; //click indicator
		this.undo          =    [0]; 	
    this.submit        =    [0];

		this.choiceDyn     =    [0]; // start city index
    this.choiceHis     =    [0]; 
    this.choiceLocDyn  =    [this.cityStart]; 
    this.choiceLoc     =    [this.cityStart]; 
    
		this.budgetDyn     =    [this.budgetRemain]; 
    this.budgetHis     =    [this.budgetRemain]; 
    
		this.cityNr        =    [0]; 
		this.check         =    0; //indicator showing if people make valid choice
		this.checkEnd      =    0; 
	}
}

export class scorebar {

  constructor(scene,mmap,color){
      //score bar parameters
      this.barWidth = 130;
      this.barHeight = 600;
      this.nrBox = 12;
      this.distToTop = 150; //distance to screen top
  
      this.boxCenter(scene); //center for labels
      this.incentive(); //calculate incentive: N^2
      this.drawScorebar(scene, color);
      this.indicator(scene,mmap,color);
      }
  
  boxCenter(scene){
      this.boxHeight = this.barHeight / this.nrBox;
      this.centerList = [];
      this.halfHeight = this.boxHeight / 2;
      this.x = this.barWidth / 2 + scene.cameras.main.width / 2 + 500;  //larger the number, further to right

      for (var i = 0; i < this.nrBox; i++) {
          let boxLoc = [this.x, i * this.boxHeight + this.halfHeight];
          this.centerList.push(boxLoc);
      };
  }

  incentive(){
      this.Score = [];
      for (var i = 0; i < this.nrBox; i++){
          var newScore = Math.pow(i, 2)*2;
          this.Score.push(newScore);
      };
  };

  //rendering score Bar
  drawScorebar(scene, color){
      //create rectangle and define style
      this.rect = scene.add.graphics();

      let colorBox = [0xeaf6f1,0xdcf1e7,0xcfebde,0xc1e5d4,
                  0xb3dfcb,0xa5dac1,0x97d4b8,0x89ceae,
                  0x7cc8a5,0x6ec39b,0x60bd92,0x52b788] //color list

      for (var i = 0; i < this.nrBox; i++){

          let boxLoc = this.centerList[i];
          let text = this.Score[i];

          //score bar fill
          var r2 = scene.add.rectangle(boxLoc[0], boxLoc[1] + this.distToTop - this.halfHeight, this.barWidth, this.boxHeight, colorBox[i]);
          r2.setStrokeStyle(2, color);
          
          scene.add.text(boxLoc[0]-10, boxLoc[1] + this.distToTop - this.halfHeight - 15, text, {fontFamily: 'Comic Sans MS', color:'#1C2833',fontSize: '30px',});

      };

      // scorebar title
      scene.add.text(this.centerList[0][0]-50, this.centerList[0][1] + this.distToTop - 110,
                    'Bonus', {fontFamily: 'Comic Sans MS', fontSize: '30px', color:'#1C2833'});
  }

  indicator(scene,mmap,color){
      this.indicatorLoc = this.centerList[mmap.cityNr[mmap.cityNr.length-1]];

      //create triangle arrow and define style
      this.triangle = scene.add.graphics();
      this.triangle.fillStyle(color);

      //arrow parameter
      let point = [this.indicatorLoc[0] - 80, this.indicatorLoc[1] + this.distToTop - this.halfHeight];
      let v2 = [point[0] - 20, point[1] + 10];
      let v3 = [point[0] - 20, point[1] - 10];
      this.triangle.fillTriangle(point[0], point[1], v2[0], v2[1], v3[0], v3[1]);
      }

  whiteIndicator(scene,color){
      this.indicatorLocBest = this.centerList[scene.max]; // get the best result 

      //create triangle arrow and define style
      this.whiteTriangle = scene.add.graphics();
      this.whiteTriangle.fillStyle(color);

      //arrow parameter
      let point = [this.indicatorLocBest[0] - 80, this.indicatorLocBest[1] + this.distToTop - this.halfHeight];
      let v2 = [point[0] - 20, point[1] + 10];
      let v3 = [point[0] - 20, point[1] - 10];
      this.whiteTriangle.fillTriangle(point[0], point[1], v2[0], v2[1], v3[0], v3[1]);
      }
}
