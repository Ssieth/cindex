/* Grab username and character ID from the URL if we can */
var userName = "";
var cindexID = "";
var baseURL = "https://cabbit.org.uk/cindex";
var thisURL = window.location.href;
var thisURLExtras = thisURL.replace(baseURL,"");

/* Replace all instances of a string */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Unescape line breaks */
function addLineBreaks(text) {
  return text.replaceAll("\\n","\n");
}

/* Escape line breaks */
function removeLineBreaks(text) {
  return text.replaceAll("\n","\\n");
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

/* Get the cindex list for the current user and set up the select for them */
function getCindexListArray() {
  if (userName === "") {
    // This shouldn't happen but....
    return "No User";
  }
  var url = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName;
  $.get(url,function(data) {
    console.log("Loaded cindex list: " + url);
    console.log(data);
    var $select = $('#entrySelect');
    $select.find("option").remove();
    var arr = data.split("\n");
    if (arr[0] == "<!DOCTYPE html>\r") {
      return "No list pad";
    }
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
    // remove all of the old options
    // add new options
	  $select[0].disabled = false;
    $select.append("<option value='' disabled='disabled' selected='selected'>Select an Entry</option>");
    for (var i = 1; i < arr.length; i++) {
      $select.append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
    }
  });
  return "";
}

/* Initialise a new cindex character pad */
function createPad_init() {
  // Set up an empty pad file
  aryPad = [];

  for (var i = 0; i <= 74; i++) {
    aryPad.push("");
  }

  return aryPad;
}

/* Add a directives line to new cindex character pad */
function createPad_addDirectives(aryPad) {
  // First lets add a directives lines
  aryPad[0] = "!slack";
}

/* Add static lines to new cindex character pad */
function createPad_addStatics(aryPad) {
  // And all the static lines
  aryPad[1] = "[1] Character Index ID";
  aryPad[4] = "[4] Character Name*";
  aryPad[7] = "[7] Character URL ID (Important: ONLY the part that refers to your character, not a full URL! https://storium.com/character/[THIS PART ONLY]/in/game-name)";
  aryPad[10] = "[10] NPC? (y/n)*";
  aryPad[13] = "[13] Game Name*";
  aryPad[16] = "[16] Game URL ID (Important: ONLY the part that refers to the game, not a full URL! https://storium.com/character/character-name/in/[THIS PART ONLY])";
  aryPad[19] = "[19] Is this an 18+ game? (y/n)*";
  aryPad[22] = "[22] Is this a Private Game? (y/n)*";
  aryPad[25] = "BIO AND STATS (Keep items marked \"†\" to 1-2 words for best-looking results)";
  aryPad[27] = "[27] Avatar URL (Square image, less than 500 KB.  Supports GIF, JPEG, PNG, and BMP)";
  aryPad[30] = "[30] Age (numerals)";
  aryPad[33] = "[33] Gender†";
  aryPad[36] = "[36] Sexual Orientation/Identity (straight, pansexual, etc.)†";
  aryPad[39] = "[39] COMING SOON";
  aryPad[42] = "[42] Short Blurb";
  aryPad[45] = "[45] Extended Blurb (use \\n to create a line break)";
  aryPad[48] = "# CHARACTER CARDS";
  aryPad[50] = "[50] Nature Card Title†";
  aryPad[53] = "[53] Nature Card Description";
  aryPad[56] = "[56] Subplot Card Title†";
  aryPad[59] = "[59] Subplot Card Description";
  aryPad[62] = "[62] Strength Card Title†";
  aryPad[65] = "[65] Strength Card Description";
  aryPad[68] = "[68] Weakness Card Title†";
  aryPad[71] = "[71] Weakness Card Description";
  aryPad[74] = "### BLANK (Leave this)";
}

/* Add form data to new cindex character pad */
function createPad_addVars(aryPad) {
  // Now add our variable data
  aryPad[2] = userName + " " + $("#cindexId").val();  // index id
  aryPad[5] = $('#characterName').val();  // name
  aryPad[8] = $('#characterPageCuri').val();  // char slug
  if ($('#yesNpc')[0].checked) {
    aryPad[11] = 'y'; // npc y/n
    aryPad[17] = $('#gamePageGuri').val(); // game slug
  } else {
    aryPad[11] = 'n'; // npc y/n
    aryPad[17] = $('#characterPageGuri').val(); // game slug
  }
  aryPad[14] = $('#gameName').val(); // game Name
  if ($('#isAdult')[0].checked) {
    aryPad[20] = "y"; // 18+ y/n
  } else {
    aryPad[20] = "n"; // 18+ y/n
  }
  if ($('#isPrivate')[0].checked) {
    aryPad[23] = "y"; // 18+ y/n
  } else {
    aryPad[23] = "n"; // 18+ y/n
  }
  aryPad[28] = $('#avatarLink').val(); // avatar URL
  aryPad[31] = $('#age').val(); // age
  aryPad[34] = $("#genderIdentity").val(); // gender
  aryPad[37] = $("#sexualOrientation").val(); // sexual orientation
  aryPad[43] = removeLineBreaks($("#shortBio").val()); // short blurb
  aryPad[46] = removeLineBreaks($("#longBio").val()); // extended blurb
  aryPad[51] = $("#natureTitle").val(); // nature card Title
  aryPad[54] = removeLineBreaks($("#natureDescription").val()); // nature card desc
  aryPad[57] = $("#subplotTitle").val(); // subplot card title
  aryPad[60] = removeLineBreaks($("#subplotDescription").val()); // subplot card desc
  aryPad[63] = $("#strengthTitle").val(); // strength card title
  aryPad[66] = removeLineBreaks($("#strengthDescription").val()); // strength card desc
  aryPad[69] = $("#weaknessTitle").val(); // weakness card Title
  aryPad[72] = removeLineBreaks($("#weaknessDescription").val()); // weakness card desc
}

/* Create new cindex character pad for this character */
function createPad() {
  var aryPad = createPad_init();
  createPad_addDirectives(aryPad);
  createPad_addStatics(aryPad);
  createPad_addVars(aryPad);
  return aryPad.join("\n");
}

/* Get data from an existing cindex character pad */
function getCindexPad() {
  // Can't get the data if we don't know which pad
  if (cindexID === "" || userName === "") {
    return "";
  }
  var url = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName + "_" + cindexID;
  // Make the call to the server to get the data
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
      $('#yesNpc')[0].checked = true;
      $('#noNpc')[0].checked = false;
    } else {
      $('#noNpc').click();
      $('#yesNpc')[0].checked = false;
      $('#noNpc')[0].checked = true;
    }

    if (isPrivate) {
      $('#isPrivateButton').click();
      $('#isPrivate')[0].checked = true;
    } else {
      $('#isPrivate')[0].checked = false;
    }

    if (isAdult) {
      $('#isAdult').click();
      $('#isAdult')[0].checked = true;
    } else {
      $('#isAdult')[0].checked = true;
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

/* Main initialisation */
$( document ).ready(function() {
  /* Only throw modal if we don't have the details we need */
  processURL();
  if (cindexID === "") {
    $('#welcomeModal').modal({
      keyboard: false
    });
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
  $('#modalCreateChar').prop('disabled', !isOK);
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
 $("#newCindexId").keyup(function() {
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

$('#modalCreateChar').click(function() {
  $('#welcomeModal').modal('hide');
})

function removeCharFromList() {
  var listURL = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName;
  var removed = false;
  $.get(listURL,function(data) {
    var arr = data.split("\n");
    var arrOut = ["!slack"]; // create output array with directive line in
    if (arr[0].substr(0,1) != "!") {
      // There's no directive line so we need to add one
      arr.splice(0,0,"!slack");
    } else {
      arr[0] = "!slack";
    }
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] == $("#cindexId").val()) {
        removed = true;
      } else {
        arrOut.push(arr[i]);
      }
    }
    if (removed) {
      var padText = arrOut.join("\n");
      var data = {};
      var url = "https://cabbit.org.uk/pad/savedoc.php"
      data["filename"] = "storium_slack_cindex_" + userName;
      data["filetype"] = "main";
      data["filetext"] = padText;
      $.post( url, data).done(function( data ) {
        console.log( "Removed from index" );
      });
    }
  });
}

function addCharToList() {
  var listURL = "https://cabbit.org.uk/pad/p/storium_slack_cindex_" + userName;
  var added = true;
  $.get(listURL,function(data) {
    var arr = data.split("\n");
    if (arr[0].substr(0,1) != "!") {
      // There's no directive line so we need to add one
      arr.splice(0,0,"!slack");
    } else {
      arr[0] = "!slack";
    }
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] == $("#cindexId").val()) {
        added = false;
      }
    }
    if (added) {
      arr.push($("#cindexId").val());
      var padText = arr.join("\n");
      var data = {};
      var url = "https://cabbit.org.uk/pad/savedoc.php"
      data["filename"] = "storium_slack_cindex_" + userName;
      data["filetype"] = "main";
      data["filetext"] = padText;
      $.post( url, data).done(function( data ) {
        console.log( "Added to index" );
      });
    }
  });
}

function deleteConfirm() {
  // Get reference to the modal
  $mod = $('#deleteModal');

  // Show the modal
  $mod.modal({
    keyboard: false
  });

  // Set up buttons
  $mod.find("#btnDeleteConfirm").click(function() {
    console.log("Delete Confirmed, starting process...");
    // Delete main cindex character pad
    var url = "https://cabbit.org.uk/pad/deletepad.php";
    var filename = "storium_slack_cindex_" + userName + "_" + $("#cindexId").val();
    var data = { pad: filename};
    $.post(url,data).done(function(data) {
      console.log("Deleted main pad: " + url);
      console.log(data);
    });

    // Remove from cindex list pad
    removeCharFromList();

    // Close the modal
    $mod.modal("hide");

    // Signal that the delete has happened
    var now = new Date();
    setNotification("Deleted at " + leadZero(now.getHours()) + ":" + leadZero(now.getMinutes()) + ":" + leadZero(now.getSeconds()) );
  })
}

function setNotification(text) {
  $('#savedNotification').css( "opacity", 1 );
  $('#savedNotification').html( text );
  setTimeout(function() {
      $('#savedNotification').fadeTo( 'slow', 0.5 );
  }, 1000);
}

function leadZero(value) {
  if(value < 10) {
    return '0' + value;
  } else {
    return value;
  }
}

function saveCharacterFile() {
  var padText = createPad();
  var data = {};
  var url = "https://cabbit.org.uk/pad/savedoc.php"
  data["filename"] = "storium_slack_cindex_" + userName + "_" + $("#cindexId").val();
  data["filetype"] = "main";
  data["filetext"] = padText;
  $.post( url, data).done(function( data ) {
	  var now = new Date();

    setNotification("Saved at " + leadZero(now.getHours()) + ":" + leadZero(now.getMinutes()) + ":" + leadZero(now.getSeconds()) );
    /*
	  $('#savedNotification').css( "opacity", 1 );
	  $('#savedNotification').html( "Saved at " + leadZero(now.getHours()) + ":" + leadZero(now.getMinutes()) + ":" + leadZero(now.getSeconds()) );
		setTimeout(function(){
		    $('#savedNotification').fadeTo( 'slow', 0.5 );
		}, 1000);
    */
  });
}

$("#saveEntry").click(function() {
  addCharToList();
  saveCharacterFile();
})

$("#deleteEntry").click(function() {
  deleteConfirm();
})
