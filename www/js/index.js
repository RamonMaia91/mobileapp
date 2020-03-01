//Array that will be receiving all the information saved by the user 
var arraySavedNews = [];


//Local Storage created to save all the news and keep it available to the user on the next use
//It will check if there is any news saved at the beguining of the application 
//JSON.parse converts the news inside the array into a json to make it easy to handle the information

if(localStorage.getItem("arraySavedNews") != null){
	arraySavedNews = JSON.parse(localStorage.getItem("arraySavedNews"));
}

//Array that will receive the API's URL separated by each subject as required
//This will be called first thing when the app starts working, it will show information required
//reducing the number of requests 

$(document).ready(function() {
	var urlApiSport = 'http://newsapi.org/v2/everything?q=sport&apiKey=794274efe3f3444fad2eb50856af41c2';
	var urlBusiness = 'http://newsapi.org/v2/everything?q=business&apiKey=794274efe3f3444fad2eb50856af41c2';
	var urlFinancial = 'http://newsapi.org/v2/everything?q=financial&apiKey=794274efe3f3444fad2eb50856af41c2';

	//Function that adds datetime in home page
	nowDateTime();
	
	// Function that collects the news from the API's and keep it into their specific array 
	callRestApiNews('sport', urlApiSport);
	callRestApiNews('business', urlBusiness);
	callRestApiNews('financial', urlFinancial);
	setDataTable(arraySavedNews, 'saved');
	
	// Function to clear all news saved on localstorage 
	$("#clear").on("click", function(e) {
		localStorage.clear();
		arraySavedNews = [];
		refreshSavedNews();
	});
		
	// show or hide zone of the news - This one shows the home screen
	$(".back").on("click", function(e) {
		nowDateTime();
		$("#div-home").show();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").hide();		
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the sports section and hide the rest of the options
	$("#menu-sport").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").show();
		$("#div-business").hide();
		$("#div-financial").hide();
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the business section and hide the rest of the options
	$("#menu-business").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").show();
		$("#div-financial").hide();
		$("#div-saved").hide();		
	});
	// show or hide zone of the news
	//This option will show all the financial section and hide the rest of the options
	$("#menu-financial").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").show();
		$("#div-saved").hide();		
	});

	//show or hide zone of the news
	//This option will show all the saved news and hide the rest of the options
	$("#menu-saved").on("click", function(e) {
		$("#div-home").hide();
		$("#div-sport").hide();
		$("#div-business").hide();
		$("#div-financial").hide();
		$("#div-saved").show();	
		refreshSavedNews();
		
	});
	
	//Creation of the parameters where variables was created to receive all the information
	//to be shown on the screen in order within the DataTable if the user clicks on the saved button
	$(".btn-saved").on("click", function(e) {
		
		var selectedNews = $(this).attr("id");
		var tableSport = $('#dt-sport').DataTable().rows().data();
		var tableBusiness = $('#dt-business').DataTable().rows().data();
		var tableFinancial = $('#dt-financial').DataTable().rows().data();
		
		//(**)Function to manipulate information inside the variables created above. It will show the date and the news published
		//there is an if statement where the comparasion will be made if the user save the headline
		//and if is true, the information will be saved inside the array created for it.
		$.each(tableSport, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});
		
		//(**)		
		$.each(tableBusiness, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});
		
		//(**)		
		$.each(tableFinancial, function() {
				var dtPublished = this[0];
				var news = this[1];
				
				if(selectedNews == dtPublished){
					arraySavedNews.push([dtPublished, news, ""]);
				}
		});	
		
		//Set the news into the array and save into the localstorage allowing the user to check
		//all the news saved in future
		localStorage.setItem("arraySavedNews", JSON.stringify(arraySavedNews));
	});
});

// Funtion to get the date and time from the system
function nowDateTime() {
	nowDate();
	nowTime();
}

// get date
function nowDate() {
	var monthNames = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
	var date = new Date();
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	$('#nowDate').html(day + "/" + monthNames[monthIndex] + "/" + year);	
}

// get time
function nowTime() {
	var pad = "0";
	var date = new Date();
	var minutes = date.getMinutes();
	var hour = date.getHours();
	$('#nowTime').html(hour + ":" + pad.substring(1, pad.length - minutes.length) + minutes);	
}



//JQuery funtion to call the webservice using AJAX - call rest to get news from api
//This function will be receiving the subject and the API as parameter then the arrayOfNews will be receiving
//the News and displaying to the user accordingly to what it's been specified (Date and Time, Description and the save button)

function callRestApiNews(suject, urlApi) {
	var url = urlApi;
	$.ajax({ url : url, type : "GET", async : false, success : (function(data, status, jqXhr) {
			var arrayOfNews = [];
			$.each(data.articles, function() {
				arrayOfNews.push([this.publishedAt, this.description, "<a class='btn-saved' id='"+this.publishedAt+"' href='#'><i class='fas fa-save'></i></a>"]);				
			});
			setDataTable(arrayOfNews, suject);			
		}) 
	});
}

// json to datatable
//This function will display the news structure into the DataTable with a separation for titles
//Also the searching and the lengt change is on to be shown.
function setDataTable(arrayOfNews, suject) {
	$('#dt-' + suject).DataTable( {
		"searching": true,
		"info": false,
		"lengthChange": true,
		data: arrayOfNews,
		columns: [
			{ title: "Published" },
			{ title: "Text" },
			{ title: "Save" }
		]
	});	
}

// Function to update the news on a datatable saved news
function refreshSavedNews() {
	$('#dt-saved').DataTable().destroy();
	setDataTable(arraySavedNews, 'saved');
	
}