import { Injectable } from '@angular/core';

import { Product } from '../models/product.model'; // replace with your actual path

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private productData!: Product;

  setProductData(data: Product): void {
    this.productData = data;
  }

  getProductData(): Product {
    return this.productData;
  }
}
