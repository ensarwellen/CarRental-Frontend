import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CartItem } from 'src/app/models/cartItem';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit{
  
  cartItems:CartItem[]=[];

  constructor(private cartService:CartService){

  }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(){
    this.cartItems = this.cartService.list();
  }

  removeCartItem(car:Car){
    this.cartService.removeFromCart(car);
  }

}
