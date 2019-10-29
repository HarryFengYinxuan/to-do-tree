// importing and settings
const DEBUG = false;
const { BrowserWindow } = require('electron').remote;
// const { ipcRenderer } = require('electron')
require('bootstrap')
// const DateTimePicker = require('date-time-picker')
// const List = require("collections/list");
const fs = require('fs')
const dateFormat = require('dateformat');
window.jQuery = window.$ = jQuery;
const recoverFile = 'db/lastUse.json';
let timeStarted = new Date();
let dayCompletionFile = 'dayCompletion/' + dateFormat(timeStarted, 'yyyy-mm-dd') + ".json";
let finishedTask = [];
let finishedToday = [];
let n=0
let cmdDown = false;
let autoSort = true;

// global functions
function recover(data=null){
    let lastContent;
    fs.realpath('', (err, data) => {
        if (DEBUG) console.log(data);
    })
    if (data == null){
        try {
            data = fs.readFileSync(recoverFile, 'utf8');
            recoverDayComp();
        } catch (err) {
            if (err.code == 'ENOENT') {
                // nothing to recover
            } else {
                throw err;
            }
        }
        {
            // fs.readFile(recoverFile, 'utf8', (err, data) => {
            //     if (err) {
            //         if (DEBUG) console.log("err");
            //         throw err
            //     } else {
            //         if (DEBUG) console.log("no err");
            //         lastContent = data;
            //         if (DEBUG) console.log(data);
            //         if (DEBUG) console.log(lastContent);
            //         const new_info = JSON.parse(lastContent);
            //         n = new_info[0];
            //         new_info.remove(0);
            //         if (DEBUG) console.log(new_info)
            //         if (new_info != undefined){
            //             let toBeConnected = []
            //             for (var item of new_info){
            //                 // if it exists, then change the value
        
            //                 // if it doesn't exist, create an element with those value
            //                 // and put it in list all with the ID
            //                 var itemInList = listAll[item.id];
            //                 if (DEBUG) console.log(item.id);
            //                 if (itemInList!=undefined){
            //                     itemInList.setFromJson(item);
            //                     if (item.id != 0){
            //                         toBeConnected.push(itemInList);
            //                     }
            //                 } else {
            //                     var newTask = newList.clone();
            //                     newTask.initTask(name=item.name, id=item.id);
            //                     newTask.setFromJson(item);
            //                     if (item.id != 0){
            //                         if (DEBUG) console.log("item id "+item.id);
            //                         toBeConnected.push(newTask)
            //                     }
            //                 }
            //             }
            //             if (DEBUG) console.log(toBeConnected)
                        
            //             for (var task of toBeConnected){
            //                 task.appendToParent(ordering=true)
            //             }
            //         }
            //     }
            //   });
            // recoverDayComp();
        }
    } 
    // recover with data
    const DEBUG = false;
    lastContent = data;
    if (DEBUG) console.log(data);
    const new_info = JSON.parse(lastContent);
    n = new_info[0]; // the id that we have
    new_info.remove(0);
    if (DEBUG) {
        console.log('new info:');
        console.log(new_info);
    }
    if (new_info != undefined){
        let toBeConnected = []
        for (var item of new_info){
            // if it exists, then change the value

            // if it doesn't exist, create an element with those value
            // and put it in list all with the ID
            var itemInList = listAll[item.id];
            if (DEBUG) console.log(item.id);
            // if (DEBUG) console.log(item.childrenIdList.toString());
            // if (DEBUG) console.log(itemInList.childrenIdList.toString());
            if (itemInList!=undefined){
                itemInList.setFromJson(item, disown=false);
                if (item.id != 0){
                    toBeConnected.push(itemInList);
                }
                if (DEBUG) console.log('setting '+itemInList.id);
                if (DEBUG) console.log('prime children');
                if (DEBUG) console.log([...listAll[0].childrenIdList]);
            } else {
                var newTask = newList.clone();
                newTask.initTask(name=item.name, id=item.id);
                newTask.setFromJson(item, disown=false);
                if (item.id != 0){
                    if (DEBUG) console.log("item id "+item.id);
                    toBeConnected.push(newTask)
                }
            }
        }
        if (DEBUG) console.log(toBeConnected)
        if (DEBUG) console.log('prime children');
        if (DEBUG) console.log([...listAll[0].childrenIdList]);
        for (var task of toBeConnected){
            task.appendToParent(ordering=true)
        }
    
    }
    if (DEBUG) console.log('finished task');
    if (DEBUG) console.log(JSON.stringify(finishedTask));
}

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

