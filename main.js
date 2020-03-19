//get electron
const electron = require("electron");
const url = require("url");
const path = require("path");

//get electron modules
const { app, BrowserWindow } = electron;

// initialize windows : home, create patient/treatment,
// search, patient/visit/treatment/payment details
let mainWindow;

//check if app is ready
app.on("ready", function() {
  //create new window
  mainWindow = new BrowserWindow({ show: false });
  //load html into window
  mainWindow.loadURL("file://" + __dirname + "/mainWindow.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  //Quit app when closed
  mainWindow.on("closed", () => {
    app.quit();
  });
});
