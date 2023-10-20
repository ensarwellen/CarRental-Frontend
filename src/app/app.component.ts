import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recap';

  product1={productId:1,productName:"Camera"};
  product2={productId:2,productName:"Mouse"};
  product3={productId:3,productName:"Keyboard"};
  product4={productId:4,productName:"Monitor"};
  product5={productId:5,productName:"Telephone"};

  products=[this.product1,this.product2,this.product3,this.product4,this.product5]
}
