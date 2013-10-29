function deleteMyMedia(){
	
	localStorage.clear();  
	
	myBooks.length = 0;
	myGames.length = 0;
	myMovies.length = 0;
	myShows.length = 0;
	
	buildBookList();
	buildGameList();
	buildMovieList();
	buildTVList();
	
	bookImgMList();
	
	gameImgMList();	
	
	movieImgMList();
	
	tvShowImgMList();
	
	$('#deleteMediaConfirm').popup('open');
	$('#deleteMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#deleteMyMedia').dialog('close'); 			
		}
	})
	
	setTimeout( function(){ $( '#deleteMediaConfirm' ).popup( 'close' ) }, 1500 );
	
	//$('#deleteMyMedia').dialog('close'); 
	
	//setTimeout( function(){ $( '#deleteMediaConfirm' ).popup( 'open' ) }, 100 );
	
	$('#mainList').listview("refresh");
}

function dontDeleteMyMedia(){	
	$('#deleteMyMedia').dialog('close'); 
}