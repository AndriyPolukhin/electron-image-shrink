// * Squirrel Events!
// * handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
// * Dependencies
const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron');

// * DOM Elements reference
const form = document.getElementById('image-form');
const slider = document.getElementById('slider');
const img = document.getElementById('img');
const outputpath = document.getElementById('output-path');

// * Set InnerHTML of the output divv
outputpath.innerText = path.join(
  os.homedir(),
  //   __dirname,
  'imageshrink'
);

// * Event Listeners

// * Form Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // * Get the img file path and quality value
  const imgPath = img.files[0].path;
  const quality = slider.value;

  // * Send the event to the ipcMain
  ipcRenderer.send('image:minimize', {
    imgPath,
    quality,
  });
});

// * onDone
ipcRenderer.on('image:done', () => {
  M.toast({
    html: `Image Resized to ${slider.value}% quality`,
  });
});
