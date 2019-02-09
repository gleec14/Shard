//Create a listener that prints the number of tabs in the current window
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    console.log("Number of tabs: " + tabs.length)
  });
});

var onMessageListener = function(message, sender, sendResponse) {
    switch(message.type) {
        case "bglog":
            console.log(message.obj);
        break;
    }
    return true;
}
chrome.runtime.onMessage.addListener(onMessageListener);
