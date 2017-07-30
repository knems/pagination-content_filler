'use strict'

const page = document.getElementsByClassName('page')[0]; //selects main body for DOM travering
const pageHeader = document.getElementsByClassName('page-header')[0];
const studentList = document.getElementsByClassName('student-item'); //collection of all the students
const studentsPerPage = 10;
let pageLinks; // A variable to hold a refferance to the page links.
let message; // Keep track of the dom element for the message.
let activePageLink; // a variable to hold what pagination link is active.

function displayMessage(str) {
	var node = document.createElement('div');
	node.textContent = str;
	message = node;
	page.appendChild(node);
} //a small func to invoke when no students are returned from the student search

function hideAll() {
	const len = studentList.length;
	for(let i = 0; i < len; i += 1) {
    	studentList[i].style.display = 'none';
    }
}

function appendPageLinks(list) {
	const numPages = Math.ceil(list.length / studentsPerPage);
	// create <div> and <ul>
	let div = document.createElement('div');
	div.setAttribute('class', 'pagination');
	let ul = document.createElement('ul');
	div.appendChild(ul);

	// create <li> and <a> elements using a loop
	for(let i = 1; i <= numPages; i++) {
		// create <li> and <a>
		let li = document.createElement('li');
		let a = document.createElement('a');

		// Set an active class on the first link only.
		if(i === 1) {
			a.setAttribute('class', 'active');
			activePageLink = a;
		}

		// Fill the links with numbers and add event handler.
		a.textContent = i;
		a.setAttribute('href', '#top');
		a.addEventListener('click', function(evt) {
			evt.preventDefault();
			showPage(i, list);
			// Set the active class name on the right link
			activePageLink.removeAttribute('class');
			evt.target.setAttribute('class', 'active');
			activePageLink = evt.target;
		}, false);

		li.appendChild(a);
		ul.appendChild(li);
	}

	pageLinks = div;
	page.appendChild(div);
}

function appendSearchField() {
	// Create DOM nodes
	let div = document.createElement('div');
	let input = document.createElement('input');
	let button = document.createElement('button');

	// Fill with content and attributes
	div.setAttribute('class', 'student-search');
	input.setAttribute('placeholder', 'Search for students...');
	button.textContent = 'Search';

	// Add click event handler
	button.addEventListener('click', function() {
		performSearch(input.value);
	});

	div.appendChild(input);
	div.appendChild(button);

	pageHeader.appendChild(div);
}

function performSearch(query) {
	let matched = [];

	// Loop through all the students and perform serach on each name and email
	for(let i = 0; i < studentList.length; i += 1) {
		const name = studentList[i].getElementsByTagName('h3')[0].textContent;
		const email = studentList[i].getElementsByClassName('email')[0].textContent;

		// We look for a mach in one of them or both.
		if(name.search(query) !== -1 || email.search(query) !== -1) {
			matched.push(studentList[i]);
		}
	}

	// Remove 'not found' message and page links if they egsist.
	if (message) { page.removeChild(message); message = undefined; }
	if (pageLinks) { page.removeChild(pageLinks); pageLinks = undefined; }

	if (matched.length === 0) { // No matches
		hideAll();
		displayMessage('No student’s found');
		return; // We need to return here to avoid showing an empty page.
	}

	if(matched.length > 10) {
		appendPageLinks(matched);
	}

	showPage(1, matched);
}

function showPage(pageNumber, list) {
	hideAll();

	const firstIndex = (pageNumber - 1) * studentsPerPage;
	const end = firstIndex + studentsPerPage;

	for(let i = firstIndex; i < end; i += 1) {
		const student = list[i];
		if(student) {
			student.style.display = 'block';
		}
	}
}

// When the page loads
appendSearchField();
showPage(1, studentList);
appendPageLinks(studentList);
