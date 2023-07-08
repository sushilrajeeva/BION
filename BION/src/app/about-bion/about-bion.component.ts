import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-about-bion',
  templateUrl: './about-bion.component.html',
  styleUrls: ['./about-bion.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AboutBionComponent {
  expandedItem: string | null = null;

  expandItem(item: string): void {
    this.expandedItem = this.expandedItem === item ? null : item;
  }
}
