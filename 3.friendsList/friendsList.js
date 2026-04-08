// python3 -m http.server 5500 - to start server if live server is behaving
// go to folder where json is located with terminal and then npx json-server friends.json
// (add --port 30XX if its not working) and CTRL + C to stop

// `use strict`;

// create a global friends variable
let friends = [];
let blocked = [];

// create global status
let friendDropdownModal = false;
let isAlpha;
let isAge;
let isOnline = false;
let isFriends = true;

// create a global filters
const filters = {};

// get json server address
const urlFriends = "http://localhost:3000/friends";
const urlBlocked = "http://localhost:3000/blocked";

// get elements
const appContainer = document.querySelector(".friendAppContainer");
const friendsContainer = document.querySelector(".friendsContainer");
const friendsText = document.querySelector(".friendsText");
const addFriendInput = document.querySelector(".friendName");
const friendNicknameInput = document.querySelector(".friendNickname");
const moreOptionsBtn = document.querySelector(".moreOptions");
const friendDropdown = document.querySelector(".friendDropdown");
const nicknameButton = document.querySelector(".nicknameButton");
const addFriendModal = document.querySelector(".addFriendModal");
const allBtn = document.querySelector(".allFriends");
const onlineBtn = document.querySelector(".onlineFriends");
const alphaBtn = document.querySelector(".alphabetically");
const ageBtn = document.querySelector(".age");
const clearBtn = document.querySelector(".clearButton");
const searchInput = document.querySelector(".searchInput");
const filterContainer = document.querySelector(".filterButtonContainer");
const sortContainer = document.querySelector(".sortButtonContainer");
const emptyText = document.querySelector(".emptyText");
const addFriendForm = document.querySelector(".addFriendForm");
const friendsListButtonContainer = document.querySelector(".friendsListButtonContainer");
const friendsIcon = document.querySelector(".friendsIcon");
const friendListEmptyContainer = document.querySelector(".friendlistEmptyContainer");

// fetch the data on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch(urlFriends)
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

      // // online friends filter
      // filters.online = friends.filter((friend) => friend.status !== "offline");

      // render initial friends list
      handleRender(friends);

      // if friends is empty
      handleEmptyFriendslist(friends);
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
    // don't show other elements
    appContainer.style.display = "none";
    friendListEmptyContainer.style.display = "none";
  }
}

