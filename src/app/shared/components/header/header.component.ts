import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="container">
        <a routerLink="/" class="logo">BracketUp</a>
        <nav class="nav">
          @if (authService.isAuthenticated()) {
            <a routerLink="/tournaments">Tournois</a>
            <a routerLink="/teams">Équipes</a>
            <a routerLink="/profile">Profil</a>
            <button (click)="logout()" class="btn-header">Déconnexion</button>
          } @else {
            <a routerLink="/auth/login" class="btn-header">Connexion</a>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: transparent;
      padding: calc(var(--padding) * 1.5) 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 calc(var(--padding) * 2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 2rem;
      font-weight: 900;
      color: white;
      letter-spacing: -1px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      position: relative;
      text-shadow:
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 4px 8px rgba(0, 0, 0, 0.2),
        0 0 20px rgba(255, 255, 255, 0.3);
      filter: drop-shadow(0 0 10px rgba(0, 102, 204, 0.5));
    }

    .logo::before {
      content: '🏆';
      position: absolute;
      left: -35px;
      font-size: 1.5rem;
      animation: bounce 2s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .logo:hover {
      transform: scale(1.05);
      text-shadow:
        0 4px 8px rgba(0, 0, 0, 0.4),
        0 8px 16px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(255, 255, 255, 0.5);
      filter: drop-shadow(0 0 20px rgba(0, 102, 204, 0.8));
    }

    .nav {
      display: flex;
      gap: calc(var(--gap) / 2);
      align-items: center;
    }

    .nav a {
      text-decoration: none;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 700;
      font-size: 0.95rem;
      position: relative;
      padding: calc(var(--gap) * 0.75) calc(var(--padding) * 1.25);
      border-radius: 50px;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(10px);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .nav a:not(.btn-header):hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .btn-header {
      padding: calc(var(--gap) * 0.85) calc(var(--padding) * 2);
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      text-decoration: none;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 0.95rem;
      box-shadow:
        0 8px 20px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 255, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    .btn-header::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn-header:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn-header:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.6);
      transform: translateY(-3px);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .btn-header:active {
      transform: translateY(-1px);
      box-shadow:
        0 6px 16px rgba(0, 0, 0, 0.3),
        0 0 15px rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 var(--padding);
      }

      .logo {
        font-size: 1.5rem;
      }

      .logo::before {
        left: -28px;
        font-size: 1.2rem;
      }

      .nav {
        gap: calc(var(--gap) / 4);
      }

      .nav a:not(.btn-header) {
        display: none;
      }

      .btn-header {
        padding: calc(var(--gap) * 0.7) calc(var(--padding) * 1.5);
        font-size: 0.875rem;
      }
    }
  `]
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}