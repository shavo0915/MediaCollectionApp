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
	console.log("Retrieved Movie Info Successfully \n")
	console.log(data);
	console.log(data.results[0].title);
	
	movies = data;
	for(var x in data.results){
		var listElement = "<li onclick='mediaSelect()'>" + data.results[x].title + "</li>";
		$('#mediaReturn').append(listElement);
	}
	
	$('#mediaQueryReturn').popup('open');
}

function queryFormat(query){
	query = query.replace(/ /g, "+");
	console.log(query);
	return query;
}

function mediaSelect(){
	console.log();
	$('#mediaQueryReturn').popup('close');
}

function clearList(){
	$('#mediaReturn').empty();
}