function recordDayComp() {
    const DEBUG = false;
    const now = new Date();
    if (dateFormat(timeStarted, 'yyyy-mm-dd') != dateFormat(now, 'yyyy-mm-dd')){
        // save yesterday
        // if it is a different day, than the last one belongs to a new day
        const lastCompleted = finishedToday[finishedToday.length-1];
        finishedToday.remove(finishedToday.length-1);
        // fs.writeFile(dayCompletionFile, JSON.stringify(finishedToday), (err) => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         if (DEBUG) console.log('saved day comp!');
        //     }
        // })
        fs.writeFileSync(dayCompletionFile, JSON.stringify(finishedToday));
        timeStarted = now;
        dayCompletionFile = 'dayCompletion/' + dateFormat(timeStarted, 'yyyy-mm-dd') + ".json";
        finishedToday = [lastCompleted];
    }
    // fs.writeFile(dayCompletionFile, JSON.stringify(finishedToday), (err) => {
    //     if (err) {
    //         throw err;
    //     } else {
    //         if (DEBUG) console.log('saved day comp!');
    //     }
    // })
    fs.writeFileSync(dayCompletionFile, JSON.stringify(finishedToday));
}

function record(listAll, write=true){
    const DEBUG = false;
    let allInfo = [n]; // record the current n for id
    if (DEBUG) console.log(Object.values(listAll));
    for (taskID of Object.keys(listAll)){
        let task = listAll[taskID];
        allInfo.push({
            'name': task.name,
            "id":task.id,
            "parentId":task.parentId,
            "childrenIdList":task.childrenIdList,
            "deadline":task.deadline,
            "finished":task.finished,
            "dateStr":task.dateStr,
            "timeStr":task.timeStr
        })

    }
    const info = JSON.stringify(allInfo)
    if (write == true){
        if (DEBUG) console.log("still writing "+write);
        // fs.writeFile(recoverFile, info, (err) => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         if (DEBUG) console.log('saved!')
        //     }
        // })
        fs.writeFileSync(recoverFile, info);
        recordDayComp();
    }
    return info;

}

function inputsSelected(taskSelected) {

    // sets the property and animation for the buttons when a 
    // task is selected or unselected
    if (taskSelected){
        editTaskButton.prop('disabled', false)
        editTaskButton.html("Edit")
        removeTaskButton.prop('disabled', false)
        finishTaskButton.prop('disabled', false)
        addTaskButton.prop('disabled', false)
        if (listAll[selected].finished){
            finishTaskButton.html("Unfinish")
        } else {
            finishTaskButton.html("Finish")
        }
    } else {
        editTaskButton.prop('disabled', true)
        removeTaskButton.prop('disabled', true)
        finishTaskButton.prop('disabled', true)
        addTaskButton.prop('disabled', true)
    }

}

