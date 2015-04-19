$(document).ready(function(){
/* <><><><><><> Event Handlers <><><><><><>><><><><><><><><><><>><><><><><><><><><><>><><> */

// ----- Show and hide sections selected in the dropdown list ------
    $("#sectionDropdown").change(function(){
	var selectedOption = $("#sectionDropdown option:selected").val();
	hideSections();
	$("section[optionVal=" + selectedOption + "]").fadeIn();
    });
// ----------------------------------------------------------------------




// ------ User Clicks Submit in New Customer Section ------------------------
    $("#submitBtnNewCust").click(function(){
	    var customerId = $("#custIdInput").val();
	    var custName = $("#custNameInput").val();
	    var custCity = $("#custCityInput").val();
	    var serviceName = "CreateCustomer";
	    //Build request string from user input
	    var requestString = '{"CustomerID":"' + customerId + '","CompanyName":"' + custName + '","City":"' + custCity + '"}';
	    console.log("String submitted " + requestString);
	    //Submit request to server
	    sendRequest("POST",true,serviceName,requestString);
    });
    


// ----------------------------------------------------------------------



// ------ User Clicks Submit in Shipping Info Section ------------------------
    $("#submitBtnShipInfo").click(function(){
	    var orderNum = $("#orderNumInput").val();
	    var shipName = $("#shipNameInput").val();
	    var shipStreet = $("#shipStreetInput").val();
	    var shipCity = document.getElementById("shipCityInput").value;
	    var shipPostal = document.getElementById("shipPostalCode").value;
	    var serviceName = "updateOrderAddress";
	    
	    //Build request string from user input
	    var requestString = '{"OrderID":"' + orderNum + '","ShipName":"' + shipName + '","ShipCity":"' + shipCity + '","ShipPostcode":"' + shipPostal +
	    '","ShipAddress":"' + shipStreet + '"}';
	    console.log("String submitted: " + requestString);
	    
	    //Submit request to server
	    sendRequest("POST",true,serviceName,requestString);
    });
    


// ----------------------------------------------------------------------

/* <><><<><><><><>><><><><><><><><><><><><><><><><><>><><>><><><><><><><><><><><><><><><>< */
    
    
});




// ************************* Functions to call *************************

// Hide all input sections
function hideSections() {
	var allSections = document.querySelectorAll("section[optionVal]");
	$(allSections).each(function(){
	    $(this).hide(); 
	});
    }
    
    
    
// AJAX Request function
function sendRequest(method,async,serviceName,reqString) {
    console.log("Request method begun");
    var request = new XMLHttpRequest();
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/";
    url += serviceName;
    request.open(method,url,async);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(reqString);
    
    //Check Ready State for response
    request.onreadystatechange = function(){
	console.log("Ready State: " + request.readyState);
	console.log("Server Status: " + request.status);
	if (request.readyState == 4 && request.status == 200){
		console.log("Final Server Response: " + request.responseText);
		var reqResult = JSON.parse(request.responseText);
		checkResult(reqResult);
	    }
    }
    
}


function checkResult(jsonResult) {
    
    if (jsonResult.WasSuccessful == 1) {
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/successpic.png");
	
	//Remove the error class from all message boxes and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_error")) {
		$(this).removeClass("messageDiv_error").addClass("messageDiv_success");
	    }
	    else{
		$(this).addClass("messageDiv_success");
	    }
	    
	    //Populate message box with success message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).text("Operation completed successfully");
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	}); 	    
    }
    
    else if(jsonResult == 1){
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/successpic.png");
	
	//Remove the error class from all message boxes and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_error")) {
		$(this).removeClass("messageDiv_error").addClass("messageDiv_success");
	    }
	    else{
		$(this).addClass("messageDiv_success");
	    }
	    
	    //Populate message box with success message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).text("Operation completed successfully");
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	});
    }
    
    else if(jsonResult == -2){
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	
	//Remove the success class from message box and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_success")) {
		$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
	    }
	    else{
		$(this).addClass("messageDiv_error");
	    }
	    
	    //Populate message box with error message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).html("Operation Failed: " + "<br/>" + "<br/>" + "Invalid Data String Sent to the Server");
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	});
    }
    
    else if(jsonResult == -3){
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	
	//Remove the success class from message box and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_success")) {
		$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
	    }
	    else{
		$(this).addClass("messageDiv_error");
	    }
	    
	    //Populate message box with error message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).html("Operation Failed: " + "<br/>" + "<br/>" + "O");
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	});
    }
    
    else if(jsonResult == 0){
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	
	//Remove the success class from message box and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_success")) {
		$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
	    }
	    else{
		$(this).addClass("messageDiv_error");
	    }
	    
	    //Populate message box with error message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).html("Operation Failed: " + "<br/>" + "<br/>" + "Unspecified status code of 0 returned from the server");
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	});
    }
    
    else{
	$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	
	//Remove the success class from message box and add success class
	$("section[optionVal]:visible > div.messageDiv").each(function(){
	    if ($(this).hasClass("messageDiv_success")) {
		$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
	    }
	    else{
		$(this).addClass("messageDiv_error");
	    }
	    
	    //Populate message box with error message
	    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		$(this).html("Operation Failed: " + "<br/>" + "<br/>" + jsonResult.Exception);
	    });
	    
	    //Display message box
	    $(this).fadeIn("fast");
	});
    }
}

// ************************************************************************

