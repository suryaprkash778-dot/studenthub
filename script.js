/* =========================================
   PDF VIEWER
   ========================================= */
function openPDF(file) {
    document.getElementById("pdfViewer").style.display = "block";
    document.getElementById("pdfFrame").src = file;
    
    // Smooth scroll down to the PDF viewer
    window.scrollTo({
        top: document.getElementById("pdfViewer").offsetTop,
        behavior: "smooth"
    });
}

/* =========================================
   ABOUT PANEL FUNCTIONS
   ========================================= */
function openAbout() {
    document.getElementById("aboutPanel").style.right = "0";
}

function closeAbout() {
    document.getElementById("aboutPanel").style.right = "-400px";
}

/* =========================================
   HAMBURGER MENU & DROPDOWNS
   ========================================= */
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

function toggleSubMenu(menuId, event) {
    // Prevent the page from jumping to the top when a folder is clicked
    event.preventDefault(); 
    const submenu = document.getElementById(menuId);
    submenu.classList.toggle("active");
