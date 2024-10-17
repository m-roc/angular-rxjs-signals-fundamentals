import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
cartItems = signal<CartItem[]>([]);

cartCount = computed(() => this.cartItems()
.reduce((acQty, item) => acQty + item.quantity, 0));

subTotal = computed(() => this.cartItems()
.reduce((acTotal, item) => 
  acTotal + (item.quantity + item.product.price), 0));

deliveryFree = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);

tax = computed(() => Math.round(this.subTotal() * 10.75 / 100));

totalPrice = computed(() => this.subTotal() + this.deliveryFree() + this.tax());

eLength = effect(() => console.log('THIS length: ', this.cartItems().length));

addToCart(product: Product): void{
  //this.cartItems().push({product, quantity: 1});
  this.cartItems.update(items => [...items, {product, quantity: 1}]);
}

removeFromCart(cartitem: CartItem) : void{
  this.cartItems.update(items =>
items.filter(item => item.product.id !== cartitem.product.id)
  )
}

updateQuantity(cartItem: CartItem, quantity: number) : void{
  this.cartItems.update(items =>
    items.map(item => item.product.id === cartItem.product.id ?
      {...item, quantity} : item
    )
  );
}

}
