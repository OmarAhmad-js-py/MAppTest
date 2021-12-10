const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/tv/";
const IMG_size = "https://image.tmdb.org/t/p/w500";

const row = document.getElementById("row");
const bio = document.getElementById("Bio");


let Loadtext = function () {
    bio.innerHTML = ` 
    <form>
    <div class="form-group">
    <label for="exampleFormControlTextarea1" >Example textarea</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="10"></textarea>
    </div>
    </form>`
};


getrecommendedData();

function getrecommendedData() {
    const uri = "/Wathclater";
    let h = new Headers();
    h.append("Accept", "application/json");
    let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors",
    });

    fetch(req)
        .then(res => res.json())
        .then(data => {
            getRecommended(data);
        })
        .catch(err => {
            console.log("ERROR: " + err.message);
        });
}

function getRecommended(data) {
    const RecomUID = JSON.parse(data.Recommended);
    const Recomlistdata = [];

    RecomUID.forEach(moive => {
        fetch(API_URL + moive + "?" + API_KEY + "&language=en-US")
            .then(res => res.json())
            .then(Tvshowdata => {
                Recomlistdata.push(Tvshowdata);
                console.log(Recomlistdata);
                showRecomlist(Recomlistdata, Tvshowdata);
            });
    });
}

function showRecomlist(Recomlistdata) {
    row.innerHTML = ' ';

    Recomlistdata.forEach(movie => {
        const {poster_path, id} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("row");
        movieEl.innerHTML = `
       
        <div class="image">
          <img id="${id}" style="width: 120px;"
            src="${poster_path
            ? IMG_size + poster_path
            : "https://via.placeholder.com/500x750"
        }" alt="Card image cap" />
                    
        </div> 
        
        `;
        row.appendChild(movieEl);
        document.getElementById(id).addEventListener("click", () => {
            let movieid = [];
            movieid.push(id);
            window.localStorage.setItem("id", JSON.stringify(id));
            location.href = "/singletvshow";
        });
    });
}
