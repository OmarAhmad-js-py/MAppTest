
const edit = document.getElementById("edit");

edit.addEventListener("click", () => {
    const modelWindow = document.createElement('div');
    modelWindow.innerHTML = `
    <form action="/profile/bio" method="POST" enctype="multipart/form-data">
    <input type="text" name="userBio" accept="multipart/form-data">
    <input type="submit" class="btn btn-primary">
     </form>
    
    `

})

