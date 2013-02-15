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
			alert("Complete")
			console.log("getGameInfo Done");
			  }
	});
}

function getGameInfoSuccess(data){
	alert("Success");
	console.log("Retrieved Game Info Successfully \n")
	console.log(data);
}
