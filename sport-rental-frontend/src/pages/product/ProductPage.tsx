import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockGetProductById, mockGetProducts } from '../../services/mock/mockProductService';
import { mockAddToCart } from '../../services/mock/mockCartService';
import './ProductPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  available: boolean;
}

interface ProductDetail extends Product {
  characteristics?: {
    [key: string]: string;
  };
  additionalImages?: string[];
  brand?: string;
  weight?: string;
  size?: string;
  material?: string;
  warranty?: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [rentDays, setRentDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Иван Петров',
      rating: 5,
      date: '15.03.2024',
      text: 'Отличный товар! Буду арендовать еще раз.'
    },
    {
      id: 2,
      author: 'Анна Сидорова',
      rating: 4,
      date: '10.03.2024',
      text: 'Качество хорошее, но есть небольшие нюансы по размеру.'
    }
  ]);
  const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      loadSimilarProducts(product.categoryId);
    }
  }, [product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('ID товара не указан');
      const data = await mockGetProductById(Number(id));
      
      // Добавление дополнительных данных к продукту (в реальном приложении пришли бы с сервера)
      const enhancedProduct: ProductDetail = {
        ...data,
        brand: 'SportTech',
        weight: '2.5 кг',
        size: 'Универсальный',
        material: 'Высокопрочный пластик, металл',
        warranty: '6 месяцев',
        characteristics: {
          'Бренд': 'SportTech',
          'Вес': '2.5 кг',
          'Размер': 'Универсальный',
          'Материал': 'Высокопрочный пластик, металл',
          'Гарантия': '6 месяцев',
          'Страна производства': 'Россия'
        },
        additionalImages: [
          data.image,
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60',
          'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60'
        ]
      };
      
      setProduct(enhancedProduct);
    } catch (error) {
      setError('Ошибка при загрузке товара');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async (categoryId: number) => {
    try {
      const data = await mockGetProducts({ categoryId });
      // Исключаем текущий продукт из списка похожих
      const filtered = data.filter(item => item.id !== Number(id)).slice(0, 4);
      setSimilarProducts(filtered);
    } catch (error) {
      console.error('Ошибка при загрузке похожих товаров:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product) return;
      
      // Добавляем продукт в корзину без проверки авторизации
      await mockAddToCart(product.id, rentDays);
      setAddedToCart(true);
      
      // Скрываем уведомление через 3 секунды
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      setError('Ошибка при добавлении в корзину');
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    return product.price * rentDays;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) return (
    <div className="product-loading">
      <div className="spinner"></div>
      <p>Загрузка товара...</p>
    </div>
  );
  
  if (error) return (
    <div className="product-error">
      <p>Ошибка: {error}</p>
      <button onClick={() => window.location.reload()}>Попробовать снова</button>
    </div>
  );
  
  if (!product) return (
    <div className="product-not-found">
      <h2>Товар не найден</h2>
      <p>К сожалению, запрашиваемый товар не существует или был удален.</p>
      <Link to="/catalog" className="back-to-catalog">Вернуться в каталог</Link>
    </div>
  );

  return (
    <div className="product-page">
      <div className="breadcrumbs">
        <Link to="/">Главная</Link> / 
        <Link to="/catalog">Каталог</Link> / 
        <span>{product.name}</span>
      </div>

      <div className="product-details">
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={product.additionalImages?.[currentImageIndex] || product.image} 
              alt={product.name} 
            />
            <span className={`availability-badge ${product.available ? 'available' : 'unavailable'}`}>
              {product.available ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>
          
          {product.additionalImages && product.additionalImages.length > 1 && (
            <div className="thumbnail-images">
              {product.additionalImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={img} alt={`${product.name} - изображение ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= getAverageRating() ? 'filled' : ''}>★</span>
              ))}
            </div>
            <span className="review-count">{reviews.length} отзывов</span>
          </div>
          
          <div className="product-price-section">
            <p className="price">{product.price} ₽/день</p>
            <p className="price-note">*Цена указана за 1 день аренды</p>
          </div>
          
          {product.available ? (
            <div className="rent-calculator">
              <div className="rent-days">
                <label htmlFor="rentDays">Количество дней:</label>
                <div className="days-input">
                  <button 
                    onClick={() => setRentDays(prev => Math.max(1, prev - 1))}
                    className="days-btn"
                  >-</button>
                  <input 
                    id="rentDays"
                    type="number" 
                    min="1" 
                    value={rentDays}
                    onChange={(e) => setRentDays(Number(e.target.value) || 1)}
                  />
                  <button 
                    onClick={() => setRentDays(prev => prev + 1)}
                    className="days-btn"
                  >+</button>
                </div>
              </div>
              
              <div className="total-calculation">
                <div className="calc-row">
                  <span>Стоимость за день:</span>
                  <span>{product.price} ₽</span>
                </div>
                <div className="calc-row">
                  <span>Количество дней:</span>
                  <span>{rentDays}</span>
                </div>
                <div className="calc-row total">
                  <span>Итого:</span>
                  <span>{calculateTotalPrice()} ₽</span>
                </div>
              </div>
              
              <div className="total-price">
                <span>Итого: {calculateTotalPrice()} ₽</span>
                <span className="price-note">за {rentDays} {rentDays === 1 ? 'день' : rentDays < 5 ? 'дня' : 'дней'}</span>
              </div>
              
              <div className="cart-actions">
                {!addedToCart ? (
                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                  >
                    Добавить в корзину
                  </button>
                ) : (
                  <div className="added-to-cart">
                    <div className="success-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
                      </svg>
                      <span>Товар добавлен в корзину</span>
                    </div>
                    <button 
                      className="go-to-cart-btn"
                      onClick={handleGoToCart}
                    >
                      Перейти в корзину
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="not-available-notice">
              <p>К сожалению, товар в данный момент недоступен для аренды.</p>
              <p>Вы можете проверить наличие похожих товаров или вернуться позже.</p>
            </div>
          )}
          
          <div className="product-quick-info">
            {product.brand && (
              <div className="info-item">
                <span className="info-label">Бренд:</span>
                <span className="info-value">{product.brand}</span>
              </div>
            )}
            {product.weight && (
              <div className="info-item">
                <span className="info-label">Вес:</span>
                <span className="info-value">{product.weight}</span>
              </div>
            )}
            {product.size && (
              <div className="info-item">
                <span className="info-label">Размер:</span>
                <span className="info-value">{product.size}</span>
              </div>
            )}
            {product.material && (
              <div className="info-item">
                <span className="info-label">Материал:</span>
                <span className="info-value">{product.material}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button 
            className={`tab-button ${activeTab === 'characteristics' ? 'active' : ''}`}
            onClick={() => setActiveTab('characteristics')}
          >
            Характеристики
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Отзывы ({reviews.length})
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
              <p>
                При аренде спортивного инвентаря вы получаете полностью настроенное оборудование,
                готовое к использованию. Наши специалисты проверяют каждый товар перед выдачей,
                чтобы гарантировать его исправность и безопасность.
              </p>
              <p>
                Если у вас возникнут вопросы по эксплуатации, наши консультанты всегда готовы помочь.
                Мы также предоставляем инструкции по использованию и хранению оборудования.
              </p>
            </div>
          )}
          
          {activeTab === 'characteristics' && (
            <div className="characteristics-tab">
              <table className="characteristics-table">
                <tbody>
                  {product.characteristics && Object.entries(product.characteristics).map(([key, value]) => (
                    <tr key={key}>
                      <td className="char-name">{key}</td>
                      <td className="char-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              {reviews.length > 0 ? (
                <>
                  <div className="reviews-summary">
                    <div className="average-rating">
                      <div className="rating-value">{getAverageRating().toFixed(1)}</div>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= getAverageRating() ? 'filled' : ''}>★</span>
                        ))}
                      </div>
                      <div className="total-reviews">{reviews.length} отзывов</div>
                    </div>
                  </div>
                  
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <span className="review-author">{review.author}</span>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? 'filled' : ''}>★</span>
                          ))}
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-reviews">
                  <p>Пока нет отзывов для этого товара.</p>
                  <p>Станьте первым, кто оставит отзыв!</p>
                </div>
              )}
              
              <div className="add-review">
                <button className="add-review-button">Оставить отзыв</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h2>Похожие товары</h2>
          <div className="similar-products-grid">
            {similarProducts.map(prod => (
              <div key={prod.id} className="similar-product-card">
                <Link to={`/product/${prod.id}`} className="product-image">
                  <img src={prod.image} alt={prod.name} />
                </Link>
                <div className="product-info">
                  <Link to={`/product/${prod.id}`} className="product-title">
                    <h3>{prod.name}</h3>
                  </Link>
                  <span className={`product-status ${prod.available ? 'available' : 'unavailable'}`}>
                    {prod.available ? 'В наличии' : 'Нет в наличии'}
                  </span>
                  <p className="product-price">{prod.price} ₽/день</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage; 