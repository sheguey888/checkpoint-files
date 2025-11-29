import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="card hover:shadow-xl transition-shadow">
      <div className="relative pb-[100%] overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">{product.stock} en stock</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="btn-primary text-sm"
          >
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
