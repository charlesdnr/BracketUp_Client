import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick()">
        <div class="modal-container" (click)="$event.stopPropagation()" [style.width]="width()">
          <!-- Header -->
          <div class="modal-header">
            <h2>{{ title() }}</h2>
            @if (closable()) {
              <button class="close-btn" (click)="close()">✕</button>
            }
          </div>

          <!-- Body -->
          <div class="modal-body">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter()) {
            <div class="modal-footer">
              <ng-content select="[footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 0.75rem;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #333;
    }

    .modal-body {
      padding: 2rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class ModalComponent {
  // Inputs
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');
  readonly width = input<string>('600px');
  readonly closable = input<boolean>(true);
  readonly closeOnOverlayClick = input<boolean>(true);
  readonly showFooter = input<boolean>(true);

  // Outputs
  readonly closeModal = output<void>();

  constructor() {
    // Lock body scroll when modal is open
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  protected close(): void {
    if (this.closable()) {
      this.closeModal.emit();
    }
  }

  protected onOverlayClick(): void {
    if (this.closeOnOverlayClick()) {
      this.close();
    }
  }
}