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

//Give popup the URL that the twitchChat is in.
chrome.runtime.sendMessage({
    action: '',
    searchText: '',
    twitchChatURL: window.location.href
})

let isDebugMode = false;
const DELAY_TIME = 2_000;
//Note: Twitch chat only keeps 52 messages in their scrollable area.
const MAX_CHAT_ROWS = 5;
const OVER_MAX_CHAT_ROWS = 7;
let startRecording;
let searchText;
let rowLimiter = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start'){
        searchText = request.searchText;
        if (isDebugMode)
        console.log("START " + searchText);
        start();
    }
    else if (request.action === 'stop'){
        if (isDebugMode)
        console.log("STOP");
        stop();
    }
})

function start(){
    //Add our custom text area under the chat controls.
    const chat = document.querySelectorAll(".channel-leaderboard > .tw-border-b")
    if (isDebugMode)
    console.log("ChatITEM " + chat.item(0));
    let content = chat.item(0);

    if (content){
        if (isDebugMode)
        console.log(content);
        //Insert our custom chat area below the text field/chat options.
        let div = document.createElement('div');
        div.className = 'stream-chat tw-flex tw-flex-column tw-flex-grow-1 tw-flex-nowrap tw-full-height tw-full-width tw-relative';
        div.id = "myTwitches";
        content.appendChild(div);
        div.insertAdjacentHTML("afterbegin",
            '<div class="stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-flex tw-flex-shrink-0 tw-full-width tw-justify-content-center tw-pd-l-1 tw-pd-r-1"> ' +
            '<div class="tw-align-items-center tw-flex"> ' +
                '<h5 data-test-selector="chat-room-header-label" class="tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">MyTwitches</h5> ' +
            '</div> ' +
            '</div> ' +
            '<section data-test-selector="chat-room-component-layout" class="chat-room tw-flex tw-flex-column tw-flex-grow-1 tw-flex-shrink-1 tw-full-width" role="complementary" aria-labelledby="chat-room-header-label" data-a-target="chat-theme-dark"> ' +
                '<div class="chat-room__content tw-c-text-base tw-flex tw-flex-column tw-flex-grow-1 tw-flex-nowrap tw-full-height tw-relative"> ' +
                    '<div class="tw-z-default"> ' +
                    '</div> ' +
                    '<div class="tw-hide"></div> ' +
                    '<div class="chat-list tw-flex tw-flex-column tw-flex-grow-1 tw-overflow-hidden"> ' +
                        '<div class="tw-flex tw-flex-column tw-flex-grow-1 tw-overflow-hidden" style="position: relative;"> ' +
                            '<div class="resize-detector"> ' +
                                '<div class="resize-detector"> ' +
                                    '<div class="resize-detector__grow" style="width: 100000px; height: 100000px;"></div> ' +
                                '</div> ' +
                                '<div class="resize-detector"> ' +
                                    '<div class="resize-detector__shrink"></div> ' +
                                '</div> ' +
                            '</div> ' +
                            '<div class="scrollable-area" data-test-selector="scrollable-area-wrapper" data-a-target="chat-scroller" data-simplebar="init"> ' +
                                '<div class="simplebar-track vertical" style="visibility: hidden;"> ' +
                                    '<div class="simplebar-scrollbar"></div> ' +
                                '</div> ' +
                                '<div class="simplebar-track horizontal" style="visibility: hidden;"> ' +
                                    '<div class="simplebar-scrollbar"></div> ' +
                                '</div> ' +
                                '<div class="simplebar-scroll-content" style="padding-right: 15px; margin-bottom: -30px;"> ' +
                                    '<div class="simplebar-content" style="padding-bottom: 15px; margin-right: -15px;"> ' +
                                        '<div data-test-selector="chat-scrollable-area__message-container" role="log" class="chat-scrollable-area__message-container tw-flex-grow-1 tw-pd-b-1 myTwitchesChat" id="myTwitchesChatId"> ' +
                                            '<div data-a-target="chat-welcome-message" class="chat-line__status"> ' +
                                                '<span class="">Welcome to the chat room!</span> ' +
                                            '</div> ' +
                                            '<!-- CHAT GOES HERE --> ' +
                                        '</div> ' +
                                    '</div> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="chat-room__notifications tw-absolute tw-full-width tw-z-above"></div> ' +
                    '<div class="chat-input tw-block tw-pd-b-1 tw-pd-x-1"> ' +
                        '<div class=""></div> ' +
                        '<div> ' +
                            '<div data-test-selector="chat-input-buttons-container" class="chat-input__buttons-container tw-flex tw-justify-content-between tw-mg-t-1"> ' +
                                '<div class="tw-align-content-center tw-align-items-center tw-flex tw-flex-row"> ' +
                                    '<div class="tw-mg-r-1"> ' +
                                        '<p class="tw-c-text-alt-2"></p> ' +
                                    '</div> ' +
                                    '<div class="tw-mg-l-05"> ' +
                                        '<button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" id="clearMyTwitches" data-a-target="chat-send-button"> ' +
                                            '<div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0"> ' +
                                                '<div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">Clear</div> ' +
                                            '</div> ' +
                                        '</button> ' +
                                    '</div> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div data-a-target="chat-user-card" class="chat-room__viewer-card tw-absolute tw-full-height tw-full-width"> ' +
                        '<div class="tw-full-height tw-full-width tw-relative tw-z-above viewer-card-layer"></div> ' +
                    '</div> ' +
                '</div> ' +
            '</section>'
        );
    }

    document.getElementById('clearMyTwitches').addEventListener('click', () => {
        clearChat();
    });
    const regex = new RegExp(searchText, 'gi')
    clearChat();
    startRecording = setInterval(() => {
        if (rowLimiter >= MAX_CHAT_ROWS){
            removeTopHalfChat();
        }
        const innerChat = document.querySelectorAll(".myTwitchesChat");
        const chat = document.querySelectorAll(".chat-line__message:not(.read):not(.myTwitchesMsg)");
        for (row of chat){
            if (regex.test(row.innerText)){
                if (isDebugMode)
                console.log(`YES ${row.innerText}`);
                innerChat[0].innerHTML += "<div class='chat-line__message myTwitchesMsg' data-a-target='chat-line-message' data-test-selector='chat-line-message'>" + row.innerHTML + "</div>";
                rowLimiter += 1;
                if (isDebugMode)
                console.log(rowLimiter)
            }
            else{
                if (isDebugMode)
                console.log(`NO ${row.innerText}`);
            }
            row.className += " read";
            document.getElementsByClassName("")
        }
        if (isDebugMode)
        console.log(chat);
    }, DELAY_TIME)
}

function stop() {
    clearInterval(startRecording);
    document.getElementById("myTwitches").remove();
}

function removeTopHalfChat(){
    const chatLog = document.getElementById("myTwitchesChatId");
    if (isDebugMode)
    console.log(`Removing ${Math.floor(rowLimiter/2)} rows`);
    for (i = 0; i < Math.floor(rowLimiter/2); i++){
        chatLog.removeChild(chatLog.firstChild);
        rowLimiter -= 1;
    }
}

function clearChat(){
    const chatLog = document.getElementById("myTwitchesChatId");
    while (chatLog.hasChildNodes()){
        chatLog.removeChild(chatLog.firstChild)
    }
    rowLimiter = 0;
}