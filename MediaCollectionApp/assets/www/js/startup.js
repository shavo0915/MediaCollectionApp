function populateCollection(){
	$.mobile.loadPage('#myMovies');
	
	$.mobile.loadPage('#myGames');
	
	$.mobile.loadPage('#myShows');
	
	if (localStorage.movieList) {
		myMovies = JSON.parse(localStorage.movieList);
		baseAddress = localStorage.baseAddress;
		posterSize = localStorage.posterSize;
		buildMovieList();
	}
	
	if (localStorage.gameList) {
		myGames = JSON.parse(localStorage.gameList);
		buildGameList();
	}
	
	if(localStorage.tvList){
		myShows = JSON.parse(localStorage.tvList);
		buildTVList();
	}
}