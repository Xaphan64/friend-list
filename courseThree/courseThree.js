async function loadData() {
  // fetch from the JSON
  let response = await fetch("friends.json");
  let data = await response.json();

  // render the all friends
  handleRender(data.friends);
}

function handleRender(friends) {
  // create an empty friend list
  let friendList = "";

  // define friend elements in html
  friends.forEach((friend) => {
    friendList += `
      <div class="friend">
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

            <div class="friendStatus">${friend.status}</div>

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
}

function handleFriendMenu() {
  console.log("friend menu clicked");
}

// handle the status dot color based on the status
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

loadData();
