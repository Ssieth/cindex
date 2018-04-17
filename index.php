<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Character Index Editor</title>
	<link href="/cindex/css/bootstrap.css" rel="stylesheet">
    <link href="/cindex/css/custom.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono|Mate+SC|Merriweather|Roboto" rel="stylesheet"> </head>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<body style="padding-top: 70px;" base="/cindex/">
<div class="navbar navbar-expand-lg navbar-light bg-light mb-4 fixed-top" id="navigationBar">
  <a class="navbar-brand" href="#">Character Index Editor</a>
	<div class="ml-auto">
<span id="savedNotification" class="text-muted mr-3"></span>
  <button id="deleteEntry" type="button" class="btn btn-danger">
	  Delete
  </button>
  <button id="saveEntry" type="button" class="btn btn-primary">
		Save
  </button>
		</div>
</div>


<!--Modal Button for Testing
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
  Open modal
</button>
-->


<!-- Modal Y/N -->
<div class="modal fade" tabindex="-1" role="dialog" id="deleteModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Delete the character?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete the character?</p>
        <p>This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" id="btnDeleteConfirm">Delete</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal"  id="btnDeleteCancel">Cancel</button>
      </div>
    </div>
  </div>
</div>
<!-- ----------- -->

<!-- The Modal -->
<div class="modal fade" id="welcomeModal">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content">

      <!-- Modal body -->
      <div class="modal-body">
		  <form id="modalForm">
			  <div class="form-row mb-2">
				 <div class="col-lg">
				 <label for="slackUsername" style="font-weight: bold;">Storium Slack Username</label>
				  <div id="" class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">@</span></div>
						<input name="slackUsername" type="text" class="form-control" id="slackUsername" placeholder="">
					</div>
					 </div>
				</div>

			  <!--Shows only when #buttonSetSlackUsername is clicked.  Populate with IDs from @username's index.-->
			  <div class="form-row" id="rowSelectEditCreate">
				<div class="col-lg" id="colSelectEditCreate">
				  <label for="selectEditCreate"></label>
				  <div class="btn-group btn-group-toggle btn-group-justified" id="selectEditCreate" role="group" data-toggle="buttons">
					<label class="btn btn-outline-secondary" id="buttonSelectEdit">
				<!-- TODO: On change, populate #entrySelect (below) w entry list from cindex_[username] -->
					  <input name="selectEditCreate" type="radio" id="selectEdit" autocomplete="off" value="edit"> Edit Entry </label>
					<label class="btn btn-outline-secondary active" id="buttonSelectCreate">
					  <input name="selectEditCreate" type="radio" id="selectCreate" autocomplete="off" value="create" checked>New Entry </label>
					</div>
					<hr>
				  </div>
				</div>
			  <div class="mb-2" id="ifNoEntries">Uh-oh!  It looks like you don't have any entries yet.  Let's create one!</div>
			  <!-- TODO: On selection, populate #editorFormMain with the entry information
						and disable the CIndex input (#cindexId) -->
			  <div id="rowCreateEntry" class="form-row">
				 <div class="col-lg">
					 <!-- Only show this if edit is clicked and there are no existing entires. -->
					 <div class="input-group">
						<input name="newCindexId" type="text" class="form-control" id="newCindexId" placeholder="New CIndex ID">
						 	<div class="input-group-append">
						        <button type="button" class="btn btn-primary" disabled='disabled' id='modalCreateChar'>OK </button>
							</div>
						 </div>
					  	<small class="text-muted">two-letter abbreviation, lowercase</small>

					 </div>
				</div>

			  <div class="form-row" id="rowEntrySelect">
				  <div class="col-lg" id="colEntrySelect">
					  <div class="input-group">
						<select id="entrySelect" class="form-control" disabled>
							<option value="" selected>No Username</option>
						</select>
						  <div class="input-group-append">
						        <button type="button" class="btn btn-primary" disabled='disabled' id='modalEditChar'>OK </button>
							  </div>

			  		</div>
				  </div>
				  </div>
			   </form>
		</div>

      </div>
	</div>
	</div>

<div class="container-fluid" id="formContainer">
    <div class="row justify-content-center" id="rowFormContainer">
      <div class="col-lg-10" id="colFormContainer">
              <form id="editorFormMain">
                <input type='hidden' name='userName' id='userName' value='' />
		      <!-- Basic Info section begins here -->
                    <section id="sectionBasic">
                      <div class="form-row justify-content-center" id="headerSectionBasic">
                        <div class="form-group col-lg-8">
                          <h4 class="font-weight-bold" style="display: inline-block;">Basic Information</h4><span class="badge align-top ml-1" style="color: red;">Required</span></div>
                        </div>

					<!-- CIndex ID -->
                      <div class="form-row justify-content-center" id="rowNameID">
                        <div class="form-group col-lg-2" id="colCindexId">
                          <label for="cindexId">CIndex ID</label>
                          <div class="input-group">
                            <input name="cindexId" type="text" class="form-control" id="cindexId" disabled>
                            </div>
                          </div>

					<!-- Character Name -->
                        <div class="form-group col-lg-6" id="colCharacterName">
                          <label for="characterName">Character Name</label>
                          <input name="characterName" type="text" class="form-control" id="characterName" placeholder="">
                          </div>
                        </div>

					<!-- Avatar Link  -->
                      <div class="form-row justify-content-center" id="rowAvatarLink">
                        <div id="colAvatarLink" class="col-lg-8 mb-4">
                          <label for="avatarLink">Avatar Image URL</label>
                          <div class="input-group">
                            <input name="avatarLink" type="text" class="form-control" id="avatarLink" placeholder="">
                            </div><small class="text-muted">Square image, less than 500 KB. GIF, JPEG, PNG, or BMP.</small></div>
                        </div>

				<!-- Character/Game Types (NPC, Private, Unlisted, etc.) -->
                      <div class="form-row justify-content-center mb-2" id="typeToggles">

					<!-- NPC Toggle -->
                        <div class="col-lg-2 mb-4" id="characterTypes">
                          <label for="typeNpcGroup">NPC?</label>
                          <div class="btn-group btn-group-toggle btn-group-justified" id="typeNpcGroup" role="group" data-toggle="buttons">
                            <label class="btn btn-outline-secondary" id="buttonTypeNpcYes">
                              <input name="typeNpc" type="radio" id="yesNpc" autocomplete="off" value="y"> Yes </label>
                            <label class="btn btn-outline-secondary active" id="buttonTypeNpcNo">
                              <input name="typeNpc" type="radio" id="noNpc" autocomplete="off" value="n"> No </label>
                            </div>
                          </div>

					<!-- Game Type Toggles  -->
                        <div class="col-lg-6" id="gameTypes">
                          <label for="gameTypesToggle">Game Type</label>
                          <div class="btn-group btn-group-toggle btn-group-justified" id="gameTypesToggle" role="group" data-toggle="buttons">

						<!-- Toggle Private -->
                            <label class="btn btn-outline-secondary" id="isPrivateButton">
                              <input type="checkbox" name="isPrivate" id="isPrivate" value="yesPrivate" autocomplete="off">Private</label>

						<!-- Toggle Unlisted -->
                            <label class="btn btn-outline-secondary" id="isUnlistedButton">
                              <input type="checkbox" name="isUnlisted" id="isUnlisted" value="yesUnlisted" autocomplete="off">No Name</label>

						<!-- Toggle Adult (18+) -->
                            <label class="btn btn-outline-secondary" id="isAdultButton">
                              <input name="isAdult" type="checkbox" id="isAdult" value="yesAdult" autocomplete="off">18+</label>
                            </div>
                          </div>
                        </div>

					<!-- Character Page Block (isNpc = n, isPrivate = )-->

                      <div id="blockPages" class="mt-4">
                        <div id="blockCharacterPage">
                          <div class="form-row justify-content-center" id="rowSetCharacterPage">
                            <div class="form-group col-lg-8" id="colSetCharacterPage">

                              <!--Character Page URL field-->
                              <label for="inputURL">Character Page URL</label>
                              <div class="input-group">
                                <input type="text" class="form-control" id="characterPageLink" placeholder="https://storium.com/character/character/in/game">
                                <div class="input-group-append">

                                  <!--Set Character Page Button: Sends Character/Game URIs to the field below. -->
                                  <button type="button" class="btn btn-secondary" id="buttonSetCharacterPage">Set</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                          <!--Character Page: Character URI field (disabled, value set by button above) -->
                          <div class="form-row justify-content-center" id="characterPageUris">
                            <div class="form-group col-md-4" id="colCharacterPageCuri">
                              <label for="characterPageCuri">Character URI</label>
                              <input name="characterPageCuri" type="text" class="form-control" id="characterPageCuri" readonly>
                              </div>

                            <!--Character Page: Game URI field (disabled, value set by button above) -->
                            <div class="form-group col-md-4" id="colCharacterPageGuri">
                              <label for="characterPageGuri">Game URI</label>
                              <input name="characterPageGuri" type="text" class="form-control" id="characterPageGuri" readonly>
                              </div>
                            </div>
                          </div>

                        <!--Game Only Block (isNpc = y, isUnlisted = ) -->
                        <div id="blockGamePage" style="display: none;">
                          <div class="form-row justify-content-center" id="rowSetGamePage">
                            <div class="form-group col-lg-4" id="colSetGamePage">

                              <!--Game Page URL field -->
                              <label for="inputURL">Game Page URL</label>
                              <div class="input-group">
                                <input name="gamePageLink" type="text" class="form-control" id="gamePageLink" placeholder="https://storium.com/game/game-name">

                                <!--Set Game Page Button: Sends Game URI to the field below. -->
                                <div class="input-group-append">
                                  <button type="button" class="btn btn-secondary" id="buttonSetGamePage">Set</button>
                                  </div>
                                </div>
                              </div>

                            <!--Game Only: Game URI field (disabled, value set by button above)  -->
                            <div class="form-group col-lg-4" id="colGamePageGuri">
                              <label for="gamePageGuri">Game URI</label>
                              <input name="gamePageGuri" type="text" class="form-control" id="gamePageGuri" readonly>
                              </div>
                            </div>
                          </div>
                      </div>

					<!--Game Name Block (isUnlisted = ) -->
                      <div id="blockGameName" >
                        <div class="form-row justify-content-center" id="rowGameName">
                          <div class="form-group col-lg-8" id="colGameName">
                            <label for="gameName">Game Name</label>
                            <input name="gameName" type="text" class="form-control" id="gameName" placeholder="">
							</div>
                          </div>
                        </div>
                    </section>

			 <!--Bio section begins here -->
                    <section id="sectionBio">
                      <div class="form-row justify-content-center mt-4" id="headerSectionBio">
                        <div class="form-group col-lg-8">
                        <h4 class="font-weight-bold" style="display: inline-block;">Biographical Information</h4><span class="badge align-top ml-1" style="color: gray;">Optional</span> </div>
                      </div>

				<!--Age, Gender Identity, and Sexual Orientation -->
                      <div class="form-row justify-content-center" id="rowAgso">

					<!--Age -->
                        <div class="form-group col-lg-2" id="colAge">
                          <label for="age">Age</label>
                          <div class="input-group">
                            <input name="age" type="text" class="form-control" id="age" placeholder="##" style="text-align: right;">
                            <div class="input-group-append"><span class="input-group-text">yrs.</span> </div>
                            </div>
                          </div>

					<!-- Gender Identity -->
                        <div class="form-group col-lg-3" id="colGenderIdentity">
                          <label for="genderIdentity">Gender Identity</label>
                          <input name="genderIdentity" type="text" class="form-control" id="genderIdentity" placeholder=""> </div>

					<!-- Sexual Orientation -->
                        <div class="form-group col-lg-3" id="colSexualOrientation">
                          <label for="sexualOrientation">Sexual Orientation</label>
                          <input name="sexualOrientation" type="text" class="form-control" id="sexualOrientation" placeholder=""> </div>
                        </div>

				<!--Bio Fields -->

					<!--Short Bio -->
                      <div class="form-row justify-content-center" id="rowShortBio">
                        <div class="form-group col-lg-8" id="colShortBio">
                          <label for="shortBio">Short Bio</label>
                          <input name="shortBio" type="text" class="form-control" id="shortBio" placeholder=""> </div>
                        </div>

					<!-- Long Bio-->
                      <div class="form-row justify-content-center" id="rowLongBio">
                        <div class="colLongBio form-group col-lg-8">
                          <label for="longBio">Detailed Bio</label>
                          <textarea name="longBio" rows="3" class="form-control" id="longBio" placeholder=""></textarea>
                          </div>
                        </div>
                    </section>

			<!--Card Info section begins here -->
                    <section id="sectionCards">
                      <div class="form-row justify-content-center mt-4" id="headerSectionCards">
                        <div class="form-group col-lg-8">
                          <h4 class="font-weight-bold" style="display: inline-block;">Card Information</h4><span class="badge align-top ml-1" style="color: gray;">Optional</span> </div>
                        </div>
                      <div class="form-row justify-content-center" id="rowNatureStrength">

					<!--Nature Card -->
                        <div class="vertical-input-group col-lg-4 mb-4" id="colNature">
                          <div class="input-group" id="natureTitleGroup">
                            <input name="natureTitle" type="text" class="form-control mx-1 font-weight-bold" id="natureTitle" placeholder="Nature Card Title">
                            </div>
                          <div class="input-group" id="natureDescriptionGroup">
                            <textarea name="natureDescription" rows="3" class="form-control mx-1" id="natureDescription" placeholder="Nature Card Description"></textarea>
                            </div>
                        </div>

					<!--Strength Card -->
                        <div class="vertical-input-group col-lg-4 mb-4" id="colStrength">
                          <div class="input-group" id="strengthTitleGroup">
                            <input name="strengthTitle" type="text" class="form-control mx-1 font-weight-bold" id="strengthTitle" placeholder="Strength Card Title">
                            </div>
                          <div class="input-group" id="strengthDescriptionGroup">
                            <textarea name="strengthDescription" rows="3" class="form-control mx-1" id="strengthDescription" placeholder="Strength Card Description"></textarea>
                            </div>
                          </div>
                      </div>

                      <div class="form-row justify-content-center" id="rowWeaknessSubplot" style="padding-bottom: 20px;">

					<!--Weakness Card -->
                        <div class="vertical-input-group col-lg-4 mb-4" id="colWeakness">
                          <div class="input-group" id="weaknessTitleGroup">
                            <input name="weaknessTitle" type="text" class="form-control mx-1 font-weight-bold" id="weaknessTitle" placeholder="Weakness Card Title">
                            </div>
                          <div class="input-group" id="weaknessDescriptionGroup">
                            <textarea name="weaknessDescription" rows="3" class="form-control mx-1" id="weaknessDescription" placeholder="Weakness Card Description"></textarea>
                            </div>
                          </div>

					<!--Subplot Card -->
                        <div class="vertical-input-group col-lg-4" id="colSubplot">
						  <div class="input-group" id="subplotTitleGroup">
							<input name="subplotTitle" type="text" class="form-control mx-1 font-weight-bold" id="subplotTitle" placeholder="Subplot Card Title">
							</div>
                          <div class="input-group" id="subplotDescriptionGroup">
                            <textarea name="subplotDescription" rows="3" class="form-control mx-1" id="subplotDescription" placeholder="Subplot Card Description"></textarea>
                            </div>
                          </div>
                        </div>
                    </section>
              </form>
            </div>
  </div>
</div>
    <script src="/cindex/js/jquery-3.2.1.min.js"></script>
    <script src="/cindex/js/popper.min.js"></script>
    <script src="/cindex/js/bootstrap-4.0.0.js"></script>
    <script src="/cindex/js/cindex.js"></script>
</body>

</html>
