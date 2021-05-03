// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
let prevPath;
var vol = 100;

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  let c = document.getElementById("user-image");
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);

  console.log("INITIAL: ", ctx);

  ctx.beginPath();
  ctx.rect(0, 0, 400, 400);
  ctx.fillStyle = "black";
  ctx.fill();

  // grab dimensions
  const dimensions = getDimmensions(c.width, c.height, img.width, img.height);


  // draw image
  ctx.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);
  //ctx.drawImage(img, 0, 0);
  //console.log(dimensions['width']);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//image input handler
let input = document.getElementById("image-input");
input.addEventListener('change', () => {
  const path = URL.createObjectURL(input.files[0]);
  // reset form if img change
  if (prevPath && prevPath != path) {
    document.getElementById("generate-meme").reset();
    prevPath = path;
  }
  img.src = path;
  img.alt = input.files[0].name.substr(0, path.indexOf('.'));
});

//submit handler
let form = document.getElementById("generate-meme");
form.addEventListener('submit', (event) => {
  event.preventDefault();
  //console.log("SUBMIT: ", event);
  let c = document.getElementById("user-image");
  let ctx = c.getContext('2d'); 

  ctx.font = "30px Arial";
  ctx.fillStyle = 'white';
  ctx.fillText(document.getElementById("text-top").value, 10, 50);
  ctx.fillText(document.getElementById("text-bottom").value, 10, 350);

  //toggle buttons
  document.getElementById('generate').disabled = true;
  document.getElementById('clear').disabled = false; 
  document.getElementById('read').disabled = false;
});

let buttonClear = document.getElementById('clear');
buttonClear.addEventListener('click', () => {
  
  let c = document.getElementById("user-image");
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height); 

  document.getElementById("generate-meme").reset();
  document.getElementById('generate').disabled = false;
  document.getElementById('clear').disabled = true; 
  document.getElementById('read').disabled = true; 
});

let buttonRead = document.getElementById('read');
buttonRead.addEventListener('click', () => {
  // speech synthesis
  const synth = window.speechSynthesis;

  // const voiceSelect = 
  const text = document.getElementById("text-top").value + " " + document.getElementById("text-bottom").value;
  const utterance = new SpeechSynthesisUtterance(text);
  const decVar = vol / 100;
  utterance.volume = decVar.toFixed(2);
  console.log(utterance.volume);
  speechSynthesis.speak(utterance);
});

const volumeInput = document.getElementById('volume');
volumeInput.addEventListener('change', () => {
  vol = document.getElementById("volume").value;
  // update volume
  let level;
  const vol_icon = document.getElementById("volume-icon");
  const icon = "volume-level-";
  if (vol >= 67 && vol <= 100) {
    level = 3;
  } else if (vol >= 34 && vol <= 66) {
    level = 2;
  } else if (vol >= 1 && vol <= 33) {
    level = 1;
  } else {
    level = 0;
  }
  // change icon
  vol_icon.src = "./icons/" + icon + level + ".svg";
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
