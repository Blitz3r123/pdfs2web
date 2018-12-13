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
		if(data.length === 0){
			console.log('There are no files in the directory.');
		}else{
			// Go through each file
			for(var i = 0; i < data.length; i++){
				// SORT THE FILES INTO ARRAYS OF THEIR FILE TYPES
				sortFileByType(data[i]);
			}

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
					}else{
						console.log(htmlFiles[i] + " doesn't exist!");
					}
				}
				createBatCode(pdfFiles);
				runBatCode(__dirname + '/files/script.bat');
			}

			var outputPage = '';
			var links = [];
			for(var i = 0; i < htmlFiles.length; i++){
				if((htmlFiles[i].slice(-6) === 's.html') && (!htmlFiles[i].includes('answers.html'))){
					links.push(htmlFiles[i]);
					var page = fs.readFileSync(__dirname + '/files/' + htmlFiles[i]);
					const $ = cheerio.load(page);
					outputPage = '<html><head><title>Title</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head><body><p class="lead">'
					outputPage = outputPage + $('body').html();
					outputPage = outputPage + '</p></body>';

					fs.writeFile(htmlFiles[i], outputPage, (err) => {
						if (err) console.log(err);
					});
				}
			}
			
			var indexOutput = '<html><head><title>Title</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head><body><div class="container">';
			for(var i = 0; i < links.length; i++){
				indexOutput = indexOutput + '<a href="files/' +links[i]+ '" class="btn btn-primary" style="width: 50%; margin-left: 25%; margin-top: 3vh;">' +links[i]+ '</a><br>';
			}
			indexOutput = indexOutput + '</div></body></html>';

			fs.writeFile('index.html', indexOutput, (err) => {
				if (err) console.log(err);
			});

			// console.log($(''));
			// }
			// All files should be sorted at this point and all html files should be deleted
			// Create the bat code to convert all pdf files to html 
			// displayArray(htmlFiles);
			// displayArray(pdfFiles);
			// displayArray(exeFiles);
			// displayArray(batFiles);
			// displayArray(otherFiles);

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
		otherFiles.push(filename);
		otherFiles++;
	}
}

// function for creating the cmd commands to convert from pdf to html
function createBatCode(pdfFiles){
	var script = '';

	for(var i = 0; i < pdfFiles.length; i++){
		script = script + 'call pdftohtml.exe ' + pdfFiles[i] + ' ' + pdfFiles[i].slice(0, -4) + '.html \n'; 
	}

	fs.writeFile(__dirname + '/files/script.bat', script, (err) => {
		if (err) console.log(err);
	});
}

// function for running cmd commands in node.js
// https://stackoverflow.com/questions/21557461/execute-a-batch-file-from-nodejs
function runBatCode(filename){
	const process = require('child_process');

	filename = '"' + filename + '"';

	process.exec(filename, (error, stdout, stderr) => {
		// console.log(stdout);
		if (error) console.log(error);
		// console.log('.bat file executed.');
	});
}