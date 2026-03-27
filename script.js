/* SIDEBAR TOGGLE */
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

/* SUBMENU */
function toggleSubMenu(id, event) {
    event.preventDefault();

    document.querySelectorAll(".submenu").forEach(menu => {
        if (menu.id !== id) menu.classList.remove("active");
    });

    document.getElementById(id).classList.toggle("active");
}

/* ABOUT PANEL */
function openAbout() {
    document.getElementById("aboutPanel").style.right = "0";
}

function closeAbout() {
    document.getElementById("aboutPanel").style.right = "-300px";
}

/* PDF VIEW */
function openPDF(file) {
    const viewer = document.getElementById("pdfViewer");
    viewer.style.display = "block";
    document.getElementById("pdfFrame").src = file;
}
