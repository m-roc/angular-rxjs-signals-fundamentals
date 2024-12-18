import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, empty, filter, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { map } from 'rxjs';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import {toObservable, toSignal } from '@angular/core/rxjs-interop';
import { computeMsgId } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private productsUrl = 'api/products';

    constructor(private http: HttpClient,
      private errorService: HttpErrorService,
      private reviewService: ReviewService
    ) {}

//private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
//readonly productSelected$ = this.productSelectedSubject.asObservable();
selectedProductId = signal<number | undefined>(undefined);

//readonly products$ = this.http.get<Product[]> (this.productsUrl)
private productsResult$ = this.http.get<Product[]> (this.productsUrl)
.pipe(
  map(p => ({data: p, error: undefined} as Result<Product[]>)),
  tap(() => console.log('http.get pip line.')),
  shareReplay(1),
  catchError(err => 
    of({data: [], 
      error: this.errorService.formatError(err) 
    } as Result<Product[]>))
 //catchError(err => this.handleError(err))
);

private productsResult = toSignal(this.productsResult$, 
  {initialValue: ({data: [], error: undefined} as Result<Product[]>)} );

products = computed(() => this.productsResult().data);
productsError = computed(() => this.productsResult().error);

/*products = computed(() => {
try {
  return toSignal(this.products$, {initialValue: [] as Product[]})();
} catch (error) {
  return [] as Product[];
}
});*/


    /*getProducts() : Observable<Product[]>{
      return this.http.get<Product[]> (this.productsUrl)
      .pipe(
        tap(() => console.log('http.get pip line.')),
       catchError(err => this.handleError(err))
       // {
       // console.error(err);
        //return of(ProductData.products);
       //})
      );
    }*/


    /*getProduct(id: number): Observable<Product> {
      const productURL = this.productsUrl + '/' + id;
      return this.http.get<Product>(productURL)
      .pipe(
        tap(() => console.log('http.get by ID.')),
        switchMap(product => this.getProductWithReviews(product)),
        tap(x => console.log(x)),
        catchError(err => this.handleError(err))
      );
    }*/

    productSelected (selectedProductId: number)  : void{
      //this.productSelectedSubject.next(selectedProductId);
      this.selectedProductId.set(selectedProductId);
    }

    //readonly  product$ = this.productSelected$    //1$
readonly  product$ = toObservable(this.selectedProductId)
   .pipe(
    filter(Boolean),
    switchMap(id => {
      const productURL = this.productsUrl + '/' + id;
      return this.http.get<Product>(productURL)
      .pipe(
        tap(() => console.log('http.get by ID.')),
        switchMap(product => this.getProductWithReviews(product)),
        tap(x => console.log(x)),
        catchError(err => this.handleError(err))
      );
    })
   );
   
   /*product$ = combineLatest([
    this.productSelected$, 
    this.products$
   ]).pipe(
    tap(x => x),
    map(([selectedProductId, products]) =>
      products.find(product => product.id === selectedProductId)
   ),
   filter(Boolean),
   switchMap(product => this.getProductWithReviews(product)),
        tap(x => console.log(x)),
        catchError(err => this.handleError(err))
  );*/
    
private getProductWithReviews(product: Product): Observable<Product>{
  if(product.hasReviews){
    return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
    .pipe(
      map(reviews => ({...product, reviews} as Product))
    )
  }
  else{
    return of(product)
  }
}

    private handleError(err : HttpErrorResponse) : Observable<never> {
      const formattedMessage = this.errorService.formatError(err);
      return throwError(() => formattedMessage);
      //throw formattedMessage;
    }

}

