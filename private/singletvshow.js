const id = localStorage.getItem("id");
const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const IMG_URL_large = "https://image.tmdb.org/t/p/w1280";
const searchURL = BASE_URL + "/search/tv?" + API_KEY;

const genre = [
    {
        id: 10759,
        name: "Action & Adventure",
        icon: "fa-solid fa-location-crosshairs-slash"
    },
    {
        id: 16,
        name: "Animation",
        icon: "fa-solid fa-dice-d20"
    },
    {
        id: 35,
        name: "Comedy",
        icon: "fa-solid fa-laugh-beam"
    },
    {
        id: 80,
        name: "Crime",
        icon: "fa-solid fa-gavel"
    },
    {
        id: 99,
        name: "Documentary",
        icon: "fa-solid fa-book-reader"
    },
    {
        id: 18,
        name: "Drama",
        icon: "fa-solid fa-theater-masks"

    },
    {
        id: 10751,
        name: "Family",
        icon: "fa-solid fa-family"

    },
    {
        id: 10762,
        name: "Kids",
        icon: "fa-solid fa-child"
    },
    {
        id: 9648,
        name: "Mystery",
        icon: "fa-solid fa-question-circle"
    },
    {
        id: 10763,
        name: "News",
        icon: "fa-solid fa-newspaper"
    },
    {
        id: 10764,
        name: "Reality",
        icon: "fa-solid fa-tv"
    },
    {
        id: 10765,
        name: "Sci-Fi & Fantasy",
        icon: "fa-solid fa-space-shuttle"
    },
    {
        id: 10766,
        name: "Soap",
        //icon for retro tv
        icon: "fa-solid fa-tv-retro"
    },
    {
        id: 10767,
        name: "Talk",
        icon: "fa-solid fa-comments"
    },
    {
        id: 10768,
        name: "War & Politics",
        icon: "fa-solid fa-flag"
    },
    {
        id: 37,
        name: "Western",
        icon: "fa-solid fa-cactus"
    },
];


const watchlist = document.getElementById("watchlist");
const recommend = document.getElementById("recommend");
const mainEl = document.getElementById("main");
const iframe = document.getElementById("tvshow");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const Selider = document.getElementById("Selider");
const Epslider = document.getElementById("Epslider");
const CheackBtn = document.getElementById("get-url-btn");
const main = document.getElementById("main_desc");
const tvshow = document.getElementById("tvshow");
const card_text = document.getElementById("card-text");
const suggestion = document.getElementById("suggestions");
const backdrop = document.getElementById("backdrop");
let Changedseasons = 1;
let Changedepisode = 1;


function getseasons(data) {
    for (let i = 0; i < data.number_of_seasons; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.id = i + 1;
        option.innerText = i + 1;
        option.addEventListener("click", function () {
            Changedseasons = this.value;
            console.log(Changedseasons);
            tvshow.setAttribute(
                "src",
                `https://www.2embed.ru/embed/tmdb/tv?id=${id}&s=${Changedseasons} &e=${Changedepisode}`
            );
            makeSlider(data.id, Changedseasons);


        });
        Selider.appendChild(option);
    }

}

function makeSlider(id, season) {
    const options = {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    };


    fetch(`${BASE_URL}/tv/${id}/season/${season}?${API_KEY}`, options)
        .then(data => {
            return data.json();
        }).then(data => {
            console.log(data);
            while (Epslider.firstChild) {
                Epslider.removeChild(Epslider.firstChild);
            }
            for (let i = 0; i < data.episodes.length; i++) {
                const option = document.createElement("option");
                option.setAttribute("id", `${i}`);
                option.value = i + 1;
                option.innerText = i + 1;
                console.log(option.value);
                option.addEventListener("click", function () {
                    Changedepisode = this.value;
                    tvshow.setAttribute(
                        "src",
                        `https://www.2embed.ru/embed/tmdb/tv?id=${id}&s=${Changedseasons} &e=${Changedepisode}`
                    );
                    getseasons(Changedepisode);

                });
                Epslider.appendChild(option);
            }

        }).catch((err) => {
            console.log("ERROR: " + err.message)
        })
}
makeSlider(id);


function tvshow_getShow() {
    console.log(id)
    fetch(BASE_URL + "/tv/" + id + "?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            document.getElementById("currentPage").innerText = `${data.name}`;
            getseasons(data);
            makeSlider(id, Changedseasons)
            console.log(data);
            tvshow.setAttribute(
                "src",
                `https://www.2embed.ru/embed/tmdb/tv?id=${id}&s=${Changedseasons} &e=${Changedepisode}`
            );
            backdrop.setAttribute(
                "style",
                `background-image: url(${IMG_URL_large + data.backdrop_path})`
            );
        });
}

tvshow_getShow();


