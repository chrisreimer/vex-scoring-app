let version="0.1.11h"

let yellow; //Color Presets
let purple;
let red;
let blue;
let green;

let screenScale=1;
let mogoScale=1;
let comboScale=1;

let gear; //Gear Icon image

let regular;  //Fonts
let semibold;
let bold;

let matchField; //Field Objects
let skillsField;
let skillsSave=[];
let fields=[];
let fieldsSave=[];
let lrt;

let appState=0;

let menuButtons=[]; //Menu Buttons
let backButton;

let smallBack;
let mediumBack;
let largeBack;
let settingButtons=[];
let linkButtons=[];
let manualButtons=[];
let manualShort;

let warningButton;
let warningExit;
let warned=false;

let tmScreen;
let tmSave;

let remoteFieldSelected=0;  //0=Red, 1=Blue
let mogoSelected=-1; //-1 = Main Field, >=0 = Mogo Editor

let click;  //Click and Drag Variables
let postClick=0;
let held;
let dragging=false;
let initialDragging=false;
let finalDragging=false;
let pressX=0;
let pressY=0;
let translatedMouseX;
let translatedMouseY;
let disableHover;

let pMouseX;
let pMouseY;
let hovered;

let clickAnimation=0;
let animationTrigger=0; //0=mouse click, 1=touchpad

function preload(){

  gear=loadImage('https://vexscoring.app/gear.png');

  regular=loadFont('https://vexscoring.app/NEXT%20ART_Regular.otf');
  semibold=loadFont('https://vexscoring.app/NEXT%20ART_SemiBold.otf');
  bold=loadFont('https://vexscoring.app/NEXT%20ART_Bold.otf');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(375, 667);
  if(width/375.0>height/667.0)screenScale=height/667.0;
  else screenScale=width/375.0;
  rectMode(CENTER);
  pixelDensity(2);
  textAlign(CENTER,CENTER);
  imageMode(CENTER);

  yellow=new ColorBase(230, 200, 10);
  purple=new ColorBase(130, 60, 180);
  red=new ColorBase(200, 20, 20);
  blue=new ColorBase(25, 95, 200);
  green=new ColorBase(20,200,20);


  matchField=new Field();
  matchField.resetField();

  skillsField=new Field();
  skillsField.resetField();

  fields[1]=matchField;
  fields[2]=skillsField;

  lrt=new remoteField();
  fields[4]=lrt.rFields[0];
  fields[5]=lrt.rFields[1];
  lrt.resetLRT();


  //menuButtons[0]=new Button(0,-100,300,130,"MATCH");
  //menuButtons[1]=new Button(0,55,300,130,"SKILLS");
  //menuButtons[2]=new Button(0,210,300,130,"REMOTE");

  //menuButtons[0]=new Button(0,-105,300,120,"MATCH");
  //menuButtons[1]=new Button(0,37,300,120,"SKILLS");
  //menuButtons[2]=new Button(0,179,300,120,"REMOTE");

  menuButtons[0]=new Button(0,-113,300,104,"MATCH");
  menuButtons[1]=new Button(0,11,300,104,"SKILLS");
  menuButtons[2]=new Button(0,135,300,104,"REMOTE");
  menuButtons[0].tSize=25;
  menuButtons[1].tSize=25;
  menuButtons[2].tSize=25;

  menuButtons[3]=new Button(-155,-300,0,0,"?");
  menuButtons[3].tSize=25;
  menuButtons[3].setColors(color(40,40,45),0,0,0,0,0,color(150,150,160));
  menuButtons[4]=new Button(155,-300,55,55,"");
  menuButtons[4].setColors(color(40,40,45),0,0,0,0,0,color(150,150,160));

  //menuButtons[5]=new Button(0,286,300,50,"Game Manual");
  menuButtons[5]=new Button(0,259,300,104,"Manual");
  menuButtons[5].tSize=25;//17;

  backButton=new Button(-155,-300,55,55," « ");
  smallBack=new Button(0,-300,375,55,"");
  mediumBack=new Button(0,-290,375,86,"");
  largeBack=new Button(0,-247,375,173,"");
  //backButton.textA="<<";
  backButton.tSize=40;
  backButton.fillA=color(40,40,45);
  smallBack.setColors(color(0,0),color(0,0),0,0,0,0,0);
  mediumBack.setColors(color(0,0),color(0,0),0,0,0,0,0);
  largeBack.setColors(color(0,0),color(0,0),0,0,0,0,0);

  settingButtons[0]=new Button(0,-135,300,65,"Ring Editor: Fancy\n")
  settingButtons[0].setExtraData(2,"Ring Editor: Simple\n",20);
  settingButtons[1]=new Button(0,-45,300,65,"Ring Editors: Left");
  settingButtons[1].setExtraData(2,"Ring Editors: Right",20);
  settingButtons[2]=new Button(0,45,300,65,"Rings: Visible\n");
  settingButtons[2].setExtraData(2,"Rings: Hidden\n",20);
  settingButtons[3]=new Button(0,225,300,65,"");//debug button
  settingButtons[3].setExtraData(2,"Debug Mode: On",20);
  settingButtons[3].setColors(color(0,0),color(0,0),0,0,0,0,0);

  linkButtons[0]=new Button(0,100,200,65,"Join Server");
  linkButtons[0].setColors(color(88, 101, 242),color(73, 86, 222),0,0,0,0,0)
  linkButtons[0].tSize=20;

  manualButtons[0]=new Button(0,-170,300,95,"Game Manual");
  manualButtons[1]=new Button(0,-69,300,65,"Field Specifications");
  manualButtons[2]=new Button(0,17,300,65,"Robot Skills Challenge");
  manualButtons[3]=new Button(0,103,300,65,"VEX U");
  manualButtons[4]=new Button(0,189,300,65,"VEX AI Competition");
  manualButtons[5]=new Button(0,275,300,65,"Live Remote Tournaments");

  manualShort=new Button(-100,-300,55,55,"");
  manualShort.setExtraData(2,"",25);
  //manualShort.fillA=color(40,40,45);
  manualShort.fillA=color(0,0);
  manualShort.fillA2=color(0,0);

  manualButtons[0].tSize=22;
  for(let i=1;i<6;i++){
    manualButtons[i].tSize=17;
  }


  //hideRings=new Button(135,-280,75,75,"Hide\nRings");
  //hideRings.setExtraData(2,"Show\nRings",17);

  warningButton=new Button(0,43-7.5-5,340,667-86-15-10,"This scoring app is\nstill in development,\nand until more scenarios\npertaining to mobile\ngoal and ring scoring are\ncleared up in the Official\nQnA, this app may not\nalways be correct.\n\nUse at your own risk.\n\n");

  warningButton.setColors(red.dark4,red.dark4,0,0,0,0,color(230,230,240));
  warningButton.tSize=20;

  warningExit=new Button(0,210,200,80,"Proceed");
  warningExit.setColors(red.dark1,red.dark2,0,0,0,0,color(230,230,240));
  warningExit.setExtraData(2,"Proceed",25);


  tmScreen=new Button(135,-290,75,75,"");
  tmScreen.setExtraData(2,"",20);
  //tmScreen.strokeA=color(100,100,110);
  tmScreen.fillA=color(40,40,45);
  tmSave=new Button(135,-290,75,75,"Save\nScore");
  tmSave.tSize=17;
  //tmScreen.fillA2=color(50,50,55);


  let counterSave = getItem('counterSave');
  if(!(counterSave===null)){
    settingButtons[0].toggled=counterSave;
  }
  let cSideSave = getItem('cSideSave');
  if(!(cSideSave===null)){
    settingButtons[1].toggled=cSideSave;
  }
  let ringSave=getItem('ringSave');
  if(!(ringSave===null)){
    settingButtons[2].toggled=ringSave;
  }

  let warnedSave = getItem('warnedSave');
  if(!(warnedSave===null)){
    warningExit.toggled=warnedSave;
  }

  let skillsSaveB = getItem('skillsSave');
  if(!(skillsSaveB===null)){
    skillsSave=skillsSaveB;
  }
  else{
    skillsSave=[0,0,0,0,0,0];
  }

  let fSave=getItem('fieldsSave');
  if(!(fSave===null)){
    //fields=fSave;
  }


  let appSave=getItem('appSave');
  if(!(appSave===null)){
    console.log(appSave);
    appState=appSave;
  }
  try{
  let mfSave=getItem('matchFieldSave');
  if(!(mfSave===null)){
    //matchField=mfSave;
    for(let i=0;i<7;i++){
      matchField.mogos[i].rings=mfSave.mogos[i].rings;
      matchField.autonWinner=mfSave.autonWinner;
      matchField.auton.toggled=true;
      matchField.platButtons[0].toggled=mfSave.platButtons[0].toggled;
      matchField.platButtons[1].toggled=mfSave.platButtons[1].toggled;
      matchField.platButtons[2].textA=mfSave.platButtons[2].textA;
      matchField.platButtons[3].textA=mfSave.platButtons[3].textA;
      //matchField.mogos[i].zone=mfSave.mogos[i].zone;
    }
    matchField.zoneMogos=[[],[],[],[],[],[]]
    //matchField.mogoDrawList=[];
    for(let i=0;i<6;i++){
      for(let j=0;j<mfSave.zoneMogos[i].length;j++){
        if(!(mfSave.zoneMogos[i][j]===null)){
          if(!(mfSave.zoneMogos[i][j].id===null)){
            //console.log(i+", "+j);
            //console.log(mfSave.zoneMogos[i][j].id)
            matchField.zoneMogos[i][j]=matchField.mogos[mfSave.zoneMogos[i][j].id];
            matchField.zoneMogos[i][j].zone=i;
          }
        }
        //matchField.zoneMogos[i][j]=matchField.mogos[mfSave.zoneMogos[i][j].id];
        //matchField.zoneMogos[i][j]=matchField.mogos[mfSave.zoneMogos[i][j].id];
      }
    }
    matchField.updateMogoList();
    //matchField.scoreField();
  }
  }
  catch{
    console.log("Match Loading Failed")
  }

  fields[1]=matchField;
  try{
  let sfSave=getItem('skillsFieldSave');
  //console.log(sfSave);
  if(!(sfSave===null)){
    for(let i=0;i<7;i++){
      skillsField.mogos[i].rings=sfSave.mogos[i].rings;
      skillsField.platButtons[0].toggled=sfSave.platButtons[0].toggled;
      skillsField.platButtons[1].toggled=sfSave.platButtons[1].toggled;
      skillsField.platButtons[2].textA=sfSave.platButtons[2].textA;
      skillsField.platButtons[3].textA=sfSave.platButtons[3].textA;
    }
    skillsField.zoneMogos=[[],[],[],[],[],[]];
    for(let i=0;i<6;i++){
      for(let j=0;j<sfSave.zoneMogos[i].length;j++){
        if(!(sfSave.zoneMogos[i][j]===null)){
          if(!(sfSave.zoneMogos[i][j].id===null)){
            console.log(i+", "+j);
            console.log(sfSave.zoneMogos[i][j].id)
            skillsField.zoneMogos[i][j]=skillsField.mogos[sfSave.zoneMogos[i][j].id];
          }
        }
      }
    }
    skillsField.updateMogoList();
    //skillsField.scoreField();
  }
  }
  catch{
    console.log("Skills Loading Failed")
  }

  fields[2]=skillsField;

  try{
  let rfSave=getItem('remoteFieldSave');
  if(!(rfSave===null)){
    for(let r=0;r<2;r++){
      for(let i=0;i<7;i++){
        lrt.rFields[r].mogos[i].rings=rfSave.rFields[r].mogos[i].rings;
        lrt.rFields[r].awp.toggled=rfSave.rFields[r].awp.toggled;
        lrt.rFields[r].platButtons[0].toggled=rfSave.rFields[r].platButtons[0].toggled;
        lrt.rFields[r].platButtons[1].toggled=rfSave.rFields[r].platButtons[1].toggled;
        lrt.rFields[r].platButtons[2].textA=rfSave.rFields[r].platButtons[2].textA;
        lrt.rFields[r].platButtons[3].textA=rfSave.rFields[r].platButtons[3].textA;
      }
      lrt.rFields[r].zoneMogos=[[],[],[],[],[],[]];
      for(let i=0;i<6;i++){
        for(let j=0;j<rfSave.rFields[r].zoneMogos[i].length;j++){
          if(!(rfSave.rFields[r].zoneMogos[i][j]===null)){
            if(!(rfSave.rFields[r].zoneMogos[i][j].id===null)){
              //console.log(i+", "+j);
              //console.log(sfSave.zoneMogos[i][j].id)
              lrt.rFields[r].zoneMogos[i][j]=lrt.rFields[r].mogos[rfSave.rFields[r].zoneMogos[i][j].id];
            }
          }
        }
      }
    }
    lrt.autonWinner=rfSave.autonWinner;
    lrt.lrtAuton.toggled=true;
  }
  }
  catch{
    console.log("Remote Loading Failed")
  }

  lrt.rFields[0].updateMogoList();
  lrt.rFields[1].updateMogoList();
  fields[4]=lrt.rFields[0];
  fields[5]=lrt.rFields[1];


  if(appState==1)matchField.scoreField();
  else if(appState==2)skillsField.scoreField();
  else if(appState==3)lrt.scoreLRT();

  disableHover=isTouchDevice();
  //console.log(disableHover);
  //windowResized();
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if(width/375.0>height/667.0)screenScale=height/667.0;
  else screenScale=width/375.0;
}

