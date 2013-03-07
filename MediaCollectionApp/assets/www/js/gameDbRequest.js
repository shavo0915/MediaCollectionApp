var games;
var gameData;

/*Initiates AJAX call. We send a query string which in this case is the game name and depending on whether we establish a 
 * connection with the database we either call the success function or print out an error to the user.
 */ 
function getGameListInfo(gameName){
	$.ajax({
		url: " http://thegamesdb.net/api/GetGamesList.php",
		dataType: "xml",
		data: {name: gameName},
		success: getGameListInfoSuccess,
		error: function(status){
			alert("Error");
		    console.log("Error: Service Unavailable"); 
		 },
		complete: function(){
			console.log("getGameInfo Done");
			  }
	});
}

/*Based on whether we get a successful call to the database we first check if the XML object that is being returned actually has 
 * valuable information. This is dont specifically by checking it's length.  If there is no query match we output a message to the user
 * stating so, otherwise we retrieve the game list with title, year, and platform of the game displayed in a list.*/
function getGameListInfoSuccess(data){
	clearList();
	console.log("Retrieved Game Info Successfully \n")
	
	games = data;
	
	if($(data).find("Game").length == 0){
		var listElement = "<li><h1>No Matches found!!</h1></li>";
		$('#mediaReturn').append(listElement);
		$('#mediaReturn').listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
		return;
	}
	
	else{		
		$(data).find("Game").each(function()
			{				
				var listElement = "<li><a href='#'><h1>" + $(this).find("GameTitle").text() + "</h1><p>" + $(this).find("ReleaseDate").text() + "<p><p>" 
				+ $(this).find("Platform").text() + "</p>" + "</a></li>";
				$('#mediaReturn').append(listElement);
		
			})
	
		$('#mediaReturn li').click(function() {
			getChosenGameInfo($(this).index());
			
		})
		$('#mediaReturn' ).listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
	}
}

/*From the previous query we find both the game ID of the chosen game and the index or position it is in the list.
 We then call a dialog box that give the user a choice to either add straight to collection or to view more 
 detailed information on the game*/
function getChosenGameInfo(index){
	var gameId = $(games).find("id").eq(index).text();
	console.log(gameId);
	
	//Clear dialogs header first just in case we had already appended a title
	$("#mediaType").empty();
	var mediaPopup = "Add Games"
	$('#mediaType').append(mediaPopup);
	//Manually change the page to the dialog with 2 buttons. Either add to collection or view more info.
	$.mobile.changePage('#addToCollection', {transition: 'pop', role: 'dialog'});
	
	$('#mediaQueryReturn').popup('close');
	
	//Calls the query to get more detailed information on the chosen game so it can be either stored immediatley or viewed. 
	queryGameInfo(gameId);
}
/*Query call for more detailed game information using a game id for the query.*/
function queryGameInfo(gameId){
	$.ajax({
		url: " http://thegamesdb.net/api/GetGame.php?",
		dataType: "xml",
		data: {id: gameId},
		success: getGameInfoSuccess,
		error: function(status){
			alert("Error");
		    console.log("Error: Service Unavailable"); 
		 },
		complete: function(){
			console.log("getGameInfo Done");
			  }
	});
}

/*Set the data received locally into a local variable so that it can be later accessed*/
function getGameInfoSuccess(data){  
	gameData = data;
}

/*Function used to view more detailed information on a chosen game*/
function displayGameDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var gameTitle = $(gameData).find("GameTitle").text();
	var gameDetails = "<img src='" + $(gameData).find("thumb").eq(0).text() + "'/>" + "<p><b>Platform: </b>" + $(gameData).find("Platform").text() + "</p><p>" + "<b>Release Date: </b>" + $(gameData).find("ReleaseDate").text() + "</p>"
	+ "<p><b>Publisher: </b>" + $(gameData).find("Publisher").text() + "<p><b>Developer: </b>" + $(gameData).find("Developer").text() + "</p><p><b>Overview: </b><br>" + $(gameData).find("Overview").text() + "</p>";
	$('#mediaTitle').append(gameTitle);
	$('#mediaInfoContent').append(gameDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
} 
