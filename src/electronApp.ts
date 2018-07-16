import {app, BrowserWindow} from 'electron';

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadFile(__dirname + '/electronIndex.html');

    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    })
}

const onReady = () => {
    createWindow();
};

const onWindowAllClosed = () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
};

const onActivate = () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
};

app.on('ready', onReady);
app.on('window-all-closed', onWindowAllClosed);
app.on('activate', onActivate);
