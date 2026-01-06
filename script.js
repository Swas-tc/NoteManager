// Global variables
let currentEditId = null;
const noteInput = document.getElementById('note-input');
const errorMsg = document.getElementById('error-message');
const notesContainer = document.getElementById('notes-container');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');

document.addEventListener('DOMContentLoaded', displayNotes);

function addNote() {
    const noteText = noteInput.value.trim();

    if (!noteText) {
        showError("Content cannot be empty");
        return;
    }

    const notes = getNotesFromStorage();
    
    const newNote = {
        id: Date.now(),
        content: noteText,
        // Format date cleanly
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    notes.unshift(newNote); // Add to beginning of array
    saveNotesToStorage(notes);
    
    noteInput.value = '';
    displayNotes();
}

function displayNotes() {
    const notes = getNotesFromStorage();
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #333; padding: 40px;">
                <i class="fa-regular fa-clipboard" style="font-size: 3rem; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>No notes found. Create one above!</p>
            </div>
        `;
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        noteCard.innerHTML = `
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-footer">
                <span class="note-date">${note.date}</span>
                <div class="card-actions">
                    <button class="btn-edit" onclick="editNote(${note.id})" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteNote(${note.id})" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        notesContainer.appendChild(noteCard);
    });
}

function deleteNote(id) {
    let notes = getNotesFromStorage();
    notes = notes.filter(note => note.id !== id);
    saveNotesToStorage(notes);
    displayNotes();
    if(currentEditId === id) resetForm();
}

function editNote(id) {
    const notes = getNotesFromStorage();
    const noteToEdit = notes.find(note => note.id === id);

    if (noteToEdit) {
        noteInput.value = noteToEdit.content;
        currentEditId = id;

        addBtn.style.display = 'none';
        updateBtn.style.display = 'inline-block';
        
        noteInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNote() {
    const noteText = noteInput.value.trim();

    if (!noteText) {
        showError("Content cannot be empty");
        return;
    }

    let notes = getNotesFromStorage();
    const noteIndex = notes.findIndex(note => note.id === currentEditId);

    if (noteIndex !== -1) {
        notes[noteIndex].content = noteText;
        saveNotesToStorage(notes);
        displayNotes();
        resetForm();
    }
}

function resetForm() {
    noteInput.value = '';
    currentEditId = null;
    addBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    errorMsg.textContent = '';
}

function getNotesFromStorage() {
    return localStorage.getItem('notesManagerData') ? JSON.parse(localStorage.getItem('notesManagerData')) : [];
}

function saveNotesToStorage(notes) {
    localStorage.setItem('notesManagerData', JSON.stringify(notes));
}

function showError(msg) {
    errorMsg.textContent = msg;
    // Add shake animation logic via class if desired, here we just show text
    setTimeout(() => {
        errorMsg.textContent = '';
    }, 3000);
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}