function draw(){

  checkClicked();

  if(pMouseX!=mouseX||pMouseY!=mouseY||mouseIsPressed||postClick!=0){
  background(40,40,45);
  push();
  translate(width*0.5,height*0.5);
  //scale(screenScale);
  if(appState!=0&&!warningExit.toggled){
    warningExit.updateButton();
    if(warningExit.clicked)storeItem('warnedSave',true);
    warningButton.updateButton();
    initialDragging=false;
    dragging=false;
  }
  if(!manualShort.toggled){
  if(mogoSelected!=5&&!tmScreen.toggled&&(appState==1||appState==2)&&warningExit.toggled){
    tmScreen.updateButton();
  }
  if(appState==0){  //Main Menu
    updateMenu();
  }
  else if(appState==1){ //Match
    updateMatch();
    //textFont(regular, 30);
    fill(230,230,240);
    noStroke();
    scaledText("Match", 0,-302,regular,30);

  }
  else if(appState==2){ //Skills
    updateSkills();
    //textFont(regular, 30);
    fill(230,230,240);
    noStroke();
    scaledText("Skills", 0,-302,regular,30);
  }
  else if(appState==3){ //Remote
    updateRemote();
    //textFont(regular, 30);
    fill(230,230,240);
    noStroke();
    scaledText("Remote", 0,-302,regular,30);
  }
  else if(appState==4){
    //textFont(regular, 30);
    fill(230,230,240);
    noStroke();
    scaledText("Info", 0,-302,regular,30);
    fill(100,100,110);
    //textSize(15);
    scaledText("Version "+version,0,290,regular,15);
    updateInfo();
  }
  else if(appState==5){
    //textFont(regular, 30);
    fill(230,230,240);
    noStroke();
    scaledText("Settings", 0,-302,regular,30);
    updateSettings();
  }
  }
  if(appState==6||manualShort.toggled){
    fill(230,230,240);
    noStroke();
    scaledText("Manual", 0,-302,regular,30);
    updateManual();
  }
  if(appState!=0&&!warningExit.toggled){
    //fill(red.dark5);
    //noStroke();
    //rect(0,43-7.5,340,667-86-15);
    warningButton.drawButton();
    warningExit.drawButton();
    //textFont(bold,30);
    fill(230,230,240);
    noStroke();
    scaledText("WARNING!",0,-170,bold,30);
  }

  if(appState!=0){
    if(appState<=3&&!manualShort.toggled){
      manualShort.updateButton();
      //drawManual(manualShort.x,manualShort.y);
    }

    backButton.updateButton();

    if(mogoSelected==5)smallBack.updateButton();
    else mediumBack.updateButton();
    //else largeBack.updateButton();
    if(backButton.clicked||smallBack.clicked||mediumBack.clicked){//||largeBack.clicked){
      if(manualShort.toggled)manualShort.toggled=false;
      else if(tmScreen.toggled)tmScreen.toggled=false;
      else if(remoteFieldSelected!=0&&mogoSelected==-1)lrt.fieldButtons[remoteFieldSelected-1].toggled=false;
      else if(mogoSelected==-1)appState=0;
      else mogoSelected=-1;
      storeItem('appSave',appState)
    }
    smallBack.clicked=false;
    mediumBack.clicked=false;
    //largeBack.clicked=false;
  }

  pop();
  if(settingButtons[3].toggled){
    //noStroke();
    stroke(40,40,45);
    strokeWeight(3);
    fill(green.medium);
    //ellipse(mouseX,mouseY,30,30);
    textFont(regular,18);
    let xPos=mouseX;
    let yPos=mouseY;
    if(xPos<80)xPos+=80;
    else if(xPos>width-80)xPos-=80;
    if(yPos>height-60)yPos-=20;
    else yPos+=30;
    text("X:"+int(translatedMouseX*10)/10+", Y:"+int(translatedMouseY*10)/10,xPos,yPos);
    fill(purple.light2);
    for(let i=0;i<touches.length;i++){
      ellipse(touches[i].x,touches[i].y,40,40)
    }
  }
}
//else console.log("no draw");
  pMouseX=mouseX;
  pMouseY=mouseY;
  if(clickAnimation>0){
    //stroke(red.medium);
    fill(40,40,45);
    ellipse(mouseX,mouseY,40-clickAnimation,40-clickAnimation);
    if(animationTrigger==1)fill(230,40,40,500*clickAnimation/40.0);
    else if(animationTrigger==0)fill(40,230,40,500*clickAnimation/40.0);
    noStroke();
    ellipse(mouseX,mouseY,40-clickAnimation,40-clickAnimation)
    clickAnimation-=2;
  }
}

/*
function touchMoved(){
  if(settingButtons[3].toggled){
    fill(purple.light3);
    noStroke();
    ellipse(mouseX,mouseY,30,30);
  }
}
*/

