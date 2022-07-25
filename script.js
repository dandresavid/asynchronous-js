'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imagesContainer = document.querySelector('.images');

///////////////////////////////////////

const renderCountry = function(data, className = '') {
    const [objCurrency] = Object.values(data.currencies)
    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
            <p class="country__row"><span>💰</span>${objCurrency.name}</p>
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

//getCountryAndNeighbour('colombia');

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

// btn.addEventListener('click', function(){
//     getCountryData('portugal');

// })


//getCountryData('australia');

// Challenge # 1

// const whereAmI = function (lat, lng){
//     const prom = fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then (response => {
//         if(!response.ok)
//             throw new Error(`Error (${response.status}) you cann't call the API more than 3 times per second`);
//         return response.json()
//     })
//     .then(data => {
//         console.log(`You are in ${data.city} ,${data.country}`);
//         getCountryData(data.country);
//     })
//     .catch(err => console.log(`Algo ocurrio mal: ${err}`))

// }

// https://geocode.xyz/51.50354,-0.12768?geoit=json
// https://geocode.xyz/51.50354,-0.12768?geoit=json

// whereAmI(51.50354, -0.12768);

// whereAmI(52.508, 13.381);
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);


//getCountryData(whereAmI(52.508, 13.381));

// Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
// Coordinates 2: 19.037, 72.873
// Coordinates 3: -33.933, 18.474
// Coordinates 4: 51.50354,-0.12768

// Callback queue starvation example

// console.log('Test start')
// setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve('Resolverd promise 1').then(res => console.log(res));
// Promise.resolve('Resolved promise 2').then(res => {
//     for (let i =1; i< 1000000000000; i++) {}
//     console.log(res);
// })
// console.log('Test end')

////////////////////////////////////////


// const lotteryPromise = new Promise(function(resolve, reject) {
//     console.log('Lotter draw is happening WoW')
//     setTimeout(function() {
//         if(Math.random() >= 0.5) {
//             resolve('You WINN $$$');
//         }else {
//             reject(new Error('You lost your money :('));
//         }
//     }, 2000)
// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000);
    })
}

// Replacement for callback hell
// wait(1)
//     .then(() => {
//     console.log('I waited for 1 seconds');
//     return wait(1);
// })
//     .then(() => {
//         console.log('I waited for 2 seconds');
//         return wait(1);
// })
//     .then(() => {
//         console.log('I waited for 3 seconds');
//         return wait(1);
// })
//     .then(() => {
//         console.log('I waited for 4 seconds');
//         return wait(1);
// })
//     .then(() => {
//         console.log('I waited for 5 seconds');
//         return wait(1);
// })
// .then(() => console.log('I waited for 6 second'))

// Promise.resolve('abc').then(x=> console.log(x));
// Promise.reject(new Error('Problem!')).catch(x=> console.log(x));



// const getPosition = function() {
//   return new Promise (function(resolve, reject) {
//     // navigator.geolocation.getCurrentPosition(
//     //     position => resolve(position), 
//     //     err => reject(err)
//     // );
//     navigator.geolocation.getCurrentPosition(resolve,reject);
//   });
// };

// getPosition().then(pos => console.log(pos));


// const whereAmI2 = function (){

//     getPosition().then(pos => {
//         const { latitude: lat, longitude: lng } = pos.coords
//         return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     })
//     .then (response => {
//         if(!response.ok)
//             throw new Error(`Error (${response.status}) you cann't call the API more than 3 times per second`);
//         return response.json()
//     })
//     .then(data => {
//         console.log(`You are in ${data.city} ,${data.country}`);
//         getCountryData(data.country);
//     })
//     .catch(err => console.log(`Algo ocurrio mal: ${err}`))
// }

// btn.addEventListener('click',whereAmI2)

// CHALLENGE #2
/*
const createImage = function(imgPath){
    return new Promise (function(resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath;
        img.addEventListener('load', ()=>{
            imagesContainer.append(img);
            resolve(img);
        });
        img.addEventListener('error', ()=>{
            reject(new Error('Image not found'));
        });
    })
}

let currentImg;
createImage(`./img/img-1.jpg`)
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2)
})
.then(()=>{
    currentImg.style.display = 'none';
    return createImage('./img/img-2.jpg');
})
.then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2)
})
.then(()=>{
    currentImg.style.display = 'none';
})
.catch(err => console.error(err))

*/

const getPosition = function() {
  return new Promise (function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve,reject);
  });
};


const whereAmI = async function(country) {
    try{
        // Geolocation
        const pos = await getPosition();
        const{latitude: lat, longitude: lng} = pos.coords;

        // Reverse geocoding
        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        if(!resGeo.ok) throw new Error(`Problem getting location data ********`)
        const dataGeo = await resGeo.json()
        console.log(dataGeo);
        //Country data
        //fetch(`https://restcountries.com/v3.1/name/${country}`)
        //.then(res => console.log(res));
        const res = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`);
        if(!resGeo.ok) throw new Error(`Problem getting country data ********`)
        const data = await res.json()
        console.log(data);
        renderCountry(data[0]);} catch(err){
            console.error(err);
            renderError(`{}{}{} ${err}`)
    }

};
whereAmI();
whereAmI();
whereAmI();
whereAmI();
console.log('FIRST')

try{

}catch{

}

