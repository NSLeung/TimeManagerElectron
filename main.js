//dropdown select
$(document).ready(function() {
  $('select').material_select();
});
//selecting time
$('.timepicker').pickatime({
  default: 'now', // Set default time: 'now', '1:30AM', '16:30'
  fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
  twelvehour: true, // Use AM/PM or 24-hour format
  donetext: 'OK', // text for done-button
  cleartext: 'Clear', // text for clear-button
  canceltext: 'Cancel', // Text for cancel-button
  autoclose: false, // automatic close timepicker
  ampmclickable: true, // make AM PM clickable
  aftershow: function(){} //Function for after opening timepicker
});

//opening cardmodal using trigger
$(document).ready(function(){
   // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
   $('.modal').modal();
 });


//getting value from switch
var reminderBool = document.getElementById('reminderSwitch');

var reminderElement = document.getElementById('reminderTime');

//when to display reminder in cardLabel
//ensure that reminder starts off hidden
$(reminderElement).toggle(reminderBool.checked);

//add listener to lever to grab boolean value whenever clicked
 reminderBool.addEventListener("click", update);
 function update(){
   //console.log(reminderBool.checked);
   $(reminderElement).slideToggle(reminderBool.checked);
 }
