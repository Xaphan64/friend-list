`use strict`;

// create a global friends variable
let friends = [];

// create a global filters
const filters = {};

// get json server address
const url = "http://localhost:3000/friends";

// get elements
const friendsContainer = document.querySelector(".friendsContainer");
const addFriendInput = document.querySelector(".friendName");

// fetch the data on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch(url)
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

      // online friends filter
      filters.online = friends.filter((friend) => friend.status !== "offline");

      // render initial friends list
      handleRender(friends);
    })
    .catch((error) => {
      // show error in console and in html
      console.error("Failed to fetch data:", error);
      handleFetchError(error);
    });
});

function handleFetchError(error) {
  if (error) {
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
            <img src="${`${friend.icon}${friend.name}`}" alt="${friend.name}" />
            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <circle r="10" cx="10" cy="10" fill="${friend.status}" />
            </svg>
        </div>

        <div class="textContainer">
            <div class="nameContainer">
                <p class="friendName">${friend.name}</p>
                <p class="friendNickname">${friend.nickname.length == 0 ? "" : `(${friend.nickname})`}</p>
            </div>

            <div class="friendStatus">${friend.status}</div>

            <div class="friendDate">${friend.birthDate}</div>
        </div>
        
        <button type="button" class="moreOptions" onclick="handleFriendMenu()">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
      
    `;

    // insert the friendlist into the html friendsContainer
    friendsContainer.innerHTML = friendList;
  });
}

function handleFilter(filteredData) {
  // render only filtered data
  handleRender(filteredData);
}

function handleAddFriend(e) {
  e.preventDefault();

  // get statuses
  const status = ["online", "online", "online", "online", "away", "away", "busy", "offline"];

  // create a new friend object
  const newFriend = {
    id: Date.now(),
    name: addFriendInput.value,
    icon: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Date.now()}`,
    // status: handleRandomStatus(status),
    nickname: "",
    // birthDate: handleRandomDate(new Date(1960, 1, 1), new Date(2019, 1, 1))
    //   .toISOString()
    //   .slice(0, 10),
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFriend),
  })
    .then((response) => response.json())
    .then((friend) => console.log(friend));
}
