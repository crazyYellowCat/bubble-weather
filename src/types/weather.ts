export interface  WeatherResponseApi {
  weather:{description:string}[]
  main: {
    temp:number,
    feel_like:number,
    humidity: number
  };
 wind:{speed:number,deg:number},
 name:string
}
export interface  showDataForm {
  weather:string
  city:string,
  temp:number
}