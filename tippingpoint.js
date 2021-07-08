let version="0.1.0"

let yellow; //Color Presets
let purple;
let red;
let blue;
let green;

let screenScale=1;

let gear; //Gear Icon image

let regular;  //Fonts
let semibold;
let bold;

let matchField; //Field Objects
let skillsField;
let fields=[];
let lrt;

let appState=0;

let menuButtons=[]; //Menu Buttons
let backButton;

let smallBack;
let mediumBack;
let largeBack;
let settingButtons=[];
let linkButtons=[];

let warningButton;
let warningExit;
let warned=false;

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


  menuButtons[0]=new Button(0,-100,300,130,"MATCH");
  menuButtons[1]=new Button(0,55,300,130,"SKILLS");
  menuButtons[2]=new Button(0,210,300,130,"REMOTE");
  menuButtons[3]=new Button(-155,-300,0,0,"?");
  menuButtons[3].tSize=25;
  menuButtons[3].setColors(color(40,40,45),0,0,0,0,0,color(150));
  menuButtons[4]=new Button(155,-300,55,55,"");
  menuButtons[4].setColors(color(40,40,45),0,0,0,0,0,color(150));

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

  settingButtons[0]=new Button(0,-100,300,65,"Ring Counters: Fancy")
  settingButtons[0].setExtraData(2,"Ring Counters: Simple",20);
  settingButtons[1]=new Button(0,0,300,65,"Ring Counters: Left");
  settingButtons[1].setExtraData(2,"Ring Counters: Right",20);

  linkButtons[0]=new Button(0,100,200,65,"Join Server");
  linkButtons[0].setColors(color(88, 101, 242),color(73, 86, 222),0,0,0,0,0)
  linkButtons[0].tSize=20;

  hideRings=new Button(135,-280,75,75,"Hide\nRings");
  hideRings.setExtraData(2,"Show\nRings",17);

  warningButton=new Button(0,43-7.5-5,340,667-86-15-10,"This scoring app is still\nin development, and\nmay not always be in\nagreement with the\nofficial game manual.\n\nUse at your own risk.\n\n");
  warningButton.setColors(red.dark4,red.dark4,0,0,0,0,color(230,230,240));
  warningButton.tSize=20;

  warningExit=new Button(0,210,200,80,"Proceed");
  warningExit.setColors(red.dark1,red.dark2,0,0,0,0,color(230,230,240));
  warningExit.setExtraData(2,"Proceed",25);



  let counterSave = getItem('counterSave');
  if(!(counterSave===null)){
    settingButtons[0].toggled=counterSave;
  }
  let cSideSave = getItem('cSideSave');
  if(!(cSideSave===null)){
    settingButtons[1].toggled=cSideSave;
  }
  disableHover=isTouchDevice();
  //console.log(disableHover);
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

  background(40,40,45);
  push();
  translate(width*0.5,height*0.5);
  scale(screenScale);
  if(appState!=0&&!warningExit.toggled){
    warningExit.updateButton();
    warningButton.updateButton();
    initialDragging=false;
    dragging=false;
  }
  if(appState==0){  //Main Menu
    updateMenu();
  }
  else if(appState==1){ //Match
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Match", 0,-290);
    updateMatch();
  }
  else if(appState==2){ //Skills
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Skills", 0,-290);
    updateSkills();
  }
  else if(appState==3){ //Remote
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Remote", 0,-290);
    updateRemote();
  }
  else if(appState==4){
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Info", 0,-290);
    fill(100);
    textSize(15);
    text("Version "+version,0,290);
    updateInfo();
  }
  else if(appState==5){
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Settings", 0,-290);
    updateSettings();
  }
  if(appState!=0&&!warningExit.toggled){
    //fill(red.dark5);
    //noStroke();
    //rect(0,43-7.5,340,667-86-15);
    warningButton.drawButton();
    warningExit.drawButton();
    textFont(bold,30);
    fill(230,230,240);
    noStroke();
    text("WARNING!",0,-170);
  }

  if(appState!=0){
    backButton.updateButton();

    if(mogoSelected==5)smallBack.updateButton();
    else mediumBack.updateButton();
    //else largeBack.updateButton();
    if(backButton.clicked||smallBack.clicked||mediumBack.clicked){//||largeBack.clicked){
      if(remoteFieldSelected!=0&&mogoSelected==-1){
        lrt.fieldButtons[remoteFieldSelected-1].toggled=false;
      }
      else if(mogoSelected==-1)appState=0;
      else mogoSelected=-1;
    }
    smallBack.clicked=false;
    mediumBack.clicked=false;
    //largeBack.clicked=false;
  }

  pop();

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
  postClick=(postClick+1)%3;
  if (!mouseIsPressed && held &&!dragging) click = true;
  held = mouseIsPressed;
  if(click)postClick=1;

  initialDragging=false;
  finalDragging=false;
  if(!click&&held&&(abs(pressX-translatedMouseX)>3||abs(pressY-translatedMouseY)>3)){
    if(!dragging){
      initialDragging=true;
    }
    dragging=true;
  }
  else {
    if(dragging){
      finalDragging=true;
    }
    dragging=false;
  }
}

function updateMenu(){
  textFont(regular,30);
  fill(200);
  noStroke();
  text("Tipping Point\nScoring App",0,-265);
  //textFont(regular,15);
  //fill(150);
  //text("By Chris Reimer",0,-200);
  textFont(regular,25);
  fill(red.light3);
  text("BETA "+version,0,-200);
  for(let i=0;i<5;i++){
    menuButtons[i].updateButton();
    if(menuButtons[i].clicked)appState=i+1;
  }
  backButton.updateButton();
  if(backButton.clicked){
    window.open("https://vexscoring.app/","_self");
  }
  image(gear,155,-300,40,40);
}

