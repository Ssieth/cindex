
/* Grab username and character ID from the URL if we can */
var userName = "";
var cindexID = "";
var baseURL = "https://cabbit.org.uk/cindex";
var thisURL = window.location.href;
var thisURLExtras = thisURL.replace(baseURL,"");

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function addLineBreaks(text) {
  return text.replaceAll("\\n","\n");
}

/* Process the URL we've been given and try to get slack username and cindex ID from it */
function processURL() {
  console.log(thisURLExtras.trim().length);
  if (thisURLExtras.trim().length >  1) {
    // We have some extra after the base url so it might be the username and
    var aryExtras = thisURLExtras.split("/");
    // We should have a length of 3, really.  [0] will be empty, [1] will be username, [2] will be code
    userName = aryExtras[1];
    $("#slackUsername").val(userName);
    if (aryExtras.length > 2) {
      cindexID = aryExtras[2];
    }
    if (cindexID == "") {
      getCindexListArray();
    }
    console.log("Loaded from URL: @" + userName + "/" + cindexID);
  }
}

function getCindexListArray() {
  if (userName === "") {
    return "No User";
  }
  var url = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName;
  $.get(url,function(data) {
    console.log("Loaded cindex list: " + url);
    console.log(data);
    $select.find("option").remove();
    var arr = data.split("\n");
    if (arr.length < 1) {
      return "No lines in file";
    }
    if (arr[0].substr(0,1) != "!") {
      // There's no directive line so we need to add one
      arr.splice(0,0,"!slack");
    }
    if (arr.length < 2) {
      return "No lines in file";
    }
    var $select = $('#entrySelect');
    // remove all of the old options
    // add new options
    $select.append("<option value='' disabled='disabled' selected='selected'>Select one--</option>");
    for (var i = 1; i < arr.length; i++) {
      $select.append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
  });
  return "";
}

function getCindexPad() {
  if (cindexID === "" || userName === "") {
    return "";
  }
  var url = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName + "_" + cindexID;
  $.get(url,function(data) {
    console.log("Loaded cindex pad: " + url);
    var arr = data.split("\n");
    if (arr.length < 2) {
      /* too short - not a valid file */
      return "";
    }
    if (arr[0] == "<!DOCTYPE html>\r") {
      return "";
    }
    if (arr[0].substr(0,1) != "!") {
      // There's no directive line so we need to add one
      arr.splice(0,0,"!slack");
    }
    var indexID = arr[2];
    var charName = arr[5];
    var charURI = arr[8];
    var isNPC = (arr[11].trim().toLowerCase() == "y");
    var gameName = arr[14];
    var gameURI = arr[17];
    var isAdult = (arr[20].trim().toLowerCase() == "y");
    var isPrivate = (arr[23].trim().toLowerCase() == "y");
    var avatarLink = arr[28];
    var age = arr[31];
    var gender = arr[34];
    var orientation = arr[37];
    var shortBio = arr[43];
    var longBio = arr[46];
    var natureTitle = arr[51];
    var natureDesc = arr[54];
    var subplotTitle = arr[57];
    var subplotDesc = arr[60];
    var strTitle = arr[63];
    var strDesc = arr[66];
    var weakTitle = arr[69];
    var weakDesc = arr[72];

    $("#characterName").val(charName);
    $("#characterPageCuri").val(charURI);
    $("#characterPageGuri").val(gameURI);
    $('#gamePageGuri').val(gameURI);
    $("#characterPageLink").val("https://storium.com/character/" + charURI + "/in/" + gameURI);
    $("#gamePageLink").val("https://storium.com/game/" + gameURI);
    $("#gameName").val(gameName);
    $("#avatarLink").val(avatarLink);

    if (isNPC) {
      $('#yesNpc').click();
    } else {
      $('#noNpc').click();
    }

    if (isPrivate) {
      $('#isPrivateButton').click();
    }

    if (isAdult) {
      $('#isAdult').click();
    }

    $('#age').val(age);
    $('#genderIdentity').val(gender);
    $('#sexualOrientation').val(orientation);
    $('#shortBio').val(addLineBreaks(shortBio));
    $('#longBio').val(addLineBreaks(longBio));

    $('#natureTitle').val(addLineBreaks(natureTitle));
    $('#natureDescription').val(addLineBreaks(natureDesc));

    $('#subplotTitle').val(addLineBreaks(subplotTitle));
    $('#subplotDescription').val(addLineBreaks(subplotDesc));

    $('#strengthTitle').val(addLineBreaks(strTitle));
    $('#strengthDescription').val(addLineBreaks(strDesc));

    $('#weaknessTitle').val(addLineBreaks(weakTitle));
    $('#weaknessDescription').val(addLineBreaks(weakDesc));

  });

}

/* Show the Welcome Modal on page load */
$( document ).ready(function() {
  /* Only throw modal if we don't have the details we need */
  processURL();
  if (cindexID === "") {
    $('#welcomeModal').modal({
      keyboard: false
    });
    //$('#welcomeModal').modal('show');
    $('#rowEntrySelect').hide();
		$('#ifNoEntries').hide();
		$('#rowCreateEntry').show();
  } else {
    $("#cindexId").val(cindexID);
    $("#userName").val(userName);
    getCindexPad();
  }
});

    /* Set Button Script: Character Page URI (Gets URIs, sets URI fields) */
$('#buttonSetCharacterPage').click(function() {
        var $characterPageLink = $('#characterPageLink').val();
        var $characterPageMatch = $characterPageLink.match(/https:\/\/storium.com\/character\/(.*?)\/in\/(.*)/);
        $('#characterPageCuri').val($characterPageMatch[1]);
        $('#characterPageGuri').val($characterPageMatch[2]);
    });

 /* Edit/Create Toggle */

 $("input[name='selectEditCreate']").change(function () {
	 var numEntries = 0; // for testing
   numEntries = $('#entrySelect').find("option").length;

	 // if edit is selected
	 	 if ($('#selectEdit' ).prop( 'checked' ) ) {

		 // and if there are more than 0 entries
		 if ( numEntries > 0 ) {

			 // hide new id input, show entry select
			 $('#rowCreateEntry').slideUp();
			 $('#rowEntrySelect').slideDown();
		 }

		 // otherwise show the "you need to create an entry" message
		 else {
			 $('#ifNoEntries').slideDown();
			 $('#rowCreateEntry').slideDown();
			 $('#rowSelectEditCreate').slideUp();
		 }
	 }

	 // otherwise, show the create entry input
	 else {
		$('#rowEntrySelect').slideUp();
		$('#rowCreateEntry').slideDown();
	 }
     });


function checkModalInfo() {
  var isOK = true;
  if (userName == "") {
    isOK = false;
  }
  if (cindexID == "") {
    isOK = false;
  }

  $('#modalEditChar').prop('disabled', !isOK);
  return isOK;
}

// Handle what happends when we hide hte modal
$("#welcomeModal").on('hide.bs.modal', function (e) {
  if (checkModalInfo()) {
  } else {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});


/* Set Button Script: Game Page URI (Gets URI, sets URI field) (*/
$('#buttonSetGamePage').click(function() {
        var $gamePageLink = $('#gamePageLink').val();
        var $gamePageMatch = $gamePageLink.match(/https\:\/\/storium.com\/game\/(.*)/);
        $('#gamePageGuri').val($gamePageMatch[1]);
    });


// Change of slack userName
$("#slackUsername").blur(function() {
  userName = $("#slackUsername").val();
  getCindexListArray();
});

// NPC toggle
$("input[name='typeNpc']").change(function () {
	// if yes
        if ($( '#yesNpc' ).prop( 'checked' )) {
		// switch character/game page input in url block
            $( '#blockCharacterPage' ).slideUp();
		$( '#blockGamePage' ).slideDown();
        } else {
		// otherwise switch it back
		$( '#blockCharacterPage' ).slideDown();
		$( '#blockGamePage' ).slideUp();
	}
    });

// Unlisted toggle
$( '#isUnlisted' ).change(function() {
	// if "no name" toggled on
	 if ($( '#isUnlisted' ).prop( 'checked' )) {
		 // hide everything
		 $( '#blockPages, #blockGameName' ).slideUp();
	 }
	 else {
		 // else if game is private
		 if ($( '#isPrivate').prop( 'checked' )) {
			 // show game name block
			 $( '#blockGameName' ).slideDown();
		 }
		 else {
		 // otherwise show everything
			 $( '#blockPages, #blockGameName' ).slideDown();
		 }
	 }

  });

// Private Game Toggle
$('#isPrivate').change(function() {
	// if "private" is toggled on
	 if ( $( '#isPrivate' ).prop( 'checked' ) ) {
		 // hide url block
		 $( '#blockPages' ).slideUp();
	 }
	 else {
		 // else if game is unlisted (no name)
		 if ($( '#isUnlisted' ).prop( 'checked' )) {
			 // do nothing
		 }
		 else {
			 // otherwise show url block
			 $( '#blockPages' ).slideDown();
		 }
	 }

 });

 // Handle new cindex id from dialog
 $("#newCindexId").change(function() {
   cindexID = $("#newCindexId").val();
   $("#cindexId").val(cindexID);
   checkModalInfo();
   getCindexPad();
 });

$("#entrySelect").change(function() {
  cindexID = $("#entrySelect").val();
  $("#cindexId").val(cindexID);
  checkModalInfo();
  getCindexPad();
});

$('#modalEditChar').click(function() {
  $('#welcomeModal').modal('hide');
})
