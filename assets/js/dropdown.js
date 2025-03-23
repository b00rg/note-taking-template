// Function to handle adding a new note in a subject folder
function addNewNote(subjectId) {
    const noteTitle = prompt("Enter the note title for " + subjectId + ":");
    if (noteTitle) {
        const folderContent = document.getElementById(subjectId + "Folders");
        const noteLink = document.createElement('a');
        noteLink.href = "#";
        noteLink.classList.add('nav__dropdown-item');
        noteLink.style.display = "block"; // Ensure note appears on a new line
        noteLink.innerText = noteTitle;

        // Append the new note to the subject folder
        folderContent.appendChild(noteLink);

        // Add event listener to update the content in the main section
        noteLink.addEventListener('click', function() {
            // Update the main content with the new note title and placeholder text
            document.querySelector('main section').innerHTML = `
                <h1>${noteTitle}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
            `;
        });
    }
}

// Event listener for adding a new subject folder
document.getElementById('addNewSubjectBtn').addEventListener('click', function() {
    const subjectName = prompt("Enter the new subject name:");
    if (subjectName) {
        const newSubjectId = "subject" + Date.now(); // Unique ID for each subject
        const subjectList = document.getElementById('subjectList');

        // Create new subject folder structure
        const newSubject = document.createElement('div');
        newSubject.classList.add('nav__dropdown');
        newSubject.id = newSubjectId;

        // Subject link
        const subjectLink = document.createElement('a');
        subjectLink.href = "#";
        subjectLink.classList.add('nav__link');
        subjectLink.innerHTML = `<i class='bx bx-book nav__icon'></i><span class="nav__name">${subjectName}</span><i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>`;

        // Folder content container
        const folderContent = document.createElement('div');
        folderContent.classList.add('nav__dropdown-collapse');
        folderContent.id = newSubjectId + "Folders";
        const folderContentDiv = document.createElement('div');
        folderContentDiv.classList.add('nav__dropdown-content');
        folderContent.appendChild(folderContentDiv);

        // Add "Add New Note" button
        const addNoteButton = document.createElement('button');
        addNoteButton.classList.add('nav__link', 'add-note-btn'); 
        addNoteButton.innerHTML = `<i class="bx bx-plus nav__icon"></i><span class="nav__name">Add New Note</span>`;

        // Append everything to the new subject container
        newSubject.appendChild(subjectLink);
        newSubject.appendChild(folderContent);
        newSubject.appendChild(addNoteButton);

        // Append the new subject to the subject list
        subjectList.appendChild(newSubject);

        // Add event listener to the "Add New Note" button
        addNoteButton.addEventListener('click', function() {
            addNewNote(newSubjectId);
        });
    }
});
