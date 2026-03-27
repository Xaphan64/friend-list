// get all of the inputs
username = document.getElementById("username");
email = document.getElementById("email");
birthDate = document.getElementById("birthDate");
password = document.getElementById("password");

// register function
function handleRegister(e) {
  // prevent default when submitting
  e.preventDefault();

  // 18 years date check
  dateCheck = handleDate();

  //   console.log(birthDate === currentDate);
  console.log("birth: " + birthDate.value);
  console.log("current: " + dateCheck);
  console.log(birthDate.value <= dateCheck ? "adult" : "minor");

  // de facut mesajele de eroare

  // de salvat in local storage

  // de resetat inputurile si facut redirectul
  if (birthDate.value <= dateCheck) {
    console.log(`inputs resetted`);
    window.location.href = "login.html";
  }
}

function handleDate() {
  // get the current date
  const now = new Date();
  currentDate = new Date(now);

  // substract 18 years from the current date
  currentDate.setFullYear(currentDate.getFullYear() - 18);

  // convert back to string
  const pastDate = currentDate.toISOString().split("T")[0];

  // return the result
  return pastDate;
}
