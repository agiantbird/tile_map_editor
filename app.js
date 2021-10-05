var canvas = document.querySelector("canvas");
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetImage = document.querySelector("#tileset-source");

var selection = [0, 0]; //Which tile we will paint from the menu

var isMouseDown = false;
var currentLayer = 0;
var layers = [
   //Bottom
   {
      //Structure is "x-y": ["tileset_x", "tileset_y"]
      //EXAMPLE: "1-1": [3, 4]
   },
   //Middle
   {},
   //Top
   {}
];

function draw() {
   var ctx = canvas.getContext("2d");
   // clear the canvas when we redraw to same layer
   // (because some tiles have transparent space)
               //draw from x, draw from y, draw to x, draw to y 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   // size of selector/brush
   var sizeOfCrop = 32;

   layers.forEach(layer => {
      Object.keys(layer).forEach(key => {
         var positionX = Number(key.split("-")[0]);
         var positionY = Number(key.split("-")[1]);
         var[tilesheetX, tilesheetY] = layer[key];
         ctx.drawImage(
            tilesetImage, // what to read from
            tilesheetX * 32, tilesheetY * 32, // tilesheet x, y (top right corner of the grab)
            sizeOfCrop, sizeOfCrop, // length and width of grab (how much to grab)
            positionX * 32, positionY * 32, // where to place the crop
            sizeOfCrop, sizeOfCrop // size of placement of what was grabbed
         )
      })
   })
}

// e = click event
function getCoords(e) {
   const { x, y } = e.target.getBoundingClientRect();
   const mouseX = e.clientX - x;
   const mouseY = e.clientY - y;
   // get the top left part of the tile (for drawing)
   return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
}

tilesetContainer.addEventListener("mousedown", event => {
   selection = getCoords(event);
   // add padding to move selector where mouse has
   // selected
   tilesetSelection.style.left = selection[0] * 32 + "px";
   tilesetSelection.style.top = selection[1] * 32 + "px";
})

var isMouseDown = false;
canvas.addEventListener("mousedown", () => {
   isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
   isMouseDown = false;
});
// handle dragging mouse out of focus/webpage
canvas.addEventListener("mouseleave", () => {
   isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
   if (isMouseDown) {
      addTile(event);
   }
});

function addTile(mouseEvent) {
   var clicked = getCoords(event);
   var key = clicked[0] + "-" + clicked[1];

   if (mouseEvent.shiftKey) {
      delete layers[currentLayer][key];
   } else {
      layers[currentLayer][key] = [selection[0], selection[1]];
   }

   draw();
}

function setLayer(newLayer) {
   //Update the layer
   currentLayer = newLayer;

   //Update the UI to show updated layer
   var oldActiveLayer = document.querySelector(".layer.active");
   if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
   }
   document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
}

function clearCanvas() {
   layers = [{}, {}, {}];
   draw();
}

// //converts data to image:data string and pipes into new browser tab
// function exportImage() {
//    var data = canvas.toDataURL();
//    var image = new Image();
//    image.src = data;

//    var w = window.open("");
//    w.document.write(image.outerHTML);
// }

function exportImage() {
   // grab the image information
   var data = canvas.toDataURL();
   // create new image object
   var image = new Image();
   // set image to data of exported art
   image.src = data;

   // open a new window
   var w = window.open("");
   // write data to new window
   w.document.write(image.outerHTML);
   // image can now be saved to local drive!
}


tilesetImage.onload = function() {
   //init...
   draw();
   setLayer(0);
}

// tilesetImage.src = "tile_set.png";
// change link to 'load' different palletes
// TODO: Case statement to filter between pallets
tilesetImage.src = "https://i.imgur.com/jpwFUFm.png";

