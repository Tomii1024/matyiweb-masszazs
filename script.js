// =========================
// NAVBAR SCROLL EFFECT
// =========================

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// =========================
// MOBILE MENU
// =========================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

});


// =========================
// MENU BEZÁRÁSA KATTINTÁSRA
// =========================

document.querySelectorAll(".nav-link, .nav-button").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

    });

});


// =========================
// SCROLL TOP BUTTON
// =========================

const scrollTop = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        scrollTop.classList.add("show");

    } else {

        scrollTop.classList.remove("show");

    }

});


scrollTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =========================
// SCROLL ANIMÁCIÓ
// =========================

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


// =========================
// AKTÍV NAVBAR MENÜ
// =========================

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


// =========================
// AUTOMATIKUS ÉV
// =========================

document.getElementById("currentYear")
    .textContent = new Date().getFullYear();


// =========================
// COOKIE ÉRTESÍTÉS
// =========================

const cookieBox =
    document.getElementById("cookieBox");

const cookieAccept =
    document.getElementById("cookieAccept");


if (localStorage.getItem("cookieAccepted")) {

    cookieBox.style.display = "none";

}


cookieAccept.addEventListener("click", () => {

    localStorage.setItem(
        "cookieAccepted",
        "true"
    );

    cookieBox.style.display = "none";

});