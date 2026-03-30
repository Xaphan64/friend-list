// get all of the inputs
const username = document.getElementById("username");
const email = document.getElementById("email");
const birthDate = document.getElementById("birthDate");
const password = document.getElementById("password");
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");

// get all the error messages
const fieldError = document.getElementById("fieldError");
const ageError = document.getElementById("ageError");
const loginEmptyError = document.getElementById("loginEmptyError");
const loginError = document.getElementById("loginError");

// let errorTimeout;

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

  // show empty fields error or underage error
  handleError(
    registerEmptyCondition,
    fieldError,
    registerAgeCondition,
    ageError,
  );

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
  // clearTimeout(errorTimeout);
  // hide all errors
  document.querySelectorAll(".error").forEach((el) => {
    el.style.display = "none";
  });

  // make element error appear
  element.style.display = "block";

  // make error dissapear after 15s
  // errorTimeout =
  setTimeout(() => {
    element.style.display = "none";
  }, 5000);
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

function handleError(condition, error, conditionTwo, errorTwo) {
  // if condition
  if (condition) {
    // throw  error
    showError(error);
    return;
    // second condition
  } else if (conditionTwo) {
    // second error
    showError(errorTwo);
  }
}

function handleLogin(e) {
  // prevent default when submitting
  e.preventDefault();

  // get local storage data
  storageEmail = localStorage.getItem("email");
  storagePassword = localStorage.getItem("password");

  // empty fields condition
  loginEmptyCondition =
    emailLogin.value.trim() === "" || passwordLogin.value.trim() === "";

  // wrong email or pass condition
  loginCondition =
    emailLogin.value !== storageEmail ||
    passwordLogin.value !== storagePassword;

  //show empty field error or wrong credentials error
  handleError(loginEmptyCondition, loginEmptyError, loginCondition, loginError);

  if (
    emailLogin.value === storageEmail &&
    passwordLogin.value === storagePassword
  ) {
    //redirect to calculator page
    window.location.href = "calculator.html";
  }
}
