//api key needed to use the MovieDB api and access their movie info
var api_key = "af362a39277d00a53820b15e7d9137f0";
var movies;

function getTMDbConfig(){
	$.ajax({
		url: "http://themoviedb.apiary.io/3/configuration",
		
		
	})
}

//Uses an ajax call to query the MovieDb and returns a JSON object containing possible matches for the queried movie
function getMovieInfo(title){
	query = queryFormat(title);
	$.ajax({
		url: "http://api.themoviedb.org/3/search/movie",
		dataType: "json",
		data: {api_key: api_key , query: query},
		/*success: function(data){
			console.log("Retrieved Movie Info Successfully \n")
			console.log(data);
		},*/
		success: getMovieInfoSuccess,
		error: function(status){
		     console.log("Error: Service Unavailable"); 
		 },
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
		mediaSelect($(this).index());
	})
	$('#mediaReturn' ).listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

function queryFormat(query){
	query = query.replace(/ /g, "+");
	console.log(query);
	return query;
}

function mediaSelect(index){
	//var index = $("#mediaReturn li").index(this);
	console.log(index);
	console.log(movies.results[index]);
	$('#mediaQueryReturn').popup('close');
}

function clearList(){
	$('#mediaReturn').empty();
}