function sortTask(task) {
    const DEBUG = false;
    if (DEBUG) console.log("sort task");
    let child;
    let childrenList = [];
    for (const chidlId of task.childrenIdList) {
        child = listAll[chidlId];
        sortTask(child);
        childrenList.push(child);
    }
    childrenList.sort((a, b) => {
        if (a.deadline == null) {
            if (b.deadline == null) {
                return 0;
            } else {
                // b had a deadline while a is free, a greater (pushed to the back)
                return 1;
            }
        } else {
            if (b.deadline == null) {
                // a less
                return -1;
            } else {
                // b had a deadline while a is free, a greater
                if (a.deadline > b.deadline) {
                    return 1; // a is later than b, so less important
                } else if (a.deadline == b.deadline) {
                    return 0;
                } else {
                    return -1;
                }
            }
        }

    })
    if (DEBUG) console.log(`${task.id}: childrenList`);
    if (DEBUG) console.log(childrenList);
    let childrenIdList = [];
    for (let child of childrenList) {
        childrenIdList.push(child.id);
    }
    if (DEBUG) console.log(childrenIdList)
    task.childrenIdList = childrenIdList;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// change properties for tasks and buttons
jQuery.fn.extend({
    // if the task has id, then select or unselect, else throw error
    selectable: function() {
        const DEBUG = false;
        var itemID = this.attr('id');
        if (itemID == undefined){
            throw new Error("This jQuery element has no itemID, it cannot be selectable.");
        }
        this.selected = false;
        this.children('h3').click(
            function() {
                if (DEBUG) console.log("selected "+selected)
                console.log(listAll[$(this).parent()[0].id])
                var task = listAll[$(this).parent()[0].id]
                if (task.selected){
                    task.unselect()
                } else {
                    task.select()
                }
            }
        );
        // const self = this;
        // this.children('h3').dblclick(() => {
        //     // self.click();
        //     // addTaskButton.click();
        // })
    },
    // setting up methods and properties for tasks
    initTask: function(name="", id=n) {
        // set html
        this.setName = function(){
            var s = this.children("h3").children("span")
            this.children("h3").html(this.name + " ")
            this.children("h3").append(s)
        } 
        // not implemented
        this.setDeadline = function() {
            if (this.deadline!=null){
                var now = new Date()
                var timeLeft = this.deadline-now
                var sec = 1000
                var min = 60*sec
                var hour = 60*min
                var day = 24*hour
                if (timeLeft>day){
                    var d = Math.floor(timeLeft / day);
                    if (d == 1){
                        this.children("h3").children("span").html("In "+d+" day")
                    } else {
                        this.children("h3").children("span").html("In "+d+" days")
                    }
                } else if (timeLeft>hour) {
                    var h = Math.floor(timeLeft / hour)
                    if (h == 1){
                        this.children("h3").children("span").html("In "+h+" hour")
                    } else {
                        this.children("h3").children("span").html("In "+h+" hours")
                    }
                } else if (timeLeft>0) {
                    var s = this.children("h3").children("span")
                    s.html("Within an hour")
                    s.removeClass("badge-primary")
                    s.addClass("badge-danger")
                } else {
                    this.children("h3").children("span").html("Passed")
                }
            }
        }

        this.setFinished = function() {
            const taskContent = this.children("h3");
            if (this.finished) {
                taskContent.css("text-decoration", "line-through");
            } else {
                taskContent.css("text-decoration", "");
            }
        }
        // leave parent and children
        // set new name, parent, and children accordingly
        // should also set deadline, not imp
        this.setFromJson = function(jsonObj, disown=true){
            // leaving parent and children
            const DEBUG = false;
            this.leaveParent(disown);
            var childId;
            var child;
            for (var i=0; i<this.childrenIdList.length;i++){
                childId = this.childrenIdList[i]
                // childId = this.childrenIdList.get(i)
                child = listAll[childId]
                child.leaveParent(disown)
                if (DEBUG) console.log(""+child.id+" leaving "+this.id)
            } 

            this.name = jsonObj.name;
            // this.setName()
            this.parentId = jsonObj.parentId;
            this.childrenIdList = [...jsonObj.childrenIdList];
            this.finished = jsonObj.finished;
            this.dateStr = jsonObj.dateStr;
            this.timeStr = jsonObj.timeStr;
            if (this.finished) finishedTask.push(this.id);
            // this.setFinished();
            if (jsonObj.deadline){
                this.deadline = new Date(jsonObj.deadline);
            } else {
                this.deadline = null;
            }
            
            // this.setDeadline()
            this.updateHtml();
            if (DEBUG) console.log(`setting children id list ${this.id}`);
            if (DEBUG) console.log([...this.childrenIdList]);
            // if (DEBUG && this.id == 0) {
            //     console.log('0 obj:');
            //     console.log([...jsonObj.childrenIdList]);
            // }
        }
        // append to parent by getting parent from parent id. if not ordering, 
        // the parent will just push this task id to children id list and change the ui
        // if ordering, find the last task that it should be after and insert it there
        this.appendToParent = function(ordering=false) {
            const DEBUG = false;
            if (DEBUG) console.log(`${this.id} appending to parent`);
            if (this.parentId == -1){
                delete listAll[this.id]
                this.remove()
                return //this guy has no parent
            }
            var parent = listAll[`${this.parentId}`];
            if (DEBUG) console.log(parent)
            if (parent == null){
                if (DEBUG) console.log(listAll);
            }
            var self = this // refering to the task
            // this.leaveParent()
            // this.parentId = parent.id //check back
            if (!ordering){
                if (DEBUG) console.log("not ordering")
                parent.childrenIdList.push(this.id)
                // parent.childrenIdList.add(this.id)
                parent.children("ul").append(this)
            } else { // ordering
                // var myIndex = parent.childrenIdList.find(this.id)
                if (DEBUG) console.log("parent children list: ");
                if (DEBUG) console.log([...parent.childrenIdList]);
                
                if (DEBUG) console.log("my id: "+this.id)
                var myIndex = parent.childrenIdList.indexOf(this.id);
                if (parent.children("ul").children().length==0){
                    if (DEBUG) console.log("parent has no children")
                    parent.children("ul").append(this)
                } else {
                    var foundPos = false
                    if (DEBUG) console.log("my index: "+myIndex)
                    parent.children("ul").children().each(function(index){
                        var childId = parseInt($(this).attr('id'))
                        if (DEBUG) console.log("child id: "+childId)
                        var childIndex = parent.childrenIdList.indexOf(childId)
                        if (DEBUG) console.log("childIndex: "+childIndex)
                        if (childIndex>myIndex){
                            self.insertBefore($(this));
                            foundPos = true;
                            return false;
                        }
                    })
                    if (!foundPos){
                        if (DEBUG) console.log("last one")
                        parent.children("ul").append(this)
                    } else {
                        if (DEBUG) console.log("not last one")
                    }
                }
                
            }
        }
        // disowned by the parent, and then disappear, waiting to be connected
        this.leaveParent = function(disown=true){ // because leave includes disowning, so use this
            var parent = listAll[this.parentId]
            if (parent!=undefined){
                if (DEBUG) console.log("parent defined")
                if (disown) parent.disownChild(this.id)
                this.detach()
                this.parent = ""
            } else {
                if (DEBUG) console.log("parent undefined")
            }
            
        }
        // parent comparing each children id and find the the position of that child
        // to diswon. if the parent doesn't own this child, then log, else, remove it
        // improve: use hash table for faster performance and error for functionality
        this.disownChild = function(childId){
            var thisChild
            var childNum = -1
            for (var i=0;i<this.childrenIdList.length;i++){
                // thisChildId = this.childrenIdList[i]
                if (DEBUG) console.log(this.childrenIdList);
                // thisChildId = this.childrenIdList.get(i)
                thisChildId = this.childrenIdList[i];
                if (thisChildId==childId){
                    childNum = i
                    break
                }
            }
            if (childNum == -1){
                if (DEBUG) console.err("This object doesn't own this child: "+childId)
                if (DEBUG) console.log(this)
            } else {
                this.childrenIdList.remove(childNum)
                
            }
            // this.childrenIdList.delete(childId)
            
        }
        this.unselect = function(){
            if (this.selected){
                if (DEBUG) console.log("unselected "+this.id)
                selected = -1
                this.selected = false
                $(editTaskName).val('')
                this.children("h3").removeClass('selectedTask', 500)
                inputsSelected(false)
            } else {
                if (DEBUG) console.log(this.id+" not selected. selected is: "+selected)
                if (DEBUG) console.log(this.attr('id'))
            }
        }
        this.select = function() {
            if (!this.selected){
                if (selected != -1){
                    if (DEBUG) console.log(selected+" was selected")
                    listAll[selected].unselect()
                }
                selected = this.id
                this.selected = true
                this.children("h3").addClass('selectedTask', 500)
                inputsSelected(true)
                // ipcRenderer.send('asynchronous-message', this.id + ' is selected')
            }
        }
        // right now it updates the name, but maybe should be more comprehensive
        this.updateHtml = function() {
            this.setName();
            this.setFinished();
            this.setDeadline();
        }
        this.attr('id', id)
        this.id = id
        this.parentId = null
        this.childrenIdList = []
        this.name = name
        this.isTask = true
        this.finished = false
        this.deadline = null
        this.dateStr = ""
        this.timeStr = ""
        listAll[id] = this
        n = id+1
        this.selectable()
        let self = this
        // chidlrenUl = this.children('ul')
        // childrenIdList = this.childrenIdList
        this.children('ul').sortable({
            connectWith: ".connectedSortable",
            // beforeStop: function(event, ui) {
            //     if (DEBUG) console.log("before stop!")
            //     // $(this).siblings('h3').removeClass('toSubtask')
            // },
            // activate: function(event, ui) {
            //     if (DEBUG) console.log("activate!")
            // },
            // change: function(event, ui) {
            //     if (DEBUG) console.log("change!")
            // },
            // create: function(event, ui) {
            //     if (DEBUG) console.log("create!")
            // },
            // deactivate: function(event, ui) {
            //     if (DEBUG) console.log("deactivate!")
            // },
            // out: function(event, ui) {
            //     if (DEBUG) console.log("out!")
            // },
            // over: function(event, ui) {
            //     if (DEBUG) console.log("over!")
            //     // $(this).siblings('h3').addClass('toSubtask', 500)
            // },
            // receive: function(event, ui) {
            //     if (DEBUG) console.log("receive!")
            // },
            // remove: function(event, ui) {
            //     if (DEBUG) console.log("remove!")
            // },
            // sort: function(event, ui) {
            //     if (DEBUG) console.log("sort!")
            // },
            // stop: function(event, ui) {
            //     if (DEBUG) console.log("stop!")

            //     // $(this).siblings('h3').removeClass('toSubtask')
            //     setTimeout(
            //         function() {
            //             $(this).siblings('h3').removeClass('toSubtask')
            //         }, 500
            //     ) 
            // },
            // start: function(event, ui) {
            //     if (DEBUG) console.log("start!")
            // },
            update: function(event, ui) {
                if (DEBUG) console.log(name+" update!")
                // children moved, find out what they are now
                if (DEBUG) console.log(self.children('ul').children('li'));
                self.childrenIdList = []
                for (child of self.children('ul').children('li')){
                    const task = listAll[child.id];
                    task.parentId = self.id;
                    self.childrenIdList.push(child.id);
                }
                record(listAll);
            },
        }).disableSelection()
        this.setName()
        this.children("h3").parent = this
    },
    initButton: function(additionalClass="") {
        this.addClass("btn "+additionalClass);
        this.addClass('btn-sm');
    }
});

// init globals
let selected = -1
var listAll = {} // all list elements
let s1 = $(`<ul class="connectedSortable sortable"></ul>`) // sample ul
var newList = $(`<li class="ui-state-default"><h3>New item <span class="badge badge-primary"></span></h3><ul class="connectedSortable sortable"></ul></li>`)
const showBordersDefault = false
const autoSortDefault = true

// real instances
var primeList = newList.clone() // the first object
primeList.initTask("Projects")
// primeList.find("h3").html("Projects")
// const editTaskName = $(`<input>`)
// const addTaskButton = $(`<button>Add</button>`)
// const editTaskButton = $(`<button>Edit</button>`)
// const removeTaskButton = $(`<button>Remove</button>`)
const editTaskName = $(".editTask").find('.editTaskName')
const addTaskButton = $(".editTask").find('.addButton')
const editTaskButton = $(".editTask").find('.editButton')
const removeTaskButton = $(".editTask").find('.removeButton')
const finishTaskButton = $(".editTask").find('.finishButton')
// const dateInput = $('#date')
const timeInput = $('#time')
// const showDateButton = $('#showDate')
// const showTimeButton = $('showTime')
const bordersButton = $("label.bordersButton")
const autoSortButton = $("label.autoSortButton")
const completionButton = $(".completionButton")
const sortButton = $(".sortButton")
const cleanUpButton = $(".cleanUpButton");
const dateInput = $( "#datepicker" )
addTaskButton.initButton('btn-primary')
editTaskButton.initButton('btn-primary')
removeTaskButton.initButton('btn-danger')
finishTaskButton.initButton('btn-success')
completionButton.initButton('btn-primary')
sortButton.initButton('btn-primary')
cleanUpButton.initButton('btn-primary')
dateInput.datepicker({
    showOtherMonths: true,
    selectOtherMonths: true
  });
editTaskButton.prop('disabled', true)
editTaskButton.editMode = false
removeTaskButton.prop('disabled', true)
if (showBordersDefault){
    $(".sortable").css("border", "1px solid #eee")
    bordersButton.addClass("active")
} else {
    $(".sortable").css("border", "0px")
    bordersButton.removeClass("active")
}
if (autoSortDefault){
    autoSort = true;
    autoSortButton.addClass("active");
} else {
    autoSort = false;
    autoSortButton.removeClass("active");
}

// appending to dom
$("div.trial").append(s1)
s1.append(primeList)

// listen to events
editTaskButton.click(function() {
    // when edit, hit return for done
    if (!editTaskButton.editMode){
        // entering edit mode
        editTaskButton.editMode = true
        editTaskButton.html('Done')
        editTaskButton.removeClass('btn-primary').addClass('btn-success')
        $(editTaskName).val(listAll[selected].name) // check back
        editTaskButton.attr('disabled', false)
        removeTaskButton.attr('disabled', true)
        addTaskButton.attr('disabled', true)
        dateInput.attr('disabled', false)
        timeInput.attr('disabled', false)
        editTaskName.attr('disabled', false)
        dateInput.val(listAll[selected].dateStr)
        timeInput.val(listAll[selected].timeStr)
        editTaskName.select();
    } else {
        // finished editing
        editTaskButton.html('Edit')
        editTaskButton.removeClass('btn-success').addClass('btn-primary')
        editTaskButton.attr('disabled', false)
        removeTaskButton.attr('disabled', false)
        addTaskButton.attr('disabled', false)
        curTask = listAll[selected]
        curTask.name = editTaskName.val()
        curTask.setName()
        curTask.dateStr = dateInput.val()
        curTask.timeStr = timeInput.val()
        var d = new Date(curTask.dateStr + " " + curTask.timeStr)
        if (isNaN(d)){
            curTask.deadline = null
        } else {
            curTask.deadline = d
        }
        curTask.setDeadline()
        // curTask.unselect()
        editTaskName.val('')
        dateInput.val('')
        timeInput.val('')
        dateInput.attr('disabled', true)
        timeInput.attr('disabled', true)
        editTaskName.attr('disabled', true)
        editTaskButton.editMode = false
        record(listAll);

        if (autoSort) {
            sortButton.click();
        }
        // editTaskName.keypress((event) => {});
    }
})

addTaskButton.click(function (){
    // var parent = listAll[selected].children("ul")
    var newTask = newList.clone()
    newTask.initTask("New Task")
    newTask.parentId = selected
    // parent.append(newTask)
    newTask.appendToParent()
    newTask.select()
    editTaskButton.click()
    var msgObj = {
        "op":"add",
        "name":"New Task",
        "id":newTask.id,
        "time":null,
        "parentId":newTask.parentId,
        "childrenIdList":newTask.childrenIdList
    }
    var msg = JSON.stringify(msgObj)
    if (DEBUG) console.log(msg)
    // ipcRenderer.send('asynchronous-message', msg)
})

function remove(taskId) {
    // const nowSelected = taskId;
    if (DEBUG) console.log('deleting'+taskId);
    const task = listAll[taskId];
    // let child;
    for (let childId of [...task.childrenIdList]) {
        remove(childId)
        // child = listAll[childId];
    }
    task.unselect()
    task.leaveParent()
    task.remove()
    delete listAll[taskId];
    if (DEBUG) console.log(listAll);
}

removeTaskButton.click(function () {
    remove(selected);
    record(listAll);
})

finishTaskButton.click(function() {
    var taskSelected = listAll[selected]
    var childrenSelected = taskSelected.find('li')
    var taskContent = taskSelected.find('h3')
    if (taskSelected.finished){
        // unfinish it
        taskContent.css("text-decoration", "")
        taskSelected.finished = false;
        childrenSelected.each(function() {
            let childId = $(this).attr('id')
            listAll[childId].finished = false;
            let idLoc = finishedTask.indexOf(parseInt(childId));
            if (idLoc == -1) {
                if (DEBUG) console.error("Error when trying to remove finished!!!")
                if (DEBUG) console.log(finishedTask)
                if (DEBUG) console.log(childId);
            } else {
                finishedTask.remove(idLoc);
            }
        })
        finishTaskButton.html("Finish")
        const idLoc = finishedTask.indexOf(taskSelected.id);
        if (idLoc == -1) {
            if (DEBUG) console.log("Error!!!")
        } else {
            finishedTask.remove(idLoc);
        }
    } else {
        taskContent.css("text-decoration", "line-through")
        taskSelected.finished = true;
        childrenSelected.each(function() {
            let child = listAll[$(this).attr('id')];
            if (child != null) {
                child.finished = true; // here
                finishedTask.push(child.id);
                if (child.id == taskSelected.id) {
                    if (DEBUG) console.log("li includes self?");
                }
            }
        })
        finishTaskButton.html("Unfinish")
        finishedTask.push(taskSelected.id);
    }
    record(listAll);
    if (DEBUG) console.log('finished task');
    if (DEBUG) console.log(finishedTask)
    // var msgObj = {
    //     "op":"finish",
    //     "name":taskSelected.name,
    //     "id":taskSelected.id,
    //     "time":null, // we actually just need the id
    //     "parentId":taskSelected.parentId,
    //     "childrenIdList":taskSelected.childrenIdList
    // }
    // var msg = JSON.stringify(msgObj)
    // ipcRenderer.send('asynchronous-message', msg)
})

bordersButton.click(function() {
    if (bordersButton.hasClass("active")){
        $(".sortable").css("border", "0px")
    } else {
        $(".sortable").css("border", "1px solid #eee")
    }
})

autoSortButton.click(function() {
    if (autoSortButton.hasClass("active")){
        autoSort = false;
    } else {
        autoSort = true;
    }
})

completionButton.click(function() {
    // window.open('dayComp.html');
    recordDayComp();
    let win = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true   
        }, 
        width: 210, 
        height: 300 
    })
    win.on('closed', () => {
      win = null
    })
    
    // Load a remote URL
    win.loadFile('dayComp.html');
})

