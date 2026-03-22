function rate(stars){

alert("You rated " + stars + " stars ⭐");

}


function addReview(){

const name = document.getElementById("name").value;

const review = document.getElementById("review").value;

if(name === "" || review === ""){

alert("Please fill all fields");

return;

}

const reviewList = document.getElementById("reviewList");

const newReview = document.createElement("p");

newReview.innerHTML = "<b>" + name + ":</b> " + review;

reviewList.appendChild(newReview);

document.getElementById("name").value = "";

document.getElementById("review").value = "";

}


function openPDF(file){

document.getElementById("pdfViewer").style.display="block";

document.getElementById("pdfFrame").src=file;

window.scrollTo({

top: document.getElementById("pdfViewer").offsetTop,

behavior: "smooth"

});

}
