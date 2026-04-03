// create an empty array with movies
let allMovies = [];

// define rating status
let isRating;
let isAlphabetically;

function handleRender(movies) {
  // get the html document
  const moviesContainer = document.getElementById("moviesContainer");

  // toUpperCase 1st letter
  function capitalize(string) {
    return string
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  // display data here
  let html = "";
  movies.forEach((movie) => {
    html += `
    <div id="movie">
      <img src="https://placehold.co/90x90" alt="${movie.title}" />
      <div id="movieText">
        <span id="movieTitle">${movie.title} <p id="movieYear">${`(${movie.year})`}</p></span>
        <div id="movieDetails">
          
        <div id="ratingContainer">
          <img src="imdb.png" alt="IMDB" id="imdbIcon" />
          <p id="rating">${movie.rating.toFixed(1)}⭐</p>
        </div>
          <p id="movieGenre">${capitalize(movie.genre)}</p>
        </div>
      </div>
      <div id="buttonContainer">
        <button type="button" onclick="null">add to watchlist</button>
        <button type="button" onclick="null">remove movie</button>
      </div>
    </div>
        `;
  });

  // insert the data into the html
  moviesContainer.innerHTML = html;
}

function handleRating() {
  // toggle on/off the status
  isRating = !isRating;

  // sort all movies asc or desc depending on status
  const sortedMovies = [...allMovies].sort((a, b) =>
    isRating ? a.rating - b.rating : b.rating - a.rating,
  );

  // change the button textContent depending on the status
  document.getElementById("ratingButton").textContent = isRating
    ? "Rating ↑"
    : "Rating ↓";

  // render sorting
  handleRender(sortedMovies);
}

function handleAlphabetically() {
  // toggle on/off the status
  isAlphabetically = !isAlphabetically;

  // sort all movies asc or desc depending on status
  const sortedMovies = allMovies.sort((a, b) =>
    isAlphabetically
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title),
  );

  // change the button textContent depending on the status
  document.getElementById("ascendingButton").textContent = isAlphabetically
    ? "Alphabetically a-z"
    : "Alphabetically z-a";

  // render sorting
  handleRender(sortedMovies);
}

function handleGenre() {
  // const genres = [...allMovies].map((movie) => movie.genre.split(" ").flat());
  const genres = [
    ...new Set(allMovies.flatMap((movie) => movie.genre.split(" "))),
  ];

  console.log(genres);
  // const sortedMovies = [...allMovies].map((movie) => console.log(movie.genre));

  // handleRender(sortedMovies);
}

function handleWatchlist() {
  const sortedMovies = allMovies.filter((movie) => movie.watched);

  handleRender(sortedMovies);
}

// fetch json data
fetch("movies.json")
  // first then that handles the response
  .then((response) => {
    // check if the response was succesfull
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // parse the response as JSON
    return response.json();
  })
  // second then with the parsed data
  .then((data) => {
    // get all movies
    allMovies = data.movies;

    // render all the movies
    handleRender(allMovies);
  })
  // catch errors
  .catch((error) => {
    console.error("Failed to fetch data:", error);
    // insert the error in html
    document.getElementById("book-container").innerHTML =
      `<p class="error">Error loading data: ${error.message}</p>`;
  });
