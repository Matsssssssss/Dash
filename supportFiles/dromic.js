const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link=>{
    link.addEventListener("click",()=>{
        navLinks.classList.remove("active");
    });

    menuToggle.addEventListener("click",()=>{
    navLinks.classList.toggle("active");
    menuToggle.textContent =
        navLinks.classList.contains("active")
        ? "✖"
        : "☰";
});
});