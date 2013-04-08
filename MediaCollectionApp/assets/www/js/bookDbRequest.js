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
	var authors; 
	var pYear;
	var edition;
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
		
		if(data.docs[x].author_name !== undefined){
			authors = data.docs[x].author_name;
		}
		else{
			authors = ""
		}
		if(data.docs[x].first_publish_year !== undefined){
			pYear = "First published in " + data.docs[x].first_publish_year;
		}
		else{
			pYear = "";
		}
		if(data.docs[x].edition_count  !== undefined && data.docs[x].edition_count != 0){
			edition = data.docs[x].edition_count + " edition(s)";
		}
		else{
			edition = ""
		}
		var listElement = "<li><a href='#'><h1>" + data.docs[x].title + "</h1><p>" + authors + "</p><p>" + 
		edition + "</p><p>" + pYear + "</p>";
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
	var authors = "<b>Author(s): </b>";
	var subjects = "<b>Subjects: </b>";
	var subjectPeople = "<b>People: </b>";
	var excerpts = "<b>Excerpts: </b>";
	var pages = "<b>Pages: </b>";
	
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	
	if(bookData[OLID]){
		if(bookData[OLID].authors !== undefined){
			if(bookData[OLID].authors.length > 1){
				for(var x in bookData[OLID].authors){
					if(y == bookData[OLID].authors.length - 1){
						authors += bookData[OLID].authors[y].name;
					}
					else{
						authors += bookData[OLID].authors[y].name + ", ";
					}
				}
			}
			else{
				authors += bookData[OLID].authors[0].name;
			}
		}
		else{
			authors = "";
		}
	
		if(bookData[OLID].subjects !== undefined){
			if(bookData[OLID].subjects.length > 1){
				for(var y = 0; y < bookData[OLID].subjects.length - 1; y++){
					if(y == bookData[OLID].subjects.length - 2){
						subjects += bookData[OLID].subjects[y].name + ".";
					}
					else{
						subjects += bookData[OLID].subjects[y].name + ", ";
					}
				}
			}
			else{
				subjects += bookData[OLID].subjects[0].name + ".";
			}
		}
		else{
			subjects = "";
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
				subjectPeople += bookData[OLID].subject_people[0].name + ".";
			}
		}
		else{
			subjectPeople = "";
		}
	
		if(bookData[OLID].excerpts !== undefined){
			if(bookData[OLID].excerpts.length >= 1){
				excerpts += bookData[OLID].excerpts[0].text + ".";
			}
		}
		else{
			excerpts = "";
		}
		
		if(bookData[OLID].number_of_pages !== undefined){
			pages += bookData[OLID].number_of_pages + ".";
		}
		else{
			pages = "";
		}

		var bookTitle = bookData[OLID].title;
		var imageURL = bookData[OLID].cover["large"];
		var bookDetails = "<center><img src='" + imageURL + "' alt='" + bookTitle + "' width='300'/></center>" + "<p>" + 
		authors + "</p><p>" + pages + "<p><p>" + subjects + "</p><p>" + 
		subjectPeople + "</p>"+ "<p>" + excerpts + "</p>";
	
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
function addBookToCollection(){
	
	if(bookData[OLID]){
		//this checks if the selected game already exists in the user's collection
		for(var i = 0; i < myBooks.length; i++){
			var book = myBooks[i];
			var bookOLID = getOLIDNumber(book);
			if(book[bookOLID].title == bookData[OLID].title){
				$('#addExistingMedia').bind({
					popupafterclose: function(event, ui){
						$('#addToCollection').dialog('close');
					}
				})
				setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
				return;
			}			
		}

		myBooks.push(bookData);
	
	
		myBooks.sort(function (a, b){
			var aBookOLID = getOLIDNumber(a);
			var bBookOLID = getOLIDNumber(b);
			var aTitle = "";
			var bTitle = "";
			
			if(a[aBookOLID].title !== undefined){
				aTitle = a[aBookOLID].title.toLowerCase();
			}
			if(b[bBookOLID].title !== undefined){
				bTitle = b[bBookOLID].title.toLowerCase();
			}
			var titleA = aTitle, titleB = bTitle;
			if (titleA < titleB)
				return -1;
			if (titleA > titleB)
				return 1;
			return 0;
		});
	
		localStorage.bookList = JSON.stringify(myBooks);
	
		buildBookList()
	
		setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
		$('#addMediaConfirm').bind({
			popupafterclose: function(event, ui){
				$('#addToCollection').dialog('close');
			}
		})
	}
	else{
		setTimeout( function(){ $( '#addMediaFailed' ).popup( 'open' ) }, 100 );
		$('#addMediaFailed').bind({
			popupafterclose: function(event, ui){
				$('#addToCollection').dialog('close');
			}
		})
	}
	$('#mainList').listview("refresh");
	
	bookImgMList();
	
	$('#mainList').listview("refresh");
}

