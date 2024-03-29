const Version = '$VER$';

//initialize settings

var prefBranch = new PrefBranch('');

if (!prefBranch.getBoolPref('initialized')) {
  prefBranch.setBoolPref('initialized', true);
  prefBranch.setCharPref('ver', '');
  prefBranch.setBoolPref('plain', true);
  prefBranch.setBoolPref('thunder', true);
  prefBranch.setBoolPref('qqxuanfeng', false);
  prefBranch.setBoolPref('nocontext', false);
}

if (prefBranch.getCharPref('ver') != Version) {
  if (prefBranch.getCharPref('ver') == '')
    chrome.tabs.create({
      url: chrome.i18n.getMessage("firstrun_url"),
      selected: true
    });
  prefBranch.setCharPref('ver', Version);
}

var settings = {
  plain: prefBranch.getBoolPref('plain'),
  thunder: prefBranch.getBoolPref('thunder'),
  qqxuanfeng: prefBranch.getBoolPref('qqxuanfeng'),
  nocontext: prefBranch.getBoolPref('nocontext')
};

//initialize constants

const MenuItems = {
  process: {
    settings: {
      type: 'normal',
      title: chrome.i18n.getMessage('contextmenu_process_label'),
      onclick: function (aContext, aTab) {
        chrome.tabs.sendMessage(aTab.id, {topic: 'process'});
      }
    }
  },
  decode: {
    settings: {
      type: 'normal',
      title: chrome.i18n.getMessage('contextmenu_decode_label'),
      contexts: ['link'],
      onclick: function (aContext, aTab) {
        chrome.tabs.sendMessage(aTab.id, {topic: 'decode'});
      }
    }
  },
  convert: {
    settings: {
      type: 'normal',
      title: chrome.i18n.getMessage('contextmenu_convert_label'),
      contexts: ['selection'],
      onclick: function (aContext, aTab) {
        chrome.tabs.sendMessage(aTab.id, {topic: 'convert'});
      }
    }
  }
};

//classes

var extension = {
  handleRequest: function (aRequest, aSender, aSendResponse) {
    switch (aRequest.topic) {
      case 'changeMenuItemVisibility':
      /*
        for (var key in aRequest.change)
          if (key in MenuItems)
            chrome.contextMenus.update(MenuItems[key].id, {
              hidden: !aRequest.change[key]
            });
      */
        break;
      case 'getConfig':
        aSendResponse(settings);
        break;
    }
  },
  handleRequestExternal: function (aRequest, aSender, aSendResponse) {
    if (!aSender.tab && !aRequest.tabId) return;
    var tabId = aRequest.tabId || aSender.tab.id;
    switch (aRequest.topic) {
      case 'fix':
      case 'processAll':
        chrome.tabs.sendRequest(tabId, {topic: 'process'});
        break;
    }
  },
  handleAllWindow: function (wins) {
    for (var i = 0, tabs; i < wins.length; i++) {
      tabs = wins[i].tabs;
      for (var j = 0, tab; j < tabs.length; j++) {
        tab = tabs[j];
        chrome.tabs.sendRequest(tab.id, {
          topic: 'updateConfig',
          settings: settings
        });
      }
    }
  },
  handlePrefBranchChange: function (e) {
    if (e.key in settings)
      settings[e.key] = JSON.parse(e.newValue);
    if (e.key == 'nocontext')
      extension.updateContextMenu();
    chrome.windows.getAll({ populate: true }, extension.handleAllWindow);
  },
  init: function () {
    this.updateContextMenu();
    chrome.runtime.onMessage.addListener(this.handleRequest);
    chrome.runtime.onMessageExternal.addListener(this.handleRequestExternal);
    window.addEventListener('storage', this.handlePrefBranchChange);
  },
  updateContextMenu: function () {
    if (!settings.nocontext) {
      for (var key in MenuItems) {
        var item = MenuItems[key];
        delete item.settings.generatedId;
        item.id = chrome.contextMenus.create(item.settings);
      }
    } else {
      for (var key in MenuItems) {
        var item = MenuItems[key];
        if (item.id != undefined)
          chrome.contextMenus.remove(item.id);
        delete item.id;
      }
    }
  }
};

extension.init();
