/* =========================================
   SIDEBAR DASHBOARD LOGIC
   ========================================= */
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

/* =========================================
   SUBMENU (NOTES & PYQs) LOGIC
   ========================================= */
function toggleSubMenu(id, event) {
    // Prevent the page from jumping to the top when clicked
    event.preventDefault();

    // Close any other open submenus first
    document.querySelectorAll(".submenu").forEach(menu => {
        if (menu.id !== id) menu.classList.remove("active");
    });

    // Toggle the one you actually clicked
    document.getElementById(id).classList.toggle("active");
}

/* =========================================
   ABOUT PANEL LOGIC
   ========================================= */
function openAbout() {
    document.getElementById("aboutPanel").style.right = "0";
}

function closeAbout() {
    // Matches the width of the panel in style.css to hide it completely
    document.getElementById("aboutPanel").style.right = "-400px"; 
}

/* =========================================
   PDF VIEWER LOGIC
   ========================================= */
function openPDF(file) {
    const viewer = document.getElementById("pdfViewer");
    viewer.style.display = "block";
    document.getElementById("pdfFrame").src = file;
    
    // Smoothly scroll the user down to the PDF viewer
    window.scrollTo({
        top: viewer.offsetTop - 100, // Slightly offset so it doesn't hug the topbar
        behavior: "smooth"
    });
}

/* =========================================
   UPLOAD FORM LOGIC
   ========================================= */
function handleUpload(event) {
    // 1. Prevent the page from refreshing when the form is submitted
    event.preventDefault();

    // 2. Grab all the values the user typed in
    const fileName = document.getElementById("fileName").value;
    const category = document.getElementById("fileCategory").value;
    const semester = document.getElementById("fileSemester").value;
    const file = document.getElementById("fileInput").files[0]; // Gets the actual file

    // 3. Make sure a file was actually selected
    if (!file) {
        alert("Please select a file to upload!");
        return;
    }

    // 4. Show a success message (Temporary until linked to Firebase Storage)
    console.log("Uploading:", fileName, "| Category:", category, "| Sem:", semester);
    console.log("File Data:", file);
    
    alert(`Success! "${fileName}" is ready to be sent to the database.`);

    // 5. Clear the form after a successful upload
    document.getElementById