function buildBookList(){	
	$('#bookList').empty();
	
	for(var x in myBooks){
		var book = myBooks[x];
		var bID = getOLIDNumber(book);
		var bookTitle = book[bID].title;
		var imageURL = book[bID].cover["large"];
		
		if(book[bID].title === undefined){
			bookTitle = "";
		}
		
		var bookItem = "<li data-bookIndex = " + x + "><a href=''><img src='" + imageURL + "'/><h3>" + bookTitle + "</h3>" + 
		"<p>" + book[bID].authors[0].name + "</p>";
		var elementEnd;
		
		$('#bookList').append(bookItem);
	};

	$('#bookList li').click(function() {
		openBookDialog($(this).attr('data-bookIndex'));
	});

	$('#bookList').listview("refresh");

	$('#bookCount').text(myBooks.length);
}

function getOLIDNumber(myBooks){
	var objectString = JSON.stringify(myBooks);
	var begOLIDIndex;
	var endOLIDIndex;
	
	begOLIDIndex = objectString.indexOf('OLID:');
	endOLIDIndex = objectString.indexOf('":');
	OLIDString = objectString.substring(begOLIDIndex, endOLIDIndex);
	
	return OLIDString;
}

function deleteFromBookCollection(){
	myBooks.splice(bookIndex, 1);
	if(myBooks.length == 0){
		localStorage.removeItem("bookList");
	}else{
		localStorage.bookList = JSON.stringify(myBooks);
	}
	buildBookList();
	
	$('#mediaOptions').dialog('close'); 
	
	bookImgMList();
	
	$('#mainList').listview("refresh");
}

function openBookDialog(index){
	console.log(index);
	bookIndex = index;
	$("#mediaOptionsDisplayInfoButtonTitle").empty();
	$("#mediaOptionsDisplayInfoButtonTitle").append("Book Info");
	$('#mediaOptionsDisplayInfoButton').attr('onclick', "displayCollectionBookDetails()");
	$('#mediaOptionsDeleteButton').attr('onclick', "deleteFromBookCollection()");
	$('#mediaOptionsLink').click();
}

function displayCollectionBookDetails(){
	var authors = "<b>Author(s): </b>";
	var subjects = "<b>Subjects: </b>";
	var subjectPeople = "<b>People: </b>";
	var excerpts = "<b>Excerpts: </b>";
	var pages = "<b>Pages: </b>";
	var book = myBooks[bookIndex];
	var bOLID = getOLIDNumber(book);
	
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	
	if(book[bOLID].authors !== undefined){
		if(book[bOLID].authors.length > 1){
			for(var x in book[bOLID].authors){
				if(y == book[bOLID].authors.length - 1){
					authors += book[bOLID].authors[y].name;
				}
				else{
					authors += book[bOLID].authors[y].name + ", ";
				}
			}
		}
		else{
			authors += book[bOLID].authors[0].name;
		}
	}
	else{
		authors = "";
	}
	
	if(book[bOLID].subjects !== undefined){
		if(book[bOLID].subjects.length > 1){
			for(var y = 0; y < book[bOLID].subjects.length - 1; y++){
				if(y == book[bOLID].subjects.length - 2){
					subjects += book[bOLID].subjects[y].name + ".";
				}
				else{
					subjects += book[bOLID].subjects[y].name + ", ";
				}
			}
		}
		else{
			subjects += book[bOLID].subjects[0].name + ".";
		}
	}
	else{
		subjects = "";
	}
	
	if(book[bOLID].subject_people !== undefined){
		if(book[bOLID].subject_people.length > 1){
			for(var y in book[bOLID].subject_people){
				if(y == book[bOLID].subject_people.length - 1){
					subjectPeople += book[bOLID].subject_people[y].name + ".";
				}
				else{
					subjectPeople += book[bOLID].subject_people[y].name + ", ";
				}
			}
		}	
		else{
			subjectPeople += book[bOLID].subject_people[0].name + ".";
		}
	}
	else{
		subjectPeople = "";
	}
	
	if(book[bOLID].excerpts !== undefined){
		if(book[bOLID].excerpts.length >= 1){
			excerpts += book[bOLID].excerpts[0].text + ".";
		}
	}
	else{
		excerpts = "";
	}
		
	if(book[bOLID].number_of_pages !== undefined){
		pages += book[bOLID].number_of_pages + ".";
	}
	else{
		pages = "";
	}

	var bookTitle = book[bOLID].title;
	var imageURL = book[bOLID].cover["large"];
	var bookDetails = "<center><img src='" + imageURL + "' alt='" + bookTitle + "' width='300'/></center>" + "<p>" + 
	authors + "</p><p>" + pages + "<p><p>" + subjects + "</p><p>" + 
	subjectPeople + "</p>"+ "<p>" + excerpts + "</p>";
	
	$('#mediaTitle').append(bookTitle);
	$('#mediaInfoContent').append(bookDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
}

function bookImgMList(){
	if(myBooks.length > 0){
		$('#bImage').remove();
		var book = myBooks[0];
		var bID = getOLIDNumber(book);
		var imageURL = book[bID].cover["large"];
		var img = $('<img id="bImage"/>').attr('src', imageURL);
		$('#bookImage').append($(img));
	}
	else{
		$('#bImage').remove();
	}
}