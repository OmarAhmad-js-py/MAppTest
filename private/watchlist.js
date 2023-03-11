const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/tv/";
const IMG_size = "https://image.tmdb.org/t/p/w500";



const mainEl = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const Selider = document.getElementById("Season");
const Epslider = document.getElementById("Episodes");

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const current = document.getElementById("current")




getwatchlistData();
function getwatchlistData() {
  const uri = '/Watchlater'
  let h = new Headers();
  h.append('Accept', 'application/json')

  let req = new Request(uri, {
    method: 'GET',
    headers: h,
    mode: 'cors',
  });

  fetch(req)
    .then((res) => res.json())
    .then((data) => {
      getWatchlist(data)
      console.log(data)
    })
    .catch((err) => {
      console.log("ERROR: " + err.message)
    })
}


function getWatchlist(data) {
  const watchlist = data
  console.log(watchlist)
  const watchlistdata = []

  data.forEach((ids) => {
    console.log(ids)
    if (ids.includes('tt')) {
      console.log('movie')
      fetch(BASE_URL + "/movie/" + ids + '?' + API_KEY + '&language=en-US')
        .then((res) => res.json())
        .then((Tvshowdata) => {
          console.log(Tvshowdata)
          watchlistdata.push(Tvshowdata)
          showWatchlist(watchlistdata)
        })
    } else {
      fetch(API_URL + ids + '?' + API_KEY + '&language=en-US&external_source=imdb_id')
        .then((res) => res.json())
        .then((Tvshowdata) => {
          console.log(Tvshowdata)
          watchlistdata.push(Tvshowdata)
          showWatchlist(watchlistdata)
        })
    }


  })
}

function showWatchlist(watchlistdata) {
  mainEl.innerHTML = " ";
  const delTMD = []



  watchlistdata.forEach((movie) => {
    const watchlist = []

    const { name, title, first_air_date, release_date, vote_average, overview, poster_path, id } = movie;
    delTMD.push(movie)

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie", "col-lg-4", "col-m6", "col-s12");
    movieEl.innerHTML = `
      <div class="card-content">
      <span style="color: Mediumslateblue;">
      <i id="${delTMD}" class="Delete-btn fas fa-minus-circle"  data-fa-transform="grow-6"></i>
      </span>
          <img 
          style="height: auto; width: 100%;"  src="${poster_path ? IMG_size + poster_path : "https://via.placeholder.com/500x750"}"
          />
          </div>
      </div>
      <div class="movie-content">
        <h2>
          <a href="/singletvshow" id="${id}" class="link_video"
            >${name ? name : title}</a
          >
        </h2>
        <span class="movie-meta">
          <span class="movie-meta-item"
            ><i class="fas fa-clock"></i> ${first_air_date ? first_air_date : release_date}</span
          >
          <a href="#" class="movie-meta-item"
            ><i class="fas fa-star"></i> ${vote_average}</a
          >
        </span>
        <p style="display: block">
        ${overview}
        </p>
      </div>
      
   
      
     
    `;

    mainEl.appendChild(movieEl);
    document.getElementById(id).addEventListener("click", () => {
      const movieid = [];
      movieid.push(id);
      console.log("You have watch" + id);
      window.localStorage.setItem("id", JSON.stringify(id));

    })
    document.getElementById(delTMD).addEventListener("click", () => {
      const ids = []
      console.log(movie.id)
      const id = movie.id && movie.imdb_id ? movie.imdb_id : movie.id
      ids.push(id)
      const StoredWatchlist = JSON.parse(localStorage.getItem("Watchlist"))
      const changed = StoredWatchlist.splice(ids, 1)
      console.log(JSON.stringify(changed))

      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(ids)
      }


      fetch("/delRW", options).then(res => {
        console.log(res.message);

      })
      window.location.reload()

    })

  })
}

