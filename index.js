require('update-electron-app')({
    logger: require('electron-log')
  })
  
  const path = require('path')
  const glob = require('glob')
  const {app, BrowserWindow} = require('electron')
  
  const debug = /--debug/.test(process.argv[2])
  
  if (process.mas) app.setName('Hello Electron')
  
  let mainWindow = null
  
  function initialize () {
    makeSingleInstance()
    
    function createWindow () {
      const windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 840,
        title: app.getName(),
        webPreferences: {
          nodeIntegration: true
        }
      }
    
      mainWindow = new BrowserWindow(windowOptions)
      mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
  
      // Launch fullscreen with DevTools open, usage: npm run debug
      if (debug) {
        mainWindow.webContents.openDevTools()
        mainWindow.maximize()
        require('devtron').install()
      }
  
      mainWindow.on('closed', () => {
        mainWindow = null
      })
    }
  
    app.on('ready', () => {
      createWindow()
    })
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  
    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow()
      }
    })
  }
  
  // Make this app a single instance app.
  //
  // The main window will be restored and focused instead of a second window
  // opened when a person attempts to launch a second instance.
  //
  // Returns true if the current version of the app should quit instead of
  // launching.
  function makeSingleInstance () {
    if (process.mas) return
  
    app.requestSingleInstanceLock()
  
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
  
  
  initialize()