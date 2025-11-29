import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images || [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Retour aux produits
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-primary-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <span className="text-yellow-400 text-xl mr-1">★</span>
                  <span className="text-lg font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="ml-4 text-gray-600">
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-primary-600 mr-4">
                    ${product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discountPercentage > 0 && (
                  <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-md mt-2">
                    Économisez {Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-32">Marque:</span>
                  <span>{product.brand || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-32">SKU:</span>
                  <span>{product.sku || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-32">Garantie:</span>
                  <span>{product.warrantyInformation || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-32">Livraison:</span>
                  <span>{product.shippingInformation || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">{review.reviewerName}</span>
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{review.rating}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
