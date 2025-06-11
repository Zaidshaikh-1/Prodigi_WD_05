let useCelsius = localStorage.getItem("useCelsius") !== "false"; // default to Celsius
function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultBox = document.getElementById("weatherResult");
  resultBox.innerHTML = "";

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const location = data.location;
      const forecastDays = data.forecast.forecastday;

        document.getElementById("locationHeading").innerHTML = `<h2>${location.name}, ${location.country}</h2>`;

      forecastDays.forEach(day => {
        resultBox.innerHTML += `
          <div class="card">
            <h3>${day.date}</h3>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p><strong>${day.day.condition.text}</strong></p>
            <p>Temperature: ${useCelsius ? day.day.avgtemp_c + "°C" : day.day.avgtemp_f + "°F"}</p>
            <p>Min: ${useCelsius ? day.day.mintemp_c + "°C" : day.day.mintemp_f + "°F"}</p>
            <p>Max: ${useCelsius ? day.day.maxtemp_c + "°C" : day.day.maxtemp_f + "°F"}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      resultBox.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

const toggleBtn = document.getElementById("toggleDarkMode");

// Function to update button label based on mode
function updateToggleButton(isDark) {
  toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Toggle dark mode and update UI + localStorage
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);
  updateToggleButton(isDark);
});

// On page load: check saved theme and apply
window.onload = () => {
  document.getElementById('cityInput').focus();
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
  }
  updateToggleButton(isDark);
    document.getElementById("unitToggle").textContent = useCelsius ? "Switch to °F" : "Switch to °C";
};

document.getElementById("unitToggle").addEventListener("click", () => {
  useCelsius = !useCelsius;
  localStorage.setItem("useCelsius", useCelsius);
  document.getElementById("unitToggle").textContent = useCelsius ? "Switch to °F" : "Switch to °C";

  // Re-run the weather fetch if there's data
  const lastCity = document.getElementById("cityInput").value;
  if (lastCity.trim() !== "") {
    getWeather();
  }
});