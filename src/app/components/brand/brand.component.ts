import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit{

  currentBrand:Brand | null;
  brands:Brand[]=[];
  constructor(private brandService:BrandService,private selectionService: SelectionService){
    // Subscribe to brand changes
  this.selectionService.brand$.subscribe((brand) => {
    // Update the current brand in the component
    this.currentBrand = brand;
  });
  }

  ngOnInit(): void {
    this.getBrands();
  }
  getBrands(){
    this.brandService.getBrands().subscribe(response=>{
      this.brands = response.data;
      
    })
  }
  setCurrentBrand(brand: Brand) {
    // Set the current brand using the service
    this.selectionService.setCurrentBrand(brand);
  }
  
  clearCurrentBrand() {
    // Clear the current brand using the service
    this.selectionService.clearCurrentBrand();
  }
  getCurrentBrand(brand:Brand){
    if(brand==this.currentBrand){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }

  getAllBrandClass(){
    if(this.currentBrand==null){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }
}
