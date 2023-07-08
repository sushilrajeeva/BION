import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  products = [
    {
      name: 'Product 1',
      description: 'This is product 1',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Product 2',
      description: 'This is product 2',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Product 3',
      description: 'This is product 3',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Product 4',
      description: 'This is product 4',
      image: 'https://via.placeholder.com/150',
    },
    // Add more products as needed
  ];

  constructor() {}

  ngOnInit(): void {}
}
