import './style.css'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

 canvas.width = canvas.getBoundingClientRect().width;
 canvas.height = canvas.getBoundingClientRect().height;

 console.log(canvas.width, canvas.height);

ctx.lineWidth = 5;
ctx.strokeStyle = 'red';

let drawing = false;

canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();
   
})

canvas.addEventListener('mouseup', (event) => {
    drawing = false;
})

const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

canvas.addEventListener('mousemove', (event) => {
    if(!drawing) return;

    const {x , y} = getMousePosition(canvas, event);
    console.log(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
});





