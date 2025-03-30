import { initializeEditor } from "./editor.js"; 

export function addNewNote(subjectId) {
    const noteTitle = prompt("Enter the note title for " + subjectId + ":");
    if (!noteTitle) return;

    const folderContent = document.getElementById(subjectId + "Folders")
        .querySelector('.nav__dropdown-content');

    const noteLink = document.createElement('a');
    noteLink.href = "#";
    noteLink.classList.add('nav__dropdown-content', 'a'); 
    noteLink.innerText = noteTitle;
    
    // Styling 
    Object.assign(noteLink.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: 'var(--smaller-font-size)',
        color: 'var(--first-color)'
    });

    folderContent.appendChild(noteLink);

    noteLink.addEventListener('click', function() {
        const mainSection = document.querySelector('main section');
        if (!mainSection) {
            console.error("Error: 'main section' not found.");
            return;
        }

        // Inject editor
        mainSection.innerHTML = `<h1>${noteTitle}</h1><textarea id="editor"></textarea>`;
        initializeEditor();
    });
}
