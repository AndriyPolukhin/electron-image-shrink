// * Dependencies
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// * Set ENV
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'production';
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
    icon: `./assets/icons/Icon_256x256.png`,
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

// * Catch the ipc
ipcMain.on('image:minimize', (e, options) => {
  console.log(options);
});

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
