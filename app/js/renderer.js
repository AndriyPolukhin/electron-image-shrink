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

  const imgPath = img.files[0].path;
  const quality = slider.value;

  ipcRenderer.send('image:minimize', {
    imgPath,
    quality,
  });
});
