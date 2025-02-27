import React, { useState, useEffect } from 'react';
import {
  mockGetCategories,
  mockCreateCategory,
  mockUpdateCategory,
  mockDeleteCategory
} from '../../../services/mock/mockCategoryService';
import './CategoriesManagementPage.css';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productsCount: number;
}

const CategoriesManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await mockGetCategories();
      setCategories(data);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = new FormData();
      categoryData.append('name', formData.name);
      categoryData.append('description', formData.description);
      if (formData.image) {
        categoryData.append('image', formData.image);
      }

      if (editingCategory) {
        await mockUpdateCategory(editingCategory.id, categoryData);
      } else {
        await mockCreateCategory(categoryData);
      }

      await loadCategories();
      handleCloseModal();
    } catch (error) {
      setError('Ошибка при сохранении категории');
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await mockDeleteCategory(categoryId);
        await loadCategories();
      } catch (error) {
        setError('Ошибка при удалении категории');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null
    });
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="categories-management">
      <div className="page-header">
        <h1>Управление категориями</h1>
        <button 
          className="add-category-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Добавить категорию
        </button>
      </div>

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Кол-во товаров</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <img src={category.image} alt={category.name} />
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.productsCount}</td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(category)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(category.id)}
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
            <h2>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название категории</label>
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
                <label>Изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({
                    ...formData,
                    image: e.target.files ? e.target.files[0] : null
                  })}
                  {...(!editingCategory && { required: true })}
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

export default CategoriesManagementPage; 