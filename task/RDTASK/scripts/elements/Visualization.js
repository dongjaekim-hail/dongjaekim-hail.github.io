function drawCity(scene, mmap, colorMajor, colorMinor){
    // define style
    var graphics = scene.add.graphics();
    graphics.fillStyle(colorMajor, 0.5);

    // draw cities except for the starting city
    for (var i = 1; i < mmap.xy.length; i++) {
        graphics.fillCircle(mmap.xy[i][0], mmap.xy[i][1], mmap.radius);
    };

    // draw the starting city
    graphics.fillStyle(colorMinor, 0.5);
    graphics.fillCircle(mmap.cityStart[0], mmap.cityStart[1], mmap.radius);
}

function drawBudget(scene, mmap, color, pointer) {
    // define style
    scene.budgetGraphics = scene.add.graphics();
    scene.budgetGraphics.lineStyle(4, color, 1.0);

    //budget follow mouse
    let x = mmap.choiceLocDyn[mmap.choiceLocDyn.length - 1][0];
    let y = mmap.choiceLocDyn[mmap.choiceLocDyn.length - 1][1];

    let radians = Math.atan2(pointer.y - y, pointer.x - x);

    var budgetPosX = x + mmap.budgetDyn[mmap.budgetDyn.length - 1] * Math.cos(radians);
    var budgetPosY = y + mmap.budgetDyn[mmap.budgetDyn.length - 1] * Math.sin(radians);

    //draw budget line
    scene.line = new Phaser.Geom.Line();
    scene.line.setTo(x, y, budgetPosX, budgetPosY);
    scene.budgetGraphics.strokeLineShape(scene.line);
  }

function drawRoad(scene, mmap, color){
    // define style
    scene.roadGraphics = scene.add.graphics();
    scene.roadGraphics.lineStyle(4, color, 1.0);

    for (var i = 0; i < mmap.choiceLocDyn.length-1; i++) {
        scene.road = new Phaser.Geom.Line(
        mmap.choiceLocDyn[i][0],mmap.choiceLocDyn[i][1],
        mmap.choiceLocDyn[i+1][0],mmap.choiceLocDyn[i+1][1]);
        scene.roadGraphics.strokeLineShape(scene.road);
    };
}
