const DELAY_TIME = 5_000;
let startRecording;

function start(){
    startRecording = setInterval(() => {
        if (bg.stopResponse){
            console.log("STOPPING!")
            stop();
        }
        const chat = document.getElementsByClassName('chat-line__message');
        let chatRows = []
        for (row of chat){
            chatRows.push(row.innerHTML)
        }
        console.log(chat);
        chrome.runtime.sendMessage({
            url: window.location.href,
            chat: chatRows
        })
    }, DELAY_TIME)
}

function stop () {
    clearInterval(startRecording);
}

start();