let version="0.0.6";

let fields = [] //=new Field[2];
let rField = [] //=new remoteField[2];
let menuB=[] //=new Button[4];
let back //back, settings, and info buttons
let set
let inf
let appState = 0; //0=menu,1=match,2=skills,3=remote,4=ORCAH
let goalSelected = -1; //-1=none,0-8=goal
let fieldSelected = -1;
let click = false;
let postClick = false;
let postClick2 = false;
let held = false;
let autonWinner = 0; //0=tie,1=red,2=blue

let regular;
let semibold;
let bold;

let sF=1; //Scale Factor
let pSF; //Previous Scale Factor
let xC=375/2; //Horizontal Center Position
let yC=667/2; //Vertical Center Position

let extraSize=0.81

let blueOffset = 0;
let labelsOn=false;
let labels=['A','B','C','D','E','F','G','H','I']
let labelToggle

let counterOn=false;
let counterToggle

let orcahAnalog=false;
let orcahToggle

let pGoalSelected=[0,0,0,0];
let pFieldSelected=[0,0]

let gear;
let gearFound=false;

function preload(){

  gear=loadImage('https://vexscoring.app/gear.png')
  regular=loadFont('https://vexscoring.app/NEXT%20ART_Regular.otf')
  semibold=loadFont('https://vexscoring.app/NEXT%20ART_SemiBold.otf')
  bold=loadFont('https://vexscoring.app/NEXT%20ART_Bold.otf')
}


function setup() {
  pixelDensity(2);
  //createCanvas(375, 667);
  //fullscreen()
  createCanvas(windowWidth, windowHeight);
  //fullScreen();
  //gear=loadImage("gear.png");
  //surface.setResizable(true);
  //size(700,700);
  let xf = width / 375.0;//Horizontal Scale Factor
  let yf = height / 667.0;//Vertical Scale Factor
  if (xf < yf) sF = xf;
  else sF = yf;
  pSF = sF;
  xC = width * 0.5;
  yC = height * 0.5;
  rectMode(CENTER);
  textAlign(CENTER);
  imageMode(CENTER);

  rField[0] = new remoteField(1);
rField[1] = new remoteField(2);
for (let i = 0; i < 2; i++) {
  fields[i] = new Field(0, 0);
  fields[i].resetField(i + 1);
}
rField[0].resetFields(-1, 3);
rField[1].resetFields(-1, 4);

menuB[0] = new Button(0, -100, 375 * 0.8, 667 * 0.2, 667 * 0.015, "Match", color(0, 0), color(210), 667 * 0.01, 375 * 0.08, color(50), color(45));
menuB[1] = new Button(0, 66.7, 375 * 0.8, 667 * 0.2, 667 * 0.015, "Skills", color(0, 0), color(210), 667 * 0.01, 375 * 0.08, color(50), color(45));
menuB[2] = new Button(-79.69, 233.45, 375 * 0.375, 667 * 0.2, 667 * 0.015, "Remote", color(0, 0), color(210), 667 * 0.01, 375 * 0.06, color(50), color(45));
menuB[3] = new Button(79.69, 233.45, 375 * 0.375, 667 * 0.2, 375 * 0.015, "ORCAH", color(0, 0), color(210), 667 * 0.01, 375 * 0.06, color(50), color(45));
back = new Button(-154.15, -300.15, 667 * 0.083, 667 * 0.083, 667 * 0.015, "«", color(0, 0), color(210), 667 * 0.02, 667 * 0.06, color(40), color(45));
set = new Button(154.15, -300.15, 667 * 0.083, 667 * 0.083, 667 * 0.015, "", color(0, 0), color(150), 667 * 0.015, 667 * 0.04, color(40), color(45));
inf = new Button(-154.15, -300.15, 667 * 0.083, 667 * 0.083, 667 * 0.015, "?", color(0, 0), color(150), 667 * 0.015, 667 * 0.04, color(40), color(45));
labelToggle = new Button(0, -100, 375 * 0.8, 667 * 0.1, 667 * 0.015, "Goal Labels: OFF", color(0, 0), color(210), 667 * 0.012, 375 * 0.059, color(50), color(45));
counterToggle = new Button(0, 0, 375 * 0.8, 667 * 0.1, 667 * 0.015, "Ball Counter: OFF", color(0, 0), color(210), 667 * 0.012, 375 * 0.059, color(50), color(45));
orcahToggle = new Button(0, 100, 375 * 0.8, 667 * 0.1, 667 * 0.015, "ORCAH Goals: Numbers", color(0, 0), color(210), 667 * 0.012, 375 * 0.059, color(50), color(45));

let labelSave = getItem('labelSave');
if(!(labelSave===null)){
  labelsOn=labelSave;
  if(labelsOn){
    labelToggle.bText="Goal Labels: ON"
    labelToggle.s=color(210)
  }
}

let counterSave = getItem('counterSave');
if(!(counterSave===null)){
  counterOn=counterSave;
  if(counterOn){
    counterToggle.bText="Ball Counter: ON"
    counterToggle.s=color(210)
  }
}

let orcahSave = getItem('orcahSave');
if(!(orcahSave===null)){
  orcahAnalog=orcahSave;
  if(orcahAnalog){
    orcahToggle.bText="ORCAH Goals: Balls"
  }
}

//print("loaded")

  //fullScreen();
  //semibold=loadFont("NEXT ART_SemiBold.otf",160);
  //regular=loadFont('http://www.chrisreimer.ca/files/NEXTARTRegular.otf');
  //regular=loadFont('https://cdn.discordapp.com/attachments/580932654141014023/810279492861165588/NEXTARTRegular.otf')
  //bold=loadFont("NEXT ART_Bold.otf", 160);
  //print("setup")
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //print("drew")
  let xf = width / 375.0;
  let yf = height / 667.0;
  if (xf < yf) sF = xf;
  else sF = yf;
  pSF = sF;
  xC = width * 0.5;
  yC = height * 0.5;
  click = false;
  if (!mouseIsPressed && held) click = true;
  held = mouseIsPressed;
  postClick2 = postClick;
  postClick = click;
  background(40);
  if (appState == 0) {
    menu();
  } else if (appState == 1) {
    nmatch();
  } else if (appState == 2) {
    skills();
  } else if (appState == 3) {
    remote();
  } else if (appState == 4) {
    orcah();
  } else if (appState == -1) {
    setting();
  } else if(appState==-2){
    info();
  }
}

function menu() {
  fill(200);
  //textFont(dual, width*0.08);
  textFont(regular, 30*sF);
  //textSize(15 * sF)
  text("Change Up\nScoring App", xC, yC - 273.5 * sF);
  //textFont(dual, width*0.04);
  textFont(regular, 15 * sF);
  //textSize(7.5*sF)
  fill(150);
  text("By Chris Reimer", xC, yC - 200 * sF);
  fill(55);
  noStroke();

  for (let i = 0; i < 4; i++) {
    menuB[i].drawButton();
    if (menuB[i].clicked) appState = i + 1;
  }
  set.drawButton();
  if (set.clicked) appState = -1;
  image(gear,xC+154.15*sF, yC-300.15*sF,40*sF,40*sF);
  back.drawButton();
  if(back.clicked)window.open("https://vexscoring.app/","_self");
  //inf.drawButton();
  //if(inf.clicked)appState=-2;
}

function nmatch() {
  //textFont(dual, width*0.08);
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("Match", xC, yC - 288.81 * sF);

  back.drawButton();
  if (back.clicked) {
    if (goalSelected == -1) appState = 0;
    goalSelected = -1;
  }

  fields[0].update();
  if(goalSelected==-1){
    if(labelsOn)fieldLabels();
  }
}

function skills() {
  //textFont(dual, width*0.08);
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("Skills", xC, yC - 288.81 * sF);

  back.drawButton();
  if (back.clicked) {
    if (goalSelected == -1) appState = 0;
    goalSelected = -1;
  }
  fields[1].update();
    if(goalSelected==-1)
    {
      if(labelsOn)fieldLabels();
    }
}

function remote() {
  //textFont(dual, width*0.08);
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("Remote", xC, yC - 288.81 * sF);

  back.drawButton();
  if (back.clicked) {
    if (goalSelected != -1) {
      goalSelected = -1;
      if (fieldSelected == -1) {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 9; j++) {
            rField[0].rFields[i].goals[j].remoteC.setScale(1, 1, i);
          }
        }
      }
    } else if (fieldSelected != -1) fieldSelected = -1;
    else appState = 0;
  }
  rField[0].update();
    if(goalSelected==-1){
      if(labelsOn)fieldLabels();
    }
}

function orcah() {
  //textFont(dual, width*0.08);
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("ORCAH", xC, yC - 288.81 * sF);
  back.drawButton();
  if (back.clicked) {
    if (goalSelected != -1) {
      if (fieldSelected == -1) {
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 9; j++) {
            rField[1].rFields[i].goals[j].remoteC.setScale(1, 1, i);
          }
        }
      }
      goalSelected = -1;
    } else if (fieldSelected != -1) fieldSelected = -1;
    else appState = 0;
  }
  rField[1].update();
    if(goalSelected==-1){
      if(labelsOn)fieldLabels();
    }
}

