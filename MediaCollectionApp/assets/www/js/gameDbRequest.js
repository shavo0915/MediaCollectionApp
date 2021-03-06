var games;	//Used for the retrieved books list from the query
var gameData;	//Used to store the chosen books detailed info after the query
var myGames = [];	//Used for a users local game collection
var gameIndex;	//used for the chosen games index

/*Initiates AJAX call. We send a query string which in this case is the game name and depending on whether we establish a 
 * connection with the database we either call the success function or print out an error to the user.
 */ 
function getGameListInfo(gameName){
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: " http://thegamesdb.net/api/GetGamesList.php",
		dataType: "xml",
		data: {name: gameName},
		success: getGameListInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
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
		setTimeout( function(){ $( '#mediaQueryReturn' ).popup( 'close' ) }, 1500 );
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
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: " http://thegamesdb.net/api/GetGame.php?",
		dataType: "xml",
		data: {id: gameId},
		success: getGameInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getGameInfo Done");
			  }
	});
}

/*Set the data received locally into a local variable so that it can be later accessed*/
function getGameInfoSuccess(data){  
	gameData = data;
	$('#addMediaButton').attr('onclick', "addGameToCollection()");
	$('#displayInfoButton').attr('onclick', "displayGameDetails()");
}

/*Function used to view more detailed information on a chosen game*/
function displayGameDetails(){
	var platform = "<b>Platform: </b>";
	var players = "<b>Players: </b>";
	var rDate = "<b>Release Date: </b>";
	var publisher = "<b>Publisher: </b>";
	var dev = "<b>Developer: </b>";
	var overview = "<b>Overview: </b><br>";
	
	if(gameData.getElementsByTagName("Platform").length > 0){
		platform += $(gameData).find("Platform").text();
	}
	else{
		platform = "";
	}
	
	if(gameData.getElementsByTagName("Players").length > 0){
		players += $(gameData).find("Players").text();
	}
	else{
		players = "";
	}
	
	if(gameData.getElementsByTagName("ReleaseDate").length > 0){
		rDate += $(gameData).find("ReleaseDate").text();
	}
	else{
		rDate = "";
	}
	
	if(gameData.getElementsByTagName("Publisher").length > 0){
		publisher += $(gameData).find("Publisher").text();
	}
	else{
		publisher = "";
	}
	
	if(gameData.getElementsByTagName("Developer").length > 0){
		dev += $(gameData).find("Developer").text();
	}
	else{
		dev = "";
	}
	
	if(gameData.getElementsByTagName("Overview").length > 0){
		overview += $(gameData).find("Overview").text();
	}
	else{
		overview = "";
	}
	
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var gameTitle = $(gameData).find("GameTitle").text();
	var imageURL = $(gameData).find("baseImgUrl").text() + $(gameData).find("boxart[side='front']").attr("thumb");
	console.log("IMG Source: " + imageURL);
	var gameDetails = "<center><img src='" + imageURL + "' alt='" + gameTitle + "'/></center>" + "<p>" + 
	platform + "</p><p>" + players + 
	"</p><p>" + rDate + "</p>"+ "<p>" + 
	publisher + "<p>" + dev + "</p><p>" + 
	overview + "</p>";
	
	$('#mediaTitle').append(gameTitle);
	$('#mediaInfoContent').append(gameDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
}

/*Adds a game to the local collection array. We first have to convert the XML game data into a JSON object in order to be able to 
 * add to local storage. The list is then sorted alphabetically and the list is then built by calling another method.*/
function addGameToCollection(){
	
	//this checks if the selected game already exists in the user's collection
	for(var i = 0; i < myGames.length; i++){
		if(myGames[i].Game.GameTitle == $(gameData).find("GameTitle").text() && myGames[i].Game.id == $(gameData).find("id").text()){
			$('#addExistingMedia').bind({
				popupafterclose: function(event, ui){
					$('#addToCollection').dialog('close');
				}
			})
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'close' ) }, 1500 );
			return;
		}			
	}
	//Use a jQuery plugin in order to convert the XML object into JSON.
	var jsonGameData = $.xml2json(gameData);
	//Push the newly converted JSON object into the games array.
	myGames.push(jsonGameData);
	
	myGames.sort(function (a, b){
		var titleA = a.Game.GameTitle.toLowerCase(), titleB = b.Game.GameTitle.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
		
	localStorage.gameList = JSON.stringify(myGames);
	
	buildGameList();
	
	gameImgMList();
	
	$('#mainList').listview("refresh");
} 

function openGameDialog(index){
	console.log(index);
	gameIndex = index;
	$("#mediaOptionsDisplayInfoButtonTitle").empty();
	$("#mediaOptionsDisplayInfoButtonTitle").append("Game Info");
	$('#mediaOptionsDisplayInfoButton').attr('onclick', "displayCollectionGameDetails()");
	$('#mediaOptionsDeleteButton').attr('onclick', "deleteFromGameCollection()");
	$('#mediaOptionsLink').click();
}

/*Deletes a game from local storage*/
function deleteFromGameCollection(){
	myGames.splice(gameIndex, 1);
	if(myGames.length == 0){
		localStorage.removeItem("gameList");
	}else{
		localStorage.gameList = JSON.stringify(myGames);
	}
	buildGameList();
	$('#mediaOptions').dialog('close');
	
	gameImgMList();
	$('#mainList').listview("refresh");
}

/*Builds the game list by iterating through the array of JSON game objects. */
function buildGameList(){
	$('#gameList').empty();
	
	for(var x in myGames){
		var baseIMGURL = myGames[x].baseImgUrl;
		var stringGameData = JSON.stringify(myGames[x].Game.Images.boxart);
		if(stringGameData.indexOf(',') == -1){
			var posterPath = baseIMGURL + myGames[x].Game.Images.boxart;
		}
		else{
			var posterPath = baseIMGURL + myGames[x].Game.Images.boxart[1];
		}
		var stringPosterPath = JSON.stringify(posterPath);
		var thumbIMGURL = addThumbToURL(stringPosterPath, baseIMGURL);
		var gameItem = "<li data-myGamesIndex = " + x + "><a href=''><img src=" + thumbIMGURL + "><h3>" + myGames[x].Game.GameTitle + "</h3>"
		+ "<p>" + myGames[x].Game.ReleaseDate + "</p><p>" + myGames[x].Game.Platform + "</p></a></li>";
		var elementEnd;

		$('#gameList').append(gameItem);
	};

	$('#gameList li').click(function() {
		openGameDialog($(this).attr('data-myGamesIndex'));
	});

	$('#gameList').listview("refresh");

	$('#gameCount').text(myGames.length);
	
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
	$('#addMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#addToCollection').dialog('close');
		}
	})
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'close' ) }, 1500 );
}

