/*
 * This file is used to change the dropdown on the addMedia page dynamically depending on what media page the user 
 * is currently on.
 */

//This function is used to change the media selector on the addMedia page dynamically depending what media 
//page the user is coming from.
function changeMediaSelector(){
	
	//Read what page the user is on and store its ID
	var activePage = $.mobile.activePage.attr("id");
	
	//depending on the media page the user is currently on we select the appropriate search choice
	switch(activePage)
	{
	case "myBooks":
		$("#mediaChoice")[0].selectedIndex = 0;
		break;
	case "myGames":
		$("#mediaChoice")[0].selectedIndex = 1;
		break;
	case "myMovies":
		$("#mediaChoice")[0].selectedIndex = 2;
		break;
	case "myShows":
		$("#mediaChoice")[0].selectedIndex = 3;
		break;
	}
	
	//refresh the menu to display the change
	$("#mediaChoice").selectmenu("refresh");
	
	$.mobile.changePage('#addMedia');
	
}