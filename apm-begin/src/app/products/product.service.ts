import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private productsUrl = 'api/productss';

    constructor(private http: HttpClient,
      private errorService: HttpErrorService
    ) {}

    getProducts() : Observable<Product[]>{
      return this.http.get<Product[]> (this.productsUrl)
      .pipe(
        tap(() => console.log('http.get pip line.')),
       catchError(err => this.handleError(err))
       // {
       // console.error(err);
        //return of(ProductData.products);
       //})
      );
    }

    getProduct(id: number): Observable<Product> {
      const productURL = this.productsUrl + '/' + id;
      return this.http.get<Product>(productURL)
      .pipe(
        tap(() => console.log('http.get by ID.')),
        catchError(err => this.handleError(err))
      );
    }

    private handleError(err : HttpErrorResponse) : Observable<never> {
      const formattedMessage = this.errorService.formatError(err);
      return throwError(() => formattedMessage);
      //throw formattedMessage;
    }

}

