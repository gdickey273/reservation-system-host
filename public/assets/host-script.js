let test;
let button;
let hostDateTracker;
let currentDropdown;
let isReschedule = false;//localStorage.getItem("isReschedule") == "true";
let rescheduleRes;
let deleteRes;


async function initializeSchedule() {
  await initializeTables();
  let isReservation = false;
  let isAvailable = false;
  // let resButtonDropdown = `<div class= "dropdown-content">
  // <button class="reschedule-button">Reschedule</button>
  // <button class="delete-button">Delete Reservation</button>
  // </div>
  //  `;
  // let availableButtonDropdown = `<div class= "dropdown-content">
  // <button class="schedule-reservation-button">Schedule Reservation</button>
  // </div>
  //  `;


  function buildDivHTML(btnText, res) {
    const resButtonDropdown = $("<div>").addClass("dropdown-content");
    resButtonDropdown.append($("<button>").addClass("reschedule-button dropdown-button").text("Reschedule"));
    resButtonDropdown.append($("<button>").addClass("delete-button dropdown-button").text("Delete Reservation"));
    resButtonDropdown.append($("<button>").addClass("details-button dropdown-button").text("View Details"));

    const availableButtonDropdown = $("<div>").addClass("dropdown-content");
    availableButtonDropdown.append($("<button>").addClass("schedule-reservation-button dropdown-button").text("Schedule Reservation"));

    console.log("-------------isReservation----------", isReservation);

    let parentDiv = $("<div>").addClass("dropdown");
    let buttonClass = `schedule-button ${isReservation ? "res-button" : isAvailable ? "available-button" : "unavailable-button"}`;
    let buttonChild = $("<button>").addClass(buttonClass);
    let pChild = $("<p>").text(btnText).addClass("res-button-text");
    buttonChild.append(pChild);
    if (res) {
      console.log("its a reservation! Should be appending data res and resButtonDropdown", resButtonDropdown);
      buttonChild.data("res", res);
      parentDiv.append(resButtonDropdown);
    } else {
      parentDiv.append(availableButtonDropdown);
    }

    parentDiv.append(buttonChild);

    return parentDiv;
    // let html = `<div class=dropdown>
    // <button class="schedule-button ${isReservation ? "res-button" : isAvailable ? "available-button" : "unavailable-button"}" ${res ? "data-res = " + JSON.stringify(res) : ""}>${btnText}</button>
    // ${isReservation ? resButtonDropdown : isAvailable ? availableButtonDropdown : ""}
    // </div>`;
    //return html;

  };

  console.log("initializing schedule!");

  initializeTableCol = function initializeTableCol(table) {
    let timeIterator = moment(earliestResTime, "HHmm");
    let tableClass = `.table-${table.tableNumber}`;
    if (table.reservations.length === 0) {
      console.log(`Table ${table.tableNumber} has no reservations!`);
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

        // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        // button.addClass("schedule-button");
        $(rowClass).find(tableClass).empty().append(buildDivHTML());//.html(buildDivHTML());


        timeIterator.add(15, "m");
      }
    }

    for (let [i, res] of table.reservations.entries()) {
      while (timeIterator.isBefore(res.time)) {
        isReservation = false;
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        // let button = $("<button>").addClass("schedule-button");
        if (res.time.diff(timeIterator, "m") < 90) {
          // button.addClass("unavailable-button");
          isAvailable = false;
        } else if (resCount[timeIterator.format("HHmm")] >= 3) {
          //button.addClass("unavailable-button");
          isAvailable = false;
        } else isAvailable = true; //button.addClass("available-button");

        $(rowClass).find(tableClass).empty().append(buildDivHTML());//.html(buildDivHTML());
        timeIterator.add(15, "m");
      }

      // console.log("-----------------time iterator: ", timeIterator.format("HHmm") + " res.time: " + res.time.format("HHmm"));
      if (timeIterator.isSame(res.time)) {
        console.log("``````````````````````tableclass!", tableClass);

        //let button = $("<button>").addClass("schedule-button res-button");
        isReservation = true;

        res.time = res.time.format("HHmm");

        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML((res.firstName ? res.firstName : ""), res));//.html(buildDivHTML((res.firstName ? res.firstName : ""), res));
        timeIterator.add(15, "m");

        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML(res.lastName, res));//.html(buildDivHTML(res.lastName, res));
        timeIterator.add(15, "m");

        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML(`#ppl ${res.partyNumber}`, res));//.html(buildDivHTML(`#ppl: ${res.partyNumber}`, res));
        timeIterator.add(15, "m");

        console.log("Phone number!", res.phoneNumber);
        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML(res.phoneNumber, res));//.html(buildDivHTML(res.phoneNumber, res));
        timeIterator.add(15, "m");

        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML(`${res.notes.length > 0 ? "*Notes*" : ""}`, res));//.html(buildDivHTML("", res));
        timeIterator.add(15, "m");

        isReservation = false;
        isAvailable = false;

        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).empty().append(buildDivHTML(""));//.empty().html(buildDivHTML(""));
        timeIterator.add(15, "m");

        res.time = moment(res.time, "HHmm");

      }
      console.log("--------------i=", i);
      console.log("table.reservations.length", table.reservations.length);
      if (i === table.reservations.length - 1) {
        isReservation = false;
        while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
          console.log("***************in while loop after reservations");
          let rowClass = `.row-${timeIterator.format("HHmm")}`;
          isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

          // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
          // button.addClass("schedule-button");
          $(rowClass).find(tableClass).empty().append(buildDivHTML());//.html(buildDivHTML);


          timeIterator.add(15, "m");
        }
      }

    }
  }

  for (let table of insideTables) {
    initializeTableCol(table);

  }


  for (let table of outsideTables) {
    console.log("Looking at outside tables!");
    initializeTableCol(table);
  }




  listen();
}

