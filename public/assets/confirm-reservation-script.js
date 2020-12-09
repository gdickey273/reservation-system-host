let reservationData = JSON.parse(localStorage.getItem("resData"));
let partyNumber;
const originalTime = moment(reservationData.time, "HHmm");
const desiredTime = moment(reservationData.desiredTime, "HHmm");

const date = reservationData.date;
var formattedDate = date.replace("/", "").replace("/", "");
const originalTableNumber = reservationData.originalTableNumber;
const desiredTableNumber = reservationData.desiredTableNumber;
const  originalInsideOutside = originalTableNumber < 100 ? "insideTables" : "outsideTables";
const  desiredInsideOutside = desiredTableNumber < 100 ? "insideTables" : "outsideTables";
let dayOfWeek = reservationData.dayOfWeek;
let firstName;
let lastName;
let phoneNumber;
let emailAddress;
let notes;
let originalResObj;
let originalResPath;
let isReschedule = localStorage.getItem("isReschedule") === "true";

const cloud = firebase.firestore();

function initializeWithRescheduleInfo() {
  if (isReschedule) {
    partyNumber = reservationData.partyNumber;
    $("#party-number").val(partyNumber);
    firstName = reservationData.firstName;
    $("#first-name").val(firstName);
    lastName = reservationData.lastName
    $("#last-name").val(reservationData.lastName);
    phoneNumber = reservationData.phoneNumber
    $("#phone").val(phoneNumber);
    emailAddress = reservationData.emailAddress
    $("#email").val(emailAddress);
    notes = reservationData.notes;
    $("#notes").val(notes);

    originalResObj = {
      time: parseInt(originalTime.format("HHmm")),
      firstName,
      lastName,
      partyNumber,
      phoneNumber,
      emailAddress,
      tableNumber: originalTableNumber,
      notes
    }
    originalResPath = `scheduleByDate/${formattedDate}/${originalInsideOutside}/${reservationData.originalTableNumber}`;
  
    // cloud.doc(originalResPath).update({
    //   reservations:
    //   firebase.firestore.FieldValue.arrayRemove(originalResObj)}).then(()=>{
    //     console.log("Attempted to delete original res!");
    //   });
  }

}

initializeWithRescheduleInfo();



switch (dayOfWeek) {
  case 0:
    dayOfWeek = "Sunday";
    break;
  case 1:
    dayOfWeek = "Monday";
    break;
  case 2:
    dayOfWeek = "Tuesday";
    break;
  case 3:
    dayOfWeek = "Wednesday";
    break;
  case 4:
    dayOfWeek = "Thursday";
    break;
  case 5:
    dayOfWeek = "Friday";
    break;
  case 6:
    dayOfWeek = "Saturday";
    break;

}

function updatePage() {
  let str = `Creating reservation on ${dayOfWeek}, ${date} at ${desiredTime.format("h:mm A")} at Table ${desiredTableNumber}`;

  $("#header").html(str);


  var path = "scheduleByDate/" + formattedDate + "/" + desiredInsideOutside + "/" + desiredTableNumber;
  var ref = cloud.doc(path); //.doc(formattedDate);
  ref.get().then(function (snapshot) {
    console.log("--------snapshot!-----", snapshot);
    if (snapshot.exists) {
      console.log("-----already exists! No sweat bby------");

    } else {
      console.log("------starting batch------");
      var batch = cloud.batch();

      for (var i = 1; i <= 8; i++) {
        var ref = cloud.collection("scheduleByDate").doc(formattedDate).collection("insideTables").doc("" + i);
        batch.set(ref, { reservations: [] })
      }

      var ref100 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("100");
      batch.set(ref100, { reservations: [] });

      var ref102 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("102");
      batch.set(ref102, { reservations: [] });

      var ref103 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("103");
      batch.set(ref103, {reservations : []});

      var ref105 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("105");
      batch.set(ref105, { reservations: [] });

      var ref106 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("106");
      batch.set(ref106, { reservations: [] });

      batch.commit();
    }
  })

}


function checkInputValidity() {
  let isValid = true;
  let partyNumberInputVal = $("#party-number").val();
  let firstNameInputVal = $("#first-name").val().toUpperCase();
  let lastNameInputVal = $("#last-name").val().toUpperCase();
  let phoneNumberInputVal = $("#phone").val().replace("(", "").replace(")", "").replace("-", "").split(" ").join("");
  let emailAddressInputVal = $("#email").val();
  notes = $("#notes").val();
  console.log(phoneNumberInputVal);
  console.log(phoneNumberInputVal.length);

  let validNameChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let validNumberChars = "0123456789";

  $(".error-message").empty();


  //Checks for empty inputs
  // $("form#reservation-data-form :input").each(function(input){
  //   if($(this).val() === ""){
  //     var id = "#" + $(this).attr("id")+"-error-message";
  //     $(id).html("Field cannot be left blank!");
  //     isValid = false;
  //     console.log("empty input! isValid: " + isValid);
  //   }
  // });

  
  if ($("#party-number").val() === "") {
    $("#party-number-error-message").html("Field cannot be left blank!");
    isValid = false;
  }

  if($("#first-name").val() === "" && $("#last-name").val() === ""){
    if ($("#last-name").val() === "") {
      $("#last-name-error-message").html("Field cannot be left blank!");
      isValid = false;
    }
    if ($("#first-name").val() === "") {
      $("#last-name-error-message").html("Field cannot be left blank!");
      isValid = false;
    }

  }
  

  // for (let char of firstNameInputVal){
  //   if (validNameChars.indexOf(char) === -1){
  //     isValid = false;
  //     $("#first-name-error-message").html('Invalid character. Please use only letters a-z');
  //     break;
  //   }
  // }

  // validNameChars += "-";
  // for (let char of lastNameInputVal){
  //   if (validNameChars.indexOf(char) === -1){
  //     isValid = false;
  //     $("#last-name-error-message").html('Invalid character. Please use only letters a-z (or "-" in case of a hyphonated last name)');
  //     break;
  //   }
  // }

  // for(let char of phoneNumberInputVal){
  //   if (validNumberChars.indexOf(char) === -1){
  //     isValid = false;
  //     $("#phone-error-message").html('Invalid character. Please use only numbers 0-9, "()", and "-" ')
  //     break;
  //   }
  // }


  // switch (phoneNumberInputVal.length){
  //   case 7:
  //     isValid = false;
  //     $("#phone-error-message").html("Please enter your area code as well.");
  //     break;
  //   case 10:
  //     isValid = true;
  //     break;
  //   default:
  //     isValid = false;
  //     $("#phone-error-message").html("Invalid number! Please enter a 10 digit phone number");
  // }


  if (isValid) {
    partyNumber = partyNumberInputVal;
    firstName = firstNameInputVal;
    lastName = lastNameInputVal;
    phoneNumber = phoneNumberInputVal;
    emailAddress = emailAddressInputVal;
  }

  return isValid;

}

