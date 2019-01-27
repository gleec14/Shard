//Create a listener that prints the number of tabs in the current window
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    console.log("Number of tabs: " + tabs.length)
  });
});
