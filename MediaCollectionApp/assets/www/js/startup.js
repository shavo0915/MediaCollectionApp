function populateCollection(){
	$.mobile.loadPage('#myMedia');
	
	$.mobile.loadPage('#myMovies');
	
	$.mobile.loadPage('#myGames');
	
	$.mobile.loadPage('#myShows');
	
	$.mobile.loadPage('#myBooks');
	
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
	if(localStorage.bookList){
		myBooks = JSON.parse(localStorage.bookList);
		buildBookList();
	}
	
	gameImgMList();
	
	bookImgMList()
	
	movieImgMList();
	
	tvShowImgMList()
}