async function makeReservation() {
  console.log("----making reservation!----");
  var path = "scheduleByDate/" + formattedDate + "/" + desiredInsideOutside + "/" + desiredTableNumber;
  reservationData = {
    time: parseInt(desiredTime.format("HHmm")),
    firstName,
    lastName,
    partyNumber,
    phoneNumber,
    emailAddress,
    tableNumber: desiredTableNumber,
    notes
  };

  
  
  if (isReschedule) {
    //reservationData.time = parseInt(desiredTime.format("HHmm"))
    let batch = cloud.batch();

    batch.update(cloud.doc(originalResPath), {reservations : firebase.firestore.FieldValue.arrayRemove(originalResObj)});
    batch.update(cloud.doc(path), {reservations : firebase.firestore.FieldValue.arrayUnion(reservationData)});

    await batch.commit()
    .then(() => {
      console.log("success!");
      
        sendConfirmationEmail();
      
      })
    .catch(err => console.log("Failed!", err));

  } else {
    cloud.doc(path).update({
      reservations:
        firebase.firestore.FieldValue.arrayUnion(reservationData)
    }).then(() => sendConfirmationEmail());
  }

  function sendConfirmationEmail(){
    reservationData.dayOfWeek = dayOfWeek;
    reservationData.date = date;
    reservationData.type = isReschedule ? "Reschedule" : "Schedule";
    localStorage.setItem("resData", JSON.stringify(reservationData));
  
    cloud.collection('mail').add({
      to: emailAddress ? emailAddress : "eddyreservationlog@gmail.com",
      bcc: emailAddress ? "eddyreservationlog@gmail.com" : "",
      message: {
        subject: `The Eddy Pub Reservation Confirmation`,
        html:
        `<div>
        <img style="height:150px; width:auto;" src="https://images.squarespace-cdn.com/content/5956a474ccf2106856898d23/1498851213545-UXMZE3RQ4WH4H75K7ED4/Eddy+logo+transparent.png?content-type=image%2Fpng">
        </div>
        
        <div style="color:#000;">
        <h2 style="color:#000;">Thank you for booking a reservation with us at the Eddy Pub!</h2>
        <p style="color:#000;">We've got you down for ${partyNumber} ${partyNumber > 1 ? "people" : "person"} on 
        ${dayOfWeek}, ${reservationData.date} at ${desiredTime.format("h:mm A")} under the name ${firstName} ${lastName}.<br> 
        I acknowledge that by making this reservation:
        <ul>
        <li> I understand my reservation is for an hour and 15 min, and a mask must be worn. </li>
            <li> I have no symptoms related to Covid-19 and will not dine at The Eddy should I develop symptoms</li>
            <li> I have not knowingly been in contact with anyone who has Covid-19 in the last 14 days</li>
            <li> I have not tested positive for Covid-19 in the last 14 days</li>
            <li> The Eddy reserves the right to check my temperature upon entering the establishment should I present with symptoms</li>
            <li> I am knowingly choosing to dine in a restaurant during a Pandemic and where risk of contracting Covid-19 may be present. I hold The Eddy, its staff, owners, and customers harmless in any claims where possibility of contraction is concerned.</li>
        </ul>
        Don't be THAT GUY/GAL and not show up for your reservation. That's just mean - to us, our staff, and other customers. We need everyone's cooperation to make this work. Please let us know if you are unable to make your reservation as soon as possible.

        For OUTSIDE Tables: 

        I understand that I am booking a table outside where the weather is unpredictable and which may cause my reservation to change at no fault of anyone. The Eddy cannot guarantee table availability inside in the case of bad weather, and I may choose to cancel or change my reservation ahead of time to avoid any hardship.<br>
       ${isReschedule ? `(RESCHEDULED from ${originalResObj.time.format("h:mm A")})` : ""}         
        </p>
        </div>`
        
       

      }
    }).then(() => {
      window.location.href = "confirmation.html";
    });
  }
}


$("#submit-btn").on("click", function (event) {
  event.preventDefault();
  if (checkInputValidity()) {
    makeReservation();
  }


});

$("#notes").on("keyup", function (event) {
  console.log("Press!");
  if ($("#notes").val().length === 500) {
    $("#notes-error-message").text("Please keep your notes below 500 characters");
  } else $("#notes-error-message").empty();
})
updatePage();


