const patient = JSON.parse(localStorage.getItem("patient"));

const order = JSON.parse(localStorage.getItem("order"));

const notes = localStorage.getItem("notes");

if(!patient || !order){

    window.location.href="index.html";

}

const queue =
"P" +
Math.floor(
100 + Math.random()*900
);

document.getElementById("queueNumber").innerHTML = queue;

const summary=document.getElementById("summary");

order.forEach(item=>{

    summary.innerHTML +=

    `

<div class="summaryCard">

<h3>${item.medication}</h3>

<p>

Strength: ${item.strength}

</p>

<p>

Quantity Requested:
<strong>${item.quantity} tablets</strong>

</p>

</div>

`;

});

document.getElementById("patientNotes").innerHTML=

notes ? notes : "No notes entered.";

document.getElementById("finishButton").addEventListener("click",()=>{

localStorage.clear();

window.location.href="index.html";

});