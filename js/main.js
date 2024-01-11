//User input from the Categories form
let userCats = [];
const userFormInput = document.getElementById('user-search');
const userFormButton = document.getElementById('user-button');
const userSelectedCats = document.getElementById('selected-categories')
const gifDisplay = document.getElementById('display-gif');

//Add to the user list
let userCatCount = 0;
userFormButton.addEventListener("click", () => {
    userCatCount++;
    UpdateCategories(userCatCount);
})

function UpdateCategories(catCount) {

    if (catCount === 1) {
        //Why does this only work to put something there after the first category is entered?
        userSelectedCats.innerText = userFormInput.value;
    }
    else {

        userSelectedCats.innerText = `${userSelectedCats.textContent} ${userFormInput.value}`;
    }
    userCats.push(userFormInput.value);
    userFormInput.value = "";

    // TODO: Working on a promise to allow the gif fetch to happen
    return new Promise(function (resolve, reject) {
        resolve();
    })


}

// GiphyFetch to get the gifs that we want


import { GiphyFetch } from 'https://cdn.jsdelivr.net/npm/@giphy/js-fetch-api@5.3.0/+esm';

const gf = new GiphyFetch('yaE6B8Vn25A5EFfHk5y31RyKGiQwoa8r');

// fetch 10 gifs

let { data: imgArray } = [];

// TODO: Working on using a promise resolve to execute the gif search
// This framework is what Chat recommended. But Why would I need to have an event listener if I have a promise.then ?
// Seems like the promise is only resolving once. I want a new promise to resolve each time. I want the imgArray to be based upon a new search every time.
userFormButton.addEventListener("click", () => {
    UpdateCategories(userCatCount).then(async function () {

        imgArray = await gf.search(userCats[0], { lang: 'en', limit: 10 });
        console.log(imgArray);
        // Initialize the display source
        gifDisplay.src = imgArray.data[0].images.fixed_height.url;
    });
});

//mobile menu
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
});

//options selectors
const cleanSelector = document.querySelector('#clean-content');
const cleanMessage = document.getElementById('clean-msg');

cleanSelector.addEventListener('change', function () {
    if (this.value === 'yes') {
        // zero it out if it is yes to clean only
        cleanMessage.textContent = '';
    }
    else {
        cleanMessage.textContent = 'WARNING! POTENTIAL NSFW CONTENT';
    }
})

//image cycling
let imgIndex = 0;

//counter for total number of gifs loaded
let gifCounter = 1;

// the document objects to use for image cycling
const buttonNodeList = document.querySelectorAll('button');


//Add an event listener to both buttons
buttonNodeList.forEach(function (button) {
    button.addEventListener("click", function () {
        //function checks which button and then increments or decrements the image index as needed
        if (this.id === 'prev-button') {
            if (imgIndex === 0) {
                imgIndex = imgArray.data.length - 1;
            }
            else {
                imgIndex--;
            }
        }
        else if (this.id === 'next-button') {
            if (imgIndex === imgArray.data.length - 1) {
                imgIndex = 0;
            }
            else {
                imgIndex++;
            }
            gifCounter++;
        }
        //This changes the gifDisplay to be the next image from the Giphy Fetch
        gifDisplay.src = imgArray.data[imgIndex].images.fixed_height.url;
        updateGifCounterBar(gifCounter);
    });
});

function updateGifCounterBar(counter) {
    //grabs progress bar
    const progBar = document.querySelector("progress");
    //modifies the value
    progBar.value = counter;
    //if they have maxed out for the day, then the bar turns red and the next button is turned off
    if (progBar.value === progBar.max) {
        progBar.classList.add("is-danger");
        //the 1 index item is the next button because it comes second on the page. buttonNodeList is a static nodelist
        buttonNodeList[1].disabled = true;
        addDoneForTheDayMsg();
    }
}

function addDoneForTheDayMsg() {
    document.getElementById('done-msg').innerHTML = '<section class="hero is-small is-danger"><div class="hero-body"><p class="hero-title">All Done for the Day, Go Outside!</p></div></section>';
    document.getElementById('main-section').style = 'max-height: 54svh';
}

//Do Async first with GiphyAPI
//Read the API
//promises async await (not promise chaining)
//put await in front of function that returns a promise



