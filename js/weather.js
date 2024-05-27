const weatherElement = document.getElementById("weatherData");

const updateWeather = async () => {
  try {
    const now = new Date()
    const hrs = now.getHours();
    const weather = await fetch(
      "https://api.weatherbit.io/v2.0/current?lat=32.0929792&lon=34.7766784&key=dcb5034a82cf4d6096929bc07748e95e"
    );
    const weatherJson = await weather.json();
    const weatherItem = weatherJson.data[0];
    const currentTemp = weatherItem.app_temp;
    const windCond = weatherItem.weather.description;
    weatherElement.innerText = currentTemp + "°C " + windCond;
    const iconImg = document.getElementById("iconImg");
    iconImg.src = `https://cdn.weatherbit.io/static/img/icons/${weatherItem.weather.icon.slice(
      0,
      3
    )}${hrs > 7 && hrs < 20 ? "d" : "n"}.png`;
  } catch (err) {
    console.log(err);
    weatherElement.innerText = "Weather error";
  }
};

setInterval(updateWeather, 1000 * 60 * 10);
updateWeather();
