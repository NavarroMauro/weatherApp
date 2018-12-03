const apiKey = 'd19af6ad70ef12f55293b332b7f5bee3';
const inputField = document.querySelector('input');
const divContainer = document.querySelector('#container');
const form = document.querySelector('form');
const warning = document.querySelector('#warning');


// // Get coordinates from current device
// const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
// };

// let success = (pos) => {
//     let crd = pos.coords;
//     console.log(`Your latitude is: ${crd.latitude}`);
//     console.log(`Your longitude is: ${crd.longitude}`);
//     console.log(`You are more or less ${crd.accuracy} meters.`);
// }

// let error = (err) => {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error, options);

// console.log(crd.longitude);


// Background color city information
const mapTemp = [
    { maxTemp: 40, color: 'red' },
    { maxTemp: 35, color: 'orange' },
    { maxTemp: 30, color: 'yellow' },
    { maxTemp: 20, color: 'blue' },
    { maxTemp: 10, color: 'purple' },
    { maxTemp: 0, color: 'grey' },
    { maxTemp: -100, color: 'white' }
]

// Convert/transform Unixtimestamp
let convertUnixTimeStamps = (unixtimestamp) => {
    const months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Months array
    let date = new Date(unixtimestamp * 1000); // Convert timestamp to milliseconds
    let year = date.getFullYear(); // Year
    let month = months_arr[date.getMonth()]; // Month
    let day = date.getDate(); // Day
    let hours = date.getHours(); // Hours
    let minutes = `0 ${date.getMinutes()}`; // Minutes
    // let seconds = `0 ${date.getSeconds()}`; // Seconds
    let convdataTime = `This weather report is from: ${day}.${month}.${year} at ${hours}:${minutes.substr(-2)}`; // Display date time in MM-dd-yyyy h:m:s format
    return convdataTime;
}

// let timingAppear = (urlD, time) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(fetch(urlD))
//         }, time)
//     })
// }


let getWeatherData = async (ev) => {
    ev.preventDefault();
    let cities = inputField.value.split(",");

    try {
        for (city of cities) {
            const UrlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
            let res = await fetch(UrlWeather);
            // console.log(res);
            
            let weatherData = await res.json();
            let section = document.createElement('SECTION');
            let name = document.createElement('H1');
            let time = document.createElement('span');
            let country = document.createElement('H3');
            let temperature = document.createElement('H3');
            let description = document.createElement('H3');
            let icon = document.createElement('IMG');
            let tempCelcius = Math.round(weatherData.main.temp - 273.15);

            let currentMilliseconds = weatherData.dt;
            let timeStamp = convertUnixTimeStamps(currentMilliseconds);

            let iconDescription = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
            let colorBg = mapTemp.find(entry => tempCelcius > entry.maxTemp).color;

            name.innerText = weatherData.name;
            time.innerText = timeStamp;
            country.innerText = weatherData.sys.country;
            temperature.innerText = `${tempCelcius}°C`;
            description.innerText = weatherData.weather[0].description;
            icon.src = iconDescription;

            section.appendChild(name);
            section.appendChild(time);
            section.appendChild(country);
            section.appendChild(icon);
            section.appendChild(temperature);
            section.appendChild(description);
            divContainer.appendChild(section);
            section.style.background = colorBg;
            inputField.value = '';
            inputField.focus();
        }

    } catch (errorMsg) {
        warning.innerText = 'The city you have typed does not exist!';
    };
    // warning.innerHTML = '';
    // inputField.value = '';
}

form.addEventListener('submit', getWeatherData);
