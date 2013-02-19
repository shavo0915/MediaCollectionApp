//Function used to call queries depending on what media the user selected.
function queryMedia(){
	var chosenMedia = getSelectedMediaValue();
	var queryString = getQueryString();
	
	if(chosenMedia == "games"){
		getGameInfo(queryString);
		//alert(queryString);
	}
	else if(chosenMedia =="music"){
		alert("You have chosen Music");
	}
	else if(chosenMedia == "shows"){
		alert("You have chosen TV Shows");
	}
	else if(chosenMedia == "books"){
		alert("You have chosen Books");
	}
	else if(chosenMedia == "movies"){
		getMovieInfo(queryString);
		//alert("You have chosen Movies");
	}
}

//Returns the string of what the user is trying to find.
function getQueryString(){
	var queryString = $("#mediaSearch").val();
	return queryString;
}

//Gets the value of what type of media the user is searching for.
function getSelectedMediaValue(){
	var chosenMedia = $("#mediaChoice").val();
	return chosenMedia;
}
