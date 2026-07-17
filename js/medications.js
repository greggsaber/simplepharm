// =====================================================
// PharmaFlow
// Medication Selection
// Part 1 - Build Page
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // Retrieve patient
    // ============================

    const patient =
        JSON.parse(localStorage.getItem("currentPatient"));

    if (!patient) {

        window.location.href = "verify.html";
        return;

    }

    // ============================
    // Welcome Message
    // ============================

    document.getElementById("patientName").textContent =
        "Welcome, " + patient.name;

    const medicationList =
        document.getElementById("medicationList");

    medicationList.innerHTML = "";

    // ============================
    // Summary variables
    // ============================

    let totalMedications = 0;

    // ============================
    // Build cards
    // ============================

    patient.medications.forEach(function (med, index) {

        const remainingDays =
            Math.floor(med.remaining / med.tabletsPerDay);

        const card =
            document.createElement("div");

        card.className = "medication-card";

        card.innerHTML = `

<div class="medication-header">

    <div>

        <div class="medication-name">

            💊 ${med.drug}

        </div>

        <div style="margin-top:8px;">

            ${med.strength}

        </div>

    </div>

    <div class="remaining">

        Remaining

        <br>

        <strong>

        ${med.remaining} tablets

        </strong>

        tablets

        <br>

        (~${remainingDays} days)

    </div>

</div>

<div class="medication-info">

<div class="info-box">

<div class="info-title">

Dose

</div>

<div class="info-value">

${med.dose}

</div>

</div>

<div class="info-box">

<div class="info-title">

Frequency

</div>

<div class="info-value">

${med.frequency}

</div>

</div>

<div class="info-box">

<div class="info-title">

Tablets / Day

</div>

<div class="info-value">

${med.tabletsPerDay}

</div>

</div>

<div class="info-box">

<div class="info-title">

Request Method

</div>

<div class="info-value">

Choose Below

</div>

</div>

</div>

<div class="request-section">

<div class="request-title">

How would you like to request this medication?

</div>

<div class="radio-row">

<input
type="radio"
name="mode${index}"
id="qtyMode${index}"
checked>

<label for="qtyMode${index}">

Quantity

</label>

</div>

<div class="radio-row">

<input
type="radio"
name="mode${index}"
id="durationMode${index}">

<label for="durationMode${index}">

Duration

</label>

</div>

<div class="input-grid">

<div
class="input-card"
id="qtyCard${index}">

<label>

Quantity Requested

</label>

<input
type="number"
id="qty${index}"
min="0"
max="${med.remaining}"
placeholder="e.g. 180">

</div>

<div
class="input-card disabled"
id="daysCard${index}">

<label>

Days

</label>

<input
type="number"
id="days${index}"
disabled
placeholder="e.g. 90">

</div>

<div
class="input-card disabled"
id="monthsCard${index}">

<label>

Months

</label>

<input
type="number"
id="months${index}"
disabled
placeholder="e.g. 3">

</div>

</div>

<div
class="estimate"
id="estimate${index}">

No medication selected.

</div>

</div>

`;

        medicationList.appendChild(card);

    });

    // ============================
    // Update Sticky Summary
    // ============================

  function updateSummary() {

    totalMedications = 0;


    patient.medications.forEach(function (med, index) {

        const qty =
            Number(
                document.getElementById("qty" + index).value
            );


        if (qty > 0) {

            totalMedications++;

        }

    });


    document.getElementById("selectedCount").textContent =
        totalMedications;

    }

    // =====================================================
// Part 2 - Input Mode Control
// Quantity vs Duration Switching
// =====================================================

    patient.medications.forEach(function (med, index) {


        const qtyMode =
            document.getElementById("qtyMode" + index);

        const durationMode =
            document.getElementById("durationMode" + index);


        const qtyCard =
            document.getElementById("qtyCard" + index);

        const daysCard =
            document.getElementById("daysCard" + index);

        const monthsCard =
            document.getElementById("monthsCard" + index);


        const qtyInput =
            document.getElementById("qty" + index);

        const daysInput =
            document.getElementById("days" + index);

        const monthsInput =
            document.getElementById("months" + index);


        const estimate =
            document.getElementById("estimate" + index);



        // ==========================================
        // Switch to Quantity Mode
        // ==========================================

        function enableQuantityMode() {


            qtyCard.classList.remove("disabled");


            daysCard.classList.add("disabled");

            monthsCard.classList.add("disabled");


            qtyInput.disabled = false;


            daysInput.disabled = true;

            monthsInput.disabled = true;



            daysInput.value = "";

            monthsInput.value = "";



            estimate.textContent =
                "Enter quantity to collect.";


        }



        // ==========================================
        // Switch to Duration Mode
        // ==========================================

        function enableDurationMode() {


            qtyCard.classList.add("disabled");


            daysCard.classList.remove("disabled");

            monthsCard.classList.remove("disabled");



            qtyInput.disabled = true;


            daysInput.disabled = false;

            monthsInput.disabled = false;



            qtyInput.value = "";



            estimate.textContent =
                "Enter days or months.";


        }



        // ==========================================
        // Radio Button Events
        // ==========================================


        qtyMode.addEventListener(
            "change",
            function () {

                enableQuantityMode();

            }
        );


        durationMode.addEventListener(
            "change",
            function () {

                enableDurationMode();

            }
        );



        // ==========================================
        // Default State
        // ==========================================

        enableQuantityMode();



    });

    // =====================================================
