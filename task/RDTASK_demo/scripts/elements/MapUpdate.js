function dataChoice(mmap, mouse, time) {
  
    mmap.time.push(time); 
    mmap.mousePos.push(mouse); 
    mmap.click.push(1); //click indicator
    mmap.undo.push(0); 	
    mmap.submit.push(0);
    
    mmap.choiceDyn.push(mmap.cityIndex);
    mmap.choiceHis.push(mmap.cityIndex);
    mmap.choiceLocDyn.push(mmap.cityLoc);
    mmap.choiceLoc.push(mmap.cityLoc);
  
    mmap.budgetDyn.push(mmap.budgetRemain);
    mmap.budgetHis.push(mmap.budgetRemain);
    
    mmap.cityNr.push(mmap.cityNr[mmap.cityNr.length-1]+1);
    mmap.check = 0; //change choice indicator after saving them
  
    delete mmap.cityIndex;
    delete mmap.cityLoc;
  }
  
  function dataStatic(mmap, mouse, time){
  
    mmap.time.push(time); 
    mmap.mousePos.push(mouse); 
    mmap.click.push(0); //click indicator
    mmap.undo.push(0); 	
    mmap.submit.push(0);
  
    mmap.choiceHis.push(mmap.choiceDyn[mmap.choiceDyn.length-1]);
    mmap.choiceLoc.push(mmap.choiceLocDyn[mmap.choiceLocDyn.length-1]);
    mmap.budgetHis.push(mmap.budgetDyn[mmap.budgetDyn.length-1]);
  
    mmap.cityNr.push(mmap.cityNr[mmap.cityNr.length-1]);
  }
  
  function dataUndo(mmap, mouse, time){
  
    mmap.time.push(time); 
    mmap.mousePos.push(mouse); 
    mmap.click.push(0); //click indicator
    mmap.undo.push(1); 	
    mmap.submit.push(0);
    
    mmap.choiceDyn.pop();
    mmap.choiceLocDyn.pop();
    mmap.choiceHis.push(mmap.choiceDyn[mmap.choiceDyn.length - 1]);
    mmap.choiceLoc.push(mmap.choiceLocDyn[mmap.choiceLocDyn.length - 1]);
    
    mmap.budgetDyn.pop();
    mmap.budgetHis.push(mmap.budgetDyn[mmap.budgetDyn.length - 1]);
    
    mmap.cityNr.push(mmap.cityNr[mmap.cityNr.length-1] - 1);
  }

  function dataSubmit(mmap, mouse, time){
  
    mmap.time.push(time); 
    mmap.mousePos.push(mouse); 
    mmap.click.push(0); //click indicator
    mmap.undo.push(0); 	
    mmap.submit.push(1);
  
    mmap.choiceHis.push(mmap.choiceDyn[mmap.choiceDyn.length-1]);
    mmap.choiceLoc.push(mmap.choiceLocDyn[mmap.choiceLocDyn.length-1]);
    mmap.budgetHis.push(mmap.budgetDyn[mmap.budgetDyn.length-1]);
  
    mmap.cityNr.push(mmap.cityNr[mmap.cityNr.length-1]);
  }

  
  //---------Check---User---Input-------------------------------------------------
  function makeChoice(mmap, mouseX, mouseY){
  //do not evaluate the starting point
    for (var i = 1; i < mmap.xy.length; i++){
      mmap.mouseDistance = Math.hypot(mmap.xy[i][0]-mouseX, mmap.xy[i][1]-mouseY);
      //console.log(this.mouseDistance)      
      if (mmap.mouseDistance <= mmap.radius && mmap.choiceDyn.includes(i)==false) {  // cannot choose what has been chosen
        if (mmap.budgetDyn[mmap.budgetDyn.length-1] >= 
          mmap.cityDistMat[i][mmap.choiceDyn[mmap.choiceDyn.length-1]]) { // fixed bug of choosing city out of reach in the end
  
          mmap.cityIndex = i; //index of chosen city
          mmap.cityLoc = mmap.xy[i];//location of chosen city
          mmap.check = 1; //indicator showing people made a valid choice
          }
      };
    };
  }
  
  function budgetUpdate(mmap){
    //get distance from current choice to previous choice
    let dist = mmap.cityDistMat[mmap.cityIndex][mmap.choiceDyn[mmap.choiceDyn.length-1]]
    mmap.budgetRemain = mmap.budgetDyn[mmap.budgetDyn.length-1] - dist;
  }

  function checkEnd(mmap) {
    // copy distance list for current city
    let cityDistRowCopy = mmap.cityDistMat[mmap.choiceDyn[mmap.choiceDyn.length-1]].slice();
    for (var i of mmap.choiceDyn) {
      cityDistRowCopy[i] = 0;
    };

    if (cityDistRowCopy.some(i =>
      i <= mmap.budgetDyn[mmap.budgetDyn.length-1] && i != 0)){
      return true; // not end
    } else {
      mmap.checkEnd = 1;
      return false; // end
    };
  }

  function getTime() {
    //make a new date object
    let d = new Date();
    //return the number of milliseconds since 1 January 1970 00:00:00.
    return d.getTime();
  }
  