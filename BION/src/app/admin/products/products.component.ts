import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'productName',
    'productSellPrice',
    'productInventoryStatus',
    'productStockCount',
  ];
  products!: MatTableDataSource<Product>;
  productsArray: Product[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.adminService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.productsArray = data; // Save the product data to the array
        this.products = new MatTableDataSource(data);
        this.products.sort = this.sort;
      },
      (error) => {
        console.error('Failed to fetch products: ', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.trim().toLowerCase();
  }

  manageProduct(productName: string) {
    // Find the product with the given productName
    let product = this.productsArray.find(
      (product) => product.productName === productName
    );

    if (product) {
      this.sharedService.setProductData(product);

      // Navigate to the manageProduct component and pass the product data
      this.router.navigate(['/admin/manageProduct']);
    } else {
      console.error('Product not found: ', productName);
    }
  }
}
