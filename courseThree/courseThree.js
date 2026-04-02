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
    console.log("parsed JSON data:", data);

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
    data.movies.forEach((movie) => {
      html += `
    <div id="movie">
      <img src="https://placehold.co/90x90" alt="${movie.title}" />
      <div id="movieText">
        <span id="movieTitle">${movie.title} <p id="movieYear">${`(${movie.year})`}</p></span>
        <div id="movieDetails">
          
        <div id="ratingContainer">
          <img src="imdb.png" alt="IMDB" id="imdbIcon" />
          <p id="rating">${movie.rating}⭐</p>
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
  })
  // catch errors
  .catch((error) => {
    console.error("Failed to fetch data:", error);
    // insert the error in html
    document.getElementById("book-container").innerHTML =
      `<p class="error">Error loading data: ${error.message}</p>`;
  });
