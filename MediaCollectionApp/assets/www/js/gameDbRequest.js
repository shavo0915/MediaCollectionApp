var games;

function getGameInfo(gameName){
	$.ajax({
		url: " http://thegamesdb.net/api/GetGamesList.php",
		dataType: "xml",
		data: {name: gameName},
		/*success: function(data){
			console.log("Retrieved Movie Info Successfully \n")
			console.log(data);
		},*/
		success: getGameInfoSuccess,
		error: function(status){
			alert("Error");
		    console.log("Error: Service Unavailable"); 
		 },
		complete: function(){
			alert("Complete");
			console.log("getGameInfo Done");
			  }
	});
}

function getGameInfoSuccess(data){
	clearList();
	alert("Retrieved game info!")
	//console.log("Retrieved Game Info Successfully \n")
	//console.log(data);
	alert(data.valueOf("GameTitle"));
	//alert(data.GameTitle);
	//console.log(data.GameTitle);
	
	games = data;
	for(var x in data.results){
		var listElement = "<li onclick='mediaSelect()'>" + data.GameTitle + "</li>";
		$('#mediaReturn').append(listElement);
	}
	
	$('#mediaQueryReturn').popup('open');
}

/*function queryFormat(query){
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
}*/
