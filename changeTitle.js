const { app, BrowserWindow } = require('electron')
require('jquery-ui-dist')

let title = document.getElementById('title')

changeH1();

title.addEventListener('click', (event) => {
    changeH1()
  })

function changeH1 () {
    title.innerText = "New title"
  }