const DELAY_TIME = 5_000;
let startRecording;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBtn').addEventListener('click', () => {
        console.log("START");
        start();
    }, false);
    
    document.getElementById('stopBtn').addEventListener('click', () => {
        console.log("STOP");
        stop();
    }, false);

}, false)


function start(){
    startRecording = setInterval(() => {
        const bg = chrome.extension.getBackgroundPage()
        console.log(bg.twitchChat)
        // console.log(bg.twitchChat.length)

        document.getElementById("chat").textContent = '';
        Object.keys(bg.twitchChat).forEach(function (url) {
            const div = document.createElement('div')
            // div.textContent = `${bg.twitchChat[url]}`
            bg.twitchChat[url].forEach(chatRow => div.innerHTML += chatRow)
            // div.innerHTML += bg.twitchChat[url];
            document.getElementById("chat").appendChild(div)
        })
    }, DELAY_TIME);
}

function stop(){
    clearInterval(startRecording);
}