function setting() {
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("Settings", xC, yC - 288.81 * sF);
  labelToggle.drawButton();
  if(labelToggle.clicked){
    if(labelsOn){
      labelsOn=false
      labelToggle.bText="Goal Labels: OFF"
      labelToggle.s=color(0,0)
      storeItem('labelSave',false)
    }
    else {
      labelsOn=true
      labelToggle.bText="Goal Labels: ON"
      labelToggle.s=color(210)
      storeItem('labelSave',true)
    }
  }
  counterToggle.drawButton();
  if(counterToggle.clicked){
    if(counterOn){
      counterOn=false
      counterToggle.bText="Ball Counter: OFF"
      counterToggle.s=color(0,0)
      storeItem('counterSave',false)
    }
    else {
      counterOn=true
      counterToggle.bText="Ball Counter: ON"
      counterToggle.s=color(210)
      storeItem('counterSave',true)
    }
  }
  orcahToggle.drawButton();
  if(orcahToggle.clicked){
    if(orcahAnalog){
      orcahAnalog=false
      orcahToggle.bText="ORCAH Goals: Numbers"
      storeItem('orcahSave',false)
    }
    else {
      orcahAnalog=true
      orcahToggle.bText="ORCAH Goals: Balls"
      storeItem('orcahSave',true)
    }
  }
  back.drawButton();
  if (back.clicked) appState = 0;
  /*
  fill(50);
  stroke(250,60,60);
  fill(250,60,60);
  rect(xC-20,yC,40,40);
  stroke(60,60,250);
  fill(60,60,250);
  rect(xC+20,yC,40,40);
  */
}

function info(){
  textFont(regular, 30 * sF);
  //textSize(15*sF)
  fill(200);
  text("Info", xC, yC - 288.81 * sF);
  noStroke();
  fill(100);
  textSize(15*sF);
  text("Version "+version,xC, yC+288.81*sF);
  fill(210);
  textSize(20*sF);
  text("This website is setup as a\nProgressive Web App (PWA).\nThis means that it can be\ninstalled as an application\non mobile devices, and\nwill run while offline.\n\nOn Android devices there\nwill be an automatic pop-up\nasking if you want to add\nit to the Home Screen.\n\nTo download on iOS,\ntap the share button,\n(A square with an arrow\npointing up) and then\ntap 'Add to Home Screen'.",xC,yC-190*sF)
  back.drawButton();
  if(back.clicked)appState=0;
}

function keyReleased() {

  if (keyCode == LEFT_ARROW) {
    if (goalSelected != -1) goalSelected = (goalSelected + 8) % 9;
    else {
      if (fieldSelected != -1) {
        if (appState == 3) {
          fieldSelected = (fieldSelected + 3) % 4;
        } else if (appState == 4) {
          fieldSelected = (fieldSelected + 1) % 2;
        }
      }
    }
  } else if (keyCode == RIGHT_ARROW) {
    if (goalSelected != -1) goalSelected = (goalSelected + 1) % 9;
    else {
      if (fieldSelected != -1) {
        if (appState == 3) {
          fieldSelected = (fieldSelected + 1) % 4;
        } else if (appState == 4) {
          fieldSelected = (fieldSelected + 1) % 2;
        }
      }
    }
  } else if (keyCode == DOWN_ARROW) {
    if (goalSelected != -1) {
      pGoalSelected[appState-1]=goalSelected;
      goalSelected = -1;
      if (appState == 3) rField[0].resetCounterScale();
      else if (appState == 4) rField[1].resetCounterScale();
    } else if (fieldSelected != -1) {
      if(appState>=3)pFieldSelected[appState-3]=fieldSelected;
      fieldSelected = -1;
    } else appState = 0;
  } else if(keyCode == UP_ARROW&&appState>0){
    if(fieldSelected ==-1&&appState>2){
      if(appState==3){
        fieldSelected=pFieldSelected[0];
      }
      else if(appState==4){
        fieldSelected=pFieldSelected[1];
      }
    }
    else if(goalSelected==-1){
      goalSelected=pGoalSelected[appState-1];
    }
  }

}


function fieldLabels(){
  textFont(regular,20*sF)
  fill(210);
  noStroke();
  for(let i=0;i<9;i++){
    //text(labels[i],xC+((i%3-1)*375*.25-20)*sF,yC+((floor(i/3))*375*.25-667*.2-10)*sF)
    if(appState==1||appState==2)text(labels[i],xC+((i%3-1)*375*.25-27)*sF,yC+((floor(i/3))*375*.25-667*.2+40)*sF)
    else if(appState>=3) text(labels[i],xC+((i%3-1)*375*.25-27)*sF,yC+((floor(i/3))*375*.25-667*.2+65)*sF)
  }
}




