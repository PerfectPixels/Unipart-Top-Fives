"use strict";

/** @global */
const dropZone = document.getElementById('drop-zone');
const selectFile = document.getElementById('file');
let list = document.getElementById('list');

selectFile.addEventListener('change', handleFileSelect, false);
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

function handleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();

	let file = e.target.files[0];
	let output = [];

	if (!file){
    	file = e.dataTransfer.files[0];
    }

    fileDetails(file);

	readFile(file).then(content => {
	  	addTask(content[0]);
		findNbs(content[1]);
	});  	
}

function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

function addTask(content){
	let el = document.createElement('li');
	el.innerHTML = content;
	list.appendChild(el);
}

function fileDetails(file){
	addTask('<strong>File Loaded!</strong> File name is ' + escape(file.name) + ' has a type of ' + file.type + ' with a size of ' + file.size + ' bytes');
	
}

function readFile(file) {
    return new Promise((resolve, reject) => {
		const fileSize = file.size;
	    let reader = new FileReader();
    
    	reader.readAsText(file);

    	reader.onloadend = (e) => {
	    	if (e.target.readyState == FileReader.DONE) {
	      		return resolve(['<strong>File Read! </strong>1 to ' + fileSize + ' of ' + fileSize + ' bytes', e.target.result.split('\n')]);
	      	} 
	    }
    });
}

function findNbs(nbs){
	let value;
    let uniques = [];
    let frequency = nbs.reduce((prev, cur) => {
		prev[cur] = (prev[cur] || 0) + 1;
		return prev;
	}, {});
	let list;

    for (value in frequency) {
        uniques.push(value);
    }

	addTask('<strong>Counted!</strong> ' + uniques.length + ' numbers have been used multiple times');
	
	list = sortArr(uniques, frequency).slice(0, 5);

	addTask('<strong>The 5 most used numbers are:</strong><pre>' + list.join('<br />') + '</pre>')
}

function  sortArr(arr, frequency, maxItem){
    return arr.sort((a, b) => {
        return frequency[b] - frequency[a];
    });
}

