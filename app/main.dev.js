/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, crashReporter, dialog } from 'electron'
import MenuBuilder from './menu'
import Backend from './backend'
import touchbar from './touchbar'

let mainWindow = null
let backend = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')()
  const path = require('path')
  const p = path.join(__dirname, '..', 'src', 'node_modules')
  require('module').globalPaths.push(p)
}

const installExtensions = () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ]

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log)
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  // app.setPath('temp', '/tmp')

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  // crashReporter.start({
  //   productName: 'qri',
  //   companyName: 'qri.io'
  // })

  // console.log('starting backend...')
  // startBackend().then(createMainWindow).catch((err) => {
  //   dialog.showErrorBox('error starting qri backend', err)
  // })
  backend = new Backend()
  backend.on('connect', createMainWindow)
})

app.on('quit', () => {
  if (backend) {
    backend.destroy()
  }
})

function createMainWindow () {
  console.log('booting app...')
  let mainWindow = new BrowserWindow({
    show: false,
    width: 1500,
    height: 728,
    titleBarStyle: 'hiddenInset'
  })

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.setTouchBar(touchbar)

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
  //   console.log(event)
  //   // Set the save path, making Electron not to prompt a save dialog.
  //   item.setSavePath('/tmp/save.pdf')

  //   item.on('updated', (event, state) => {
  //     if (state === 'interrupted') {
  //       console.log('Download is interrupted but can be resumed')
  //     } else if (state === 'progressing') {
  //       if (item.isPaused()) {
  //         console.log('Download is paused')
  //       } else {
  //         console.log(`Received bytes: ${item.getReceivedBytes()}`)
  //       }
  //     }
  //   })
  //   item.once('done', (event, state) => {
  //     if (state === 'completed') {
  //       console.log('Download successfully')
  //     } else {
  //       console.log(`Download failed: ${state}`)
  //     }
  //   })
  // })
}