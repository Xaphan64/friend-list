// elements
const userName = document.getElementById("userName");
const userAge = document.getElementById("userAge");

// get data from local storage
userName.textContent = localStorage.getItem("username");
// calculate the age
const birthDate = new Date(localStorage.getItem("birthDate"));
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
userAge.textContent = age;

const display = document.getElementById("display");

// calculator
const buttonValues = [
  "AC",
  "+/-",
  "%",
  "÷",
  "7",
  "8",
  "9",
  "x",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "=",
];
const rightSymbols = ["÷", "x", "-", "+", "="];
const topSymbols = ["AC", "+/-", "%"];

// default
let A = 0;
let operator = null;
let B = null;

function clearAll() {
  A = 0;
  operator = null;
  B = null;
}

function handleLogout() {
  window.location.href = "login.html";
}

// loop through the buttonValues
for (let i = 0; i < buttonValues.length; i++) {
  // get each element in the buttonValues array
  let value = buttonValues[i];
  // create a new button element
  let button = document.createElement("button");
  // insert each array element into the newly button created text
  button.innerText = value;

  // styling button colors
  // make 0 bigger than the other buttons
  if (value == "0") {
    button.style.width = "180px";
    button.style.gridColumn = "span 2";
  }
  // change the color of the right operands
  if (rightSymbols.includes(value)) {
    button.style.backgroundColor = "#FF9500";
    // change the colof of the top operands
  } else if (topSymbols.includes(value)) {
    button.style.backgroundColor = "#D4D4D2";
    button.style.color = "#1c1c1c";
  }

  // button clicks
  button.addEventListener("click", function () {
    if (rightSymbols.includes(value)) {
      if (value == "=") {
        if (A != null) {
          B = display.value;
          let numA = Number(A);
          let numB = Number(B);

          if (operator == "÷") {
            display.value = numA / numB;
          } else if (operator == "x") {
            display.value = numA * numB;
          } else if (operator == "-") {
            display.value = numA - numB;
          } else if ((operator = "+")) {
            display.value = numA + numB;
          }
        }
      } else {
        operator = value;
        A = display.value;
        display.value = "";
      }
    } else if (topSymbols.includes(value)) {
      if (value == "AC") {
        clearAll();
        display.value = "";
      } else if (value == "+/-") {
        // if display not empty and not 0
        if (display.value != "" && display.value != "0") {
          // if value is negative, slice the - to make it positive
          if (display.value[0] == "-") {
            display.value = display.value.slice(1);
          } else {
            // else make it negative
            display.value = "-" + display.value;
          }
        }
      } else if (value == "%") {
        display.value = Number(display.value) / 100;
      }
    } else {
      // numbers or .
      if (value == ".") {
        // prevent more than one .
        if (display.value != "" && !display.value.includes(value)) {
          display.value += value;
        }
      } // cannot have more then one 0 when 0 is 1st computted
      else if (display.value == "0") {
        display.value = value;
      } else {
        // display numbers
        display.value += value;
      }
    }
  });
  // insert the all the buttons into the html
  document.getElementById("buttons").appendChild(button);
}
