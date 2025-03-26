import React, { useState } from 'react';
import './FeedbackPage.css';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  product?: string;
}

const FeedbackPage: React.FC = () => {
  // Пример отзывов
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Иван Петров',
      rating: 5,
      date: '15.03.2024',
      text: 'Отличный сервис! Взял в аренду лыжи на выходные, всё было в идеальном состоянии. Обязательно буду обращаться снова.',
      product: 'Горные лыжи'
    },
    {
      id: 2,
      author: 'Анна Сидорова',
      rating: 4,
      date: '10.03.2024',
      text: 'Очень удобно, что можно арендовать только на то время, которое нужно. Сноуборд был в хорошем состоянии. Единственное - немного задержали выдачу.',
      product: 'Сноуборд'
    },
    {
      id: 3,
      author: 'Дмитрий Иванов',
      rating: 5,
      date: '05.03.2024',
      text: 'Брал коньки на неделю. Качество обслуживания на высоте - всё быстро, чётко и без лишних вопросов.',
      product: 'Коньки'
    },
    {
      id: 4,
      author: 'Елена Кузнецова',
      rating: 5,
      date: '28.02.2024',
      text: 'Впервые воспользовалась сервисом и осталась очень довольна! Персонал вежливый, помогли с выбором размера. Всё прошло идеально!',
      product: 'Горные лыжи'
    }
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    text: '',
    product: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь был бы запрос к API
    alert('Спасибо за ваш отзыв! После модерации он появится на сайте.');
    setNewReview({
      author: '',
      rating: 5,
      text: '',
      product: ''
    });
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Отзывы наших клиентов</h1>
        <p>Мы ценим мнение каждого клиента и стремимся сделать наш сервис лучше!</p>
      </div>

      <div className="reviews-section">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.author}</h3>
              <div className="review-rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span 
                    key={index}
                    className={`star ${index < review.rating ? 'filled' : 'empty'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="review-meta">
              <span className="review-date">{review.date}</span>
              {review.product && (
                <span className="review-product">Товар: {review.product}</span>
              )}
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>

      <div className="add-review-section">
        <h2>Оставить отзыв</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="author">Ваше имя</label>
            <input
              type="text"
              id="author"
              name="author"
              value={newReview.author}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product">Арендованный товар</label>
            <input
              type="text"
              id="product"
              name="product"
              value={newReview.product}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Оценка</label>
            <select
              id="rating"
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              required
            >
              <option value="5">5 - Отлично</option>
              <option value="4">4 - Хорошо</option>
              <option value="3">3 - Нормально</option>
              <option value="2">2 - Плохо</option>
              <option value="1">1 - Ужасно</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="text">Ваш отзыв</label>
            <textarea
              id="text"
              name="text"
              value={newReview.text}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>

          <button type="submit" className="submit-button">Отправить отзыв</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage; 