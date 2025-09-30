import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>BracketUp</h1>
        <p>Plateforme de Gestion de Tournois</p>

        <button
          class="discord-login-btn"
          (click)="loginWithDiscord()"
          type="button">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Se connecter avec Discord
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: pulse 15s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .login-card {
      background: white;
      padding: calc(var(--padding) * 3);
      border-radius: calc(var(--radius) * 1.5);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      text-align: center;
      max-width: 450px;
      width: 100%;
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
      letter-spacing: -1px;
    }

    p {
      color: var(--font-secondary-color);
      margin-bottom: calc(var(--padding) * 2.5);
      font-size: 1.1rem;
    }

    .discord-login-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--padding);
      background: #5865F2;
      color: white;
      border: none;
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 2);
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all var(--transition-duration) ease;
      width: 100%;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(88, 101, 242, 0.4);
      position: relative;
      overflow: hidden;
    }

    .discord-login-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .discord-login-btn:hover::before {
      left: 100%;
    }

    .discord-login-btn:hover {
      background: #4752C4;
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(88, 101, 242, 0.5);
    }

    .discord-login-btn:active {
      transform: translateY(-1px);
    }

    .discord-login-btn svg {
      width: calc(var(--icons-size) * 1.25);
      height: calc(var(--icons-size) * 1.25);
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  loginWithDiscord(): void {
    this.authService.loginWithDiscord();
  }
}