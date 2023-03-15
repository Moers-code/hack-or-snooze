"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
//   console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-regular fa-star "></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug("putStoriesOnPage");
  	$allStoriesList.empty();
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		rememberFavorites($story);
    	$allStoriesList.append($story);
  	}
  	$allStoriesList.show();
}

function putFavoritesOnPage() {
	console.debug('putFavoritesOnPage');
	if(currentUser.favorites.length > 0){
		for(let favorite of currentUser.favorites){
		const $favorite = generateStoryMarkup(favorite);
		$favorite.addClass('checked');
		rememberFavorites($favorite);
		$allStoriesList.append($favorite);
		}  
	}else{
		$allStoriesList.append($("<h3>You Don't Have Favorites Yet!!</h3>"))
	}
	$allStoriesList.show();
}

function removeFavoriteFromPage(e) {
	if($(e.target).hasClass('fa-star fa-solid') && $(e.target).parent().hasClass('checked')){
		console.debug('removeFavoriteFromPage');
		$(e.target).parent().remove();
		if($allStoriesList.children().length === 0){
			$allStoriesList.append($("<h3>You Don't Have Favorites Yet!!</h3>"))
		}
	}
}

$('ol').on('click', removeFavoriteFromPage)

async function newStorySubmission(e) {
	console.debug("newStorySubmission");
	navNewStory();
	const title = $("#story-title").val();
	const author = $("#story-author").val();
	const url = $("#story-url").val();
  	const newOne =  {title, author, url};

  	try{	
    	const recentStory = await storyList.addStory(currentUser,newOne);
    	const $recentStory = generateStoryMarkup(recentStory);
    	$allStoriesList.prepend($recentStory);
    	putStoriesOnPage();
  	} catch(err){
    	console.log(err)
  	}
}

$("#add-stories-form").on("submit", e => {
	e.preventDefault();
	newStorySubmission();
	
	$("#add-stories-form").fadeOut(600, () => {
		console.log($(this))
		$("#add-stories-form").trigger('reset');
		$("#add-stories-form").hide();
	})
})

function putOwnStoriesOnPage() {
	if(currentUser.ownStories.length > 0){
		for(let myStory of currentUser.ownStories){
			let $myStory = generateStoryMarkup(myStory);
			$myStory.prepend($('<i class="fa-regular fa-trash-can"></i>'))
			rememberFavorites($myStory);
			$allStoriesList.append($myStory);
		}
		} else {
			$allStoriesList.append($("<h3>You Don't Have Stories Yet!!</h3>"))
		}
		$allStoriesList.show();
}

async function removeStoryFromPage(e) {
	if($(e.target).hasClass('fa-trash-can')){
		const storyId = ($(e.target).parent().attr('id'));
		
		try{
			await storyList.deleteStory(storyId);
		}catch(err){
			console.log(err)
		}
		$(e.target).parent().remove();
		$(`#${storyId}`).remove();
	}
}

$('ol').on('click', removeStoryFromPage);

function rememberFavorites(storyElement) {
	if(currentUser){
		console.debug('rememberFavorites');
		for (let favorite of currentUser.favorites){
			if (storyElement.attr('id') === favorite.storyId){
				storyElement.children('.fa-star').toggleClass('fa-solid');
				}
			}
		}	
}

$("ol").on('click', e => {
	$(document).ready(()=> {
	  const favoriteStoryId = $(e.target).parent().attr('id')
	  if($(e.target).hasClass('fa-star') && currentUser){
		currentUser.favoriteStory(favoriteStoryId)
		$(e.target).toggleClass('fa-solid');
	  }
	})
  });

  
