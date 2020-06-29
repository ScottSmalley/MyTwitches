/*
MyTwitches:
Summary: Chrome plugin used for Twitch.tv chatrooms
It allows a user to filter the chat for specific phrases.
Goal: In very large chatrooms, it's really hard to see what
others chat about--much less if any of it relates to you.
This plugin creates a second chat window that updates with 
any chats that match the phrase given.
Dev:
Scott Smalley
B.Sc Software Engineering Fall 2020
Utah Valley University
scottsmalley90@gmail.com
scottsmalley.net
*/
window.action = {}
window.twitchChatURL;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    window.action[request.action] = request.action
    window.action[request.searchText] = request.searchText
    window.twitchChatURL = request.twitchChatURL;
})