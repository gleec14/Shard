function getTabs() {
  // Get tabs in current window
  return new Promise((resolve, reject) => {
    chrome.tabs.query({currentWindow:true}, function(tabs){
      resolve(tabs);
    });
  });
}

function getFolders() {
  // gets the folders in "Other bookmarks"
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree(function(bookmarkNodes){
      var folders = bookmarkNodes[0].children[1].children;
      resolve(folders);
    });
  });
}

function create_new_bookmark_and_populate(gem_name, tabs) {
  // Create a new bookmark folder and place tabs inside
  return new Promise((resolve, reject) => {
    chrome.bookmarks.create({title:gem_name}, function(newFolder){
      for (var i = 0; i < tabs.length; i++){
        chrome.bookmarks.create({parentId: newFolder.id,
                                title: tabs[i].title,
                                url: tabs[i].url});
      }
      resolve(1);
    });
  });
}

function removeGem(id) {
  return new Promise(function(resolve, reject){
    chrome.bookmarks.removeTree(id, function(){
      resolve(1);
    });
  });
}

function renameGem(id) {
  return new Promise(function(resolve, reject){
    chrome.bookmarks.update(id, {title: getGemName()}, function(bookmarkNode){
      resolve(bookmarkNode.title);
    });
  });
}
