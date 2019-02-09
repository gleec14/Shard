// Authors: Gregory Lee
// popup.js -
// Contains listeners for interactive content in popup.html
"use strict";

// Adds all tabs in the current window to a new Bookmarks folder
function addNewGem() {
  alert("addNewGem");
}

// Loads all tabs in a chosen Bookmarks folder in a new window
function loadGem() {
  alert("loadGem");
}

// Display all Bookmark folders
//function displayGems() {
//  alert("displayGems")
//}

// Removes selected Gems
function removeGems() {
  alert("removeGems")
}

// Traverse the bookmark tree, and print folders
function displayGems(){
  var bookmarkNodes = chrome.bookmarks.getTree(
    function(bookmarkNodes) {
      $('.gems').append(createPanels(bookmarkNodes));
    });
}

//Creates panels from which folder names are displayed
function createPanels(bookmarkNodes) {
  var panels = '';
  var bookmarks;
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    var folders = getFolders(bookmarkNodes[i]);
    for (var j = 0; j < folders.length; j++) {
      var panel = '<div class="gem"><h4>'
                   + folders[j].title
                    + '</h4></div>';
      panels += panel;
    }
  }
  bglog(panels);
  return panels;
}

function getFolders(bookmarkNode) {
  bglog(bookmarkNode.children[1].children);
  // gets the bookmarks in "Other bookmarks"
  return bookmarkNode.children[1].children;
}

// console.log in the background page
var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}

$(document).ready(displayGems);
//Add listeners to buttons
$("#addNewGem").click(addNewGem);
$("#loadGem").click(loadGem);