class BallCounter {
  constructor(x_, y_, s_) {
    this.x = x_;
    this.y = y_;
    this.scale = s_;

    this.redCount = 0;
    this.blueCount = 0;

    this.fieldNum = 0;
    this.redUp = new Button(this.x - this.scale * 375 * 0.14, this.y - this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 375 * 0.004, "+", color(250, 60, 60), color(210), 667 * 0.038 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.redDown = new Button(this.x - this.scale * 375 * 0.14, this.y + this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "-", color(250, 60, 60), color(210), 667 * 0.038 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.blueUp = new Button(this.x + this.scale * 375 * 0.14, this.y - this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "+", color(60, 60, 250), color(210), 667 * 0.038 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.blueDown = new Button(this.x + this.scale * 375 * 0.14, this.y + this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "-", color(60, 60, 250), color(210), 667 * 0.038 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.redUp.sWeight = 667 * 0.004 * this.scale * 2;
    this.redDown.sWeight = 667 * 0.004 * this.scale * 2;
    this.blueUp.sWeight = 667 * 0.004 * this.scale * 2;
    this.blueDown.sWeight = 667 * 0.004 * this.scale * 2;
    this.doubler = new Button(this.x, this.y + 667 * 0.26 * this.scale, 375 * 0.6 * this.scale, 667 * 0.08 * this.scale, 667 * 0.02, "Not Doubled", color(100), color(210), 667 * 0.015 * this.scale, 375 * 0.06 * this.scale, color(50), color(45));
    if(this.scale==extraSize){
      this.redUp.x-=80;
      this.redDown.x-=80;
      this.blueUp.x+=80;
      this.blueDown.x+=80;
      this.redUp.y+=35;
      this.blueUp.y+=35;
      this.redDown.y-=40;
      this.blueDown.y-=40;
    }
  }

  drawCounter() {
    if (fieldSelected == -1&&appState>=3) {
      if ((appState == 3 && this.fieldNum < 3) || (appState == 4 && this.fieldNum == 1)) {
        fill(250, 60, 60, 120);
      } else fill(60, 60, 250, 120);
      textFont(bold, 375 * 0.2 * this.scale * sF);
      noStroke();
      //textSize(375 * 0.1 * this.scale * sF)
      text(this.fieldNum, xC + this.x * sF, yC + (this.y - 667 * 0.05 * this.scale) * sF);
    }
    if(this.scale!=extraSize){
      fill(210, 30, 30);
      stroke(250, 60, 60);
      ellipse(xC + (this.x - this.scale * 375 * 0.14) * sF, yC + this.y * sF, 375 * 0.25 * this.scale * sF, 375 * 0.25 * this.scale * sF);
      fill(30, 30, 210);
      stroke(60, 60, 250);
      ellipse(xC + (this.x + this.scale * 375 * 0.14) * sF, yC + this.y * sF, 375 * 0.25 * this.scale * sF, 375 * 0.25 * this.scale * sF);
    }
    else{
      fill(210, 30, 30);
      stroke(250, 60, 60);
      ellipse(xC + (this.x - this.scale * 375 * 0.14) * sF, yC + (this.y+25)* sF, 375 * 0.25 * this.scale * sF, 375 * 0.25 * this.scale * sF);
      fill(30, 30, 210);
      stroke(60, 60, 250);
      ellipse(xC + (this.x + this.scale * 375 * 0.14) * sF, yC + (this.y+25) * sF, 375 * 0.25 * this.scale * sF, 375 * 0.25 * this.scale * sF);
    }

    this.redUp.drawButton();
    this.redDown.drawButton();
    this.blueUp.drawButton();
    this.blueDown.drawButton();
    this.doubler.f = this.doubler.s;
    if (appState == 3 && fieldSelected != -1) this.doubler.drawButton();
    fill(210);
    noStroke();
    //textFont(dual,width*.2*scale);
    textFont(regular, 375 * 0.2 * this.scale * sF);
    //textSize(375 * 0.1 * this.scale * sF)
    if(this.scale!=extraSize){
    text(this.redCount, xC + (this.x - this.scale * 375 * 0.14) * sF, yC + (this.y + this.scale * 667 * 0.0375) * sF);
    text(this.blueCount, xC + (this.x + this.scale * 375 * 0.14) * sF, yC + (this.y + this.scale * 667 * 0.0375) * sF);
  }
  else{
    text(this.redCount, xC + (this.x - this.scale * 375 * 0.14) * sF, yC + (this.y + this.scale * 667 * 0.0375+25) * sF);
    text(this.blueCount, xC + (this.x + this.scale * 375 * 0.14) * sF, yC + (this.y + this.scale * 667 * 0.0375+25) * sF);
    textFont(regular,33*this.scale*sF)
    text("4-7 Balls",xC,yC+(this.y-30)*sF)
  }
  }

  setScale(newScale, amount, i) {
    this.fieldNum = i + 1;
    this.scale = newScale;
    if (amount == 1) {
      this.x = 0;
      this.y = -22.975;
    } else if (amount == 2) {
      this.x = 375 * 0.2 * (i * 2 - 1);
      this.y = -22.975;
    } else if (amount == 4) {
      this.x = 375 * 0.16 * (floor(i / 2) * 2 - 1);
      this.y = -22.975 + 667 * 0.12 * (i % 2 * 2 - 1);
    }

    this.redUp = new Button(this.x - this.scale * 375 * 0.14, this.y - this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 375 * 0.004, "+", color(250, 60, 60), color(210), 667 * 0.035 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.redDown = new Button(this.x - this.scale * 375 * 0.14, this.y + this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "-", color(250, 60, 60), color(210), 667 * 0.035 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.blueUp = new Button(this.x + this.scale * 375 * 0.14, this.y - this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "+", color(60, 60, 250), color(210), 667 * 0.035 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.blueDown = new Button(this.x + this.scale * 375 * 0.14, this.y + this.scale * 375 * 0.23, 375 * 0.15 * this.scale, 375 * 0.15 * this.scale, 667 * 0.004, "-", color(60, 60, 250), color(210), 667 * 0.035 * this.scale, 375 * 0.2 * this.scale, color(50), color(45));
    this.redUp.sWeight = 667 * 0.004 * this.scale * 2;
    this.redDown.sWeight = 667 * 0.004 * this.scale * 2;
    this.blueUp.sWeight = 667 * 0.004 * this.scale * 2;
    this.blueDown.sWeight = 667 * 0.004 * this.scale * 2;
  }
}






class Field {

  constructor(rSide, id) {
    this.goals = [];  //0 -> A, 2 -> C, 7 -> I
    this.colours = [];

    this.remoteGoalScore = [0,0,0,0,0,0,0,0,0];
    this.remoteBallScore = 0;

    this.ballM = [0, 1, 1];//Ball Point Multiplier (Needed for LRT)
    this.ID = id;
    this.remoteTeam = rSide;

    this.rows = [
      [],
      [],
      []
    ];

    this.redScore = 0;
    this.blueScore = 0;

    this.blueRows = 0;
    this.redRows = 0;

    this.redBalls = 0;
    this.blueBalls = 0;


    if (this.remoteTeam == 1) this.ballM[1] = 2;
    else if (this.remoteTeam == 2) this.ballM[2] = 2;
    for (let i = 0; i < 9; i++) {
      this.goals[i] = new Goal(i, this.remoteTeam);
    }
    this.colours[0] = color(210);
    this.colours[1] = color(250, 30, 30);
    this.colours[2] = color(30, 30, 250);
    this.auton = new Button(0, 173.42, 262.5, 667 * 0.08, 667 * 0.02, "Auton: Tied", color(0, 0), color(210), 667 * 0.01, 375 * 0.06, color(50), color(45));
    this.reset = new Button(-70.3125, 266.8, 375 * 0.325, 667 * 0.15, 667 * 0.02, "Field\nReset", color(0, 0), color(210), -667 * 0.01, 375 * 0.06, color(50), color(45));
    this.clear = new Button(70.3125, 266.8, 375 * 0.325, 667 * 0.15, 667 * 0.02, "Clear\nField", color(0, 0), color(210), -667 * 0.01, 375 * 0.06, color(50), color(45));
  }
  update() {
    for (let i = 0; i < 9; i++) {
      this.goals[i].update();
    }
    if (click) {}
    if (postClick2) this.scoreField();
    if (goalSelected == -1) {
      this.drawField();
    }
    if (goalSelected != -1) {

      if (appState < 3) this.goals[goalSelected].editGoal();
      else this.goals[goalSelected].editGoalRemote();
    }
    this.drawScore();
    this.drawButtons();
  }

  drawButtons() {
    noStroke();
    fill(50);
    //textFont(dual, width*0.08);
    textFont(regular, 375*0.12*sF);
    //textSize(375 * 0.06 * sF);

    if (goalSelected == -1) {
      if (appState == 1) {
        this.auton.drawButton();
        if (this.auton.clicked) {
          if (this.autonWinner == 0) {
            this.autonWinner = 1;
            this.auton.bText = "Auton: Red";
            this.auton.s = color(250, 60, 60);
            this.auton.f = color(250, 60, 60);
          } else if (this.autonWinner == 1) {
            this.autonWinner = 2;
            this.auton.bText = "Auton: Blue";
            this.auton.s = color(60, 60, 250);
            this.auton.f = color(60, 60, 250);
          } else if (this.autonWinner == 2) {
            this.autonWinner = 0;
            this.auton.bText = "Auton: Tied";
            this.auton.s = color(0, 0);
            this.auton.f = color(210);
          }
        }
      }
    }
    if (!(goalSelected!=-1&&appState<3)) {
    this.reset.drawButton();
    if (this.reset.clicked) this.resetField(appState);

    this.clear.drawButton();
    if (this.clear.clicked) this.resetField(0);
  }
}

  drawField() {

    //fill(130);
    noFill();
    //stroke(100);
    strokeWeight(667 * 0.004 * sF);
    stroke(80);
    line(xC - 375 * 0.01 * sF, yC - 137.55 * sF, xC - 375 * 0.01 * sF, yC + 124.95 * sF);
    line(xC + 375 * 0.01 * sF, yC - 137.55 * sF, xC + 375 * 0.01 * sF, yC + 124.95 * sF);
    line(xC - 375 * 0.7 * 0.25 * sF, yC - 137.55 * sF, xC - 375 * 0.7 * 0.25 * sF, yC + 124.95 * sF);
    line(xC + 375 * 0.7 * 0.25 * sF, yC - 137.55 * sF, xC + 375 * 0.7 * 0.25 * sF, yC + 124.95 * sF);
    //line(width*.5-width*.4,(height*.3+width*.25+height*.05),width*.5+width*.4,(height*.3+width*.25+height*.05));
    line(xC - 375 * 0.7 * 0.5 * sF, yC - 6.3 * sF, xC - 375 * 0.7 * 0.25 * sF, yC - 6.3 * sF);
    line(xC + 375 * 0.7 * 0.5 * sF, yC - 6.3 * sF, xC + 375 * 0.7 * 0.25 * sF, yC - 6.3 * sF);
    stroke(180);
    if (this.remoteTeam == 1) stroke(250, 60, 60);
    else if (this.remoteTeam == 2) stroke(60, 60, 250);
    rect(xC, yC - 6.3 * sF, 375 * 0.7 * sF, 375 * 0.7 * sF, 667 * 0.02 * sF);

    if(appState==1||appState==2){
    noStroke();
    fill(30,120);
    strokeWeight(10);
    for(let i=0;i<9;i++){
    ellipse(xC+(i%3-1)*375*.25*sF, yC+((floor(i/3)-1)*375*.25-6.3)*sF,35,35);
    }
  }


    this.drawRows();

    for (let i = 0; i < 9; i++) {
      this.goals[i].drawGoal();
    }
  }

  drawRows() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.rowColours=[]
        this.rowColours[0]=color(60,250,60,1)
        this.rowColours[1]=color(250,60,60,100)
        this.rowColours[2]=color(60,60,250,100)
        if (this.rows[i][j + 3] == 1) {
          strokeWeight(20 * sF);
          //stroke(this.colours[i], 0.5);
          stroke(this.rowColours[i])
          line(xC - 375 * 0.25 * sF, yC + (j * 375 * 0.25 - 100) * sF, xC + (2 * 375 * 0.25 - 375 * 0.25) * sF, yC + (j * 375 * 0.25 - 100) * sF);
        }
        if (this.rows[i][j] == 1) {
          strokeWeight(20*sF);
          //stroke(this.colours[i], 0.5);
          stroke(this.rowColours[i])
          line(xC + (j * 375 * 0.25 - 375 * 0.25) * sF, yC - (667 * 0.15) * sF, xC + (j * 375 * 0.25 - 375 * 0.25) * sF, yC + 87.45 * sF);
        }
      }
      if (this.rows[i][6] == 1) {
        strokeWeight(20*sF);
        //stroke(this.colours[i], 0.5);
        stroke(this.rowColours[i])
        line(xC - 375 * 0.25 * sF, yC - 667 * 0.15 * sF, xC + (375 * 0.25) * sF, yC + 87.45 * sF);
      }
      if (this.rows[i][7] == 1) {
        strokeWeight(20*sF);
        //stroke(this.colours[i], 0.5);
        stroke(this.rowColours[i])
        line(xC + (375 * 0.25) * sF, yC - 667 * 0.15 * sF, xC - 375 * 0.25 * sF, yC + 87.45 * sF);
      }
    }
  }

  drawScore() {
    textFont(regular, 667*0.0375*2*sF);
    //textSize(667 * 0.0375 * sF);
    if (appState == 1) {
      fill(250, 60, 60);
      noStroke();
      text(this.redScore, xC - 375 * 0.12 * sF, yC - 667 * 0.35 * sF);
      fill(60, 60, 250);
      noStroke();
      text(this.blueScore, xC + 375 * 0.12 * sF, yC - 667 * 0.35 * sF);
    } else if (appState == 2) {
      fill(250, 250, 60);
      if (this.redScore == 126) fill(60, 250, 60);
      else if (this.redScore > 126) fill(250, 60, 60);
      noStroke();
      text(this.redScore, xC, yC - 667 * 0.35 * sF);


    }
    if(goalSelected==-1&&counterOn&&(appState==1||appState==2||appState==4)){
    fill(200,25,25);
    stroke(250,60,60);
    ellipse(xC+110*sF,yC-298*sF,20*sF,20*sF)
    fill(25,25,200);
    stroke(60,60,250);
    ellipse(xC+110*sF,yC-268*sF,20*sF,20*sF)
    fill(210);
    noStroke();
    textFont(regular,25*sF);
    if(appState==4){
      if((this.remoteTeam==1&&this.redBalls>7)||this.redBalls>16){
        fill(250,60,60)
      }
      else fill(210);
      text(this.redBalls,xC+140*sF,yC-288*sF)

      if((this.remoteTeam==2&&this.blueBalls>7)||this.blueBalls>16){
        fill(250,60,60)
      }
      else fill(210);
      text(this.blueBalls,xC+140*sF,yC-258*sF)
    }
    else{
      text(this.redBalls,xC+140*sF,yC-288*sF)
      text(this.blueBalls,xC+140*sF,yC-258*sF)
    }
  }
    if (goalSelected == -1 && appState == 1) {
      //textFont(dual, height*.06);
      textFont(regular, 375*.08*sF);
      //textSize(375 * 0.04 * sF);
      let sText = "";
      let c = color(0);
      if (this.redBalls > 16 && this.blueBalls > 16) {
        c = color(210);
        sText = "Too Many Balls";
      } else if (this.redBalls > 16) {
        c = color(250, 60, 60);
        sText = "Too Many Red Balls";
      } else if (this.blueBalls > 16) {
        c = color(60, 60, 250);
        sText = "Too Many Blue Balls";
      } else if (this.redScore == this.blueScore) {
        c = color(210);
        sText = "Match Tied";
      } else if (this.redScore > this.blueScore) {
        c = color(250, 60, 60);
        sText = "Red Wins";
      } else if (this.blueScore > this.redScore) {
        c = color(60, 60, 250);
        sText = "Blue Wins";
      }
      fill(c);
      noStroke();
      text(sText, xC, yC - 667 * 0.27 * sF);
    }
  }

  scoreField() {
    this.redBalls = this.findBalls(1);
    this.blueBalls = this.findBalls(2);
    this.rows = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];

    if (appState == 1) {
      this.redScore = this.redBalls;
      this.redScore += 6 * this.findCRows(1);
      this.blueScore = this.blueBalls;
      this.blueScore += 6 * this.findCRows(2);
      if (this.autonWinner == 0) {
        this.redScore += 3;
        this.blueScore += 3;
      } else if (this.autonWinner == 1) this.redScore += 6;
      else if (this.autonWinner == 2) this.blueScore += 6;
    } else if (appState == 2) {
      this.redScore = this.redBalls;
      this.redScore += 6 * this.findCRows(1);
      this.blueScore = this.blueBalls;
      this.blueScore += 6 * this.findCRows(2);
      this.redScore += 63 - this.blueScore;
    } else if (appState == 3) {

      this.remoteBallScore = this.redBalls * this.ballM[1] + this.blueBalls * this.ballM[2];

      this.remoteGoalScore = [0,0,0,0,0,0,0,0,0];
      for (let i = 0; i < 9; i++) {
        this.remoteGoalScore[i] += this.goals[i].remoteBalls[1] * this.ballM[1] + this.goals[i].remoteBalls[2] * this.ballM[2];
        if (rField[0].doubled[this.ID] == i) this.remoteGoalScore[i] *= 2;
        if (rField[0].doubled[floor(this.ID * 0.5) * 2 + 1 - this.ID % 2] == i) this.remoteGoalScore[i] *= 2;
      }
    } else if (appState == 4) {
      this.remoteBallScore = this.redBalls * this.ballM[1] + this.blueBalls * this.ballM[2];
      this.remoteGoalScore = [0,0,0,0,0,0,0,0,0];
      for (let i = 0; i < 9; i++) {
        this.remoteGoalScore[i] += (this.goals[i].remoteBalls[1] * this.ballM[1] + this.goals[i].remoteBalls[2] * this.ballM[2]);
      }
      //print(this.this.goals[0].remoteBalls[1])
    }
  }


  findCRows(c) {
    this.top = [];
    this.sum = 0;
    for (let i = 0; i < 9; i++) {
      if (this.goals[i].balls[0] == c || (this.goals[i].balls[0] == 0 && this.goals[i].balls[1] == c) || (this.goals[i].balls[0] == 0 && this.goals[i].balls[1] == 0 && this.goals[i].balls[2] == c)) {
        this.top[i] = c;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (this.top[i] == c && this.top[i + 3] == c && this.top[i + 6] == c) {
        this.sum++;
        this.rows[c][i] = 1;
      }
      if (this.top[i * 3] == c && this.top[i * 3 + 1] == c && this.top[i * 3 + 2] == c) {
        this.sum++;
        this.rows[c][i + 3] = 1;
      }
    }
    if (this.top[0] == c && this.top[4] == c && this.top[8] == c) {
      this.sum++;
      this.rows[c][6] = 1;
    }
    if (this.top[6] == c && this.top[4] == c && this.top[2] == c) {
      this.sum++;
      this.rows[c][7] = 1;
    }
    return this.sum;
  }


  findBalls(c) {
    this.sum = 0;
    if (appState < 3) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.goals[i].balls[j] == c) {
            this.sum++;
          }
        }
        this.sum+=this.goals[i].extraBalls[c];
      }
    } else {
      for (let i = 0; i < 9; i++) {
        this.count = this.goals[i].remoteBalls[c];
        if (appState == 3) {
          if (rField[0].doubled[this.ID] == i) {
            this.count *= 2;
          }
          if (rField[0].doubled[floor(this.ID * 0.5) * 2 + 1 - this.ID % 2] == i) {
            this.count *= 2;
          }
        }
        this.sum += this.count;
      }
    }
    return this.sum;
  }

