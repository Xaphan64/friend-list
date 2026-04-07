// python3 -m http.server 5500 - to start server if live server is behaving
// go to folder where json is located with terminal and then npx json-server friends.json
// (add --port 30XX if its not working) and CTRL + C to stop

`use strict`;

// create a global friends variable
let friends = [];
let blocked = [];

// create global status
let friendDropdownModal = false;

// create a global filters
const filters = {};

// get json server address
const urlFriends = "http://localhost:3000/friends";
const urlBlocked = "http://localhost:3000/blocked";

// get elements
const friendsContainer = document.querySelector(".friendsContainer");
const addFriendInput = document.querySelector(".friendName");
const friendNicknameInput = document.querySelector(".friendNickname");
const moreOptionsBtn = document.querySelector(".moreOptions");
const friendDropdown = document.querySelector(".friendDropdown");
const nicknameButton = document.querySelector(".nicknameButton");
const addFriendModal = document.querySelector(".addFriendModal");

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
            <img src="${`${friend.icon}${friend.name}`}" alt="${friend.name}" />
            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <circle r="10" cx="10" cy="10" fill="${friend.status}" />
            </svg>
        </div>

        <div class="textContainer">
            <div class="nameContainer">
                <p class="friendName">${friend.name}</p>
                <p class="friendNickname">${friend.nickname == "" ? "" : `(${friend.nickname})`}</p>
            </div>

            <div class="friendStatus">${friend.status}</div>

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
    })
    // catch any error
    .catch((err) => console.error(err));
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

function handleAddFriendModal() {
  addFriendModal.style.display = "flex";
}

function handleCloseAddFriendModal() {
  addFriendModal.style.display = "none";
}
