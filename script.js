import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://yweieluypgmndthfiyod.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LPftpFt9lg4dBOIW55Eg8w_fevghZ6o';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let currentCategory = null;
let currentSemester = null;

window.toggleSidebar = function () {
  document.getElementById('sidebar').classList.toggle('active');
};

window.toggleSubMenu = function (id, event) {
  event.preventDefault();
  document.querySelectorAll('.submenu').forEach(menu => {
    if (menu.id !== id) menu.classList.remove('active');
  });
  document.getElementById(id).classList.toggle('active');
};

window.openAbout = function () {
  document.getElementById('aboutPanel').style.right = '0';
};

window.closeAbout = function () {
  document.getElementById('aboutPanel').style.right = '-400px';
};

window.openPDF = function (file) {
  const viewer = document.getElementById('pdfViewer');
  viewer.style.display = 'block';
  document.getElementById('pdfFrame').src = file;

  window.scrollTo({
    top: viewer.offsetTop - 100,
    behavior: 'smooth'
  });
};

window.showHome = function () {
  document.getElementById('homeView').style.display = 'block';
  document.getElementById('roadmapView').style.display = 'none';
  document.getElementById('sidebar').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.openRoadmap = function () {
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('roadmapView').style.display = 'block';
  document.getElementById('sidebar').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleCoreSubjects = function () {
  const cardsContainer = document.getElementById('coreSubjectCards');
  const btn = document.getElementById('coreToggleBtn');

  cardsContainer.classList.toggle('open');

  if (cardsContainer.classList.contains('open')) {
    btn.innerHTML = 'Hide Subjects <i class="ph ph-caret-up"></i>';
  } else {
    btn.innerHTML = 'View Subjects <i class="ph ph-caret-down"></i>';
  }
};

function setStatus(message, isError = false) {
  const status = document.getElementById('uploadStatus');
  status.textContent = message;
  status.style.color = isError ? '#ff8b8b' : '#ccefff';
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildNoteCard(note) {
  const description = note.description?.trim() || 'No description provided.';

  return `
    <div class="note-card">
      <h3>${escapeHtml(note.title || 'Untitled')}</h3>

      <div class="note-meta">
        ${note.category ? `<span class="note-tag">${escapeHtml(note.category.toUpperCase())}</span>` : ''}
        ${note.semester ? `<span class="note-tag">Semester ${escapeHtml(String(note.semester))}</span>` : ''}
      </div>

      <p class="note-description">${escapeHtml(description)}</p>

      <div class="note-footer">
        <span class="note-date">${formatDate(note.created_at)}</span>
        <a class="note-action" href="${note.file_url}" target="_blank" rel="noopener noreferrer">Open File</a>
      </div>
    </div>
  `;
}

async function loadNotes() {
  const notesList = document.getElementById('notesList');
  const filterLabel = document.getElementById('activeFilter');

  notesList.innerHTML = `<div class="empty-state">Loading materials...</div>`;

  let query = supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (currentCategory) {
    query = query.eq('category', currentCategory);
  }

  if (currentSemester) {
    query = query.eq('semester', currentSemester);
  }

  const { data, error } = await query;

  if (currentCategory && currentSemester) {
    filterLabel.textContent = `Showing: ${currentCategory.toUpperCase()} - Semester ${currentSemester}`;
  } else {
    filterLabel.textContent = 'Showing: All materials';
  }

  if (error) {
    console.error('Load error:', error);
    notesList.innerHTML = `<div class="empty-state">Could not load materials. Check your Supabase policies and columns.</div>`;
    return;
  }

  if (!data || data.length === 0) {
    notesList.innerHTML = `<div class="empty-state">No materials found yet.</div>`;
    return;
  }

  notesList.innerHTML = data.map(buildNoteCard).join('');
}

window.loadNotes = loadNotes;

window.filterByCategoryAndSemester = async function (category, semester) {
  currentCategory = category;
  currentSemester = semester;
  document.getElementById('sidebar').classList.remove('active');
  await loadNotes();

  const library = document.querySelector('.library-section');
  if (library) {
    window.scrollTo({
      top: library.offsetTop - 90,
      behavior: 'smooth'
    });
  }
};

async function uploadFileToSupabase(file, category, semester, fileName) {
  const safeName = fileName.replace(/\s+/g, '_').toLowerCase();
  const filePath = `${category}/sem${semester}/${Date.now()}-${safeName}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('notes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('notes')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

async function saveNoteRecord({ title, description, category, semester, fileUrl }) {
  const { error } = await supabase
    .from('notes')
    .insert([
      {
        title,
        description,
        category,
        semester,
        file_url: fileUrl
      }
    ]);

  if (error) throw error;
}

const uploadForm = document.getElementById('uploadForm');
const submitBtn = document.querySelector('.upload-btn');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = 'Uploading to NoteVerse...';
  submitBtn.disabled = true;
  setStatus('Uploading file and saving details...');

  try {
    const fileName = document.getElementById('fileName').value.trim();
    const description = document.getElementById('fileDescription').value.trim();
    const category = document.getElementById('fileCategory').value;
    const semester = document.getElementById('fileSemester').value;
    const file = document.getElementById('fileInput').files[0];

    if (!fileName || !category || !semester || !file) {
      throw new Error('Please fill all required fields.');
    }

    const fileUrl = await uploadFileToSupabase(file, category, semester, fileName);

    await saveNoteRecord({
      title: fileName,
      description,
      category,
      semester,
      fileUrl
    });

    setStatus(`Success! "${fileName}" uploaded successfully.`);
    uploadForm.reset();

    currentCategory = null;
    currentSemester = null;
    await loadNotes();
  } catch (error) {
    console.error('Upload error:', error);
    setStatus(error.message || 'Upload failed.', true);
    alert(`Upload failed: ${error.message || 'Unknown error'}`);
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
});
