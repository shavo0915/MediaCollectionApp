//api key needed to use the MovieDB api and access their movie info
var api_key = "af362a39277d00a53820b15e7d9137f0";
var movies;
var baseAddress;
var posterSize;
var selImageURL;
var myMovies = [];
var movieIndex;
var movieData;

/**
 * This function is run when the addMedia page is created and is used to get the base address for the movie posters and the poster sizes
 * available. Upon a successful call, the function getMovieConfigSuccess is called, otherwise, a popup indicating the service is unavailable
 * is shown.
**/
function getTMDbConfig(){
	$.ajax({
		url: "http://api.themoviedb.org/3/configuration",
		dataType: "json",
		data: {api_key: api_key},
		success:  getMovieConfigSuccess,
		error: errorAlert,
		complete: function(){
			console.log("getTMDbConfig done");
			}
	});
}

/**
 * An ajax call is used to query the MovieDb and return a JSON object containing possible matches for the queried movie. The entered movie
 * title and the api key are sent as data in the ajax call. A successful query will call the getMovieInfoSuccess function
 **/
function getMovieInfo(title){
	query = queryFormat(title);
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: "http://api.themoviedb.org/3/search/movie",
		dataType: "json",
		data: {api_key: api_key, query: query, include_adult: false},
		success: getMovieInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getMovieInfo Done");
			}
	});
}

/**
 * Function handles the returned JSON object from the getMovieInfo ajax call. It first checks if no mathces for the entered movie title were
 * found. It then populates a listview with the titles and release dates of the movies contained within the JSON object. The JSON is also
 * saved for use in later functions
 */
function getMovieInfoSuccess(data){
	clearList();
	//Checks to see if the query returned no results, if so, displays popup indicating no matches were found and exit function
	if(data.results.length == 0){
		var listElement = "<li style='font-size:18px' >No Matches found!!</li>";
		$('#mediaReturn').append(listElement);
		$('#mediaReturn').listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
		return;
	}
//	console.log(data);
	movies = data;
	for(var x in data.results){
		var listElement = "<li><a href='#'><h1>" + data.results[x].title + "</h1>";
		var elementEnd;
		if(data.results[x].release_date == null){
			elementEnd = "</a></li>";
			listElement = listElement.concat(elementEnd);
		}else{
			elementEnd = "<p> (" + data.results[x].release_date.substr(0,4) + ")</p></a></li>";
			listElement = listElement.concat(elementEnd);
		}
		$('#mediaReturn').append(listElement);
	}
	
	//assigns a click listener to each list element in the listview in the mediaQueryReturn popup to hanle the selection of a movie
	$('#mediaReturn li').click(function() {
		movieSelect($(this).index());
	});
	$('#mediaReturn').listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

/**
 * This function simply takes in the query string from the addMedia page and properly formats it so it can be read by the MovieDb api
 * @param query
 * @returns a CGI formatted string (query)
 */
function queryFormat(query){
	query = query.replace(/ /g, "+");
	console.log(query);
	return query;
}

/**
 * Function is called when a user clicks on a movie title in the mediaQueryReturn popup in order to add it to their collecion. It first
 * checks if the selected movie already exists in the users collection. If not, it adds the movie and then re-sorts the movies alphabetically.
 * It then assembles the html elements and re-populates the listview on the myMovies page and refreshes it. The user is then notified
 * that the movie was successfully added to their collection
 * @param index
 */
function movieSelect(index){		
	var selection = movies.results[index];
	
	//Clear dialogs header first just in case we had already appended a title
	$("#mediaType").empty();
	var mediaPopup = "Add Movies"
	$('#mediaType').append(mediaPopup);
	
	
	$('#addMediaButton').attr('onclick', "addMovie()");
	$('#displayInfoButton').attr('onclick', "displayMovieDetails()");
	
	//Manually change the page to the dialog with 2 buttons. Either add to collection or view more info.
	$.mobile.changePage('#addToCollection', {transition: 'pop', role: 'dialog'});
	
	$('#mediaQueryReturn').popup('close');
	
	getMovieDetail(selection.id);
	

}

/**
 * This function is used to clear the mediaReturn listview
 */
function clearList(){
	$('#mediaReturn').empty();
}

/**
 * This fucntion handles the returned JSON object from the getMovieConfif function. It is used to get the base address for the movie
 * posters and the available sizes for the poster. We assign the base address and the smallest poster size to variables to be used to 
 * later to assemble the url for the selected movie posters
 * @param data
 */
function getMovieConfigSuccess(data){
	console.log("Retrieved Config Info Successfully \n")
	console.log(data);
	
	baseAddress = data.images.base_url;
	posterSize = data.images.poster_sizes[3];
	localStorage.baseAddress = baseAddress;
	localStorage.posterSize = posterSize;
}

/**
 * This fucntion is called whenever an ajax call to the MovieDb fails. It opens a popup and notifies the user that there was an error and
 * that the service is unavailable.
 * @param status
 */
function errorAlert(status){
	console.log("Error: Service Unavailable"); 
    clearList();
    var listElement = "<li style='font-size:18px' >Error: Service Unavailable</li>";
    $('#mediaReturn').append(listElement);
    $('#mediaReturn').listview( "refresh" );
    $('#mediaQueryReturn').popup('open');
}

function openMovieDialog(index){
	console.log(index);
	movieIndex = index;
	$("#mediaOptionsDisplayInfoButtonTitle").empty();
	$("#mediaOptionsDisplayInfoButtonTitle").append("Movie Info");
	$('#mediaOptionsDisplayInfoButton').attr('onclick', "displayCollectedMovieDetails()");
	$('#mediaOptionsDeleteButton').attr('onclick', "deleteMovie()");
	$('#mediaOptionsLink').click();
}

function deleteMovie(){
	myMovies.splice(movieIndex, 1);
	if(myMovies.length == 0){
		localStorage.removeItem("movieList");
	}else{
		localStorage.movieList = JSON.stringify(myMovies);
	}
	buildMovieList();
	$('#mediaOptions').dialog('close');
	
	movieImgMList();
	$('#mainList').listview("refresh");
}

/**
 * Checks if the release date is null and then assembles the appropriate html elements to add to the listview; the movieList 
 *	listview is always cleared and re-populated when a new movie is added
 */
function buildMovieList(){
	
	$('#movieList').empty();
	
	for(var x in myMovies){
		var posterPath = myMovies[x].poster_path;
		var movieItem = "<li data-myMoviesIndex = " + x + "><a href=''><img src=" + baseAddress + posterSize + posterPath + "/><h3>" + myMovies[x].title + "</h3>";
		var elementEnd;
		if(myMovies[x].release_date == null){
			elementEnd = "<p></p></a></li>";
			movieItem = movieItem.concat(elementEnd);
		}else{
			elementEnd = "<p>" + myMovies[x].release_date.substr(0,4) + "</p></a></li>";
			movieItem = movieItem.concat(elementEnd);
		}
		$('#movieList').append(movieItem);
	};

	$('#movieList li').click(function() {
		openMovieDialog($(this).attr('data-myMoviesIndex'));
	});

	$('#movieList').listview("refresh");

	$('#movieCount').text(myMovies.length);
}

function getMovieDetail(movieID){
	var detailURL = "http://api.themoviedb.org/3/movie/" + movieID
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: detailURL,
		dataType: "json",
		data: {api_key: api_key, append_to_response: "casts"},
		success: getMovieDetailSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getMovieDetail done");
		}
	});
}

