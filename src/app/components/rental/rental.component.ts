import { Component, OnInit } from '@angular/core';
import { RentalService } from 'src/app/services/rental.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Rental } from 'src/app/models/rental';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {

  rentalAddForm:FormGroup;
  tempRentals:Rental[];
  isRented:boolean = false;
  carId:number;
  userId:number;

  constructor(private rentalService:RentalService, private formBuilder:FormBuilder,
    private router: Router, private toastrService:ToastrService,
    private activatedRoute:ActivatedRoute, private authService:AuthService){
      this.activatedRoute.params.subscribe(params => {
        this.carId = params['carId'];   
      });
      this.userId = this.authService.getUserId();
    }

  ngOnInit(): void {
    this.createRentalForm();
    this.getRentals(this.carId);
    this.getIfRented();
  }

  createRentalForm(){
    this.rentalAddForm = this.formBuilder.group({
      carId:[this.carId],
      userId:[this.userId],
      rentDate:["",Validators.required],
      returnDate:["",Validators.required]
    })
  }
  async getIfRented(){
    await this.getRentals(this.carId);
    if(this.tempRentals==null){
      this.isRented=false;
    }else{
      this.isRented=true;
    }
  }
  removePastRentals() {
    const currentDate = new Date();
  
    this.tempRentals = this.tempRentals.filter(rental => {
      const returnDate = new Date(rental.returnDate);
  
      // Eğer returnDate günümüz tarihinden küçükse, bu öğeyi filtrele
      return returnDate >= currentDate;
    });
  }
  async getRentals(carId: number) {
    try {
      const response = await this.rentalService.getRentDatesByCarId(carId).toPromise();
      this.tempRentals = response.data;
      this.removePastRentals();
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  }

  addRental(){
    if (this.rentalAddForm.valid) {
      let rentalModel = Object.assign({}, this.rentalAddForm.value);
      this.rentalService.add(rentalModel).pipe(
        tap((response: any) => {
          if (response.success) {
            this.toastrService.success('Araba kiralandı', 'Başarılı');
          } else {
            this.toastrService.error('Araba kiralanamadı', 'Dikkat');
          }
        }),
        catchError(error => {
          this.toastrService.error('Araba kiralanamadı', 'Dikkat');
          return of(error);
        })
      ).subscribe();
    }
  }
  
}
