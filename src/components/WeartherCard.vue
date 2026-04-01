<template>
  <div class="container">
    <el-row class="top">
      <el-col :span="16"
        ><el-input
          v-model="city"
          placeholder="请输入内容"
          @input="inputEvt"
        ></el-input
      ></el-col>
      <el-col :span="4"> </el-col>
      <el-col :span="4">
        <el-button @click="getWeather" type="primary">查询</el-button></el-col
      >
    </el-row>
    <el-row>
      <el-card class="box-card">
        <p><span>城市：</span>{{ showData.city }}</p>
        <p><span>天气：</span>{{ showData.weather }}</p>
        <p><span>温度：</span>{{ showData.temp }}</p>
      </el-card>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { pinyin } from "pinyin-pro";
import type { WeatherResponseApi , showDataForm} from "../types/weather";

let city = ref<string>("");
let cityNamePinyin = ref<string>("");
const WeatherResponseApi = reactive<WeatherResponseApi>({
  weather: [],
  main: {
    temp: 0,
    feel_like: 0,
    humidity: 0,
  },
  wind: { speed: 0 , deg: 0 },
  name: "",
});
let showData = ref<showDataForm>({weather:"",city:"",temp:0});  
const apiKey = "50309a09f43125645f339a1d6274fa29";
const convertCityName = () => {
  cityNamePinyin.value = pinyin(city.value, { toneType: "none" }).replace(
    /\s/g,
    "",
  );
  console.log(city.value);
};

const formatData = (data: WeatherResponseApi) => {
  return {
    weather:data.weather[0].description,
    city:data.name,
    temp:data.main.temp
    // wind: { speed: 0 },
    
  };
};

// https://api.openweathermap.org/data/2.5/weather?q=beijing&appid=50309a09f43125645f339a1d6274fa29&units=metric
const getWeather = async () => {
  convertCityName();
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityNamePinyin.value},&limit=${5}&appid=${apiKey}`,
  );
  showData.value = formatData(await res.json());
   console.log(showData, "showData++++");

};
</script>
<style scoped>
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
