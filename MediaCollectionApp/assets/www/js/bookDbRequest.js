var booksList;
var bookData;
var myBooks = [];
var bookIndex;
var OLID;

function getBookListInfo(bookName){
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: "http://openlibrary.org/search.json?",
		dataType: "json",
		data: {title: bookName},
		success: getBookListInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getBookInfo Done");
			  }
	});
}

function getBookListInfoSuccess(data){
	clearList();
	//Checks to see if the query returned no results, if so, displays popup indicating no matches were found and exit function
	if(data.docs.length == 0){
		var listElement = "<li style='font-size:18px' >No Matches found!!</li>";
		$('#mediaReturn').append(listElement);
		$('#mediaReturn').listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
		return;
	}
	console.log(data);
	booksList = data;
	for(var x in data.docs){		
		var listElement = "<li><a href='#'><h1>" + data.docs[x].title + "</h1><p>" + data.docs[x].author_name + "</p><p>" + 
		data.docs[x].edition_count + " edition(s)</p><p>First published in " + data.docs[x].first_publish_year + "</p>";
		$('#mediaReturn').append(listElement);
	}
	
	//assigns a click listener to each list element in the listview in the mediaQueryReturn popup to hanle the selection of a movie
	$('#mediaReturn li').click(function() {
		getChosenBookInfo($(this).index());
	});
	$('#mediaReturn').listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

function getChosenBookInfo(index){

	var bookId = booksList.docs[index].cover_edition_key;
	console.log(bookId);
	
	//Clear dialogs header first just in case we had already appended a title
	$("#mediaType").empty();
	var mediaPopup = "Add Books"
	$('#mediaType').append(mediaPopup);
	//Manually change the page to the dialog with 2 buttons. Either add to collection or view more info.
	$.mobile.changePage('#addToCollection', {transition: 'pop', role: 'dialog'});
	
	$('#mediaQueryReturn').popup('close');
	
	//Calls the query to get more detailed information on the chosen game so it can be either stored immediatley or viewed. 
	queryBookInfo(bookId);
	
	OLID = "OLID:" + bookId;
}

function queryBookInfo(bookId){
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: "http://openlibrary.org/api/books?",
		dataType: "json",
		data: {bibkeys: "OLID:" + bookId, jscmd: "data", format: "json"},
		success: getBookInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getGameInfo Done");
			  }
	});
}

function getBookInfoSuccess(data){ 
	bookData = data;
	$('#addMediaButton').attr('onclick', "addBookToCollection()");
	$('#displayInfoButton').attr('onclick', "displayBookDetails()");
}

function displayBookDetails(){
	var authors = "";
	var subjects = "";
	var subjectPeople = "";
	var excerpts = "";
	var pages = "";
	
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	
	if(bookData[OLID]){
		if(bookData[OLID].authors !== undefined){
			if(bookData[OLID].authors.length > 1){
				for(var x in bookData[OLID].authors){
					if(y == bookData[OLID].authors.length - 1){
						authors += bookData[OLID].authors[y].name + ".";
					}
					else{
						authors += bookData[OLID].authors[y].name + ", ";
					}
				}
			}
			else{
				authors = bookData[OLID].authors[0].name + ".";
			}
		}
	
		if(bookData[OLID].subjects !== undefined){
			if(bookData[OLID].subjects.length > 1){
				for(var y in bookData[OLID].subjects){
					if(y == bookData[OLID].subjects.length - 1){
						subjects += bookData[OLID].subjects[y].name + ".";
					}
					else{
						subjects += bookData[OLID].subjects[y].name + ", ";
					}
				}
			}
			else{
				subjects = bookData[OLID].subjects[0].name + ".";
			}
		}
	
		if(bookData[OLID].subject_people !== undefined){
			if(bookData[OLID].subject_people.length > 1){
				for(var y in bookData[OLID].subject_people){
					if(y == bookData[OLID].subject_people.length - 1){
						subjectPeople += bookData[OLID].subject_people[y].name + ".";
					}
					else{
						subjectPeople += bookData[OLID].subject_people[y].name + ", ";
					}
				}
			}	
			else{
				subjectPeople = bookData[OLID].subject_people[0].name + ".";
			}
		}
	
		if(bookData[OLID].excerpts !== undefined){
			if(bookData[OLID].excerpts.length > 1){
				excerpts = bookData[OLID].excerpts[0].text + ".";
			}
		}
		
		if(bookData[OLID].number_of_pages !== undefined){
			pages = bookData[OLID].number_of_pages + ".";
		}

		var bookTitle = bookData[OLID].title;
		var imageURL = bookData[OLID].cover["large"];
		var bookDetails = "<center><img src='" + imageURL + "' alt='" + bookTitle + "' width='300'/></center>" + "<p><b>Author(s): </b>" + 
		authors + "</p><p><b>Pages: </b>" + pages + "<p><p><b>Subjects: </b>" + subjects + "</p><p>" + "<b>People: </b>" + 
		subjectPeople + "</p>"+ "<p><b>Excerpts: </b>" + excerpts + "</p>";
	
		$('#mediaTitle').append(bookTitle);
		$('#mediaInfoContent').append(bookDetails);
		$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
	}
	else{		
		$('#mediaTitle').append("Sorry!! :-(");
		$('#mediaInfoContent').append("No Detailed Information Found!!");
		$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
	}
}

/*Adds a game to the local collection array. We first have to convert the XML game data into a JSON object in order to be able to 
 * add to local storage. The list is then sorted alphabetically and the list is then built by calling another method.*/
/*
function addBookToCollection(){
	
	//this checks if the selected game already exists in the user's collection
	for(var i = 0; i < myGames.length; i++){
		if(myGames[i].Game.GameTitle == $(gameData).find("GameTitle").text() && myGames[i].Game.id == $(gameData).find("id").text()){
			$('#addExistingMedia').bind({
				popupafterclose: function(event, ui){
					$('#addToCollection').dialog('close');
				}
			})
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
			return;
		}			
	}
	//Use a jQuery plugin in order to convert the XML object into JSON.
	var jsonGameData = $.xml2json(gameData);
	//Push the newly converted JSON object into the games array.
	myGames.push(jsonGameData);
	
	myGames.sort(function (a, b){
		var titleA = a.Game.GameTitle.toLowerCase(), titleB = b.Game.GameTitle.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
		
	localStorage.gameList = JSON.stringify(myGames);
	
	buildGameList();
} 
*/