function mouseClicked(){
  if((appState==6||manualShort.toggled)&&!disableHover){
    //if(disableHover){
    if(manualButtons[0].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Game-Manual","_blank");
    else if(manualButtons[1].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-A","_blank");
    else if(manualButtons[2].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-B","_blank");
    else if(manualButtons[3].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-C","_blank");
    else if(manualButtons[4].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-D","_blank");
    else if(manualButtons[5].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-E","_blank");
  //}
    //clickAnimation=30;
    //animationTrigger=0;
  }
}

function touchEnded(){
  if((appState==6||manualShort.toggled)&&disableHover){
    //if(disableHover){
    if(manualButtons[0].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Game-Manual","_blank");
    else if(manualButtons[1].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-A","_blank");
    else if(manualButtons[2].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-B","_blank");
    else if(manualButtons[3].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-C","_blank");
    else if(manualButtons[4].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-D","_blank");
    else if(manualButtons[5].hover)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-E","_blank");
  //}
    //clickAnimation=30;
    //animationTrigger=1;
  }
}

function checkClicked(){
  //if(mouseX>width*0.5+(this.x-this.w*0.5)*screenScale&&mouseX<width*0.5+(this.x+this.w*0.5)*screenScale&&mouseY>height*0.5+(this.y-this.h*0.5)*screenScale&&mouseY<height*0.5+(this.y+this.h*0.5)*screenScale){
    translatedMouseX=(mouseX-width*0.5)/screenScale;
    translatedMouseY=(mouseY-height*0.5)/screenScale;


  //if(dragging)console.log("dragging");
  if(mouseIsPressed&&!held){
    pressX=translatedMouseX;
    pressY=translatedMouseY;
  }

  click = false;
  if(postClick!=0)postClick=(postClick+1)%3;
  if (!mouseIsPressed && held &&!dragging) click = true;
  held = mouseIsPressed;
  if(click)postClick=1;

  initialDragging=false;
  finalDragging=false;
  if(!click&&held&&((abs(pressX-translatedMouseX)>3||abs(pressY-translatedMouseY)>2)||dragging)){
    if(!dragging){
      initialDragging=true;
    }
    dragging=true;
  }
  else {
    if(dragging){
      finalDragging=true;
      postClick=1;
    }
    dragging=false;
  }
}

function drawManual(x,y){
  push();
  translate(x*screenScale,(y+1)*screenScale);
  scale(0.8);
  stroke(230,230,240);
  noFill();
  scaledArc(-7.5,-13,15,5,PI+0.2,TWO_PI-0.5,3);
  scaledArc(7.5,-13,15,5,PI+0.5,TWO_PI-0.2,3);
  scaledArc(-7.5,14.5,15,5,PI+0.2,TWO_PI-0.5,3);
  scaledArc(7.5,14.5,15,5,PI+0.5,TWO_PI-0.2,3);
  scaledLine(-15,-13,-15,13);
  scaledLine(15,-13,15,13);
  scaledArc(-7.5,-4,10,5,PI+0.8,TWO_PI-0.8,2);
  scaledArc(7.5,-4,10,5,PI+0.8,TWO_PI-0.8,2);
  scaledArc(-7.5,6,10,5,PI+0.8,TWO_PI-0.8,2);
  scaledArc(7.5,6,10,5,PI+0.8,TWO_PI-0.8,2);
  scaledLine(0,-15,0,13);
  pop();
}


function scaledRect(x,y,w,h,a,b,c,d,s){
  strokeWeight(s*screenScale);
  rect(x*screenScale,y*screenScale,w*screenScale,h*screenScale,a*screenScale,b*screenScale,c*screenScale,d*screenScale);
}

function simpleRect(x,y,w,h){
  rect(x*screenScale,y*screenScale,w*screenScale,h*screenScale);
}

function scaledText(t,x,y,font,size){
  try{
    textFont(font,size*screenScale);
  }
  catch{
    textFont(bold,size*screenScale);
    stroke(green.medium);
  }
  text(t,x*screenScale,y*screenScale);
}

function scaledEllipse(x,y,w,h,s){
  strokeWeight(s*screenScale);
  ellipse(x*screenScale,y*screenScale,w*screenScale,h*screenScale);
}

function scaledLine(x1,y1,x2,y2){
  line(x1*screenScale,y1*screenScale,x2*screenScale,y2*screenScale)
}

function scaledArc(x,y,w,h,a,b,s){
  strokeWeight(s*screenScale);
  arc(x*screenScale,y*screenScale,w*screenScale,h*screenScale,a,b);
}

function updateMenu(){
  //textFont(regular,30);
  fill(200);
  noStroke();
  scaledText("Tipping Point\nScoring App",0,-265,regular,30);
  //textFont(regular,15);
  //fill(150);
  //text("By Chris Reimer",0,-200);
  //textFont(regular,20);
  fill(red.dark1);
  scaledText("BETA "+version,0,-200,regular,20);
  for(let i=0;i<6;i++){
    menuButtons[i].updateButton();
    if(menuButtons[i].clicked)appState=i+1;
    storeItem('appSave',appState)
  }
  backButton.updateButton();
  if(backButton.clicked){
    //storeItem('fieldsSave',fields);
    window.open("/index.html","_self");
  }
  image(gear,155*screenScale,-300*screenScale,40*screenScale,40*screenScale);
}

function updateMatch(){
  matchField.updateField();
  drawManual(manualShort.x,manualShort.y);
}

function updateSkills(){
  skillsField.updateField();
  drawManual(manualShort.x,manualShort.y);
}

function updateRemote(){
  lrt.updateLRT();
  drawManual(manualShort.x,manualShort.y);
}

function updateInfo(){
  fill(180,180,190);
  //textSize(17);
  scaledText("This app is still in development,\nand may require you to manually\nclear the cache to be updated.\n\nThis site is a Progressive Web App,\nand can be downloaded to the\nhome screen using the share\nbutton on iOS, or through the\npop-up window on Android.\n\nBugs and Suggestions\ncan be submitted in\nour discord server.",0,-110,regular,17);
  linkButtons[0].updateButton();
  if(linkButtons[0].clicked){
    window.open("https://discord.gg/PFMRPrhdmQ");
  }
}

function updateSettings(){
  for(let i=0;i<settingButtons.length;i++){
    settingButtons[i].updateButton();
  }
  fill(210,210,220);
  //textFont(regular,13);
  scaledText("One ring counter per branch,\nor one per level",0,-135+12,regular,13);
  //text("Side that the counters are one",0,-45+15);
  scaledText("Show rings and poles, or\njust sum of ring points",0,45+12,regular,13);

  if(settingButtons[0].clicked)storeItem('counterSave',settingButtons[0].toggled);
  if(settingButtons[1].clicked)storeItem('cSideSave',settingButtons[1].toggled);
  if(settingButtons[2].clicked)storeItem('ringSave',settingButtons[2].toggled);
}

function updateManual(){
  if(disableHover&&click){
    //animationTrigger=1;
    //clickAnimation=30;
  }
  for(let i=0;i<manualButtons.length;i++){
    manualButtons[i].updateButton();
  }
  fill(210,210,220);
  scaledText("Version 1.1",0,-170+27,regular,13);

/*
  if(disableHover){
  if(manualButtons[0].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Game-Manual","_self");
  else if(manualButtons[1].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-A","_blank");
  else if(manualButtons[2].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-B","_blank");
  else if(manualButtons[3].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-C","_blank");
  else if(manualButtons[4].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-D","_blank");
  else if(manualButtons[5].clicked)window.open("https://link.vex.com/docs/21-22/vrc/tipping-point/Appendix-E","_blank");
  }
*/
}


class Button{
  constructor(x_,y_,w_,h_,textA_){
  this.x=x_;
  this.y=y_;
  this.w=w_;
  this.h=h_;
  this.textA=textA_;  //A=normal, B=toggled
  this.textB;
  this.strokeA=color(0,0);
  this.strokeB=color(0,0);
  this.textColor=color(230,230,240);

  this.type=1;  //Type 1 = trigger, Type 2 = toggle

  this.tSize=int(this.h*0.2);;
  this.sWeight=3;
  this.hover=false;
  this.toggled=false; //Stays true when button is set on
  this.clicked=false; //Only true for initial click of button
  this.fillA=color(50,50,55);
  this.fillA2=color(45,45,50);
  this.fillB=color(50,50,55);
  this.fillB2=color(45,45,50);

  this.corners=[15,15,15,15]
  this.yOffset=4;
  }

  updateButton(){
    this.hover=false;
    this.clicked=false;
    if(mouseX>width*0.5+(this.x-this.w*0.5)*screenScale&&mouseX<width*0.5+(this.x+this.w*0.5)*screenScale&&mouseY>height*0.5+(this.y-this.h*0.5)*screenScale&&mouseY<height*0.5+(this.y+this.h*0.5)*screenScale){
      this.hover=true;
      if(click){
        this.clicked=true;
        click=false;
      }
    }
    if(this.clicked&&this.type==2)this.toggleButton();
    this.drawButton();
  }

  toggleButton(){
    if(this.toggled)this.toggled=false;
    else this.toggled=true;
  }

  setExtraData(type_,textB_,tSize_){
    this.type=type_;
    this.textB=textB_;
    this.tSize=tSize_;
  }

  setColors(fillA_,fillA2_,fillB_,fillB2_,strokeA_,strokeB_,textColor_){
    if(fillA_!=0)this.fillA=fillA_;
    if(fillB_!=0)this.fillB=fillB_;
    if(fillA2_!=0)this.fillA2=fillA2_;
    if(fillB2_!=0)this.fillB2=fillB2_;
    if(strokeA_!=0)this.strokeA=strokeA_;
    if(strokeB_!=0)this.strokeB=strokeB_;
    if(textColor_!=0)this.textColor=textColor_;
  }

  drawButton(){
    //textFont(regular,this.tSize);
    //strokeWeight(this.sWeight);
    if(this.toggled&&this.type==2){
      if(this.hover&&(!disableHover||mouseIsPressed)){
        fill(this.fillB2);
        if(this.fillB2==color(0,0))noFill();
      }
      else{
        fill(this.fillB);
        if(this.fillB==color(0,0))noFill();
      }
      if(this.strokeB==color(0,0))noStroke();
      else stroke(this.strokeB);
      if(this.hover&&settingButtons[3].toggled)stroke(purple.dark2);
      scaledRect(this.x,this.y,this.w,this.h,this.corners[0],this.corners[1],this.corners[2],this.corners[3],this.sWeight)
      //rect(this.x,this.y,this.w,this.h,this.corners[0],this.corners[1],this.corners[2],this.corners[3]);
      fill(this.textColor);
      noStroke();
      scaledText(this.textB,this.x,this.y-this.yOffset,regular,this.tSize)
      //text(this.textB,this.x,this.y-this.yOffset);
    }
    else{
      if(this.hover&&(!disableHover||mouseIsPressed)){
        fill(this.fillA2);
        if(this.fillA2==color(0,0))noFill();
      }
      else{
        fill(this.fillA);
        if(this.fillA==color(0,0))noFill();
      }
      if(this.strokeA==color(0,0))noStroke();
      else stroke(this.strokeA);
      if(this.hover&&settingButtons[3].toggled)stroke(green.dark2);
      //rect(this.x,this.y,this.w,this.h,this.corners[0],this.corners[1],this.corners[2],this.corners[3]);
      scaledRect(this.x,this.y,this.w,this.h,this.corners[0],this.corners[1],this.corners[2],this.corners[3],this.sWeight)
      fill(this.textColor);
      noStroke();
      //text(this.textA,this.x,this.y-this.yOffset);
      scaledText(this.textA,this.x,this.y-this.yOffset,regular,this.tSize)
    }
  }

}



class mogoNode{
  constructor(x_,y_,id_){
    this.x=x_;
    this.y=y_;
    this.id=id_;
    this.zone=floor(this.id/7);
    this.mogoID=-1;
  }
  drawNode(){
    //if(this.zone==1||this.zone==0)fill(240,60,60,60);
    fill(30,240,30,60);
    noStroke();
    rect(this.x,this.y,60,50,15);
    fill(240,80);
    text(this.id,this.x,this.y-3)
  }
}



class Field{
  constructor(){
    this.mogos=[];
    this.zoneMogos=[[],[],[],[],[],[]] //0=Red Platform, 1=Red Home Zone, 2=Neutral Zone, 3=Blue Home Zone, 4=Blue Platform, 5=Out of Field
    this.draggedMogo=-1;
    this.mogoDrawList=[];
    this.parkedBots; //1=Red Bots Parked, 2=Blue Bots Parked
    this.scoredRings=[[0,0,0],[0,0,0],[0,0,0]]//[0=lrt,1=red,2=blue][0=base,1=low pole,2=high pole]
    this.totalRings=0;
    this.scoredHomeZone=[0,0,0];//0=lrt,1=red,2=blue
    this.scoredPlatform=[0,0,0];
    this.platforms=[];
    this.parked=new Button(-130,246,58,118,">");
    this.parked.type=2;
    this.parked.textB="<";
    this.parked.sWeight=4;
    this.parked.setColors(0,0,0,0,0,color(50,50,55),0);
    //this.parked.strokeB=color(50,50,55);
    this.auton=new Button(-27,246,122-6,120,"Auton:\nTied");
    this.auton.sWeight=10;
    this.awp=new Button(-27,246,122-6,120,"AWP:\nNo");
    this.awp.setExtraData(2,"AWP:\nYes",25);
    this.awp.setColors(0,0,0,0,0,color(210,210,220),0);
    this.reset=new Button(102,246,122-6,120,"FIELD\nRESET");
    this.skillsReset=new Button(130,246,60,120,"")

    this.platButtons=[];
    this.platButtons[0]=new Button(-102,246-32.5,122-6,55,"Unbalanced");
    this.platButtons[0].setExtraData(2,"Balanced",15);
    this.platButtons[0].setColors(0,0,0,0,0,red.light2,red.light2);
    this.platButtons[0].yOffset=2;
    this.platButtons[1]=new Button(-102,246+32.5,122-6,55,"Unbalanced");
    this.platButtons[1].setExtraData(2,"Balanced",15);
    this.platButtons[1].yOffset=2;
    this.platButtons[1].setColors(0,0,0,0,0,blue.light2,blue.light2);
    this.platButtons[2]=new Button(27-32.5,246+32.5,52.5,52.5,0);
    this.platButtons[2].tSize=30;
    //this.platButtons[2].setColors(red.dark3,red.dark4,0,0,0,0,0);
    //this.platButtons[2].setColors(0,0,0,0,red.light1,0,red.light1);
    //this.platButtons[2].setColors(0,0,0,0,red.light1,0,0);
    this.platButtons[2].setColors(0,0,0,0,color(0,0),0,red.light2);
    this.platButtons[3]=new Button(27+32.5,246+32.5,52.5,52.5,0);
    this.platButtons[3].tSize=30;
    //this.platButtons[3].setColors(blue.dark3,blue.dark4,0,0,0,0,0);
    //this.platButtons[3].setColors(0,0,0,0,blue.light1,0,blue.light1);
    //this.platButtons[3].setColors(0,0,0,0,blue.light1,0,0);
    this.platButtons[3].setColors(0,0,0,0,0,0,blue.light2);
    this.platButtons[4]=new Button(27,246+32.5,55*2+5,55,0)
    this.platButtons[4].tSize=30;

    //Nodes set the position of the mogos depending on which zone they are in, and how many mogos are in that zone.

    this.nodes=[[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]]];

    this.nodes[0][0][0]=new mogoNode(-125,0,0);

    this.nodes[0][1][0]=new mogoNode(-125,-30,0);
    this.nodes[0][1][1]=new mogoNode(-125,30,1);

    this.nodes[0][2][0]=new mogoNode(-125,-45,0);
    this.nodes[0][2][1]=new mogoNode(-125,0,1);
    this.nodes[0][2][2]=new mogoNode(-125,45,2);

    this.nodes[0][3][0]=new mogoNode(-97,-25-12,0);
    this.nodes[0][3][1]=new mogoNode(-97,25-12,1);
    this.nodes[0][3][3]=new mogoNode(-153,25+12,3);
    this.nodes[0][3][2]=new mogoNode(-153,-25+12,2);

    this.nodes[0][4][0]=new mogoNode(-97,-45,0);
    this.nodes[0][4][1]=new mogoNode(-97,0,1);
    this.nodes[0][4][4]=new mogoNode(-97,45,4);
    this.nodes[0][4][2]=new mogoNode(-153,-25,2);
    this.nodes[0][4][3]=new mogoNode(-153,25,3);

    this.nodes[0][5][0]=new mogoNode(-97,-45,0);
    this.nodes[0][5][1]=new mogoNode(-97,0,1);
    this.nodes[0][5][4]=new mogoNode(-97,45,4);
    this.nodes[0][5][2]=new mogoNode(-153,-45,2);
    this.nodes[0][5][3]=new mogoNode(-153,0,3);
    this.nodes[0][5][5]=new mogoNode(-153,45,5);

    this.nodes[0][6][0]=new mogoNode(-97,-45,0);
    this.nodes[0][6][1]=new mogoNode(-97,0,1);
    this.nodes[0][6][4]=new mogoNode(-97,45,4);
    this.nodes[0][6][2]=new mogoNode(-153,-45*1.5,2);
    this.nodes[0][6][3]=new mogoNode(-153,-45*0.5,3);
    this.nodes[0][6][5]=new mogoNode(-153,45*0.5,5);
    this.nodes[0][6][6]=new mogoNode(-153,45*1.5,6);

/*
    this.nodes[1][0][0]=new mogoNode(-125,-95,0);

    this.nodes[1][1][0]=new mogoNode(-125,-95,0);
    this.nodes[1][1][1]=new mogoNode(-80,133,1);

    this.nodes[1][2][0]=new mogoNode(-125,-95,0);
    this.nodes[1][2][1]=new mogoNode(-80,133,1);
    this.nodes[1][2][2]=new mogoNode(-75,-133,2);

    this.nodes[1][3][0]=new mogoNode(-125,-95,0);
    this.nodes[1][3][1]=new mogoNode(-80,133,1);
    this.nodes[1][3][2]=new mogoNode(-75,-133,2);
    this.nodes[1][3][3]=new mogoNode(-130,95,3);

    this.nodes[1][4][0]=new mogoNode(-125,-95,0);
    this.nodes[1][4][1]=new mogoNode(-80,133,1);
    this.nodes[1][4][2]=new mogoNode(-75,-133,2);
    this.nodes[1][4][3]=new mogoNode(-130,95,3);
    this.nodes[1][4][4]=new mogoNode(-60,0,4);

    this.nodes[1][5][0]=new mogoNode(-125,-95,0);
    this.nodes[1][5][1]=new mogoNode(-80,133,1);
    this.nodes[1][5][2]=new mogoNode(-75,-133,2);
    this.nodes[1][5][3]=new mogoNode(-130,95,3);
    this.nodes[1][5][4]=new mogoNode(-60,-85*0.5,4);
    this.nodes[1][5][5]=new mogoNode(-60,85*0.5,5);
    */

    this.nodes[1][6][0]=new mogoNode(-125,-95,0);
    this.nodes[1][6][1]=new mogoNode(-80,133,1);
    this.nodes[1][6][2]=new mogoNode(-75,-133,2);
    this.nodes[1][6][3]=new mogoNode(-130,95,3);
    this.nodes[1][6][4]=new mogoNode(-60,-65,4);
    this.nodes[1][6][5]=new mogoNode(-60,0,5);
    this.nodes[1][6][6]=new mogoNode(-60,65,6);

    this.nodes[2][0][0]=new mogoNode(0,0,0);

    this.nodes[2][1][0]=new mogoNode(0,-50,0);
    this.nodes[2][1][1]=new mogoNode(0,50,1);

    this.nodes[2][2][0]=new mogoNode(0,-100,0);
    this.nodes[2][2][1]=new mogoNode(0,0,1);
    this.nodes[2][2][2]=new mogoNode(0,100,2);

    this.nodes[2][3][0]=new mogoNode(0,-110,0);
    this.nodes[2][3][1]=new mogoNode(0,-37,1);
    this.nodes[2][3][2]=new mogoNode(0,37,2);
    this.nodes[2][3][3]=new mogoNode(0,110,3);

    this.nodes[2][4][0]=new mogoNode(25,-115,0);
    this.nodes[2][4][1]=new mogoNode(-25,-60,1);
    this.nodes[2][4][2]=new mogoNode(25,0,2);
    this.nodes[2][4][3]=new mogoNode(-25,60,3);
    this.nodes[2][4][4]=new mogoNode(25,115,4);

    this.nodes[2][5][0]=new mogoNode(25,-125,0);
    this.nodes[2][5][1]=new mogoNode(-25,-75,1);
    this.nodes[2][5][2]=new mogoNode(25,-25,2);
    this.nodes[2][5][3]=new mogoNode(-25,25,3);
    this.nodes[2][5][4]=new mogoNode(25,75,4);
    this.nodes[2][5][5]=new mogoNode(-25,125,5);

    this.nodes[2][6][0]=new mogoNode(25,-135,0);
    this.nodes[2][6][1]=new mogoNode(-25,-90,1);
    this.nodes[2][6][2]=new mogoNode(25,-45,2);
    this.nodes[2][6][3]=new mogoNode(-25,0,3);
    this.nodes[2][6][4]=new mogoNode(25,45,4);
    this.nodes[2][6][5]=new mogoNode(-25,90,5);
    this.nodes[2][6][6]=new mogoNode(25,135,6);

    for(let j=0;j<=6;j++){
      this.nodes[3][6][j]=new mogoNode(this.nodes[1][6][j].x*-1,this.nodes[1][6][j].y*-1,j);
      if(j==0||j==1)this.nodes[3][6][j].y-=5;
    }
    for(let i=0;i<7;i++){
      for(let j=0;j<=i;j++){
        this.nodes[4][i][j]=new mogoNode(this.nodes[0][i][j].x*-1,this.nodes[0][i][j].y*-1,j);
      }
    }

    this.nodes[5][6][0]=new mogoNode(-150,-188,0);
    this.nodes[5][6][1]=new mogoNode(-100,-188,1);
    this.nodes[5][6][2]=new mogoNode(-50,-188,2);
    this.nodes[5][6][3]=new mogoNode(0,-188,3);
    this.nodes[5][6][4]=new mogoNode(50,-188,4);
    this.nodes[5][6][5]=new mogoNode(100,-188,5);
    this.nodes[5][6][6]=new mogoNode(150,-188,6);

    for(let i=0;i<6;i++){
      for(let j=0;j<=i;j++){
        this.nodes[5][i][j]=new mogoNode(this.nodes[5][6][j].x,this.nodes[5][6][j].y,j);
      }
    }





    this.autonWinner=0; //0=Tied, 1=Red, 2=Blue
    this.scores=[0,0,0,0];//1=Red, 2=Blue, 3=Skills,0=Saved skills
    this.zonePoints=[0,0,0];
  }


  updateField(){

    if(postClick==2)this.scoreField();
    if(tmScreen.toggled){
      this.drawTMScreen();
    }

    if(mogoSelected==-1&&!tmScreen.toggled){ //Main Field Screen

      this.drawField();

      let highlight=-1;
      if(dragging&&this.draggedMogo!=-1){
        highlight=this.mogos[this.draggedMogo].findZone();
        noStroke();
        fill(30,240,30,30);
        if(highlight==1){
          scaledRect(-125.5,0,64,138,0,0,0,0,0);
        }
        else if(highlight==3){
          scaledRect(125.5,0,64,138,0,0,0,0,0);
        }
        else if(highlight==5){
          strokeWeight(1*screenScale);
          for(let y=0;y<100;y++){
            stroke(30,240,30,40-y/80.0*80);
            scaledLine(-145,-162.5-y,145,-162.5-y);
          }
        }
      }

      for(let i=0;i<this.platforms.length;i++){
       this.platforms[i].drawPlatform();
      }

        for(let i=0;i<7&&initialDragging;i++){
          this.mogos[i].checkDragged();
        }
        //console.log(this.draggedMogo);

      if(dragging&&this.draggedMogo!=-1){
        //let highlight=this.mogos[this.draggedMogo].findZone();
        fill(30,240,30,60);
        noStroke();
        if(highlight==0){
          scaledRect(-125.5,0,64,138,0,0,0,0,0);
        }
        else if(highlight==1){
          scaledRect(-125.5,-113,64,88,12,0,0,0,0)
          scaledRect(-125.5,113,64,88,0,0,0,12,0)
          //rect(-125.5,0,64,314,12,0,0,12);
          scaledRect(-73.25,0,40.5,314,0,0,0,0,0)
        }
        else if(highlight==2){
          scaledRect(0,0,106,314,0,0,0,0,0)
        }
        else if(highlight==3){
          scaledRect(125.5,-113,64,88,0,12,0,0,0)
          scaledRect(125.5,113,64,88,0,0,12,0,0)
          scaledRect(73.25,0,40.5,314,0,0,0,0,0)
        }
        else if(highlight==4){
          scaledRect(125.5,0,64,138,0,0,0,0,0);
        }

      }

      if(finalDragging&&this.draggedMogo!=-1){
        this.mogos[this.draggedMogo].setZone();
        this.draggedMogo=-1;
      }

      for(let i=0;i<this.mogoDrawList.length;i++){
        this.mogoDrawList[i].drawMogo();
      }

      fill(40,40,45);
      noStroke();
      //rect(0,-280*screenScale,width,160*screenScale)

      if(this.draggedMogo!=-1)this.mogos[this.draggedMogo].drawMogo();
      for(let i=0;i<this.nodes[5][6].length;i++){
        //this.nodes[5][6][i].drawNode();
      }

      if(this.parked.toggled||appState==2){
        fill(30,30,35);
        stroke(30,30,35);
        //strokeWeight(20);
        if(appState!=2)scaledRect(0,246,320,120,15,15,15,15,20);

        //strokeWeight(3);
        noFill();
        if(appState==2){
          stroke(40,40,45);
        }
        else stroke(30,30,35);
        scaledRect(27-32.5,246+32.5,55,55,15,15,15,15,3);
        scaledRect(27+32.5,246+32.5,55,55,15,15,15,15,3);

        if(this.platButtons[2].textA>0){
          stroke(red.light2);
          fill(red.light2);
          scaledRect(27-32.5,246+32.5,55,55,15,15,15,15,3);
        }
        if(this.platButtons[2].textA<2&&appState!=3){
          //stroke(30,30,35);
          if(appState==2)
          {
              stroke(40,40,45);
              fill(40,40,45);
          }
          else{
            stroke(30,30,35);
            fill(30,30,35);
          }
          //strokeWeight(5);
          scaledRect(27-32.5+13.75+0.75,246+32.5,26,55,0,15,15,0)
        }

        if(this.platButtons[3].textA>0){
          stroke(blue.light2);
          fill(blue.light2);
          //strokeWeight(3);
          scaledRect(27+32.5,246+32.5,55,55,15,15,15,15,3);
        }
        if(this.platButtons[3].textA<2&&appState!=3){
          if(appState==2)
          {
              stroke(40,40,45);
              fill(40,40,45);
          }
          else{
            stroke(30,30,35);
            fill(30,30,35);
          }
          //strokeWeight(5);
          scaledRect(27+32.5+13.75+0.75,246+32.5,26,55,0,15,15,0,5)
        }

        for(let i=0;i<4;i++){
          this.platButtons[i].updateButton();
          if(i>1){
            if(this.platButtons[i].clicked)this.platButtons[i].textA=(this.platButtons[i].textA+1)%3;
            if(appState==2&&this.platButtons[2].textA+this.platButtons[3].textA>=3){
              this.platButtons[i+1-2*floor(i/3.0)].textA--;
            }
          }
        }
        if(appState==3&&(this.platButtons[2].clicked||this.platButtons[3].clicked)){
          if(this.platButtons[2].clicked){
            if(this.platButtons[2].textA==2)this.platButtons[2].textA=0;
            else if(this.platButtons[2].textA==1)this.platButtons[3].textA=0;
          }
          else if(this.platButtons[3].clicked){
            if(this.platButtons[3].textA==2)this.platButtons[3].textA=0;
            else if(this.platButtons[3].textA==1)this.platButtons[2].textA=0;
          }
        }
        fill(230,230,240);
        //textFont(regular,20);
        noStroke();
        scaledText("Robots:",27,246-32.5,regular,20);
      }
      else{
        //stroke(30,30,35);
        //strokeWeight(4);
        //fill(30,30,35);
        //fill(50,50,55);
        noStroke();
        //rect(-130,246,65,125,17.5);
        if(this.platButtons[0].toggled){
          fill(red.light1);
          scaledRect(-130,246-31.25,65,62.5,17.5,17.5,0,0,0);
        }
        if(this.platButtons[1].toggled){
          fill(blue.light1);
          scaledRect(-130,246+31.25,65,62.5,0,0,17.5,17.5,0);
        }
      }
      if(appState!=2)this.parked.updateButton();
      if(!this.parked.toggled&&appState!=2){
        noStroke();
        fill(red.light1);
        //textFont(bold,20);
        scaledText(this.platButtons[2].textA,-130,246-35-3,bold,20);
        fill(blue.light2);
        scaledText(this.platButtons[3].textA,-130,246+35-3,bold,20);

        if(appState==1){
          this.auton.updateButton();
        }
        else if(appState==3){
          this.awp.updateButton();
        }
        this.reset.updateButton();
      }
      if(appState==2){
        this.skillsReset.updateButton();
        this.resetIcon();
      }
      if(this.parked.clicked){
        this.parked.x*=-1;
      }

      //if(warningExit.toggled)hideRings.updateButton();

      if(this.reset.clicked||this.skillsReset.clicked)this.resetField();
      if(appState==1){
        if(this.auton.clicked||this.auton.toggled){
          if(this.auton.clicked)this.autonWinner=(this.autonWinner+1)%3;
          this.auton.toggled=false;
          if(this.autonWinner==0){
            this.auton.strokeA=color(0,0);
            this.auton.textColor=color(230,230,240);
            this.auton.textA="Auton:\nTied";
          }
          else if(this.autonWinner==1){
            this.auton.strokeA=red.light2;
            this.auton.textColor=red.light2;
            this.auton.textA="Auton:\nRed";
          }
          else if(this.autonWinner==2){
            this.auton.strokeA=blue.light2;
            this.auton.textColor=blue.light2;
            this.auton.textA="Auton:\nBlue";
          }
        }
      }
    }
    else if(mogoSelected>=0&&!tmScreen.toggled){
      this.mogos[mogoSelected].editMogo();
    }
    if(mogoSelected!=5){
      this.displayScores();
      if(!tmScreen.toggled&&appState!=3)this.drawRingCounter();
    }
  }

  drawTMScreen(){
    noFill();
    stroke(100,100,110);
    strokeWeight(5*screenScale);
    /*
    line(-95-60,-22,-95+60,-22);
    line(95-60,-22,95+60,-22);
    line(-95-60,-20*5,-95+60,-20*5);
    line(95-60,-20*5,95+60,-20*5);
    */
    scaledLine(-95-60,-22,95+60,-22);
    scaledLine(-95-60,-20*5,95+60,-20*5);
    push();

    //scale(5);
    strokeWeight(5*screenScale);
    stroke(210,210,220);
    beginShape();
    //vertex(-8,14);
    //vertex(-8,10);
    vertex(-50*screenScale,50*screenScale);
    vertex(-50*screenScale,35*screenScale);
    vertex(-35*screenScale,15*screenScale);
    vertex(35*screenScale,15*screenScale);
    vertex(50*screenScale,35*screenScale);
    vertex(50*screenScale,50*screenScale);
    vertex(-50*screenScale,50*screenScale);
    //vertex(8,10);
    //vertex(8,14);
    //vertex(-8,14);
    endShape();

    scaledLine(-40,60,-36.5,70);
    scaledLine(-36.5,70,36.5,70);
    scaledLine(36.5,70,40,60);

    scaledLine(-50,50,50,50);

    scaledLine(0,15,0,-50);
    scaledLine(0,-50,30,-70);
    scaledLine(0,-50,-30,-70);
    scaledLine(0,-65,0,-130);
    scaledLine(0,-130,30,-150);
    scaledLine(0,-130,-30,-150);

    //textFont(semibold,7);
    noStroke();
    if(appState==1){
      fill(red.light2);
      scaledText(this.scoredRings[1][2],-95,-145,semibold,45);
      scaledText(this.scoredRings[1][1],-95,-65,semibold,45);
      scaledText(this.scoredRings[1][0],-95,15,semibold,45)
      fill(blue.light2);
      scaledText(this.scoredRings[2][2],95,-145,semibold,45);
      scaledText(this.scoredRings[2][1],95,-65,semibold,45);
      scaledText(this.scoredRings[2][0],95,15,semibold,45);
      pop();
    }
    else{
      if(this==lrt.rFields[0])fill(red.light2);
      else if(this==lrt.rFields[1])fill(blue.light2);
      else fill(yellow.light1);
      scaledText(this.scoredRings[1][2]+this.scoredRings[2][2],-95,-145,semibold,45);
      scaledText(this.scoredRings[1][1]+this.scoredRings[2][1],-95,-65,semibold,45);
      scaledText(this.scoredRings[1][0]+this.scoredRings[2][0],-95,15,semibold,45)

      if(appState==2&&this.scores[0]>0){
        fill(purple.light2);
        scaledText(skillsSave[0],95,-145,semibold,45);
        scaledText(skillsSave[1],95,-65,semibold,45);
        scaledText(skillsSave[2],95,15,semibold,45)
      }
      pop();
    }
    strokeWeight(3*screenScale);
    noFill();
    push();
    translate(0,123*screenScale);
    this.mogos[1].drawHouse(color(210,210,220));
    pop();

    noStroke();
    if(appState==1){
      if(this.autonWinner==1){
        stroke(red.light2);
        strokeWeight(15*screenScale)
        scaledLine(-65-20,-185,-65+20,-185);
        noStroke();
        fill(40,40,45);
        //fill(210,210,220)
        scaledText("Auton",-65,-186,bold,11);
      }
      else if(this.autonWinner==2){
        stroke(blue.light2);
        strokeWeight(15*screenScale)
        scaledLine(65-20,-185,65+20,-185);
        noStroke();
        fill(40,40,45);
        //fill(210,210,220)
        scaledText("Auton",65,-186,bold,11);
      }

      fill(red.light2);
      scaledText(this.scoredHomeZone[1],-95,120,semibold,35);
      scaledText(this.scoredPlatform[1],-95,190,semibold,35);
      scaledText((this.platButtons[2].textA*this.platButtons[0].toggled),-95,260,semibold,35);
      fill(blue.light2);
      scaledText(this.scoredHomeZone[2],95,120,semibold,35);
      scaledText(this.scoredPlatform[2],95,190,semibold,35);
      scaledText((this.platButtons[3].textA*this.platButtons[1].toggled),95,260,semibold,35);
    }
    else if(appState==2){
      fill(yellow.light1);
      scaledText((this.scoredHomeZone[1]+this.scoredHomeZone[2]),-95,120,semibold,35);
      scaledText((this.scoredPlatform[1]+this.scoredPlatform[2]),-95,190,semibold,35);
      scaledText((this.platButtons[2].textA*this.platButtons[0].toggled+this.platButtons[3].textA*this.platButtons[1].toggled),-95,260,semibold,35);

      if(this.scores[0]>0){
        fill(purple.light2);
        scaledText(skillsSave[3],95,120,semibold,35);
        scaledText(skillsSave[4],95,190,semibold,35);
        scaledText(skillsSave[5],95,260,semibold,35);
      }



      tmSave.updateButton();
      if(tmSave.clicked){
        skillsSave=[this.scoredRings[1][2]+this.scoredRings[2][2],this.scoredRings[1][1]+this.scoredRings[2][1],this.scoredRings[1][0]+this.scoredRings[2][0],this.scoredHomeZone[1]+this.scoredHomeZone[2],this.scoredPlatform[1]+this.scoredPlatform[2],this.platButtons[2].textA*this.platButtons[0].toggled+this.platButtons[3].textA*this.platButtons[1].toggled];
        storeItem('skillsSave',skillsSave)
        }
    }
    push();
    translate(0,193*screenScale);
    this.mogos[1].drawPlat(color(210,210,220));
    pop();

    push();
    translate(0,10*screenScale);
    strokeWeight(10*screenScale);
    stroke(210,210,220);
    scaledLine(-20,260,20,260);
    strokeWeight(5*screenScale);
    stroke(40,40,45);
    scaledLine(-20,260,20,260);
    strokeWeight(5*screenScale);
    scaledLine(-7,265,7,265);
    strokeWeight(3*screenScale);
    stroke(210,210,220);
    scaledLine(-5,258,-5,270);
    scaledLine(5,258,5,270);
    scaledLine(-5,270,-8,273);
    scaledLine(5,270,8,273);
    //noFill();
    //fill(210,210,220);
    //stroke(red.light2);
    //rect(-12,246,16,16,5);
    //stroke(blue.light2);
    //rect(12,246,16,16,5);

    fill(210,210,220);
    scaledEllipse(-10,250,5,5,3)
    scaledEllipse(10,250,5,5,3);
    scaledLine(-4,250,4,250);
    scaledLine(-2,250,-2,242);
    scaledLine(-2,242,4,238);
    stroke(210,210,220);
    noFill();
    scaledArc(10,236,6,6,QUARTER_PI+0.3,TWO_PI-QUARTER_PI-0.75,3);
    pop();
  }


  drawRingCounter(){
    push();
    //stroke(yellow.light2);
    //stroke(yellow.medium);
    stroke(210,210,220);
    if(appState==1)translate(135*screenScale,-280*screenScale);
    else translate(140*screenScale,-280*screenScale);
    strokeWeight(2*screenScale);
    noFill();
    beginShape();
    vertex(-8*screenScale,14*screenScale);
    vertex(-8*screenScale,10*screenScale);
    vertex(-10*screenScale,10*screenScale);
    vertex(-10*screenScale,7*screenScale);
    vertex(-7*screenScale,3*screenScale);
    vertex(7*screenScale,3*screenScale);
    vertex(10*screenScale,7*screenScale);
    vertex(10*screenScale,10*screenScale);
    vertex(8*screenScale,10*screenScale);
    vertex(8*screenScale,14*screenScale);
    vertex(-8*screenScale,14*screenScale);
    endShape();
    scaledLine(0,3,0,-10);
    scaledLine(0,-10,7,-14);
    scaledLine(0,-10,-7,-14);
    scaledLine(0,-10,0,-26);
    scaledLine(0,-26,6,-30);
    scaledLine(0,-26,-6,-30);
    //textFont(bold,14);
    noStroke();
    if(appState==1){
      fill(red.light2);
      scaledText(this.scoredRings[1][2],-21,-32,bold,14);
      scaledText(this.scoredRings[1][1],-21,-16,bold,14);
      scaledText(this.scoredRings[1][0],-21,0,bold,14)
      fill(blue.light2);
      scaledText(this.scoredRings[2][2],21,-32,bold,14);
      scaledText(this.scoredRings[2][1],21,-16,bold,14);
      scaledText(this.scoredRings[2][0],21,0,bold,14);
      pop();
    }
    else if(appState==2){
      fill(yellow.light1);
      scaledText(this.scoredRings[1][2]+this.scoredRings[2][2],-21,-32,bold,14);
      scaledText(this.scoredRings[1][1]+this.scoredRings[2][1],-21,-16,bold,14);
      scaledText(this.scoredRings[1][0]+this.scoredRings[2][0],-21,0,bold,14)
      pop();
    }
    else{
      if(this==lrt.rFields[0])fill(red.light2);
      else if(this==lrt.rFields[1])fill(blue.light2);
      scaledText(this.scoredRings[1][2],-21,-32,bold,14);
      scaledText(this.scoredRings[1][1],-21,-16,bold,14);
      scaledText(this.scoredRings[1][0],-21,0,bold,14)
      pop();
    }
  }


  displayScoresFull(){
    this.displayScores();
  }


  displayScores(){
    //textFont(regular,50);
    stroke(40,40,45);
    strokeWeight(15*screenScale);
    if(appState==1){
      /*
      fill(30,30,35);
      noStroke();
      scaledRect(0,-229,280,54,30,30,30,30,0);
      */
      fill(40,40,45,120);
      noStroke();
      textFont(regular,50*screenScale);
      scaledRect(-65,-230,textWidth(this.scores[1])+40,56,0,0,28,28,3.5);
      scaledRect(65,-230,textWidth(this.scores[2])+40,56,0,0,28,28,3.5);

      strokeWeight(3.5*screenScale);
      noStroke();
      fill(red.light2);
      scaledText(this.scores[1],-65,-234,regular,50);
      if(this.scores[1]>this.scores[2]){
        let tWidth=textWidth(this.scores[1])*0.5+0*screenScale;
        stroke(red.light2);
        //stroke(230);
        let winHeight=-202;
        line(-65*screenScale-tWidth,winHeight*screenScale,-65*screenScale+tWidth,winHeight*screenScale)
        //line(-65*screenScale-tWidth,winHeight*screenScale,-73*screenScale-tWidth,(winHeight-5)*screenScale)
        //line(-65*screenScale+tWidth,winHeight*screenScale,-57*screenScale+tWidth,(winHeight-5)*screenScale)
      }
      if(this.scores[2]>this.scores[1]){
        let tWidth=textWidth(this.scores[2])*0.5+0*screenScale;
        stroke(blue.light2);
        //stroke(230);
        let winHeight=-202;
        line(65*screenScale-tWidth,winHeight*screenScale,65*screenScale+tWidth,winHeight*screenScale)
      }
      noStroke();
      fill(blue.light2);
      scaledText(this.scores[2],65,-234,regular,50);
    }
    else if(appState==2){
      if(!tmScreen.toggled){
        fill(40,40,45,120);
        noStroke();
        textFont(regular,50*screenScale);
        scaledRect(0,-230,textWidth(this.scores[3])+40,56,0,0,28,28,3.5);
        fill(yellow.light1);
        scaledText(this.scores[3],0,-234,regular,50);
      }
      else{
        fill(yellow.light1);
        scaledText(this.scores[3],-65,-234,regular,50);
        fill(purple.light2);
        if(this.scores[0]>0)scaledText(this.scores[0],65,-234,regular,50);
      }
    }

    else if(appState==3){//}&&this.zoneMogos[5].length==0){
      //if(remoteFieldSelected==1)fill(red.light2);
      //else if(remoteFieldSelected==2)fill(blue.light2);
      fill(30,30,35);
      noStroke();
      scaledRect(0,-190,210,32,15,15,15,15,0);
      strokeWeight(10*screenScale);
      //textFont(regular,30);
      //text(this.scores[3],0,-252.5);
      fill(red.medium);
      scaledText(this.zonePoints[0],-60,-193,regular,30);//-255);
      fill(yellow.medium);
      scaledText(this.zonePoints[1],0,-193,regular,30);//-255);
      fill(blue.medium);
      scaledText(this.zonePoints[2],60,-193,regular,30);//-255);
    }

  }

  resetIcon(){
    push();
    translate(130*screenScale,246*screenScale);
    //scale(0.7);
    stroke(210,210,220);
    strokeWeight(2.1*screenScale);
    noFill();
    scaledArc(0,0,21,21,PI+QUARTER_PI-0.1,TWO_PI+PI-QUARTER_PI-0.1);
    //translate(-11.61,-9.49);
    translate(-8.127*screenScale,-6.643*screenScale)
    scaledLine(0,0,0,-5.075);
    scaledLine(0,0,4.9,0.35);
    pop();
  }

  drawField(){
    stroke(180,180,190);
    strokeWeight(3*screenScale);
    scaledLine(-53,-160,-53,160);
    scaledLine(53,-160,53,160);
    scaledLine(-3,-160,-3,160);
    scaledLine(3,-160,3,160);
    scaledLine(53,-107,106,-160);
    scaledLine(-53,107,-106,160);
    stroke(160,160,170);
    //strokeWeight(5*screenScale);
    noFill();
    scaledRect(0,0,320,320,15,15,15,15,5);
  }

  scoreField(){
    this.scores=[0,0,0,0];
    this.zonePoints=[0,0,0,0];
    this.scoredRings=[[0,0,0],[0,0,0],[0,0,0]]
    this.scoredHomeZone=[0,0,0]
    this.scoredPlatform=[0,0,0]
    this.scores[0]=skillsSave[0]*10+skillsSave[1]*3+skillsSave[2]+skillsSave[3]*20+skillsSave[4]*40+skillsSave[5]*30;
    this.totalRings=0;

    for(let i=0;i<7;i++){
      for(let j=0;j<5;j++){
        this.totalRings+=this.mogos[i].rings[j];
      }
    }


    if(appState==1||appState==2){
    //Auton Points
    if(appState==1){
      this.scores[this.autonWinner]+=20;
      if(this.autonWinner==0){
        this.scores[0]=0;
        this.scores[1]+=10;
        this.scores[2]+=10;
      }
    }

    if(appState!=3){
      //Ring Points
      this.scores[1]+=this.mogos[0].ringScore();
      this.scores[1]+=this.mogos[1].ringScore();
      this.scores[2]+=this.mogos[2].ringScore();
      this.scores[2]+=this.mogos[3].ringScore();

      //Ring Counter
      for(let i=0;i<2;i++){
        for(let j=0;j<2;j++){
          this.scoredRings[i+1][j]=0;
          if(this.mogos[i*2].zone!=5)this.scoredRings[i+1][j]+=this.mogos[i*2].rings[j];
          if(this.mogos[i*2+1].zone!=5)this.scoredRings[i+1][j]+=this.mogos[i*2+1].rings[j];
          //this.scoredRings[i+1][j]=this.mogos[i*2].rings[j]+this.mogos[i*2+1].rings[j];
        }
      }

      for(let i=4;i<7;i++){
        if(!this.mogos[i].scored.toggled&&(this.mogos[i].zone==1||(this.mogos[i].zone==0))){
          this.scores[1]+=this.mogos[i].ringScore();
          this.scoredRings[1][0]+=this.mogos[i].rings[0];
          this.scoredRings[1][1]+=this.mogos[i].rings[1]+this.mogos[i].rings[2];
          this.scoredRings[1][2]+=this.mogos[i].rings[3]+this.mogos[i].rings[4];
        }
        else if(!this.mogos[i].scored.toggled&&(this.mogos[i].zone==3||(this.mogos[i].zone==4))){
          this.scores[2]+=this.mogos[i].ringScore();
          this.scoredRings[2][0]+=this.mogos[i].rings[0];
          this.scoredRings[2][1]+=this.mogos[i].rings[1]+this.mogos[i].rings[2];
          this.scoredRings[2][2]+=this.mogos[i].rings[3]+this.mogos[i].rings[4];
        }
      }
    }

    //Mogo Zone Points
    for(let i=0;i<7;i++){
      if((this.mogos[i].zone==1||(this.mogos[i].zone==0&&!this.platButtons[0].toggled))&&this.mogos[i].id!=2&&this.mogos[i].id!=3&&!this.mogos[i].scored.toggled){
        this.scores[1]+=20;
        this.scoredHomeZone[1]++;
      }
      else if((this.mogos[i].zone==3||(this.mogos[i].zone==4&&!this.platButtons[1].toggled))&&this.mogos[i].id!=0&&this.mogos[i].id!=1&&!this.mogos[i].scored.toggled){
        this.scores[2]+=20;
        this.scoredHomeZone[2]++;
      }
    }


    //Platform Points
    if(this.platButtons[0].toggled){
      this.scores[1]+=this.platButtons[2].textA*30;
      for(let j=0;j<this.zoneMogos[0].length;j++){
        if(this.zoneMogos[0][j].id!=2&&this.zoneMogos[0][j].id!=3&&!this.zoneMogos[0][j].scored.toggled){
          this.scores[1]+=40;
          this.scoredPlatform[1]++;
        }
      }
    }
    if(this.platButtons[1].toggled){
      this.scores[2]+=this.platButtons[3].textA*30;
      for(let j=0;j<this.zoneMogos[4].length;j++){
        if(this.zoneMogos[4][j].id!=0&&this.zoneMogos[4][j].id!=1&&!this.zoneMogos[4][j].scored.toggled){
          this.scores[2]+=40;
          this.scoredPlatform[2]++;
        }
      }
    }
    }
    else if(appState==3){

        for(let i=0;i<7;i++){
          let rScore=this.mogos[i].ringScoreLRT();
          if(!this.mogos[i].scored.toggled){
            this.scoredRings[0][0]+=this.mogos[i].rings[0];
            this.scoredRings[0][1]+=this.mogos[i].rings[1]+this.mogos[i].rings[2];
            this.scoredRings[0][2]+=this.mogos[i].rings[3]+this.mogos[i].rings[4];
            if(this.mogos[i].zone==1||(this.mogos[i].zone==0)){
              this.zonePoints[0]+=rScore;
            }
            else if(this.mogos[i].zone==2){
              this.zonePoints[1]+=rScore;
            }
            else if(this.mogos[i].zone==3||(this.mogos[i].zone==4)){
              this.zonePoints[2]+=rScore;
            }
          }
        }


      //Mogo Zone Points
      for(let i=0;i<7;i++){
        if(!this.mogos[i].scored.toggled){
          if(this.mogos[i].zone==1||(this.mogos[i].zone==0&&!this.platButtons[0].toggled)){
            this.zonePoints[0]+=30;
          }
          else if(this.mogos[i].zone==2){
            this.zonePoints[1]+=10;
          }
          else if(this.mogos[i].zone==3||(this.mogos[i].zone==4&&!this.platButtons[1].toggled)){
            this.zonePoints[2]+=30;
          }
        }
      }


      //Platform Points
      if(this.platButtons[0].toggled){
        this.zonePoints[0]+=this.platButtons[2].textA*30;
        for(let j=0;j<this.zoneMogos[0].length;j++){
          if(!this.zoneMogos[0][j].scored.toggled)this.zonePoints[0]+=40;
        }
      }
      if(this.platButtons[1].toggled){
        this.zonePoints[2]+=this.platButtons[3].textA*30;
        for(let j=0;j<this.zoneMogos[4].length;j++){
          if(!this.zoneMogos[4][j].scored.toggled)this.zonePoints[2]+=40;
        }
      }
    }


    this.scores[3]=this.scores[1]+this.scores[2];
    if(appState==3)this.scores[3]=this.zonePoints[0]+this.zonePoints[1]+this.zonePoints[2];

    if(appState==1){
      storeItem('matchFieldSave',matchField);
    }
    else if(appState==2){
      storeItem('skillsFieldSave',skillsField);
      console.log("skills saved");
    }
    else if(appState==3){
      storeItem('remoteFieldSave',lrt)
    }

    return this.zonePoints;
  }

  resetField(){
    this.parkedBots=[0,0,0];
    this.scores=[0,0,0,0];
    this.scoredRings=[[0,0,0],[0,0,0],[0,0,0]]
    this.scoredHomeZone=[0,0,0];//0=lrt,1=red,2=blue
    this.scoredPlatform=[0,0,0];
    this.autonWinner=0;
    this.auton=new Button(44-6-61-4,246,122-6,120,"Auton:\nTied",1);
    this.auton.sWeight=4;
    this.awp.toggled=false;
    this.parked.toggled=false;
    this.parked.x=-130;
    this.platButtons[0].toggled=true;
    this.platButtons[1].toggled=true;
    this.platButtons[2].textA=0;
    this.platButtons[3].textA=0;
    this.platButtons[4].textA=0;
    this.platforms[0]=new Platform(-125,0,red);
    this.platforms[1]=new Platform(125,0,blue);
    this.mogos=[];
    /*
    for(let i=0;i<5;i++){
      for(let j=0;j<this.zoneMogos[i].length;j++){
        this.zoneMogos[i][j].mogoID=-1;
      }
    }
    */
    this.zoneMogos=[[],[],[],[],[],[]];

    this.mogos[2]=new Mogo(80,-133-5,blue,0,2,3);
    this.mogos[3]=new Mogo(125,100-10,blue,0,3,3);
    this.mogos[0]=new Mogo(-80,133,red,0,0,1);
    this.mogos[1]=new Mogo(-125,-100+5,red,0,1,1);
    this.mogos[4]=new Mogo(0,-100,yellow,1,4,2);
    this.mogos[5]=new Mogo(0,0,yellow,2,5,2);
    this.mogos[6]=new Mogo(0,100,yellow,1,6,2);


    if(this!=skillsField){
      this.zoneMogos[1][0]=(this.mogos[0]);
      this.zoneMogos[1][1]=(this.mogos[1]);
      this.zoneMogos[3][0]=(this.mogos[2]);
      this.zoneMogos[3][1]=(this.mogos[3]);
      this.zoneMogos[2].push(this.mogos[4]);
      this.zoneMogos[2].push(this.mogos[5]);
      this.zoneMogos[2].push(this.mogos[6]);

      this.mogos[0].zoneButtons[1].toggled=true;
      this.mogos[1].zoneButtons[1].toggled=true;
      this.mogos[2].zoneButtons[3].toggled=true;
      this.mogos[3].zoneButtons[3].toggled=true;
    }
    else{
      this.mogos[0].zone=3;
      this.mogos[1].zone=3;
      this.mogos[2].zone=1;
      this.mogos[3].zone=1;
      this.zoneMogos[3][0]=(this.mogos[0]);
      this.zoneMogos[3][1]=(this.mogos[1]);
      this.zoneMogos[1][0]=(this.mogos[2]);
      this.zoneMogos[1][1]=(this.mogos[3]);
      this.zoneMogos[2].push(this.mogos[4]);
      this.zoneMogos[2].push(this.mogos[5]);
      this.zoneMogos[2].push(this.mogos[6]);

      this.mogos[0].zoneButtons[3].toggled=true;
      this.mogos[1].zoneButtons[3].toggled=true;
      this.mogos[2].zoneButtons[1].toggled=true;
      this.mogos[3].zoneButtons[1].toggled=true;
    }

    this.mogos[4].zoneButtons[2].toggled=true;
    this.mogos[5].zoneButtons[2].toggled=true;
    this.mogos[6].zoneButtons[2].toggled=true;

    this.updateMogoList();
  }

  updateMogoList(){
    let usedIDs=[];
    this.mogoDrawList=[];
    //this.zoneMogos=[[],[],[],[],[]]

    //for(let i=0;i<7;i++){
      //if(!this.mogos[i].dragged)this.zoneMogos[this.mogos[i].zone].push(this.mogos[i]);
    //}

    for(let i=0;i<6;i++){
      if(i!=1&&i!=3){
        for(let j=0;j<this.zoneMogos[i].length;j++){
          if(usedIDs[this.zoneMogos[i][j].id==1]){
            this.zoneMogos[i][j]=null;
          }
          else{
            this.zoneMogos[i][j].setAtNode(this.nodes[i][this.zoneMogos[i].length-1][j]);
            this.mogoDrawList.push(this.zoneMogos[i][j]);
            this.zoneMogos[i][j].zone=i;
            this.zoneMogos[i][j].forceUpdateZoneButtons();
            usedIDs[this.zoneMogos[i][j].id]=1;
          }
        }
      }
    }
    for(let i=1;i<4;i+=2){
      for(let j=0;j<7;j++){
        if(this.zoneMogos[i][j]!=null){
          if(usedIDs[this.zoneMogos[i][j].id==1]){
            this.zoneMogos[i][j]=null;
          }
          else{
            this.zoneMogos[i][j].setAtNode(this.nodes[i][6][j]);
            this.mogoDrawList.push(this.zoneMogos[i][j]);
            this.zoneMogos[i][j].zone=i;
            this.zoneMogos[i][j].forceUpdateZoneButtons();
            usedIDs[this.zoneMogos[i][j].id]=1;
          }
        }
      }
    }
    this.mogoDrawList.sort(this.compareY);
  }

  compareY(a,b){
    return(a.y-b.y);
  }

}





class remoteField{
  constructor(){
    this.rFields=[];
    this.rFields[0]=new Field();
    this.rFields[1]=new Field();

    //this.lrtScores=[[33,50],[20,10],[60,103]];
    this.lrtScores=[[0,0,0],[0,0,0]];
    this.lrtWP=[0,0];


    this.fieldButtons=[];
    this.fieldButtons[0]=new Button(-80-5,-240,150,50,"Red");
    this.fieldButtons[0].setColors(0,0,0,0,0,color(red.light2),color(red.light2));
    this.fieldButtons[0].setExtraData(2,"Red",25);
    this.fieldButtons[1]=new Button(80+5,-240,150,50,"Blue");
    this.fieldButtons[1].setColors(0,0,0,0,0,color(blue.light2),color(blue.light2));
    this.fieldButtons[1].setExtraData(2,"Blue",25);
    this.lrtAuton=new Button(-85,246,150,120,"Auton:\nTie");
    this.lrtReset=new Button(85,246,150,120,"Reset\nFields");
    this.autonWinner=0; //0: Tied, 1:Red, 2:Blue
  }

  updateLRT(){

    if(postClick==2)this.scoreLRT();


    //this.fieldButtons[0].y=-205;
    //this.fieldButtons[1].y=-205;
    if(remoteFieldSelected==0){
      this.drawLRTField();
      this.drawLRTScore();
      this.lrtAuton.updateButton();
      if(this.lrtAuton.clicked||this.lrtAuton.toggled){
        if(this.lrtAuton.toggled)this.lrtAuton.toggled=false;
        if(this.lrtAuton.clicked)this.autonWinner=(this.autonWinner+1)%3;
        if(this.autonWinner==0){
          this.lrtAuton.strokeA=color(0,0);
          this.lrtAuton.textColor=color(230,230,240);
          this.lrtAuton.textA="Auton:\nTied";
        }
        else if(this.autonWinner==1){
          this.lrtAuton.strokeA=red.light2;
          this.lrtAuton.textColor=red.light2;
          this.lrtAuton.textA="Auton:\nRed";
        }
        else if(this.autonWinner==2){
          this.lrtAuton.strokeA=blue.light2;
          this.lrtAuton.textColor=blue.light2;
          this.lrtAuton.textA="Auton:\nBlue";
        }
      }
      this.lrtReset.updateButton();
      if(this.lrtReset.clicked)this.resetLRT();
    }
    else{
      //fields[remoteFieldSelected+2].updateField();
      if(mogoSelected==-1)this.lrtHighLights();
      this.rFields[remoteFieldSelected-1].updateField();
      /*
      if(this.rFields[remoteFieldSelected-1].zoneMogos[5].length>0){
        this.fieldButtons[0].y=-240;
        this.fieldButtons[1].y=-240;
      }
      */
    }
    if(mogoSelected==-1){
      for(let i=0;i<2;i++){
        this.fieldButtons[i].updateButton();
      }
    }
    if(this.fieldButtons[0].clicked){
      this.fieldButtons[1].toggled=false;
    }
    else if(this.fieldButtons[1].clicked){
      this.fieldButtons[0].toggled=false;
    }
    if(this.fieldButtons[0].toggled){
      remoteFieldSelected=1;
    }
    else if(this.fieldButtons[1].toggled){
      remoteFieldSelected=2;
    }
    else if(!this.fieldButtons[0].toggled&&!this.fieldButtons[1].toggled){
      remoteFieldSelected=0;
    }
  }

  drawLRTField(){

    this.lrtHighLights();

    stroke(180,180,190);
    strokeWeight(3*screenScale);
    scaledLine(-53,-160,-53,160);
    scaledLine(53,-160,53,160);
    stroke(160);
    //strokeWeight(5*screenScale);
    noFill();
    scaledRect(0,0,320,320,15,15,15,15,5);
  }

  lrtHighLights(){
    noStroke();
    noFill();
    //strokeWeight(10);
    if(this.lrtScores[0][0]>this.lrtScores[1][0])fill(red.dark5,50);
    else if(this.lrtScores[0][0]<this.lrtScores[1][0])fill(blue.dark5,50);
    scaledRect(-125.5,0,64,314,12,0,0,12,10);
    scaledRect(-73.25,0,40.5,314,0,0,0,0,10)
    if(remoteFieldSelected==0){
      scaledRect(-125.5,0,64,314,12,0,0,12,10);
      simpleRect(-73.25,0,40.5,314)
    }

    noFill();
    if(this.lrtScores[0][1]>this.lrtScores[1][1])fill(red.dark5,50)
    else if(this.lrtScores[0][1]<this.lrtScores[1][1])fill(blue.dark5,50);
    scaledRect(0,0,106,314,0,0,0,0,10)
    if(remoteFieldSelected==0){
      scaledRect(0,0,106,314,0,0,0,0,10)
    }

    noFill();
    if(this.lrtScores[0][2]>this.lrtScores[1][2])fill(red.dark5,50)
    else if(this.lrtScores[0][2]<this.lrtScores[1][2])fill(blue.dark5,50);
    scaledRect(125.5,0,64,314,0,12,12,0,10);
    scaledRect(73.25,0,40.5,314,0,0,0,0,10)
    if(remoteFieldSelected==0){
      scaledRect(125.5,0,64,314,0,12,12,0,10);
      scaledRect(73.25,0,40.5,314,0,0,0,0,10)
    }

  }

  drawLRTScore(){
    //textFont(bold,30);
    strokeWeight(2*screenScale);
    noStroke();
    fill(red.light2);
    if(this.lrtScores[0][0]>this.lrtScores[1][0]){
      stroke(240);
      fill(red.dark1);
    }
    scaledText(this.lrtScores[0][0],-107,-134,bold,30);

    noStroke();
    fill(blue.light2);
    if(this.lrtScores[0][0]<this.lrtScores[1][0]){
      stroke(240);
      fill(blue.dark1);
    }
    scaledText(this.lrtScores[1][0],-107,-100,bold,30);

    fill(red.light2);
    noStroke();
    if(this.lrtScores[0][1]>this.lrtScores[1][1]){
      stroke(240);
      fill(red.dark1);
    }
    scaledText(this.lrtScores[0][1],0,-134,bold,30);

    fill(blue.light2);
    noStroke();
    if(this.lrtScores[0][1]<this.lrtScores[1][1]){
      stroke(240);
      fill(blue.dark1);
    }
    scaledText(this.lrtScores[1][1],0,-100,bold,30);

    fill(red.light2);
    noStroke();
    if(this.lrtScores[0][2]>this.lrtScores[1][2]){
      stroke(240);
      fill(red.dark1);
    }
    scaledText(this.lrtScores[0][2],107,-134,bold,30);

    fill(blue.light2);
    noStroke();
    if(this.lrtScores[0][2]<this.lrtScores[1][2]){
      stroke(240);
      fill(blue.dark1);
    }
    scaledText(this.lrtScores[1][2],107,-100,bold,30);

    fill(45,45,50);
    //strokeWeight(2);
    stroke(100,100,110);
    //noStroke();
    scaledRect(0,35,200,210,15,15,15,15,2);
    fill(210,210,220);
    noStroke();
    //textFont(regular,20);
    scaledText("Match Points:",0,-50,regular,20);
    scaledText("Auton WP:",0,15,regular,20);
    scaledText("Total WP:",0,80,regular,20);

    //textFont(bold,30);
    if(this.rFields[0].scores[3]>this.rFields[1].scores[3]){
      stroke(240);
      fill(red.dark1);
    }
    else {
      noStroke();
      fill(red.light2);
    }
    scaledText(this.rFields[0].scores[3],-40,-20,bold,30);

    if(this.rFields[0].scores[3]<this.rFields[1].scores[3]){
      stroke(240);
      fill(blue.dark1);
    }
    else {
      fill(blue.light2);
      noStroke();
    }
    scaledText(this.rFields[1].scores[3],40,-20,bold,30);

    noStroke();
    fill(red.light2);
    scaledText(int(this.rFields[0].awp.toggled),-40,45,bold,30);
    fill(blue.light2);
    scaledText(int(this.rFields[1].awp.toggled),40,45,bold,30);

    fill(red.light2);
    scaledText(this.lrtWP[0],-40,110,bold,30);
    fill(blue.light2);
    scaledText(this.lrtWP[1],40,110,bold,30);
  }

  scoreLRT(){
    this.lrtWP=[0,0];
    this.lrtScores[0]=this.rFields[0].scoreField();
    this.lrtScores[1]=this.rFields[1].scoreField();
    if(this.autonWinner!=0)this.rFields[this.autonWinner-1].scores[3]+=20;
    else{
      this.rFields[0].scores[3]+=10;
      this.rFields[1].scores[3]+=10;
    }
    for(let i=0;i<3;i++){
      if(this.lrtScores[0][i]>this.lrtScores[1][i])this.lrtWP[0]++;
      else if(this.lrtScores[0][i]<this.lrtScores[1][i])this.lrtWP[1]++;
    }
    if(this.rFields[0].awp.toggled)this.lrtWP[0]++;
    if(this.rFields[1].awp.toggled)this.lrtWP[1]++;
    if(this.rFields[0].scores[3]>this.rFields[1].scores[3])this.lrtWP[0]+=2;
    else if(this.rFields[0].scores[3]<this.rFields[1].scores[3])this.lrtWP[1]+=2;
    else{
      this.lrtWP[0]++;
      this.lrtWP[1]++;
    }
  }
  resetLRT(){
    this.autonWinner=0;
    this.lrtAuton.textA="Auton:\nTied";
    this.lrtAuton.textColor=color(230,230,240);
    this.lrtAuton.strokeA=color(0,0);
    this.lrtScores=[[0,0,0],[0,0,0]];
    this.lrtWP=[0,0];
    this.rFields[0].resetField();
    this.rFields[1].resetField();
    this.scoreLRT();
  }
}






class ColorBase{
  constructor(r_,g_,b_){
  this.r=r_;
  this.g=g_;
  this.b=b_;
  this.medium=color(this.r,this.g,this.b);
  this.light1=color(this.r+10,this.g+10,this.b+10);
  this.light2=color(this.r+20,this.g+20,this.b+20);
  this.light3=color(this.r+30,this.g+30,this.b+30);
  this.dark1=color(this.r-10,this.g-10,this.b-10);
  this.dark2=color(this.r-20,this.g-20,this.b-20);
  this.dark3=color(this.r-30,this.g-30,this.b-30);
  this.dark4=color(this.r-40,this.g-40,this.b-40);
  this.dark5=color(this.r,this.g,this.b,45);
  this.mediumFade=color(this.r-20,this.g-20,this.b-20);
  }
}


class RingCounter{
  constructor(y_,id_){
    this.x;
    this.xOriginal;
    this.y=y_;
    this.id=id_;
    if(this.id!=2&&this.id!=4)this.xOriginal=-120;
    else this.xOriginal=120;
    this.x=this.xOriginal;
    this.ringCount=0;
    this.plus=new Button(this.x,this.y-47,50,50,"+");
    this.plus.setColors(purple.dark3,purple.dark4,0,0,purple.medium,0,0);
    this.plus.tSize=40;
    this.minus=new Button(this.x,this.y+47,50,50,"-");
    this.minus.setColors(purple.dark3,purple.dark4,0,0,purple.medium,0,0);
    this.minus.tSize=40;
  }
  updateCounter(r){
    this.ringCount=r;
    this.x=this.xOriginal;
    this.plus.x=this.xOriginal;
    this.minus.x=this.xOriginal;

    if(settingButtons[1].toggled&&((settingButtons[0].toggled&&appState!=3)||this.id==0||mogoSelected<4)){
      this.x=this.xOriginal*-1;
      this.plus.x=this.xOriginal*-1;
      this.minus.x=this.xOriginal*-1;
    }
    fill(40,40,45);
    strokeWeight(3*screenScale);
    stroke(purple.dark3);
    scaledRect(this.x,this.y,50,94,0,0,0,0,3);
    //textFont(regular,25);
    stroke(purple.medium);
    fill(230,230,240);
    if(settingButtons[0].toggled&&appState!=3&&(this.id==1||this.id==3)){
      if(this.id==1){
        scaledText((this.ringCount+fields[appState].mogos[mogoSelected].rings[2]),this.x,this.y-3,regular,25);
      }
      else if(this.id==3){
        scaledText((this.ringCount+fields[appState].mogos[mogoSelected].rings[4]),this.x,this.y-3,regular,25);
      }
    }
    else scaledText(this.ringCount,this.x,this.y-3,regular,25);


    this.plus.updateButton();
    this.minus.updateButton();
    let ringLimit=72;
    if(appState==2)ringLimit=66;
    else if(appState==3)ringLimit=63;
    if(this.plus.clicked&&fields[appState+remoteFieldSelected].totalRings<ringLimit){
      this.ringCount++;
      let nPoleMax=7;
      if(settingButtons[0].toggled&&appState!=3&&(this.id==1||this.id==3)){
        if(this.id==1&&this.ringCount<=nPoleMax+1&&mogoSelected>=4&&this.ringCount-1>fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]){
          this.ringCount--;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]++;
        }
        else if(this.id==3&&this.ringCount<=nPoleMax+1&&mogoSelected>=4&&this.ringCount-1>fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]){
          this.ringCount--;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]++;
        }
      }
      else{
        if(this.ringCount==nPoleMax+1&&mogoSelected>=4&&this.id==1&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]<nPoleMax){
          this.ringCount--;
          //fields[appState+remoteFieldSelected].mogos[mogoSelected].ringCounters[2].ringCount++;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]++;
        }
        if(this.ringCount==nPoleMax+1&&mogoSelected>=4&&this.id==2&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]<nPoleMax){
          this.ringCount--;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]++;
        }
        if(this.ringCount==nPoleMax+1&&this.id==3&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]<nPoleMax){
          this.ringCount--;
          //fields[appState+remoteFieldSelected].mogos[mogoSelected].ringCounters[4].ringCount++;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]++;
        }
        if(this.ringCount==nPoleMax+1&&this.id==4&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]<nPoleMax){
          this.ringCount--;
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]++;
        }
      }
    }
    else if(this.minus.clicked){
      if(settingButtons[0].toggled&&appState!=3&&(this.id==1||this.id==3)){
        if(this.id==1&&mogoSelected>=4&&this.ringCount<fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]){
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]--;
        }
        else if(this.id==3&&mogoSelected>=4&&this.ringCount<fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]){
          fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]--;
        }
        else if(this.ringCount>0) this.ringCount--;
      }
      else{
        this.ringCount--;
        if(this.ringCount<0){
          if(this.id==1&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]--;
          if(this.id==2&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]--;
          if(this.id==3&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]--;
          if(this.id==4&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]--;
          this.ringCount=0;
        }
      }
    }
    return this.ringCount;
  }
}






