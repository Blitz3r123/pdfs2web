# pdfs2web
Converts a bunch of pdf files into a website.

## How to use:
1. Run `git clone https://github.com/Blitz3r123/pdfs2web`
2. Run `cd pdfs2web`
3. Run `npm install` to install all dependencies
4. Place all the pdfs into the folder called 'files'
5. Run `node index.js`
6. If the index.html file is not found in the same directory as the index.js file then you will have to manually run the script.bat file by double clicking it
7. Open up the index.html file and enjoy!

## Explanation
This script should be placed in a folder with a folder within it called "files". The script takes all pdf files from the 'files' folder and uses the pdftohtml.exe file to convert them to html. Cheerio.js then scrapes these files and puts all the pages into one html document that has Bootstrap 4 in it making the HTML clean and crisp to read.