function updateMatch(){
  matchField.updateField();
}

function updateSkills(){
  skillsField.updateField();
}

function updateRemote(){
  lrt.updateLRT();
  /*
  textFont(regular,30);
  fill(220,220,230);
  noStroke();
  text("Coming\nSoon",0,0);
  */
}

function updateInfo(){
  fill(210);
  textSize(17);
  text("This app is still in development,\nand may require you to manually\nclear the cache to be updated.\n\nThis site is a Progressive Web App,\nand can be downloaded to the\nhome screen using the share\nbutton on iOS, or through the\npop-up window on Android.\n\nBugs and Suggestions\ncan be submitted in\nour discord server.",0,-110);
  linkButtons[0].updateButton();
  if(linkButtons[0].clicked){
    window.open("https://discord.gg/PFMRPrhdmQ");
  }
  //textFont(17);
  //text("https://discord.gg/PFMRPrhdmQ",0,40);
  //text("This website is setup as a\nProgressive Web App (PWA).\nThis means that it can be\ninstalled as an application\non mobile devices, and\nwill run while offline.\n\nOn Android devices there\nwill be an automatic pop-up\nasking if you want to add\nit to the Home Screen.\n\nTo download on iOS,\ntap the share button,\n(A square with an arrow\npointing up) and then\ntap 'Add to Home Screen'.",xC,yC-190*sF)
}

