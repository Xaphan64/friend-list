// go to folder where json is located with terminal and then npx json-server friends.json
// (add --port 30XX if its not working) and CTRL + C to stop

const url = "http://localhost:3000/friends";

async function loadData() {
  try {
    // fetch from the JSON
    let response = await fetch(url);

    // if response not ok throw error
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    let data = await response.json();
    allFriends = data;

    // render the all friends
    handleRender(allFriends);
  } catch (error) {
    // show error
    console.log(error);
    handleError(error.message);
  }
}

// get elements
const allBtn = document.querySelector(".allFriends");
const onlineBtn = document.querySelector(".onlineFriends");
const alphaBtn = document.querySelector(".alphabetically");
const ageBtn = document.querySelector(".age");
const clearBtn = document.querySelector(".clearButton");
const searchInput = document.querySelector(".searchInput");
const filterContainer = document.querySelector(".filterButtonContainer");
const sortContainer = document.querySelector(".sortButtonContainer");
const emptyText = document.querySelector(".emptyText");
const menuModal = document.querySelector(".menuModal");
const addFriendInput = document.querySelector(".friendName");

// create an empty array with friends
let allFriends = [];

// define value for sorting
let isAlpha;
let isAge;
let isOnline = false;

function handleRender(friends) {
  // create an empty friend list
  let friendList = "";

  // define friend elements in html
  friends.forEach((friend) => {
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
                <p class="friendNickname">${friend.nickname.length == 0 ? "" : `(${friend.nickname})`}</p>
            </div>

            <div class="friendStatus">${handleCapitalize(friend.status)}</div>

            <div class="friendDate">${friend.birthDate}</div>
        </div>
        
        <button type="button" class="moreOptions" onclick="handleFriendMenu()">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
      
    `;
  });

  // get the html friends container
  const friendsContainer = document.querySelector(".friendsContainer");

  // insert the friendlist into the html friendsContainer
  friendsContainer.innerHTML = friendList;
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

function handleError(error) {
  // get the html element
  const fetchErrorContainer = document.querySelector(".fetchError");

  if (error) {
    fetchErrorContainer.innerHTML = `
    <div style="color: red; font-weight: bold;">
      ❌ ${error}
    </div>
  `;
    document.querySelector(".friendListSection").style.display = "none";
  }
}

function handleAllFriends() {
  // change isOnline status
  isOnline = false;

  // DE VAZUT DACA MERGE REFACTOR PE BUTOANE IN FUNCTIE DE isOnline status
  // change button contents
  onlineBtn.textContent = "Online";
  allBtn.textContent = "All ✓";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";

  // render all friends
  handleRender(allFriends);
}

function handleFilterOnline() {
  // online friends filter
  const onlineFriends = allFriends.filter((friend) => friend.status !== "offline");

  // render only online friends
  handleRender(onlineFriends);

  // change isOnline status
  isOnline = true;

  // change button contents
  onlineBtn.textContent = "Online ✓";
  allBtn.textContent = "All";
  alphaBtn.textContent = "Name";
  ageBtn.textContent = "Age";
}

function handleFilterAlpha() {
  // toggle alpha on/off
  isAlpha = !isAlpha;

  // online friends filter
  const onlineFriends = allFriends.filter((friend) => friend.status !== "offline");

  // sort friends.name a-z or z-a
  const sortedByAlpha = allFriends.sort((a, b) =>
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

  // online friends filter
  const onlineFriends = allFriends.filter((friend) => friend.status !== "offline");

  // sort by age ↑ or ↓
  const sortedByAge = [...allFriends].sort((a, b) =>
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
  const filteredFriends = allFriends.filter(
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
  handleEmptyText();
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
  handleRender(allFriends);

  // show text if friends is empty
  handleEmptyText();
}

function handleEmptyText() {
  // get the value
  let input = searchInput.value;
  // convert anything written to lower
  input = input.toLowerCase();

  // get all friends and filter by name or nickname with the value in the input
  const filteredFriends = allFriends.filter(
    (friend) => friend.name.toLowerCase().includes(input) || friend.nickname.toLowerCase().includes(input),
  );

  // if there is no friend with that name show message
  if (filteredFriends.length === 0) {
    emptyText.style.display = "block";
  } else {
    emptyText.style.display = "none";
  }
}

function handleAddFriend(e) {
  e.preventDefault();

  // get statuses
  const status = ["online", "online", "online", "online", "away", "away", "busy", "offline"];

  // create a new friend object
  const newFriend = {
    id: Date.now(),
    name: "daniel",
    icon: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Date.now()}`,
    status: handleRandomStatus(status),
    nickname: "",
    birthDate: handleRandomDate(new Date(1960, 1, 1), new Date(2019, 1, 1))
      .toISOString()
      .slice(0, 10),
  };

  // post friend into json server
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFriend),
  })
    .then((response) => response.json())
    .then((friend) => {
      console.log(friend);
      // render the new list
      allFriends.push(friend);
      handleRender(allFriends);
    });
}

// generate a random date between 2 parameters
function handleRandomDate(from, to) {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

function handleRandomStatus(status) {
  // create a random nr between 0 and length of the array
  const random = Math.floor(Math.random() * status.length);

  // return the number

  console.log("test" + status[random]);
  return status[random];
}

function handleModal(modal) {
  // toggle modal
  modal.classList.toggle("active");
}

function handleAddFriendsModal() {
  console.log(`handleModalclicked`);
}

function handleBlockedPlayers() {
  console.log(`handleBlockedPlayersclicked`);
}

function handleFriendMenu() {
  console.log("friend menu clicked");
}

loadData();