sortButton.click(function() {
    // from the prime, get children, see their time, and recursively sort
    // with time before without time, more emergent before less emergent
    // due time of the parent should be no less than the greatest of the children
    // but we are not gonna care about that right now
    if (DEBUG) console.log('sorting');
    const primeTask = listAll[0];
    sortTask(primeTask);
    record(listAll);
    // const info = record(listAll, write=false);
    // const primeTask = listAll[0];
    // recover(data=info);
    recover();

})

cleanUpButton.click(function() {
    const DEBUG = true;
    if (DEBUG) console.log("clean up button:")
    if (DEBUG) console.log(finishedTask);
    let task;
    for (const taskId of finishedTask) {
        task = listAll[taskId];
        finishedToday.push(task.name);
        task.unselect();
        task.leaveParent();
        task.remove();
        delete listAll[taskId]
    }
    finishedTask = [];
    if (DEBUG) console.log("finished today: " + finishedToday);
    record(listAll);
})

$(document).keydown((event) => {
    if (event.keyCode == 91) {
        cmdDown = true;
    } else if (event.keyCode == 8 && cmdDown && selected != -1) {
        // cmd + backspace to remove
        removeTaskButton.click();
    } else if (event.keyCode == 65 && cmdDown && selected != -1) {
        // cmd + a to add
        addTaskButton.click();
    } else if (event.keyCode == 69 && cmdDown && selected != -1) {
        // cmd + e to edit
        editTaskButton.click();
    } else if (event.keyCode == 70 && cmdDown && selected != -1) {
        // cmd + f to finish
        finishTaskButton.click();
    }
    else {
        // alert(event.keyCode);
    }
})

$(document).keyup((event) => {
    if (event.keyCode == 91) {
        cmdDown = false;
    }
})

editTaskName.keypress((event) => {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && editTaskButton.editMode) {
        if (DEBUG) console.log('calling edit');
        editTaskButton.click();
    }
});

primeList.select()
addTaskButton.attr('disabled', false)
dateInput.attr('disabled', true)
timeInput.attr('disabled', true)
editTaskName.attr('disabled', true)

recover()

if (DEBUG) console.log('finished task');
if (DEBUG) console.log(JSON.stringify(finishedTask));
