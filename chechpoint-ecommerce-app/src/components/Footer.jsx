const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400">
              Votre destination pour des produits de qualité à des prix imbattables.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Produits
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Panier
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@shophub.com</li>
              <li>Téléphone: +33 1 23 45 67 89</li>
              <li>Adresse: 123 Rue du Commerce, Paris</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopHub. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
