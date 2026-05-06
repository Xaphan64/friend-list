`use strict`;

// get json server address
const urlBlocked = "http://localhost:3000/blocked";
const urlFriends = "http://localhost:3000/friends";
// debugger;

const supabaseUrl = "https://eqbdezmqcnskzrzwurid.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmRlem1xY25za3pyend1cmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDU0OTQsImV4cCI6MjA5MzI4MTQ5NH0.JUTg5oUbCE1XOwRGQzBdc5bYxoUUmBs0Zs3se9AJ9ac";

const dbClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// get elements
const blockContainer = document.querySelector(".blockContainer");
const blocklistEmptyContainer = document.querySelector(".blocklistEmptyContainer");
const friendAppContainer = document.querySelector(".friendAppContainer");
const spinner = document.getElementById("loader");

document.addEventListener("DOMContentLoaded", () => {
  // show spinner before initializing
  spinner.style.display = "block";

  // run init function
  loadFriends();
});

async function loadFriends() {
  try {
    // get data and error from supabase
    const { data, error } = await dbClient.from("blocked").select("*");

    // show error
    if (error) {
      throw error;
    }

    // define data
    friends = data;

    // render initial friends list
    handleRender(friends);
    handleEmptyBlocklist(friends);

    // show elements after fetch
    friendAppContainer.style.visibility = "visible";
    blocklistEmptyContainer.style.visibility = "visible";
  } catch (error) {
    // show error in console and in html
    console.error("Failed to fetch data:", error);
    handleFetchError(error);
  } finally {
    // remove spinner after load
    spinner.style.display = "none";
  }
}

function handleFetchError(error) {
  if (error) {
    // if there is an error don't show error and don't show friends page
    document.querySelector(".errorContainer").innerHTML =
      `<p class="error">Error loading data: ${error.message}</p>`;
    friendAppContainer.style.display = "none";
  }
}

function handleRender(data) {
  // create an empty friend list
  let friendList = "";

  // define friend elements in html
  data.forEach((friend) => {
    // friend card
    friendList += `
    <div class="friendCard">
      <div class="imageContainer">
        <img src="${`${friend.icon}${friend.name}`}" alt="${friend.name}" style="background-color: ${friend.bg_color}" />
        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
          <circle r="10" cx="10" cy="10" fill="#a8a8a8" />
        </svg>
      </div>

        <div class="textContainer">
          <div class="nameContainer">
              <p class="friendName">${friend.name}</p>
              <p class="friendNickname">${friend.nickname == "" ? "" : `(${friend.nickname})`}</p>
          </div>

          <div class="friendStatus">Unknown</div>

        </div>

        <div class="blocklistButtonContainer">
        <button type="button" onclick="handleUnblockFriend('${friend.id}')" class="addButton">Add to friends</button>
        <button type="button" onclick="handleDeleteFriend('${friend.id}')" class="removeButton">Remove</button>
        </div>
    </div>
    `;
  });
  // insert the friendlist into the html friendsContainer
  blockContainer.innerHTML = friendList;

  // show message when list gets empty
  handleEmptyBlocklist(data);
}

// capitalize 1st letter
function handleCapitalize(text) {
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

async function handleDeleteFriend(id) {
  try {
    // get data from supabase and delete by id
    const { error } = await dbClient.from("blocked").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // remove locally
    friends = friends.filter((friend) => friend.id !== id);

    // re-render
    handleRender(friends);
  } catch (err) {
    console.error("Failed to delete friend:", err);
  }
}

async function handleUnblockFriend(id) {
  // get blocked friend data from current array
  const friendBlocked = friends.find((friend) => friend.id === id);

  // stop if not found
  if (!friendBlocked) return;

  try {
    // move back to friends table
    const { error: insertError } = await dbClient.from("friends").insert([friendBlocked]);

    if (insertError) {
      throw insertError;
    }

    // remove from blocked table
    const { error: deleteError } = await dbClient.from("blocked").delete().eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    // remove locally from current blocked list
    friends = friends.filter((friend) => friend.id !== id);

    // re-render current page/list
    handleRender(friends);
  } catch (err) {
    console.error("Failed to unblock friend:", err);
  }
}

function handleRedirectBlocklist() {
  // redirect to the blocked list
  window.location.href = "index.html";
}

function handleEmptyBlocklist(friends) {
  if (friends.length === 0) {
    friendAppContainer.style.display = "none";
    blocklistEmptyContainer.style.display = "flex";
  } else {
    friendAppContainer.style.display = "flex";
    blocklistEmptyContainer.style.display = "none";
  }
}
