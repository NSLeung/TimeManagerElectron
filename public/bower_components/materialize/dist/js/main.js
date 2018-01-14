//opening cardmodal using trigger
$(document).ready(function(){
   // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
   $('.modal').modal();
   //$('.modal-trigger').leanModal();
   //$('#trackModal').modal('open');
  $(".button-collapse").sideNav();
  //console.log("TEST");
  //$('.timepicker').pickatime();
  //$('.timepicker').timepicker();
  //$('.timepicker').open();
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
  $('select').material_select();

  //Progressbar ANIMATION
  var calCount= Number(document.querySelector(".calCountTag").textContent);
  var calGoal= Number(document.querySelector(".calGoalTag").textContent);
  var foodNameSpan = document.querySelector(".foodNameSpan").textContent;
  var bar = new ProgressBar.Line(progress, {
  strokeWidth: 30,
  easing: 'easeInOut',
  duration: 1400,
  color: '#FFEA82',
  trailColor: '#eee',
  trailWidth: 30,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#999',
      position: 'absolute',
      right: '0',
      top: '30px',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
    bar.path.setAttribute('stroke', state.color);
  }
 });

 bar.animate(calCount/calGoal);  // Number from 0.0 to 1.0
 //delete FoodItem
 var bob = $('.delete-foodItem')[1];
 $(bob).on('click',function(e){
    //$target = $(e.target);
    //log id of article being deleted
    const id = $(bob).attr('data-id');
    //console.log(id);

    $.ajax({
      type:'DELETE',
      url: '/diet/'+id,
      success: function(){
        //send alert/prompt to ask user to confirm
        //alert('Deleting food');
        //Materialize toast is too short
        //Materialize.toast('Removed '+foodNameSpan+'!', 3000);
        // swal({
        //   title: "Good job!",
        //   text: "You clicked the button!",
        //   icon: "success",
        //   button: "Aww yiss!",
        // });
        //redirect user to diet page
        window.location.href='/diet';

      },
      error: function(err){
        console.log(err);
      }
    });

  });//end delete function
  //get current date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd;
  }
  if(mm<10) {
      mm = '0'+mm;
  }
  today = mm + '/' + dd + '/' + yyyy;
  //var logDateInput = $('#logDateInput');
  //logDateInput.value = today;
  console.log(today);

});//end document ready


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
