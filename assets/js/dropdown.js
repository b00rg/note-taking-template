import { addNewNote } from "./markdownEditor/note.js";

// Function to handle adding a new branch
// Function to handle adding a new branch
function addNewBranch() {
    const inheritance = prompt("Enter the branch you would like to inherit from:");
    const branchTitle = prompt("Enter the branch title:");
    if (branchTitle && inheritance) {
        const folderContent = document.querySelector('.nav__dropdown-collapse .nav__dropdown-content');
        
        // Create the new branch element
        const branchLink = document.createElement('a');
        branchLink.href = "#";
        branchLink.classList.add('nav__dropdown-content', 'a'); // Added 'nav__dropdown-content' to apply the right styles
        
        // Apply common styles (no border or background for "Add Branch")
        branchLink.style.padding = '0.5rem 1rem'; 
        branchLink.style.display = 'flex';
        branchLink.style.justifyContent = 'center';
        branchLink.style.alignItems = 'center';
        branchLink.style.borderRadius = '4px';
        branchLink.style.textAlign = 'center';
        branchLink.style.fontSize = 'var(--smaller-font-size)'; 
        branchLink.style.color = 'var(--first-color)'; 
        branchLink.style.background = 'none'; // No background
        branchLink.style.border = 'none'; // No border

        // Set the inner text to the branch title
        branchLink.innerText = branchTitle;
        
        // Insert the new branch above the "Add Branch" button
        const addBranchButton = document.getElementById('addBranchBtn');
        folderContent.insertBefore(branchLink, addBranchButton);
    }
}

// Event listener for the single Add Branch button
document.getElementById('addBranchBtn').addEventListener('click', addNewBranch);

// Ensure Add Branch button is at the bottom of the list when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const folderContent = document.querySelector('.nav__dropdown-collapse .nav__dropdown-content');
    const addBranchButton = document.getElementById('addBranchBtn');
    if (folderContent && addBranchButton) {
        folderContent.appendChild(addBranchButton);
    }
});


// Event listener for adding a new subject folder
document.getElementById('addNewSubjectBtn').addEventListener('click', function() {
    const subjectName = prompt("Enter the new subject name:");
    if (subjectName) {
        const newSubjectId = "subject" + Date.now();
        const subjectList = document.getElementById('subjectList');

        const newSubject = document.createElement('div');
        newSubject.classList.add('nav__dropdown');
        newSubject.id = newSubjectId;

        const subjectLink = document.createElement('a');
        subjectLink.href = "#";
        subjectLink.classList.add('nav__link');
        subjectLink.innerHTML = `<i class='bx bx-book nav__icon'></i><span class="nav__name">${subjectName}</span><i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>`;

        const folderContent = document.createElement('div');
        folderContent.classList.add('nav__dropdown-collapse');
        folderContent.id = newSubjectId + "Folders";
        const folderContentDiv = document.createElement('div');
        folderContentDiv.classList.add('nav__dropdown-content'); 
        folderContent.appendChild(folderContentDiv);

        const addNoteButton = document.createElement('button');
        addNoteButton.classList.add('nav__link', 'add-note-btn');
        addNoteButton.innerHTML = `<i class="bx bx-plus nav__icon"></i><span class="nav__name">Add New Note</span>`;

        folderContent.appendChild(addNoteButton);

        newSubject.appendChild(subjectLink);
        newSubject.appendChild(folderContent);

        subjectList.appendChild(newSubject);

        addNoteButton.addEventListener('click', function() {
            addNewNote(newSubjectId);
        });
    }
});