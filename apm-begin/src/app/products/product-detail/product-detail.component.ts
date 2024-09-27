import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, empty, Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
 
  constructor(private productService: ProductService){}

  @Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  product: Product | null = null;
  sub! : Subscription;
  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  ngOnChanges(changes: SimpleChanges): void {
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
  }
  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  addToCart(product: Product) {
  }
}