class Mogo {
  constructor(x_,y_,c_,type_,id_,zone_){
    this.x=x_;
    this.y=y_;
    this.c=c_;
    this.type=type_;//0=Alliance, 1=Low Neutral, 2=High Neutral
    this.id=id_;
    this.rings=[0,0,0,0,0]; //[0]=Base, [1]=Left Low Pole, [2]=Right Low Pole, [3]=Left High Pole, [4]=Right High Pole
    this.zone=zone_;  //0=Red Platform, 1=Red Home Zone, 2=Neutral Zone, 3=Blue Home Zone, 4=Blue Platform
    //if(this.id==0||this.id==1)this.zone=1;
    //if(this.id==2||this.id==3)this.zone=3;

    this.dragged=false;

    this.mogoButton=new Button(this.x,this.y,60,50,"");
    this.mogoButton.setColors(color(0,0),color(30,230,30,80),0,0,0,0,0);
    this.mogoButton.fillA=color(0,0);
    //this.mogoButton.fillA2=color(0,0);
    this.mogoButton.fillA2=color(30,230,30,80);
    this.ringCounters=[];
    if(this.id!=5){
      this.ringCounters[0]=new RingCounter(80,0);
      this.ringCounters[1]=new RingCounter(-80,1);
      if(this.id>=4){
        this.ringCounters[2]=new RingCounter(-80,2);
      }
    }
    else{
      this.ringCounters[0]=new RingCounter(130,0);
      this.ringCounters[1]=new RingCounter(-30,1);
      this.ringCounters[2]=new RingCounter(-30,2);
      this.ringCounters[3]=new RingCounter(-190,3);
      this.ringCounters[4]=new RingCounter(-190,4);
    }
    this.zoneButtons=[];
    this.zoneButtons[0]=new Button(-130,255,55,55,"");
    this.zoneButtons[0].setExtraData(2,"",30);
    this.zoneButtons[0].setColors(0,0,0,0,0,red.medium,red.medium);
    this.zoneButtons[1]=new Button(-65,255,55,55,"");
    this.zoneButtons[1].setExtraData(2,"",30);
    this.zoneButtons[1].setColors(0,0,0,0,0,red.light2,red.light2);
    this.zoneButtons[2]=new Button(0,255,55,55,"");
    this.zoneButtons[2].setExtraData(2,"",30);
    this.zoneButtons[2].setColors(0,0,0,0,0,yellow.light1,yellow.light1);
    this.zoneButtons[3]=new Button(65,255,55,55,"");
    this.zoneButtons[3].setExtraData(2,"",30);
    this.zoneButtons[3].setColors(0,0,0,0,0,blue.light2,blue.light2);
    this.zoneButtons[4]=new Button(130,255,55,55,"");
    this.zoneButtons[4].setExtraData(2,"",30);
    this.zoneButtons[4].setColors(0,0,0,0,0,blue.medium,blue.medium);
    this.zoneButtons[5]=new Button(0,310,150,35,"Out of Field");
    this.zoneButtons[5].setExtraData(2,"Out of Field",13);
    this.zoneButtons[5].setColors(0,0,0,0,0,red.dark4,red.medium)
    this.zoneButtons[5].corners=[10,10,10,10];
    this.zoneButtons[5].yOffset=2;

    this.scored=new Button(130,200,55,55,"");
    this.scored.setExtraData(2,"",30);
    this.scored.setColors(0,0,0,0,green.light1,red.light2,0);
  }


