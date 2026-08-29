import { Component, OnInit } from '@angular/core';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-products',
  imports: [ButtonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  constructor() { }

  ngOnInit(): void {

  }

  openCreateModel() {

  }
  
}
