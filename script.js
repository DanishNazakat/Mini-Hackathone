
let usersdatabase = JSON.parse(localStorage.getItem('userInfo')) || [];
let loginusers = JSON.parse(localStorage.getItem('loginUserData')) || [];




let userblogs = JSON.parse(localStorage.getItem("blog")) || [];
let editIndex = null;

// SignUp function
function signupfnc() {
    // let signupFirstName = document.getElementById('signupFirstName').value;
    let signupName = document.getElementById('signupName').value;
    let email = document.getElementById('signupEmail').value;
    let password = document.getElementById('signupPassword').value;
    let userExist = false;
    for (let i = 0; i < usersdatabase.length; i++) {
        if (email === usersdatabase[i].email) {
            console.log("Email Already Exist");
            document.getElementById('loginfailed').style.display = 'block';
            email.value = "";
            userExist = true;

        }
    }
    if (userExist === false) {



        let newUser = {
            // signupFirstName,
            signupName,
            email: email,
            password: password
        }
        usersdatabase.push(newUser);
        localStorage.setItem('userInfo', JSON.stringify(usersdatabase));
        window.location.href = ("login.html");
        console.log(email.length + "=" + i)



    }
}










// login function 
function loginfnc() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let userFound = false;
    for (let i = 0; i < usersdatabase.length; i++) {
        if (email.value === usersdatabase[i].email && password.value === usersdatabase[i].password) {
            userFound = true;
            let loginuserInfo = {
                email: email.value,
                password: password.value,
                indexno: i
            }
            window.location.href = ("home.html");
            loginusers.push(loginuserInfo);
            localStorage.setItem("loginUserData", JSON.stringify(loginusers));
            window.localStorage.setItem('currentUser', JSON.stringify(usersdatabase[i]));
            // console.log("current User" + window.localStorage.getItem(JSON.parse('currentUser')));
        }
    }
    if (userFound === false) {
        document.getElementById('loginfailed').style.display = 'block';
        email.value = "";
        password.value = "";

    }

    // document.getElementById("userName").innerText = "Welcome, ";
}



const blogbtn = document.getElementById('blogbtn');
const blogsContainer = document.getElementById('blogsContainer');

// Get current user initial
function userName() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user){
        document.getElementById('userName').innerText = user.signupName.charAt(0).toUpperCase();
    }
}
userName();

// Open/Close Blog Form
function opendiv() {
    document.getElementById('blogform').style.display = "flex";
    document.body.style.overflow = "hidden";
}
function closediv() {
    document.getElementById('blogform').style.display = "none";
    document.body.style.overflow = "scroll";
    clearForm();
}

// Clear form
function clearForm() {
    document.getElementById('blogTittleinp').value = "";
    document.getElementById('blogContent').value = "";
    document.getElementById('file').value = "";
    editIndex = null;
    blogbtn.innerText = "Create Blog";
}

// Create or Update Blog
blogbtn.addEventListener('click', () => {
    const title = document.getElementById('blogTittleinp').value;
    const content = document.getElementById('blogContent').value;
    const img = document.getElementById('file').value;

    if(editIndex === null){
        // Create new blog
        userblogs.push({title, content, img, likes:0, liked:false});
    } else {
        // Update existing blog
        userblogs[editIndex].title = title;
        userblogs[editIndex].content = content;
        userblogs[editIndex].img = img;
    }

    localStorage.setItem("blog", JSON.stringify(userblogs));
    renderBlogs();
    closediv();
});

// Render Blogs
function renderBlogs() {
    blogsContainer.innerHTML = ""; // Clear existing blogs

    userblogs.forEach((blog, index) => {
        const blogSection = document.createElement('div');
        blogSection.className = "blogSeciton";

        const blogTitle = document.createElement('h1');
        blogTitle.innerText = blog.title;

        const blogContent = document.createElement('p');
        blogContent.innerText = blog.content;

        const blogImg = document.createElement('img');
        blogImg.src = blog.img;

        const iconsDiv = document.createElement('div');
        iconsDiv.className = "icons";

        // Like
        const likeBtn = document.createElement('div');
        likeBtn.className = "blogicons";
        likeBtn.innerHTML = `<i class="${blog.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
        const likeCounter = document.createElement('span');
        likeCounter.innerText = ` ${blog.likes}`;

        likeBtn.addEventListener('click', () => {
            if(blog.liked){
                blog.likes--;
            } else {
                blog.likes++;
            }
            blog.liked = !blog.liked;
            localStorage.setItem("blog", JSON.stringify(userblogs));
            renderBlogs();
        });

        // Edit
        const editBtn = document.createElement('button');
        editBtn.className = "blogicons";
        editBtn.innerText = "Edit";
        editBtn.addEventListener('click', () => {
            editIndex = index;
            document.getElementById('blogTittleinp').value = blog.title;
            document.getElementById('blogContent').value = blog.content;
            document.getElementById('file').value = blog.img;
            blogbtn.innerText = "Update Blog";
            opendiv();
        });

        // Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.className = "blogicons";
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener('click', () => {
            userblogs.splice(index, 1);
            localStorage.setItem("blog", JSON.stringify(userblogs));
            renderBlogs();
        });

        const otherIcons = document.createElement('div');
        otherIcons.className = "othericons";
        otherIcons.appendChild(editBtn);
        otherIcons.appendChild(deleteBtn);

        iconsDiv.appendChild(likeBtn);
        iconsDiv.appendChild(likeCounter);
        iconsDiv.appendChild(otherIcons);

        // Date
        const dateDiv = document.createElement('div');
        const D = new Date();
        dateDiv.id = "puslishDate";
        dateDiv.innerText = `${D.getDate()} - ${D.getMonth() + 1} - ${D.getFullYear()}`;

        blogSection.append(blogTitle, blogContent, blogImg, iconsDiv, dateDiv);
        blogsContainer.appendChild(blogSection);
    });
}

// Render blogs on page load
renderBlogs();
