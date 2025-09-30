import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-logo">BracketUp</h3>
            <p class="footer-description">Plateforme #1 pour vos tournois esports</p>
            <div class="footer-social">
              <a href="#" class="social-link">Discord</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">GitHub</a>
            </div>
          </div>

          <div class="footer-section">
            <h4>Plateforme</h4>
            <a routerLink="/tournaments" class="footer-link">Tournois</a>
            <a routerLink="/teams" class="footer-link">Équipes</a>
            <a routerLink="/tournaments/create" class="footer-link">Créer un tournoi</a>
          </div>

          <div class="footer-section">
            <h4>Ressources</h4>
            <a href="#" class="footer-link">Documentation</a>
            <a href="#" class="footer-link">Guide</a>
            <a href="#" class="footer-link">Support</a>
          </div>

          <div class="footer-section">
            <h4>Légal</h4>
            <a href="#" class="footer-link">Conditions d'utilisation</a>
            <a href="#" class="footer-link">Confidentialité</a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 BracketUp. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--container-color);
      border-top: 1px solid var(--border-color);
      padding: calc(var(--padding) * 3) 0 var(--padding) 0;
      margin-top: calc(var(--padding) * 4);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: calc(var(--padding) * 2);
      margin-bottom: calc(var(--padding) * 2);
    }

    .footer-section h3,
    .footer-section h4 {
      margin: 0 0 var(--padding) 0;
      color: var(--font-color);
      font-weight: 700;
    }

    .footer-logo {
      font-size: 1.75rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
    }

    .footer-description {
      color: var(--font-secondary-color);
      margin-bottom: var(--padding);
      line-height: 1.6;
    }

    .footer-social {
      display: flex;
      gap: var(--gap);
    }

    .social-link {
      padding: calc(var(--gap) / 2) var(--gap);
      background: var(--background-color);
      color: var(--font-color);
      text-decoration: none;
      border-radius: var(--inner-radius);
      font-size: 0.9rem;
      font-weight: 600;
      transition: all var(--transition-duration);
    }

    .social-link:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: calc(var(--gap) / 2);
    }

    .footer-link {
      color: var(--font-secondary-color);
      text-decoration: none;
      transition: all var(--transition-duration);
      font-size: 0.95rem;
    }

    .footer-link:hover {
      color: var(--primary-color);
      transform: translateX(5px);
    }

    .footer-bottom {
      padding-top: var(--padding);
      border-top: 1px solid var(--border-color);
      text-align: center;
      color: var(--font-secondary-color);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: calc(var(--padding) * 1.5);
      }
    }
  `]
})
export class FooterComponent {}