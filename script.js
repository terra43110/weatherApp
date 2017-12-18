// TODO
// * change background image, dependent on temperature
//                      OR
//   change icon image (b/c this is on mobile)
// * (optional) create weatherApp.isFahrenheit boolean to use for handlers.toggleTemperature()
"use strict";

const wallpaper = {
    mobilePortrait: {
        cold: "http://res.cloudinary.com/dnbhmhghs/image/upload/v1470773927/cold_ejm41d.jpg",
        chilly: "http://res.cloudinary.com/dnbhmhghs/image/upload/v1470773926/chilly_h5ujoo.jpg",
        warm: "https://res.cloudinary.com/dnbhmhghs/image/upload/v1470443084/warm_slomx9.jpg",
        hot: "http://res.cloudinary.com/dnbhmhghs/image/upload/v1470773926/hot_tfg9ud.jpg"
    },
    mobileLandscape: {
        cold: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_330,w_586/v1470971871/cold_nectsc.jpg",
        chilly: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_540,w_960/v1470971871/chilly_hucw8s.jpg",
        warm: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_480,w_853/v1470971871/warm_fsyul6.jpg",
        hot: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_470,w_835/v1470971871/hot_nros1j.jpg"
    },
    tablet: {
        cold: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_557,w_991/v1472171353/cold_g7vms9.jpg",
        chilly: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_557,w_991/v1472171353/chilly_ge8ozj.jpg",
        warm: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_557,w_991/v1472171353/warm_ayo6xd.jpg",
        hot: "http://res.cloudinary.com/dnbhmhghs/image/upload/c_scale,h_557,w_991/v1472171353/hot_t45pck.jpg"
    }
};

const STATE_NAMES_TO_ABBREVIATIONS = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};

$(document).ready( function() {
    view.init();
});

let weatherApp = {
    isPortrait: undefined,

    // handlers.detectDevice()
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,

    // properties returned from handlers.getMyLocation()
    latitude: NaN,
    longitude: NaN,
    city: "",
    state: "",
    stateAbbreviation: "",
    country: "",
    zipcode: NaN,

    // properties returned from handlers.getLocalWeather()
    temp_kelvin: NaN,
    temp_celsius: NaN,
    temp_fahrenheit: NaN
};

let view = {
    init() {
        this.setupEventListeners();
        handlers.getMyLocation()
                .then( handlers.getLocalWeather )
                .then( () => {
                    this.displayTemperature(weatherApp.temp_fahrenheit.toFixed(), "F");
                })
                .then(handlers.detectOrientation)
                .then(handlers.detectDevice)
                .then(this.setBackgroundImage);
    },
    displayTemperature(temp, unit) {
        return new Promise( function(resolve, reject) {
            document.getElementById("displayedDegrees").textContent = temp;
            document.getElementById("displayedUnit").textContent = unit;
            // TODO: (optional) weatherApp.isFahrenheit boolean
            unit === "F" ? document.getElementById("btnUnit").textContent = "Celsius"
                         : document.getElementById("btnUnit").textContent = "Fahrenheit";
            resolve();
        });
    },
    setBackgroundImage() {
        let image_url;

        if (weatherApp.isPortrait === true) {
            if (weatherApp.temp_celsius < 10) {
                image_url = wallpaper.mobilePortrait.cold;
            }
            else if (weatherApp.temp_celsius < 20) {
                image_url = wallpaper.mobilePortrait.chilly;
            }
            else if (weatherApp.temp_celsius < 30) {
                image_url = wallpaper.mobilePortrait.warm;
            }
            else {
                image_url = wallpaper.mobilePortrait.hot;
            }
        }
        else {
            if (weatherApp.temp_celsius < 10) {
                image_url = wallpaper.mobileLandscape.cold;
            }
            else if (weatherApp.temp_celsius < 20) {
                image_url = wallpaper.mobileLandscape.chilly;
            }
            else if (weatherApp.temp_celsius < 30) {
                image_url = wallpaper.mobileLandscape.warm;
            }
            else {
                image_url = wallpaper.mobileLandscape.hot;
            }
        }
        $("html").css("background-image", "url(" + image_url + ")");
    },
    setupEventListeners() {
        let btnToggleUnit = document.getElementById("btnToggleUnit");
        btnToggleUnit.addEventListener("click", handlers.toggleTemperature);

        window.addEventListener("orientationchange", handlers.detectOrientation);
    }
};

