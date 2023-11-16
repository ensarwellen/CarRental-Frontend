import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';

import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { Color } from 'src/app/models/color';
import { AuthService } from 'src/app/services/auth.service';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})

export class CarComponent implements OnInit {
  cars : Car[]=[];
  brands: Brand[]=[];
  colors : Color[]=[];

  imageUrl = "https://localhost:7183/uploads/images/"
  carImages: CarImage[];

  dataLoaded = false ;
  currentCar:Car | null;
  filterText ="";
  brandFilter: number = 0;
  colorFilter: number = 0;
  isAdmin: boolean = false;
  isAuthenticated:boolean = false;
  cr: CarImage[] = [];
  currentPage:number;
  pageCount:number;
  pages:number[]=[];
  currentColor:number;
  currentBrand:number;

  constructor(
    private carService : CarService,
    private activatedRouted:ActivatedRoute,
    private carImageService:CarImageService,
    private brandService:BrandService,
    private colorService:ColorService,
    private toastrService:ToastrService,
    private cartService:CartService,
    private authService:AuthService,
    private router: Router){}

  ngOnInit(): void {
    this.activatedRouted.params.subscribe(params => {
      this.isUserAuthenticated();
      this.checkUserStats();
      this.getAllCarImages();
      this.orderPages();
      if (params["brandId"]) {
        this.getCarsByBrand(params["brandId"],1)
      }
      else if(params["colorId"] ){
        this.getCarByColor(params["colorId"],1)       
      }
      else if (params["carId"]) {
        this.getCarById(params["carId"])
      }
      else{
        
        //this.getCars();
         this.GetCarsWithPagination(1);
        this.getBrands();
        this.getColors();
        
      }
    });
  }
  async checkUserStats() {
    await this.updateAdminState();
    this.isTokenValid();
    this.isUserAdmin();
  }
  
  isUserAuthenticated(){
    this.authService.isAuthenticatedObservable().subscribe(response=>{     
      this.isAuthenticated = response;
    })
  }
  generateRouteForCarsAdd(){
    if(this.isTokenValid && this.isAdmin){
      this.router.navigate(['/cars/add']);
    }else{
      this.router.navigate(['/login']);
    }
  }
  isTokenValid(){
    if(this.isAuthenticated){
      if(this.authService.isTokenValid()){
        return true;
      }else{
        this.isAdmin=false;
        alert("Oturumun süresi doldu");
        this.authService.logout();      
        return false;
      }
    }
    return false;
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

  //pagination start
  setCurrentPage(page:number){
    this.currentPage = page;
  }
  getCurrentPage(page:number){
    if(this.currentPage == page){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }
  orderPages() {
    this.pages = [];
  
    const maxVisiblePages = 3; // Görünen maksimum sayfa sayısı
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
  
    if (this.pageCount - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, this.pageCount - maxVisiblePages + 1);
    }
  
    for (let i = startPage; i < startPage + maxVisiblePages && i <= this.pageCount; i++) {
      this.pages.push(i);
    }
  }
  nextPage(){
    if(this.currentPage == this.pageCount){
      return;
    }
    this.currentPage+=1;
    if (this.currentColor) {
      this.GetCarsWithColorPagination(this.currentPage);
  } else if (this.currentBrand) {
      this.GetCarsWithBrandPagination(this.currentPage);
  } else {
      this.GetCarsWithPagination(this.currentPage);
  }
  }
  prevPage(){
    if(this.currentPage==1){
      return;
    }
    this.currentPage-=1;
    if (this.currentColor) {
      this.GetCarsWithColorPagination(this.currentPage);
  } else if (this.currentBrand) {
      this.GetCarsWithBrandPagination(this.currentPage);
  } else {
      this.GetCarsWithPagination(this.currentPage);
  }
  }
  GetCarsWithPagination(page: number) {
    this.currentPage = page;
    this.carService.getCarsWithPagination(this.currentPage).subscribe(response => {
      this.cars = response.data;
      this.pageCount = this.cars[0].pageCount;
      this.orderPages();
      this.dataLoaded = true;
    });
  }
  //pagination end
  getCars(){
    this.carService.getCars(). subscribe((response)=>{
      this.cars=response.data
      this.dataLoaded=true;
    })
  }
  getBrands(){
    this.brandService.getBrands().subscribe(response=>{
      this.brands = response.data;
    });
  }
  getColors(){
    this.colorService.getColors().subscribe(response=>{
      this.colors = response.data;
    });
  }
  getCarByColor(colorId:number,page:number){
    this.currentPage = page;
    this.currentColor = colorId;
    this.carService.getCarsByColorId(colorId,page)
    .subscribe((response)=>{
      this.cars=response.data;
      this.pageCount = this.cars[0].pageCount;
      this.orderPages();
      this.dataLoaded=true;
    })
  }
  GetCarsWithColorPagination(page: number) {
    this.currentPage = page;
    this.carService.getCarsByColorId(this.currentColor, page) // Kaydedilmiş renk bilgisini kullan
        .subscribe(response => {
            this.cars = response.data;
            this.pageCount = this.cars[0].pageCount;
            this.orderPages();
            this.dataLoaded = true;
        });
}
  getCarsByBrand(brandId:number,page:number){
    this.currentPage = page;
    this.currentBrand = brandId;
    this.carService.getCarsByBrandId(brandId,page).subscribe(response => {
      this.cars = response.data;
      this.pageCount = this.cars[0].pageCount;
      this.orderPages();
      this.dataLoaded = true;
    })
  }
  GetCarsWithBrandPagination(page: number) {
    this.currentPage = page;
    this.carService.getCarsByBrandId(this.currentBrand, page)
        .subscribe(response => {
            this.cars = response.data;
            this.pageCount = this.cars[0].pageCount;
            this.orderPages();
            this.dataLoaded = true;
        });
}
  getCarImage(car:Car){
    let path; 
    if (car.imagePath == null) {
      path = this.imageUrl + "default.jpg"
      return path;

    }
    else{
      for (const carImage of this.cr) {
        if (carImage.carId === car.carId) {
          path = this.imageUrl + carImage.imagePath;
          break; // İlk uygun resmi bulduktan sonra döngüyü kır
        }
      }
    }
    return path;
  }
  getAllCarImages(){
    this.carImageService.getCarImages().subscribe(response => {
      this.cr = response.data;
    })
  }
  setCurrentCar(car:Car){
    this.currentCar=car;
  }
  
  getCarById(carId:number){
    this.carService.getCarsByBrandId(carId,1).subscribe(response => {
      this.cars = response.data;
      
    })
  }
  getCarsByColorAndBrand(brandId:number, colorId:number){
    if(brandId!=0 && colorId!=0){
      this.carService.getCarsByColorAndBrand(brandId, colorId).subscribe(response=>{
        this.cars = response.data
        this.dataLoaded = true;
        brandId=null;
        colorId=null;
      })
    }else if(brandId==0 && colorId != 0){
      this.getCarByColor(colorId,this.currentPage);
    }else if(brandId!=0 && colorId == 0){
      this.getCarsByBrand(brandId,this.currentPage);
    }else{
      this.GetCarsWithPagination(this.currentPage);
    }
    
  }
  
  reset(){
    this.currentCar = null;
  }

  addToCart(car:Car){ 
    this.toastrService.success("Sepete eklendi",car.brandName)
    this.cartService.addToCart(car);
  }
  

}
