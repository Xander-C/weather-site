const WEATHER_BASE_URL = 'https://my-weather12138.herokuapp.com/';
const provinceElement = document.querySelector("#province");
const cityElement = document.querySelector("#city");

const createWeatherUrl = (type = "forecast_24h", province, city) => `${WEATHER_BASE_URL}?source=xw&weather_type=${type}&province=${province}&city=${city}`;

function createElement(innerHTML,tagName="span",style="margin: 0 1rem 0 1rem;") {
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  element.style = style;
  return element;
}

class WeatherItem {
  constructor(weatherItem,classNames,style) {
    const { day_weather, night_weather, min_degree, max_degree, time } = weatherItem;
    this.dayWeather = day_weather;
    this.nightWeather = night_weather;
    this.minDegree = min_degree;
    this.maxDegree = max_degree;
    this.time = time;
    this.classNames = classNames;
    this.style = style;
  }

  toHTMLElement() {
    const element = document.createElement('li');
    element.appendChild(createElement(`日间天气：${this.dayWeather}`));
    element.appendChild(createElement(`夜间天气：${this.nightWeather}`));
    element.appendChild(createElement(`最低温度：${this.minDegree}℃`));
    element.appendChild(createElement(`最高温度：${this.maxDegree}℃`));
    element.appendChild(createElement(`时间：${this.time}`));
    if (this.classNames) {
      element.classList.add(...this.classNames.split(" "));
    }
    if (this.style) {
      element.style = this.style;
    }
    return element;
  }
}

async function fetchWeatherDetail() {
  const newDisplayContainer = document.createElement('ol');
  newDisplayContainer.id = "display-container";
  const inputContainer = document.querySelector("#input-container");

  inputContainer.classList.add("flash-infinite");
  const response = await fetch(createWeatherUrl("forecast_24h", provinceElement.value, cityElement.value));
  const data = await response.json();
  inputContainer.classList.remove("flash-infinite");

  if (!data.data || !data.data.forecast_24h || !data.data.forecast_24h["0"]) {
    inputContainer.classList.remove("my-shake");
    setTimeout(() => {
      inputContainer.classList.add("my-shake");
    }, 300);
    return;
  }
  Object.values(data.data.forecast_24h).forEach((item, index) => {
    const weatherItem = new WeatherItem(item, "animated bounceInUp", `animation-duration:${index*1 + 7}00ms;`);
    newDisplayContainer.appendChild(weatherItem.toHTMLElement());
  })
  document.querySelector("#display-container").remove();
  document.querySelector("#app").appendChild(newDisplayContainer);
}