const API_KEY = "api_key=0a2c754df24f03f4197199045aedf7de";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/tv/";
const IMG_size = "https://image.tmdb.org/t/p/w500";

const row = document.getElementById("row");
const bio = document.getElementById("Bio");
const profile = document.getElementById("output");
const file = document.getElementById("file");


//get data from server "/getblob" 


getrecommendedData();

function getrecommendedData() {
    // get the recommended data from the server
    const uri = "/Watchlater";
    let h = new Headers();
    h.append("Accept", "application/json");

    let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors",
    });

    fetch(req)
        .then(res => res.json())
        .then((data) => {
            if (data != null) {
                console.log(data)
                getRecommended(data);
            } else {
                return;
            }
        })
        .catch(err => {
            console.log("ERROR: " + err.message);
        });
}

function getRecommended(data) {
    const RecomUID = data[0];
    const Recomlistdata = [];

    RecomUID.forEach((ids) => {
        if (ids.includes('tt')) {
            console.log('movie')
            fetch(BASE_URL + "/movie/" + ids + '?' + API_KEY + '&language=en-US')
                .then((res) => res.json())
                .then((Tvshowdata) => {
                    console.log(Tvshowdata)
                    Recomlistdata.push(Tvshowdata)
                    showRecomlist(Recomlistdata)
                })
        } else {
            fetch(API_URL + ids + '?' + API_KEY + '&language=en-US&external_source=imdb_id')
                .then((res) => res.json())
                .then((Tvshowdata) => {
                    console.log(Tvshowdata)
                    Recomlistdata.push(Tvshowdata)
                    showRecomlist(Recomlistdata)
                })
        }
    })
}

function showRecomlist(Recomlistdata) {
    console.log(Recomlistdata)
    row.innerHTML = ' ';
    let typefe = []
    Recomlistdata.slice(-6).forEach(movie => {
        const { poster_path, id } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("row");
        movieEl.innerHTML = `
       
        <div class="image">
          <img id="${id}" style="width: 120px;"
            src="${poster_path
                ? IMG_size + poster_path
                : "https://via.placeholder.com/500x750"
            }" alt="${movie.name}" />    
        </div> 
        
        `;
        row.appendChild(movieEl);
        document.getElementById(id).addEventListener("click", () => {
            console.log(movie.runtime)
            const movieid = [];
            movieid.push(id);
            window.localStorage.setItem("id", JSON.stringify(id));
            location.href = movie.runtime ? "/singlemovie?id=" + id + "" : "/singletvshow?id=" + id + ""
        });
        // document.getElementById(id).addEventListener("auxclick", (event) => {
        //     const ids = []
        //     console.log()
        //     ids.push(movie.imdb_id ? movie.imdb_id : movie.id)
        //     console.log(JSON.stringify(ids))
        //     const StoredRecommended = JSON.parse(localStorage.getItem("Recommended"))
        //     const changed = StoredRecommended.splice(ids, 1)
        //     console.log(JSON.stringify(changed))

        //     const options = {
        //         method: "POST",
        //         headers: {
        //             "Content-type": "application/json"
        //         },
        //         body: JSON.stringify(ids)
        //     }


        //     fetch("/delRecommended", options).then(res => {
        //         console.log(res.message);
        //     })
        //     window.location.reload();
        // });
    });
}





const profile_img = document.getElementById("profile-output");


//check if file is selected or not
file.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
        const formData = new FormData();

        formData.append("file", file);
        const options = {
            method: "POST",
            body: formData
        }
        fetch("/send", options).then(res => {
            console.log(res.message);
            window.location.reload();
        }).catch(err => {
            console.log(err);
        })

    }
});

function getData() {
    fetch(`/getBlob`)
        .then(res => res.text())
        .then(data => {
            console.log(data)
            profile.src = data;
        })
}
getData();


