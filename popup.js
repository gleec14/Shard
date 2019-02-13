// Authors: Gregory Lee
// popup.js -
// Contains listeners for interactive content in popup.html
"use strict";

// Adds all tabs in the current window to a new Bookmarks folder
function addNewGem() {
  alert("addNewGem");
}

// Loads all tabs in a chosen Bookmarks folder in a new window
function loadGems(bookmarkNode, folderName) {
  var folders = getFolders(bookmarkNode);
  for (var i = 0; i < folders.length; i++) {
    if (folders[i].title == folderName) {
       var bookmarks = folders[i].children;
       var urls = [];
       for (var j = 0; j < bookmarks.length; j++) {
         urls.push(bookmarks[j].url);
       }
       chrome.windows.create({'url': urls}, function(windows){});
       break;
    }
  }
}

function loadGemsTest(folders, folderName) {
  for (var i = 0; i < folders.length; i++){
    if (folders[i].title == folderName) {
       var bookmarks = folders[i].children;
       var urls = [];
       for (var j = 0; j < bookmarks.length; j++) {
         urls.push(bookmarks[j].url);
       }
       chrome.windows.create({'url': urls}, function(windows){});
       break;
    }
  }
}

function addListenerToGems(bookmarkNode) {
  var folders = getFolders(bookmarkNode);
  for (var i = 0; i < folders.length; i++) {
    $(document).on("click",'.gem',loadGems(bookmarkNode, folders[i].title));
  }
}

// Removes selected Gems
function removeGems() {
  alert("removeGems")
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
  for (var j = 0; j < folders.length; j++) {
    var panel = '<div class="gem" id="gem' + j + '"><h4>'
                 + folders[j].title
                  + '</h4></div>';
    $('.gems').append(panel);
    $('.gems').on('click','#gem' + j, function(event){
           var gem_num = event.handleObj.selector;
           gem_num = gem_num.slice(4);
           gem_num = parseInt(gem_num);
           var bookmarks = folders[gem_num].children;
           var urls = [];
           for (var k = 0; k < bookmarks.length; k++) {
             urls.push(bookmarks[k].url);
           }
           chrome.windows.create({'url': urls}, function(windows){});
    });
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