function handleFilter(filteredData) {
  // render only filtered data
  handleRender(filteredData);
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
              <circle r="10" cx="10" cy="10" fill="${handleDotColor(friend.status)}" />
            </svg>
        </div>

        <div class="textContainer">
            <div class="nameContainer">
                <p class="friendName">${friend.name}</p>
                <p class="friendNickname">${friend.nickname == "" ? "" : `(${friend.nickname})`}</p>
            </div>

            <div class="friendStatus">${handleCapitalize(friend.status)}</div>

            <div class="friendDate">${friend.birthDate}</div>
        </div>
        
        <div class="moreOptionsContainer">
          <button type="button" class="moreOptions">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>

          <div class="friendDropdown">
            <button type="button" class="nicknameButton" onclick="handleClickNickname('${friend.id}', this)">${friend.nickname == "" ? "Set" : "Edit"} Nickname</button>

            <div class="nicknameModal">
              <div class="nicknameModalContent">
                <p>Set nickname for ${friend.name} </p>
                <input type="text" class="friendNickname" placeholder="Add a nickname"/>
                <button type="button" onclick="handleCloseAllModals()">Close</button>
                <button type="button" onclick="handleSubmitNickname('${friend.id}', this)">Confirm</button>
              </div>
            </div>

            <button type="button" onclick="handleBlockFriend('${friend.id}')">Block</button>

            <button type="button" onclick="handleDeleteFriend('${friend.id}')">Remove from friends</button>
          </div>
        </div>

      </div>
      
    `;
  });
  // insert the friendlist into the html friendsContainer
  friendsContainer.innerHTML = friendList;

  // show the friends length
  handleFriendsLenght(data);

  isFriends = true;
}

function handleAllFriends() {
  // change isOnline status
  isOnline = false;
  isFriends = true;

  // reset show friends on tab change
  friendsContainer.style.display = "flex";
  isFriends = true;
  friendsIcon.innerHTML = isFriends
    ? '<i class="fa-solid fa-angle-up"></i>'
    : '<i class="fa-solid fa-angle-down"></i>';

  // DE VAZUT DACA MERGE REFACTOR PE BUTOANE IN FUNCTIE DE isOnline status
  // change button contents
  onlineBtn.textContent = "Online";
  allBtn.textContent = "All ✓";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";

  // render all friends
  handleRender(friends);
}

function handleFilterOnline() {
  // online friends filter
  const onlineFriends = friends.filter((friend) => friend.status !== "offline");

  // render only online friends
  handleRender(onlineFriends);

  // change isOnline status
  isOnline = true;

  // reset show friends on tab change
  friendsContainer.style.display = "flex";
  isFriends = true;
  friendsIcon.innerHTML = isFriends
    ? '<i class="fa-solid fa-angle-up"></i>'
    : '<i class="fa-solid fa-angle-down"></i>';

  // change button contents
  onlineBtn.textContent = "Online ✓";
  allBtn.textContent = "All";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";
}

function handleFilterAlpha() {
  // toggle alpha on/off
  isAlpha = !isAlpha;

  // reset show friends on filter change
  friendsContainer.style.display = "flex";
  isFriends = true;
  friendsIcon.innerHTML = isFriends
    ? '<i class="fa-solid fa-angle-up"></i>'
    : '<i class="fa-solid fa-angle-down"></i>';

  // online friends filter
  const onlineFriends = friends.filter((friend) => friend.status !== "offline");

  // sort friends.name a-z or z-a
  const sortedByAlpha = friends.sort((a, b) =>
    isAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );

  const sortedByAlphaOnline = onlineFriends.sort((a, b) =>
    isAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );

  // change button content
  alphaBtn.textContent = isAlpha ? "Name A-Z" : "Name Z-A";
  ageBtn.textContent = "Age";

  // render sorted alphabetically
  handleRender(isOnline ? sortedByAlphaOnline : sortedByAlpha);
}

function handleFilterAge() {
  // toggle alpha on/off
  isAge = !isAge;

  // reset show friends on filter change
  friendsContainer.style.display = "flex";
  isFriends = true;
  friendsIcon.innerHTML = isFriends
    ? '<i class="fa-solid fa-angle-up"></i>'
    : '<i class="fa-solid fa-angle-down"></i>';

  // online friends filter
  const onlineFriends = friends.filter((friend) => friend.status !== "offline");

  // sort by age ↑ or ↓
  const sortedByAge = [...friends].sort((a, b) =>
    isAge ? new Date(a.birthDate) - new Date(b.birthDate) : new Date(b.birthDate) - new Date(a.birthDate),
  );

  const sortedByAgeOnline = [...onlineFriends].sort((a, b) =>
    isAge ? new Date(a.birthDate) - new Date(b.birthDate) : new Date(b.birthDate) - new Date(a.birthDate),
  );

  // change button content
  ageBtn.textContent = isAge ? "Age ↑" : "Age ↓";
  alphaBtn.textContent = "Name";

  // render sorted alphabetically
  handleRender(isOnline ? sortedByAgeOnline : sortedByAge);
}

function handleSearchFriend() {
  // get the value
  let input = searchInput.value;
  // convert anything written to lower
  input = input.toLowerCase();

  // get all friends and filter by name or nickname with the value in the input
  const filteredFriends = friends.filter(
    (friend) => friend.name.toLowerCase().includes(input) || friend.nickname.toLowerCase().includes(input),
  );

  // if input is not empty, make other filters disappear and make clear button appear
  if (input !== "") {
    filterContainer.style.display = "none";
    sortContainer.style.display = "none";
    clearBtn.style.visibility = "visible";
    // else make buttons appear and clear disappear
  } else {
    filterContainer.style.display = "flex";
    sortContainer.style.display = "flex";
    clearBtn.style.visibility = "hidden";
  }

  // change button contents
  onlineBtn.textContent = "Online";
  allBtn.textContent = "All ✓";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";

  // reset filter status
  isOnline = false;

  // render by input field
  handleRender(filteredFriends);

  // show text if friends is empty
  handleEmptyText(filteredFriends);
}

function handleClearInput() {
  // if input not empty set it to empty and reset other buttons
  if (searchInput.value !== "") {
    searchInput.value = "";
    filterContainer.style.display = "flex";
    sortContainer.style.display = "flex";
    clearBtn.style.visibility = "hidden";
  }

  // change button contents
  onlineBtn.textContent = "Online";
  allBtn.textContent = "All ✓";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";

  // reset filter status
  isOnline = false;

  // render all friends back
  handleRender(friends);

  // show text if friends is empty
  handleEmptyText();
}

function handleEmptyText() {
  // get the value
  let input = searchInput.value;
  // convert anything written to lower
  input = input.toLowerCase();

  // get all friends and filter by name or nickname with the value in the input
  const filteredFriends = friends.filter(
    (friend) => friend.name.toLowerCase().includes(input) || friend.nickname.toLowerCase().includes(input),
  );

  // if there is no friend with that name show message
  if (filteredFriends.length === 0) {
    emptyText.style.display = "block";
  } else {
    emptyText.style.display = "none";
  }
}

// handle the dot color based on the status
function handleDotColor(status) {
  if (status === "online") {
    return "#41ff00";
  } else if (status === "away") {
    return "#ffbc00";
  } else if (status === "busy") {
    return "#ff0000";
  }
  return "gray";
}

// capitalize 1st letter
function handleCapitalize(text) {
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function handleAddFriend(e) {
  e.preventDefault();

  // get statuses
  const status = ["online", "online", "online", "online", "away", "away", "busy", "offline"];

  // don't add if input is empty
  if (addFriendInput.value === "") {
    alert("You must type a name!");
    return;
  }

  // create a new friend object
  const newFriend = {
    id: Date.now(),
    name: addFriendInput.value,
    icon: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Date.now()}`,
    status: handleRandomStatus(status),
    nickname: "",
    birthDate: handleRandomDate(new Date(1960, 1, 1), new Date(2019, 1, 1))
      .toISOString()
      .slice(0, 10),
  };
  fetch(urlFriends, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFriend),
  })
    .then((response) => response.json())
    .then((friend) => {
      // add the friend to the json
      friends.push(friend);

      // re-render
      handleRender(friends);

      // close modal after adding a friend
      handleCloseAddFriendModal();
    })
    // catch any error
    .catch((err) => console.error(err));
}

