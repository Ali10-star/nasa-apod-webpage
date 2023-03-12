

//  NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let results = [];
let favorites = {};

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

function showContent() {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const collection = page === 'favorites' ? Object.values(favorites) : results;
    if (page == 'favorites') {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    } else {
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');

    }
    collection.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-image-top');

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add("card-body");

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove from Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }

        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append items to main image container
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody, footer);
        imagesContainer.appendChild(card);
    });
}
function updateDOM(page) {
    let favoritesResult = localStorage.getItem('nasaFavorites');
    if (favoritesResult) {
        favorites = JSON.parse(favoritesResult);
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent();
}

function saveFavorite(itemURL) {
    results.forEach((item) => {
        if (item.url.includes(itemURL) && !favorites[itemURL]) {
            favorites[itemURL] = item;
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            displayConfirmation();
        }
    });
}

function removeFavorite(itemURL) {
    if (favorites[itemURL]) {
        delete favorites[itemURL];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
      }
}

function displayConfirmation() {
    saveConfirmed.hidden = false;
    setTimeout(() => {
        saveConfirmed.hidden = true;
    }, 2000);
}

async function getNASAPictures() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiURL);
        results = await response.json();

        updateDOM('results');
    } catch (error) {
        // handle errors later...
    }
}

getNASAPictures();