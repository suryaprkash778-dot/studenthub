/* --- PDF Viewer Function --- */
function openPDF(file) {
    document.getElementById("pdfViewer").style.display = "block";
    document.getElementById("pdfFrame").src = file;
    
    // Smooth scroll down to the PDF viewer
    window.scrollTo({
        top: document.getElementById("pdfViewer").offsetTop,
        behavior: "smooth"
    });
}

/* --- Star Rating Function --- */
function rate(stars) {
    alert("You rated " + stars + " stars ⭐");
}

/* --- Add Review Function (Secured against XSS) --- */
function addReview() {
    const name = document.getElementById("name").value;
    const review = document.getElementById("review").value;

    if (name === "" || review === "") {
        alert("Please fill all fields");
        return;
    }

    const reviewList = document.getElementById("reviewList");
    
    // Create elements safely to prevent code injection
    const newReview = document.createElement("p");
    const nameTag = document.createElement("b");
    
    // Use textContent/append instead of innerHTML
    nameTag.textContent = name;
    newReview.appendChild(nameTag);
    newReview.append(": " + review);

    reviewList.appendChild(newReview);

    // Clear the input fields after submitting
    document.getElementById("name").value = "";
    document.getElementById("review").value = "";
}

/* --- About Panel Functions --- */
function openAbout() {
    document.getElementById("aboutPanel").style.right = "0";
}

function closeAbout() {
    document.getElementById("aboutPanel").style.right = "-400px";
}

/* --- Hamburger Menu Toggle --- */
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

/* --- Submenu Toggle (For Notes & PYQs) --- */
function toggleSubMenu(menuId, event) {
    // Stop the link from jumping to the top of the page
    event.preventDefault(); 
    
    // Find the submenu we clicked and toggle its visibility
    const submenu = document.getElementById(menuId);
    submenu.classList.toggle("active");
}