// generate a random date between 2 parameters
function handleRandomDate(from, to) {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

function handleRandomStatus(status) {
  // create a random nr between 0 and length of the array
  const random = Math.floor(Math.random() * status.length);

  // return the number
  return status[random];
}

function handleDeleteFriend(id) {
  // fetch the id from the json server and delete
  fetch(`${urlFriends}/${id}`, {
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

function handleClickNickname(id, el) {
  // get friend that was clicked on
  const clickedFriend = friends.find((friend) => friend.id === id);

  // find the correct modal (relative to button)
  const modal = el.closest(".friendDropdown").querySelector(".nicknameModal");

  // find input inside THIS modal
  const input = modal.querySelector(".friendNickname");

  // set value
  input.value = clickedFriend.nickname || "";
}

function handleSubmitNickname(id, el) {
  // e.preventDefault();
  // find the correct modal
  const modal = el.closest(".nicknameModal");

  // find input inside THIS modal
  const input = modal.querySelector(".friendNickname");

  // update the nickname with value in input
  const friendNickname = {
    nickname: input.value,
  };

  fetch(`${urlFriends}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendNickname),
  })
    .then((response) => response.json())
    .then((updatedFriend) => {
      // add the friend to the json
      friends = friends.map((friend) => (friend.id === id ? updatedFriend : friend));

      // re-render
      handleRender(friends);
    })
    // catch any error
    .catch((err) => console.error(err));
}

function handleBlockFriend(id) {
  // get friend data
  const friendBlocked = friends.find((friend) => friend.id === id);

  // don't do anything to other friends
  if (!friendBlocked) return;

  // add friend to blocked list
  fetch(urlBlocked, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendBlocked),
  })
    .then((response) => response.json())
    // delete friend from the friends list
    .then(() => {
      return fetch(`${urlFriends}/${id}`, { method: "DELETE" });
    })
    .then(() => {
      friends = friends.filter((friend) => friend.id !== id);

      // re-render
      handleRender(friends);
    })
    // catch any error
    .catch((err) => console.error(err));
}

// function handleModal(modal, boolean, id) {
//   // toggle status on/off
//   boolean = !boolean;

//   console.log(boolean, modal);

//   // show modal if boolean true
//   if (boolean) {
//     modal.style.display = "flex";
//   } else {
//     modal.style.display = "none";
//   }

// // close modal when clicked outside
// window.onclick = (event) => {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };
// }

// moreOptionsBtn.addEventListener(`click`, () => {
//   modal.style.display = "flex";
// });

// window.addEventListener("click", (event) => {
//   if (event.target === modal) {
//     modal.style.display = "none";
//   }
// });

// document.addEventListener("click", (e) => {
//   const btn = e.target.closest(".moreOptions");

//   if (btn) {
//     const dropdown = btn.closest(".moreOptionsContainer").querySelector(".friendDropdown");

//     // open current dropdown
//     const isOpen = dropdown.style.display === "flex";

//     // get all dropdowns and close them
//     document.querySelectorAll(".friendDropdown").forEach((d) => {
//       d.style.display = "none";
//     });

//     // toggle current one
//     dropdown.style.display = isOpen ? "none" : "flex";
//   }

//   // close modal if clicking outside of it
//   else if (!e.target.closest(".friendDropdown")) {
//     document.querySelectorAll(".friendDropdown").forEach((d) => {
//       d.style.display = "none";
//     });
//   } else if (!e.target.closest(".friendDropdown") && !e.target.closest(".nicknameModal")) {
//     document.querySelectorAll(".friendDropdown").forEach((d) => {
//       d.style.display = "none";
//     });
//   }
// });

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".moreOptions");

  if (btn) {
    const dropdown = btn.closest(".moreOptionsContainer").querySelector(".friendDropdown");

    const isOpen = dropdown.style.display === "flex";

    document.querySelectorAll(".friendDropdown").forEach((d) => {
      d.style.display = "none";
    });

    dropdown.style.display = isOpen ? "none" : "flex";
    return;
  }

  // close only if clicking outside both modal AND button
  // if (!e.target.closest(".friendDropdown") && !e.target.closest(".nicknameModal")) {
  //   document.querySelectorAll(".friendDropdown").forEach((d) => {
  //     d.style.display = "none";
  //   });
  // }
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".nicknameButton");

  if (btn) {
    e.stopPropagation();

    const modal = btn.closest(".friendDropdown").querySelector(".nicknameModal");

    const isOpen = modal.style.display === "flex";

    document.querySelectorAll(".nicknameModal").forEach((d) => {
      d.style.display = "none";
    });

    modal.style.display = isOpen ? "none" : "flex";
    return;
  }

  // close only if clicking outside both modal AND button
  // if (!e.target.closest(".nicknameModal") && !e.target.closest(".nicknameButton")) {
  //   document.querySelectorAll(".nicknameModal").forEach((d) => {
  //     d.style.display = "none";
  //   });
  // }
});

function handleCloseAllModals() {
  document.querySelectorAll(".nicknameModal").forEach((m) => {
    m.style.display = "none";
  });

  document.querySelectorAll(".friendDropdown").forEach((d) => {
    d.style.display = "none";
  });
}

function handleAddFriendsModal() {
  // open modal
  addFriendModal.style.display = "flex";
}

function handleCloseAddFriendModal() {
  // close modal
  addFriendModal.style.display = "none";

  // reset input if anything was writted in it
  addFriendInput.value = "";
}

function handleRedirectBlocklist() {
  // redirect to the blocked list
  window.location.href = "blockList.html";
}

function handleEmptyFriendslist(friends) {
  if (friends.length === 0) {
    document.querySelector(".friendAppContainer").style.display = "none";
    friendListEmptyContainer.style.display = "flex";
  } else {
    document.querySelector(".friendAppContainer").style.display = "flex";
    friendListEmptyContainer.style.display = "none";
  }
}

function handleFriendsLenght(friends) {
  // offline filter
  const onlineFriends = friends.filter((friend) => friend.status !== "offline");
  // show length
  friendsText.textContent = `Friends ${isOnline ? onlineFriends.length : friends.length}`;
}

function handleShowFriends() {
  // toggle isFriends
  isFriends = !isFriends;

  // show or hide all friends
  friendsContainer.style.display = isFriends ? "flex" : "none";

  friendsIcon.innerHTML = isFriends
    ? '<i class="fa-solid fa-angle-up"></i>'
    : '<i class="fa-solid fa-angle-down"></i>';
}
