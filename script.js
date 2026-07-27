// ==========================================
// ALAPBEÁLLÍTÁSOK
// ==========================================

const OPENING_HOUR = 9;
const CLOSING_HOUR = 18;

const SLOT_INTERVAL = 30;


// ==========================================
// ELEMEK
// ==========================================

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const bookingDate =
    document.getElementById("bookingDate");

const timeSlots =
    document.getElementById("timeSlots");

const bookingForm =
    document.getElementById("bookingForm");

const summaryService =
    document.getElementById("summaryService");

const summaryDate =
    document.getElementById("summaryDate");

const successModal =
    document.getElementById("successModal");

const successDetails =
    document.getElementById("successDetails");


// ==========================================
// ÁLLAPOT
// ==========================================

let selectedService = {

    name: "60 perces svédmasszázs",

    duration: 60,

    price: 8000

};


let selectedTime = null;


// ==========================================
// DÁTUM MINIMUM
// ==========================================

const today =
    new Date();


const todayString =
    today.toISOString().split("T")[0];


bookingDate.min =
    todayString;


// Alapértelmezett dátum: holnap

const tomorrow =
    new Date();

tomorrow.setDate(
    tomorrow.getDate() + 1
);


bookingDate.value =
    tomorrow.toISOString().split("T")[0];


// ==========================================
// LOCAL STORAGE
// ==========================================

function getBookings() {

    const data =
        localStorage.getItem(
            "tesztmasszazs_bookings"
        );


    if (!data) {

        return [];

    }


    return JSON.parse(data);

}


function saveBookings(bookings) {

    localStorage.setItem(

        "tesztmasszazs_bookings",

        JSON.stringify(bookings)

    );

}


// ==========================================
// IDŐPONT ÁTVÁLTÁSA PERCRE
// ==========================================

function timeToMinutes(time) {

    const parts =
        time.split(":");


    return (

        parseInt(parts[0]) * 60 +

        parseInt(parts[1])

    );

}


// ==========================================
// PERCBŐL IDŐ
// ==========================================

function minutesToTime(minutes) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return (

        String(hours).padStart(2, "0") +

        ":" +

        String(mins).padStart(2, "0")

    );

}


// ==========================================
// ÜTKÖZÉS ELLENŐRZÉSE
// ==========================================

function isTimeAvailable(

    date,

    startTime,

    duration

) {

    const bookings =
        getBookings();


    const start =
        timeToMinutes(
            startTime
        );


    const end =
        start + duration;


    return !bookings.some(

        booking => {

            if (
                booking.date !== date
            ) {

                return false;

            }


            const bookingStart =
                timeToMinutes(
                    booking.time
                );


            const bookingEnd =
                bookingStart +
                booking.duration;


            return (

                start < bookingEnd &&

                end > bookingStart

            );

        }

    );

}


// ==========================================
// IDŐPONTOK GENERÁLÁSA
// ==========================================

function generateTimeSlots() {

    timeSlots.innerHTML = "";

    selectedTime = null;


    const selectedDate =
        bookingDate.value;


    if (!selectedDate) {

        return;

    }


    const now =
        new Date();


    const selectedDay =
        new Date(
            selectedDate + "T00:00:00"
        );


    const isToday =

        selectedDay.toDateString() ===
        now.toDateString();


    for (

        let minutes =
            OPENING_HOUR * 60;

        minutes <
            CLOSING_HOUR * 60;

        minutes += SLOT_INTERVAL

    ) {


        const time =
            minutesToTime(
                minutes
            );


        const available =
            isTimeAvailable(

                selectedDate,

                time,

                selectedService.duration

            );


        let past =
            false;


        if (isToday) {

            const currentMinutes =

                now.getHours() * 60 +

                now.getMinutes();


            past =
                minutes <=
                currentMinutes;

        }


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "time-slot";


        button.textContent =
            time;


        if (
            !available ||
            past
        ) {

            button.classList.add(
                "disabled"
            );


            button.disabled =
                true;

        }


        if (
            available &&
            !past
        ) {

            button.addEventListener(

                "click",

                () => {

                    document
                        .querySelectorAll(
                            ".time-slot"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedTime =
                        time;


                    updateSummary();

                }

            );

        }


        timeSlots.appendChild(
            button
        );

    }

}


// ==========================================
// ÖSSZESÍTŐ FRISSÍTÉSE
// ==========================================

function updateSummary() {

    summaryService.textContent =

        selectedService.name;


    if (
        selectedTime &&
        bookingDate.value
    ) {

        const date =
            new Date(
                bookingDate.value +
                "T00:00:00"
            );


        const formattedDate =

            date.toLocaleDateString(
                "hu-HU",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        summaryDate.textContent =

            formattedDate +

            " – " +

            selectedTime;

    } else {

        summaryDate.textContent =
            "Nincs kiválasztva";

    }

}


// ==========================================
// SZOLGÁLTATÁS VÁLASZTÁS
// ==========================================

document
    .querySelectorAll(
        ".service-option"
    )
    .forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    document
                        .querySelectorAll(
                            ".service-option"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedService = {

                        name:
                            button.dataset.service,

                        duration:
                            parseInt(
                                button.dataset.duration
                            ),

                        price:
                            parseInt(
                                button.dataset.price
                            )

                    };


                    generateTimeSlots();

                    updateSummary();

                }

            );

        }

    );


