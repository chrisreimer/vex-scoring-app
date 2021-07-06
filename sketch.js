let screenScale=1;

let regular;  //Fonts
let semibold;
let bold;

let gear;

let click;
let postClick;
let held;

let appState=0;

let menuButtons=[];
let infoButton;
let discordButton;


function preload(){
  gear=loadImage('https://vexscoring.app/gear.png');

  regular=loadFont('https://vexscoring.app/NEXT%20ART_Regular.otf');
  semibold=loadFont('https://vexscoring.app/NEXT%20ART_SemiBold.otf');
  bold=loadFont('https://vexscoring.app/NEXT%20ART_Bold.otf');

}

function setup(){
  createCanvas(windowWidth, windowHeight);
  //createCanvas(375, 667);
  if(width/375.0>height/667.0)screenScale=height/667.0;
  else screenScale=width/375.0;
  rectMode(CENTER);
  pixelDensity(2);
  textAlign(CENTER,CENTER);

  infoButton=new Button(-155,-300,55,55,"?");
  //infoButton.tSize=25;
  infoButton.fillA=color(40,40,45);
  infoButton.fillA2=color(45,45,50);
  infoButton.textFill=color(150);

  backButton=new Button(-155,-300,55,55," « ");
  //backButton.textA="<<";
  backButton.tSize=40;
  backButton.fillA=color(40,40,45);

  discordButton=new Button(0,100,200,65,"Join Discord");
  discordButton.fillA=color(88, 101, 242);
  discordButton.fillA2=color(73, 86, 222);
  discordButton.tSize=20;

  menuButtons[0]=new Button(0,0,320,100,"Change Up");
  menuButtons[1]=new Button(0,-120,320,100,"Tipping Point");
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

  if(appState==0){
    textFont(regular,30);
    fill(200);
    noStroke();
    text("Unofficial Vex\nScoring App",0,-265);
    textFont(regular,15);
    fill(150);
    text("By Chris Reimer",0,-200);

    for(let i=0;i<2;i++){
      menuButtons[i].updateButton();
    }
    if(menuButtons[0].clicked){
      window.open("https://vexscoring.app/cu","_self");
    }
    else if(menuButtons[1].clicked){
      window.open("https://vexscoring.app/tip","_self");
    }
    infoButton.updateButton();
    if(infoButton.clicked){
      appState=1;
    }
  }
  else if(appState==1){
    backButton.updateButton();
    if(backButton.clicked){
      appState=0;
    }
    textFont(regular, 30);
    fill(200);
    noStroke();
    text("Info", 0,-290);
    fill(210);
    textSize(17);
    text("This app is still in development,\nand may require you to manually\nclear the cache to be updated.\n\nThis site is a Progressive Web App,\nand can be downloaded to the\nhome screen using the share\nbutton on iOS, or through the\npop-up window on Android.\n\nBugs and Suggestions\ncan be submitted in\nour discord server.",0,-110);
    discordButton.updateButton();
    if(discordButton.clicked){
      window.open("https://discord.gg/PFMRPrhdmQ","_self");
    }
  }
}

function checkClicked(){
  click = false;
  postClick=(postClick+1)%3;
  if (!mouseIsPressed && held) click = true;
  held = mouseIsPressed;
  if(click)postClick=1;
}

class Button{
  constructor(x_,y_,w_,h_,textA_){
    this.x=x_;
    this.y=y_;
    this.w=w_;
    this.h=h_;
    this.textA=textA_;
    this.clicked=false;
    this.tSize=25;
    this.fillA=color(50,50,55);
    this.fillA2=color(45,45,50);
    this.textFill=color(210);
  }
  updateButton(){
    this.clicked=false;
    fill(this.fillA);
    if(mouseX>width*0.5+(this.x-this.w*0.5)*screenScale&&mouseX<width*0.5+(this.x+this.w*0.5)*screenScale&&mouseY>height*0.5+(this.y-this.h*0.5)*screenScale&&mouseY<height*0.5+(this.y+this.h*0.5)*screenScale)this.hover=true;
    else this.hover=false;
    noStroke();
    if(this.hover)fill(this.fillA2);
    if(this.hover&&click){
      this.clicked=true;
      click=false;
    }
    rect(this.x,this.y,this.w,this.h,15);
    fill(this.textFill);
    textFont(regular,this.tSize)
    text(this.textA,this.x,this.y-3);
  }
}