function getMovieDetailSuccess(data){
	movieData = data;	
	selImageURL = baseAddress + posterSize + movieData.poster_path;
}

function addMovie(){
	//this checks if the selected movie already exists in the user's collection
	for(var i = 0; i < myMovies.length; i++){
		if(myMovies[i].id == movieData.id){
	//		$('#addToCollection').dialog('close');
			$('#addExistingMedia').bind({
				popupafterclose: function(event, ui){
					$('#addToCollection').dialog('close');
				}
			})
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
			return;
		}			
	}
	
	//adds the selected movie object to the array of movies representing the user's movie collection and then sorts them alphabetically
	myMovies.push(movieData);
	myMovies.sort(function (a, b){
		var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
	
	localStorage.movieList = JSON.stringify(myMovies);
	
	buildMovieList()
	
	movieImgMList();
	$('#mainList').listview("refresh");
	
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
	$('#addMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#addToCollection').dialog('close');
		}
	})
}

function displayMovieDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var movieTitle = movieData.title;
	var imageURL = selImageURL;
	var castLength = movieData.casts.cast.length;
	if(castLength == 0){
		cast = "";
	}else{
		if(castLength > 6){
			castLength = 6;
		}
		var cast = movieData.casts.cast[0].name;
		for(var i = 1; i < castLength; i++){
			cast = cast +", " + movieData.casts.cast[i].name;
		}
	}
	var movieDetails = "<center><img src='" + imageURL + "' alt='" + movieTitle + "' width='300'/></center>" + "<b>Release Date: </b>" + movieData.release_date + "</p>"
		+ "</p>" + "<p><b>Tagline: </b><br>" + movieData.tagline + "<p><b>Overview: </b><br>" + movieData.overview + "</p>" + "<p><b>Cast: </b><br>" + cast + "</p>" + 
		"<p><b>Runtime: </b>" + movieData.runtime + " min</p>";
	$('#mediaTitle').append(movieTitle);
	$('#mediaInfoContent').append(movieDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
}

function displayCollectedMovieDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var movieTitle = myMovies[movieIndex].title;
	var imageURL = baseAddress + posterSize + myMovies[movieIndex].poster_path;
	var castLength = myMovies[movieIndex].casts.cast.length;
	if(castLength == 0){
		cast = "";
	}else{
		if(castLength > 6){
			castLength = 6;
		}
		var cast = myMovies[movieIndex].casts.cast[0].name;
		for(var i = 1; i < castLength; i++){
			cast = cast +", " + myMovies[movieIndex].casts.cast[i].name;
		}
	}
	var movieDetails = "<center><img src='" + imageURL + "' alt='" + movieTitle + "' width='300'/></center>" + "<b>Release Date: </b>" + myMovies[movieIndex].release_date + "</p>"
		+ "</p>" + "<p><b>Tagline: </b><br>" + myMovies[movieIndex].tagline + "<p><b>Overview: </b><br>" + myMovies[movieIndex].overview + "</p>" + "<p><b>Cast: </b><br>" + 
		cast + "</p>" + "<p><b>Runtime: </b>" + myMovies[movieIndex].runtime +" min</p>";
	$('#mediaTitle').append(movieTitle);
	$('#mediaInfoContent').append(movieDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'});
}

function movieImgMList(){
	if(myBooks.length > 0){
		$('#mImage').remove();
		var posterPath = myMovies[0].poster_path;
		baseAddress = localStorage.baseAddress;
		posterSize = localStorage.posterSize;
		var imgURL = baseAddress + posterSize + posterPath;
		var img = $('<img id="mImage"/>').attr('src', imgURL);
		$('#movieImage').append($(img));
	}
	else{
		$('#mImage').remove();
	}
}