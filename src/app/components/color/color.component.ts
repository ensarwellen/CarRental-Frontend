import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/models/color';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {

  currentColor:Color;
  colors:Color[]=[];

  constructor(private colorService:ColorService,
    private carService:CarService){}
  ngOnInit(): void {
    this.getColors();
  }

  getColors(){
    this.colorService.getColors().subscribe(c=>{
      this.colors = c.data;
    });
  }

  setCurrentColor(color:Color){
    this.currentColor = color;
  }

  clearCurrentColor(){
    this.currentColor = null;
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
