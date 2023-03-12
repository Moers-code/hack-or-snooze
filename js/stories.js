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
  // console.debug("generateStoryMarkup", story);

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

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function newStorySubmission(e) {
  e.preventDefault();
  console.debug("newStorySubmission");

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  
  try{
    const newOne =  {title, author, url};
    const recentStory = await storyList.addStory(currentUser,
       newOne);
    const $recentStory = generateStoryMarkup(recentStory);
    $allStoriesList.prepend($recentStory);
  } catch(err){
    console.log(err)
  }
  
  navNewStory();
  console.log('newStorySubmission Executed')
}

$("#add-stories-form").on("submit", newStorySubmission);

$("ol").on('click', e => {
  $(document).ready(()=> {
    console.log(currentUser.favorites)
    const favoriteStoryId = $(e.target).parent().attr('id')
    if(e.target.tagName === 'I' && currentUser){
      currentUser.favoriteStory(favoriteStoryId)
      $(e.target).toggleClass('fa-solid')
      console.log(currentUser.favorites)
    }
  })
})