/*Since there was a conversion from an XML game object to a JSON one there was unfortunately some data loss.
 *One of these was the loss of the thumb image for the front game cover. Fortunately for us the URL's are very similar with the
 *exception  of a "/thumb/" somewhere in the string so we are able to insert this and build the URL.*/
function addThumbToURL(stringURL, baseIMGURL){
	var stringBegIndex;
	var stringEndIndex;	
	var stringBeg;
	var stringMiddle = "thumb";
	var stringEnd;
	var reconstructedString;
	
	stringBegIndex = stringURL.indexOf('boxart/');
	stringEndIndex = stringURL.indexOf('/original');
	stringBeg = stringURL.substring(stringBegIndex, stringEndIndex + 1);
	stringEnd = stringURL.substring(stringEndIndex, stringURL.length - 1);
	reconstructedString = baseIMGURL + stringBeg + stringMiddle + stringEnd;
	return reconstructedString;
}

/*Display more detailed information from selected game in local storage.*/
function displayCollectionGameDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	
	var baseIMGURL = myGames[gameIndex].baseImgUrl;
	var gameTitle = myGames[gameIndex].Game.GameTitle;
	var gamePlatform = "<b>Platform: </b>" + myGames[gameIndex].Game.Platform;
	var gameReleaseDate = "<b>Release Date: </b>" + myGames[gameIndex].Game.ReleaseDate;
	var gamePublisher = "<b>Publisher: </b>" + myGames[gameIndex].Game.Publisher;
	var gameDeveloper = "<b>Developer: </b>" + myGames[gameIndex].Game.Developer;
	var gameOverview = "<b>Overview: </b><br>";
	var gamePlayerNumber = "<b>Players: </b>" + myGames[gameIndex].Game.Players;
	
	//Checks to make sure that if there are fields in the game object that are missing the field will show up as blank instead
	//of showing up as undefined
	if(gamePlatform === undefined){
		gamePlatform = "";
	}
	if(gameReleaseDate === undefined){
		gameReleaseDate = "";
	}
	if(gamePublisher === undefined){
		gamePublisher = "";
	}
	if(gameDeveloper === undefined){
		gameDeveloper = "";
	}
	if(myGames[gameIndex].Game.Overview === undefined){
		gameOverview = "";
	}
	else{
		if(JSON.stringify(myGames[gameIndex].Game.Overview).indexOf('"p":') == -1){
			gameOverview += myGames[gameIndex].Game.Overview;
		}
		else{
			gameOverview += myGames[gameIndex].Game.Overview.p;
		}
	}
	if(myGames[gameIndex].Game.Players === undefined){
		gamePlayerNumber = "";
	}
	
	var stringGameData = JSON.stringify(myGames[gameIndex].Game.Images.boxart);
	if(stringGameData.indexOf(',') == -1){
		var posterPath = baseIMGURL + myGames[gameIndex].Game.Images.boxart;
	}
	else{
		var posterPath = baseIMGURL + myGames[gameIndex].Game.Images.boxart[1];
	}
	var stringPosterPath = JSON.stringify(posterPath);
	var imageURL = addThumbToURL(stringPosterPath, baseIMGURL);
	var gameDetails = "<center><img src='" + imageURL + "' alt='" + gameTitle + "'/></center>" + "<p>" 
	+ gamePlatform + "</p><p>" + gamePlayerNumber + "</p><p>" 
	+ gameReleaseDate + "</p>" + "<p>" + gamePublisher + 
	"<p>" + gameDeveloper + "</p><p>" + gameOverview + "</p>";
	
	$('#mediaTitle').append(gameTitle);
	$('#mediaInfoContent').append(gameDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
}


/*This function checks if the games list has at least one item. If it does it pulls the image from the first item in the 
 * list and adds it to the main lists picture. If there is no item In the list no picture is shown in the main list.*/
function gameImgMList(){
	if(myGames.length > 0){
		$('#gImage').remove();
		var baseIMGURL = myGames[0].baseImgUrl;
		var stringGameData = JSON.stringify(myGames[0].Game.Images.boxart);
		if(stringGameData.indexOf(',') == -1){
			var posterPath = baseIMGURL + myGames[0].Game.Images.boxart;
		}
		else{
			var posterPath = baseIMGURL + myGames[0].Game.Images.boxart[1];
		}
		var stringPosterPath = JSON.stringify(posterPath);
		var thumbIMGURL = addThumbToURL(stringPosterPath, baseIMGURL);
		var img = $('<img id="gImage"/>').attr('src', thumbIMGURL);
		$('#gameImage').append($(img));
	}
	else{
		$('#gImage').remove();
	}
}