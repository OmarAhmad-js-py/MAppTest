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
const mainEl = document.getElementById("main");
const iframe = document.getElementById("tvshow");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags")
const Selider = document.getElementById("Season");
const Epslider = document.getElementById("Episodes");
const CheackBtn = document.getElementById("get-url-btn");
const main = document.getElementById("main_desc");
const tvshow = document.getElementById("tvshow")
const card_text = document.getElementById("card-text")
const suggestion = document.getElementById("suggestions")






function tvshow_getShow() {
    fetch(BASE_URL + '/tv/' + id + "?" + API_KEY).then((res) => res.json()).then((data) => {
        document.getElementById("currentPage").innerText = `${data.name}`;
        console.log(data)
        tvshow.setAttribute("src", " https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=1 &e=1")

    })
}

tvshow_getShow();
getSeasons();
function getSeasons() {

    let embedClasses = document.querySelectorAll('.embed');
    fetch(BASE_URL + `/tv/${id}?` + API_KEY).then((res) => res.json()).then((data) => {
        console.log(data)
        var Episode = Array.apply(null, Array(data.number_of_episodes)).map(function (_, i) { return i + 1; });
        var season = Array.apply(null, Array(data.number_of_seasons)).map(function (_, i) { return i + 1; });


        $('#get-url-btn').click(function () {
            let Episode = $('#Episode').val();
            let Season = $('#Season').val();
            $('#tvshow').attr('src', " https://www.2embed.ru/embed/tmdb/tv?id=" + id + "&s=" + Season + "&e=" + Episode)

        });



    })
}






function showMovies() {

    fetch(BASE_URL + '/tv/' + id + "?" + API_KEY).then((res) => res.json()).then((data) => {
        main.innerHTML = " ";

        console.log(data);
        const number_of_seasons = data.number_of_seasons;

        const seasonObj = data.last_episode_to_air;
        const EpisodeObj = seasonObj.episode_number;
        console.log(data.last_episode_to_air)






        const { poster_path, name, overview, first_air_date, vote_average } = data


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
        console.log(data)
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

async function sendtoBackend() {
    const showid = id

    if (localStorage.getItem("Watchlist") == null) {
        localStorage.setItem("Watchlist", "[]")
    }

    const normale = JSON.stringify(localStorage.getItem("Watchlist"))
    const newString = normale.replace(' \ ', '');
    console.log(newString)
    watchlist.addEventListener("click", function (e) {
        e.preventDefault();



        const StoredWatchlist = JSON.parse(localStorage.getItem("Watchlist"))
        StoredWatchlist.push(id)

        localStorage.setItem("Watchlist", JSON.stringify(StoredWatchlist))

        console.log(JSON.stringify(localStorage.getItem("Watchlist")));

        console.log(localStorage.getItem("Watchlist"))

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
sendtoBackend();









