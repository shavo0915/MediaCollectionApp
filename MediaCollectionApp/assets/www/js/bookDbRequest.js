var booksList;	//Stores the list of books retrieved from the query
var bookData;	//Stores a chosen books that after shoosing from the booksList
var myBooks = []; //used to store a users book collection
var bookIndex; //clicked books index
var OLID;	//Used to store a books OLID

/*this function takes the users entered string and queries the open library for a list of books that match. Depending on whether
 * the query was succesful or not we either print out an error to the user or call getBookListInfoSucess*/
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

/*Upon a successful query we build a list with the returned items and display it to the user*/
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
	
	//checks in case there are undefined items. If so we set their corresponding variable to an empty string so they 
	//wont be displayed to the user.
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
	
	//assigns a click listener to each list element in the listview in the mediaQueryReturn popup to hanle the selection of a book
	$('#mediaReturn li').click(function() {
		getChosenBookInfo($(this).index());
	});
	$('#mediaReturn').listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

/*This method gets the book key or OLID of the chosen book and calls a query for said books detailed information.*/
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
	
	//Calls the query to get more detailed information on the chosen book so it can be either stored immediatley or viewed. 
	queryBookInfo(bookId);
	
	OLID = "OLID:" + bookId;
}

/*Query to get the chosen books detailed information. On error we print out an appropriate message. If the query is successful we call 
 * getBookInfoSucess.*/
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

/*On a successful we store the returned data into an object to be able to access it later and overwrite 
 * the methods on the add media dialog box.*/
function getBookInfoSuccess(data){ 
	bookData = data;
	$('#addMediaButton').attr('onclick', "addBookToCollection()");
	$('#displayInfoButton').attr('onclick', "displayBookDetails()");
}

/*This method is used to display a books detailed information. If there is none we display an appropriate message to the user.*/
function displayBookDetails(){
	var authors = "<b>Author(s): </b>";
	var subjects = "<b>Subjects: </b>";
	var subjectPeople = "<b>People: </b>";
	var excerpts = "<b>Excerpts: </b>";
	var pages = "<b>Pages: </b>";
	
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	
	//Check to see if the detailed info object exists
	alert(JSON.stringify(bookData[OLID].subjects));
	if(bookData[OLID]){
		
		//Checks if the information in the detailed info object isn't empty. If it is we don't even display 
		//the info. 
		if(bookData[OLID].authors !== undefined){
			if(bookData[OLID].authors.length > 1){
				for(var y in bookData[OLID].authors){
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

/*Adds a book to the local collection array. The list is then sorted alphabetically and the list is then built by calling another method.*/
function addBookToCollection(){
	
	//Check to make sure that the detailed info object exists
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
		
		//Add detailed book data into the books array
		myBooks.push(bookData);
	
		//Sort the books in the books array by name
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
	
		//Turn the books array into a string and add it to local storage
		localStorage.bookList = JSON.stringify(myBooks);
	
		//builds the books list
		buildBookList()
	
		setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
		$('#addMediaConfirm').bind({
			popupafterclose: function(event, ui){
				$('#addToCollection').dialog('close');
			}
		})
	}
	else{
		//Outputs a message telling the user that no detailed information for the book was found.
		setTimeout( function(){ $( '#addMediaFailed' ).popup( 'open' ) }, 100 );
		$('#addMediaFailed').bind({
			popupafterclose: function(event, ui){
				$('#addToCollection').dialog('close');
			}
		})
	}
	$('#mainList').listview("refresh");
	
	//method call to update the main list
	bookImgMList();
	
	$('#mainList').listview("refresh");
}

/*Builds the book list and displays the image, book title and the books author if applicable.*/
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

/*Since the JSON objects main key is dynamic, this method turns said object into a string in order to be able to parse out
the objects key in order to be able to access its contents and returns it.*/
function getOLIDNumber(myBooks){
	var objectString = JSON.stringify(myBooks);
	var begOLIDIndex;
	var endOLIDIndex;
	
	begOLIDIndex = objectString.indexOf('OLID:');
	endOLIDIndex = objectString.indexOf('":');
	OLIDString = objectString.substring(begOLIDIndex, endOLIDIndex);
	
	return OLIDString;
}

/*Deletes a book from local storage*/
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

/*Displays the collected books detailed information stored in a users collection.*/
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

/*This function checks if the books list has at least one item. If it does it pulls the image from the first item in the 
 * list and adds it to the main lists picture. If there is no item In the list no picture is shown in the main list.*/
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