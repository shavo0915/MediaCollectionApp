var api_key = "af362a39277d00a53820b15e7d9137f0";

function getTMDbConfig(){
	$.ajax({
		url: "http://themoviedb.apiary.io/3/configuration",
		
		
	})
}

function getMovieInfo(){
	$.ajax({
		url: "http://api.themoviedb.org/3/search/movie",
		dataType: "json",
		data: {api_key: api_key , query: "Fight+Club"},
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
	console.log("Retrieved Movie Info Successfully \n")
	console.log(data);
}