// Part 3 - Medication Calculation Engine
// =====================================================

    patient.medications.forEach(function (med, index) {


        const qtyInput =
            document.getElementById("qty" + index);

        const daysInput =
            document.getElementById("days" + index);

        const monthsInput =
            document.getElementById("months" + index);


        const estimate =
            document.getElementById("estimate" + index);



        // Prevent calculation loops

        let updating = false;



        // ==========================================
        // Display Estimate
        // ==========================================

        function updateEstimate(quantity, durationText) {


            if (quantity <= 0) {

                estimate.textContent =
                    "No medication selected.";

                return;

            }


            estimate.innerHTML =

                "<strong>" +
                quantity +
                " tablets</strong> requested" +

                "<br>" +

                "Estimated supply: " +
                durationText;


        }




        // ==========================================
        // Quantity Input
        // ==========================================

        qtyInput.addEventListener(
            "input",
            function () {


                if (updating) return;


                let quantity =
                    Number(qtyInput.value);



                if (quantity > med.remaining) {


                    alert(
                        "Requested quantity exceeds remaining prescription."
                    );


                    quantity =
                        med.remaining;


                    qtyInput.value =
                        quantity;


                }



                if (quantity > 0) {


                    const days =

                        Math.floor(
                            quantity / med.tabletsPerDay
                        );



                    updateEstimate(

                        quantity,

                        days + " days"

                    );


                }

                else {


                    estimate.textContent =
                        "No medication selected.";


                }



                updateSummary();


            }
        );






        // ==========================================
        // Days Input
        // ==========================================

        daysInput.addEventListener(
            "input",
            function () {


                if (updating) return;


                updating = true;



                const days =
                    Number(daysInput.value);



                if (days <= 0) {


                    qtyInput.value = "";

                    monthsInput.value = "";


                    estimate.textContent =
                        "No medication selected.";


                    updating = false;

                    updateSummary();

                    return;


                }



                const months =

                    (days / 30).toFixed(1);



                monthsInput.value =
                    months;



                const quantity =

                    Math.round(
                        days * med.tabletsPerDay
                    );



                if (quantity > med.remaining) {


                    alert(
                        "Requested duration exceeds remaining prescription."
                    );


                    qtyInput.value = "";

                    estimate.innerHTML =

                        "Maximum available: " +

                        med.remaining +

                        " tablets";


                    updating = false;

                    return;


                }



                qtyInput.value =
                    quantity;



                updateEstimate(

                    quantity,

                    days + " days"

                );



                updating = false;


                updateSummary();


            }
        );







        // ==========================================
        // Months Input
        // ==========================================

        monthsInput.addEventListener(
            "input",
            function () {


                if (updating) return;


                updating = true;



                const months =
                    Number(monthsInput.value);



                if (months <= 0) {


                    daysInput.value = "";

                    qtyInput.value = "";


                    estimate.textContent =
                        "No medication selected.";


                    updating = false;

                    updateSummary();

                    return;


                }




                const days =

                    Math.round(
                        months * 30
                    );



                daysInput.value =
                    days;



                const quantity =

                    Math.round(
                        days * med.tabletsPerDay
                    );



                if (quantity > med.remaining) {


                    alert(
                        "Requested duration exceeds remaining prescription."
                    );


                    qtyInput.value = "";


                    estimate.innerHTML =

                        "Maximum available: " +

                        med.remaining +

                        " tablets";



                    updating = false;

                    return;


                }




                qtyInput.value =
                    quantity;



                updateEstimate(

                    quantity,

                    months + " months"

                );



                updating = false;


                updateSummary();


            }
        );



    });

    // =====================================================
// Part 4 - Submit Refill Request
// =====================================================


    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            function () {


                const refillRequest = [];



                patient.medications.forEach(function (med, index) {


                    const quantity =

                        Number(
                            document.getElementById(
                                "qty" + index
                            ).value
                        );



                    if (quantity > 0) {


                        refillRequest.push({

                            drug:
                                med.drug,


                            strength:
                                med.strength,


                            dose:
                                med.dose,


                            frequency:
                                med.frequency,


                            quantity:
                                quantity,


                            duration:

                                Math.floor(
                                    quantity / med.tabletsPerDay
                                )


                        });


                    }


                });




                // No medication selected

                if (refillRequest.length === 0) {


                    alert(
                        "Please select at least one medication before continuing."
                    );


                    return;


                }




                // Save refill request


                localStorage.setItem(

                    "refillRequest",

                    JSON.stringify(refillRequest)

                );




                // Save notes


                const notes =

                    document.getElementById(
                        "pharmacistNotes"
                    ).value;



                localStorage.setItem(

                    "pharmacistNotes",

                    notes

                );




                // Continue to confirmation


                window.location.href =
                    "confirm.html";



            }
        );



});