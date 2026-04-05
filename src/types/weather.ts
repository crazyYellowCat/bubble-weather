export interface  WeatherResponseApi {
  weather:{description:string}[]
  main: {
    temp:number,
    feels_like:number,
    humidity: number
  };
 wind:{speed:number,deg:number},
 name:string
}
export interface  showDataForm {
  weather:string
  city:string,
  temp:number,
  wind_speed:number,
  wind_deg:string,
  feel_like:number,
  humidity:number
}

