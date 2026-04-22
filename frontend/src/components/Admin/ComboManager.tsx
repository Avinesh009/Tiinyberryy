/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface ComboProduct {
  productId: string;
  quantity: number;
  discountPercent: number;
}

interface ComboOffer {
  _id?: string;
  name: string;
  description: string;
  products: ComboProduct[];
  comboPrice: number;
  originalPrice: number;
  discountPercent: number;
  badge: string;
  image: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ComboManager = () => {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboOffer | null>(null);
  const [formData, setFormData] = useState<ComboOffer>({
    name: '',
    description: '',
    products: [],
    comboPrice: 0,
    originalPrice: 0,
    discountPercent: 0,
    badge: 'Combo',
    image: '',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [selectedProduct, setSelectedProduct] = useState({ productId: '', quantity: 1 });

  useEffect(() => {
    fetchCombos();
    fetchProducts();
  }, []);

  const fetchCombos = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/combos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCombos(data.combos);
      }
    } catch (error) {
      console.error('Fetch combos error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  const addProductToCombo = () => {
    if (!selectedProduct.productId) return;
    
    const product = products.find(p => p._id === selectedProduct.productId);
    if (!product) return;
    
    const existingProduct = formData.products.find(p => p.productId === selectedProduct.productId);
    if (existingProduct) {
      alert('Product already added to combo');
      return;
    }
    
    setFormData({
      ...formData,
      products: [...formData.products, {
        productId: selectedProduct.productId,
        quantity: selectedProduct.quantity,
        discountPercent: 0
      }]
    });
    
    setSelectedProduct({ productId: '', quantity: 1 });
  };

  const removeProductFromCombo = (productId: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.productId !== productId)
    });
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setFormData({
      ...formData,
      products: formData.products.map(p => 
        p.productId === productId ? { ...p, quantity } : p
      )
    });
  };

  const calculateTotals = () => {
    let originalTotal = 0;
    for (const item of formData.products) {
      const product = products.find(p => p._id === item.productId);
      if (product) {
        originalTotal += product.price * item.quantity;
      }
    }
    
    const comboPrice = formData.comboPrice;
    const discountPercent = originalTotal > 0 ? Math.round(((originalTotal - comboPrice) / originalTotal) * 100) : 0;
    
    return { originalTotal, discountPercent };
  };

  const handleSave = async () => {
    if (formData.products.length === 0) {
      alert('Please add at least one product to the combo');
      return;
    }
    
    if (!formData.name) {
      alert('Please enter combo name');
      return;
    }
    
    if (!formData.comboPrice || formData.comboPrice <= 0) {
      alert('Please enter a valid combo price');
      return;
    }
    
    const { originalTotal, discountPercent } = calculateTotals();
    
    const saveData = {
      ...formData,
      originalPrice: originalTotal,
      discountPercent
    };
    
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      alert('Please login as admin first');
      window.location.href = '/admin/login';
      return;
    }
    
    const url = editingCombo?._id ? `${API_URL}/combos/${editingCombo._id}` : `${API_URL}/combos`;
    const method = editingCombo?._id ? 'PUT' : 'POST';
    
    try {
      console.log('Saving combo to:', url);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saveData)
      });
      
      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned HTML instead of JSON. API endpoint may be incorrect.');
      }
      
      if (response.status === 401 || response.status === 403) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCombos();
        setShowModal(false);
        resetForm();
        alert('Combo saved successfully!');
      } else {
        alert(data.message || data.error || 'Failed to save combo');
      }
    } catch (error: any) {
      console.error('Save combo error:', error);
      alert(error.message || 'Failed to save combo. Check if backend API is running.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this combo offer?')) {
      const token = localStorage.getItem('admin_token');
      try {
        const response = await fetch(`${API_URL}/combos/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          await fetchCombos();
          alert('Combo deleted successfully!');
        } else {
          alert('Failed to delete combo');
        }
      } catch (error) {
        console.error('Delete combo error:', error);
        alert('Failed to delete combo');
      }
    }
  };

  const handleEdit = (combo: ComboOffer) => {
    setEditingCombo(combo);
    setFormData({
      ...combo,
      startDate: combo.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      endDate: combo.endDate?.split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCombo(null);
    setFormData({
      name: '',
      description: '',
      products: [],
      comboPrice: 0,
      originalPrice: 0,
      discountPercent: 0,
      badge: 'Combo',
      image: '',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setSelectedProduct({ productId: '', quantity: 1 });
  };

  const { originalTotal, discountPercent } = calculateTotals();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Combo Offers</h2>
          <p className="text-sm text-muted-foreground">Create product bundles at discounted prices</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Combo
        </button>
      </div>
      
      {combos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-muted-foreground">No combo offers created yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Combo" to create your first bundle offer!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combos.map((combo) => (
            <div key={combo._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <img 
                  src={combo.image || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop'} 
                  alt={combo.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{combo.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{combo.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-bold text-primary">₹{combo.comboPrice.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{combo.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Save {combo.discountPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <span>{combo.products.length} products</span>
                    <span>•</span>
                    <span className={combo.isActive ? 'text-green-600' : 'text-red-600'}>
                      {combo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(combo)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(combo._id!)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Combo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4">
              <h2 className="text-2xl font-bold">{editingCombo ? 'Edit Combo' : 'Create Combo Offer'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Combo Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Newborn Starter Kit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Combo"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe this combo offer..."
                  />
                </div>
              </div>
              
              {/* Products Selection */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Products in Combo</h3>
                
                {/* Add Product Form */}
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedProduct.productId}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, productId: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedProduct.quantity}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) || 1 })}
                    className="w-24 px-3 py-2 border rounded-lg text-center"
                  />
                  <button
                    type="button"
                    onClick={addProductToCombo}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                
                {/* Products List */}
                {formData.products.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No products added yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.products.map((item) => {
                      const product = products.find(p => p._id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">₹{product.price} each</p>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 border rounded-lg text-center"
                          />
                          <button
                            onClick={() => removeProductFromCombo(item.productId)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Pricing */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Original Total</label>
                    <div className="text-lg font-semibold text-muted-foreground">
                      ₹{originalTotal.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Combo Price *</label>
                    <input
                      type="number"
                      value={formData.comboPrice}
                      onChange={(e) => setFormData({ ...formData, comboPrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount</label>
                    <div className="text-lg font-semibold text-green-600">
                      {discountPercent}% off
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer Save</label>
                    <div className="text-lg font-semibold text-green-600">
                      ₹{(originalTotal - formData.comboPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validity */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Validity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingCombo ? 'Update Combo' : 'Create Combo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboManager;