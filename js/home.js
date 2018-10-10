var amount = 0;

$(document).ready(function () {

  loadAllItems();

//this click function adds money using the buttons
  $(".addMoney").click(function(e){
      emptyChange();
      $('#changeButton').show();
      amount=$('#total-money').text();
      if(this.id=="dollarbtn"){
         amount=(parseFloat(amount)+1).toFixed(2);
      }
      if(this.id=="quarterbtn"){
         amount=(parseFloat(amount)+.25).toFixed(2);
      }
      if(this.id=="dimebtn"){
         amount=(parseFloat(amount)+.10).toFixed(2);
      }
      if(this.id=="nickelbtn"){
         amount=(parseFloat(amount)+.05).toFixed(2);
      }
      $('#total-money').empty().append("<h4>" + amount + "</h4>");
  });

//this click function lets you purchase an item using the button
 $('#purchase').click(function(e){
   var itemId = $('#selected').val();
   //var money = $('#total-money').val();
   $.ajax({
     type: 'GET',
     url: 'http://localhost:8080/money/' + amount + '/item/' + itemId,

     success: function(items, text, xhr) {
        clearMessages();
        var quarters = items.quarters;
        var dimes = items.dimes;
        var nickels = items.nickels;
        var pennies = items.pennies;

        var response = $.parseJSON(xhr.responseText);
        var message = response.message;
        displayChange(quarters, dimes, nickels, pennies);
        $('#total-money').empty().append("<h4>0.00</h4>");
        clearMessages();
        $('#goodMessage').show().val("Thank you for purchasing with us.");
        loadAllItems();
     },
     error: function(xhr){
       var response = $.parseJSON(xhr.responseText);
       var message = response.message;
       clearMessages();
       $('#total-money').empty().append("<h4>0.00</h4>");
       $('#badMessage').show().val(message);
     }
   });
 });

//this click function gives you change if you wanted to abandon a transaction
 $('#changeButton').click(function(e){
   var change=$('#total-money').text();
   var quarters = Math.floor(change/.25);
   change = (change - (quarters * .25)).toFixed(2);
   var dimes = Math.floor(change/.10);
   change = (change - (dimes * .10)).toFixed(2);
   var nickels = Math.floor(change/.25);
   change = (change - (nickels * .25)).toFixed(2);
   var pennies = Math.floor(change/.25);
   change = (change - (pennies * .25)).toFixed(2);
   displayChange(quarters, dimes, nickels, pennies);
   $('#total-money').empty().append("<h4>0.00</h4>");
   $('#selected').val("");
   clearMessages();
 });

});

//this function loads all the items
function loadAllItems() {
  clearItems();
  var itemContainer = $('#item-container');

    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/items',
      success: function(itemArray) {
        $.each(itemArray, function(index, item) {
          var id = item.id;
          var name = item.name;
          var price = item.price;
          var quantity = item.quantity;

          itemContainer.append("<div id='" + item.id + "' class='col-md-3 btn btn-warning'" +
          "style='margin-bottom: 50px'>" + item.id + "<br>" + item.name + "<br>Price: "
          + item.price + "<br>Stock: " + item.quantity + "</div>" + "<div class='col-md-1'></div>");

          $('#' + id).click(function(){
                    $('#selected').val(item.id);
                    emptyChange();
                })
        });


      },
      error: function() {
        $('#errorMessages')
          .append($('<li>')
          .attr({class: 'list-group-item list-group-item-danger'})
          .text('Error calling web service. Please try again later.'))
      }
    });

};

//this function emptys the item container so
//you can repopulate it
function clearItems() {
  $('#item-container').empty();
}

//this clears your good and bad messages
function clearMessages() {
  $('#goodMessage').empty().hide();
  $('#badMessage').empty().hide();
}

//this displays your change
function displayChange(quarters, dimes, nickels, pennies){

  if (quarters > 0){
    $('#quarter').show();
    $('#quarterNum').empty().append('<h4>' + quarters + '</h4>');
  }
  if (dimes > 0){
    $('#dime').show();
    $('#dimeNum').empty().append('<h4>' + dimes + '</h4>');
  }
  if (nickels > 0){
    $('#nickel').show();
    $('#nickelNum').empty().append('<h4>' + nickels + '</h4>');
  }
  if (pennies > 0){
    $('#penny').show();
    $('#pennyNum').empty().append('<h4>' + pennies + '</h4>');
  }
}

//this empties the change area
//so you 
function emptyChange() {
  $('#quarterNum').empty();
  $('#quarter').hide();
  $('#dimeNum').empty();
  $('#dime').hide();
  $('#nickelNum').empty();
  $('#nickel').hide();
  $('#pennyNum').empty();
  $('#penny').hide();
}
