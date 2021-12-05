
const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/trending/tv/week?" + API_KEY;
const IMG_size = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + '/search/tv?' + API_KEY;




const genres = [
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


const mainEl = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const Selider = document.getElementById("Season");
const Epslider = document.getElementById("Episodes");

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const current = document.getElementById("current")

const video1 = document.getElementById("video1")





var currentPage = 1;
var NextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalpages = 100;




var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML = "";

    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies("https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=0a2c754df24f03f4197199045aedf7de" + '&with_genres=' + encodeURI(selectedGenre.
                join(',')))
            highlightSelections();

        })
        tagsEl.append(t);
    })
}


function ClearBtn() {
    let ClearBtn = document.getElementById("clear");
    if (ClearBtn) {
        ClearBtn.classList.add('highlight');

    } else {
        let clear = document.createElement("div");
        clear.classList.add("tag", "highlight");
        clear.id = "clear";
        clear.innerText = "Clear";
        clear.addEventListener("click", () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear)
    }
}

function highlightSelections() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    ClearBtn()
    if (selectedGenre.length != 0) {

        selectedGenre.forEach(id => {
            const highlightTag = document.getElementById(id);
            highlightTag.classList.add('highlight');
        })
    }
}
getMovies(API_URL);




function getMovies(url) {
    lastUrl = url;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.results);
            if (data.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                NextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalpages = data.total_pages;

                current.innerText = currentPage;
                if (currentPage <= 1) {
                    prev.classList.add('disabled');
                    next.classList.remove("disabled")
                } else if (currentPage >= totalpages) {
                    prev.classList.remove('disabled');
                    next.classList.add("disabled")
                } else {
                    prev.classList.remove('disabled');
                    next.classList.remove("disabled")

                }
                form.scrollIntoView({ behavior: 'smooth' })
            }
        });
}

function showMovies(data) {
    main.innerHTML = " ";




    data.forEach((movie) => {
        const { name, first_air_date, vote_average, overview, poster_path, id } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie", "col-lg-4", "col-m6", "col-s12");
        movieEl.innerHTML = `
      <div class="card-content">
          <img 
          style="height: auto; width: 100%;"  src="${poster_path ? IMG_size + poster_path : "https://via.placeholder.com/500x750"}"
          />
          </div>
       
      </div>
      <div class="movie-content">
        <h2>
          <a href="/singletvshow" id="${id}" class="link_video"
            >${name}</a
          >
        </h2>
        <span class="movie-meta">
          <span class="movie-meta-item"
            ><i class="fas fa-clock"></i> ${first_air_date}</span
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

            var movieid = [];
            movieid.push(id);
            console.log("You have watch" + id);
            window.localStorage.setItem("id", JSON.stringify(id));
            location.href = "/singletvshow";

        })




    });
}


/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');


    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if (activeSlide == idx) {
            embedTag.classList.add('show')
            embedTag.classList.remove('hide')

        } else {
            embedTag.classList.add('hide');
            embedTag.classList.remove('show')
        }
    })


}




form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelections()
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    }

})



next.addEventListener("click", () => {
    if (NextPage <= totalpages) {
        pageCall(NextPage);
    }
})

prev.addEventListener("click", () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})


function pageCall(page) {
    let urlsplit = lastUrl.split('?');
    let queryParams = urlsplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != "page") {
        let url = lastUrl + "&page=" + page
        getMovies(url)
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlsplit[0] + '?' + b
        getMovies(url);
    }

}
