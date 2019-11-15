// Authors: Gregory Lee
// popup.js -
// Contains listeners for interactive content in popup.html
"use strict";

var DEFAULT_GEM_NAMES = ['Ruby', 'Sapphire', 'Emerald',
'Topaz', 'Opal', 'Aquamarine', 'Pearl', 'Peridot', 'Amethyst',
'Alexandrite', 'Turquoise'];
var PLACEHOLDER = 'Name of Gem'

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
  });
  // Decide gem_name
  var gem_name = $('#gemname').val();
  bglog('input: ' + gem_name);
  // Better sanitizers?
  if (gem_name == '' || gem_name == PLACEHOLDER) {
    bglog("Assigning gemstone name");
    gem_name = DEFAULT_GEM_NAMES[Math.floor(Math.random()*DEFAULT_GEM_NAMES.length)];
  }
  bglog('gem name: ' + gem_name);
  var folder;
  // Create a new bookmark folder and place tabs inside
  chrome.bookmarks.create({title:gem_name}, function(newFolder){
    folder = newFolder;
  });
  // run outside of callback so that cards update correctly.
  for (var i = 0; i < urls.length; i++){
    chrome.bookmarks.create({parentId: folder.id,
                            title: titles[i],
                            url:urls[i]});
  }
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
     // Open urls in a new window
     chrome.windows.create(function(windows){
       for (var k = 0; k < bookmarks.length; k++) {
         chrome.tabs.create({'windowId':windows.id, 'url':bookmarks[k].url, 'active':false});
       }
      chrome.tabs.remove(windows.tabs[0].id);
      chrome.tabs.update(windows.tabs[0].id, {'active':true});
     });
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
  bglog(folders);
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
  //Add listeners to buttons
  $("#addNewGem").click(addNewGem);
});
