var scene = document.getElementById('grid');
var parallaxInstance = new Parallax(scene);
var stage        = document.querySelector('#dots'),
    cb           = stage.getBoundingClientRect(),

    context          = stage.getContext('2d'),

    ratio        = window.devicePixelRatio || 1,
    mouse        = {x: 0, y: 0},
    dots         = [],
    wide         = 46,
    high         = wide/1.8,
    size         = 30,
    padding      = 0

window.onmousemove = function(e){
    mouse.x = e.pageX * ratio;
    mouse.y = e.pageY * ratio;
}

window.onresize = function(){
    context.canvas.width  = document.documentElement.clientWidth * ratio;
    context.canvas.height = document.documentElement.clientHeight;
    cb = stage.getBoundingClientRect();
}

window.onresize();

function create(){
  var d = 20;
  for(var i=-1; ++i<wide;){
      var x = Math.floor((((cb.width-padding*2) / (wide-1)) * i) + padding);

      for(var j=-1; ++j<high;){

          var y = Math.floor((((cb.height-padding*2) / (high-1)) * j) + padding);

          dots.push({
              x: x,
              y: y,
              ox: x,
              oy: y
          });
      }
  }
}


create();



function render(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = '#D8D4CC';

    for(var i=1;i<dots.length;i++){
        var s = dots[i];

        var v = getV(s)

        context.circle(s.x + v.x, s.y + v.y, s.size, true);
        context.fill();
    }

    
}

function getV(dot) {
    var d = getDistance(dot, mouse);
    dot.size = (150-d)/30
    dot.size = dot.size < 1 ? 1 : dot.size;

    dot.angle = getAngle(dot, mouse);

    return {
        x: (d > 1 ? 20 : d) * Math.cos(dot.angle * Math.PI / 180),
        y: (d > 1 ? 20 : d) * Math.sin(dot.angle * Math.PI / 180)
    }
}

function getAngle(obj1, obj2){
    var dX = obj2.x - obj1.x;
    var dY = obj2.y - obj1.y;
    var angleDeg = Math.atan2(dY,dX)/Math.PI*180;
    return angleDeg;
}

function getDistance(obj1, obj2){
    var dx = obj1.x-obj2.x;
    var dy = obj1.y-obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

CanvasRenderingContext2D.prototype.circle = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI, false);
    this.closePath();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();



(function animloop(){
    
    render();

    requestAnimationFrame(animloop);
    
})();




const canvas = document.querySelector("#trail");
const ctx = canvas.getContext('2d');

let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}



let strokeColor = '#D8D4CC';



window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});

window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

function update(t) {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

