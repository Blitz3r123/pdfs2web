var http = require('http');
var fs = require('fs');
const cheerio = require('cheerio');

var pdfFileCount = 0;
var htmlFileCount = 0;
var batFileCount = 0;
var exeFileCount = 0;
var otherFileCount = 0;

var pdfFiles = [];
pdfFiles.name = 'pdfFiles';
var htmlFiles = [];
htmlFiles.name = 'htmlFiles';
var batFiles = [];
batFiles.name = 'batFiles';
var exeFiles = [];
exeFiles.name = 'exeFiles';
var otherFiles = [];
otherFiles.name = 'otherFiles';

fs.readdir(__dirname + '/files', (err, data) => {
	// Check if there is an error
	if (err) {
		console.log("Error: " + err);
	}else{
		// Check if there are any files in the directory
		console.log("Checking for files in the directory.");
		if(data.length === 0){
			console.log('There are no files in the directory.');
		}else{
			console.log("Files have been found.");
			// Go through each file
			for(var i = 0; i < data.length; i++){
				// SORT THE FILES INTO ARRAYS OF THEIR FILE TYPES
				sortFileByType(data[i]);
				console.log("Sorting files.");
			}

			console.log("Checking for any previous html files.");
			if(htmlFiles.length < pdfFiles.length){
				// console.log('htmlfiles.length = ' + htmlFiles.length);
				// console.log('pdfFiles.length = ' + pdfFiles.length);
				// Delete all html files, reset html file count and html array
				for(var i = 0; i < htmlFileCount; i++){
					// Check that the file exists
					if(fs.existsSync(__dirname + '/files/' + htmlFiles[i])){
						// Delete the file and decrement the html file count
						fs.unlink(__dirname + '/files/' +htmlFiles[i], (err) => {
							if (err) console.log(err);
							var index = htmlFiles.indexOf(htmlFiles[i]);
							// console.log(htmlFiles[i] + " can be found at index: " + index);
							htmlFiles.splice(index, 1);
							// console.log(htmlFiles[i] + " deleted!");
							htmlFileCount--;
						});
						console.log("All html files deleted.");
					}else{
						console.log(htmlFiles[i] + " doesn't exist!");
					}
				}
				console.log("Creating script.bat.");
				createBatCode(pdfFiles);
				console.log("script.bat Created.");
				console.log("Running script.bat.");
				runBatCode(__dirname + '/script.bat');
				console.log("script.bat has been run.");
			}

			var outputPage = '';
			var links = [];
			for(var i = 0; i < htmlFiles.length; i++){
				if((htmlFiles[i].slice(-6) === 's.html') && (!htmlFiles[i].includes('answers.html'))){
					links.push(htmlFiles[i]);
					console.log("Organising html files.");
					var page = fs.readFileSync(__dirname + '/files/' + htmlFiles[i]);
					const $ = cheerio.load(page);
					console.log("Writing html code for page: " + htmlFiles[i]);
					outputPage = '<html><head><title>Title</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head><body><div style="width: 50%; margin-left: 25%; text-align: center;"><p class="lead">'
					outputPage = outputPage + $('body').html();
					outputPage = outputPage + '</p></div></body>';
					fs.writeFile(htmlFiles[i], outputPage, (err) => {
						if (err) console.log(err);
					});
					console.log("HTML code written for page: " + htmlFiles[i]);
				}
			}
			console.log("Writing html for index.html page.");
			var indexOutput = '<html><head><title>Title</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head><body><div class="container">';
			for(var i = 0; i < links.length; i++){
				indexOutput = indexOutput + '<a href="' +links[i]+ '" class="btn btn-primary" style="width: 50%; margin-left: 25%; margin-top: 3vh;">' +links[i]+ '</a><br>';
			}
			indexOutput = indexOutput + '</div></body></html>';

			fs.writeFile('index.html', indexOutput, (err) => {
				if (err) console.log(err);
				console.log("HTML code written for index.html page.");
			});
		}
	}	
});

function displayArray(array){
	console.log('------------------------------------------------' + array.name + '------------------------------------------------\n');
	for(var i = 0; i < array.length; i++){
		console.log(array.name + '[' + i + ']: ' + array[i]);
	}
}

function sortFileByType(filename){
	if(filename.slice(-5) === '.html'){
		// console.log(filename + ' is a html file.');
		htmlFiles.push(filename);
		htmlFileCount++;
	}else if(filename.slice(-4) === '.pdf'){
		// console.log(filename + ' is a pdf file.');
		pdfFiles.push(filename);
		pdfFileCount++;
	}else if(filename.slice(-4) === '.bat'){
		// console.log(filename + ' is a bat file.');
		batFiles.push(filename);
		batFileCount++;
	}else if(filename.slice(-4) === '.exe'){
		// console.log(filename + ' is a exe file.');
		exeFiles.push(filename);
		exeFileCount++;
	}else{
		// otherFiles.push(filename);
		otherFiles++;
	}
}

// function for creating the cmd commands to convert from pdf to html
function createBatCode(pdfFiles){
	var script = 'cd files \n';
	console.log("Writing .bat code...");
	for(var i = 0; i < pdfFiles.length; i++){
		script = script + 'call pdftohtml.exe "' + pdfFiles[i] + '" "' + pdfFiles[i].slice(0, -4) + '.html" \n'; 
	}

	script = script + 'cd ../ \n';
	script = script + 'node index.js \n';

	fs.writeFile(__dirname + '/script.bat', script, (err) => {
		if (err) console.log(err);
		console.log(".bat code has been written.");
	});
}

// function for running cmd commands in node.js
// https://stackoverflow.com/questions/21557461/execute-a-batch-file-from-nodejs
function runBatCode(filename){
	const process = require('child_process');

	filename = '"' + filename + '"';

	process.exec(filename, (error, stdout, stderr) => {
		console.log(stdout);
		if (error) console.log(error);
		// console.log('.bat file executed.');
	});
}