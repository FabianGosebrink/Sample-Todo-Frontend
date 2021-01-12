const { app, Menu, Tray } = require('electron');

const path = require('path');

let buildTrayIcon = (mainWindow) => {
  let trayIconPath = path.join(__dirname, 'icon.ico');

  tray = new Tray(trayIconPath);
  tray.setToolTip('gatherr');

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open application',
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: 'Create Group',
      click: function () {
        mainWindow.webContents.send('navigate', '/groups/create');
      },
    },
    {
      label: 'Quit',
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

module.exports = {
  buildTrayIcon,
};
