//mobile menu
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
});

//options selectors
const cleanSelector = document.querySelector('#clean-content');
const cleanMessage = document.getElementById('#clean-msg');

cleanSelector.addEventListener('change', function () {
    if (this.value === 'yes') {
        // zero it out if it is yes to clean only
        cleanMessage.textContent = '';
    }
    else {
        cleanMessage.textContent = 'WARNING! POTENTIAL NSFW CONTENT';
    }
})