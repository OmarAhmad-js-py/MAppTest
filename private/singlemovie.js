const id = window.location.href.split('=')[1]
let imdb_id;
console.log("hello")
const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const IMG_URL_large = "https://image.tmdb.org/t/p/w1280";
const searchURL = BASE_URL + "/search/tv?" + API_KEY;

const genre = [{
    id: 10759, name: "Action & Adventure", icon: "fa-solid fa-location-crosshairs-slash"
}, {
    id: 16, name: "Animation", icon: "fa-solid fa-dice-d20"
}, {
    id: 35, name: "Comedy", icon: "fa-solid fa-laugh-beam"
}, {
    id: 80, name: "Crime", icon: "fa-solid fa-gavel"
}, {
    id: 99, name: "Documentary", icon: "fa-solid fa-book-reader"
}, {
    id: 18, name: "Drama", icon: "fa-solid fa-theater-masks"

}, {
    id: 10751, name: "Family", icon: "fa-solid fa-family"

}, {
    id: 10762, name: "Kids", icon: "fa-solid fa-child"
}, {
    id: 9648, name: "Mystery", icon: "fa-solid fa-question-circle"
}, {
    id: 10763, name: "News", icon: "fa-solid fa-newspaper"
}, {
    id: 10764, name: "Reality", icon: "fa-solid fa-tv"
}, {
    id: 10765, name: "Sci-Fi & Fantasy", icon: "fa-solid fa-space-shuttle"
}, {
    id: 10766, name: "Soap", //icon for retro tv
    icon: "fa-solid fa-tv-retro"
}, {
    id: 10767, name: "Talk", icon: "fa-solid fa-comments"
}, {
    id: 10768, name: "War & Politics", icon: "fa-solid fa-flag"
}, {
    id: 37, name: "Western", icon: "fa-solid fa-cactus"
},];


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
const suggestion = document.getElementById("Recommendeded");
const backdrop = document.getElementById("backdrop");
let Changedseasons = 1;
let Changedepisode = 1;




function tvshow_getShow() {
    console.log(id)
    fetch(BASE_URL + "/movie/" + id + "?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            document.getElementById("currentPage").innerText = `${data.title}`;
            console.log(data);
            imdb_id = data.imdb_id
            tvshow.setAttribute("src", `https://www.2embed.to/embed/tmdb/movie?id=${id}`);
            backdrop.setAttribute("style", `background-image: url(${IMG_URL_large + data.backdrop_path})`);
        });
}

tvshow_getShow();


function showMovies() {
    fetch(BASE_URL + "/movie/" + id + "?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            main.innerHTML = " ";
            const { poster_path, title, overview, release_date, vote_average, genres } = data;

            console.log(genres);

            const movieEl = document.createElement("div");
            movieEl.classList.add("col-md-12");
            movieEl.innerHTML = `
            <div class="row details ">   
            <div class="col-md-2 col-sm-4 col-3">
               <img class="img-thumbnail" src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/500x750"}" alt="Card image cap">
               <span class="movie-meta">
           </span>
           </div>
           <div class="col-md-10 col-sm-8 col-9">
            
               
           
               <h6 class="card-title">${title}</h6>
            
             
               <p class="card-text">${overview}</p>
            
               <span class="movie-meta">
               <span class="movie-meta-item">
                 <i class="fas fa-clock"></i>
                 ${release_date}
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
    fetch(BASE_URL + "/movie/" + id + "/recommendations?" + API_KEY)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.results.map((item, index) => {
                console.log(item);
                const { poster_path, name, vote_average, id } = item;
                const movieEl = document.createElement("div");
                movieEl.classList.add("col-md-3", "col-sm-6", "col-6");
                movieEl.style = "margin-bottom: 20px";
                movieEl.innerHTML = `
                 <div class="image">
                 <img id="${id}" style="width: 200px;"
                   src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/500x750"}" alt="${name}" />
                 <div class="overlay" >
                   <div class="text">
                     <a href="tvshow.html?id=${id}">${name}</a>
                   </div>
                 </div>
                 
               `;
                suggestion.appendChild(movieEl);
                document.getElementById(id).addEventListener("click", () => {
                    const movieid = [];
                    movieid.push(id);
                    console.log(id)
                    console.log("You have watch" + id);
                    window.location.href = "/singlemovie?id=" + id;
                    window.localStorage.setItem("id", JSON.stringify(id))
                });
            })
        });

}

tvshow_getRec();

function sendWatchList() {
    if (localStorage.getItem("Watchlist") == null) {
        localStorage.setItem("Watchlist", "[]");
    }

    watchlist.addEventListener("click", function (e) {
        e.preventDefault();

        const StoredWatchlist = JSON.parse(localStorage.getItem("Watchlist"));
        if (!StoredWatchlist.includes(imdb_id)) {
            StoredWatchlist.push(imdb_id);
            localStorage.setItem("Watchlist", JSON.stringify(StoredWatchlist));
        } else {
            console.log(JSON.parse(localStorage.getItem("Watchlist")));
            return false;
        }


        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({ imdb_id: imdb_id }),

        };

        fetch("/watchlistAPI", options).then(res => {
            console.log(res);
        }
        );
    });
}

sendWatchList();

function sendRecommended() {
    if (localStorage.getItem("Recommended") == null) {
        localStorage.setItem("Recommended", "[]");
    }

    recommend.addEventListener("click", (e) => {
        e.preventDefault();

        const StoredRecommended = JSON.parse(localStorage.getItem("Recommended"));
        if (!StoredRecommended.includes(imdb_id)) {
            StoredRecommended.push(imdb_id);

            localStorage.setItem("Recommended", JSON.stringify(StoredRecommended));

            console.log(JSON.stringify(localStorage.getItem("Recommended")));

            console.log(localStorage.getItem("Recommended"));
        } else {
            return false;
        }

        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: localStorage.getItem("Recommended"),
        };

        fetch("/Recommended", options).then(res => {
            console.log(res);
        });
    });
}



sendRecommended();

