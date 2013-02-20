var games;

/*Initiates AJAX call. We send a query string which in this case is the game name and depending on whether we establish a 
 * connection with the database we either call the success function or print out an error to the user.
 */ 
function getGameInfo(gameName){
	$.ajax({
		url: " http://thegamesdb.net/api/GetGamesList.php",
		dataType: "xml",
		data: {name: gameName},
		success: getGameInfoSuccess,
		error: function(status){
			alert("Error");
		    console.log("Error: Service Unavailable"); 
		 },
		complete: function(){
			console.log("getGameInfo Done");
			  }
	});
}

/*Based on whether we get a successful call to the database we first check if the XML object that is being returned actually has 
 * valuable information. This is dont specifically by checking it's length.  If there is no query match we output a message to the user
 * stating so, otherwise we retrieve the game list with title, year, and platform of the game displayed in a list.*/
function getGameInfoSuccess(data){
	clearList();
	console.log("Retrieved Game Info Successfully \n")
	
	games = data;
	
	if($(data).find("Game").length == 0){
		var listElement = "<li><h1>No Matches found!!</h1></li>";
		$('#mediaReturn').append(listElement);
		$('#mediaReturn').listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
		return;
	}
	
	else{		
		$(data).find("Game").each(function()
			{				
				var listElement = "<li><a href='#'><h1>" + $(this).find("GameTitle").text() + "</h1><p>" + $(this).find("ReleaseDate").text() + "<p><p>" 
				+ $(this).find("Platform").text() + "</p>" + "</a></li>";
				$('#mediaReturn').append(listElement);
		
			})
	
		$('#mediaReturn li').click(function() {
			mediaSelect($(this).index());
		})
		$('#mediaReturn' ).listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
	}
}