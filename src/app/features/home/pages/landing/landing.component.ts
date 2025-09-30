import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, TournamentService } from '../../../../core/services';
import { HeaderComponent, FooterComponent } from '../../../../shared/components';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <div class="landing-page">
      <app-header></app-header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <div class="hero-badge">🏆 Plateforme #1 pour vos Tournois Esports</div>
          <h1 class="hero-title">
            Organisez des Tournois
            <span class="gradient-text">Épiques</span>
          </h1>
          <p class="hero-subtitle">Créez, gérez et participez à des compétitions gaming professionnelles avec intégration Discord complète et brackets automatiques</p>
          <div class="cta-buttons">
            @if (authService.isAuthenticated()) {
              <a routerLink="/tournaments" class="btn-primary-hero">
                <span>Voir les Tournois</span>
                <span class="arrow">→</span>
              </a>
            } @else {
              <a routerLink="/auth/login" class="btn-primary-hero">
                <span>Commencer Gratuitement</span>
                <span class="arrow">→</span>
              </a>
            }
            <a routerLink="/tournaments" class="btn-secondary-hero">Découvrir</a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Tournois Créés</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Joueurs Actifs</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">Jeux Supportés</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Tournaments -->
      @if (activeTournaments().length > 0) {
        <section class="tournaments-section">
          <div class="container">
            <h2>Tournois Actifs</h2>
            <div class="tournaments-grid">
              @for (tournament of activeTournaments(); track tournament.id) {
                <div class="tournament-card">
                  @if (tournament.bannerUrl) {
                    <img [src]="tournament.bannerUrl" [alt]="tournament.name" />
                  }
                  <div class="tournament-info">
                    <h3>{{ tournament.name }}</h3>
                    <p>{{ tournament.game?.name }}</p>
                    <div class="tournament-meta">
                      <span>{{ tournament.format }}</span>
                      <span>{{ tournament._count?.participants || 0 }}/{{ tournament.maxParticipants }}</span>
                    </div>
                    <a [routerLink]="['/tournaments', tournament.id]" class="btn-primary">Voir</a>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Features -->
      <section class="features">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Fonctionnalités</span>
            <h2>Tout ce dont vous avez besoin pour vos tournois</h2>
            <p class="section-subtitle">Une plateforme complète et moderne pour organiser des compétitions professionnelles</p>
          </div>
          <div class="features-grid">
            <div class="feature-card feature-highlight">
              <div class="feature-icon">🏆</div>
              <h3>Gestion de Tournois</h3>
              <p>Créez et gérez facilement vos tournois avec génération automatique de brackets. Formats single/double élimination, round robin et swiss supportés.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Système d'Équipes</h3>
              <p>Créez votre équipe, recrutez des joueurs et participez ensemble aux tournois en ligne et hors ligne.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>Intégration Discord</h3>
              <p>Authentification simplifiée et notifications automatiques sur Discord pour ne rien manquer.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Statistiques Avancées</h3>
              <p>Suivez vos performances, votre classement et analysez vos résultats en temps réel.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Brackets Automatiques</h3>
              <p>Génération instantanée des arbres de tournoi avec mise à jour en temps réel des matchs.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎮</div>
              <h3>Multi-Jeux</h3>
              <p>Supportez tous vos jeux favoris avec une configuration personnalisée pour chaque titre.</p>
              <div class="feature-link">En savoir plus →</div>
            </div>
          </div>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: var(--background-color);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    .hero {
      position: relative;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white;
      padding: calc(var(--padding) * 10) 0 calc(var(--padding) * 6) 0;
      text-align: center;
      overflow: hidden;
      margin-top: 0;
    }

    .hero::before {
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

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.03) 70%, transparent 70%),
        linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.03) 70%, transparent 70%);
      background-size: 100px 100px;
      opacity: 0.5;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-block;
      padding: calc(var(--gap) / 2) var(--padding);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 100px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: var(--padding);
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: slideDown 0.8s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-title {
      font-size: 4.5rem;
      margin-bottom: var(--padding);
      color: white;
      font-weight: 800;
      line-height: 1.1;
      animation: slideUp 0.8s ease-out 0.2s backwards;
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

    .gradient-text {
      background: linear-gradient(to right, #ffffff, #e0f0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
      animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .hero-subtitle {
      font-size: 1.35rem;
      margin-bottom: calc(var(--padding) * 2.5);
      color: white;
      opacity: 0.95;
      max-width: 750px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
      animation: slideUp 0.8s ease-out 0.4s backwards;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: calc(var(--padding) * 2);
      margin-top: calc(var(--padding) * 3);
      animation: slideUp 0.8s ease-out 0.8s backwards;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: calc(var(--gap) / 2);
    }

    .stat-label {
      font-size: 0.9rem;
      color: white;
      opacity: 0.85;
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 50px;
      background: rgba(255, 255, 255, 0.3);
    }

    .cta-buttons {
      display: flex;
      gap: var(--padding);
      justify-content: center;
      flex-wrap: wrap;
      animation: slideUp 0.8s ease-out 0.6s backwards;
    }

    .btn-primary-hero, .btn-secondary-hero {
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 2.5);
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      transition: all var(--transition-duration);
      border: none;
      cursor: pointer;
      font-size: 1.125rem;
      display: inline-flex;
      align-items: center;
      gap: var(--gap);
    }

    .btn-primary-hero {
      background: white;
      color: var(--primary-color);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .btn-primary-hero:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }

    .btn-primary-hero .arrow {
      font-size: 1.5rem;
      transition: transform var(--transition-duration);
    }

    .btn-primary-hero:hover .arrow {
      transform: translateX(5px);
    }

    .btn-secondary-hero {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 2px solid white;
      backdrop-filter: blur(10px);
    }

    .btn-secondary-hero:hover {
      background: white;
      color: var(--primary-color);
      transform: translateY(-3px);
    }

    .btn-primary, .btn-secondary {
      padding: var(--padding) calc(var(--padding) * 2.5);
      border-radius: var(--inner-radius);
      text-decoration: none;
      font-weight: 600;
      transition: all var(--transition-duration);
      border: none;
      cursor: pointer;
      font-size: 1.125rem;
      display: inline-block;
    }

    .btn-primary {
      background: white;
      color: var(--primary-color);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: var(--primary-color);
      transform: translateY(-3px);
    }

    .tournaments-section {
      padding: calc(var(--padding) * 4) 0;
      background: var(--background-color);
    }

    .features {
      padding: calc(var(--padding) * 5) 0;
      background: var(--container-color);
    }

    .section-header {
      text-align: center;
      margin-bottom: calc(var(--padding) * 3);
    }

    .section-badge {
      display: inline-block;
      padding: calc(var(--gap) / 2) var(--padding);
      background: var(--primary-color);
      color: white;
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--padding);
    }

    .section-header h2 {
      font-size: 3rem;
      margin-bottom: var(--padding);
      color: var(--font-color);
      font-weight: 800;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--font-secondary-color);
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: calc(var(--padding) * 2.5);
      color: var(--font-color);
      font-weight: 700;
    }

    .tournaments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: calc(var(--padding) * 1.5);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: calc(var(--padding) * 1.5);
    }

    .tournament-card {
      background: var(--container-color);
      border-radius: var(--radius);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      transition: all var(--transition-duration);
      border: 2px solid var(--border-color);
      cursor: pointer;
    }

    .tournament-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
      border-color: var(--primary-color);
    }

    .tournament-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .tournament-info {
      padding: var(--padding);
    }

    .tournament-info h3 {
      margin-bottom: var(--gap);
      color: var(--font-color);
      font-size: 1.5rem;
      font-weight: 600;
    }

    .tournament-info p {
      color: var(--font-secondary-color);
      margin-bottom: var(--padding);
      font-size: 1rem;
    }

    .tournament-meta {
      display: flex;
      gap: var(--padding);
      margin-bottom: var(--padding);
      color: var(--font-secondary-color);
      font-size: 0.9rem;
    }

    .tournament-meta span {
      display: flex;
      align-items: center;
      gap: calc(var(--gap) / 2);
    }

    .tournament-info .btn-primary {
      background: var(--primary-color);
      color: white;
      padding: calc(var(--gap) * 0.75) var(--padding);
      display: inline-block;
      width: 100%;
      text-align: center;
      font-size: 1rem;
    }

    .tournament-info .btn-primary:hover {
      opacity: 0.9;
    }

    .feature-card {
      background: var(--background-color);
      padding: calc(var(--padding) * 2.5);
      border-radius: var(--radius);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: left;
      transition: all var(--transition-duration);
      border: 2px solid transparent;
      position: relative;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary-color);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      background: var(--container-color);
    }

    .feature-highlight {
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white;
      border-color: transparent;
    }

    .feature-highlight:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 16px 40px rgba(0, 102, 204, 0.3);
    }

    .feature-highlight h3,
    .feature-highlight p,
    .feature-highlight .feature-link {
      color: white;
    }

    .feature-icon {
      font-size: 3.5rem;
      margin-bottom: var(--padding);
      display: block;
      line-height: 1;
    }

    .feature-card h3 {
      margin-bottom: var(--padding);
      color: var(--font-color);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .feature-card p {
      color: var(--font-secondary-color);
      line-height: 1.7;
      font-size: 1rem;
      margin-bottom: var(--padding);
    }

    .feature-link {
      color: var(--primary-color);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all var(--transition-duration);
      display: inline-block;
    }

    .feature-link:hover {
      transform: translateX(5px);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.15rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: var(--padding);
      }

      .stat-divider {
        width: 100px;
        height: 1px;
      }

      .btn-primary-hero, .btn-secondary-hero {
        width: 100%;
        justify-content: center;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .tournaments-grid, .features-grid {
        grid-template-columns: 1fr;
      }

      .feature-card {
        text-align: center;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly tournamentService = inject(TournamentService);

  protected readonly activeTournaments = signal<any[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      await this.tournamentService.getAllTournaments(true);
      this.activeTournaments.set(this.tournamentService.activeTournaments());
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  }
}