  editMogo(){
    if(mogoSelected==-1||mogoSelected==this.id)this.drawMogo();
    for(let i=0;i<this.ringCounters.length;i++){
      //if((settingButtons[0].toggled&&i!=2&&i!=4)||settingButtons[0].toggled==false)this.ringCounters[i].updateCounter(this.rings[i]);
      //this.rings[i]=this.ringCounters[i].ringCount;
      if((settingButtons[0].toggled&&((i!=2&&i!=4)||appState==3))||settingButtons[0].toggled==false)this.rings[i]=this.ringCounters[i].updateCounter(this.rings[i]);
      if(i>0&&mogoSelected>3&&this.rings[i]>7)this.rings[i]=7
      if(i==1&&mogoSelected<=3&&this.rings[i]>11)this.rings[i]=11;
    }
    fill(30,30,35);
    stroke(30,30,35);
    //strokeWeight(20);
    //if(appState!=3)scaledRect(0,265,55*5+40,55,15,15,15,15,20);
    //else {
      scaledRect(0,255,55*5+40,55,15,15,15,15,20);
      scaledRect(0,315,150,35,0,0,15,15,20);
    //}
    if(settingButtons[1].toggled)this.scored.x=-130;
    else this.scored.x=130;
    //rect(this.scored.x,this.scored.y,55,55,15,15,0,0);
    //let limit=5;
    //if(appState==3)limit=6;
    for(let i=0;i<6;i++){
      /*
      if(i<5){
        if(appState!=3)this.zoneButtons[i].y=265;
        else this.zoneButtons[i].y=255;
      }
      */
      this.zoneButtons[i].updateButton();
      if(this.zoneButtons[i].clicked){
        for(let j=0;j<6;j++){
          this.zoneButtons[j].toggled=false;
        }
        this.zoneButtons[i].toggled=true;
        this.moveMogo(i);
      }
    }
    //this.scored.updateButton();
    this.drawIcons();
  }

