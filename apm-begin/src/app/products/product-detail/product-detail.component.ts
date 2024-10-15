import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, empty, Subscription, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent { //implements OnChanges, OnDestroy {
 
  constructor(private productService: ProductService,
    private cartService: CartService
  ){}

  //@Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  //product: Product | null = null;
 product$ = this.productService.product$
 .pipe(
  catchError(err => {
    this.errorMessage = err;
     throw(err);
  })
);

  
  //sub! : Subscription;
  // Set the page title
  //pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = " title";

  /*ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if(id){
      this.sub = this.productService.getProduct(id)
      .pipe(
        catchError(err => {
          this.errorMessage = err;
           throw(err);
        })
      )
      .subscribe(product => this.product = product);
      
    }
  }*/
  /*ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }*/

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
