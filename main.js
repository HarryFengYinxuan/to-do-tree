const { app, BrowserWindow, ipcMain } = require('electron')
const readline = require('readline');
const net = require('net')
// const log = require('electron-log');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/main.log', {flags : 'w'});
// var log_stdout = process.stdout;

// log = function(d) { //
//   var t = new Date()
//   log_file.write("" + t.getHours() + ":" + t.getMinutes() + " " + util.format(d) + '\n');
//   // log_stdout.write(util.format(d) + '\n');
// };

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// when reading something from the stdin, it is assumed that they are commands
// so those commands are transferred to index2, which is the win. in the future,
// there might be more than one window that is using it, so maybe main has to process it first
// var cmdRead = ""
// rl.on('line', (input) => {
//   log(`Received from stdin: ${input}`)
//   cmdRead = input
//   win.webContents.send('asynchronous-message', cmdRead)
//   console.log("received")
//   // console.log("sended "+cmdRead)
  
// });

// ipcMain.on('asynchronous-message', (event, arg) => {
//   log.info("main got: "+arg)
// })

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true   },
    width: 415, 
    height: 650})

  // and load the index2.html of the app.
  win.loadFile('index2.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  })

  win.on('close', () => {
    win.webContents.send('asynchronous-message', "closed");
  })
  // socketClient = net.connect({host:'localhost', port:9999},  () => {
  //   // 'connect' listener
  //   console.log('connected to server!');
  //   socketClient.write('hello\r\n');
  // });

  // socketClient.on('data', (data) => {
  //   console.log(data.toString());
  //   // var person = JSON.parse(data);

  //   // console.log('Hello '+person.prenom+"!");

  // });
  // socketClient.on('end', () => {
  //   console.log('disconnected from server');
  // });
  console.log("ready")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    // socketClient.end()
    app.quit()
  // }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.