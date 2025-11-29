# E-Commerce App - ShopHub

Application e-commerce moderne développée avec React, Tailwind CSS et React Router.

## 🚀 Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Navigation entre pages
- **DummyJSON API** - Source de données pour les produits

## 📁 Structure du projet

```
ecommerce-app/
├── public/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/            # Pages de l'application
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   └── Cart.jsx
│   ├── context/          # Context API
│   │   └── CartContext.jsx
│   ├── hooks/            # Custom hooks
│   │   ├── useProducts.js
│   │   └── useProduct.js
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## ✨ Fonctionnalités

### Pages principales

1. **Home (Accueil)**
   - Hero section avec call-to-action
   - Section "Pourquoi choisir ShopHub" avec 3 avantages
   - Affichage des 6 produits populaires
   - Navigation vers la page produits

2. **Products (Catalogue)**
   - Affichage des 20 premiers produits de l'API
   - Grille responsive (4 colonnes sur desktop)
   - Cartes produits avec image, titre, description, prix et note
   - Ajout rapide au panier
   - Navigation vers les détails produit

3. **Product Details**
   - Galerie d'images avec sélection
   - Informations détaillées (description, prix, stock, marque, etc.)
   - Système de notation et avis clients
   - Bouton d'ajout au panier avec feedback visuel
   - Navigation de retour vers la liste

4. **Cart (Panier)**
   - Liste complète des produits ajoutés
   - Gestion des quantités (+/-)
   - Suppression d'articles
   - Calcul du total en temps réel
   - Persistance avec localStorage
   - Bouton "Vider le panier"
   - Récapitulatif de commande

### Fonctionnalités du panier

- ✅ Ajout de produits depuis Products ou ProductDetails
- ✅ Modification des quantités
- ✅ Suppression d'articles
- ✅ Calcul automatique du total
- ✅ Persistance avec localStorage (données sauvegardées entre sessions)
- ✅ Badge de compteur dans la navbar
- ✅ Gestion d'état avec Context API

### Navigation

- Navbar sticky avec logo et 3 liens
- Badge de panier avec compteur d'articles
- Footer complet avec liens et informations de contact
- Routes React Router pour navigation entre pages

## 🎨 Design

- Interface moderne et professionnelle
- Palette de couleurs personnalisée (bleu primary)
- Composants réutilisables avec Tailwind CSS
- Responsive design (mobile, tablette, desktop)
- Animations et transitions fluides
- États de chargement et messages d'erreur

## 🛠️ Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📦 Dépendances principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "tailwindcss": "^3.3.6"
}
```

## 🌐 API utilisée

- **DummyJSON**: https://dummyjson.com/products
- Limite: 20 produits
- Données: Titre, description, prix, images, note, stock, etc.

## 📝 Notes

- Pas de tests inclus (comme demandé)
- Pas de configuration Vercel (comme demandé)
- Code propre et organisé de manière professionnelle
- Commentaires en français
- Architecture évolutive et maintenable

## 👤 Auteur

Développé avec ❤️ par un développeur full-stack expert
