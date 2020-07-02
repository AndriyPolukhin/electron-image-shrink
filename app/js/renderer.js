const path = require('path');
const os = require('os');

const form = document.getElementById('image-form');

document.getElementById('output-path').innerText = path.join(
  os.homedir(),
  //   __dirname,
  'imageshrink'
);
