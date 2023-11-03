import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { tap } from 'rxjs/operators';
import { CarImage } from 'src/app/models/carImage';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent implements OnInit,AfterViewInit {
  brands: Brand[];
  colors: Color[];
  carUpdateForm: FormGroup;
  carId: number;
  currentCar: any;
  currentCarImagePath:any[];
  tempCarImages: CarImage[];

  constructor(
    private brandService: BrandService,
    private colorService: ColorService,
    private carService: CarService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    //private sweetAlertService: SweetAlertService,
    private carImageService:CarImageService
  ) {}

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.carId = params['id'];
      this.getCarById(this.carId);
      this.getCarImages(this.carId);
    });
    this.getBrands();
    this.getColors();
    this.createCarUpdateForm();
  }

  createCarUpdateForm() {
    this.carUpdateForm = this.formBuilder.group({
      carId: [this.carId, Validators.required],
      brandId: ['', Validators.required],
      colorId: ['', Validators.required],
      modelYear: ['', Validators.required],
      dailyPrice: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
    });
  }

  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  update() {
    if (this.carUpdateForm.valid) {
      const carModel: Car = Object.assign({}, this.carUpdateForm.value);
      this.carService.update(carModel).subscribe(
        (response) => {
          this.toastrService.success('Araba güncellendi', 'Başarılı');
          this.router.navigate(['/cars']);
        },
        (responseError) => {
          if (responseError.error.Errors.length > 0) {
            for (let i = 0; i < responseError.error.Errors.length; i++) {
              this.toastrService.error(responseError.error.Errors[i].ErrorMessage);
            }
          }
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik !', 'Hata');
    }
  }

  getCarById(carId: number) {
    this.carService.getCarById(carId).subscribe((response) => {
      this.currentCar = response.data;
      this.carUpdateForm.patchValue(this.currentCar); 
    });
  }

  // ------------- Delete Car Operations Begin -------------
  // #3rd func
  deleteCarImage(carImage:CarImage){
    this.carImageService.deleteCarImage(carImage).pipe(
      tap({
        next: response=>{

        },error: error=>{

        }
      })
    ).subscribe();
  }
  // #2nd func
  async getCarImageByCarId(carId:number){
    let newCar = Object.assign({}, this.carUpdateForm.value);
    this.carImageService.getByCarId(carId).pipe(
      tap({
        next: response=> {
          this.tempCarImages = response.data;
          this.tempCarImages.forEach((carImage:CarImage)=>{
            if(carImage.imagePath!="DefaultImage.jpg"){
              this.deleteCarImage(carImage);
              this.router.navigate(['/cars']);
              this.toastrService.success("Araç Başarıyla Silindi !", "Dikkat!");
            }else{
              this.router.navigate(['/cars']);
              this.toastrService.success("Araç Başarıyla Silindi !", "Dikkat!");
            }
          })
        }
      })
    ).subscribe();
  }
  // #1st func
  async deleteCar(carId:number){
    let newCar = Object.assign({}, this.carUpdateForm.value);
    this.carService.delete(newCar).pipe(
      tap({
        next: async (response) => {
          await this.getCarImageByCarId(carId);
        },
        error: (error) => {
          this.toastrService.error("Bir hata meydana geldi", "Dikkat");
        }
      })
    )
    .subscribe();
}
// ------------- Delete Car Operations End -------------


  getCarImages(carId:number){
    this.carImageService.getCarImagesByCarId(carId).subscribe(response => {
      //İlerleyen zamanda birden fazla resim için burasını foreach ile dönerek carousel'e basabilirsin.
      this.currentCarImagePath = response.data;
    })
    
  }
}
