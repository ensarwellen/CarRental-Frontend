import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Car } from '../models/car';
import { Color } from '../models/color';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl='https://localhost:7183/api/';
  constructor(private httpClient:HttpClient) { }


  getCars():Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/getdetail"
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }

  getCarById(carId:number):Observable<ListResponseModel<Car>>{
    let newPath = this.apiUrl + "cars/getbyid?carId=" + carId
    return this.httpClient.get<ListResponseModel<Car>>(newPath);
  }

  getCarsByBrandId(brandId:number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/getcarsbybrandid?brandId="+brandId;
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }

  getCarsByColorId(colorId:number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/getcarsbycolorid?colorId="+colorId;
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }
}
