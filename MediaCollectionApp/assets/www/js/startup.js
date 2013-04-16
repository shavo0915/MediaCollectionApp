function populateCollection(){
	
	$.mobile.loadPage('#myBooks');
	
	$.mobile.loadPage('#myGames');
	
	$.mobile.loadPage('#myMovies');
	
	$.mobile.loadPage('#myShows');
	
	if(localStorage.bookList){
		myBooks = JSON.parse(localStorage.bookList);
		buildBookList();
	}
	
	if (localStorage.gameList) {
		myGames = JSON.parse(localStorage.gameList);
		buildGameList();
	}
	
	if (localStorage.movieList) {
		myMovies = JSON.parse(localStorage.movieList);
		baseAddress = localStorage.baseAddress;
		posterSize = localStorage.posterSize;
		buildMovieList();
	}
	
	if(localStorage.tvList){
		myShows = JSON.parse(localStorage.tvList);
		buildTVList();
	}
	
	bookImgMList();
	
	gameImgMList();	
	
	movieImgMList();
	
	tvShowImgMList();
}