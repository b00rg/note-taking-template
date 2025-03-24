// Function to handle adding a new note in a subject folder
function addNewNote(subjectId) {
    const noteTitle = prompt("Enter the note title for " + subjectId + ":");
    if (noteTitle) {
        const folderContent = document.getElementById(subjectId + "Folders").querySelector('.nav__dropdown-content'); // Select the correct container
        const noteLink = document.createElement('a');
        noteLink.href = "#";
        noteLink.classList.add('nav__dropdown-content', 'a'); // Add both classes
        noteLink.style.display = "block";
        noteLink.innerText = noteTitle;
        noteLink.style.padding = '0.5rem 1rem'; // Add padding from your CSS
        noteLink.style.display = 'flex';
        noteLink.style.justifyContent = 'center';
        noteLink.style.alignItems = 'center';
        noteLink.style.borderRadius = '4px';
        noteLink.style.textAlign = 'center';

        // Apply the desired styles (small, bold)
        noteLink.style.fontSize = 'var(--smaller-font-size)'; // Adjust this to whatever size you need
        console.log(noteLink.style.fontSize);
        noteLink.style.color = 'var(--first-color)'; // Use your variable or specify a color

        folderContent.appendChild(noteLink);

        noteLink.addEventListener('click', function() {
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
        folderContentDiv.classList.add('nav__dropdown-content'); // Add the container class
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