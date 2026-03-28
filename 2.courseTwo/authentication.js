// get all of the inputs
username = document.getElementById("username");
email = document.getElementById("email");
birthDate = document.getElementById("birthDate");
password = document.getElementById("password");

// get all the error messages
fieldError = document.getElementById("fieldError");
ageError = document.getElementById("ageError");
loginError = document.getElementById("loginError");

let errorTimeout;

function handleRegister(e) {
  // prevent default when submitting
  e.preventDefault();

  // empty input condition
  registerEmptyCondition =
    username.value.trim() === "" ||
    email.value.trim() === "" ||
    birthDate.value.trim() === "" ||
    password.value.trim() === "";

  // current date (years) - 14
  ageCheck = handleDate(14);

  // lower than 14 condition
  registerAgeCondition = birthDate.value >= ageCheck;

  // empty input error
  handleError(registerEmptyCondition, fieldError);

  // age error
  handleError(registerAgeCondition, ageError);

  // if inputs are not empty and age is above 14
  if (
    username.value.trim() !== "" &&
    email.value.trim() !== "" &&
    birthDate.value.trim() !== "" &&
    password.value.trim() !== "" &&
    birthDate.value <= ageCheck
  ) {
    // save input data to local storage
    localStorage.setItem("username", username.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("birthDate", birthDate.value);
    localStorage.setItem("password", password.value);

    // redirect to login page
    window.location.href = "login.html";
  }
  // }
}

function handleDate(year) {
  // get the current date
  const now = new Date();
  currentDate = new Date(now);

  // substract X years from the current date
  currentDate.setFullYear(currentDate.getFullYear() - year);

  // convert back to string
  const pastDate = currentDate.toISOString().split("T")[0];

  // return the result
  return pastDate;
}

function showError(element) {
  clearTimeout(errorTimeout);
  // default to none in case any error overlaps
  fieldError.style.display = "none";
  ageError.style.display = "none";

  // make element error appear
  element.style.display = "block";

  // make error dissapear after 30s
  errorTimeout = setTimeout(() => {
    element.style.display = "none";
  }, 15000);
}

// function handleError() {
//   // current date (years) - 14
//   ageCheck = handleDate(14);

//   // if any input is empty
//   if (
//     username.value.trim() === "" ||
//     email.value.trim() === "" ||
//     birthDate.value.trim() === "" ||
//     password.value.trim() === ""
//   ) {
//     // throw field error
//     showError(fieldError);
//     // if age is lower then 14
//   } else if (birthDate.value >= ageCheck) {
//     // throw age error
//     showError(ageError);
//   }
// }

function handleError(condition, error) {
  // if condition
  if (condition) {
    // throw  error
    showError(error);
    return;
  }
}

function handleLogin(e) {
  e.preventDefault();

  //redirect to calculator page
  // window.location.href = "calculator.html";
}