function updateSettings(){
  for(let i=0;i<settingButtons.length;i++){
    settingButtons[i].updateButton();
  }
  if(settingButtons[0].clicked)storeItem('counterSave',settingButtons[0].toggled);
  if(settingButtons[1].clicked)storeItem('cSideSave',settingButtons[1].toggled);
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
    textFont(regular,this.tSize);
    strokeWeight(this.sWeight);
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
      rect(this.x,this.y,this.w,this.h,15);
      fill(this.textColor);
      noStroke();
      text(this.textB,this.x,this.y-4);
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
      rect(this.x,this.y,this.w,this.h,15);
      fill(this.textColor);
      noStroke();
      text(this.textA,this.x,this.y-4);
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
    this.zoneMogos=[[],[],[],[],[]] //0=Red Platform, 1=Red Home Zone, 2=Neutral Zone, 3=Blue Home Zone, 4=Blue Platform
    this.draggedMogo=-1;
    this.mogoDrawList=[];
    this.parkedBots; //1=Red Bots Parked, 2=Blue Bots Parked
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
    this.awp.setColors(0,0,0,0,0,color(210),0);
    this.reset=new Button(102,246,122-6,120,"FIELD\nRESET");
    this.skillsReset=new Button(130,246,60,120,"")

    this.platButtons=[];
    this.platButtons[0]=new Button(-102,246-32.5,122-6,55,"Unbalanced");
    this.platButtons[0].setExtraData(2,"Balanced",15);
    this.platButtons[0].setColors(0,0,0,0,0,red.light2,red.light2);
    this.platButtons[1]=new Button(-102,246+32.5,122-6,55,"Unbalanced");
    this.platButtons[1].setExtraData(2,"Balanced",15);
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

    this.nodes=[[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]],[[],[],[],[],[],[],[]]];

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

    for(let i=0;i<7;i++){
      for(let j=0;j<=i;j++){
        this.nodes[3][i][j]=new mogoNode(this.nodes[1][i][j].x*-1,this.nodes[1][i][j].y*-1,j);
        if(j==0||j==1)this.nodes[3][i][j].y-=5;
        this.nodes[4][i][j]=new mogoNode(this.nodes[0][i][j].x*-1,this.nodes[0][i][j].y*-1,j);
      }
    }




    this.autonWinner=0; //0=Tied, 1=Red, 2=Blue
    this.scores=[0,0,0,0];//1=Red, 2=Blue, 3=Skills
    this.zonePoints=[0,0,0];
  }


  updateField(){

    if(postClick==2)this.scoreField();


    if(mogoSelected==-1){ //Main Field Screen

      this.drawField();

      let highlight=-1;
      if(dragging&&this.draggedMogo!=-1){
        highlight=this.mogos[this.draggedMogo].findZone();
        noStroke();
        fill(30,240,30,30);
        if(highlight==1){
          rect(-125.5,0,64,138);
        }
        else if(highlight==3){
          rect(125.5,0,64,138);
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
          rect(-125.5,0,64,138);
        }
        else if(highlight==1){
          rect(-125.5,-113,64,88,12,0,0,0)
          rect(-125.5,113,64,88,0,0,0,12)
          //rect(-125.5,0,64,314,12,0,0,12);
          rect(-73.25,0,40.5,314)
        }
        else if(highlight==2){
          rect(0,0,106,314)
        }
        else if(highlight==3){
          rect(125.5,-113,64,88,0,12,0,0)
          rect(125.5,113,64,88,0,0,12,0)
          rect(73.25,0,40.5,314)
        }
        else if(highlight==4){
          rect(125.5,0,64,138);
        }

      }

      if(finalDragging&&this.draggedMogo!=-1){
        this.mogos[this.draggedMogo].setZone();
        this.draggedMogo=-1;
      }

      for(let i=0;i<this.mogoDrawList.length;i++){
        this.mogoDrawList[i].drawMogo();
      }

      if(this.draggedMogo!=-1)this.mogos[this.draggedMogo].drawMogo();
      //for(let i=0;i<this.nodes[0][6].length;i++){
        //this.nodes[1][6][i].drawNode();
      //}

      if(this.parked.toggled||appState==2){
        fill(30,30,35);
        stroke(30,30,35);
        strokeWeight(20);
        if(appState!=2)rect(0,246,320,120,15);

        strokeWeight(3);
        noFill();
        if(appState==2){
          stroke(40,40,45);
        }
        else stroke(30,30,35);
        rect(27-32.5,246+32.5,55,55,15);
        rect(27+32.5,246+32.5,55,55,15);

        if(this.platButtons[2].textA>0){
          stroke(red.light2);
          fill(red.light2);
          rect(27-32.5,246+32.5,55,55,15);
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
          strokeWeight(5);
          rect(27-32.5+13.75+0.75,246+32.5,26,55,0,15,15,0)
        }

        if(this.platButtons[3].textA>0){
          stroke(blue.light2);
          fill(blue.light2);
          strokeWeight(3);
          rect(27+32.5,246+32.5,55,55,15);
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
          strokeWeight(5);
          rect(27+32.5+13.75+0.75,246+32.5,26,55,0,15,15,0)
        }

        for(let i=0;i<4;i++){
          this.platButtons[i].updateButton();
          if(i>1){
            if(this.platButtons[i].clicked)this.platButtons[i].textA=(this.platButtons[i].textA+1)%3;
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
        textFont(regular,20);
        noStroke();
        text("Robots:",27,246-32.5);
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
          rect(-130,246-31.25,65,62.5,17.5,17.5,0,0);
        }
        if(this.platButtons[1].toggled){
          fill(blue.light1);
          rect(-130,246+31.25,65,62.5,0,0,17.5,17.5);
        }
      }
      if(appState!=2)this.parked.updateButton();
      if(!this.parked.toggled&&appState!=2){
        noStroke();
        fill(red.light1);
        textFont(bold,20);
        text(this.platButtons[2].textA,-130,246-35-3);
        fill(blue.light2);
        text(this.platButtons[3].textA,-130,246+35-3);

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

      if(warningExit.toggled)hideRings.updateButton();

      if(this.reset.clicked||this.skillsReset.clicked)this.resetField();
      if(appState==1){
        if(this.auton.clicked){
          this.autonWinner=(this.autonWinner+1)%3;
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
    else if(mogoSelected>=0){
      this.mogos[mogoSelected].editMogo();
    }
    if(mogoSelected!=5)this.displayScores();
  }

  displayScoresFull(){
    this.displayScores();
  }

  displayScores(){
    textFont(regular,50);
    noStroke();
    if(appState==1){
      fill(red.light2);
      text(this.scores[1],-55,-234);
      fill(blue.light2);
      text(this.scores[2],55,-234);
    }
    else if(appState==2){
      fill(yellow.light2);
      text(this.scores[3],0,-234);
    }

    else if(appState==3){
      //if(remoteFieldSelected==1)fill(red.light2);
      //else if(remoteFieldSelected==2)fill(blue.light2);
      textFont(regular,30);
      //text(this.scores[3],0,-252.5);
      fill(red.medium);
      text(this.zonePoints[0],-60,-255);
      fill(yellow.medium);
      text(this.zonePoints[1],0,-255);
      fill(blue.medium);
      text(this.zonePoints[2],60,-255);
    }

  }

  resetIcon(){
    push();
    translate(130,246);
    scale(0.7);
    stroke(210);
    strokeWeight(3);
    noFill();
    arc(0,0,30,30,PI+QUARTER_PI-0.1,TWO_PI+PI-QUARTER_PI-0.1);
    translate(-11.61,-9.49);
    line(0,0,0,-7.25);
    line(0,0,7,0.5);
    pop();
  }

  drawField(){
    stroke(180);
    strokeWeight(3);
    line(-53,-160,-53,160);
    line(53,-160,53,160);
    line(-3,-160,-3,160);
    line(3,-160,3,160);
    line(53,-107,106,-160);
    line(-53,107,-106,160);
    stroke(160);
    strokeWeight(5);
    noFill();
    rect(0,0,320,320,15);
  }

  scoreField(){
    this.scores=[0,0,0,0];
    this.zonePoints=[0,0,0,0];


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

      for(let i=4;i<7;i++){
        if(!this.mogos[i].scored.toggled&&(this.mogos[i].zone==1||(this.mogos[i].zone==0)))this.scores[1]+=this.mogos[i].ringScore();
        else if(!this.mogos[i].scored.toggled&&(this.mogos[i].zone==3||(this.mogos[i].zone==4)))this.scores[2]+=this.mogos[i].ringScore();
      }
    }

    //Mogo Zone Points
    for(let i=0;i<7;i++){
      if((this.mogos[i].zone==1||(this.mogos[i].zone==0&&!this.platButtons[0].toggled))&&this.mogos[i].id!=2&&this.mogos[i].id!=3&&!this.mogos[i].scored.toggled){
        this.scores[1]+=20;
      }
      else if((this.mogos[i].zone==3||(this.mogos[i].zone==4&&!this.platButtons[1].toggled))&&this.mogos[i].id!=0&&this.mogos[i].id!=1&&!this.mogos[i].scored.toggled){
        this.scores[2]+=20;
      }
    }


    //Platform Points
    if(this.platButtons[0].toggled){
      this.scores[1]+=this.platButtons[2].textA*30;
      for(let j=0;j<this.zoneMogos[0].length;j++){
        if(this.zoneMogos[0][j].id!=2&&this.zoneMogos[0][j].id!=3&&!this.zoneMogos[0][j].scored.toggled){
          this.scores[1]+=40;
        }
      }
    }
    if(this.platButtons[1].toggled){
      this.scores[2]+=this.platButtons[3].textA*30;
      for(let j=0;j<this.zoneMogos[4].length;j++){
        if(this.zoneMogos[4][j].id!=0&&this.zoneMogos[4][j].id!=1&&!this.zoneMogos[4][j].scored.toggled){
          this.scores[2]+=40;
        }
      }
    }
    }
    else if(appState==3){

        for(let i=0;i<7;i++){
          let rScore=this.mogos[i].ringScoreLRT();
          if(!this.mogos[i].scored.toggled){
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
        else if(this.mogos[i].zone==3){
          this.zonePoints[2]+=30;
        }
        else if(appState==3&&this.mogos[i].zone==2||(this.mogos[i].zone==4&&!this.platButtons[1].toggled)){
          this.zonePoints[1]+=10;
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
    return this.zonePoints;
  }

  resetField(){
    this.parkedBots=[0,0,0];
    this.scores=[0,0,0,0];
    this.autonWinner=0;
    this.auton=new Button(44-6-61-4,246,122-6,120,"Auton:\nTied",1);
    this.auton.sWeight=4;
    this.awp.toggled=false;
    this.parked.toggled=false;
    this.parked.x=-130;
    this.platButtons[0].toggled=false;
    this.platButtons[1].toggled=false;
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
    this.zoneMogos=[[],[],[],[],[]];

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
    }

    this.mogos[0].zoneButtons[1].toggled=true;
    this.mogos[1].zoneButtons[1].toggled=true;
    this.mogos[2].zoneButtons[3].toggled=true;
    this.mogos[3].zoneButtons[3].toggled=true;
    this.mogos[4].zoneButtons[2].toggled=true;
    this.mogos[5].zoneButtons[2].toggled=true;
    this.mogos[6].zoneButtons[2].toggled=true;

    this.updateMogoList();
  }

  updateMogoList(){
    this.mogoDrawList=[];
    //this.zoneMogos=[[],[],[],[],[]]

    //for(let i=0;i<7;i++){
      //if(!this.mogos[i].dragged)this.zoneMogos[this.mogos[i].zone].push(this.mogos[i]);
    //}

    for(let i=0;i<5;i+=2){
      for(let j=0;j<this.zoneMogos[i].length;j++){
        this.zoneMogos[i][j].setAtNode(this.nodes[i][this.zoneMogos[i].length-1][j]);
        this.mogoDrawList.push(this.zoneMogos[i][j]);
      }
    }
    for(let i=1;i<4;i+=2){
      for(let j=0;j<7;j++){
        if(this.zoneMogos[i][j]!=null){
          this.zoneMogos[i][j].setAtNode(this.nodes[i][6][j]);
          this.mogoDrawList.push(this.zoneMogos[i][j]);
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
    this.fieldButtons[0]=new Button(-80-5,-205,150,50,"Red");
    this.fieldButtons[0].setColors(0,0,0,0,0,color(red.light2),color(red.light2));
    this.fieldButtons[0].setExtraData(2,"Red",25);
    this.fieldButtons[1]=new Button(80+5,-205,150,50,"Blue");
    this.fieldButtons[1].setColors(0,0,0,0,0,color(blue.light2),color(blue.light2));
    this.fieldButtons[1].setExtraData(2,"Blue",25);
    this.lrtAuton=new Button(-85,246,150,120,"Auton:\nTie");
    this.lrtReset=new Button(85,246,150,120,"Reset\nFields");
    this.autonWinner=0; //0: Tied, 1:Red, 2:Blue
  }

  updateLRT(){

    if(postClick==2)this.scoreLRT();

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

    if(remoteFieldSelected==0){
      this.drawLRTField();
      this.drawLRTScore();
      this.lrtAuton.updateButton();
      if(this.lrtAuton.clicked){
        this.autonWinner=(this.autonWinner+1)%3;
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
    }
  }

  drawLRTField(){

    this.lrtHighLights();

    stroke(180);
    strokeWeight(3);
    line(-53,-160,-53,160);
    line(53,-160,53,160);
    stroke(160);
    strokeWeight(5);
    noFill();
    rect(0,0,320,320,15);
  }

  lrtHighLights(){
    noStroke();
    noFill();
    strokeWeight(10);
    if(this.lrtScores[0][0]>this.lrtScores[1][0])fill(red.dark5,50);
    else if(this.lrtScores[0][0]<this.lrtScores[1][0])fill(blue.dark5,50);
    rect(-125.5,0,64,314,12,0,0,12);
    rect(-73.25,0,40.5,314)
    if(remoteFieldSelected==0){
      rect(-125.5,0,64,314,12,0,0,12);
      rect(-73.25,0,40.5,314)
    }

    noFill();
    if(this.lrtScores[0][1]>this.lrtScores[1][1])fill(red.dark5,50)
    else if(this.lrtScores[0][1]<this.lrtScores[1][1])fill(blue.dark5,50);
    rect(0,0,106,314)
    if(remoteFieldSelected==0){
      rect(0,0,106,314)
    }

    noFill();
    if(this.lrtScores[0][2]>this.lrtScores[1][2])fill(red.dark5,50)
    else if(this.lrtScores[0][2]<this.lrtScores[1][2])fill(blue.dark5,50);
    rect(125.5,0,64,314,0,12,12,0);
    rect(73.25,0,40.5,314)
    if(remoteFieldSelected==0){
      rect(125.5,0,64,314,0,12,12,0);
      rect(73.25,0,40.5,314)
    }

  }

  drawLRTScore(){
    textFont(bold,30);
    strokeWeight(2);
    noStroke();
    fill(red.light2);
    if(this.lrtScores[0][0]>this.lrtScores[1][0]){
      stroke(240);
      fill(red.dark1);
    }
    text(this.lrtScores[0][0],-107,-134);

    noStroke();
    fill(blue.light2);
    if(this.lrtScores[0][0]<this.lrtScores[1][0]){
      stroke(240);
      fill(blue.dark1);
    }
    text(this.lrtScores[1][0],-107,-100);

    fill(red.light2);
    noStroke();
    if(this.lrtScores[0][1]>this.lrtScores[1][1]){
      stroke(240);
      fill(red.dark1);
    }
    text(this.lrtScores[0][1],0,-134);

    fill(blue.light2);
    noStroke();
    if(this.lrtScores[0][1]<this.lrtScores[1][1]){
      stroke(240);
      fill(blue.dark1);
    }
    text(this.lrtScores[1][1],0,-100);

    fill(red.light2);
    noStroke();
    if(this.lrtScores[0][2]>this.lrtScores[1][2]){
      stroke(240);
      fill(red.dark1);
    }
    text(this.lrtScores[0][2],107,-134);

    fill(blue.light2);
    noStroke();
    if(this.lrtScores[0][2]<this.lrtScores[1][2]){
      stroke(240);
      fill(blue.dark1);
    }
    text(this.lrtScores[1][2],107,-100);

    fill(45,45,50);
    strokeWeight(2);
    stroke(100,100,105);
    //noStroke();
    rect(0,35,200,210,15);
    fill(210);
    noStroke();
    textFont(regular,20);
    text("Match Points:",0,-50);
    text("Auton WP:",0,15);
    text("Total WP:",0,80);

    textFont(bold,30);
    if(this.rFields[0].scores[3]>this.rFields[1].scores[3]){
      stroke(240);
      fill(red.dark1);
    }
    else {
      noStroke();
      fill(red.light2);
    }
    text(this.rFields[0].scores[3],-40,-20);

    if(this.rFields[0].scores[3]<this.rFields[1].scores[3]){
      stroke(240);
      fill(blue.dark1);
    }
    else {
      fill(blue.light2);
      noStroke();
    }
    text(this.rFields[1].scores[3],40,-20);

    noStroke();
    fill(red.light2);
    text(int(this.rFields[0].awp.toggled),-40,45);
    fill(blue.light2);
    text(int(this.rFields[1].awp.toggled),40,45);

    fill(red.light2);
    text(this.lrtWP[0],-40,110);
    fill(blue.light2);
    text(this.lrtWP[1],40,110);
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

    if(settingButtons[1].toggled&&(settingButtons[0].toggled||this.id==0||mogoSelected<4)){
      this.x=this.xOriginal*-1;
      this.plus.x=this.xOriginal*-1;
      this.minus.x=this.xOriginal*-1;
    }
    fill(40,40,45);
    strokeWeight(3);
    stroke(purple.dark3);
    rect(this.x,this.y,50,94);
    textFont(regular,25);
    stroke(purple.medium);
    fill(230,230,240);
    if(settingButtons[0].toggled&&(this.id==1||this.id==3)){
      if(this.id==1){
        text((this.ringCount+fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]),this.x,this.y-3);
      }
      else if(this.id==3){
        text((this.ringCount+fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]),this.x,this.y-3);
      }
    }
    else text(this.ringCount,this.x,this.y-3);
    this.plus.updateButton();
    this.minus.updateButton();
    if(this.plus.clicked){
      this.ringCount++;
      let nPoleMax=7;
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
    else if(this.minus.clicked){
      this.ringCount--;
      if(this.ringCount<0){
        if(this.id==1&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[2]--;
        if(this.id==2&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[1]--;
        if(this.id==3&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[4]--;
        if(this.id==4&&fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]>0)fields[appState+remoteFieldSelected].mogos[mogoSelected].rings[3]--;
        this.ringCount=0;
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
    this.zoneButtons[0]=new Button(-130,265,55,55,"");
    this.zoneButtons[0].setExtraData(2,"",30);
    this.zoneButtons[0].setColors(0,0,0,0,0,red.medium,red.medium);
    this.zoneButtons[1]=new Button(-65,265,55,55,"");
    this.zoneButtons[1].setExtraData(2,"",30);
    this.zoneButtons[1].setColors(0,0,0,0,0,red.light2,red.light2);
    this.zoneButtons[2]=new Button(0,265,55,55,"");
    this.zoneButtons[2].setExtraData(2,"",30);
    this.zoneButtons[2].setColors(0,0,0,0,0,yellow.light1,yellow.light1);
    this.zoneButtons[3]=new Button(65,265,55,55,"");
    this.zoneButtons[3].setExtraData(2,"",30);
    this.zoneButtons[3].setColors(0,0,0,0,0,blue.light2,blue.light2);
    this.zoneButtons[4]=new Button(130,265,55,55,"");
    this.zoneButtons[4].setExtraData(2,"",30);
    this.zoneButtons[4].setColors(0,0,0,0,0,blue.medium,blue.medium);

    this.scored=new Button(130,200,55,55,"");
    this.scored.setExtraData(2,"",30);
    this.scored.setColors(0,0,0,0,green.light1,red.light2,0);
  }


  editMogo(){
    this.drawMogo();
    for(let i=0;i<this.ringCounters.length;i++){
      //if((settingButtons[0].toggled&&i!=2&&i!=4)||settingButtons[0].toggled==false)this.ringCounters[i].updateCounter(this.rings[i]);
      //this.rings[i]=this.ringCounters[i].ringCount;
      if((settingButtons[0].toggled&&i!=2&&i!=4)||settingButtons[0].toggled==false)this.rings[i]=this.ringCounters[i].updateCounter(this.rings[i]);
      if(i>0&&mogoSelected>3&&this.rings[i]>7)this.rings[i]=7
      if(i==1&&mogoSelected<=3&&this.rings[i]>11)this.rings[i]=11;
    }
    fill(30,30,35);
    stroke(30,30,35);
    strokeWeight(20);
    rect(0,265,55*5+40,55,15,0,15,15);

    if(settingButtons[1].toggled)this.scored.x=-130;
    else this.scored.x=130;
    rect(this.scored.x,this.scored.y,55,55,15,15,0,0);
    for(let i=0;i<5;i++){
      this.zoneButtons[i].updateButton();
      if(this.zoneButtons[i].clicked){
        for(let j=0;j<5;j++){
          this.zoneButtons[j].toggled=false;
        }
        this.zoneButtons[i].toggled=true;
        this.moveMogo(i);
      }
    }
    this.scored.updateButton();
    this.drawIcons();
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
    if(translatedMouseX<-125+31.2&&translatedMouseY<69&&translatedMouseY>-69){
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
    this.sum=0;
    this.sum+=this.rings[0];
    this.sum+=(this.rings[1]+this.rings[2])*3;
    this.sum+=(this.rings[3]+this.rings[4])*10;
    //if((this.zone<2&&(this.id==2||this.id==3))||(this.zone>2&&(this.id==0||this.id==1)))this.sum=0;
    return this.sum;
  }

  ringScoreLRT(){
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
    translate(this.zoneButtons[0].x,this.zoneButtons[0].y);
    this.drawPlat(red.medium);
    pop();

    push();
    translate(this.zoneButtons[1].x,this.zoneButtons[1].y);
    this.drawHouse(red.light2);
    pop();

    push();
    translate(this.zoneButtons[2].x,this.zoneButtons[2].y);
    this.drawNeut(yellow.light2);
    pop();

    push();
    translate(this.zoneButtons[3].x,this.zoneButtons[3].y);
    this.drawHouse(blue.light2);
    pop();

    push();
    translate(this.zoneButtons[4].x,this.zoneButtons[4].y);
    this.drawPlat(blue.medium);
    pop();

    push();
    translate(this.scored.x,this.scored.y);
    this.drawScored();
    pop();
  }

  drawScored(){
    stroke(green.light2);
    if(this.scored.toggled){
      translate(0,2);
      stroke(red.light2);
    }
    line(-17,17,17,17);
    strokeWeight(3);
    noFill();
    if(this.scored.toggled)translate(0,-7);
    beginShape();
    vertex(-9,15);
    vertex(-9,10);
    vertex(-11,10);
    vertex(-11,7);
    vertex(-8,3);
    vertex(8,3);
    vertex(11,7);
    vertex(11,10);
    vertex(9,10);
    vertex(9,15);
    vertex(-9,15);
    endShape();
    line(0,3,0,-10);
    line(0,-10,6,-14);
    line(0,-10,-6,-14);
  }

  drawNeut(iconColor){
    strokeWeight(3);
    noFill();
    stroke(iconColor);
    ellipse(0,0,33,33);
    fill(iconColor);
    noStroke();
    rect(0,0,17,4.75);
  }

  drawPlat(iconColor){
    strokeWeight(3);
    noFill();
    stroke(iconColor);
    rect(0,0,25,40,7);
    noStroke();
    fill(iconColor);
    rect(0,-15,15,1.5);
    rect(0,-11,15,3);
    rect(0,-6, 15,4);
    rect(0,0,15,5);
    rect(0,6,15,4);
    rect(0,11,15,3);
    rect(0,15,15,1.5);
  }

  drawHouse(iconColor){
    stroke(iconColor);
    noFill();
    beginShape();
    vertex(0, -14);
    vertex(14, 0);
    vertex(10, 0);
    vertex(10, 13);
    vertex(-10, 13);
    vertex(-10, 0);
    vertex(-14, 0);
    vertex(0, -14);
    endShape();
    fill(iconColor);
    beginShape();
    vertex(-1.5,13);
    vertex(-1.5,4);
    vertex(1.5,4);
    vertex(1.5,13);
    vertex(-2,13);
    endShape();
    beginShape();
    vertex(7,-7);
    vertex(7,-11);
    vertex(9,-11);
    vertex(9,-5);
    vertex(7,-7);
    endShape();
  }

  drawMogo() {
    //if(this.id==0&&mouseIsPressed){
    //  console.log("goal 0");
    //}
    strokeWeight(3);
    push();
    if(this.dragging==false){
    }

    this.mogoButton.x=this.x;
    this.mogoButton.y=this.y;
    if(mogoSelected==-1&&dragging==false){
      this.mogoButton.updateButton();

    }

    if(mogoSelected==-1){
      if(this.dragged){
        translate(translatedMouseX,translatedMouseY);
      }
      else translate(this.x, this.y);
      scale(0.5);
    }
    else{
      if(this.id==5)translate(0,125);
      else translate(0,75);
      scale(1.5);
    }

    if(this.mogoButton.clicked){
      mogoSelected=this.id;
    }

    translate(0, -50);
    push();
    scale(1.4);

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


    translate(0, -14);
    fill(10);
    stroke(10);
    rect(0, 58, 65, 20);
    ellipse(0, 68, 65, 30);

    strokeWeight(0.5);
    stroke(this.c.dark2);
    fill(this.c.dark2);
    beginShape();
    vertex(-22, 67);
    vertex(-40, 50);
    vertex(-40, 60);
    vertex(-22, 77);
    vertex(-22, 67);
    endShape();

    stroke(this.c.dark1);
    fill(this.c.dark1);
    beginShape();
    vertex(-22, 67);
    vertex(22, 67);
    vertex(22, 77);
    vertex(-22, 77);
    vertex(-22, 67);
    endShape();

    stroke(this.c.medium);
    fill(this.c.medium);
    beginShape();
    vertex(22, 67);
    vertex(40, 50);
    vertex(40, 60);
    vertex(22, 77);
    vertex(22, 67);
    endShape();

    stroke(this.c.light1);
    fill(this.c.light1);
    beginShape();
    ellipse(0, 40, 60, 30);
    vertex(29, 36);
    vertex(40, 50);
    vertex(22, 67);
    vertex(-22, 67);
    vertex(-40, 50);
    vertex(-29, 36);
    endShape();


    stroke(this.c.dark3);

    fill(this.c.dark3);
    ellipse(0, 50, 60, 30);

    stroke(this.c.light1);
    noFill();
    strokeWeight(11);
    arc(0, 45, 66, 30, 0.11, PI-0.11);
    strokeWeight(2);

    noFill();
    stroke(this.c.light2);
    strokeWeight(1);
    ellipse(0, 40, 60, 30);

    pop();


    if(hideRings.toggled&&mogoSelected==-1){
      fill(230,230,240);
      stroke(purple.dark2);
      strokeWeight(10);
      textFont(regular,45);
      if(appState!=3)text(this.ringScore(),0,25);
      else text(this.ringScoreLRT(),0,25);
      //text((this.rings[0]+this.rings[1]+this.rings[2]+this.rings[3]+this.rings[4]),0,25)
    }
    else {

    this.drawRingsA();

    fill(80);
    stroke(50);
    stroke(80);
    ellipse(0, 50, 10, 5);
    stroke(80);
    rect(0, 0, 10, 100);
    stroke(50);
    line(-5, 50, -5, -50);
    stroke(110);
    line(5, 50, 5, -50);
    fill(50);
    ellipse(0, -50, 10, 5);

    if (this.type!=0) {

      if (this.type==2) {
        push();
        translate(0, -100);


        fill(80);
        stroke(50);
        stroke(80);
        ellipse(0, 50, 10, 5);
        stroke(80);
        rect(0, 0, 10, 100);
        stroke(50);
        line(-5, 50, -5, -50);
        stroke(110);
        line(5, 50, 5, -50);
        fill(50);
        ellipse(0, -50, 10, 5);
        stroke(20);
        fill(25);
        beginShape();
        //vertex(-9,-43);
        vertex(-8, -43);
        vertex(-16, -51);
        vertex(-16, -57);
        vertex(-12.5, -62);
        vertex(12.5, -62);
        vertex(16, -57);
        vertex(16, -51);
        //vertex(9,-43);
        //vertex(-9,-43);
        vertex(8, -43);
        vertex(-8, -43);
        endShape();
        stroke(80);
        fill(80);
        push();
        translate(-26, -67);
        rotate(-53*PI/180);
        rect(0, 0, 10, 30);
        stroke(50);
        line(-5, -15, -5, 15);
        stroke(110);
        line(5, -15, 5, 15);
        fill(50);
        ellipse(0, -15, 10, 5);
        pop();

        push();
        translate(26, -67);
        rotate(53*PI/180);
        fill(80);
        stroke(80);
        rect(0, 0, 10, 30);
        stroke(50);
        line(5, -15, 5, 15);
        stroke(110);
        line(-5, -15, -5, 15);
        //fill(50);
        //ellipse(0, -15, 10, 5);
        arc(0, -15, 10, 5, PI, TWO_PI);
        pop();
        pop();
      }



      stroke(20);
      fill(25);
      beginShape();
      //vertex(-9,-43);
      vertex(-8, -43);
      vertex(-16, -51);
      vertex(-16, -57);
      vertex(-12.5, -62);
      vertex(12.5, -62);
      vertex(16, -57);
      vertex(16, -51);
      //vertex(9,-43);
      //vertex(-9,-43);
      vertex(8, -43);
      vertex(-8, -43);
      endShape();
      stroke(80);
      fill(80);
      push();
      translate(-26, -67);
      rotate(-53*PI/180);
      rect(0, 0, 10, 30);
      stroke(50);
      line(-5, -15, -5, 15);
      stroke(110);
      line(5, -15, 5, 15);
      fill(50);
      ellipse(0, -15, 10, 5);
      pop();

      push();
      translate(26, -67);
      rotate(53*PI/180);
      fill(80);
      stroke(80);
      rect(0, 0, 10, 30);
      stroke(50);
      line(5, -15, 5, 15);
      stroke(110);
      line(-5, -15, -5, 15);
      //fill(50);
      //ellipse(0, -15, 10, 5);
      arc(0, -15, 10, 5, PI, TWO_PI);
      pop();
    }

    this.drawRingsB();
    }
    if(this.scored.toggled&&mogoSelected==-1){
      push();
      translate(0,50);
      strokeWeight(15);
      noFill();
      stroke(10,10,15);
      ellipse(0,0,110,90);

      fill(10,10,15);
      noStroke();
      rotate(QUARTER_PI*0.75);
      //rect(0,0,110,15,2);
      rotate(-QUARTER_PI*1.5);
      rect(0,0,110,15,2);
      pop();
    }
    pop();
  }


  drawRingBack() {
    push();
    scale(0.8);
    noFill();
    //stroke(r, g, b);
    stroke(purple.medium);
    strokeWeight(10);
    arc(0, 0, 40, 30, PI, TWO_PI);
    strokeWeight(2);
    stroke(purple.light3);
    //stroke(r+light, g+light, b+light);
    arc(0, 0, 50-2, 40-2, PI+0.5, TWO_PI-0.5);
    //stroke(r-dark, g-dark, b-dark);
    stroke(purple.dark3);
    arc(0, 0, 30+2, 20+2, PI+0.5, TWO_PI-0.5);
    pop();
  }

  drawRingFront() {
    push();
    scale(0.8);
    noFill();
    //stroke(r, g, b);
    stroke(purple.medium);
    strokeWeight(10);
    arc(0, 0, 40, 30, 0, PI);
    //stroke(r-dark, g-dark, b-dark);
    stroke(purple.dark3);
    strokeWeight(2);
    arc(0, 0, 50-2, 40-2, 0-0.08+0.5, PI+0.08-0.5);
    //stroke(r+light, g+light, b+light);
    stroke(purple.light3);
    arc(0, 0, 30+2, 20+2, 0-0.08+0.5, PI+0.08-0.5);
    pop();
  }

  drawRingsA() {
    for(let i=0;i<this.rings[0];i++){
      if(i<5){
        push();
        translate(-30,25-8.3*i);
        rotate(0.6);
        this.drawRingBack();
        pop();
      }
      else if(i<10){
        push();
        translate(30,25-8.3*(i-5));
        rotate(-0.6);
        this.drawRingBack();
        pop();
      }
    }
    for (let i=0; i<this.rings[2]; i++) {
      push();
      translate(16+7*(this.rings[2]-i-1), -50-5-5*(this.rings[2]-i-1));
      rotate(-0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
    for(let i=0;i<this.rings[4];i++){
      push();
      translate(16+7*(this.rings[4]-i-1), -150-5-5*(this.rings[4]-i-1));
      rotate(-0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
    for (let i=0; i<this.rings[1]; i++) {
      if (this.type==0) {
        push();
        translate(0, 39-8.3*i);
        rotate(0.2);
        this.drawRingBack();
        pop();
      } else {
        push();
        translate(-16-7*i, -50-5-5*i);
        rotate(0.2-0.5*PI);
        this.drawRingBack();
        pop();
      }
    }
    for (let i=0; i<this.rings[3]; i++) {
      push();
      translate(-16-7*i, -150-5-5*i);
      rotate(0.2-0.5*PI);
      this.drawRingBack();
      pop();
    }
  }

  drawRingsB() {
    for(let i=0;i<this.rings[0];i++){
      if(i<5){
        push();
        translate(-30,25-8.3*i);
        rotate(0.6);
        this.drawRingFront();
        pop();
      }
      else if(i<10){
        push();
        translate(30,25-8.3*(i-5));
        rotate(-0.6);
        this.drawRingFront();
        pop();
      }
    }
    for (let i=0; i<this.rings[2]; i++) {
      push();
      translate(16+7*(this.rings[2]-i-1), -50-5-5*(this.rings[2]-i-1));
      rotate(-0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for(let i=0;i<this.rings[4];i++){
      push();
      translate(16+7*(this.rings[4]-i-1), -150-5-5*(this.rings[4]-i-1));
      rotate(-0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for (let i=0; i<this.rings[1]; i++) {
      if (this.type==0) {
        push();
        translate(0, 39-8.3*i);
        rotate(0.2);
        this.drawRingFront();
        pop();
      } else {
        push();
        translate(-16-7*i, -50-5-5*i);
        rotate(0.2-0.5*PI);
        this.drawRingFront();
        pop();
      }
    }
    for(let i=0;i<this.rings[3];i++){
      push();
      translate(-16-7*i,-150-5-5*i);
      rotate(0.2-0.5*PI);
      this.drawRingFront();
      pop();
    }
    for(let i=10;i<this.rings[0];i++){
      if(i<15){
        push();
        translate(-22,42-8.3*(i-10));
        rotate(0.4);
        this.drawRingBack();
        this.drawRingFront();
        pop();
      }
      else{
        push();
        translate(22,42-8.3*(i-15));
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
    translate(this.x,this.y);
    scale(1.2);
    strokeWeight(9);
    stroke(20);
    noFill();
    arc(-12.5,-37.5,15,15,PI,PI+HALF_PI);
    arc(12.5,-37.5,15,15,PI+HALF_PI,TWO_PI);
    arc(12.5,37.5,15,15,0,HALF_PI);
    arc(-12.5,37.5,15,15,HALF_PI,PI);

    noStroke();
   fill(20);
   rect(20,5,13,25);
   rect(-20,5,13,25);

    //fill(this.c.light1);
    fill(this.c.dark1);
    noStroke();
    rect(0,-45,23,9);
    rect(0,45,23,9);
    rect(20,0,9,73);
    rect(-20,0,9,73);

    fill(20);
    rect(20,0,11,15);
    rect(-20,0,11,15);
    ellipse(-20,36.5,9,4.5);
    ellipse(20,36.5,9,4.5);

    //fill(this.c.light1);
    fill(this.c.dark1);
    ellipse(-20,7.5,9,4.5);
    ellipse(20,7.5,9,4.5);
    ellipse(-20,-36.5,9,4.5);
    ellipse(20,-36.5,9,4.5);

    noStroke();
    fill(140,20);
    rect(0,0,52,115);

    //fill(this.c.light1);
    fill(this.c.dark1);
    noStroke();

    for(let i=0;i<9;i++){
      rect(0,i*3.4,20,16/(i+5));
      rect(0,-i*3.4,20,16/(i+5));
    }

    pop();
  }
}
