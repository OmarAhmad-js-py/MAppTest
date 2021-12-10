const id = localStorage.getItem("id")
const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const searchURL = BASE_URL + '/search/tv?' + API_KEY;


const genre = [
    {
        "id": 10759,
        "name": "Action & Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 10762,
        "name": "Kids"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10763,
        "name": "News"
    },
    {
        "id": 10764,
        "name": "Reality"
    },
    {
        "id": 10765,
        "name": "Sci-Fi & Fantasy"
    },
    {
        "id": 10766,
        "name": "Soap"
    },
    {
        "id": 10767,
        "name": "Talk"
    },
    {
        "id": 10768,
        "name": "War & Politics"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

const watchlist = document.getElementById("watchlist");
const recommend = document.getElementById("recommend")
const form = document.getElementById("form");
const main = document.getElementById("main_desc");
const tvshow = document.getElementById("tv-show")
const suggestion = document.getElementById("suggestions")
const seasons_button = document.getElementById("seasons-wrapper")
const episodes_button = document.getElementById("episodes-wrapper")
let selected_season = 0
let NextPage = 0
let selected_episode = 1


function getShow() {
    fetch(BASE_URL + '/tv/' + id + "?" + API_KEY).then((res) => res.json()).then((data) => {
        document.getElementById("currentPage").innerText = `${data.name}`;
        tvshow.setAttribute("src", " https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=1 &e=1")

    })
}

getShow();
getShowInformation();

function getShowInformation() {
    document.querySelectorAll('.embed');
    fetch(BASE_URL + '/tv/' + id + "?" + API_KEY).then((res) => res.json()).then((data) => {
        console.log(data)
        const Identifier = data.seasons[0].name === "Specials";
        for (let i in data.seasons) {
            const _element = document.createElement("a")
            _element.classList.add("season-button")
            _element.innerText = `${data.seasons[i].name}, (${data.seasons[i].episode_count})`
            _element.addEventListener("click", () => {
                if (Identifier == true) {
                    console.log(Identifier)
                } else {
                    return false
                }
                selected_season = i + 1;
                console.log(selected_season)
                console.log("wow")
            })
            seasons_button.appendChild(_element)

        }

        console.log(data.seasons[selected_season].episode_count)

        changeSeason(data)
    });
}

function changeSeason(data) {

    episodes_button.innerHTML = ""
    for (let x = 1; x <= data.seasons[selected_season].episode_count; x++) {
        const _episode = document.createElement("a")
        _episode.classList.add("episode-button")
        _episode.innerText = `${x}`
        _episode.addEventListener("click", () => {
            selected_episode = x
            $('#tv-show').attr('src', " https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=" + selected_season + "&e=" + x)
        })
        episodes_button.appendChild(_episode)
    }
}

function showMovies() {

    fetch(BASE_URL + '/tv/' + id + "?" + API_KEY).then((res) => res.json()).then((data) => {
            main.innerHTML = " ";
            //console.log(data);
            const number_of_seasons = data.number_of_seasons;

            const seasonObj = data.last_episode_to_air;
            const EpisodeObj = seasonObj.episode_number;
            //console.log(data.last_episode_to_air)

            const {poster_path, name, overview, first_air_date, vote_average} = data

            const movieEl = document.createElement("div");
            movieEl.classList.add("card");
            movieEl.innerHTML = `
         <div class="card-body">
            <img class="card-img-top" style="width: 120px;"src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/500x750"}" alt="Card image cap">
            <span class="movie-meta">
                <span class="movie-meta-item">S${number_of_seasons}</span> 
                <span class="movie-meta-item"> EP${EpisodeObj}</span>
            </span>
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${overview}</p>
         <span class="movie-meta">
           <span class="movie-meta-item">
            <i class="fas fa-clock"></i> ${first_air_date}</span>
             <a href="#" class="movie-meta-item">
            <i class="fas fa-star"></i> 
                ${vote_average}</a>
           </span>
            </div>
    `;
            main.appendChild(movieEl);
        }
    )
}

showMovies();


function tvshow_getRec() {


    fetch(BASE_URL + '/tv/' + id + "/recommendations?" + API_KEY).then((res) => res.json()).then((data) => {

        const info = data.results[0];
        const info1 = data.results[1];
        const info2 = data.results[2];


        suggestion.innerHTML = `
        <div class="card-body">
        <div class="title-hd"><h6>You may also like:</h6></div>
        <div class="row">
        <div class="d-flex justify-content-between " >
          <div class="card_suggestion" id="${info.id}" style="width: 250px; height:450px;">${info.name}<img class="suggestion-img"src="${info.poster_path ? IMG_URL + info.poster_path : 'https://via.placeholder.com/300x450'}" alt="Card image cap"></div>
          <div class="card_suggestion" id="${info1.id}"style="width: 250px; height:450px;">${info1.name}<img class="suggestion-img"src="${info1.poster_path ? IMG_URL + info1.poster_path : 'https://via.placeholder.com/300x450'}" alt="Card image cap"></div>
          <div class="card_suggestion" id="${info2.id}"style="width: 250px; height:450px;">${info2.name}<img class="suggestion-img"src="${info2.poster_path ? IMG_URL + info2.poster_path : 'https://via.placeholder.com/300x450'}" alt="Card image cap"></div>
          </div>
        </div>
        `
        document.getElementById(info.id).addEventListener("click", () => {
            const id = info.id;
            localStorage.setItem("id", id)
            location.reload();
            console.log(info.id);
        })
        document.getElementById(info1.id).addEventListener("click", () => {
            const id = info1.id;
            localStorage.setItem("id", id)
            location.reload();
            console.log(info1.id);
        })
        document.getElementById(info2.id).addEventListener("click", () => {
            const id = info2.id;
            localStorage.setItem("id", id)
            location.reload();
            console.log(info2.id);
        })


    })


}

tvshow_getRec();

function sendWatchList() {

    if (localStorage.getItem("Watchlist") == null) {
        localStorage.setItem("Watchlist", "[]")
    }


    watchlist.addEventListener("click", function (e) {
        e.preventDefault();


        const StoredWatchlist = JSON.parse(localStorage.getItem("Watchlist"))
        if (!StoredWatchlist.includes(id)) {
            StoredWatchlist.push(id)

            localStorage.setItem("Watchlist", JSON.stringify(StoredWatchlist))

            console.log(JSON.stringify(localStorage.getItem("Watchlist")));

            console.log(localStorage.getItem("Watchlist"))

        } else {
            return false;
        }


        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem("Watchlist")
        }


        fetch("/watchlistAPI", options).then(res => {
            console.log(res)

        })

    })


}

sendWatchList();

function sendRecommended() {

    if (localStorage.getItem("Recommended") == null) {
        localStorage.setItem("Recommended", "[]")
    }

    recommend.addEventListener("click", function (e) {
        e.preventDefault();


        const StoredRecommended = JSON.parse(localStorage.getItem("Recommended"))
        if (!StoredRecommended.includes(id)) {
            StoredRecommended.push(id)

            localStorage.setItem("Recommended", JSON.stringify(StoredRecommended))

            console.log(JSON.stringify(localStorage.getItem("Recommended")));

            console.log(localStorage.getItem("Recommended"))
        } else {
            return false
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem("Recommended")
        }


        fetch("/Recommended", options).then(res => {
            console.log(res)

        })

    })
}


sendRecommended();
