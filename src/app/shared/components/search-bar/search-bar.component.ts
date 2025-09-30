import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-section">
      <div class="search-bar">
        <i class="pi pi-search search-icon"></i>
        <input
          type="text"
          [ngModel]="value()"
          (ngModelChange)="valueChange.emit($event)"
          [placeholder]="placeholder()"
          class="search-input" />
      </div>
    </div>
  `,
  styles: [`
    .search-section {
      margin: calc(var(--padding) * 3) 0;
      animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .search-bar {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-icon {
      position: absolute;
      left: calc(var(--padding) * 1.25);
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
      font-size: 1.25rem;
      pointer-events: none;
      z-index: 1;
    }

    .search-input {
      width: 100%;
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 2);
      padding-left: calc(var(--padding) * 3.5);
      border: 3px solid var(--border-color);
      border-radius: 50px;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      background: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .search-input::placeholder {
      color: #888;
      font-weight: 500;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1), 0 8px 24px rgba(0, 102, 204, 0.15);
      transform: translateY(-2px);
    }
  `]
})
export class SearchBarComponent {
  value = input<string>('');
  placeholder = input<string>('🔍 Rechercher...');
  valueChange = output<string>();
}