  resetField(type) { //0=blank,1=match,2=skills,3=remote,4=ORCAH
    this.autonWinner = 0;
    this.auton.bText = "Auton: Tied";
    this.auton.s = color(0, 0);
    this.auton.f = color(210);

      for (let i = 0; i < 9; i++) {
        this.goals[i].extraBalls=[0,0,0];
        this.goals[i].balls = [0, 0, 0];
        for (let j = 0; j < 3; j++) {
          this.goals[i].remoteBalls[j] = 0;
        }
      }
      if (type == 1) {
      this.goals[0].balls = [0, 2, 1];
      this.goals[1].balls = [1, 2, 1];
      this.goals[2].balls = [0, 1, 2];

      this.goals[3].balls = [0, 2, 1];
      this.goals[4].balls = [0, 0, 0];
      this.goals[5].balls = [0, 1, 2];

      this.goals[6].balls = [0, 2, 1];
      this.goals[7].balls = [2, 1, 2];
      this.goals[8].balls = [0, 1, 2];
    } else if (type == 2) {
      this.goals[0].balls = [0, 2, 2];
      this.goals[1].balls = [0, 0, 2];
      this.goals[2].balls = [0, 2, 2];

      this.goals[3].balls = [0, 0, 2];
      this.goals[4].balls = [2, 2, 2];
      this.goals[5].balls = [0, 0, 2];

      this.goals[6].balls = [0, 2, 2];
      this.goals[7].balls = [0, 0, 2];
      this.goals[8].balls = [0, 2, 2];
    }
    if (type == 3) {
      this.goals[0].remoteBalls[1] = 1;
      this.goals[0].remoteBalls[2] = 1;
      this.goals[1].remoteBalls[1] = 2;
      this.goals[1].remoteBalls[2] = 1;
      this.goals[2].remoteBalls[1] = 1;
      this.goals[2].remoteBalls[2] = 1;

      this.goals[3].remoteBalls[1] = 1;
      this.goals[3].remoteBalls[2] = 1;
      this.goals[4].remoteBalls[1] = 0;
      this.goals[4].remoteBalls[2] = 0;
      this.goals[5].remoteBalls[1] = 1;
      this.goals[5].remoteBalls[2] = 1;

      this.goals[6].remoteBalls[1] = 1;
      this.goals[6].remoteBalls[2] = 1;
      this.goals[7].remoteBalls[1] = 1;
      this.goals[7].remoteBalls[2] = 2;
      this.goals[8].remoteBalls[1] = 1;
      this.goals[8].remoteBalls[2] = 1;

    } else if (type == 4) {
      if (this.remoteTeam == 1) {
        this.goals[0].remoteBalls[1] = 0;
        this.goals[0].remoteBalls[2] = 0;
        this.goals[1].remoteBalls[1] = 0;
        this.goals[1].remoteBalls[2] = 2;
        this.goals[2].remoteBalls[1] = 0;
        this.goals[2].remoteBalls[2] = 0;

        this.goals[3].remoteBalls[1] = 0;
        this.goals[3].remoteBalls[2] = 2;
        this.goals[4].remoteBalls[1] = 0;
        this.goals[4].remoteBalls[2] = 0;
        this.goals[5].remoteBalls[1] = 0;
        this.goals[5].remoteBalls[2] = 2;

        this.goals[6].remoteBalls[1] = 0;
        this.goals[6].remoteBalls[2] = 0;
        this.goals[7].remoteBalls[1] = 0;
        this.goals[7].remoteBalls[2] = 2;
        this.goals[8].remoteBalls[1] = 0;
        this.goals[8].remoteBalls[2] = 0;
      } else if (this.remoteTeam == 2) {
        this.goals[0].remoteBalls[1] = 0;
        this.goals[0].remoteBalls[2] = 0;
        this.goals[1].remoteBalls[1] = 2;
        this.goals[1].remoteBalls[2] = 0;
        this.goals[2].remoteBalls[1] = 0;
        this.goals[2].remoteBalls[2] = 0;

        this.goals[3].remoteBalls[1] = 2;
        this.goals[3].remoteBalls[2] = 0;
        this.goals[4].remoteBalls[1] = 0;
        this.goals[4].remoteBalls[2] = 0;
        this.goals[5].remoteBalls[1] = 2;
        this.goals[5].remoteBalls[2] = 0;

        this.goals[6].remoteBalls[1] = 0;
        this.goals[6].remoteBalls[2] = 0;
        this.goals[7].remoteBalls[1] = 2;
        this.goals[7].remoteBalls[2] = 0;
        this.goals[8].remoteBalls[1] = 0;
        this.goals[8].remoteBalls[2] = 0;
      }
    }
  }
}





class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}



class Goal {

