function populateCollection(){
	$.mobile.loadPage('#myMovies');
	
	$.mobile.loadPage('#myGames');
	
	if (localStorage.movieList) {
		myMovies = JSON.parse(localStorage.movieList);
		baseAddress = localStorage.baseAddress;
		posterSize = localStorage.posterSize;
		buildMovieList();
	}
}