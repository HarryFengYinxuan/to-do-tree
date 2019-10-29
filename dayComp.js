// const { ipcRenderer } = require('electron')
require('bootstrap')
// const DateTimePicker = require('date-time-picker')
// const List = require("collections/list");
const fs = require('fs')
const dateFormat = require('dateformat');
// const dateFormat = require('dateformat');
window.jQuery = window.$ = jQuery;
let timeStarted = new Date();
let dayCompletionFile = 'dayCompletion/' + dateFormat(timeStarted, 'yyyy-mm-dd') + ".json";
let finishedToday;

function recoverDayComp() {
    try {
        let fileContent = fs.readFileSync(dayCompletionFile, 'utf8');
        finishedToday = JSON.parse(fileContent);
    } catch (err) {
        if (err.code == 'ENOENT') {
            // nothing to recover
        } else {
            throw err;
        }
    }
}

recoverDayComp();
console.log(finishedToday);

const item = $("<li></li>");
const finishedList = $(".finishedList");

let taskItem;
for (let task of finishedToday) {
    taskItem = item.clone();
    taskItem.text(task);
    finishedList.append(taskItem);
}