import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <div class="filter-group">
      <label>{{ label() }}</label>
      <p-select
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
        [options]="options()"
        [placeholder]="placeholder()"
        [filter]="filter()"
        [filterPlaceholder]="filterPlaceholder()"
        styleClass="custom-select"
        [showClear]="showClear()" />
    </div>
  `,
  styles: [`
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: calc(var(--gap) * 0.75);
    }

    .filter-group label {
      font-weight: 700;
      color: var(--font-color);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* PrimeNG Select Styling */
    ::ng-deep {
      .p-inputicon {
        top: 38%;
      }
    }

    :host ::ng-deep .custom-select.p-select {
      width: 100%;
      border-radius: 16px;
      border: 2px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    :host ::ng-deep .custom-select.p-select:hover {
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
    }

    :host ::ng-deep .custom-select.p-select.p-focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }

    :host ::ng-deep .custom-select.p-select .p-select-label {
      padding: calc(var(--gap) * 0.85) calc(var(--padding) * 1.25);
      font-weight: 600;
      color: #1a1a1a !important;
    }

    :host ::ng-deep .custom-select .p-select-label.p-placeholder {
      color: #666666 !important;
      opacity: 1;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay {
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border: 2px solid var(--border-color);
      margin-top: calc(var(--gap) / 2);
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-container {
      padding: var(--padding);
      border-bottom: 2px solid var(--border-color);
      background: #f8f9fa;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-input {
      border-radius: 12px;
      border: 2px solid var(--border-color);
      padding: calc(var(--gap) * 0.75) var(--padding);
      padding-left: calc(var(--padding) * 2.5);
      color: #1a1a1a !important;
      background: white;
      width: 100%;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay .p-select-option {
      padding: calc(var(--gap) * 0.85) calc(var(--padding) * 1.25);
      transition: all 0.2s;
      cursor: pointer;
      color: var(--font-color) !important;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay .p-select-option:hover {
      background: #f0f7ff;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .p-select-overlay .p-select-option.p-select-option-selected {
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white !important;
      font-weight: 700;
    }
  `]
})
export class FilterSelectComponent {
  label = input.required<string>();
  value = input<string>('');
  options = input.required<Array<{ label: string; value: string }>>();
  placeholder = input<string>('Sélectionner...');
  filter = input<boolean>(true);
  filterPlaceholder = input<string>('Rechercher...');
  showClear = input<boolean>(true);
  valueChange = output<string>();
}