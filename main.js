// * Squirrel Events!
// * handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
// * Dependencies
// * Core Node:
const path = require('path');
const os = require('os');
// * Core Electron
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
// * 3rd Party: Imagemin
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');
const log = require('electron-log');
// * Set ENV
// process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';
// * Check is Dev Env
const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

// * Window Declaration
let mainWindow;
let aboutWindow;

// * @fn to Create a window
function createMainWindow() {
  // * Instantiate the mainWindow
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: isDev ? 800 : 500,
    height: 600,
    icon: path.join(__dirname, '/assets/icons/Icon_256x256.png'),
    resizable: isDev ? true : false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // * Load URL
  //   mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.loadFile(`./app/index.html`);
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: 'About ImageShrink',
    width: 300,
    height: 300,
    icon: './assets/icons/Icon_256x256.png',
    resizable: isDev ? true : false,
    backgroundColor: 'white',
  });

  aboutWindow.loadFile(`./app/about.html`);
}

app.on('ready', () => {
  // * Call the @fn
  createMainWindow();
  // * Create a Menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // * Garbage Collection
  mainWindow.on('ready', () => (mainWindow = null));
});

// * Menu Template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            {
              role: 'reload',
            },
            {
              role: 'forcereload',
            },
            {
              type: 'separator',
            },
            {
              role: 'toggledevtools',
            },
          ],
        },
      ]
    : []),
];

// * Catch the ipcRenderer data, on send
// * 1. Catch the data
ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageshrink');
  shrinkImage(options);
});

// * 2. @fn to make imagemin operations
async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;

    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });

    log.info(files);

    shell.openPath(dest);

    mainWindow.webContents.send('image:done');
  } catch (error) {
    log.error(error);
  }
}

// * Closing boiler-plate
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