  forceUpdateZoneButtons(){
    for(let i=0;i<6;i++){
      this.zoneButtons[i].toggled=(this.zone==i);
    }
  }

  checkDragged(){
    if(abs(translatedMouseX-this.x)<=30&&abs(translatedMouseY-this.y)<=25){
      initialDragging=false;
      this.dragged=true;
      //console.log("worked");
      fields[appState+remoteFieldSelected].draggedMogo=this.id;
      this.zoneButtons[this.zone].toggled=false;
      this.moveMogo(-1);
      fields[appState+remoteFieldSelected].updateMogoList();
      //console.log("removed mogo")
    }
  }

  findZone(){
    if(translatedMouseY<-160){
      return 5;
    }
    else if(translatedMouseX<-125+31.2&&translatedMouseY<69&&translatedMouseY>-69){
      return 0;
    }
    else if(translatedMouseX>125-31.2&&translatedMouseY<69&&translatedMouseY>-69){
      return 4;
    }
    else if(translatedMouseX<-53){
      return 1;
    }
    else if(translatedMouseX>53){
      return 3;
    }
    return 2;
  }

  setZone(){
    //console.log(this.findZone());
    this.dragged=false;
    this.moveMogo(this.findZone());
    this.zoneButtons[this.zone].toggled=true;
  }

