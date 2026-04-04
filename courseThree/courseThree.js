async function loadData() {
  // fetch from the JSON
  let response = await fetch("friends.json");
  let data = await response.json();
  allFriends = data.friends;

  // render the all friends
  handleRender(allFriends);
}

// get all buttons
const allBtn = document.querySelector(".allFriends");
const onlineBtn = document.querySelector(".onlineFriends");
const alphaBtn = document.querySelector(".alphabetically");
const ageBtn = document.querySelector(".age");

// create an empty array with friends
let allFriends = [];

// define value for sorting
let isAlpha;
let isAge;

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
          &#8801
        </button>
      </div>
      
    `;
  });

  // get the html friends container
  const friendsContainer = document.querySelector(".friendsContainer");

  // insert the friendlist into the html friendsContainer
  friendsContainer.innerHTML = friendList;

  // change button contents
  onlineBtn.textContent = "Online ";
  allBtn.textContent = "All ✓";
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

function handleFilterOnline() {
  // online friends filter
  const onlineFriends = allFriends.filter((friend) => friend.status !== "offline");

  // render only online friends
  handleRender(onlineFriends);

  // change button contents
  onlineBtn.textContent = "Online ✓";
  allBtn.textContent = "All";
}

function handleFilterAlpha() {
  // toggle alpha on/off
  isAlpha = !isAlpha;

  // sort friends.name a-z or z-a
  const sortedByAlpha = allFriends.sort((a, b) =>
    isAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );

  // change button content
  alphaBtn.textContent = isAlpha ? "Name A-Z" : "Name Z-A";

  // render sorted alphabetically
  handleRender(sortedByAlpha);
}

function handleFilterAge() {
  // toggle alpha on/off
  isAge = !isAge;

  // sort by age ↑ or ↓
  const sortedByAge = [...allFriends].sort((a, b) =>
    isAge ? new Date(a.birthDate) - new Date(b.birthDate) : new Date(b.birthDate) - new Date(a.birthDate),
  );

  // change button content
  ageBtn.textContent = isAge ? "Age ↑" : "Age ↓";

  // render sorted alphabetically
  handleRender(sortedByAge);
}

function handleFriendMenu() {
  console.log("friend menu clicked");
}

loadData();
