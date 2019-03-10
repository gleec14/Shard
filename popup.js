// Authors: Gregory Lee
// popup.js -
// Contains listeners for interactive content in popup.html
"use strict";

// Adds all tabs in the current window to a new Bookmarks folder
function addNewGem() {
  // Stores urls and website names
  var urls = [];
  var titles = [];
  // Get tabs in current window
  chrome.tabs.query({currentWindow:true}, function(tabs){
    // Store the urls and website names of each tab
    for (var i = 0; i < tabs.length; i++){
      urls.push(tabs[i].url);
      titles.push(tabs[i].title);
    }
    // Create a new bookmark folder and place tabs inside
    chrome.bookmarks.create({title:'Test'}, function(newFolder){
      for (var i = 0; i < urls.length; i++){
        chrome.bookmarks.create({parentId: newFolder.id,
                                title: titles[i],
                                url:urls[i]});
      }
    });
  });
  // Reload popup to show changes
  addPanel();
}

// Loads all tabs in a chosen Bookmarks folder in a new window
function loadGems(bookmarkNode, folderName) {
  var folders = getFolders(bookmarkNode);
  // 0 index is where folders are stored
  for (var i = 0; i < folders.length; i++) {
    if (folders[i].title == folderName) {
       var bookmarks = folders[i].children;
       // Get all urls in the bookmark
       var urls = [];
       for (var j = 0; j < bookmarks.length; j++) {
         urls.push(bookmarks[j].url);
       }
       // Open urls in a new window
       chrome.windows.create({'url': urls}, function(windows){});
       break;
    }
  }
}

// Removes selected Gems
function removeGems() {
  alert("removeGems")
}

// Loads on gem on click (might generalize later)
function addPanelOnClickListener(folders, id) {
  $('.gems').on('click','#gem' + id, function(event){
     // Get the event string
     var gem_num = event.handleObj.selector;
     // Get the gem id number
     gem_num = gem_num.slice(4);
     gem_num = parseInt(gem_num);
     // Get urls associated with the gem
     var bookmarks = folders[gem_num].children;
     var urls = [];
     for (var k = 0; k < bookmarks.length; k++) {
       urls.push(bookmarks[k].url);
     }
     // Open urls in a new window
     chrome.windows.create({'url': urls}, function(windows){});
  });
}

// adds panel when new gem created
function addPanel() {
  var id = 0
  var bn = chrome.bookmarks.getTree(function(bookmarkNodes){
    var folders = getFolders(bookmarkNodes[0]);
    id = folders.length - 1;
    var panel = '<div class="gem" id="gem' + id + '"><h4>'
                 + folders[id].title
                  + '</h4></div>';
    $('.gems').append(panel);

    // Add listener to panel
    addPanelOnClickListener(folders, id);
  });
}

// Traverse the bookmark tree, and print folders
function displayGems(){
  var bn = chrome.bookmarks.getTree(
    function(bookmarkNodes) {
      createPanels(bookmarkNodes);
    });
}

//Creates panels from which folder names are displayed
function createPanels(bookmarkNodes) {
  var panels = '';
  var bookmarks;
  var folders = getFolders(bookmarkNodes[0]);
  // Create a panel for every folder
  for (var j = 0; j < folders.length; j++) {
    var panel = '<div class="gem" id="gem' + j + '"><h4>'
                 + folders[j].title
                  + '</h4></div>';
    $('.gems').append(panel);

    //Add listener to gem
    addPanelOnClickListener(folders, j);
    panels += panel;
  }
}

function getFolders(bookmarkNode) {
  // gets the folders in "Other bookmarks"
  var folders = bookmarkNode.children[1].children;
  return folders;
}

// console.log in the background page
var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}

$(document).ready(function() {
  displayGems();
});
//Add listeners to buttons
$("#addNewGem").click(addNewGem);
