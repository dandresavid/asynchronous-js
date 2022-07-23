'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function(data, className = '') {

    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0]}</p>
        </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
};
const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
}
/*
const getCountryAndNeighbour = function(country) {

// AJAX call country 1
const request = new XMLHttpRequest();
request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
request.send();

request.addEventListener('load', function(){
    console.log(this.responseText);

    const [data] = JSON.parse(this.responseText);
    console.log(data);
    console.log(data.languages.name);
    console.log(data.languages);
    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)
    const [neighbour] = data.borders;
    
    if(!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function(){
        const [data2] = JSON.parse(this.responseText);
        console.log(data2);
        renderCountry(data2,'neighbour');
    });
    
    });
};

getCountryAndNeighbour('colombia');

// //Call back HELL
// setTimeout(()=> {
//  console.log('1 second passed');
//     setTimeout(() => {
//     console.log('2 second passed');
//         setTimeout(()=> {
//         console.log('3 second passed');
//             setTimeout(()=> {
//             console.log('4 second passed');
//             }, 1000);
//         }, 1000);
//     }, 1000);
// }, 1000);
*/

//

const getJSON = function(url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response =>  {
        if(!response.ok)
            throw new Error(`${errorMsg} (${response.status})`);
        return response.json()
    })
}

const getCountryData = function(country){

    getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
        renderCountry(data[0]);
        const neighbour = data[0].borders?.[0];
        if(!neighbour) throw new Error('No neighbour found');
        
        //Country 2
        return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, `Country not found`);
    })  
    .then( data2  => renderCountry(data2[0],'neighbour'))
    .catch( err => {
        console.error(`${err} 💥 💥 💥 💥  `);
        renderError(`Something went wrong  💥 💥 💥 💥 ${err.message}. Try again!`);
    })
    .finally(()=> {
        countriesContainer.style.opacity = 1;
    })
};

btn.addEventListener('click', function(){
    getCountryData('portugal');

})

getCountryData('australia');

