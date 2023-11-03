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

  apiURL = 'https://localhost:7183/api/';

  constructor(private httpClient:HttpClient) { }
 
  getCarImages():Observable<ListResponseModel<CarImage>>{
   let newPath = this.apiURL + "carImages/getall"
   return this.httpClient.get<ListResponseModel<CarImage>>(newPath);    
  }
  
  addCarImage(file: File,carId: number): Observable<any> {
    // const formData: FormData = new FormData();
    // formData.append('carId', carId.toString());
    // formData.append('file', file);
    // console.log("Servisteki CarId: "+carId)
    
    // let newPath = this.apiURL + "carImages/add";
    // return this.httpClient.post<any>(newPath, formData);
    const data = {
      carId: carId
    };
  
    const formData = new FormData();
    formData.append('file', file, file.name);
  
    return this.httpClient.post<any>(this.apiURL + 'carImages/add', formData, {
      params: data
    });
  }
  uploadImages(file: File[], carId: number): Observable<responseModel> {
    const data = {
      carId: carId
    };
    const formData = new FormData();
  
    for (let i = 0; i < file.length; i++) {
      formData.append('file', file[i]);
    }
  
    return this.httpClient.post<responseModel>(this.apiURL + "CarImages/addmultiple", formData, {
      params: data
    }); 
  }
  
  getCarImagesByCarId(carId:number):Observable<ListResponseModel<CarImage>>{
   let newPath = this.apiURL + "CarImages/getbycarid?carId="+carId 
   return this.httpClient.get<ListResponseModel<CarImage>>(newPath);     
  }

  getByCarId(carId:number):Observable<ListResponseModel<CarImage>>{
    let newPath = this.apiURL + "CarImages/getbycarid?carId=" + carId;
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath)
  }
  getImagePath(carImage: string):Observable<ListResponseModel<CarImage>>{
    let newPath = this.apiURL+"uploads/images/="+carImage
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath)
  }
  deleteCarImage(carImage: CarImage):Observable<ListResponseModel<CarImage>> {
    let newPath = this.apiURL + "CarImages/Delete";
    return this.httpClient.post<ListResponseModel<CarImage>>(newPath,carImage)

  }

}
