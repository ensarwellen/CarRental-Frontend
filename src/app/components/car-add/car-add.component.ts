import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {

  carAddForm:FormGroup;
  brands:Brand[]=[];
  colors:Color[]=[];
  tempCar:Car;

  constructor(private formBuilder:FormBuilder,
    private carService:CarService, private toastrService:ToastrService,
    private brandService:BrandService, private colorService:ColorService,
    private carImageService:CarImageService){}


  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
  }

  createCarAddForm(){
    this.carAddForm = this.formBuilder.group({
      carName:["",Validators.required],
      modelYear:["",Validators.required],
      dailyPrice:["",Validators.required],
      description:[""],
      brandId:["",Validators.required],
      colorId:["",Validators.required],
      imagePath:[""]
    })
  }

  getBrands(){
      this.brandService.getBrands().subscribe(b=>{
      this.brands = b.data;
    });
    
  }

  getColors(){
    this.colorService.getColors().subscribe(c=>{
      this.colors = c.data;
    })
  }
  

  addCar(){
    if(this.carAddForm.valid){
      let carModel = Object.assign({},this.carAddForm.value);
      this.carService.add(carModel).subscribe(response=>{
        console.log(carModel);
        this.tempCar = response.data;
        
        this.toastrService.success("Araba Eklendi","Başarılı");
      });
      
    }else{
      this.toastrService.error("Form Eksik","Dikkat");
    }
  }
  
}
