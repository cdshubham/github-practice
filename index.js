let click = document.querySelector(".click");
let inputText = document.getElementById("city");
let temp = document.querySelector(".temp span");
let cityName = document.querySelector(".name");
let humidity = document.querySelector(".humidity p");
let wind = document.querySelector(".wind p");
let weatherImage = document.querySelector(".header img");
const bodyElement = document.body;
const cover = document.querySelector(".cover");

let previousCity;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${previousCity}&units=metric`;
const apiKey = "6e29ab359ef5ba2e4f67dd4060165ba0";

let imageUrl = `https://api.unsplash.com/photos/random?query=sunny&client_id=rJrbKgI26kTNswWKkskXdWP7wG17oaRokZNrvHDxaS0`;
let data;
let lat;
let long;
let weatherType;

//CODE HERE
async function checkWeather(city) {
  const response = await fetch(apiUrl + `&appid=${apiKey}`);
  data = await response.json();
  // console.log(apiUrl);
  // console.log(data);
  cityName.innerHTML = data.name;
  humidity.innerHTML = data.main.humidity + "%";
  wind.innerHTML = data.wind.speed;
  weatherType = data.weather[0].main;

  imageUrl = `https://api.unsplash.com/photos/random?query=${weatherType}&client_id=rJrbKgI26kTNswWKkskXdWP7wG17oaRokZNrvHDxaS0`;
  if (weatherType === "Rain") cover.classList.add("rain");
  else cover.classList.remove("rain");
  if (weatherType === "Clouds") cover.classList.add("cloud");
  else cover.classList.remove("cloud");
  console.log(weatherType);
  weatherImage.src = `${data.weather[0].main}.png`;
}

click.addEventListener("click", function () {
  if (inputText.value !== previousCity) {
    previousCity = inputText.value;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${previousCity}&units=metric`;
    checkWeather(previousCity);
    fetch(imageUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract the image URL from the response
        const imageUrl = data.urls.regular;

        bodyElement.style.backgroundImage = `url(${imageUrl})`;
        bodyElement.style.backgroundSize = "cover";
      })
      .catch((error) => console.error("Error:", error));
  }
});

window.addEventListener("load", function () {
  // Check if geolocation is available in the browser
  if ("geolocation" in navigator) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Use a reverse geocoding API to get the city based on coordinates
      let apiUrlCity = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=dece89d75e8f490da7b6d96f60b559e0`;

      fetch(apiUrlCity)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          previousCity = data.results[0].city;
          // console.log(previousCity);
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${previousCity}&units=metric`;
          checkWeather(previousCity);

          fetch(imageUrl)
            .then((response) => response.json())
            .then((data) => {
              // Extract the image URL from the response
              const imageUrl = data.urls.regular;

              bodyElement.style.backgroundImage = `url(${imageUrl})`;
              bodyElement.style.backgroundSize = "cover";
            })
            .catch((error) => console.error("Error:", error));
        })
        .catch((error) => {
          console.error("Error fetching city:", error);
        });
    });
  } else {
    console.log("Geolocation is not available in this browser.");
  }
});
