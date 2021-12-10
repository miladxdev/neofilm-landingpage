let page = 1;

$(document).ready(function () {
  $("#form").on("submit", (e) => {
    e.preventDefault();
    let searchText = $("#search").val();
    localStorage.setItem("lastResult", searchText);
    getMovies(searchText, page);
  });
});

// load THE last result after reloading
lastResult = localStorage.getItem("lastResult");
getMovies(lastResult ?? "Star Wars", page);

function getMovies(text, page) {
  $("#loader").show();

  axios
    .get(`https://www.omdbapi.com/?apikey=ce9c2ac7&s=${text}&page=${page}`)
    .then((response) => {
      $("#loader").hide();

      let movies = response.data.Search;
      let output = "";
      console.log(movies);
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-6 col-lg-2 col-md-3">
            <div class="card" onclick="movieSelected('${movie.imdbID}', this)">
              <div class="poster skeleton">
                <img src="${movie.Poster}">
              </div>
              <div class="card-content skeleton">
                <h4>${movie.Title}</h4>
              </div>
            </div>
          </div>`;
      });

      $("#movies").html(output);

      $("img").on("load", function () {
        $(this).css({ opacity: 0.95 });
        $(this).parents(".card .card-content").css({ color: "white" });
        // remove all skeleton classes when the image loads
        $(this).parents(".card").children(".skeleton").removeClass("skeleton");
      });
    })
    .catch((err) => {
      console.error(err);
      $("#movies").html(`
        <div class="alert alert-danger" role="alert">
          Something is wrong! please try again
        </div>
      `);
    });
}

function movieSelected(id, elem) {
  sessionStorage.setItem("movieId", id);
  $(elem).append($('<div id="loader" class="center"></div>'));
  window.location = "movie.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");

  axios
    .get(`https://www.omdbapi.com/?apikey=ce9c2ac7&i=${movieId}`)
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
                <div id="loader"></div>
                <img src="${movie.Poster}">
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
                <a class="btn btn-warning" target="black" href="https://imdb.com/title/${movie.imdbID}">IMDB</a>
              </div>
              
            </div>
          </div>
        </div>
        `;

      $("#movie").html(output);

      $("img").on("load", function () {
        $(this).siblings("#loader").hide();
        $(this).css({ opacity: 1 });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
