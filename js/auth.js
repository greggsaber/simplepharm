document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", verifyPatient);

});

function verifyPatient(){

    const ic=document.getElementById("ic").value.trim().toUpperCase();

    const dob=document.getElementById("dob").value;

    const error=document.getElementById("errorMessage");

    error.innerHTML="";

    if(ic===""){

        error.innerHTML="Please enter your NRIC / FIN.";

        return;

    }

    if(dob===""){

        error.innerHTML="Please enter your Date of Birth.";

        return;

    }

    const patient=patientDatabase.find(p=>

        p.ic===ic &&

        p.dob===dob

    );

    if(patient){

        localStorage.setItem(

            "currentPatient",

            JSON.stringify(patient)

        );

        window.location.href="medications.html";

    }

    else{

        error.innerHTML=

        "Patient could not be verified. Please check your NRIC / FIN and Date of Birth.";

    }

}