function showMovies() {
    fetch(BASE_URL + "/tv/" + id + "?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            main.innerHTML = " ";

            console.log(data);
            const number_of_seasons = data.number_of_seasons;

            const seasonObj = data.last_episode_to_air;
            const EpisodeObj = seasonObj.episode_number;
            console.log(data.last_episode_to_air);

            for (let i = 0; i < data.genres.length; i++) {


            }

            const { poster_path, name, overview, first_air_date, vote_average, genres } = data;

            console.log(genres);

            const movieEl = document.createElement("div");
            movieEl.classList.add("col-md-12");
            movieEl.innerHTML = `
            <div class="row details ">   
            <div class="col-md-2 col-sm-4 col-3">
               <img class="img-thumbnail" src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/500x750"}" alt="Card image cap">
               <span class="movie-meta">
               <span class="movie-meta-item">S${number_of_seasons}</span> 
               <span class="movie-meta-item"> EP${EpisodeObj}</span>
              
           </span>
           </div>
           <div class="col-md-10 col-sm-8 col-9">
            
               
           
               <h6 class="card-title">${name}</h6>
            
             
               <p class="card-text">${overview}</p>
            
               <span class="movie-meta">
               <span class="movie-meta-item">
                 <i class="fas fa-clock"></i>
                 ${first_air_date}
               </span>
               <span>
                 <a href="#" class="movie-meta-item">
                   <i class="fas fa-star"></i>
                   ${vote_average}
                 </a>
               </span>
               </span>
               <span class="movie-meta-item">
               ${genres.map(genre => `<span class="badge badge-secondary" style="font-size: 14px">${genre.name}</span>`).join(" ")}
               </span>
             
           </div>
               </div>
               
         
            
        

    `;


            main.appendChild(movieEl);
        });

}

showMovies();

function tvshow_getRec() {
    fetch(BASE_URL + "/tv/" + id + "/recommendations?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const info = data.results[0];
            const info1 = data.results[1];
            const info2 = data.results[2];

            suggestion.innerHTML = `
        
    <div class="card-text">
      <h6>You may also like:</h6>
    </div> 
    <div class="row justify-content-between">
    <div class="col-md-2 col-sm-4 col-3 ">
        <div class="card_suggestion" id="${info.id}" style="width: 250px; height:450px;">
        <span class="movie-meta-suggestion">${info.name}</span>
        <img class="img-fluid" src="${info.poster_path ? IMG_URL + info.poster_path : " https://via.placeholder.com/300x450"}" alt="Card image cap">
        </div>
    </div> 

    <div class="col-md-2 col-sm-4 col-3 ">
        <div class="card_suggestion" id="${info2.id}" style="width: 250px; height:450px;">
        <span class="movie-meta-suggestion">${info2.name}</span>
        <img class="img-fluid" src="${info2.poster_path ? IMG_URL + info2.poster_path : " https://via.placeholder.com/300x450"}" alt="Card image cap">
        </div>
    </div> 

     
    <div class="col-md-2 col-sm-4 col-3 ">
        <div class="card_suggestion" id="${info1.id}" style="width: 250px; height:450px;">
        <span class="movie-meta-suggestion">${info1.name}</span>
        <img class="img-fluid" src="${info1.poster_path ? IMG_URL + info1.poster_path : " https://via.placeholder.com/300x450"}" alt="Card image cap">
     </div>
     </div> 
     </div> 
     
      
       
        `;
            document.getElementById(info.id).addEventListener("click", () => {
                const id = info.id;
                localStorage.setItem("id", id);
                location.reload();
                console.log(info.id);
            });
            document.getElementById(info1.id).addEventListener("click", () => {
                const id = info1.id;
                localStorage.setItem("id", id);
                location.reload();
                console.log(info1.id);
            });
            document.getElementById(info2.id).addEventListener("click", () => {
                const id = info2.id;
                localStorage.setItem("id", id);
                location.reload();
                console.log(info2.id);
            });


        });

}

tvshow_getRec();

async function sendWatchList() {


    if (localStorage.getItem("Watchlist") == null) {
        localStorage.setItem("Watchlist", "[]");
    }

    watchlist.addEventListener("click", function (e) {
        e.preventDefault();

        const StoredWatchlist = JSON.parse(localStorage.getItem("Watchlist"));
        if (!StoredWatchlist.includes(id)) {
            StoredWatchlist.push(id);
            localStorage.setItem("Watchlist", JSON.stringify(StoredWatchlist));


        } else {
            console.log(JSON.parse(localStorage.getItem("Watchlist")));
            return false;
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: localStorage.getItem("Watchlist"),
        };

        fetch("/watchlistAPI", options).then(res => {
            console.log(res);
        });
    });
}

sendWatchList();

function sendRecommended() {

    if (localStorage.getItem("Recommended") == null) {
        localStorage.setItem("Recommended", "[]");
    }

    recommend.addEventListener("click", function (e) {
        e.preventDefault();

        const StoredRecommended = JSON.parse(localStorage.getItem("Recommended"));
        if (!StoredRecommended.includes(id)) {
            StoredRecommended.push(id);

            localStorage.setItem("Recommended", JSON.stringify(StoredRecommended));

            console.log(JSON.stringify(localStorage.getItem("Recommended")));

            console.log(localStorage.getItem("Recommended"));
        } else {
            return false;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: localStorage.getItem("Recommended"),
        };

        fetch("/Recommended", options).then(res => {
            console.log(res);
        });
    });
}

sendRecommended();
