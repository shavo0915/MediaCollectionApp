function changeMediaSelector(){
	var activePage = $.mobile.activePage.attr("id");
	
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
	
	$("#mediaChoice").selectmenu("refresh");
	
	$.mobile.changePage('#addMedia');
	
}