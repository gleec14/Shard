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
function displayGems() {
  alert("displayGems")
}

// Removes selected Gems
function removeGems() {
  alert("removeGems")
}

// Creates Gem card
function createCard() {
  let card =
    `<div class="card">
      <h4> Gem </h4>
    </div>`;
  let cards = '';
  let amount = 5;
  for(let i = 0; i < amount; i++){
    cards += card;
  }
  $(".gems").empty().append(cards);
}

//document.addEventListener('DOMContentLoaded')
//Add listeners to buttons
$("addNewGem").click(addNewGem);
$("loadGem").click(loadGem);
$(document).ready(createCard)
//document.getElementById("displayGems").addEventListener("click", displayGems);
//document.getElementById("removeGems").addEventListener("click", removeGems);
