import { Component } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe]
})
export class CartTotalComponent {
  constructor(private cartService : CartService ){}
  cartItems = this.cartService.cartItems;

  subTotal = this.cartService.subTotal;
  deliveryFee = this.cartService.deliveryFree;
  tax = this.cartService.tax;
  totalPrice = this.cartService.totalPrice;

}
