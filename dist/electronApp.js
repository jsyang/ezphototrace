"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 800, height: 600 });
    win.loadFile(__dirname + '/electronIndex.html');
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
var onReady = function () {
    createWindow();
};
var onWindowAllClosed = function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
};
var onActivate = function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
};
electron_1.app.on('ready', onReady);
electron_1.app.on('window-all-closed', onWindowAllClosed);
electron_1.app.on('activate', onActivate);
