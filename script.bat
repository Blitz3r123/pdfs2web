cd files 
call pdftohtml.exe "C++ Lecture 1 Notes + Tutorial.pdf" "C++ Lecture 1 Notes + Tutorial.html" 
call pdftohtml.exe "C++ Lecture 1 Programming in C++.pdf" "C++ Lecture 1 Programming in C++.html" 
call pdftohtml.exe "C++ Lecture 2 Notes + Tutorial.pdf" "C++ Lecture 2 Notes + Tutorial.html" 
call pdftohtml.exe "C++ Lecture 2 Sequential Containers.pdf" "C++ Lecture 2 Sequential Containers.html" 
cd ../ 
node index.js 
