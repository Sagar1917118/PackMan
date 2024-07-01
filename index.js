const canvas=document.querySelector("canvas");
const dimension=Math.min(window.innerWidth,window.innerHeight);
console.log(dimension);
canvas.width=dimension/1.235;
canvas.height=dimension/1.13;
const X=canvas.offsetLeft;
const Y=canvas.offsetTop;
console.log(X,Y);
const c=canvas.getContext('2d');
const bSize=dimension/26;
//packman attributes
const packManRadius=(bSize-2)/2;
var lastTime=0;
var speed=50;
var moveAxis="xAxis";
var signX="+";
var signY="+";
var gamescore=0;
//---
const grid=[
    [1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1],
    [1,2,2,2,2 ,2,2,2,2,2 ,1,2,2,2,2 ,2,2,2,2,2 ,1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2 ,1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2 ,1],
    [1,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,1],
    [1,2,1,1,1 ,2,1,2,1,1 ,1,1,1,2,1 ,2,1,1,1,2 ,1],
    [1,2,2,2,2 ,2,1,2,2,2 ,1,2,2,2,1 ,2,2,2,2,2 ,1],
    [1,1,1,1,1 ,2,1,1,1,1 ,1,2,1,1,1 ,2,1,1,1,1 ,1],
    [0,0,0,0,1 ,2,1,2,2,2 ,2,2,2,2,1 ,2,1,0,0,0 ,0],
    [1,1,1,1,1 ,2,1,2,1,1 ,2,1,1,2,1 ,2,1,1,1,1 ,1],
    [1,2,2,2,2 ,2,2,2,1,2 ,2,2,1,2,2 ,2,2,2,2,2 ,1],
    [1,1,1,1,1 ,2,1,2,1,2 ,2,2,1,2,1 ,2,1,1,1,1 ,1],
    [0,0,0,0,1 ,2,1,2,1,1 ,1,1,1,2,1 ,2,1,0,0,0 ,0],
    [0,0,0,0,1 ,2,1,2,2,2 ,2,2,2,2,1 ,2,1,0,0,0 ,0],
    [1,1,1,1,1 ,2,2,2,1,1 ,1,1,1,2,2 ,2,1,1,1,1 ,1],
    [1,2,2,2,2 ,2,2,2,2,2 ,1,2,2,2,2 ,2,2,2,2,2 ,1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2 ,1],
    [1,2,2,2,1 ,2,2,2,2,2 ,2,2,2,2,2 ,2,1,2,2,2 ,1],
    [1,1,2,2,1 ,2,2,2,2,2 ,1,1,1,2,1 ,2,1,2,2,1 ,1],
    [1,2,2,2,2 ,2,1,2,2,2 ,1,2,2,2,1 ,2,2,2,2,2 ,1],
    [1,2,1,1,1 ,1,1,1,1,2 ,1,2,1,1,1 ,1,1,1,1,2 ,1],
    [1,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,1],
    [1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1],
];
//creating grid
function CreateRect(x,y,width,height,color){
    c.beginPath();
    c.fillRect(x,y,width,height);
    c.fillStyle=color;
    c.fill();
}
for(let i=0;i<23;i++){
    for(let j=0;j<21;j++){
        // console.log(grid[i][j]);
        if(grid[i][j]===1){  
        CreateRect(j*bSize,i*bSize,bSize,bSize,"blue");
        CreateRect(j*bSize+1,i*bSize+1,bSize-1,bSize-1,"black");
        }
    }
}
//creating food
var countFood=0;
function createFood(){
    for(let i=0;i<23;i++){
        for(let j=0;j<21;j++){
            // console.log(grid[i][j]);
            if(grid[i][j]===3){
                grid[i][j]=2;
            }
            if(grid[i][j]===2){  
            CreateRect(j*bSize+(bSize/2),i*bSize+(bSize/2),bSize/5,bSize/5,"red");
            countFood +=1;
            }
        }
    }   
}
createFood();
console.log("totalFood",countFood);
//Creating packMan
function Packman(x,y,xIdx,yIdx){
    this.x=x+packManRadius;
    this.y=y+packManRadius;
    this.xIdx=xIdx;
    this.yIdx=yIdx;
    this.getGridX=function(){
        let t;
        if(signX==="+")
            t=parseInt((this.x)/bSize);
        else if(signX==="-")
            t=parseInt((this.x)/bSize);
        // console.log("x",t);
        return t;

    }
    this.getGridY=function(){
        let t;
        if(signY==="+")
            t=parseInt((this.y)/bSize);
        else if(signY==="-")
            t=parseInt((this.y)/bSize);
        // console.log("y",t);
        return t;
    }
    this.draw=function(){
        // console.log("sagar");
        c.beginPath();
        c.arc(this.x,this.y,packManRadius,0,Math.PI*2,false);
        c.fillStyle="yellow";
        c.fill();
        c.strokeStyle="black";
        c.stroke();
    }
    this.updateX=function(){
        c.clearRect(this.x-packManRadius,this.y-packManRadius,bSize,bSize);
        this.x =eval(`this.x${signX}4`);
        this.draw();
    }
    this.updateY=function(){
        c.clearRect(this.x-packManRadius,this.y-packManRadius,bSize,bSize);
        this.y =eval(`this.y${signY}4`);
        this.draw();
    }
}
var flagX=false;
var flagY=false;
let p1= new Packman(bSize,bSize,0,0);
p1.draw();
function animate(currentTime){
    window.requestAnimationFrame(animate);
    var delay=(currentTime-lastTime)/1000;
    if(delay<1/speed)
        return;
    lastTime=currentTime;
    
    if(moveAxis==="xAxis"){
        flagY=false;
        // p1.y=p1.getGridY()*bSize+packManRadius;
        if(grid[p1.getGridY()][eval(`p1.getGridX()${signX}1`)]===2||grid[p1.getGridY()][eval(`p1.getGridX()${signX}1`)]===3){
            c.clearRect(p1.x-packManRadius,p1.y-packManRadius,bSize,bSize);
            p1.y=p1.getGridY()*bSize+packManRadius;
            //collecting food
            if(grid[p1.getGridY()][p1.getGridX()]===2){
                gamescore +=1;
                grid[p1.getGridY()][p1.getGridX()]=3; 
                console.log(gamescore);  
            }
            p1.updateX();
            flagX=true;
        }
        else if(flagX){
            c.clearRect(p1.x-packManRadius,p1.y-packManRadius,bSize,bSize);
            p1.x =eval(`p1.x${signX}${packManRadius/1.2}`);
            p1.draw();  
            flagX=false;
        }
    }
    else if(moveAxis=="yAxis"){
        flagX=false;
        // p1.x=p1.getGridX()*bSize+packManRadius;
        if(grid[eval(`p1.getGridY()${signY}1`)][p1.getGridX()]===2||grid[eval(`p1.getGridY()${signY}1`)][p1.getGridX()]===3){
            c.clearRect(p1.x-packManRadius,p1.y-packManRadius,bSize,bSize);
            p1.x=p1.getGridX()*bSize+packManRadius;
            if(grid[p1.getGridY()][p1.getGridX()]===2){
                gamescore +=1;
                grid[p1.getGridY()][p1.getGridX()]=3;   
                console.log(gamescore);
            }
            p1.updateY();
            flagY=true;
        }
        else if(flagY){
            c.clearRect(p1.x-packManRadius,p1.y-packManRadius,bSize,bSize);
            p1.y =eval(`p1.y${signY}${packManRadius/1.2}`);
            p1.draw();  
            flagY=false;
        }
    }
    //completed total food
    if(countFood===gamescore){
        countFood=0;
        gamescore=0;
        createFood();
    }
}
function DoIt(){
animate();
}
//adding event listener on window
window.addEventListener("keydown",(event)=>{
    switch(event.key){
        case "ArrowUp":
            // console.log("1");
            moveAxis="yAxis";
            signY="-";
            break;
        case "ArrowDown":
            console.log("2");
            moveAxis="yAxis";
            signY="+"
            break;
        case "ArrowLeft":
            console.log("3");
            moveAxis="xAxis";
            signX="-";
            break;
        case "ArrowRight":
            console.log("4");
            moveAxis="xAxis";
            signX="+"
            break;
    }
})