function listen() {
  console.log("Listening!");
  $(".reschedule-button").click(function (event) {

    if (localStorage.getItem("isReschedule") === "false") {
      console.log("isResch false");
      //set isReschedule tracker
      isReschedule = true;
      localStorage.setItem("isReschedule", "true");

      //get res data from button's data-res attr
      let res = $(this).parent().siblings().data("res");
      console.log("------------res------------", res);
      //res.time = moment(res.time, "HHmm");
      res.date = selectedDate.format("MM/DD/YYYY");

      //set Reschedule Header
      let html = `Rescheduling ${res.firstName ? res.firstName : ""} ${res.lastName}'s Reservation
    <button class="cancel-reschedule-button">Cancel</button>`;
      $("#reschedule-header").html(html);
      $("#reschedule-div").css("display", "block");

      let isInside = parseInt(res.tableNumber) < 100;
      let tableObj;
      if (isInside) {
        tableObj = insideTables[insideTables.findIndex(x => x.tableNumber === res.tableNumber)];
      } else {
        tableObj = outsideTables[outsideTables.findIndex(x => x.tableNumber === res.tableNumber)];
      }
      console.log("res.time", res.time);
      console.log(tableObj.reservations.findIndex(x => x.time.format("HHmm") === res.time.format("HHmm")));
      console.log(tableObj.reservations[tableObj.reservations.findIndex(x => x.time.format("HHmm") === res.time.format("HHmm"))]);
      rescheduleRes = tableObj.reservations.splice(tableObj.reservations.findIndex(x => x.time.format("HHmm") === res.time.format("HHmm")), 1);

      resCount[res.time.format("HHmm")]--;
      //update schedule with target res removed
      console.log("tableObj--------------------", tableObj);
      //initializeTableCol(tableObj);
      for (let table of insideTables) {
        initializeTableCol(table);

      }

      for (let table of outsideTables) {
        console.log("Looking at outside tables!");
        initializeTableCol(table);
      }
      listen();
    }


  })

  $(".delete-button").click(function (event) {
    deleteRes = $(this).parent().siblings().data("res");
    $("#delete-pop-up").css("display", "block");
    $("#delete-res-text").text(`Table ${deleteRes.tableNumber} at ${deleteRes.time.format("h:mm A")}
    ${deleteRes.firstName} ${deleteRes.lastName} party of ${deleteRes.partyNumber}`)
  })

  $("#confirm-delete").click(function (event) {
    deleteRes.time = parseInt(deleteRes.time.format("HHmm"));
    let insideOutside = deleteRes.tableNumber < 100 ? "insideTables" : "outsideTables";
    let path = `scheduleByDate/${selectedDate.format("MMDDYYYY")}/${insideOutside}/${deleteRes.tableNumber}`
    cloud.doc(path).update({
      reservations:
        firebase.firestore.FieldValue.arrayRemove(deleteRes)
    })
    .then(() => {
      cloud.collection('mail').add({
        to: "eddyreservationlog@gmail.com",
        message: {
          subject: `DELETED RESERVATION ${deleteRes.lastName} ${reservationData.date}`,
          html: `<h2> RESERVATION DELETED! ${deleteRes.partyNumber} ${deleteRes.partyNumber > 1 ? "people" : "person"} on 
          ${deleteRes.dayOfWeek}, ${selectedDate.format("MM/DD/YYYY")} at ${deleteRes.time.format("h:mm A")} under the name ${deleteRes.firstName} ${deleteRes.lastName}. 
          </h2>`
        }
      })
      .then(() => {

        deleteRes.type = "delete";
        deleteRes.date = selectedDate.format("MM/DD/YYYY");
        localStorage.setItem("resData", JSON.stringify(deleteRes));
        window.location.href = "confirmation.html";
      })
    })
  });

  function buildReservation(jQueryEl) {
    if (isReschedule) {
      rescheduleRes[0].time = rescheduleRes[0].time.format("HHmm");
      rescheduleRes[0].desiredTime = jQueryEl.parent().parent().parent().parent().attr("class").split("-")[1].split(" ")[0];
      rescheduleRes[0].date = selectedDate.format("MM/DD/YYYY");
      rescheduleRes[0].dayOfWeek = dayOfWeek;
      rescheduleRes[0].desiredTableNumber = jQueryEl.parent().parent().parent().attr("class").split("-")[1];
      rescheduleRes[0].originalTableNumber = rescheduleRes[0].tableNumber;
      scheduleReservation(rescheduleRes[0]);
    } else {
      let desiredTableNumber = jQueryEl.parent().parent().parent().attr("class").split("-")[1];
      let desiredTime = jQueryEl.parent().parent().parent().parent().attr("class").split("-")[1].split(" ")[0];
      let res = { date: selectedDate.format("MM/DD/YYYY"), desiredTime, desiredTableNumber, dayOfWeek };
      scheduleReservation(res);
    }
  }
  $(".schedule-reservation-button").click(function (event) {
    event.stopPropagation();
    let el = $(this);

    if ($(this).parent().siblings(".unavailable-button").length) {
      console.log("get that modal bby");
      $("#confirm-schedule").modal("show");
      $("#confirm-button").click(function () {
        console.log("lcick");
        buildReservation(el);
      })
    } else buildReservation($(this));

  });


  $(".cancel-reschedule-button").click(function (event) {
    location.reload();
  })

  $(".details-button").click(function (event) {
    let res = $(this).parent().siblings().data("res");
    $("#res-details-text").html(`<ul> <li>Table: ${res.tableNumber} </li>
    <li>Time: ${res.time.format("h:mm A")} </li>
    <li>Name: ${res.firstName} ${res.lastName}</li> 
    <li>Party Number: ${res.partyNumber}</li>
    <li>Phone Number: ${res.phoneNumber}</li>
    <li>Email: ${res.emailAddress}</li>
    <li>Notes: ${res.notes}</li> </ul>`);
    $("#details-pop-up").css("display", "block");
  })

  $(".dropdown").click(function (event) {
    console.log($(this).offset())
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log($(this));

    if ($(this).hasClass("schedule-reservation-button")) {
      console.log("SCHEDULE RES!")
    }
    if (currentDropdown) {
      currentDropdown.css("display", "none");
    }


    if ($(window).width() - $(this).offset().left - $(this).width() < 100) {
      console.log('nope!');
      $('.dropdown-button').css('left', "").css('right', $(this).width());
    } else {
      $('.dropdown-button').css('right', "").css('left', $(this).width());
    }

    currentDropdown = $(this).find(".dropdown-content");
    currentDropdown.css("display", "block");

    //If its an available or res button, add dropdown
    if ($(this).hasClass("available-button")) {
      console.log($(this));
    } else if ($(this).hasClass("res-button")) {
      console.log("wanna edit or delete this res?");
    }
  });

}


