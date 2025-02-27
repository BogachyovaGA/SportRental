import React, { useState, useEffect } from 'react';
import {
  mockGetProducts,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct
} from '../../../services/mock/mockProductService';
import { mockGetCategories } from '../../../services/mock/mockCategoryService';
import './ProductsManagementPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  available: boolean;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductsManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    available: true,
    image: null as File | null
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await mockGetProducts();
      setProducts(data);
    } catch (error) {
      setError('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await mockGetCategories();
      setCategories(data);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          productData.append(key, value.toString());
        }
      });

      if (editingProduct) {
        await mockUpdateProduct(editingProduct.id, productData);
      } else {
        await mockCreateProduct(productData);
      }

      await loadProducts();
      handleCloseModal();
    } catch (error) {
      setError('Ошибка при сохранении товара');
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await mockDeleteProduct(productId);
        await loadProducts();
      } catch (error) {
        setError('Ошибка при удалении товара');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      available: product.available,
      image: null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      available: true,
      image: null
    });
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="products-management">
      <div className="page-header">
        <h1>Управление товарами</h1>
        <button 
          className="add-product-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Добавить товар
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена/день</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img src={product.image} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>
                  {categories.find(c => c.id === product.categoryId)?.name}
                </td>
                <td>{product.price} ₽</td>
                <td>
                  <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                    {product.available ? 'Доступен' : 'Недоступен'}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Цена за день</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Категория</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  />
                  Доступен для аренды
                </label>
              </div>

              <div className="form-group">
                <label>Изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({
                    ...formData,
                    image: e.target.files ? e.target.files[0] : null
                  })}
                  {...(!editingProduct && { required: true })}
                />
              </div>

              <div className="modal-actions">
                <button type="submit">Сохранить</button>
                <button type="button" onClick={handleCloseModal}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagementPage; 