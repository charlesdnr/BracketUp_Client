import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, TournamentService } from '../../../../core/services';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="logo">BrackUp</div>
          <nav class="nav">
            @if (authService.isAuthenticated()) {
              <a routerLink="/tournaments">Tournois</a>
              <a routerLink="/teams">Équipes</a>
              <a routerLink="/profile">Profil</a>
              <button (click)="logout()" class="btn-secondary">Déconnexion</button>
            } @else {
              <a routerLink="/auth/login" class="btn-primary">Connexion</a>
            }
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1>Organisez et Participez aux Meilleurs Tournois Gaming</h1>
          <p>La plateforme complète pour gérer vos tournois esports avec intégration Discord</p>
          <div class="cta-buttons">
            @if (authService.isAuthenticated()) {
              <a routerLink="/tournaments" class="btn-primary">Voir les tournois</a>
            } @else {
              <a routerLink="/auth/login" class="btn-primary">Commencer</a>
            }
            <a routerLink="/about" class="btn-secondary">En savoir plus</a>
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
          <h2>Fonctionnalités</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3>🏆 Gestion de Tournois</h3>
              <p>Créez et gérez facilement vos tournois avec génération automatique de brackets</p>
            </div>
            <div class="feature-card">
              <h3>👥 Équipes</h3>
              <p>Créez votre équipe, recrutez des joueurs et participez ensemble</p>
            </div>
            <div class="feature-card">
              <h3>💬 Intégration Discord</h3>
              <p>Authentification et notifications automatiques sur Discord</p>
            </div>
            <div class="feature-card">
              <h3>📊 Statistiques</h3>
              <p>Suivez vos performances et votre classement</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header {
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav a {
      text-decoration: none;
      color: #333;
      transition: color 0.3s;
    }

    .nav a:hover {
      color: #667eea;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6rem 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    .tournaments-section, .features {
      padding: 4rem 0;
    }

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .tournaments-grid, .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .tournament-card, .feature-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s;
    }

    .tournament-card:hover {
      transform: translateY(-5px);
    }

    .tournament-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .tournament-info {
      padding: 1.5rem;
    }

    .tournament-info h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .tournament-meta {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
      color: #666;
    }

    .feature-card {
      padding: 2rem;
      text-align: center;
    }

    .feature-card h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
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

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}