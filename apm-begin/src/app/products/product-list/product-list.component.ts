import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, empty, Subscription, tap, throwError } from 'rxjs';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';


@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent  {
  //export class ProductListComponent implements OnInit, OnDestroy {

constructor(private productService : ProductService){}

  pageTitle = 'Products';
  
  //sub!: Subscription;

  // Products
  //products: Product[] = [];


products = this.productService.products;
errorMessage = this.productService.productsError;

//readonly products$ = this.productService.products$ //getProducts()
//.pipe(
//  tap(() => console.log('product list pipe line.')) ,
//catchError(err => {
   //this.errorMessage = err;
   ////return empty;
   //throw(this.errorMessage);
  //}) 
//);

  // Selected product id to highlight the entry
  //selectedProductId: number = 0;
  //readonly selectedProductId$ = this.productService.productSelected$;
   selectedProductId = this.productService.selectedProductId;

  /*ngOnInit() : void{
    this.sub = this.productService.products$ //getProducts()
    .pipe(
      tap(() => console.log('product list pipe line.')) ,
    catchError(err => {
       this.errorMessage = err;
       //return empty;
       throw(this.errorMessage);
      }) 
    ).subscribe({
      next :  products => {
      this.products = products;
      console.log(this.products);
      }//,
      //error : err => this.errorMessage = err
    });
  }
  ngOnDestroy() : void{
    this.sub.unsubscribe();
  }*/
  
  onSelected(productId: number): void {
    //this.selectedProductId = productId;
    this.productService.productSelected(productId);
  }
}