  moveMogo(target){
    //console.log(this.zone);
    this.index = fields[appState+remoteFieldSelected].zoneMogos[this.zone].indexOf(this);
    //console.log(this.index);
    if (this.index > -1) {
      if(this.zone!=1&&this.zone!=3)fields[appState+remoteFieldSelected].zoneMogos[this.zone].splice(this.index, 1);
      else {
        fields[appState+remoteFieldSelected].zoneMogos[this.zone].splice(this.index, 1, null);
      }
    }
    //fields[appState+remoteFieldSelected].zoneMogos[this.zone]=fields[appState+remoteFieldSelected].zoneMogos[this.zone].filter(this.isntMogo);
    //delete fields[appState+remoteFieldSelected].zoneMogos[this.zone][fields[appState+remoteFieldSelected].zoneMogos.indexOf(this)];
    if(target!=-1){
      this.zone=target;
      if(target!=1&&target!=3)fields[appState+remoteFieldSelected].zoneMogos[this.zone].push(this);
      else{
        fields[appState+remoteFieldSelected].zoneMogos[this.zone][this.findClosestEmptyNode(target)]=this;
      }
    }
    fields[appState+remoteFieldSelected].updateMogoList();
    //storeItem('matchFieldSave',matchField);
    //storeItem('skillsFieldSave',skillsField);
  }

  isntMogo(a){
    if(a!=this)return true;
    return false;
  }

  isMogo(a){
    if(a==this)return true;
    return false;
  }

  findClosestEmptyNode(t){
    this.closest=-1;
    this.distance=1000;
    for(let i=0;i<7;i++){
      this.m=fields[appState+remoteFieldSelected].zoneMogos[t][i];
      if(this.m==null){
        this.d=dist(translatedMouseX,translatedMouseY,fields[appState+remoteFieldSelected].nodes[t][6][i].x,fields[appState+remoteFieldSelected].nodes[t][6][i].y);
        if(this.distance>this.d){
          this.distance=this.d;
          this.closest=i;
        }
      }
    }
    return this.closest;
  }


  ringScore(){
    if(this.zone==5)return 0;
    this.sum=0;
    this.sum+=this.rings[0];
    this.sum+=(this.rings[1]+this.rings[2])*3;
    this.sum+=(this.rings[3]+this.rings[4])*10;
    //if((this.zone<2&&(this.id==2||this.id==3))||(this.zone>2&&(this.id==0||this.id==1)))this.sum=0;
    return this.sum;
  }

  ringScoreLRT(){
    if(this.zone==5)return 0;
    this.sum=0;
    for(let i=1;i<5;i++){
      if(this.rings[i]>=4)this.sum+=4*((floor((i+1)*0.5)-1)*7+3);
      else if(this.rings[i]>=1)this.sum+=1*((floor((i+1)*0.5)-1)*7+3);
    }
    return this.sum;
  }

  setAtNode(mNode){
    this.x=mNode.x;
    this.y=mNode.y;
  }

  drawIcons(){
    push();
    translate(this.zoneButtons[0].x*screenScale,this.zoneButtons[0].y*screenScale);
    this.drawPlat(red.medium);
    pop();

    push();
    translate(this.zoneButtons[1].x*screenScale,this.zoneButtons[1].y*screenScale);
    this.drawHouse(red.light2);
    pop();

    push();
    translate(this.zoneButtons[2].x*screenScale,this.zoneButtons[2].y*screenScale);
    this.drawNeut(yellow.light2);
    pop();

    push();
    translate(this.zoneButtons[3].x*screenScale,this.zoneButtons[3].y*screenScale);
    this.drawHouse(blue.light2);
    pop();

    push();
    translate(this.zoneButtons[4].x*screenScale,this.zoneButtons[4].y*screenScale);
    this.drawPlat(blue.medium);
    pop();
  }

  drawNeut(iconColor){
    strokeWeight(3*screenScale);
    noFill();
    stroke(iconColor);
    scaledEllipse(0,0,33,33,3);
    fill(iconColor);
    noStroke();
    scaledRect(0,0,17,4.75,0,0,0,0,3);
  }

  drawPlat(iconColor){
    strokeWeight(3*screenScale);
    noFill();
    stroke(iconColor);
    scaledRect(0,0,25,40,7,7,7,7,3);
    noStroke();
    fill(iconColor);
    simpleRect(0,-15,15,1.5);
    simpleRect(0,-11,15,3);
    simpleRect(0,-6, 15,4);
    simpleRect(0,0,15,5);
    simpleRect(0,6,15,4);
    simpleRect(0,11,15,3);
    simpleRect(0,15,15,1.5);
  }

  drawHouse(iconColor){
    stroke(iconColor);
    noFill();
    beginShape();
    vertex(0, -14*screenScale);
    vertex(14*screenScale, 0);
    vertex(10*screenScale, 0);
    vertex(10*screenScale, 13*screenScale);
    vertex(-10*screenScale, 13*screenScale);
    vertex(-10*screenScale, 0);
    vertex(-14*screenScale, 0);
    vertex(0, -14*screenScale);
    endShape();
    fill(iconColor);
    beginShape();
    vertex(-1.5*screenScale,13*screenScale);
    vertex(-1.5*screenScale,4*screenScale);
    vertex(1.5*screenScale,4*screenScale);
    vertex(1.5*screenScale,13*screenScale);
    vertex(-2*screenScale,13*screenScale);
    endShape();
    beginShape();
    vertex(7*screenScale,-7*screenScale);
    vertex(7*screenScale,-11*screenScale);
    vertex(9*screenScale,-11*screenScale);
    vertex(9*screenScale,-5*screenScale);
    vertex(7*screenScale,-7*screenScale);
    endShape();
  }

