
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

function createPad() {
  var aryOut = [];

  // Set up an empty file
  for (var i = 0; i <= 74; i++) {
    varOut.push("");
  }

  // First lets add a directives lines
  varOut[0] = "!slack !ip=" + clientIP;

  // And all the static lines
  varOut[1] = "[1] Character Index ID";
  varOut[4] = "[4] Character Name*";
  varOut[7] = "[7] Character URL ID (Important: ONLY the part that refers to your character, not a full URL! https://storium.com/character/[THIS PART ONLY]/in/game-name)";
  varOut[10] = "[10] NPC? (y/n)*";
  varOut[13] = "[13] Game Name*";
  varOut[16] = "[16] Game URL ID (Important: ONLY the part that refers to the game, not a full URL! https://storium.com/character/character-name/in/[THIS PART ONLY])";
  varOut[19] = "[19] Is this an 18+ game? (y/n)*";
  varOut[22] = "[22] Is this a Private Game? (y/n)*";
  varOut[25] = "BIO AND STATS (Keep items marked \"†\" to 1-2 words for best-looking results)";
  varOut[27] = "[27] Avatar URL (Square image, less than 500 KB.  Supports GIF, JPEG, PNG, and BMP)";
  varOut[30] = "[30] Age (numerals)";
  varOut[33] = "[33] Gender†";
  varOut[36] = "[36] Sexual Orientation/Identity (straight, pansexual, etc.)†";
  varOut[39] = "[39] COMING SOON";
  varOut[42] = "[42] Short Blurb";
  varOut[45] = "[45] Extended Blurb (use \n to create a line break)";
  varOut[48] = "# CHARACTER CARDS";
  varOut[50] = "[50] Nature Card Title†";
  varOut[53] = "[53] Nature Card Description";
  varOut[56] = "[56] Subplot Card Title†";
  varOut[59] = "[59] Subplot Card Description";
  varOut[62] = "[62] Strength Card Title†";
  varOut[65] = "[65] Strength Card Description";
  varOut[68] = "[68] Weakness Card Title†";
  varOut[71] = "[71] Weakness Card Description";
  varOut[74] = "### BLANK (Leave this)";

  // Now add our variable data
  varOut[2] = userName + $("#cindexId").val();  // index id
  varOut[5] = $('#characterName').val();  // name
  varOut[8] = $('#characterPageCuri').val();  // char slug
  if ($('#yesNpc')[0].checked) {
    varOut[11] = 'y'; // npc y/n
  } else {
    varOut[11] = 'n'; // npc y/n
  }
  varOut[14] = $('#gameName').val(); // game Name
  varOut[17] = $('#characterPageGuri').val(); // game slug
  if ($('#isAdult')[0].checked) {
    varOut[20] = "y"; // 18+ y/n
  } else {
    varOut[20] = "n"; // 18+ y/n
  }
  if ($('#isPrivate')[0].checked) {
    varOut[23] = "y"; // 18+ y/n
  } else {
    varOut[23] = "n"; // 18+ y/n
  }
  varOut[28] = $('#avatarLink').val(); // avatar URL
  varOut[31] = $('#age').val(); // age
  varOut[34] = $("#genderIdentity").val(); // gender
  varOut[37] = $("#sexualOrientation").val(); // sexual orientation
  varOut[43] = ""; // short blurb
  varOut[46] = ""; // extended blurb
  varOut[51] = ""; // nature card Title
  varOut[54] = ""; // nature card desc
  varOut[57] = ""; // subplot card title
  varOut[60] = ""; // subplot card desc
  varOut[63] = ""; // strength card title
  varOut[66] = ""; // strength card desc
  varOut[69] = ""; // weakness card Title
  varOut[72] = ""; // weakness card desc


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
