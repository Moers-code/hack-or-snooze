"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  
  $(".main-nav-links").show();
  console.log($(".main-nav-links"))
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navLinks.show();
  }


function navNewStory() {
	if(currentUser){
		console.debug("navNewStory");
  		hidePageComponents();
  		$("#add-stories-form").show();
  		putStoriesOnPage();
	}
}

$("#new-story-button").on("click", navNewStory);

function navFavorites(e) {
	if(currentUser){
  		console.debug("navFavorites");
  		hidePageComponents();
  		$allStoriesList.empty();
  		putFavoritesOnPage();
	}
}

$("#nav-favorites").on('click', navFavorites);

function navMyStories() {
	if(currentUser){
		console.debug('navMyStories');
		hidePageComponents();
		$allStoriesList.empty();
		putOwnStoriesOnPage();
	}
}

$("#nav-my-stories").on('click', navMyStories)