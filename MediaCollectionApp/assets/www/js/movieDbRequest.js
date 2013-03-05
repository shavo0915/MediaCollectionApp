//api key needed to use the MovieDB api and access their movie info
var api_key = "af362a39277d00a53820b15e7d9137f0";
var movies;
var baseAddress;
var posterSize;
var myMovies = [];
var movieIndex;


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
		},
		complete: function(){
			  console.log("getMovieConfig Done");
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
		url: "http://api.themoviedb.org/3/search/movie",
		dataType: "json",
		data: {api_key: api_key, query: query, include_adult: false},
		success: getMovieInfoSuccess,
		error: errorAlert,
		complete: function(){
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
	
	movies = data;
	for(var x in data.results){
		var listElement = "<li style='font-size:18px' ><a href='#'>" + data.results[x].title;
		var elementEnd;
		if(data.results[x].release_date == null){
			elementEnd = "</a></li>";
			listElement = listElement.concat(elementEnd);
		}else{
			elementEnd = " (" + data.results[x].release_date.substr(0,4) + ")</a></li>";
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
	
	//this checks if the selected movie already exists in the user's collection
	for(var i = 0; i < myMovies.length; i++){
		if(myMovies[i].title == selection.title){
			$('#mediaQueryReturn').popup('close');
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
			return;
		}			
	}
	
	//adds the selected movie object to the array of movies representing the user's movie collection and then sorts them alphabetically
	myMovies.push(selection);
	myMovies.sort(function (a, b){
		var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
	
	buildMovieList();
	
	//the popup is closed and the addMedia confirm popup is opened after giving the mediaQueryReturn popop time to close (neccessary for
	//new popup to appear
	$('#mediaQueryReturn').popup('close');
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
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
	posterSize = data.images.poster_sizes[0];
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
	$('#movieOptionsLink').click();
}

function deleteMovie(){
	myMovies.splice(movieIndex, 1);
	buildMovieList();
	$('#movieOptions').dialog('close');
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
	
	/*$('#movieList li').on('taphold',function(event, ui){ 
	openMovieDialog($(this).index());
	}); */

	$('#movieList li').click(function() {
		openMovieDialog($(this).attr('data-myMoviesIndex'));
	});

	$('#movieList').listview("refresh");

	$('#movieCount').text(myMovies.length);
}