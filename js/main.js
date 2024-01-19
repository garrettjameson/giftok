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
    addCategory();

    // call to fetch
    await fetchThenUpdateArray();
    //call the update to the max gifs allowed
    updatemaxGifs(userCatCount);

});

async function fetchThenUpdateArray() {
    // This is extracting just the data from the fetch and putting it in a temp array
    // searches all entered search terms
    // Trying to first create a map so that the search terms are associated with the images themselves.
    let imgMap = new Map();

    // Replaced the forEach because that method does not wait for async to finish according to ChatGPT
    for (const cat of userCats) {
        //Random starting location, SDK documentation says 4999 is max
        //With some experimentation, rare searches might not have enough for 100 to work, so the search won't populate right away. Not ideal
        let imgOffset = Math.floor(Math.random() * 100);

        let { data: tmpImgArray } = await gf.search(cat, { lang: 'en', limit: 10, rating: userRating, offset: imgOffset })

        imgMap.set(cat, tmpImgArray);
    };


    // use array.map instead of push
    // map, filter, reduce, forEach - functional programming
    // array spread operator - allows for each array concat
    // cannot use push on arrays in react

    //TODO: map with key search terms to display near image
    //Through multidimensional array? Or through the use of the img id? Like img id from the original pull creates map of search term and ids 
    //So that when the img is displayed, the overlay has the search term, also possible to make this option a toggle and a bunch of info comes up, like search term associated, rating of gif, etc.


    // Create an array from the key value pairs of the imgMap
    imgArray = arrayFromMap(imgMap);

    // Call the shuffler to rearrange order of gifs whenever the user adds a new search term.
    imgArray = shuffleArray(imgArray);

    // Initialize the display source
    gifDisplay.src = imgArray[0].images.fixed_width.url;

    //call rating counter log
    ratingCounter(imgArray);
}

function addCategory() {

    userSelectedCats.innerHTML += `<button class = "button" id = "button-category-${userFormInput.value}">${userFormInput.value}</button>`;
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

function arrayFromMap(map) {
    //Create an Array to store result in
    let array = [];

    map.forEach((values, searchTerm) => {
        //Spread Syntax to create new array
        array = [...array, ...values.map( (value) => {
            return {...value, searchTerm}
        })];
    })

    //Return the array
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

//TODO: removing a search term after entered

//First set up an event listener for button clicks on any of the buttons
userSelectedCats.addEventListener("click", (e) => {
   
    //Creating a copy of userCats with only items that are NOT the specified target innerHTML
    userCats = userCats.filter(function (cat){
        return !(cat === e.target.innerHTML);
    })

    //Update the search
    fetchThenUpdateArray();

    //remove the element
    document.getElementById(e.target.id).remove();

});

//TODO: Reset search/clear button