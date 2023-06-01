const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const layers = [];
const currentLayerIndex = 0;

const thumbnailWidth = 150;
const thumbnailHeight = 150;

let isPainting = false;
const currentColor = 'black';

let brushSize = 2;

let previousX = 0;
let previousY = 0;

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mouseleave', stopPainting);

class Layer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        
        this.isVisible = true;
    }
}

function addLayer() {
    const layer = new Layer();
    layers.push(layer);

    const layerThumbnail = document.createElement('canvas');
    layerThumbnail.id = 'layerThumbnail' + currentLayerIndex;
    layerThumbnail.width = thumbnailWidth; 
    layerThumbnail.height = thumbnailHeight;
    layerThumbnail.style.border = "1px solid";
    layerThumbnail.style.margin = "10px";
    document.getElementById('layerThumbailsContainer').appendChild(layerThumbnail);

    layer.thumbnailCanvas = layerThumbnail;

}

function startPainting(event) {
    isPainting = true;

    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;

    previousX = x;
    previousY = y;

    draw(event);
}

function stopPainting() {
    isPainting = false;
}

function draw(event) {
    if (!isPainting) return;

    let currentX = event.clientX - canvas.offsetLeft;
    let currentY = event.clientY - canvas.offsetTop;

    let context = layers[currentLayerIndex].context;

    context.lineJoin = 'round';
    context.lineWidth = brushSize;

    if (previousX !== 0 && previousY !== 0) {
        let distance = Math.sqrt(Math.pow(currentX - previousX, 2) + Math.pow(currentY - previousY, 2));
        let angle = Math.atan2(currentY - previousY, currentX - previousX);

        for (let i = 0; i < distance; i++) {
            let x = previousX + (Math.cos(angle) * i);
            let y = previousY + (Math.sin(angle) * i);
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fillStyle = currentColor;
            context.fill();
        }
    }

    previousX = currentX;
    previousY = currentY;
   redrawLayers();
}

function redrawLayers() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
       
    if (layer.isVisible) {
            context.drawImage(layer.canvas, 0, 0);
        }
    }
}