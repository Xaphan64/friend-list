`use strict`;

// get json server address
const urlBlocked = "http://localhost:3000/blocked";
const urlFriends = "http://localhost:3000/friends";

// get elements
const blockContainer = document.querySelector(".blockContainer");

// fetch the data on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch(urlBlocked)
    .then((response) => {
      // throw error is response is not ok
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })

    // the data if response is ok
    .then((data) => {
      // all friends
      friends = data;

      // render initial friends list
      handleRender(friends);

      handleEmptyBlocklist(friends);
    })
    .catch((error) => {
      // show error in console and in html
      console.error("Failed to fetch data:", error);
      handleFetchError(error);
    });
});

function handleFetchError(error) {
  if (error) {
    // if there is an error don't show error and don't show friends page
    document.querySelector(".errorContainer").innerHTML =
      `<p class="error">Error loading data: ${error.message}</p>`;
    document.querySelector(".friendAppContainer").style.display = "none";
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
        <img src="${`${friend.icon}${friend.name}`}" alt="${friend.name}" style="background-color: ${friend.bgColor}" />
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

function handleDeleteFriend(id) {
  // fetch the id from the json server and delete
  fetch(`${urlBlocked}/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      // remove from json
      friends = friends.filter((friend) => friend.id !== id);

      // re-render
      handleRender(friends);
    })
    // catch any error
    .catch((err) => console.error(err));
}

function handleUnblockFriend(id) {
  // get friend data
  const friendBlocked = friends.find((friend) => friend.id === id);

  // don't do anything to other friends
  if (!friendBlocked) return;

  // add friend to blocked list
  fetch(urlFriends, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendBlocked),
  })
    .then((response) => response.json())
    // delete friend from the friends list
    .then(() => {
      return fetch(`${urlBlocked}/${id}`, { method: "DELETE" });
    })
    .then(() => {
      friends = friends.filter((friend) => friend.id !== id);

      // re-render
      handleRender(friends);
    })
    // catch any error
    .catch((err) => console.error(err));
}

function handleRedirectBlocklist() {
  // redirect to the blocked list
  window.location.href = "friendsList.html";
}

function handleEmptyBlocklist(friends) {
  if (friends.length === 0) {
    document.querySelector(".friendAppContainer").style.display = "none";
    document.querySelector(".blocklistEmptyContainer").style.display = "flex";
  } else {
    document.querySelector(".friendAppContainer").style.display = "flex";
    document.querySelector(".blocklistEmptyContainer").style.display = "none";
  }
}