  drawMogo() {

    if(mogoSelected==-1||this.id==mogoSelected){
    //if(this.id==0&&mouseIsPressed){
    //  console.log("goal 0");
    //}
    strokeWeight(3*screenScale);
    push();
    if(this.dragging==false){
    }

    this.mogoButton.x=this.x;
    this.mogoButton.y=this.y;
    if(mogoSelected==-1&&dragging==false){
      this.mogoButton.updateButton();

    }

    mogoScale=1;
    comboScale=1;

    if(mogoSelected==-1){
      if(this.dragged){
        translate(translatedMouseX*screenScale,translatedMouseY*screenScale);
      }
      else translate(this.x*screenScale, this.y*screenScale);
      //scale(0.5);
      mogoScale=0.5;
    }
    else{
      if(this.id==5)translate(0,125*screenScale);
      else translate(0,75*screenScale);
      //scale(1.5);
      mogoScale=1.5;
    }

    if(this.mogoButton.clicked){
      mogoSelected=this.id;
    }

    translate(0, -50*screenScale*mogoScale);
    push();
    mogoScale*=1.4;
    comboScale=mogoScale*screenScale;
    //scale(1.4);

/*
    if(this.scored.toggled){
      push();
      fill(180);
      noStroke();
      translate(0,50);
      rotate(QUARTER_PI*0.5);
      rect(0,0,100,10);
      rotate(-QUARTER_PI);
      rect(0,0,100,10);
      pop();
    }
    */


    translate(0, -14*comboScale);
    fill(10);
    stroke(10);
    simpleRect(0, 58*mogoScale, 65*mogoScale, 20*mogoScale);
    scaledEllipse(0, 68*mogoScale, 65*mogoScale, 30*mogoScale,3*mogoScale);

    strokeWeight(0.5*comboScale);
    stroke(this.c.dark2);
    fill(this.c.dark2);
    beginShape();
    vertex(-22*comboScale, 67*comboScale);
    vertex(-40*comboScale, 50*comboScale);
    vertex(-40*comboScale, 60*comboScale);
    vertex(-22*comboScale, 77*comboScale);
    vertex(-22*comboScale, 67*comboScale);
    endShape();

    stroke(this.c.dark1);
    fill(this.c.dark1);
    beginShape();
    vertex(-22*comboScale, 67*comboScale);
    vertex(22*comboScale, 67*comboScale);
    vertex(22*comboScale, 77*comboScale);
    vertex(-22*comboScale, 77*comboScale);
    vertex(-22*comboScale, 67*comboScale);
    endShape();

    stroke(this.c.medium);
    fill(this.c.medium);
    beginShape();
    vertex(22*comboScale, 67*comboScale);
    vertex(40*comboScale, 50*comboScale);
    vertex(40*comboScale, 60*comboScale);
    vertex(22*comboScale, 77*comboScale);
    vertex(22*comboScale, 67*comboScale);
    endShape();

    stroke(this.c.light1);
    fill(this.c.light1);
    beginShape();
    scaledEllipse(0, 40*mogoScale, 60*mogoScale, 30*mogoScale);
    vertex(29*comboScale, 36*comboScale);
    vertex(40*comboScale, 50*comboScale);
    vertex(22*comboScale, 67*comboScale);
    vertex(-22*comboScale, 67*comboScale);
    vertex(-40*comboScale, 50*comboScale);
    vertex(-29*comboScale, 36*comboScale);
    endShape();


    stroke(this.c.dark3);

    fill(this.c.dark3);
    scaledEllipse(0, 50*mogoScale, 60*mogoScale, 30*mogoScale);

    stroke(this.c.light1);
    noFill();
    strokeWeight(11*comboScale);
    scaledArc(0, 45*mogoScale, 66*mogoScale, 30*mogoScale, 0.11, PI-0.11,11*mogoScale);
    strokeWeight(2*comboScale);

    noFill();
    stroke(this.c.light2);
    strokeWeight(1*comboScale);
    scaledEllipse(0, 40*mogoScale, 60*mogoScale, 30*mogoScale,1*mogoScale);

    mogoScale/=1.4;
    comboScale/=1.4;
    pop();

    if((!this.dragged&&this.zone!=5)||(this.dragged&&translatedMouseY>-160)||mogoSelected!=-1){
    if(settingButtons[2].toggled&&mogoSelected==-1){
      fill(230,230,240);
      stroke(purple.dark2);
      strokeWeight(10*comboScale);
      //textFont(regular,45);
      if(appState!=3)scaledText(this.ringScore(),0,25*mogoScale,regular,45*mogoScale);
      else scaledText(this.ringScoreLRT(),0,25*mogoScale,regular,45*mogoScale);
      //text((this.rings[0]+this.rings[1]+this.rings[2]+this.rings[3]+this.rings[4]),0,25)
    }
    else {

    this.drawRingsA();

    if(this.type==0){
      fill(80);
      stroke(50);
      stroke(80);
      strokeWeight(2*comboScale);
      scaledEllipse(0, 50*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
      stroke(80);
      simpleRect(0, 12.5*mogoScale, 10*mogoScale, 75*mogoScale);
      stroke(50);
      scaledLine(-5*mogoScale, 50*mogoScale, -5*mogoScale, -25*mogoScale);
      stroke(110);
      scaledLine(5*mogoScale, 50*mogoScale, 5*mogoScale, -25*mogoScale);
      fill(50);
      scaledEllipse(0, -25*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
    }

    if (this.type!=0) {
      fill(80);
      stroke(50);
      stroke(80);
      strokeWeight(2*comboScale);
      scaledEllipse(0, 50*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
      stroke(80);
      simpleRect(0, 0, 10*mogoScale, 100*mogoScale);
      stroke(50);
      scaledLine(-5*mogoScale, 50*mogoScale, -5*mogoScale, -50*mogoScale);
      stroke(110);
      scaledLine(5*mogoScale, 50*mogoScale, 5*mogoScale, -50*mogoScale);
      fill(50);
      scaledEllipse(0, -50*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);


      if (this.type==2) {
        push();
        translate(0, -100*comboScale);

        strokeWeight(2*comboScale);
        fill(80);
        stroke(50);
        stroke(80);
        scaledEllipse(0, 50*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
        stroke(80);
        simpleRect(0, 0, 10*mogoScale, 100*mogoScale);
        stroke(50);
        scaledLine(-5*mogoScale, 50*mogoScale, -5*mogoScale, -50*mogoScale);
        stroke(110);
        scaledLine(5*mogoScale, 50*mogoScale, 5*mogoScale, -50*mogoScale);
        fill(50);
        scaledEllipse(0, -50*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
        stroke(20);
        fill(25);
        beginShape();
        //vertex(-9,-43);
        vertex(-8*comboScale, -43*comboScale);
        vertex(-16*comboScale, -51*comboScale);
        vertex(-16*comboScale, -57*comboScale);
        vertex(-12.5*comboScale, -62*comboScale);
        vertex(12.5*comboScale, -62*comboScale);
        vertex(16*comboScale, -57*comboScale);
        vertex(16*comboScale, -51*comboScale);
        //vertex(9,-43);
        //vertex(-9,-43);
        vertex(8*comboScale, -43*comboScale);
        vertex(-8*comboScale, -43*comboScale);
        endShape();
        stroke(80);
        fill(80);
        push();
        translate(-26*comboScale, -67*comboScale);
        rotate(-53*PI/180);
        simpleRect(0, 0, 10*mogoScale, 30*mogoScale);
        stroke(50);
        scaledLine(-5*mogoScale, -15*mogoScale, -5*mogoScale, 15*mogoScale);
        stroke(110);
        scaledLine(5*mogoScale, -15*mogoScale, 5*mogoScale, 15*mogoScale);
        fill(50);
        scaledEllipse(0, -15*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
        pop();

        push();
        translate(26*comboScale, -67*comboScale);
        rotate(53*PI/180);
        fill(80);
        stroke(80);
        simpleRect(0, 0, 10*mogoScale, 30*mogoScale);
        stroke(50);
        scaledLine(5*mogoScale, -15*mogoScale, 5*mogoScale, 15*mogoScale);
        stroke(110);
        scaledLine(-5*mogoScale, -15*mogoScale, -5*mogoScale, 15*mogoScale);
        //fill(50);
        //ellipse(0, -15, 10, 5);
        scaledArc(0, -15*mogoScale, 10*mogoScale, 5, PI, TWO_PI);
        pop();
        pop();
      }



      stroke(20);
      fill(25);
      beginShape();
      //vertex(-9,-43);
      vertex(-8*comboScale, -43*comboScale);
      vertex(-16*comboScale, -51*comboScale);
      vertex(-16*comboScale, -57*comboScale);
      vertex(-12.5*comboScale, -62*comboScale);
      vertex(12.5*comboScale, -62*comboScale);
      vertex(16*comboScale, -57*comboScale);
      vertex(16*comboScale, -51*comboScale);
      //vertex(9,-43);
      //vertex(-9,-43);
      vertex(8*comboScale, -43*comboScale);
      vertex(-8*comboScale, -43*comboScale);
      endShape();
      stroke(80);
      fill(80);
      push();
      translate(-26*comboScale, -67*comboScale);
      rotate(-53*PI/180);
      simpleRect(0, 0, 10*mogoScale, 30*mogoScale);
      stroke(50);
      scaledLine(-5*mogoScale, -15*mogoScale, -5*mogoScale, 15*mogoScale);
      stroke(110);
      scaledLine(5*mogoScale, -15*mogoScale, 5*mogoScale, 15*mogoScale);
      fill(50);
      scaledEllipse(0, -15*mogoScale, 10*mogoScale, 5*mogoScale,2*mogoScale);
      pop();

      push();
      translate(26*comboScale, -67*comboScale);
      rotate(53*PI/180);
      fill(80);
      stroke(80);
      simpleRect(0, 0, 10*mogoScale, 30*mogoScale);
      stroke(50);
      scaledLine(5*mogoScale, -15*mogoScale, 5*mogoScale, 15*mogoScale);
      stroke(110);
      scaledLine(-5*mogoScale, -15*mogoScale, -5*mogoScale, 15*mogoScale);
      //fill(50);
      //ellipse(0, -15, 10, 5);
      scaledArc(0, -15*mogoScale, 10*mogoScale, 5*mogoScale, PI, TWO_PI,2*mogoScale);
      pop();
    }

    this.drawRingsB();
    }
    if(this.scored.toggled&&mogoSelected==-1){
      push();
      translate(0,50*comboScale);
      strokeWeight(15*comboScale);
      noFill();
      stroke(10,10,15);
      scaledEllipse(0,0,110*mogoScale,90*mogoScale,15*mogoScale);

      fill(10,10,15);
      noStroke();
      rotate(QUARTER_PI*0.75);
      //rect(0,0,110,15,2);
      rotate(-QUARTER_PI*1.5);
      rect(0,0,110*comboScale,15*comboScale,2*comboScale);
      pop();
    }
    }
    pop();
  }
  }


  drawRingBack() {
    push();
    //scale(0.8);
    comboScale*=0.8;
    mogoScale*=0.8;
    noFill();
    //stroke(r, g, b);
    stroke(purple.medium);
    //strokeWeight(10);
    scaledArc(0, 0, 40*mogoScale, 30*mogoScale, PI, TWO_PI,10*mogoScale);
    //strokeWeight(2);
    stroke(purple.light3);
    //stroke(r+light, g+light, b+light);
    scaledArc(0, 0, (50-2)*mogoScale, (40-2)*mogoScale, PI+0.5, TWO_PI-0.5,2*mogoScale);
    //stroke(r-dark, g-dark, b-dark);
    stroke(purple.dark3);
    scaledArc(0, 0, (30+2)*mogoScale, (20+2)*mogoScale, PI+0.5, TWO_PI-0.5,2*mogoScale);
    comboScale/=0.8;
    mogoScale/=0.8;
    pop();
  }

  drawRingFront() {
    push();
    //scale(0.8);
    comboScale*=0.8;
    mogoScale*=0.8;
    noFill();
    //stroke(r, g, b);
    stroke(purple.medium);
    //strokeWeight(10);
    scaledArc(0, 0, 40*mogoScale, 30*mogoScale, 0, PI,10*mogoScale);
    //stroke(r-dark, g-dark, b-dark);
    stroke(purple.dark3);
    //strokeWeight(2);
    scaledArc(0, 0, (50-2)*mogoScale, (40-2)*mogoScale, 0-0.08+0.5, PI+0.08-0.5,2*mogoScale);
    //stroke(r+light, g+light, b+light);
    stroke(purple.light3);
    scaledArc(0, 0, (30+2)*mogoScale, (20+2)*mogoScale, 0-0.08+0.5, PI+0.08-0.5,2*mogoScale);
    comboScale/=0.8;
    mogoScale/=0.8;
    pop();
  }

  drawRingsA() {
    for(let i=0;i<this.rings[0];i++){
      if(i<5){
        push();
        translate(-30*comboScale,(25-8.3*i)*comboScale);
        rotate(0.6);
        this.drawRingBack();
        pop();
      }
      else if(i<10){
        push();
        translate(30*comboScale,(25-8.3*(i-5))*comboScale);
        rotate(-0.6);
        this.drawRingBack();
        pop();
      }
    }
    for (let i=0; i<this.rings[2]; i++) {
      push();
      translate((16+7*(this.rings[2]-i-1))*comboScale, (-50-5-5*(this.rings[2]-i-1))*comboScale);
      rotate(-0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
    for(let i=0;i<this.rings[4];i++){
      push();
      translate((16+7*(this.rings[4]-i-1))*comboScale, (-150-5-5*(this.rings[4]-i-1))*comboScale);
      rotate(-0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
    for (let i=0; i<this.rings[1]; i++) {
      if (this.type==0) {
        push();
        translate(0, (39-8.3*i)*comboScale);
        rotate(0.2);
        this.drawRingBack();
        pop();
      } else {
        push();
        translate((-16-7*i)*comboScale, (-50-5-5*i)*comboScale);
        rotate(0.2-0.5*PI);
        this.drawRingBack();
        pop();
      }
    }
    for (let i=0; i<this.rings[3]; i++) {
      push();
      translate((-16-7*i)*comboScale, (-150-5-5*i)*comboScale);
      rotate(0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
  }

  drawRingsB() {
    for(let i=0;i<this.rings[0];i++){
      if(i<5){
        push();
        translate(-30*comboScale,(25-8.3*i)*comboScale);
        rotate(0.6);
        this.drawRingFront();
        pop();
      }
      else if(i<10){
        push();
        translate(30*comboScale,(25-8.3*(i-5))*comboScale);
        rotate(-0.6);
        this.drawRingFront();
        pop();
      }
    }
    for (let i=0; i<this.rings[2]; i++) {
      push();
      translate((16+7*(this.rings[2]-i-1))*comboScale, (-50-5-5*(this.rings[2]-i-1))*comboScale);
      rotate(-0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for(let i=0;i<this.rings[4];i++){
      push();
      translate((16+7*(this.rings[4]-i-1))*comboScale, (-150-5-5*(this.rings[4]-i-1))*comboScale);
      rotate(-0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for (let i=0; i<this.rings[1]; i++) {
      if (this.type==0) {
        push();
        translate(0, (39-8.3*i)*comboScale);
        rotate(0.2);
        this.drawRingFront();
        pop();
      } else {
        push();
        translate((-16-7*i)*comboScale, (-50-5-5*i)*comboScale);
        rotate(0.2-0.5*PI);
        this.drawRingFront();
        pop();
      }
    }
    for(let i=0;i<this.rings[3];i++){
      push();
      translate((-16-7*i)*comboScale,(-150-5-5*i)*comboScale);
      rotate(0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for(let i=10;i<this.rings[0];i++){
      if(i<15){
        push();
        translate(-22*comboScale,(42-8.3*(i-10))*comboScale);
        rotate(0.4);
        this.drawRingBack();
        this.drawRingFront();
        pop();
      }
      else{
        push();
        translate(22*comboScale,(42-8.3*(i-15))*comboScale);
        rotate(-0.4);
        this.drawRingBack();
        this.drawRingFront();
        pop();
      }
    }
  }
}





class Platform{
  constructor(x_,y_,c_){
  this.x=x_;
  this.y=y_;
  this.c=c_;
  this.balanced=false;
  }

  drawPlatform(){
    push();
    translate(this.x*screenScale,this.y*screenScale);
    //scale(1.2);
    strokeWeight(10.8);
    stroke(20);
    noFill();
    scaledArc(-15,-45,18,18,PI,PI+HALF_PI,10.8);
    scaledArc(15,-45,18,18,PI+HALF_PI,TWO_PI,10.8);
    scaledArc(15,45,18,18,0,HALF_PI,11);
    scaledArc(-15,45,18,18,HALF_PI,PI,10.8);

    noStroke();
   fill(20);
   simpleRect(24,6,15.6,30);
   simpleRect(-24,6,15.6,30);

    //fill(this.c.light1);
    fill(this.c.dark1);
    noStroke();
    simpleRect(0,-54,27.6,10.8);
    simpleRect(0,54,27.6,10.8);
    simpleRect(24,0,10.8,87.6);
    simpleRect(-24,0,10.8,87.6);

    fill(20);
    simpleRect(24,0,13.2,18);
    simpleRect(-24,0,13.2,18);
    scaledEllipse(-24,43.8,10.8,5.4,10.8);
    scaledEllipse(24,43.8,10.8,5.4,10.8);

    //fill(this.c.light1);
    fill(this.c.dark1);
    scaledEllipse(-24,9,10.8,5.4,10.8);
    scaledEllipse(24,9,10.8,5.4,10.8);
    scaledEllipse(-24,-43.8,10.8,5.4,10.8);
    scaledEllipse(24,-43.8,10.8,5.4,10.8);

    noStroke();
    fill(140,20);
    simpleRect(0,0,62.4,138);

    //fill(this.c.light1);
    fill(this.c.dark1);
    noStroke();

    for(let i=0;i<9;i++){
      simpleRect(0,i*3.4*1.2,24,16/(i+5)*1.2);
      simpleRect(0,-i*3.4*1.2,24,16/(i+5)*1.2);
    }

    pop();
  }
}
