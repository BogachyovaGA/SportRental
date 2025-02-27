import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGetProductById } from '../../services/mock/mockProductService';
import { mockAddToCart } from '../../services/mock/mockCartService';
import './ProductPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [rentDays, setRentDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('ID товара не указан');
      const data = await mockGetProductById(Number(id));
      setProduct(data);
    } catch (error) {
      setError('Ошибка при загрузке товара');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product) return;
      await mockAddToCart(product.id, rentDays);
      navigate('/cart');
    } catch (error) {
      setError('Ошибка при добавлении в корзину');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!product) return <div>Товар не найден</div>;

  return (
    <div className="product-details">
      <div className="product-images">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">{product.price} ₽/день</p>
        
        <div className="availability">
          <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
            {product.available ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>

        {product.available && (
          <div className="rent-calculator">
            <label>
              Количество дней:
              <input 
                type="number" 
                min="1" 
                value={rentDays}
                onChange={(e) => setRentDays(Number(e.target.value))}
              />
            </label>
            <p className="total">Итого: {product.price * rentDays} ₽</p>
            <button 
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </button>
          </div>
        )}
        
        <div className="description">
          <h2>Описание</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 