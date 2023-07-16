import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { SharedService } from 'src/app/services/shared.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'],
})
export class ManageProductComponent implements OnInit {
  product!: Product;
  productForm!: FormGroup;
  pricingForm!: FormGroup;
  public Editor = ClassicEditorBuild as any;
  categoryArray = ['FaceMask', 'FaceCream', 'FaceBlush'];
  prodCategory: string[] = [];
  newCategory: FormControl = new FormControl('');

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.product = this.sharedService.getProductData();
    this.productForm = this.formBuilder.group({
      productName: [this.product.productName],
      productRibbon: [this.product.productRibbon],
      productDescription: [this.product.productDescription],
    });
    this.pricingForm = this.formBuilder.group({
      productSellPrice: [this.product.productSellPrice],
      productCostPrice: [this.product.productCostPrice],
      productWeight: [this.product.productWeight],
    });
    this.prodCategory = this.product.productCategory;

    console.log('Category init -> ', this.prodCategory);
  }

  addAdditionalInfo() {
    this.product.additionalInfo.push({
      infoTag: '',
      infoDescription: '',
    });
  }

  removeCategory(category: string) {
    const index = this.prodCategory.indexOf(category);
    if (index > -1) {
      this.prodCategory.splice(index, 1);
    }
  }

  addCategory() {
    console.log('Remove category is called');

    const category = this.newCategory.value;
    if (category && !this.prodCategory.includes(category)) {
      this.prodCategory.push(category);
      this.newCategory.reset();
    }
  }

  saveProduct() {
    console.log(this.productForm.value, this.pricingForm.value);
    this.product = {
      ...this.product,
      ...this.productForm.value,
      ...this.pricingForm.value,
      additionalInfo: [...this.product.additionalInfo],
      productCategory: [...this.prodCategory],
    };
    console.log('Checking updated product');
    console.log(this.product);
  }
}