let handlers = {
    calcCelsius(temp) {
        return (temp - 32) * 5/9;
    },
    calcFahrenheit(temp) {
        return (temp * 9/5) + 32;
    },
    getMyLocation() {
        return new Promise( function(resolve, reject) {
            //const ipinfo = "https://crossorigin.me/http://ipinfo.io/json";
            const ipinfo = "https://cors-anywhere.herokuapp.com/http://ipinfo.io/json";
            let xhr = new XMLHttpRequest();

            xhr.open("GET", ipinfo, true);
            xhr.addEventListener("readystatechange", function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);

                    weatherApp.latitude = Number(data.loc.split(",")[0]);
                    weatherApp.longitude = Number(data.loc.split(",")[1]);
                    weatherApp.city = data.city;
                    weatherApp.state = data.region;
                    weatherApp.stateAbbreviation = STATE_NAMES_TO_ABBREVIATIONS[weatherApp.state];
                    weatherApp.country = data.country;
                    weatherApp.zipcode = data.postal;
                    console.log(weatherApp.city, weatherApp.stateAbbreviation, weatherApp.country, weatherApp.zipcode);
                    resolve();
                }
                else if (xhr.status === 404 || xhr.status === 500) {
                    reject(xhr.status);
                }
            });
            xhr.send(null);
        });
    },
    getLocalWeather() {
        return new Promise( function(resolve, reject) {
            //BACKUP const URL = "https://crossorigin.me/http://api.wunderground.com/api/f7d2da76acf5451e/geolookup/q/";
            //BACKUP let geocoordinates = weatherApp.latitude + "," + weatherApp.longitude + ".json";
            //const URL = "https://crossorigin.me/http://api.wunderground.com/api/f7d2da76acf5451e/conditions/q/";
            const URL = "https://cors-anywhere.herokuapp.com/http://api.wunderground.com/api/f7d2da76acf5451e/conditions/q/";
            let cityUnderscore = weatherApp.city.replace(" ", "_");
            let lookupByCityState = weatherApp.stateAbbreviation + "/" + cityUnderscore + ".json";

            // TODO: TEST accuracy
            console.log(weatherApp.latitude);
            console.log(weatherApp.longitude);
            let url = URL + lookupByCityState;

            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);

                    console.log(data);  // NOTE: contains more options for extra features
                    weatherApp.temp_celsius = data.current_observation.temp_c;
                    weatherApp.temp_fahrenheit = data.current_observation.temp_f;

                    resolve();
                }
                else if(xhr.status === 404 || xhr.status === 500) {
                    reject(xhr.status);
                }
            });
            xhr.send(null);
        });
    },
    toggleTemperature() {
        // TODO: (optional) weatherApp.isFahrenheit boolean
        let displayedUnit = document.getElementById("displayedUnit").textContent;

        if (displayedUnit === "C") {
            displayedUnit = "F";
            view.displayTemperature(weatherApp.temp_fahrenheit.toFixed(), displayedUnit);
        }
        else {
            displayedUnit = "C";
            view.displayTemperature(weatherApp.temp_celsius.toFixed(), displayedUnit);
        }
    },
    detectOrientation() {
        if (window.screen.orientation.type === "portrait-primary") {
            weatherApp.isPortrait = true;
        }
        else {
            weatherApp.isPortrait = false;
        }
    },
    detectDevice() {
        let deviceWidth = window.innerWidth;
//DEL?        let deviceHeight = window.innerHeight;

        if (weatherApp.isPortrait) {
            if (deviceWidth < 432) {
                weatherApp.isMobile = true;
            }
            else if (deviceWidth < 558) {
                weatherApp.isTablet = true;
            }
            else if (deviceWidth < 675) {
                weatherApp.isDesktop = true;
            }
            else {
                weatherApp.isLargeDesktop = true;
            }
        }
        else {
            if (deviceWidth < 768) {
                weatherApp.isMobile = true;
            }
            else if (deviceWidth < 992) {
                weatherApp.isTablet = true;
            }
            else if (deviceWidth < 1200) {
                weatherApp.isDesktop = true;
            }
            else {
                weatherApp.isLargeDesktop = true;
            }
        }
        /* TEST
        console.log("device is mobile: " + weatherApp.isMobile);
        console.log("device is tablet: " + weatherApp.isTablet);
        console.log("device is desktop: " + weatherApp.isDesktop);
        console.log("device is large desktop: " + weatherApp.isLargeDesktop);
        */
    }
};
