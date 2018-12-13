# pdfs2web
Converts a bunch of pdf files into a website.

## Explanation
This script should be placed in a folder with a folder within it called "files". The script takes all pdf files from the 'files' folder and uses the pdftohtml.exe file to convert them to html. Cheerio.js then scrapes these files and puts all the pages into one html document that has Bootstrap 4 in it making the HTML clean and crisp to read.
