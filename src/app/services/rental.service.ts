import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from '../models/rental';
import { SingleResponseModel } from '../models/singleResponseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  apiUrl='https://localhost:7183/api/';

  constructor(private httpClient:HttpClient) { }

  add(rental:Rental):Observable<ListResponseModel<Rental>>{
    return this.httpClient.post<ListResponseModel<Rental>>(this.apiUrl+"rentals/add",rental);
  }
  getRentDatesByCarId(carId:number):Observable<ListResponseModel<Rental>>{
    return this.httpClient.get<ListResponseModel<Rental>>(this.apiUrl+"rentals/getrentdatesbycarid?carId="+carId);
  }
}
