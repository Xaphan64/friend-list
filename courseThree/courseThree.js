async function loadData() {
  // fetch from the JSON
  let response = await fetch("friends.json");
  let data = await response.json();

  handleRender(data.friends);
}

function handleRender(friends) {
  // create an empty friend list
  let friendList = "";

  // define friend elements in html
  friends.forEach((friend) => {
    friendList += `
     <div id="friend">
        <img src="${`${friend.icon}?img=${Math.floor(Math.random() * 70)}`}" alt="${friend.name}" />
        <div id="nameContainer">
          <p id="friendName">${friend.name}</p>
          <p id="friendNickname">${friend.nickname}</p>
        </div>
        <div id="friendStatus">${friend.status}</div>
        <div id="friendDate">${friend.birthDate}</div>
      </div>
    `;
  });

  // get the html friends container
  const friendsContainer = document.getElementById("friendsContainer");

  // insert the friendlist into the html friendsContainer
  friendsContainer.innerHTML = friendList;
}

loadData();
