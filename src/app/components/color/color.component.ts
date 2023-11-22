import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/models/color';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {

  currentColor:Color;
  colors:Color[]=[];

  constructor(private colorService:ColorService,
    private carService:CarService,private selectionService: SelectionService){
      // Subscribe to color changes
  this.selectionService.color$.subscribe((color) => {
    // Update the current color in the component
    this.currentColor = color;
  });
    }
  ngOnInit(): void {
    this.getColors();
  }

  getColors(){
    this.colorService.getColors().subscribe(c=>{
      this.colors = c.data;
    });
  }

  setCurrentColor(color: Color) {
    // Set the current color using the service
    this.selectionService.setCurrentColor(color);
  }
  
  clearCurrentColor() {
    // Clear the current color using the service
    this.selectionService.clearCurrentColor();
  }
  getCurrentColor(color:Color){
    if(this.currentColor == color){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }
  
  getAllColorClass(){
    if(this.currentColor==null){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }
  
  

}
