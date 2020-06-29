/*
MyTwitches:
Summary: Google Chrome plugin used for Twitch.tv chatrooms.
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

/* 
Background.js query used to get values 
between content.js and popup.js
*/
let bg;

document.addEventListener('DOMContentLoaded', () => {
    let storedSearch = localStorage.getItem("MyTwitches");
    if (storedSearch){
        document.getElementById("searchText").value = storedSearch;
    }
    document.getElementById('startBtn').addEventListener('click', () => {
        let toSearch = document.getElementById("searchText").value;
        console.log(`START: ${toSearch}`);
        if (toSearch !== ""){
            start();
            window.close();
        }
        else{
            alert("You must enter chat to search for (names and chat will be searched).");
        }
    }, false);
    
    document.getElementById('stopBtn').addEventListener('click', () => {
        console.log("STOP");
        document.getElementById("searchText").value = "";
        localStorage.removeItem("MyTwitches");
        stop();
        window.close();
    }, false);

}, false)

function start(){
    let textToSearch = document.getElementById('searchText').value;
    console.log(textToSearch);
    bg = chrome.extension.getBackgroundPage();
    localStorage.setItem("MyTwitches", textToSearch);
    chrome.tabs.query({url: bg.twitchChatURL}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'start',
            searchText: textToSearch
        });
    })
}

function stop(){
    bg = chrome.extension.getBackgroundPage();
    chrome.tabs.query({url: bg.twitchChatURL}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'stop',
            searchText: ''
        });
    })
}