  constructor(id, fid) {
    this.ID = id;
    this.fieldID = fid;
    this.ballC = [];
    this.scale = 1
    this.options = [];
    this.remoteBalls = [];
    this.balls = int(0, 0, 0)
    this.arrows = [];
    this.mainB = [];
    this.optionB = [];

    this.extras=new BallCounter(0,260,extraSize);
    this.extraBalls=[0,0,0];

    this.pos = new Position(((id % 3 - 1) * 375 * 0.25), floor(id / 3) * 375 * 0.25 - 667 * 0.2);
    //pos=(floor(id/3))*375*0.25-667*0.2;

    this.gB = new Button(this.pos.x, this.pos.y + 667 * 0.04, 375 * 0.24, 375 * 0.24, 0, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
    this.arrows[0] = new Button(-375 * 0.425, -22.975, 375 * 0.15, 375 * 0.7, 0, "«", color(0, 0), color(210), 667 * 0.022, 375 * 0.12, color(0, 0), color(0, 0));
    this.arrows[1] = new Button(375 * 0.425, -22.975, 375 * 0.15, 375 * 0.7, 0, "»", color(0, 0), color(210), 667 * 0.022, 375 * 0.12, color(0, 0), color(0, 0));
    this.mainB[0] = new Button(0, -142.975, 375 * 0.3, 375 * 0.3, 375 * 0.3, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
    this.mainB[1] = new Button(0, -22.975, 375 * 0.3, 375 * 0.3, 375 * 0.3, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
    this.mainB[2] = new Button(0, 97.025, 375 * 0.3, 375 * 0.3, 375 * 0.3, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
    for (let i = 0; i < 3; i++) {
      this.mainB[i].sWeight = 667 * 0.007;
      this.optionB[i] = new Button(-375 * 0.2, -142.975 + 375 * 0.32 * i, 375 * 0.15, 375 * 0.15, 375 * 0.15, "+", color(0, 0), color(210,70), 17, 50, color(0, 0), color(0, 0));
      this.optionB[i + 3] = new Button(375 * 0.2, -142.975 + 375 * 0.32 * i, 375 * 0.15, 375 * 0.15, 375 * 0.15, "+", color(0, 0), color(210,70), 17, 50, color(0, 0), color(0, 0));
      this.circularBalls = true;
      this.mainB[i].circle = this.circularBalls;
      this.optionB[i].circle = this.circularBalls;
      this.optionB[i + 3].circle = this.circularBalls;
    }
    this.escape = new Button(0, -667 * 0.4, 375, 667 * 0.2, 0, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
    this.remoteC = new BallCounter(0, -22.975, 1);
  }

  update() {

    if (postClick2 && goalSelected == -1) {
      this.gravity();
    }


    if (goalSelected == -1) {
      this.gB.drawButton();
      if (this.gB.clicked) goalSelected = this.ID;
    }
  }

  editGoal() {
    this.drawEditor();
  }

  editGoalRemote() {
    this.drawMiniMap();
    this.remoteC.redCount = this.remoteBalls[1];
    this.remoteC.blueCount = this.remoteBalls[2];


    if(this.remoteBalls[1]==0){
      this.remoteC.redDown.f=color(100)
    }
    else this.remoteC.redDown.f=color(210)

    if(this.remoteBalls[2]==0){
      this.remoteC.blueDown.f=color(100)
    }
    else this.remoteC.blueDown.f=color(210)

    if(this.remoteBalls[1]==15){
      this.remoteC.redUp.f=color(100)
    }
    else this.remoteC.redUp.f=color(210)

    if(this.remoteBalls[2]==15){
      this.remoteC.blueUp.f=color(100)
    }
    else this.remoteC.blueUp.f=color(210)

    if((appState==4&&this.remoteBalls[1]+this.remoteBalls[2]==3)){
      this.remoteC.redUp.f=color(100);
      this.remoteC.blueUp.f=color(100);
    }
    else if(appState==4){
      this.remoteC.redUp.f=color(210);
      this.remoteC.blueUp.f=color(210);
    }

    this.remoteC.drawCounter();
    if (this.remoteC.redUp.clicked) {
      this.remoteBalls[1]++;
      if (this.remoteBalls[1] > 15) this.remoteBalls[1] = 15;
      if(appState==4&&this.remoteBalls[1]+this.remoteBalls[2]>3)this.remoteBalls[1]--;
    } else if (this.remoteC.redDown.clicked) {
      this.remoteBalls[1]--;
      if (this.remoteBalls[1] < 0) this.remoteBalls[1] = 0;
    } else if (this.remoteC.blueUp.clicked) {
      this.remoteBalls[2]++;
      if (this.remoteBalls[2] > 15) this.remoteBalls[2] = 15;
      if(appState==4&&this.remoteBalls[1]+this.remoteBalls[2]>3)this.remoteBalls[2]--;
    } else if (this.remoteC.blueDown.clicked) {
      this.remoteBalls[2]--;
      if (this.remoteBalls[2] < 0) this.remoteBalls[2] = 0;
    }
    if (this.remoteC.doubler.clicked) {
      if (rField[0].doubled[fieldSelected] == goalSelected) {
        this.a = this.remoteC.doubler;
        this.a.s = color(100);
        this.a.bText = "Not Doubled";
        rField[0].doubled[fieldSelected] = -1;
      } else {
        if (rField[0].doubled[fieldSelected] != -1) {
          this.b = rField[0].rFields[fieldSelected].goals[rField[0].doubled[fieldSelected]].remoteC.doubler;
          this.b.s = color(100);
          this.b.bText = "Not Doubled";
        }
        rField[0].doubled[fieldSelected] = this.ID;
        this.c = this.remoteC.doubler;
        this.c.s = color(210);
        this.c.bText = "Doubled";
      }
    }

    this.drawArrows();
  }

  drawArrows() {
    this.arrows[0].drawButton();
    this.arrows[1].drawButton();
    if (this.arrows[0].clicked) {
      goalSelected -= 1;
      if (goalSelected <= -1) goalSelected += 9;
    }
    if (this.arrows[1].clicked) {
      goalSelected += 1;
      if (goalSelected >= 9) goalSelected -= 9;
    }
  }

  gravity() {
    if (this.balls[1] == 0 && this.balls[0] != 0) {
      this.balls[1] = this.balls[0];
      this.balls[0] = 0;
    }
    if (this.balls[2] == 0 && this.balls[1] != 0) {
      this.balls[2] = this.balls[1];
      this.balls[1] = 0;
    }
    if (this.balls[1] == 0 && this.balls[0] != 0) {
      this.balls[1] = this.balls[0];
      this.balls[0] = 0;
    }
    if(this.extraBalls[1]*this.extraBalls[2]==0&&this.balls[2]==0&&this.extraBalls[1]+this.extraBalls[2]>0){
      if(this.extraBalls[1]>0){
        this.balls[2]=1;
        this.extraBalls[1]-=1;
      }
      else if(this.extraBalls[2]>0){
        this.balls[2]=2;
        this.extraBalls[2]-=1;
      }
    }
  }


  drawMiniMap() {
    //Minimap
    strokeWeight(667 * 0.004*sF);
    fill(130);
    stroke(100);
    rect(xC + 375 * 0.35 * sF, yC - 277.25 * sF, 375 * 0.18 * sF, 375 * 0.18 * sF, 375 * 0.02 * sF);
    stroke(200, 200, 0);
    fill(250, 250, 0);
    rect(xC + (this.ID % 3 * 375 * 0.06 + 375 * 0.29) * sF, yC + (floor(this.ID / 3.0) % 3 * 375 * 0.06 - 299.75) * sF, 375 * 0.06 * sF, 375 * 0.06 * sF, 375 * 0.02 * sF);
    if(labelsOn){
      fill(40)
      noStroke();
      textFont(semibold,20*sF)
      text(labels[this.ID],xC + (this.ID % 3 * 375 * 0.06 + 375 * 0.29) * sF, yC + (floor(this.ID / 3.0) % 3 * 375 * 0.06 - 299.75+7) * sF);
    }
  }


  drawEditor() {

    this.drawMiniMap();

    this.drawArrows();

    noFill();
    stroke(25);
    strokeWeight(30 * sF);
    ellipse(xC, yC + 150 * sF, 150 * sF, 60 * sF);

    for (let i = 0; i < 3; i++) {
      this.options[i] = this.leftOption(this.balls[i]);
      this.options[i + 3] = this.rightOption(this.balls[i]);

      this.optionB[i].fA = this.ballColour(this.options[i]);
      this.optionB[i].fB = this.optionB[i].fA;
      this.optionB[i].s = this.ballStroke(this.options[i]);

      this.optionB[i + 3].fA = this.ballColour(this.options[i + 3]);
      this.optionB[i + 3].fB = this.ballColour(this.options[i + 3]);
      this.optionB[i + 3].s = this.ballStroke(this.options[i + 3]);

      this.optionB[i].drawButton();
      this.optionB[i + 3].drawButton();

      this.mainB[i].fA = this.ballColour(this.balls[i]);
      this.mainB[i].fB = this.mainB[i].fA;
      this.mainB[i].s = this.ballStroke(this.balls[i]);
      this.mainB[i].drawButton();

      if (this.optionB[i].clicked) this.balls[i] = this.options[i];
      if (this.optionB[i + 3].clicked) this.balls[i] = this.options[i + 3];
      if (this.mainB[i].clicked) this.balls[i] = 0;
    }

    if(this.extraBalls[1]==0){
      this.extras.redDown.f=color(100)
    }
    else this.extras.redDown.f=color(210)
    if(this.extraBalls[2]==0){
      this.extras.blueDown.f=color(100)
    }
    else this.extras.blueDown.f=color(210)
    if(this.extraBalls[1]+this.extraBalls[2]==4){
      this.extras.redUp.f=color(100)
      this.extras.blueUp.f=color(100)
    }
    else {
      this.extras.redUp.f=color(210)
      this.extras.blueUp.f=color(210)
    }

    this.extras.redCount=this.extraBalls[1];
    this.extras.blueCount=this.extraBalls[2];
    this.extras.drawCounter();
    if(this.extras.redUp.clicked&&this.extraBalls[1]+this.extraBalls[2]<4)this.extraBalls[1]+=1;
    else if(this.extras.redDown.clicked&&this.extraBalls[1]>0)this.extraBalls[1]-=1;
    else if(this.extras.blueUp.clicked&&this.extraBalls[1]+this.extraBalls[2]<4)this.extraBalls[2]+=1;
    else if(this.extras.blueDown.clicked&&this.extraBalls[2]>0)this.extraBalls[2]-=1;


    this.escape.drawButton();
    if (this.escape.clicked){
      pGoalSelected[appState-1]=goalSelected;
       goalSelected = -1;
     }
  }

  leftOption(x) {
    if (x == 1) return 0;
    return 1;
  }

  rightOption(x) {
    if (x == 2) return 0;
    return 2;
  }

  ballColour(x) {
    if (x == 0) return color(190, 60);
    else if (x == 1) return color(200, 25, 25); //(230, 60, 60);
    else if (x == 2) return color(25, 25, 200); //(60, 60, 230);
    return color(20, 190, 20);
  }

  ballStroke(x) {
    if (x == 0) return color(180);
    else if (x == 1) return color(250, 60, 60); //(200, 25, 25);
    else if (x == 2) return color(60, 60, 250); //(25, 25, 200);
    return color(20, 190, 20);
  }

  extraSingleList(){
      this.list=[0,0,0,0];
      this.i=0;
      for(let j=0;j<this.extraBalls[1];j++){
        this.list[j]=1;
        this.i++;
      }
      for(let j=0;j<this.extraBalls[2];j++){
        this.list[this.i+j]=2;
      }
      return this.list;
    }


  drawGoal() {
    //ellipse(pos.x,pos.y,20,20);
    if (appState < 3) {
      noStroke();
      strokeWeight(667 * 0.004*sF);

      this.eBalls=this.extraSingleList();
      this.d=15;
      this.positions=[[-this.d,this.d+5],[this.d,this.d+5],[-this.d,-this.d+5],[this.d,-this.d+5]];
      for(let i=3;i>=0;i--){
        if(this.eBalls[i]!=0){
          fill(this.ballColour(this.eBalls[i]));
          stroke(this.ballStroke(this.eBalls[i]));
          ellipse(xC+(this.pos.x+this.positions[i][0])*sF,yC+(this.pos.y+667*0.05+this.positions[i][1])*sF,667*0.05*sF, 667*0.05*sF);
        }
      }

      for (let i = 2; i >= 0; i--) {
        if (this.balls[i] == 0) {
          noFill();
          noStroke();
        } else if (this.balls[i] == 1) {
          fill(this.ballColour(this.balls[i]));
          stroke(this.ballStroke(this.balls[i]));
        } else if (this.balls[i] == 2) {
          fill(this.ballColour(this.balls[i]));
          stroke(this.ballStroke(this.balls[i]));
        }
        ellipse(xC + this.pos.x * sF, yC + (this.pos.y + 667 * 0.025 * i) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
      }
    } else {
      if (appState==3) {
              if (rField[0].doubled[fieldSelected]==this.ID) {
                fill(210);
                textFont(semibold, 667*.03*sF);
                noStroke();
                text("x2", xC+this.pos.x*sF, yC+(this.pos.y+15)*sF);
              }
            }

      if(appState==4&&orcahAnalog){
        strokeWeight(667 * 0.004*sF);
        fill(this.ballColour(1))
        stroke(this.ballStroke(1))
        for(let i=0;i<this.remoteBalls[1];i++){
          if(this.remoteBalls[2]==0)ellipse(xC + (this.pos.x) * sF, yC + (this.pos.y - 667 * 0.025 * (i-2)) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
          else ellipse(xC + (this.pos.x - 375 * 0.04) * sF, yC + (this.pos.y - 667 * 0.025 * (i-2)) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
        }
        fill(this.ballColour(2));
        stroke(this.ballStroke(2))
        for(let i=0;i<this.remoteBalls[2];i++){
          if(this.remoteBalls[1]==0)ellipse(xC + (this.pos.x) * sF, yC + (this.pos.y - 667 * 0.025 * (i-2)) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
          else ellipse(xC + (this.pos.x + 375 * 0.04) * sF, yC + (this.pos.y - 667 * 0.025 * (i-2)) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
        }
      }
      else {
        stroke(this.ballStroke(1));
        strokeWeight(667 * 0.004*sF);
        fill(250, 60, 60);
        //noFill();
        ellipse(xC + (this.pos.x - 375 * 0.04) * sF, yC + (this.pos.y + 667 * 0.05) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
        stroke(this.ballStroke(2));
        fill(60, 60, 250);
        ellipse(xC + (this.pos.x + 375 * 0.04) * sF, yC + (this.pos.y + 667 * 0.05) * sF, 667 * 0.05 * sF, 667 * 0.05 * sF);
        fill(210);
        noStroke();
        textFont(semibold, 667*0.0175*2*sF);
        //textSize(667 * 0.0175 * sF);
        text(this.remoteBalls[1], xC + (this.pos.x - 375 * 0.04) * sF, yC + (this.pos.y + 667 * 0.062) * sF);
        text(this.remoteBalls[2], xC + (this.pos.x + 375 * 0.04) * sF, yC + (this.pos.y + 667 * 0.062) * sF);
      }
    }
  }
}









class Button {

  //      x pos    y pos    width    height  corner    text     stroke   text color  offset, text size, box fill, box fill alt
  constructor(x_, y_, w_, h_, c_, t_, s_, f_, o_, tS_, fA_, fB_) {
    this.clicked = false;
    this.circle = false;
    //print("construct button")
    this.x = x_;
    this.y = y_;
    this.h = h_;
    this.w = w_;
    this.c = c_;
    this.bText = t_;
    this.s = s_;
    this.f = f_;
    this.o = o_;
    this.tSize = tS_;
    this.fA = fA_;
    this.fB = fB_;
    this.sWeight = 667 * 0.004;
  }

  drawButton() {
    this.clicked = false;
    fill(this.fA);
    if (this.fA == color(0, 0)) noFill();
    if (mouseX > xC + (this.x - this.w * 0.5) * sF && mouseX < xC + (this.x + this.w * 0.5) * sF && mouseY > yC + (this.y - this.h * 0.5) * sF && mouseY < yC + (this.y + this.h * 0.5) * sF) {
      fill(this.fB);
      if (this.fB == color(0, 0)) noFill();
      if (click) {
        this.clicked = true;
        click = false;
      }
    }
    if (this.s == color(0, 0)) noStroke();
    else stroke(this.s);
    strokeWeight(this.sWeight * sF);
    if (this.circle) ellipse(xC + this.x * sF, yC + this.y * sF, this.w * sF, this.h * sF);
    else rect(xC + this.x * sF, yC + this.y * sF, this.w * sF, this.h * sF, this.c * sF);
    fill(this.f);
    //textFont(dual,tSize);
    textFont(regular,this.tSize*sF);
    //textSize(this.tSize * 0.5 * sF);
    noStroke();
    text(this.bText, xC + this.x * sF, yC + (this.y + this.o) * sF);
  }

}








class remoteField {

  constructor(type) {
    this.remoteType = type;
    this.rFields = [];
    this.doubled = [-1, -1, -1, -1]; //red 1, red 2, blue 1, blue 2
    this.rT = color(250, 60, 60);
    this.bT = color(60, 60, 250);
    this.tColor = [color(0), color(250, 60, 60), color(60, 60, 250)]
    this.rowMultiplier = [6, 4, 6, 6, 4, 6, 4, 4];
    this.blueGoalScores = [];
    this.redGoalScores = [];
    this.redTotalScore = 0;
    this.blueTotalScore = 0;
    this.g = [
      [],
      [],
      []
    ]
    this.rRows = [
      [],
      [],
      []
    ];

    this.fSelect = [];
    this.goalB = [];

    this.fieldCount = 0;

    this.atGoal = false;


    if (this.remoteType == 1) {
      for (let i = 0; i < 4; i++) {
        this.rFields[i] = new Field(floor(i / 2) + 1, i);
      }
    } else if (this.remoteType == 2) {
      for (let i = 0; i < 2; i++) {
        this.rFields[i] = new Field(i + 1, i);
      }
    }
    this.autonAll = new Button(0, 667 * 0.26, 375 * 0.7, 667 * 0.08, 667 * 0.02, "Auton: Tied", color(0, 0), color(210), 667 * 0.01, 375 * 0.06, color(50), color(45));
    this.resetAll = new Button(-70.3125, 266.8, 375 * 0.325, 667 * 0.15, 667 * 0.02, "Reset\nAll", color(0, 0), color(210), -667 * 0.01, 375 * 0.06, color(50), color(45));
    this.clearAll = new Button(70.3125, 266.8, 375 * 0.325, 667 * 0.15, 667 * 0.02, "Clear\nAll", color(0, 0), color(210), -375 * 0.01, 375 * 0.06, color(50), color(45));
    this.offset1 = 375 * 0.275;
    this.offset2 = 375 * 0.09125;
    this.w = 375 * 0.15;
    this.y = -667 * 0.275;
    if (this.remoteType == 1) {
      this.fieldCount = 4;
      this.fSelect[0] = new Button(-this.offset1, this.y, this.w, 667 * 0.08, 667 * 0.02, "1", color(0, 0), color(250, 60, 60), 667 * 0.015, 667 * 0.045, color(50), color(45));
      this.fSelect[1] = new Button(-this.offset2, this.y, this.w, 667 * 0.08, 667 * 0.02, "2", color(0, 0), color(250, 60, 60), 667 * 0.015, 667 * 0.045, color(50), color(45));
      this.fSelect[2] = new Button(this.offset2, this.y, this.w, 667 * 0.08, 667 * 0.02, "3", color(0, 0), color(60, 60, 250), 667 * 0.015, 667 * 0.045, color(50), color(45));
      this.fSelect[3] = new Button(this.offset1, this.y, this.w, 667 * 0.08, 667 * 0.02, "4", color(0, 0), color(60, 60, 250), 667 * 0.015, 667 * 0.045, color(50), color(45));
    } else if (this.remoteType == 2) {
      this.fieldCount = 2;
      this.fSelect[0] = new Button(-70.3125, this.y, 375 * 0.325, 667 * 0.08, 667 * 0.02, "1", color(0, 0), color(250, 60, 60), 667 * 0.015, 667 * 0.045, color(50), color(45));
      this.fSelect[1] = new Button(70.3125, this.y, 375 * 0.325, 667 * 0.08, 667 * 0.02, "2", color(0, 0), color(60, 60, 250), 667 * 0.015, 667 * 0.045, color(50), color(45));
    }
    for (let i = 0; i < 9; i++) {
      this.goalB[i] = new Button(i % 3 * 375 * 0.25 - 375 * 0.25, floor(i / 3) * 375 * 0.25 - 101.525, 375 * 0.1, 375 * 0.16, 667 * 0.02, "", color(0, 0), color(0, 0), 0, 1, color(50), color(45));
    }
    this.resetFields(-1, (this.remoteType+2));
    this.scoreField();
    this.escape = new Button(0, -667 * 0.41, 375, 667 * 0.18, 0, "", color(0, 0), color(0, 0), 0, 1, color(0, 0), color(0, 0));
  }


  update() {
    if (fieldSelected == -1 && goalSelected == -1) {
      this.drawField();
      this.drawRows();
    } else if (fieldSelected == -1 && goalSelected != -1) {
      this.drawFieldLines();
      if (this.remoteType == 1) {
        for (let i = 0; i < 4; i++) {
          this.rFields[i].goals[goalSelected].editGoalRemote();
        }
      } else if (this.remoteType == 2) {
        for (let i = 0; i < 2; i++) {
          this.rFields[i].goals[goalSelected].editGoalRemote();
        }
      }
    } else
      this.rFields[fieldSelected].update();

    if (postClick2) this.scoreField();
    this.drawScore();
    this.drawButtons();
    if (fieldSelected != -1 || goalSelected != -1) {
      this.escape.drawButton();
      if (this.escape.clicked) {
        if (goalSelected == -1 && fieldSelected != -1) {
          if(appState==3)pFieldSelected[0]=fieldSelected;
          else if(appState==4)pFieldSelected[1]=fieldSelected;
          fieldSelected = -1;
        }
        //else if(goalSelected!=-1&&fieldSelected==-1)goalSelected=-1;
        else {
          if (fieldSelected == -1) {
            this.resetCounterScale();
          }
          pGoalSelected[appState-1]=goalSelected;
          goalSelected = -1;
        }
      }
    }
  }

  resetCounterScale() {
    for (let i = 0; i < (this.remoteType - 3) * -2; i++) {
      for (let j = 0; j < 9; j++) {
        this.rFields[i].goals[j].remoteC.setScale(1, 1, i);
      }
    }
  }

  scoreField() {
    this.redTotalScore = 0;
    this.blueTotalScore = 0;
    for (let i = 0; i < this.fieldCount; i++) {
      this.rFields[i].scoreField();
    }
    if (this.remoteType == 1) {
      this.redTotalScore += this.rFields[0].remoteBallScore + this.rFields[1].remoteBallScore;
      this.blueTotalScore += this.rFields[2].remoteBallScore + this.rFields[3].remoteBallScore;
    } else if (this.remoteType == 2) {
      this.redTotalScore += this.rFields[0].remoteBallScore;
      this.blueTotalScore += this.rFields[1].remoteBallScore;
    }
    if (this.autonWinner == 0) {
      if (this.remoteType == 1) {
        this.redTotalScore += 3;
        this.blueTotalScore += 3;
      } else if (this.remoteType == 2) {}
    } else if (this.autonWinner == 1) {
      if (this.remoteType == 1) this.redTotalScore += 6;
      else this.redTotalScore += 3;
    } else if (this.autonWinner == 2) {
      if (this.remoteType == 1) this.blueTotalScore += 6;
      else this.blueTotalScore += 3;
    }


    for (let i = 0; i < 9; i++) {
      if (this.remoteType == 1) {
        this.redGoalScores[i] = this.rFields[0].remoteGoalScore[i] + this.rFields[1].remoteGoalScore[i];
        this.blueGoalScores[i] = this.rFields[2].remoteGoalScore[i] + this.rFields[3].remoteGoalScore[i];
      } else if (this.remoteType == 2) {
        this.redGoalScores[i] = this.rFields[0].remoteGoalScore[i];
        this.blueGoalScores[i] = this.rFields[1].remoteGoalScore[i];
      }
    }
    this.g = [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ];

    for (let i = 0; i < 9; i++) {
      this.j = 0;
      if (this.redGoalScores[i] > this.blueGoalScores[i]) this.j = 1;
      else if (this.blueGoalScores[i] > this.redGoalScores[i]) this.j = 2;
      this.g[i % 3][floor(i / 3)] = this.j;
    }
    this.rRows = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.g[j][0] == i && this.g[j][1] == i && this.g[j][2] == i) this.rRows[i][j] = 1;
        if (this.g[0][j] == i && this.g[1][j] == i && this.g[2][j] == i) this.rRows[i][j + 3] = 1;
      }
      if (this.g[0][0] == i && this.g[1][1] == i && this.g[2][2] == i) this.rRows[i][6] = 1;
      if (this.g[2][0] == i && this.g[1][1] == i && this.g[0][2] == i) this.rRows[i][7] = 1;
    }
    for (let i = 0; i < 8; i++) {
      if (this.remoteType == 1) {
        this.redTotalScore += 13 * this.rRows[1][i];
        this.blueTotalScore += 13 * this.rRows[2][i];
      } else if (this.remoteType == 2) {
        this.redTotalScore += this.rowMultiplier[i] * this.rRows[1][i];
        this.blueTotalScore += this.rowMultiplier[i] * this.rRows[2][i];
      }
    }

    //rRows[1][0]=1;
  }

  drawButtons() {
    if (goalSelected == -1) {

      for (let i = 0; i < this.fieldCount; i++) {
        if (fieldSelected == i) {
          if (this.remoteType == 1 && i <= 1 || i == 0) this.fSelect[i].s = color(260, 50, 50);
          else this.fSelect[i].s = color(50, 50, 260);
        } else this.fSelect[i].s = color(0, 0);
        this.fSelect[i].drawButton();
        if (this.fSelect[i].clicked) {
          if (fieldSelected == i) fieldSelected = -1;
          else fieldSelected = i;
        }
      }

      this.autonAll.drawButton();
      if (this.autonAll.clicked) {
        if (this.autonWinner == 0) {
          this.autonWinner = 1;
          this.autonAll.bText = "Auton: Red";
          this.autonAll.s = color(250, 60, 60);
          this.autonAll.f = color(250, 60, 60);
        } else if (this.autonWinner == 1) {
          this.autonWinner = 2;
          this.autonAll.bText = "Auton: Blue";
          this.autonAll.s = color(60, 60, 250);
          this.autonAll.f = color(60, 60, 250);
        } else if (this.autonWinner == 2) {
          this.autonWinner = 0;
          this.autonAll.bText = "Auton: Tied";
          this.autonAll.s = color(0, 0);
          this.autonAll.f = color(210);
        }
      }
    }

    if (fieldSelected == -1) {
      this.resetAll.drawButton();
      if (this.resetAll.clicked) this.resetFields( -1, appState);

      this.clearAll.drawButton();
      if (this.clearAll.clicked) this.resetFields( -1, 0);
    }
  }


  drawScore() {

    if (goalSelected == -1&&!(this.remoteType==2&&counterOn)) {
      strokeWeight(667 * 0.004 * sF);
      fill(130);
      stroke(100);

      fill(210, 30, 30);
      stroke(250, 60, 60);
      rect(xC + 375 * 0.31 * sF, yC - 299.75 * sF, 375 * 0.06 * sF, 375 * 0.06 * sF, 375 * 0.02 * sF);
      if (this.remoteType == 1) rect(xC + 375 * 0.31 * sF, yC - 262.25 * sF, 375 * 0.06*sF, 375 * 0.06*sF, 375 * 0.02*sF);

      stroke(60, 60, 250);
      fill(30, 30, 210);
      rect(xC + 375 * 0.41 * sF, yC - 299.75 * sF, 375 * 0.06 * sF, 375 * 0.06 * sF, 375 * 0.02 * sF);
      if (this.remoteType == 1) rect(xC + 375 * 0.41 * sF, yC - 262.25 * sF, 375 * 0.06*sF, 375 * 0.06*sF, 375 * 0.02*sF);

      //rect(width*.85, width*.15, width*.18, width*.18, width*.02);
      stroke(210, 210, 0);
      noFill();
      if (fieldSelected != -1) {
        if (this.remoteType == 1) rect(xC + (floor(fieldSelected / 2.0) * 375 * 0.10 + 375 * 0.31) * sF, yC + (fieldSelected % 2 * 375 * 0.10 - 299.75) * sF, 375 * 0.06 * sF, 375 * 0.06 * sF, 375 * 0.02 * sF);
        else if (this.remoteType == 2) rect(xC + (fieldSelected % 2 * 375 * 0.10 + 375 * 0.31) * sF, yC - 299.75 * sF, 375 * 0.06 * sF, 375 * 0.06 * sF, 375 * 0.02 * sF);
      }
    }



    //textFont(dual, height*.075);
    textFont(regular, 667*0.0375*2*sF);
    noStroke();
    //textSize(667 * 0.0375 * sF);
    fill(250, 60, 60);
    text(this.redTotalScore, xC - 375 * 0.12 * sF, yC - 667 * 0.35 * sF);
    fill(60, 60, 250);
    text(this.blueTotalScore, xC + 375 * 0.12 * sF, yC - 667 * 0.35 * sF);

    if (fieldSelected == -1 && goalSelected == -1) {
      for (let i = 0; i < 9; i++) {
        stroke(210);
        noStroke();
        fill(this.tColor[1]);
        this.xOffset = 27;
        if (this.doubled[0] == i) {
          ellipse(xC + (this.goalB[i].x - this.xOffset) * sF, yC + (this.goalB[i].y - 20) * sF, 10 * sF, 10 * sF);
        }
        if (this.doubled[1] == i) {
          ellipse(xC + (this.goalB[i].x - this.xOffset) * sF, yC + (this.goalB[i].y - 5) * sF, 10 * sF, 10 * sF);
        }
        fill(this.tColor[2]);
        if (this.doubled[2] == i) {
          ellipse(xC + (this.goalB[i].x + this.xOffset) * sF, yC + (this.goalB[i].y + 5) * sF, 10 * sF, 10 * sF);
        }
        if (this.doubled[3] == i) {
          ellipse(xC + (this.goalB[i].x + this.xOffset) * sF, yC + (this.goalB[i].y + 20) * sF, 10 * sF, 10 * sF);
        }
        fill(40);
        strokeWeight(667 * 0.004 * sF);
        if (this.redGoalScores[i] > this.blueGoalScores[i]) {
          this.goalB[i].s = this.tColor[1];
        } else if (this.blueGoalScores[i] > this.redGoalScores[i]) {

          this.goalB[i].s = this.tColor[2];
        } else {

          this.goalB[i].s = color(0, 0);
        }
        this.goalB[i].drawButton();
        if (this.goalB[i].clicked) {
          goalSelected = i;
          if (this.remoteType == 1) {
            for (let j = 0; j < 4; j++) {
              for (let k = 0; k < 9; k++) {
                this.rFields[j].goals[k].remoteC.setScale(0.5, 4, j);
              }
            }
          } else if (this.remoteType == 2) {
            for (let j = 0; j < 2; j++) {
              for (let k = 0; k < 9; k++) {
                this.rFields[j].goals[k].remoteC.setScale(0.6, 2, j);
              }
            }
          }
        }
        //rect(i%3*width*.25+width*.25, floor(i/3)*width*.25+height*.3+width*.085, width*.1, width*.16, height*.02);
        fill(this.tColor[1]);
        noStroke();
        textFont(bold, 667*0.04*sF);
        //textSize(667 * 0.02 * sF);
        text(this.redGoalScores[i], xC + (i % 3 * 375 * 0.25 - 375 * 0.25) * sF, yC + (floor(i / 3) * 375 * 0.25 + 375 * 0.075 - 667 * 0.2) * sF);
        fill(this.tColor[2]);
        text(this.blueGoalScores[i], xC + (i % 3 * 375 * 0.25 - 375 * 0.25) * sF, yC + (floor(i / 3) * 375 * 0.25 - 667 * 0.2 + 375 * 0.145) * sF);
      }
    }
  }

  drawRows() {
    this.colours = [];
    this.colours[0] = color(210, 0);
    this.colours[1] = color(210, 30, 30);
    this.colours[2] = color(30, 30, 210);
    this.rowColours=[];
    this.rowColours[0]=color(210,0)
    this.rowColours[1]=color(250,60,60,100)
    this.rowColours[2]=color(60,60,250,100)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.rRows[i][j + 3] == 1) {
          strokeWeight(20*sF);
          //stroke(this.colours[i], 100);
          stroke(this.rowColours[i])
          line(xC - 375 * 0.25 * sF, yC + (j * 375 * 0.25 - 667 * 0.15) * sF, xC + 375 * 0.25 * sF, yC + (j * 375 * 0.25 - 667 * 0.15) * sF);
        }
        if (this.rRows[i][j] == 1) {
          strokeWeight(20*sF);
          //stroke(this.colours[i], 100);
          stroke(this.rowColours[i])
          line(xC + (j * 375 * 0.25 - 375 * 0.25) * sF, yC - (667 * 0.15) * sF, xC + (j * 375 * 0.25 - 375 * 0.25) * sF, yC + (375 * 0.5 - 667 * 0.15) * sF);
        }
      }
      if (this.rRows[i][6] == 1) {
        strokeWeight(20*sF);
        //stroke(this.colours[i], 100);
        stroke(this.rowColours[i])
        line(xC - 375 * 0.25 * sF, yC - 667 * 0.15 * sF, xC + 375 * 0.25 * sF, yC + (375 * 0.5 - 667 * 0.15) * sF);
      }
      if (this.rRows[i][7] == 1) {
        strokeWeight(20*sF);
        //stroke(this.colours[i], 100);
        stroke(this.rowColours[i])
        line(xC + 375 * 0.25 * sF, yC - 667 * 0.15 * sF, xC - 375 * 0.25 * sF, yC + (375 * 0.5 - 667 * 0.15) * sF);
      }
    }
  }

  drawFieldLines() {
    if (this.remoteType == 1) {
      this.yPos=(yC + (375 * 0.25 - 667 * 0.175) * sF);
      noFill();
      stroke(250, 60, 60);
      strokeWeight(667 * 0.004 * sF);
      rect(xC - 375 * 0.165 * sF, this.yPos, 375 * 0.33*sF, 375 * 0.9*sF, 667 * 0.02*sF, 0, 0, 667 * 0.02*sF);
      stroke(60, 60, 250);
      rect(xC + 375 * 0.165 * sF, this.yPos, 375 * 0.33*sF, 375 * 0.9*sF, 0, 667 * 0.02*sF, 667 * 0.02*sF, 0);
      stroke(40);
      strokeWeight(667 * 0.06 * sF);
      line(xC, yC + (-667 * 0.175 - 375 * 0.2) * sF, xC, yC + (667 * 0.175 + 375 * 0.2) * sF);
    } else if (this.remoteType == 2) {
      noFill();
      stroke(250, 60, 60);
      strokeWeight(667 * 0.004 * sF);
      rect(xC - 375 * 0.185 * sF, yC + (375 * 0.25 - 667 * 0.175) * sF, 375 * 0.4 * sF, 375 * 0.5 * sF, 667 * 0.02 * sF, 0, 0, 667 * 0.02 * sF);
      stroke(60, 60, 250);
      rect(xC + 375 * 0.185 * sF, yC + (375 * 0.25 - 667 * 0.175) * sF, 375 * 0.4 * sF, 375 * 0.5 * sF, 0, 667 * 0.02 * sF, 667 * 0.02 * sF, 0);
      stroke(40);
      strokeWeight(667 * 0.06 * sF);
      line(xC, yC + (-667 * 0.175 - 375 * 0.2) * sF, xC, yC + (667 * 0.175 + 375 * 0.2) * sF);
      strokeWeight(375 * 0.3 * sF);
      line(0, yC + (375 * 0.25 - 667 * 0.175) * sF, xC * 2, yC + (375 * 0.25 - 667 * 0.175) * sF);
    }
  }

  drawField() {

    noFill();
    strokeWeight(667 * 0.004 * sF);
    stroke(80);
    line(xC - 375 * 0.01 * sF, yC - 137.55 * sF, xC - 375 * 0.01 * sF, yC + 124.95 * sF);
    line(xC + 375 * 0.01 * sF, yC - 137.55 * sF, xC + 375 * 0.01 * sF, yC + 124.95 * sF);
    line(xC - 375 * 0.7 * 0.25 * sF, yC - 137.55 * sF, xC - 375 * 0.7 * 0.25 * sF, yC + 124.95 * sF);
    line(xC + 375 * 0.7 * 0.25 * sF, yC - 137.55 * sF, xC + 375 * 0.7 * 0.25 * sF, yC + 124.95 * sF);
    //line(width*.5-width*.4,(height*.3+width*.25+height*.05),width*.5+width*.4,(height*.3+width*.25+height*.05));
    line(xC - 375 * 0.7 * 0.5 * sF, yC - 6.3 * sF, xC - 375 * 0.7 * 0.25 * sF, yC - 6.3 * sF);
    line(xC + 375 * 0.7 * 0.5 * sF, yC - 6.3 * sF, xC + 375 * 0.7 * 0.25 * sF, yC - 6.3 * sF);
    stroke(180);
    rect(xC, yC - 6.3 * sF, 375 * 0.7 * sF, 375 * 0.7 * sF, 667 * 0.02 * sF);

  }



  resetFields(r, t) { //for r: -1=Reset All Fields, 0-3=Reset Specific Field, t=reset type (clear or normal)
    this.autonWinner = 0;
    this.autonAll.bText = "Auton: Tied";
    this.autonAll.s = color(0, 0);
    this.autonAll.f = color(210);
    if (this.remoteType == 1) {
      for (let i = 0; i < 4; i++) {
        if (this.doubled[i] != -1) {
          //this.rFields[i].goals[this.doubled[i]].remoteC.doubler.bText="testing";


          this.rFields[i].goals[this.doubled[i]].remoteC.doubler.s = color(100);
          this.rFields[i].goals[this.doubled[i]].remoteC.doubler.bText = "Not Doubled";
          this.doubled[i] = -1;

        }
      }
    }
    if (r == -1) {
      for (let i = 0; i < this.fieldCount; i++) {
        this.rFields[i].resetField(t);
      }
    } else this.rFields[r].resetField(t);
  }
}
