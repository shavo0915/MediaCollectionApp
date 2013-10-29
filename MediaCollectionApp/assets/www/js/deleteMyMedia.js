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
	
	/*setTimeout( function(){ $( '#deleteMediaConfirm' ).popup( 'open' ) }, 100 );
	$('#deleteMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#deleteMyMedia').dialog('close'); 			
		}
	})
	*/
	
	//$('deleteMediaConfirm').popup('open');
	
	$('#deleteMyMedia').dialog('close'); 
	
	setTimeout( function(){ $( '#deleteMediaConfirm' ).popup( 'open' ) }, 1000 );
	
	$('#mainList').listview("refresh");
}

function dontDeleteMyMedia(){	
	$('#deleteMyMedia').dialog('close'); 
}