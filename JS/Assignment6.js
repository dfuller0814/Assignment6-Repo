$(document).ready(function(){
/* <><><><><><> Event Handlers <><><><><><>><><><><><><><><><><>><><><><><><><><><><>><><> */

// ----- Show and hide sections selected in the dropdown list ------
    $("#sectionDropdown").change(function(){
	var selectedOption = $("#sectionDropdown option:selected").val();
	
	hideSections();
	
	$("section[optionVal=" + selectedOption + "]").show();
	
	
	
    });
// ----------------------------------------------------------------------




// ------ User Clicks Submit in New Customer Section ------------------------
    $("#submitBtnNewCust").click(function(){
	    var customerId = $("#custIdInput").val().replace(/\s+/g,"");
	    var custName = $("#custNameInput").val();
	    var custCity = $("#custCityInput").val();
	    var serviceName = "CreateCustomer";
	    
	    if (customerId.length < 5 || customerId.length > 5) {
		$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
		$("section[optionVal]:visible > div.messageDiv").each(function(){
		    if ($(this).hasClass("messageDiv_success")) {
			$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		    }
		    else{
			$(this).addClass("messageDiv_error");
		    }
		
		
		    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").html("Input Validation Error: " + "<br/>" + "<br/>" +
											"Customer Id Must be Exactly 5 Digits. Enter a Valid Customer Id and Click <b>Submit</b> again");
		
		    $(this).show("fast");
		});
	    }
	    
	    else{
		//Build request string from user input
		var requestString = '{"CustomerID":"' + customerId + '","CompanyName":"' + custName + '","City":"' + custCity + '"}';
		console.log("String submitted " + requestString);
		//Submit request to server
		sendRequest("POST",true,serviceName,requestString);	
	    }
	    
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
	    
	    if (orderNum == "") {
		$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
		$("section[optionVal]:visible > div.messageDiv").each(function(){
		    if ($(this).hasClass("messageDiv_success")) {
			$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		    }
		    else{
			$(this).addClass("messageDiv_error");
		    }
		
		
		    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").html("Input Validation Error: " + "<br/>" + "<br/>" +
											"Order Number is a Required Field. Please Enter a Valid Order Number and Click <b>Submit</b> again");
		
		    $(this).show("fast");
		
		});
	    }
	    
	    else{
		//Build request string from user input
		var requestString = '{"OrderID":"' + orderNum + '","ShipName":"' + shipName + '","ShipCity":"' + shipCity + '","ShipPostcode":"' + shipPostal +
		'","ShipAddress":"' + shipStreet + '"}';
		console.log("String submitted: " + requestString);
		
		//Submit request to server
		sendRequest("POST",true,serviceName,requestString);
	    }
	    
    });
    


// -----------------------------------------------------------------------------

// ------ User Clicks Submit in Delete Customer Section ------------------------
    $("#submitBtnDelCust").click(function(){
	    var customerId = $("#custIdDelInput").val();
	    var serviceName = "deleteCustomer";
	    
	    //Check if Customer Id is Populated
	    if (customerId == "") {
		$("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
		$("section[optionVal]:visible > div.messageDiv").each(function(){
		    if ($(this).hasClass("messageDiv_success")) {
			$(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		    }
		    else{
			$(this).addClass("messageDiv_error");
		    }
		
		
		    $("section[optionVal]:visible > div.messageDiv > p.resultMessage").html("Input Validation Error: " + "<br/>" + "<br/>" +
											"Customer Id is a Required Field. Please Enter a Valid Customer Id and Click <b>Submit</b> again");
		
		    $(this).show("fast");
		
		});
	    }
	    
	    //Once receiving confirmation from the user, submit the request
	    else{
		//Submit request to server
		var confirmation = window.confirm("Once a Customer is deleted, that customer cannot be recovered. Are you sure you want to delete this customer?");
		if (confirmation == true) {
		    sendRequest("GET",true,serviceName,customerId);
		}
	    }
    });
    


// ------------------------------------------------------------------------------

// ------ User Clicks the Clear Button ------------------------
    //Code for clicking the clear button
    $("button[customName='clear']").click(function(){
	
	//Clear the innerHTML text of all input fields and the error message div
	$("section[optionVal]:visible > table.inputTable > tbody > tr > td > input").each(function(){
	    $(this).val("");
	});
	
	/* Clear Error Message Div */
	//Check if the Error Div is displayed
	$("section[optionVal]:visible > div.messageDiv").filter(":visible").each(function(){
	    $(this).slideToggle("fast");
	});
	    
	
    });
    


// ------------------------------------------------------------------------------



/* <><><<><><><><>><><><><><><><><><><><><><><><><><>><><>><><><><><><><><><><><><><><><>< */
    
    
});




// ************************* Functions to call *************************


// ---------------------- Hide all input sections --------------------------------------------------------------
function hideSections() {
	var allSections = document.querySelectorAll("section[optionVal]");
	$("section[optionVal]:visible > div.messageDiv").each(function(){
		$(this).hide();
	});
	$(allSections).each(function(){
	    $(this).hide();
	});	
}
    
    
    
// --------------------- AJAX Request function ------------------------------------------------------------------
function sendRequest(method,async,serviceName,reqString) {
    console.log("Request method begun");
    var request = new XMLHttpRequest();
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/";
    if (method == "GET") {
	
	//Request String in this case will be the Customer Id
	if (serviceName == "deleteCustomer") {
	    url += serviceName + "/" + reqString;
	    request.open(method,url,async);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.send();
	}
    }
    else if (method == "POST") {
	url += serviceName;
	request.open(method,url,async);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(reqString);
    }
    
    
    //Check Ready State for response
    request.onreadystatechange = function(){
	console.log("Ready State: " + request.readyState);
	console.log("Server Status: " + request.status);
	if (request.readyState == 4 && request.status == 200){
		console.log("Final Server Response: " + request.responseText);
		var reqResult = JSON.parse(request.responseText);
		checkResult(reqResult,serviceName);
	    }
    }
    
}

// -----------------------------------------------------------------------------------------------------------------


// ---------------------------- Function to Check Server Response --------------------------------------------------

function checkResult(jsonResult,serviceName) {
    
    // -------------------------NewCustomer Service Check ----------------------------------------------------
    if (serviceName == "CreateCustomer") {
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
		    $(this).text("New Customer Created Successfully");
		});
		
		//Display message box
		$(this).show("fast");
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
		    $(this).html("Create Operation Failed: " + "<br/>" + "<br/>" + jsonResult.Exception);
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
    // -----------------------------------------------------------------------------------------------------------
    
    
    // -------------------------UpdateShipping Service Check -----------------------------------------------------
    
    else if (serviceName == "updateOrderAddress") {
	if(jsonResult == 1){
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
		    $(this).text("Shipping Address Updated Successfully");
		});
		
		//Display message box
		$(this).show("fast");
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
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "Invalid Data String Sent to the Server");
		});
		
		//Display message box
		$(this).show("fast");
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
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "The Specified Order ID Could Not Be Found");
		});
		
		//Display message box
		$(this).show("fast");
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
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "Unspecified status code of 0 returned from the server");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
    
    //-------------------------------- DeleteCustomer Service Check --------------------------------------------------
    
    if (serviceName == "deleteCustomer") {
	if (jsonResult.DeleteCustomerResult.WasSuccessful == 1) {
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
		    $(this).text("Customer Deleted Successfully");
		});
		
		//Display message box
		$(this).show("fast");
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
		    $(this).html("Delete Failed: " + "<br/>" + "<br/>" + jsonResult.DeleteCustomerResult.Exception);
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
}

// ************************************************************************

