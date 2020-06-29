window.twitchChat = {}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    window.twitchChat[request.url] = request.chat
})

chrome.browserAction.onClicked.addListener(function (tab){
    chrome.tabs.create({url: 'popup.html'})
})