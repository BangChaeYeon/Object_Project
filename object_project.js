window.onload = init;

var canvas;
var ctx;
var stuff = [];
var thingInMotion; // 현재 드래그되는 대상을 지정한 변수
var diffX, diffY; // 자연스러운 움직임을 표현하기 위함
var goBack = document.getElementById('goBack');
var goForth = document.getElementById('goForth');

goBack.onclick = function(){
    
}

goForth.onclick = function(){
    
}

function init(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    // ctx.fillRect(100, 100, 40, 40); => 사각형을 그리는 canvas 메소드
    canvas.addEventListener('dblclick', makeNewItem, false); // 더블 클릭에 대한 이벤트 핸들러 작성 (해당 객체 복사)
    // 마우스를 누르고 떼지 않는 이벤트 => 떼는 순간 도형을 놓음
    canvas.addEventListener('mousedown', startDrag, false);

    var r1 = new Rect(100, 100, 30, 50, "red");
    //r1.draw();

    var r2 = new Rect(200, 70, 130, 150, "pink");
    //r2.draw();

    var r3 = new Rect(300, 200, 150, 50, "blue");
   //r3.draw();

    var c1 = new Circle(340, 220, 100, "gold");
    //c1.draw();

    var c2 = new Circle(550, 230, 60, "navy");
   // c2.draw();

   var c3 = new Circle(111, 157, 30, "gray");

   stuff.push(r1);
   stuff.push(r2);
   stuff.push(r3);
   stuff.push(c1);
   stuff.push(c2);
   stuff.push(c3);
   drawStuff();

}

function Rect(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.draw = function drawRect(){
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    // 마우스가 내 위에 있는지 여부를 체크 후 true, false 값을 return
    // mx,my는 마우스의 좌표 => 이벤트가 발생하면 자동으로 갖고있는 값
    this.overCheck = function overRect(mx,my){
        if((x <= mx && mx <= x + w) && (y <= my && my <= y + h)){
            return true;
        }
        else return false;
    }
}

function Circle(x, y, r, c){
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.draw = function drawCircle(){
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2.0, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    // 마우스가 자신 위에 있는지 여부를 체크해서 있으면 true 없으면 false를 리턴해줌
    this.overCheck = function overCircle(mx, my){
        if(((this.x - mx) * (this.x - mx) + (this.y - my)*(this.y - my)) <= this.r * this.r){
            return true;
        }
        else return false;
    }
}

function drawStuff(){
    ctx.clearRect(0, 0, 800, 400);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, 800, 400);
    for(i = 0; i < stuff.length; i++){
        stuff[i].draw();
    }
}

function makeNewItem(e){ // 인자로 더블 클릭 이벤트가 넘어와야 함
    // 윈도우가 가지고 있는 x,y 값 좌표에 있는 값
    mx = e.offsetX; // alert(mx);
    my = e.offsetY; // alert(my);
    var item; // 자바스크립트의 모든 변수는 객체이기 때문에 문법적으로 이상이 없음
    for(var i = 0; i < stuff.length; i++){
        if(stuff[i].overCheck(mx, my) == true){
            item = clone(stuff[i]); // reference type은 primitive type 처럼 =으로 복제를 할 수 없기 때문에 따로 함수를 만들어야 한다.
            item.x += 30;
            item.y += 30;
            stuff.push(item);
            break
        }
    }
    drawStuff();
}

// 프로젝트 할 때 객체 복사 할일이 있으면 사용 할 것
function clone(obj){
    var newItem = new Object();
    for(var info in obj){
        newItem[info] = obj[info];
    }
    return newItem;
}

function startDrag(e){
    mx = e.offsetX;
    my = e.offsetY;
    for(var i = 0; i < stuff.length; i++){
        if(stuff[i].overCheck(mx, my) == true){
            diffX = mx - stuff[i].x;
            diffY = my - stuff[i].y;

            // 움직이는 도형 대상을 항상 배열의 맨 끝에 있도록 지정함
            var item = stuff[i];
            thingInMotion = stuff.length - 1;
            stuff.splice(i, 1);
            stuff.push(item);

            // mousemove는 클릭 상태에서 움직일 때 사용함
            canvas.addEventListener('mousemove', moveit, false);
            canvas.addEventListener('mouseup', dropit, false);
            break;
        }
    }
}

function moveit(e){
    mx = e.offsetX;
    my = e.offsetY;
    // 마우스와 도형의 기준점 사이의 간격을 유지하며 이동해야 자연스럽기 때문
    stuff[thingInMotion].x = mx - diffX;
    stuff[thingInMotion].y = my - diffY;
    drawStuff();
}

function dropit(e){
    canvas.removeEventListener('mousemove', moveit, false);
    canvas.removeEventListener('mouseup', dropit, false);
}

// 버튼 하나 이상 추가 => 뭐든지 상관 없음