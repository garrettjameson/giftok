//User input from the Categories form
let userCats = [];
const userFormInput = document.getElementById('user-search');
const userFormButton = document.getElementById('user-button');
const userSelectedCats = document.getElementById('selected-categories')
const gifDisplay = document.getElementById('display-gif');
// GiphyFetch to get the gifs that we want

import { GiphyFetch } from 'https://cdn.jsdelivr.net/npm/@giphy/js-fetch-api@5.3.0/+esm';

const gf = new GiphyFetch('yaE6B8Vn25A5EFfHk5y31RyKGiQwoa8r');

// fetch 10 gifs

let imgArray = [];
//Add to the user list
let userCatCount = 0;
userFormButton.addEventListener("click", async () => {
    // call to update the categories array
    userCatCount++;
    UpdateCategories(userCatCount);

    // call to fetch
    await fetchThenUpdateArray("click");
    //call the update to the max gifs allowed
    updatemaxGifs(userCatCount);

});

async function fetchThenUpdateArray(triggerEvent) {
    // This is extracting just the data from the fetch and putting it in a temp array
    // searches with the most recent entered term
    userCats.forEach(async (cat)=>{
        console.log(cat);
        
    })

    console.log(userRating);
    let { data: tmpImgArray } = await gf.search(userCats[userCatCount - 1], { lang: 'en', limit: 10, rating: userRating })

    // use array.map instead of push
    // map, filter, reduce, forEach - functional programming
    // array spread operator - allows for each array concat
    // cannot use push on arrays in react

    //TODO: map with key search terms to display near image
    //TODO: removing a search term after entered
    //TODO: Reset search/clear button

    //TODO: If the number of usercats has not been updated, then I want to replace the entire array (for rating changes)
    //If the number of usercats has been updated
    //Loop through each img pulled and push them one by one to the imgArry
    if (triggerEvent === "click") {
        tmpImgArray.forEach((img) => {
            imgArray.push(img);
        });
    }
    else if (triggerEvent === "change") {
        imgArray = tmpImgArray;
    }

    // Call the shuffler to rearrange order of gifs whenever the user adds a new search term.
    imgArray = shuffleArray(imgArray);
    // Initialize the display source
    gifDisplay.src = imgArray[0].images.fixed_height.url;

    //call rating counter log
    ratingCounter(imgArray);
}

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

}


//mobile menu
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
});

//options selectors
const cleanSelector = document.querySelector('#clean-content');
const cleanMessage = document.getElementById('clean-msg');
// default rating is PG (level 2)
let userRating = 'pg';

cleanSelector.addEventListener("change", async function () {
    //immeditely refetch the img array
    if (this.value === 'yes') {
        // zero it out if it is yes to clean only
        cleanMessage.textContent = '';
        userRating = 'pg';
    }
    else {
        cleanMessage.textContent = 'WARNING! POTENTIAL NSFW CONTENT';
        userRating = 'r';
    }
    await fetchThenUpdateArray("change");
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
                imgIndex = imgArray.length - 1;
            }
            else {
                imgIndex--;
            }
        }
        else if (this.id === 'next-button') {
            if (imgIndex === imgArray.length - 1) {
                imgIndex = 0;
            }
            else {
                imgIndex++;
            }
            gifCounter++;
        }
        //This changes the gifDisplay to be the next image from the Giphy Fetch
        gifDisplay.src = imgArray[imgIndex].images.fixed_height.url;
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

//Stolen from the internet. Should shuffle the items of an array to a new index.
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// This function takes the number of user input categories and scales the number of gifs scrollable by a factor of 10. Capped at 50 gifs.
const maxGifsBar = document.getElementById("max-gifs-allowed");
function updatemaxGifs(userCatCount) {
    if (userCatCount <= 5) {
        //set the max number to the categories times ten (10)
        maxGifsBar.max = userCatCount * 10;
    }
    else {
        //set the max number to 50
        maxGifsBar.max = 50;
    }
}

//loops through array and prints the number of each type of rating
function ratingCounter(array) {
    let rCounter = 0;
    let pg13Counter = 0;
    let pgAndBelowCounter = 0;
    array.forEach(element => {
        if (element.rating === 'r') {
            rCounter++;
        }
        else if (element.rating === 'pg-13') {
            pg13Counter++;
        }
        else {
            pgAndBelowCounter++;
        }

    });
    console.log("Logging the Ratings of Array Imgs");
    console.log(`Number of R-rated gifs: ${rCounter}`);
    console.log(`Number of PG-13-rated gifs: ${pg13Counter}`);
    console.log(`Number of PG and Below gifs: ${pgAndBelowCounter}`);
}