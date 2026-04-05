<template>
  <div class="container">
    <el-row class="top">
      <el-col :span="16">
        <el-autocomplete
          v-model="city"
          :fetch-suggestions="querySearch"
          clearable
          class="w-50"
          placeholder="Please Input"
          @select="getWeather"
        />
      </el-col>
      <el-col :span="4"> </el-col>
      <el-col :span="4">
        <el-button @click="getWeather" type="primary">查询</el-button></el-col
      >
    </el-row>
    <el-row>
      <el-card class="box-card">
        <p class="content-line">
          <span>城市：{{ showData.city }}</span>
        </p>
        <p class="content-line">
          <span>天气：{{ showData.weather }}</span>
        </p>
        <p class="content-line">
          <span>温度：{{ showData.temp }}℃</span>
        </p>
        <p class="content-line">
          <span>风向：{{ showData.wind_deg }}</span>
        </p>
        <p class="content-line">
          <span>风速：{{ showData.wind_speed }} m/s</span>
        </p>
        <p class="content-line">
          <span>体感温度：{{ showData.feel_like }}℃</span>
        </p>
        <p class="content-line">
          <span>湿度：{{ showData.humidity }}%</span>
        </p>
      </el-card>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { pinyin } from "pinyin-pro";
import type { WeatherResponseApi, showDataForm } from "../types/weather";
import { cityNames, weatherDescMap } from "../utils/dict.ts";

let city = ref<string>("");
let cityNamePinyin = ref<string>("");
const WeatherResponseApi = reactive<WeatherResponseApi>({
  weather: [],
  main: {
    temp: 0,
    feels_like: 0,
    humidity: 0,
  },
  wind: { speed: 0, deg: 0 },
  name: "",
});
let showData = ref<showDataForm>({
  weather: "",
  city: "",
  temp: 0,

  wind_speed: 0,
  wind_deg: "",
  feel_like: 0,
  humidity: 0,
});
interface SuggestionItem {
  value: string;
}
const apiKey = "50309a09f43125645f339a1d6274fa29";
const querySearch = (queryString: string, cb: any): void => {
  let results: SuggestionItem[] = [];
  if (queryString) {
    // 根据输入的查询字符串过滤城市名称，支持中文匹配
    results = Object.keys(cityNames)
      .filter(
        (name) =>
          name.toLowerCase().includes(queryString.toLowerCase()) || // 匹配英文
          pinyin(name, { toneType: "none" })
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(queryString.toLowerCase()) || // 匹配拼音
          cityNames[name].includes(queryString), // 直接匹配中文城市名
      )
      .map((item) => ({ value: cityNames[item] })); // 返回中文城市名
  } else {
    // 如果没有查询字符串，返回所有中文城市名称
    results = Object.keys(cityNames).map((item) => ({
      value: cityNames[item],
    }));
  }
  cb(results);
};
const convertCityName = () => {
  cityNamePinyin.value = pinyin(city.value, { toneType: "none" }).replace(
    /\s/g,
    "",
  );
  console.log(city.value);
};

const formatData = (data: WeatherResponseApi): showDataForm => {
  return {
    weather: weatherDescMap[data.weather[0].description],
    city: cityNames[data.name] || "未找到该城市",
    temp: data.main.temp,
    wind_speed: data.wind.speed,
    wind_deg: convertWindDirection(data.wind.deg),
    feel_like: data.main.feels_like,
    humidity: data.main.humidity,

    // wind: { speed: 0 },
  };
};

// https://api.openweathermap.org/data/2.5/weather?q=beijing&appid=50309a09f43125645f339a1d6274fa29&units=metric
const getWeather = async () => {
  convertCityName();
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityNamePinyin.value},&limit=${5}&appid=${apiKey}&units=metric`,
  );
  showData.value = formatData(await res.json());
  console.log(showData, "showData++++");
};

const convertWindDirection = (deg: number): string => {
  const directions = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};
</script>
<style scoped>
.content-line {
  line-height: 30px;
  text-align: left;
  padding-left: 50px;
}
.container {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  /* border:1px solid #eee */
}

.box-card {
  margin-top: 10px;
  width: 100%;
  height: 500px;
}
.top {
  margin-top: 10px;
}
</style>