// ==========================================
// ÁRLISTA GOMBOK
// ==========================================

document
    .querySelectorAll(
        ".price-button"
    )
    .forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    const duration =
                        parseInt(
                            button.dataset.duration
                        );


                    const service =
                        button.dataset.service;


                    const serviceOption =

                        document.querySelector(

                            `.service-option[data-duration="${duration}"]`

                        );


                    if (
                        serviceOption
                    ) {

                        serviceOption.click();

                    }


                    document
                        .getElementById(
                            "booking"
                        )
                        .scrollIntoView({

                            behavior:
                                "smooth"

                        });

                }

            );

        }

    );


// ==========================================
// DÁTUM VÁLTOZÁS
// ==========================================

bookingDate.addEventListener(

    "change",

    () => {

        generateTimeSlots();

        updateSummary();

    }

);


// ==========================================
// FOGLALÁS ELKÜLDÉSE
// ==========================================

bookingForm.addEventListener(

    "submit",

    event => {

        event.preventDefault();


        if (
            !bookingDate.value
        ) {

            alert(
                "Kérlek válassz dátumot!"
            );

            return;

        }


        if (
            !selectedTime
        ) {

            alert(
                "Kérlek válassz időpontot!"
            );

            return;

        }


        const name =

            document
                .getElementById(
                    "name"
                )
                .value
                .trim();


        const phone =

            document
                .getElementById(
                    "phone"
                )
                .value
                .trim();


        const email =

            document
                .getElementById(
                    "email"
                )
                .value
                .trim();


        const note =

            document
                .getElementById(
                    "note"
                )
                .value
                .trim();


        // Utolsó ellenőrzés

        if (
            !isTimeAvailable(

                bookingDate.value,

                selectedTime,

                selectedService.duration

            )
        ) {

            alert(

                "Sajnos ezt az időpontot időközben lefoglalták."

            );


            generateTimeSlots();

            return;

        }


        const booking = {

            id:
                Date.now(),

            name,

            phone,

            email,

            note,

            date:
                bookingDate.value,

            time:
                selectedTime,

            service:
                selectedService.name,

            duration:
                selectedService.duration,

            price:
                selectedService.price,

            createdAt:
                new Date()
                    .toISOString()

        };


        const bookings =
            getBookings();


        bookings.push(
            booking
        );


        saveBookings(
            bookings
        );


        showSuccess(
            booking
        );


        bookingForm.reset();


        selectedTime =
            null;


        generateTimeSlots();

        updateSummary();

    }

);


// ==========================================
// SIKERES FOGLALÁS
// ==========================================

function showSuccess(
    booking
) {

    const date =
        new Date(

            booking.date +

            "T00:00:00"

        );


    const formattedDate =

        date.toLocaleDateString(

            "hu-HU",

            {

                year: "numeric",

                month: "long",

                day: "numeric"

            }

        );


    successDetails.innerHTML = `

        <strong>
            ${booking.service}
        </strong>

        <p>
            ${formattedDate}
            – ${booking.time}
        </p>

        <p>
            Vendég:
            ${booking.name}
        </p>

        <p>
            Ár:
            ${booking.price.toLocaleString("hu-HU")}
            Ft
        </p>

    `;


    successModal.classList.add(
        "active"
    );

}


// ==========================================
// MODAL BEZÁRÁSA
// ==========================================

document
    .getElementById(
        "modalClose"
    )
    .addEventListener(

        "click",

        () => {

            successModal.classList.remove(
                "active"
            );

        }

    );


document
    .getElementById(
        "modalOk"
    )
    .addEventListener(

        "click",

        () => {

            successModal.classList.remove(
                "active"
            );

        }

    );


// ==========================================
// MOBIL MENÜ
// ==========================================

menuToggle.addEventListener(

    "click",

    () => {

        navMenu.classList.toggle(
            "active"
        );

    }

);


document
    .querySelectorAll(
        ".nav-menu a"
    )
    .forEach(

        link => {

            link.addEventListener(

                "click",

                () => {

                    navMenu.classList.remove(
                        "active"
                    );

                }

            );

        }

    );


// ==========================================
// ÉV
// ==========================================

document
    .getElementById(
        "year"
    )
    .textContent =

        new Date()
            .getFullYear();


// ==========================================
// INDÍTÁS
// ==========================================

generateTimeSlots();

updateSummary();