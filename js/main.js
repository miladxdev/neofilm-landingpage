$(document).ready(function () {
  $("#form").on("submit", (e) => {
    e.preventDefault();

    let searchText = $("#search").val();
    getMovies(searchText);
  });
});

getMovies("Terminator");

function getMovies(text) {
  $("#loader").show();
  axios
    .get(`http://www.omdbapi.com/?apikey=ce9c2ac7&s=${text}`)
    .then((response) => {
      $("#loader").hide();

      let movies = response.data.Search;
      let output = "";
      console.log(movies);
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-6 col-md-2">
            <div class="card card-h" onclick="movieSelected('${movie.imdbID}')">
              <div class="poster">
                <img src="${movie.Poster}">
              </div>
              <div class="card-content">
                <h4>${movie.Title}</h4>
              </div>
            </div>
          </div>`;
      });
      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");

  axios
    .get(`http://www.omdbapi.com/?apikey=ce9c2ac7&i=${movieId}`)
    .then((response) => {
      $("#loader").hide();

      console.log(response);
      let movie = response.data;
      let output = "";
      let Genres = "";
      let Actors = "";
      let genresArray = movie.Genre.split(",");
      let actorsArray = movie.Actors.split(",");
      $("body").css({
        backgroundImage: `url(${movie.Poster})`,
      });

      genresArray.map((genre) => (Genres += `<span class="genre">${genre.trim()}</span>`));
      actorsArray.map((actor) => (Actors += `<a href="#" class="actor text-info">${actor.trim()}</a>`));

      output = `
        <div class="container">
          <div class="row">
            <div class="col-12 col-md-4">
              <div class="poster">
                <img src="${movie.Poster} ${movie.year}">
              </div>
            </div>
            <div class="col-12 col-md-8 mt-5 mt-md-0">
              <div class="item-row">
                <h1>${movie.Title} ${movie.Year}</h1>
                <small class="badge bg-secondary">${movie.Runtime}</small>
                
                <small class="badge bg-secondary">${movie.Rated}</small>
              </div>

              <div class="item-row">
                <div class="rating-wrap">
                  <span class="imdb-rating"><i class="fa fa-star">
                    </i> ${movie.imdbRating}/10<small>${movie.imdbVotes}</small>
                  </span>
                  <div class="meta">
                    <span class="meta-rating">${movie.Ratings[2] ? movie.Ratings[2].Value : "XX"}</span>
                    <small>Metascore</small>
                  </div> 
                </div>
              </div>

              <div class="item-row">
                <div class="genres-wrap">${Genres}</div>
              </div>
              
              <div class="item-row">
                <p>${movie.Plot}</p>
              </div>
              
              <div class="item-row">
                <h4>Director</h4>
              <a class="text-info" href="#">${movie.Director}</a>
              </div>
              
              <div class="item-row">
                <h4>Stars</h4>
                <div>${Actors}</div>
              </div>

              <div class="item-row">
                <h4>Awards</h4>
                <div>${movie.Awards}</div>
              </div>

              <div class="item-row">
                <button class="btn btn-warning"><a class="text-dark" href="https://imdb.com/title/${movie.imdbID}">IMDB</button>
              </div>
              
            </div>
          </div>
        </div>
        `;

      $("#movie").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
