//api key needed to use the MovieDB api and access their movie info
var api_key = "af362a39277d00a53820b15e7d9137f0";
var movies;
var baseAddress;
var posterSize;
var myMovies = [];

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

//Uses an ajax call to query the MovieDb and returns a JSON object containing possible matches for the queried movie
function getMovieInfo(title){
	query = queryFormat(title);
	$.ajax({
		url: "http://api.themoviedb.org/3/search/movie",
		dataType: "json",
		data: {api_key: api_key , query: query},
		success: getMovieInfoSuccess,
		error: errorAlert,
		complete: function(){
				  console.log("getMovieInfo Done");
			  }
	});
}

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
	console.log("Retrieved Movie Info Successfully \n")
	console.log(data);
	//console.log(data.results[0].title);
	
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
	
	$('#mediaReturn li').click(function() {
		movieSelect($(this).index());
	})
	$('#mediaReturn').listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

function queryFormat(query){
	query = query.replace(/ /g, "+");
	console.log(query);
	return query;
}

function movieSelect(index){
	console.log(index);
	console.log(movies.results[index]);
	
	var selection = movies.results[index];
	$('#movieList').empty();
	
	myMovies.push(selection);
	myMovies.sort(function (a, b){
		var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
	
	for(var x in myMovies){
		var posterPath = myMovies[x].poster_path;
		var movieItem = "<li><a href=''><img src=" + baseAddress + posterSize + posterPath + "/><h3>" + myMovies[x].title + "</h3>";
		var elementEnd;
		if(myMovies[x].release_date == null){
			elementEnd = "<p></p></a></li>";
			movieItem = movieItem.concat(elementEnd);
		}else{
			elementEnd = "<p>" + myMovies[x].release_date.substr(0,4) + "</p></a></li>";
			movieItem = movieItem.concat(elementEnd);
		}
		$('#movieList').append(movieItem);
	}
	
	
	
	$('#movieList').listview("refresh");
	
	$('#mediaQueryReturn').popup('close');
	$.mobile.changePage( "#myMovies" );
}

function clearList(){
	$('#mediaReturn').empty();
}

function getMovieConfigSuccess(data){
	console.log("Retrieved Config Info Successfully \n")
	console.log(data);
	
	baseAddress = data.images.base_url;
	posterSize = data.images.poster_sizes[0];
}

function errorAlert(status){
	console.log("Error: Service Unavailable"); 
    clearList();
    var listElement = "<li style='font-size:18px' >Error: Service Unavailable</li>";
    $('#mediaReturn').append(listElement);
    $('#mediaReturn').listview( "refresh" );
    $('#mediaQueryReturn').popup('open');
}
