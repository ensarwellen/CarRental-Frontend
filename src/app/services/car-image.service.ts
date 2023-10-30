import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { CarImage } from '../models/carImage';
import { responseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {

  apiURL = 'https://localhost:7183/';

  constructor(private httpClient:HttpClient) { }
 
  getCarImages():Observable<ListResponseModel<CarImage>>{
   let newPath = this.apiURL + "CarImages/getall"
   return this.httpClient.get<ListResponseModel<CarImage>>(newPath);    
  }
  
  addCarImage(file: File,carId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('carId', carId.toString());
    formData.append('file', file);
    
    let newPath = this.apiURL + "carImages/add";
    return this.httpClient.post<any>(newPath, formData);
  }
  
  getCarImagesByCarId(carId:number):Observable<ListResponseModel<CarImage>>{
   let newPath = this.apiURL + "api/CarImages/getbycarid?carId="+carId 
   return this.httpClient.get<ListResponseModel<CarImage>>(newPath);     
  }

  getByCarId(carId:number):Observable<ListResponseModel<CarImage>>{
    let newPath = this.apiURL + "api/CarImages/getbycarid?carId=" + carId;
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath)
  }
  getImagePath(carImage: string):Observable<ListResponseModel<CarImage>>{
    let newPath = this.apiURL+"uploads/images/="+carImage
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath)
  }
  deleteCarImage(carImage: CarImage,) {
    let newPath = this.apiURL + "CarImages/Delete";
    return this.httpClient.post(newPath,carImage)

  }

}
