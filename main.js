const url = 'https://places-dsn.algolia.net/1/places/query';
const recherche = document.querySelector('#recherche');
const listeVilles = document.querySelector('#listeVilles');
const resultats = document.querySelector('#resultats');
const dayNight = document.querySelectorAll('.night')
const nightB = document.querySelector('.nightB')

const search = (event) => {
    fetch(url, {
            method: 'POST',
            body: JSON.stringify({ query: event.currentTarget.value })
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            listeVilles.style.display = 'block';
            resultats.innerHTML = '';
            data.hits.forEach(place => {

                resultats.insertAdjacentHTML('beforeend', `
                <li tabindex="0" data-long="${place._geoloc.lng}" data-lat="${place._geoloc.lat}" data-town="${place.locale_names.default}">${place.locale_names.default}</li>
            `);
            });
            const listElement = document.querySelectorAll('li');

            for (i = 0; i < listElement.length; i++) {
                console.log(listElement[i].getAttribute('data-long'));
                listElement[i].addEventListener('click', (event) => {
                    avoirAttributs(event);
                })
                listElement[i].addEventListener('keyup', (event) => {
                    if (event.keyCode == 13) {
                        avoirAttributs(event);
                    }
                })
            }

        })
        .catch((error) => {
            console.log(error);
        })
}

recherche.addEventListener('keydown', search);

function avoirAttributs(event) {
    const lgt = event.target.getAttribute('data-long');
    const lat = event.target.getAttribute('data-lat');
    const town = event.target.getAttribute('data-town');
    initMap(lat, lgt, town);
    weatherCall(lat, lgt, town);
    listeVilles.style.display = 'none';
    recherche.value = '';
}


const closeResults = () => {
    console.log(listeVilles);
    listeVilles.style.display = 'none';
    recherche.value = '';
}

const closeButton = document.querySelector('#closeButton');
closeButton.addEventListener('click', closeResults)

resultats.addEventListener('keyup', (event) => {
    if (event.keyCode == 27) {
        closeResults();
    }
})
recherche.addEventListener('keyup', (event) => {
    if (event.keyCode == 27) {
        closeResults();
    }
})

/* ******************************* MAP ********************************/

function initMap(lat, lon, ville) {
    const carte = document.querySelector('#carte');
    carte.innerHTML = '<div id="map"></div>';
    let macarte = null;
    let marker = null;
    macarte = L.map('map').setView([lat, lon], 10);
    marker = L.marker([lat, lon]).addTo(macarte);
    marker.bindPopup(ville);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}
initMap(43.2954, 5.3631, 'Marseille');

/* ******************************* FIN MAP ********************************/

/* ******************************* METEO ********************************/

const meteo = document.querySelector('#meteo');

const weatherCall = (lat, lon, town) => {
    const urlMeteo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&lang=fr&appid=1be304be0f523d55aafc277ea4d48d0f`;
    fetch(urlMeteo)
        .then(response => response.json())
        .then((data) => {
            console.log(data.current.weather[0].description);
            meteo.innerHTML = `<h3>${town}</h3>
                                <p>La température est de <strong>${data.current.temp}°C</strong></p>
                                <p>Le ciel est : <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" /> ${data.current.weather[0].description}</p>`;
            //condition pour modifier le background selon la temperature
            if (data.current.temp <= 0) {
                nightB.classList.add('coverTransNeige')
                nightB.classList.remove('coverTransFroid')
                nightB.classList.remove('coverTransMoyen')
                nightB.classList.remove('coverTransChaud')
            } else if (data.current.temp > 0 && data.current.temp < 10) {
                nightB.classList.add('coverTransFroid')
                nightB.classList.remove('coverTransNeige')
                nightB.classList.remove('coverTransMoyen')
                nightB.classList.remove('coverTransChaud')

            } else if (data.current.temp > 10 && data.current.temp < 20) {
                nightB.classList.add('coverTransMoyen')
                nightB.classList.remove('coverTransNeige')
                nightB.classList.remove('coverTransFroid')
                nightB.classList.remove('coverTransChaud')

            } else if (data.current.temp > 20) {
                nightB.classList.add('coverTransChaud')
                nightB.classList.remove('coverTransNeige')
                nightB.classList.remove('coverTransFroid')
                nightB.classList.remove('coverTransMoyen')

            } else {

            };
        })
}
weatherCall(43.2954, 5.3631, 'Marseille');

/* ******************************* FIN METEO ********************************/

/* ******************************* DATE ********************************/
function runDate() {
    const dateDuJour = new Date();
    const divDate = document.querySelector('#date');
    const annee = dateDuJour.getFullYear();
    const mois = ('0' + dateDuJour.getMonth() + 1).slice(-2);
    const jour = ('0' + dateDuJour.getDate()).slice(-2);
    divDate.innerHTML = `<strong>${jour}/${mois}/${annee}</strong>`;
}
runDate();
/* ******************************* FIN DATE ********************************/

/* ******************************* HEURE ********************************/
function runClock() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let timeValue = hours;
    console.log(hours);
    console.log(minutes);
    if (hours === 0 && minutes === 0 && seconds > 0) {
        runDate();
    }
    // change le background et la couleur de polioce selon l'heure de la journée 
    dayNight.forEach((element) => {
        if (hours <= 18) {
            element.classList.remove("night")
            element.classList.add("day")
        } else {
            element.classList.add("night")
            element.classList.remove("day")
        }
    })
    if (hours <= 18) {
        nightB.classList.remove("nightB")
        nightB.classList.add("dayB")
    } else {
        nightB.classList.add("nightB")
        nightB.classList.remove("dayB")
    }


    timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
    document.querySelector('#heure').innerHTML = timeValue;

}

let timerID = setInterval(runClock, 1000);
/* ******************************* FIN HEURE ********************************/