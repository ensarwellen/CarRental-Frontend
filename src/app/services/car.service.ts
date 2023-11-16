import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Car } from '../models/car';
import { Color } from '../models/color';
import { SingleResponseModel } from '../models/singleResponseModel';
import { responseModel } from '../models/responseModel';
import { tap } from 'rxjs/operators';

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
  getCarsWithPagination(page:number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/GetCarsWithPagination?page="+page;
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }

  getCarById(carId:number):Observable<SingleResponseModel<Car>>{
    let newPath = this.apiUrl + "cars/getbyid?carId=" + carId
    return this.httpClient.get<SingleResponseModel<Car>>(newPath);
  }

  getCarsByBrandId(brandId:number, page:number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/getcarsbybrandid?brandId="+brandId+"&page="+page;
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }

  getCarsByColorId(colorId:number, page:number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl + "cars/getcarsbycolorid?colorId="+colorId+"&page="+page;
    return this.httpClient.get<ListResponseModel<Car>>(newPath)
  }

  getCarsByColorAndBrand(brandId:number, colorId:number){
    let newUrl = this.apiUrl + 
    "cars/getcardetailsbycolorandbrand?brandId=" + brandId + "&colorId=" + colorId;
    return this.httpClient.get<ListResponseModel<Car>>(newUrl);
  }

  add(car:Car):Observable<SingleResponseModel<Car>>{
    return this.httpClient.post<SingleResponseModel<Car>>(this.apiUrl+"cars/add",car)
  }
  update(car: Car): Observable<SingleResponseModel<Car>> {
    let newPath = this.apiUrl + 'cars/update';
    return this.httpClient.post<SingleResponseModel<Car>>(newPath, car);
  }
  delete(car:Car):Observable<SingleResponseModel<Car>>{
    let newPath = this.apiUrl +"Cars/delete";
    return this.httpClient.post<SingleResponseModel<Car>>(newPath,car).pipe(tap({
      next: (response) => {
        // İsteğe bağlı, bu kısımda da gerekli işlemleri yapabilirsiniz.
      },
      error: (error) => {
        // İsteğe bağlı, bu kısımda da gerekli işlemleri yapabilirsiniz.
      }
    })
  );
}
  
}