$("#date").change(function () {

  if (hostDateTracker === $(this).val()) {
    return;
  }
  hostDateTracker = $(this).val();

  localStorage.setItem("hostDate", $(this).val());

  console.log(hostDateTracker);
  // resCount[1600] = 3;
  // resCount[1800] = 3;

  buildScheduleGrid();
  initializeSchedule();
  // window.setTimeout(function () {

  // }, 1000)


})





function buildScheduleGrid() {
  $("#time-rows").empty();
  console.log("building schedule grid!");
  $("#schedule-table").html(`<tr id="header-row">
  <th></th>
  <th class="table-1"> Table-1<span class='table-capacity'>(2)</span></th>
  <th class="table-2"> Table-2<span class='table-capacity'>(2)</span></th>
  <th class="table-3"> Table-3<span class='table-capacity'>(4)</span></th>
  <th class="table-4"> Table-4<span class='table-capacity'>(4)</span></th>
  <th class="table-5"> Table-5<span class='table-capacity'>(6)</span></th>
  <th class="table-6"> Table-6<span class='table-capacity'>(4)</span></th>
  <th class="table-7"> Table-7<span class='table-capacity'>(4)</span></th>
  <th class="table-8"> Table-8<span class='table-capacity'>(6)</span></th>
  <th class="table-100"> Table-100<span class='table-capacity'>(4)</span></th>
  <th class="table-102"> Table-102<span class='table-capacity'>(4)</span></th>
  <th class="table-103"> Table-103<span class='table-capacity'>(4)</span></th>
  <th class="table-105"> Table-105<span class='table-capacity'>(4)</span></th>
  <th class="table-106"> Table-106<span class='table-capacity'>(6)</span></th>
</tr>`);
  let timeIterator = moment(earliestResTime, "HHmm");
  while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
    console.log("----------in the while loop!--------");
    let timeRowHTML = `
      <th>${timeIterator.format("h:mm")}</th>
      <td class="table-1"></td>
      <td class="table-2"></td>
      <td class="table-3"></td>
      <td class="table-4"></td>
      <td class="table-5"></td>
      <td class="table-6"></td>
      <td class="table-7"></td>
      <td class="table-8"></td>
      <td class="table-100"></td>
      <td class="table-102"></td>
      <td class="table-103"></td>
      <td class="table-105"></td>
      <td class="table-106"></td>`

    let timeRow = $("<tr>").addClass(`row-${timeIterator.format("HHmm")} time-row`)
    timeRow.html(timeRowHTML);
    $("#schedule-table").append(timeRow);
    timeIterator.add(15, "m");
  }



}



function scheduleReservation(res) {
  console.log("Scheduling Reservation!");
  console.log(res);
  localStorage.setItem("resData", JSON.stringify(res));
  window.location.href = "confirmreservation.html";
}



$(window).click(function (event) {
  if (currentDropdown) {
    currentDropdown.css("display", "none");
    currentDropdown = undefined;
  }
});

// $("#escape-delete").click(function(event){
//   $("#delete-pop-up").css("display", "none");
// })

$(".escape").click(function (event) {
  $(".pop-up").css("display", "none");
})

$("#date").val(localStorage.getItem("hostDate"));

if ($("#date").val() != "") {
  selectedDate = moment($("#date").val().replace(/\//g, ""), "L");
  dayOfWeek = selectedDate.day();
  updateOperatingHours();
  initializeResCount();
  //initializeTables();
  buildScheduleGrid();
  initializeSchedule();

}

localStorage.setItem("isReschedule", "false");
