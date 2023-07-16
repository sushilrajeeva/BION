import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;
  showForm = false;
  categories = [
    'Face wash',
    'Face Mist/ Toner',
    'Face Serum',
    'Gel/Moisturizer',
    'Lip Scrub',
    'Lip Shield',
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productRibbon: ['', Validators.required],
      productDescription: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],
      additionalInfo: this.formBuilder.array([]),
      pricing: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  openProductForm() {
    this.showForm = true;
  }

  closeProductForm() {
    this.showForm = false;
  }

  onSubmit() {
    console.log(this.productForm.value);
    this.productForm.reset();
    this.showForm = false;
  }

  get additionalInfo() {
    return this.productForm.get('additionalInfo') as FormArray;
  }

  addAdditionalInfo() {
    const infoGroup = this.formBuilder.group({
      infoHeading: ['', Validators.required],
      information: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.additionalInfo.push(infoGroup);
  }

  removeAdditionalInfo(index: number) {
    this.additionalInfo.removeAt(index);
  }
}
