import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { AuthService } from 'src/app/services/auth.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit{
   car:Car;
   imageUrl = "https://localhost:7183/uploads/images/"
   carImages:CarImage[] = [];
   currentCar:Car
  //  rental:Rental[]=[];
  //  currentRental:Rental
   currentImage: CarImage;
   dataLoaded = false ;
   isAdmin: boolean = false;
   

  
   constructor(private carService: CarService,
    private activatedRoute:ActivatedRoute,
    private carImageService:CarImageService,
    private cartService:CartService,
    private toastrService:ToastrService,
    private authService:AuthService
    // private renalService:RentalService
   ){}

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.getCarById(params["carId"])
        this.updateAdminState();
        this.isUserAdmin();
        this.getImageByCarId(params["carId"])
        
        
      })
    }
    async updateAdminState() {
      const userRole = await this.authService.getUserRole();
      if (userRole === 'admin') {
        this.authService.updateAdminState(true);
      } else {
        this.authService.updateAdminState(false);
      }
    }
    isUserAdmin(){
      this.authService.getIsAdminSubject().subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    }
    
    generateCarUpdateLink(): string {
      if (this.car && this.car.carId) {
        return `/cars/update/${this.car.carId}`;
      } else {
        return '/cars'; // Varsayılan URL ya da hata durumu için bir yönlendirme
      }
    }
    getImageByCarId(carId:number){
      this.carImageService.getByCarId(carId).subscribe(response => {
        console.log(response)
        this.carImages = response.data;
        this.dataLoaded=true;

      })
    }

    getImagePath(carImage: CarImage) {
      if (carImage.imagePath == null) {
        let path = this.imageUrl + "default.jpg"
        return path;
      }else{
        let path = this.imageUrl + carImage.imagePath;
      return path;
      }
      
    }

    getCarImage(car:Car){
      if (car.imagePath == null) {
        let path = this.imageUrl + "default.jpg"
        return path;
  
      }
      else{
        let path = this.imageUrl + car.imagePath;
        return path;
      }
    }
    
   
    getCarById(id:number) {
      this.carService.getCarById(id).subscribe(response => {
      this.car = response.data;
      this.dataLoaded = true;
      })
    
    } 
    
    // setCurrentRental(rental:Rental){
    //   this.currentRental=rental;
    // }
 

  

  addToCart(car:Car){ 
    
      this.toastrService.success("Sepete eklendi",car.brandName)
      this.cartService.addToCart(car);
  


  }
  sertCurrentCar(car:Car){
    this.currentCar=car;
  }

  }
