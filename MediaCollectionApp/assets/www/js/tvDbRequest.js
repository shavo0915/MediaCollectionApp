var tv_api_key = "BF26105C26700C21";
var mirrorPath = "http://thetvdb.com";
var tvData;
var tvDataDetails;
var singleMatch = false;
var myShows = [];
var tvIndex;

function getTVShowInfo(title){
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: "http://thetvdb.com/api/GetSeries.php",
		data: {seriesname: title},
		dataType: "xml",
		success: getTVShowInfoSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getTVShowInfo Done");
			}
	});
}

function getTVShowInfoSuccess(data){
	clearList();
	tvData = $.xml2json(data);
	
	if(tvData.Series == null){
		var listElement = "<li style='font-size:18px' >No Matches found!!</li>";
		$('#mediaReturn').append(listElement);
		$('#mediaReturn').listview( "refresh" );
		$('#mediaQueryReturn').popup('open');
		setTimeout( function(){ $( '#mediaQueryReturn' ).popup( 'close' ) }, 1500 );
		return;
	}
	
//	alert(JSON.stringify(tvData.length));
//	alert(tvData.Series[1].FirstAired);
//	alert(tvData.Series[0].FirstAired);
//	console.log(JSON.stringify(tvData.Series));

	if(tvData.Series.length == null){
		singleMatch = true;
		var listElement = "<li><a href='#'><h1>" + tvData.Series.SeriesName + "</h1>";
		var elementEnd;
		if(tvData.Series.FirstAired == null){
			elementEnd = "</a></li>";
			listElement = listElement.concat(elementEnd);
		}else{
			elementEnd = "<p> (" + tvData.Series.FirstAired.substr(0,4) + ")</p></a></li>";
			listElement = listElement.concat(elementEnd);
		}
		$('#mediaReturn').append(listElement);
	}else{	
		singleMatch = false;
		for(var x in tvData.Series){
			var listElement = "<li><a href='#'><h1>" + tvData.Series[x].SeriesName + "</h1>";
			var elementEnd;
			if(tvData.Series[x].FirstAired == null){
				elementEnd = "</a></li>";
				listElement = listElement.concat(elementEnd);
			}else{
				elementEnd = "<p> (" + tvData.Series[x].FirstAired.substr(0,4) + ")</p></a></li>";
				listElement = listElement.concat(elementEnd);
			}
			$('#mediaReturn').append(listElement);
		}
	}
	$('#mediaReturn li').click(function() {
		tvShowSelect($(this).index());
	});
	$('#mediaReturn').listview( "refresh" );
	$('#mediaQueryReturn').popup('open');
}

function tvShowSelect(index){
	var selection;
	if(singleMatch == false){
		selection = tvData.Series[index];
	}else{
		selection = tvData.Series;
	}
	
	//Clear dialogs header first just in case we had already appended a title
	$("#mediaType").empty();
	var mediaPopup = "Add TV Shows"
	$('#mediaType').append(mediaPopup);
	
	
	$('#addMediaButton').attr('onclick', "addTVShow()");
	$('#displayInfoButton').attr('onclick', "displayTVShowDetails()");
	
	//Manually change the page to the dialog with 2 buttons. Either add to collection or view more info.
	$.mobile.changePage('#addToCollection', {transition: 'pop', role: 'dialog'});
	
	$('#mediaQueryReturn').popup('close');
	
	getTVShowDetail(selection.seriesid)
}

function addTVShow(){
	for(var i = 0; i < myShows.length; i++){
		if(myShows[i].Series.id == tvDataDetails.Series.id){
	//		$('#addToCollection').dialog('close');
			$('#addExistingMedia').bind({
				popupafterclose: function(event, ui){
					$('#addToCollection').dialog('close');
				}
			})
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'open' ) }, 100 );
			setTimeout( function(){ $( '#addExistingMedia' ).popup( 'close' ) }, 1500 );
			return;
		}			
	}
	
	//adds the selected tv show object to the array of shows representing the user's movie collection and then sorts them alphabetically
	myShows.push(tvDataDetails);
	myShows.sort(function (a, b){
		var titleA = a.Series.SeriesName.toLowerCase(), titleB = b.Series.SeriesName.toLowerCase();
		if (titleA < titleB)
			return -1;
		if (titleA > titleB)
			return 1;
		return 0;
	});
	
	localStorage.tvList = JSON.stringify(myShows);
	
	buildTVList();
	
	tvShowImgMList();
	$('#mainList').listview("refresh");

	
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'open' ) }, 100 );
	$('#addMediaConfirm').bind({
		popupafterclose: function(event, ui){
			$('#addToCollection').dialog('close');
		}
	})
	setTimeout( function(){ $( '#addMediaConfirm' ).popup( 'close' ) }, 1500 );
}

function displayTVShowDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var tvTitle = tvDataDetails.Series.SeriesName;
	var imageURL = "http://thetvdb.com/banners/" + tvDataDetails.Series.poster;
	var castLength = tvDataDetails.Series.Actors.length;
	var cast = "";
	if(castLength > 0){	
		var castArray = tvDataDetails.Series.Actors;
		castArray = castArray.slice(1);
		castArray = castArray.split("|");
		castLength = castArray.length;
		cast = castArray[0];
		for(var i = 1; i < castLength; i++){  
			if(i < 7){
				var cast = cast + ", " + castArray[i];
			}else{
				break;
			}			
		}
	}
	var tvShowDetails = "<center><img src='" + imageURL + "' alt='" + tvTitle + "' width='300'/></center>" + "<b>First Aired: </b>" + tvDataDetails.Series.FirstAired + "</p>"
		+ "</p>" + "<p><b>Overview: </b><br>" + tvDataDetails.Series.Overview + "</p>" + "<p><b>Cast: </b><br>" + cast + "</p>" + 
		"<p><b>Runtime: </b>" + tvDataDetails.Series.Runtime + " min</p>";
	$('#mediaTitle').append(tvTitle);
	$('#mediaInfoContent').append(tvShowDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'}); 
}

function getTVShowDetail(showID){
	var url = "http://thetvdb.com/data/series/" + showID + "/all/";
	
	$.ajax({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); },
		url: url,
		dataType: "xml",
		success: getTVShowDetailSuccess,
		error: errorAlert,
		complete: function(){
			$.mobile.hidePageLoadingMsg();
			console.log("getTVShowDetail done");
		}
	});
}

function getTVShowDetailSuccess(data){
	tvDataDetails = $.xml2json(data);
	delete tvDataDetails["Episode"]
	//alert(JSON.stringify(tvDataDetails));
}

function buildTVList(){
	
	$('#tvShowList').empty();
	
	for(var x in myShows){
		var imageURL = "http://thetvdb.com/banners/" + myShows[x].Series.poster;
	//	alert(imageURL);
		var tvItem = "<li data-myTVShowsIndex = " + x + "><a href=''><img src='" + imageURL + "'/><h3>" + myShows[x].Series.SeriesName + "</h3>";
		var elementEnd;
		if(myShows[x].Series.FirstAired == null){
			elementEnd = "<p></p></a></li>";
			tvItem = tvItem.concat(elementEnd);
		}else{
			elementEnd = "<p>" + myShows[x].Series.FirstAired.substr(0,4) + "</p></a></li>";
			tvItem = tvItem.concat(elementEnd);
		}
		$('#tvShowList').append(tvItem);
	};

	$('#tvShowList li').click(function() {
		openTVShowDialog($(this).attr('data-myTVShowsIndex'));
	});

	$('#tvShowList').listview("refresh");

	$('#tvShowCount').text(myShows.length);
}

function openTVShowDialog(index){
	console.log(index);
	tvIndex = index;
	$("#mediaOptionsDisplayInfoButtonTitle").empty();
	$("#mediaOptionsDisplayInfoButtonTitle").append("TV Show Info");
	$('#mediaOptionsDisplayInfoButton').attr('onclick', "displayCollectedTVShowDetails()");
	$('#mediaOptionsDeleteButton').attr('onclick', "deleteTVShow()");
	$('#mediaOptionsLink').click();
}

function deleteTVShow(){
	myShows.splice(tvIndex, 1);
	alert(myShows.length);
	if(myShows.length == 0){
		localStorage.removeItem("tvList");
	}else{
		localStorage.tvList = JSON.stringify(myShows);
	}
	alert(myShows.length);
	buildTVList();
	
	tvShowImgMList();
	$('#mainList').listview("refresh");
	
	$('#mediaOptions').dialog('close');
}

function displayCollectedTVShowDetails(){
	//clear header Title to account for multiple uses 
	$("#mediaTitle").empty();
	//Clear game content to account for multiple uses 
	$("#mediaInfoContent").empty();
	var tvShowTitle = myShows[tvIndex].Series.SeriesName;
	var imageURL = "http://thetvdb.com/banners/" + myShows[tvIndex].Series.poster;
	var castLength = myShows[tvIndex].Series.Actors.length;
	var cast = "";
	if(castLength > 0){	
		var castArray = myShows[tvIndex].Series.Actors;
		castArray = castArray.slice(1);
		castArray = castArray.split("|");
		castLength = castArray.length;
		cast = castArray[0];
		for(var i = 1; i < castLength; i++){  
			if(i < 7){
				var cast = cast + ", " + castArray[i];
			}else{
				break;
			}			
		}
	}
	var tvShowDetails = "<center><img src='" + imageURL + "' alt='" + tvShowTitle + "' width='300'/></center>" + "<b>First Aired: </b>" + myShows[tvIndex].Series.FirstAired + "</p>"
	+ "</p>" + "<p><b>Overview: </b><br>" + myShows[tvIndex].Series.Overview + "</p>" + "<p><b>Cast: </b><br>" + cast + "</p>" + 
	"<p><b>Runtime: </b>" + myShows[tvIndex].Series.Runtime + " min</p>";
	$('#mediaTitle').append(tvShowTitle);
	$('#mediaInfoContent').append(tvShowDetails);
	$.mobile.changePage('#mediaInfo', {transition: 'pop', role: 'dialog'}); 
}

/*This function checks if the shows list has at least one item. If it does it pulls the image from the first item in the 
 * list and adds it to the main lists picture. If there is no item In the list no picture is shown in the main list.*/
function tvShowImgMList(){
	if(myShows.length > 0){
		$('#sImage').remove();
		var imageURL = "http://thetvdb.com/banners/" + myShows[0].Series.poster;
		var img = $('<img id="sImage"/>').attr('src', imageURL);
		$('#tvShowImage').append($(img));
	}
	if(myShows.length > 0){
		
	}
	else{
		$('#sImage').remove();
	}
}