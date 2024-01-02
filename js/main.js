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
let imgArray = ['CatTyping.webp', 'PoolDog.webp', 'Sheep.gif'];
let imgIndex = 0;

//counter for total number of gifs loaded
let gifCounter = 1;

// the document objects to use for image cycling
const gifDisplay = document.getElementById('display-gif');
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
        gifDisplay.src = "img/" + imgArray[imgIndex];
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

function addDoneForTheDayMsg(){
    document.getElementById('done-msg').innerHTML = '<section class="hero is-small is-danger"><div class="hero-body"><p class="hero-title">All Done for the Day, Go Outside!</p></div></section>';
    document.getElementById('main-section').style = 'max-height: 54svh';
}