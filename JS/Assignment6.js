$(document).ready(function(){

    // Section 1 dropdown event handler
    $("#sectionDropdown").change(function(){
        var optionName = $("#sectionDropdown option:selected").attr("name");
        // Get id of select option dynamically and show the appropriate section
        if (optionName != null) {
            var col1;
            var col2;
            var col3;
            var columnNames;
            var section;
            var serviceName;
            if (optionName == "customerList") {
                col1 = "Customer Name";
                col2 = "Customer Id";
                col3 = "Customer City";
                columnNames = [col1,col2,col3];
                section = "customerList";
                serviceName = "getAllCustomers";
                createTable(columnNames,section);
                $.when(sendRequest("GET",null,serviceName,true,populateCustList,columnNames)).done(function(){
                    $("#orderHistorySection").hide();
                    $("#customerDetailSection").hide();
                    $("#customerListSection").fadeIn(500); 
                });
            }
            else if (optionName == "orderHistory") {
                    $("#orderHistorySection").fadeIn(500);
                    $("#customerListSection").hide();
                    $("#customerDetailSection").hide();
            }
            else if (optionName == "customerDetail") {
                    $("#orderHistorySection").hide();
                    $("#customerListSection").hide();
                    $("#customerDetailSection").fadeIn(500);
            }
            else if (optionName == "none"){
                $("#orderHistorySection").hide();
                $("#customerListSection").hide();
                $("#customerDetailSection").hide();
                var tblCheck = document.getElementById("customerTable");
                if (tblCheck != null) {
                    console.log("table exists on none");
                    console.log("killing the table");
                    document.getElementById("customerTable").parentNode.removeChild(tblCheck);
                    if ($("#customerDetailTableWrap").css("display") == "none"){
                        $("#customerDetailTableWrap").show();
                    }
                    else if ($("#inputTableWrap").css("display") == "none") {
                        $("#inputTableWrap").show();
                    }
                }
            }
        }
    });
            
        //Section 2 Submit event handler
        $("#submitBtn").click(function(){
            var col1 = "Product Name";
            var col2 = "Quantity Ordered";
            var columns = [col1,col2];
            var section = "orderHistory";
            var custId = $("#customerIdInput").val();
            var serviceName = "getCustomerOrderHistory";
            var params = {columnNames:columns,customerId:custId};
            createTable(columns,section);
                $.when(sendRequest("GET",custId,serviceName,true,getOrderHistory,params)).done(function(){
                    $("#inputTableWrap").hide();
                    $("#orderHistoryTableWrap").show();
                });
        });
        
        //Section 3 Submit event handler
        $("#submitBtnOpen").click(function(){
            var col1 = "Order Date";
            var col2 = "Order ID";
            var col3 = "Shipping Address";
            var col4 = "Shipping City";
            var col5 = "Shipping Name";
            var col6 = "Shipping Postal Code";
            var col7 = "Shipped Date";
            var columns = [col1,col2,col3,col4,col5,col6,col7];
            var section = "customerDetail";
            var custId = $("#detailCustIdInput").val();
            var serviceName = "getOrdersForCustomer";
            var params = {columnNames:columns,customerId:custId};
            createTable(columns,section);
                $.when(sendRequest("GET",custId,serviceName,true,populateOpenOrders,params)).done(function(){
                    $("#customerDetailTableWrap").hide();
                    $("#customerDetailTableSection").show();
                });
        });
    
    /* <><><><><><><><><><><><><><><><><><><><><><><><><><><><> */
    //Request function to be called by all sections
    function sendRequest(protocol,query,serviceName,async,callback,params) {
        //AJAX Request object
        var request = new XMLHttpRequest();

        //Build request Endpoint
        var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/";
        if (serviceName == null) {
            console.log("Service Name Missing for " + protocol + "Ajax request");
        }
        else{
            url += serviceName;
        }
        if (query != null) {
            url += "/" + query;
        }
        
        console.log("*********************");
        console.log("URL Requested for Customer Id: " + url);
        console.log("*********************");

        //Built Http request
        request.open(protocol,url,async);
        request.send();

        //Listen for response and generate JSON output upon success
        request.onreadystatechange = function(){
            console.log(request.status);
            console.log(request.readyState);
            if (request.readyState == 4 && request.status == 200){
                var jsonResult = JSON.parse(request.responseText);
                if (jsonResult != null && callback != null) {
                    console.log("JSON Received - Executing Callback");
                    callback(jsonResult,params);
                }
            }
        }
    }
    /* <><><><><><><><><><><><><><><><><><><><><>><><><>><><><>><>><><><> */

    /* --------- Create Table --------- */
    function createTable(columns,section){
        var tbl = document.getElementById("customerTable");
        if (tbl == null){
            console.log("table does not exist -- creating table");
            /* --- Create table in DOM ---*/
            var newTbl = document.createElement("TABLE");
            newTbl.id = "customerTable";
            newTbl.classList.add("customerTable");
            /* -------------------------- */

            /* --- Table Body --- */
            var tblBody = document.createElement("TBODY");
            tblBody.id = "tableBody";
            tblBody.classList.add("customerTable_tbody");
            newTbl.appendChild(tblBody);
            /* ------------------- */

            /* --- Table Caption --- */
            var tableCaption = newTbl.createCaption();
            tableCaption.classList.add("customerTable_caption");
            if (section == "customerList") {
                tableCaption.innerHTML = "Customer List";
            }
            
            /* --------------------- */

            /* --- Table Header --- */
            var header = newTbl.createTHead();
            header.id = "tableHeader";
            var headerRow = header.insertRow(0);
            headerRow.id = "headerRow";
            for(var i=0; i < columns.length; i++){
                var headerCell = headerRow.insertCell(i);
                $(headerCell).text(columns[i]).appendTo(headerRow);
            }
            /* --- Display table --- */
            if (section == "customerList") {
                document.getElementById("customerListSection").appendChild(newTbl);
            }
            else if (section == "orderHistory") {
                document.getElementById("orderHistoryTableWrap").appendChild(newTbl);
            }
            else if (section == "customerDetail") {
                document.getElementById("customerDetailTableSection").appendChild(newTbl);
            }
        }
        else if(tbl != null){
            console.log("table already exists -- deleting previous table");
            document.getElementById("customerTable").parentNode.removeChild(tbl);
            createTable(columns,section)
        }
    }
    //Populate Customer List Table
    function populateCustList(result,columnNames){
        var tableBody = document.getElementById("tableBody");
        var columnLength = columnNames.length;
        for(var i=0; i < result.GetAllCustomersResult.length; i++){
            var row = tableBody.insertRow(i);
            var custNameCell = row.insertCell(0);
            var custIdCell = row.insertCell(1);
            var custCityCell = row.insertCell(2);
            $(custNameCell).text(result.GetAllCustomersResult[i].CompanyName);
            $(custIdCell).text(result.GetAllCustomersResult[i].CustomerID);
            $(custCityCell).text(result.GetAllCustomersResult[i].City);
        }
    }
    
    //Populate Order History table
    function getOrderHistory(result,params){
        var tbl = document.getElementById("customerTable");
        var caption = tbl.createCaption();
        caption.innerHTML = "Customer Id: " + params.customerId;
        var tableBody = document.getElementById("tableBody");
        
        for(var i=0; i < result.length; i++){
            var row = tableBody.insertRow(i);
            var prodNameCell = row.insertCell(0);
            var prodQty = row.insertCell(1);
            $(prodNameCell).text(result[i].ProductName);
            $(prodQty).text(result[i].Total);
        }
        
    }
    
    //Populate Open Orders Table
    function populateOpenOrders(result,params){
        var tbl = document.getElementById("customerTable");
        var caption = tbl.createCaption();
        caption.innerHTML = "Open Orders For: " + params.customerId;
        var tableBody = document.getElementById("tableBody");
        
        for(var i=0; i < result.GetOrdersForCustomerResult.length; i++){
            var row = tableBody.insertRow(i);
            var orderDateCell = row.insertCell(0);
            var orderIdCell = row.insertCell(1);
            var shipAddCell = row.insertCell(2);
            var shipCityCell = row.insertCell(3);
            var shipNameCell = row.insertCell(4);
            var shipPostCell = row.insertCell(5);
            var shipDateCell = row.insertCell(6);
            $(orderDateCell).text(result.GetOrdersForCustomerResult[i].OrderDate);
            $(orderIdCell).text(result.GetOrdersForCustomerResult[i].OrderID);
            $(shipAddCell).text(result.GetOrdersForCustomerResult[i].ShipAddress);
            $(shipCityCell).text(result.GetOrdersForCustomerResult[i].ShipCity);
            $(shipNameCell).text(result.GetOrdersForCustomerResult[i].ShipName);
            $(shipPostCell).text(result.GetOrdersForCustomerResult[i].ShipPostcode);
            $(shipDateCell).text(result.GetOrdersForCustomerResult[i].ShippedDate);
        }
        
    }
    
});