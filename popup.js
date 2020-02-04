// Authors: Gregory Lee
// popup.js -
// Contains listeners for interactive content in popup.html
"use strict";

var DEFAULT_GEM_NAMES = ['Ruby', 'Sapphire', 'Emerald',
'Topaz', 'Opal', 'Aquamarine', 'Pearl', 'Peridot', 'Amethyst',
'Alexandrite', 'Turquoise'];
var PLACEHOLDER = 'Name of Gem';

// Define application modes
const CREATE_MODE = "CREATE_MODE";
const RENAME_MODE = "RENAME_MODE";
const DELETE_MODE = "DELETE_MODE";
var MODE = CREATE_MODE;

function getGemName() {
  // Decide gem_name
  var gem_name = $('#gemname').val();
  // Better sanitizers?
  if (gem_name == '' || gem_name == PLACEHOLDER) {
    gem_name = DEFAULT_GEM_NAMES[Math.floor(Math.random()*DEFAULT_GEM_NAMES.length)];
  }
  return gem_name;
}

// Handles when user can add a new gem.
function addNewGemHandler() {
  var gem_name = getGemName();
  if (MODE == CREATE_MODE) {
    addNewGem(gem_name);
  }
}

// Adds all tabs in the current window to a new Bookmarks folder
function addNewGem(gem_name) {
  getTabs().then(tabs => {
    return create_new_bookmark_and_populate(gem_name, tabs);
  }).then(()=>{
    // Reload popup to show changes
    addPanel();
  });
}

// Loads on gem on click (might generalize later)
function addPanelOnClickListener(folders, id) {
  var gem = '#gem' + id;
  // Load gem after releasing the enter key
  $('.gems').on('keyup', gem, function(event){
      if (event.keyCode == 13) {
        $(this).click();
      }
  });
  $('.gems').on('click', gem, function(event){
     // Get the event string
     var gem_num = event.handleObj.selector;
     // Get the gem id number
     gem_num = gem_num.slice(4);
     gem_num = parseInt(gem_num);
     // Remove folder if DELETE_MODE
     // Rename folder if RENAME_MODE
     if (MODE == DELETE_MODE) {
       // TODO: should not be redrawing every time.
       removeGem(folders[gem_num].id).then(()=>{displayGems()});
     } else if (MODE == RENAME_MODE) {
       renameGem(folders[gem_num].id).then((title)=>{
         $(gem).html('<h4>' + title + '</h4>');
       });
     } else {
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
    }
  });
}

// adds panel when new gem created
function addPanel() {
  getFolders().then(folders => {
    var id = folders.length - 1;
    var panel = '<div tabindex="0" class="gem" id="gem' + id + '"><h4>'
                 + folders[id].title
                  + '</h4></div>';
    $('.gems').append(panel);

    // Add listener to panel
    addPanelOnClickListener(folders, id);
  });
}


// Traverse the bookmark tree, and print folders
function displayGems(){
  // clear panels and remove listeners
  $('.gems').empty();
  $('.gems').off();
  // Display gems in popup and add listeners to them.
  getFolders().then(folders => {
    // Add panels to HTML
    createPanels(folders);
    // Add listeners asynchronously to each panel
    for (var j = 0; j < folders.length; j++) {
        addPanelOnClickListener(folders, j);
    }
  });
}


//Creates panels from which folder names are displayed
function createPanels(folders) {
  // Create a panel for every folder
  for (var j = 0; j < folders.length; j++) {
    var panel = '<div tabindex="0" class="gem" id="gem' + j + '"><h4>'
                 + folders[j].title
                  + '</h4></div>';
    $('.gems').append(panel);
  }
}

// console.log in the background page
var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}

$(document).ready(function() {
  // Display gems in popup and add listeners to them.
  displayGems();
});

//Add listeners to buttons
$("#addNewGem").click(addNewGemHandler);

$("#renameGem").keyup(function(){
    if (event.keyCode == 13) {
      (this).click();
    }
  });
$("#renameGem").click(function(){
    // Toggle mode and button highlight
    if(MODE == RENAME_MODE) {
      MODE = CREATE_MODE;
      $("#renameGem").css("border-color", "#f0f0f0");
      $("#renameGem").attr("aria-pressed", "false");
    } else {
      MODE = RENAME_MODE;
      $("#renameGem").css("border-color", "#CA1FFF");
      $("#renameGem").attr("aria-pressed", "true");
      $("#deleteGems").attr("aria-pressed", "false");
      $("#deleteGems").css("border-color", "#f0f0f0");
    }
  });

$("#deleteGems").keyup(function(){
    if (event.keyCode == 13) {
      (this).click();
    }
  });
$("#deleteGems").click(function(){
    // Toggle mode and button highlight
    if(MODE == DELETE_MODE) {
      MODE = CREATE_MODE;
      $("#deleteGems").css("border-color", "#f0f0f0");
      $("#deleteGems").attr("aria-pressed", "false");
    } else {
      MODE = DELETE_MODE;
      $("#deleteGems").css("border-color", "#CA1FFF");
      $("#deleteGems").attr("aria-pressed", "true");
      $("#renameGem").attr("aria-pressed", "false");
      $("#renameGem").css("border-color", "#f0f0f0");
    }
  });
