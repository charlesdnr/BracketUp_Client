# BrackUp Client - Angular 20

Plateforme frontend de gestion de tournois esports avec intégration Discord.

## 🚀 Technologies

- **Angular 20** (Zoneless + Signals)
- **PrimeNG** (UI Components avec thème Aura personnalisé)
- **TypeScript 5.9**
- **RxJS** (Promises via firstValueFrom)
- **HttpClient** avec intercepteurs JWT

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── models/              # Interfaces TypeScript (User, Game, Team, Tournament, Match)
│   ├── services/            # Services API avec Promises + Signals
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── game.service.ts
│   │   ├── team.service.ts
│   │   ├── tournament.service.ts
│   │   └── match.service.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts      # JWT automatique
│   │   └── error.interceptor.ts     # Gestion erreurs HTTP
│   └── guards/
│       ├── auth.guard.ts
│       ├── admin.guard.ts
│       └── moderator.guard.ts
├── features/
│   ├── auth/                # Login, Callback Discord
│   ├── home/                # Landing page
│   ├── tournaments/         # CRUD tournois + brackets
│   ├── teams/               # Gestion équipes
│   ├── profile/             # Profil utilisateur
│   └── admin/               # Dashboard admin
└── shared/
    └── components/
        ├── bracket-visualizer/    # Affichage bracket
        ├── match-card/            # Card de match
        └── modal/                 # Modal réutilisable
```

## 🎨 PrimeNG & Styling

Le projet utilise PrimeNG avec le thème **Aura** et la classe **xprime** pour le styling personnalisé.

### Configuration

```typescript
// app.config.ts
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      cssLayer: 'onyx-theme, primeng'
    }
  }
})
```

### Utilisation

```html
<!-- Ajouter la classe xprime au conteneur principal -->
<div class="my-component xprime">
  <p-button label="Cliquez-moi" severity="primary" />
  <p-card>...</p-card>
</div>
```

### Variables CSS PrimeNG Disponibles

```css
var(--p-primary-color)
var(--p-surface-0)
var(--p-surface-50)
var(--p-surface-border)
var(--p-text-color)
var(--p-text-muted-color)
var(--p-border-radius)
```

## 🔐 Authentification

**Discord OAuth2** avec JWT tokens.

```typescript
// AuthService
const isAuthenticated = authService.isAuthenticated();  // computed signal
const currentUser = authService.currentUser();          // signal readonly
const isAdmin = authService.isAdmin();                  // computed signal

// Login
authService.loginWithDiscord();

// Logout
await authService.logout();
```

## 🎯 Services & Signals

Tous les services utilisent **Promises** (via `firstValueFrom`) et **Signals** pour l'état réactif.

```typescript
// Exemple TournamentService
const tournaments = tournamentService.tournaments();           // signal readonly
const activeTournaments = tournamentService.activeTournaments(); // computed
const isLoading = tournamentService.isLoading();              // signal readonly

// Récupérer les données
await tournamentService.getAllTournaments(forceRefresh);
const tournament = await tournamentService.getTournamentById(id);
```

## 🛣️ Routes

| Route | Guard | Description |
|-------|-------|-------------|
| `/` | - | Landing page |
| `/auth/login` | - | Page de connexion Discord |
| `/auth/success` | - | Callback OAuth2 |
| `/tournaments` | `authGuard` | Liste des tournois |
| `/tournaments/create` | `moderatorGuard` | Créer un tournoi |
| `/tournaments/:id` | `authGuard` | Détail tournoi + bracket |
| `/teams` | `authGuard` | Liste des équipes |
| `/teams/:id` | `authGuard` | Détail équipe |
| `/profile` | `authGuard` | Profil utilisateur |
| `/admin` | `adminGuard` | Dashboard admin |

## 🧩 Components PrimeNG Utilisés

- `p-button` - Boutons
- `p-card` - Cards
- `p-dropdown` - Dropdowns
- `p-inputtext` - Inputs texte
- `p-tag` - Tags/Badges
- `p-skeleton` - Loading skeletons
- `p-table` - Tables de données
- `p-dialog` - Modals
- `p-calendar` - Sélecteur de dates
- `p-checkbox` - Checkboxes
- `p-inputnumber` - Input numérique

## 📦 Installation

```bash
npm install
```

## 🚀 Démarrage

```bash
# Development
npm start
# Serveur: http://localhost:4200

# Build
npm run build

# Tests
npm test
```

## 🔧 Configuration

### Environnement

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Variables d'environnement serveur

Le backend doit exposer :
- `API_URL`: URL de l'API backend
- Discord OAuth2 configuré avec callback: `http://localhost:4200/auth/success`

## 🎮 Fonctionnalités Principales

### Phase 1 : Core ✅
- ✅ Authentification Discord OAuth2
- ✅ Services API (Users, Games, Teams, Tournaments)
- ✅ Guards & Interceptors
- ✅ Models & Interfaces TypeScript

### Phase 2 : Tournois ✅
- ✅ Liste tournois avec filtres
- ✅ Création/édition tournois
- ✅ Détail tournoi + participants
- ✅ Inscription tournois

### Phase 3 : Équipes ✅
- ✅ Liste équipes
- ✅ Détail équipe + membres
- ✅ Gestion membres/capitaine

### Phase 4 : Matchs & Brackets ✅
- ✅ Bracket Visualizer component
- ✅ Match Card component
- ✅ Service de gestion matchs

### Phase 5 : Admin ✅
- ✅ Dashboard admin
- ✅ Stats globales
- ✅ Gestion jeux

## 🔮 À Venir

- [ ] Génération automatique brackets (backend)
- [ ] Report de scores
- [ ] Discord Bot intégration
- [ ] Statistiques avancées
- [ ] Système de classement ELO
- [ ] Multi-langue (i18n)
- [ ] Notifications temps réel

## 📝 Notes de Développement

### Zoneless Mode
Le projet est en **zoneless** : pas de `zone.js`, utiliser les Signals pour la réactivité.

```typescript
// ✅ Bon
const count = signal(0);
count.set(count() + 1);

// ❌ Éviter
this.count = this.count + 1;  // Ne trigger pas de change detection
```

### Promises vs Observables
Tous les services retournent des **Promises** pour simplifier le code async/await.

```typescript
// ✅ Bon
const tournament = await this.tournamentService.getTournamentById(id);

// ❌ Éviter (mais possible si besoin)
this.tournamentService.getTournamentById(id).subscribe(...);
```

### PrimeNG Styling
Toujours utiliser la classe `xprime` sur les conteneurs parents pour appliquer le thème personnalisé.

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur le repo.