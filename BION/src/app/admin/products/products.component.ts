import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/services/admin.service';

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
  products!: MatTableDataSource<any>;
  public productsArray: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllProducts().subscribe(
      (data: any[]) => {
        this.productsArray = [...data]; // Save the product data to the array
        this.products = new MatTableDataSource(data);
        this.products.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.trim().toLowerCase();
  }

  logProductName(productName: string) {
    const product = this.productsArray.find(
      (prod) => prod.productName === productName
    );
    console.log(product);
  }
}
