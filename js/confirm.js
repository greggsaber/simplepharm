document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // Retrieve stored information
    // ==========================================

    const patient =
        JSON.parse(localStorage.getItem("currentPatient"));


    const refillRequest =
        JSON.parse(localStorage.getItem("refillRequest")) || [];


    const pharmacistNotes =
        localStorage.getItem("pharmacistNotes") || "";



    // Redirect if accessed directly

    if (!patient) {

        window.location.href = "verify.html";

        return;

    }



    // ==========================================
    // Display patient information
    // ==========================================

    document.getElementById("patientSummary").innerHTML =

        "<strong>" +
        patient.name +
        "</strong><br>" +
        patient.ic;



    // ==========================================
    // Generate queue number
    // ==========================================

    const queueNumber =
        "P" + Math.floor(Math.random() * 900 + 100);


    document.getElementById("queueNumber").textContent =
        queueNumber;




    // ==========================================
    // Populate medication table
    // ==========================================


    const tbody =
        document.querySelector("#summaryTable tbody");



    if (refillRequest.length === 0) {


        const row =
            document.createElement("tr");


        row.innerHTML =

            "<td colspan='4'>" +
            "No medications selected." +
            "</td>";


        tbody.appendChild(row);



    } else {


        refillRequest.forEach(function (med) {


            const row =
                document.createElement("tr");



            row.innerHTML =

                "<td>" +
                med.drug +
                "</td>" +


                "<td>" +
                med.strength +
                "</td>" +


                "<td>" +
                med.quantity +
                "</td>" +


                "<td>" +
                med.duration +
                " days</td>";



            tbody.appendChild(row);



        });


    }




    // ==========================================
    // Display pharmacist notes
    // ==========================================


    document.getElementById("notesText").textContent =

        pharmacistNotes === ""
        ? "None"
        : pharmacistNotes;




    // ==========================================
    // QR Placeholder
    // ==========================================


    const qr =
        document.getElementById("qrPlaceholder");



    qr.innerHTML =

        "<h3>" +
        queueNumber +
        "</h3>" +

        "<p>Prototype QR Code</p>";




    // ==========================================
    // Finish button
    // ==========================================


    document
    .getElementById("finishButton")
    .addEventListener("click", function () {


        localStorage.clear();


        window.location.href =
            "index.html";


    });



});