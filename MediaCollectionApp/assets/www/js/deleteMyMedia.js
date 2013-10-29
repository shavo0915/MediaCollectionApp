/*
 * This file adds the functionality in the settings page where you are able to delete all of your local media.
 */

//Handles the deleting of your local media
function deleteMyMedia(){
	
	//Clear contents from local storage
	localStorage.clear();  
	
	//Clear media arrays 
	myBooks.length = 0;
	myGames.length = 0;
	myMovies.length = 0;
	myShows.length = 0;
	
	//rebuild and refresh the empty media lists
	buildBookList();
	buildGameList();
	buildMovieList();
	buildTVList();
	
	//remove images from the main list
	bookImgMList();
	
	gameImgMList();	
	
	movieImgMList();
	
	tvShowImgMList();
	
	//Display pop up telling the user the media was successfully deleted
	$('#deleteMediaConfirm').popup('open');
	$('#deleteMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#deleteMyMedia').dialog('close'); 			
		}
	})
	
	//Close popup after 1.5 seconds
	setTimeout( function(){ $( '#deleteMediaConfirm' ).popup( 'close' ) }, 1500 );
	
	//refresh the main list to diplay taken off changes
	$('#mainList').listview("refresh");
}

//If the user chooses he doesn't want to delete his media we close the dialog and go back to the previous page
function dontDeleteMyMedia(){	
	$('#deleteMyMedia').dialog('close'); 
}