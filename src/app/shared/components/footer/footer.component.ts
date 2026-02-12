import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [
    trigger('slideFade', [
      state('hidden', style({ opacity: 0, transform: 'translateY(100%)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden <=> visible', animate('400ms ease-in-out')),
    ]),
  ],
})
export class FooterComponent {
  isVisible = false;
  date: number = new Date().getFullYear();
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    this.isVisible = scrollPosition >= pageHeight - 10; // show near bottom
  }
}
