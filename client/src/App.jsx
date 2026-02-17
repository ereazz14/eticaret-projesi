import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- 1. ANA SAYFA BİLEŞENİ ---
const Home = ({ products, addToCart, removeFromCart, cart, searchTerm }) => {
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Hepsi" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Hepsi", "Bilgisayar", "Aksesuar"];

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <h4>Kategoriler</h4>
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </aside>

      <section className="product-grid">
        <AnimatePresence mode='popLayout'>
          {filtered.map(p => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={p.id} className="card">
              <Link to={`/product/${p.id}`} className="product-link">
                <img src={p.image} alt={p.name} />
                <div className="card-body">
                  <div className="category-tag">{p.category}</div>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price.toLocaleString()} TL</p>
                </div>
              </Link>
              <button className="add-btn" onClick={() => addToCart(p)}>Sepete Ekle</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <aside className="cart-panel">
        <h3>Sipariş Özeti</h3>
        {cart.length === 0 ? <p style={{color: '#64748b'}}>Sepetiniz boş.</p> : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <span>{item.name}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(index)}>Sil</button>
                </div>
              ))}
            </div>
            <div className="total-section">
              <span>Toplam:</span>
              <span>{cart.reduce((a, b) => a + b.price, 0).toLocaleString()} TL</span>
            </div>
            <Link to="/checkout"><button className="checkout-btn">Ödemeye Geç</button></Link>
          </>
        )}
      </aside>
    </div>
  );
};

// --- 2. ÜRÜN DETAY SAYFASI BİLEŞENİ (GÜNCELLENDİ) ---
const ProductDetail = ({ products, addToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <div className="container"><h2>Ürün yükleniyor...</h2></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="detail-container">
      {/* BURASI DEĞİŞTİ: Mağazaya dön butonu yeni class ile daha şık */}
      <Link to="/" className="back-to-store-btn">
        <span className="arrow">←</span> Mağazaya Dön
      </Link>

      <div className="detail-content">
        <img src={product.image} alt={product.name} className="detail-img" />
        <div className="detail-info">
          {/* BURASI DEĞİŞTİ: Kategori etiketi buradan kaldırıldı */}
          <h1>{product.name}</h1>
          <p className="detail-desc">Bu profesyonel teknoloji ürünü, en yüksek kalite standartları ve modern tasarım anlayışıyla üretilmiştir. Yüksek performans ve dayanıklılığı bir arada sunar.</p>
          <div className="stars">⭐⭐⭐⭐⭐ (4.8/5)</div>
          <p className="detail-price">{product.price.toLocaleString()} TL</p>
          <button className="add-btn large" onClick={() => addToCart(product)}>Sepete Ekle</button>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. ÖDEME SAYFASI BİLEŞENİ ---
const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((a, b) => a + b.price, 0);

  const handlePay = (e) => {
    e.preventDefault();
    alert("🚀 Ödeme Başarılı! Siparişiniz hazırlanıyor.");
    clearCart();
    navigate("/");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="checkout-container">
      <h2>Güvenli Ödeme</h2>
      <div className="checkout-flex">
        <form className="checkout-form" onSubmit={handlePay}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input type="text" placeholder="Eren Türkkorkmaz" required />
          </div>
          <div className="form-group">
            <label>Kart Bilgileri</label>
            <div className="card-inputs">
              <input type="text" placeholder="0000 0000 0000 0000" required />
              <input type="text" placeholder="AA/YY" style={{width: '80px'}} required />
            </div>
          </div>
          <button type="submit" className="pay-btn">Ödemeyi Tamamla ({total.toLocaleString()} TL)</button>
        </form>
      </div>
    </motion.div>
  );
};

// --- ANA APP BİLEŞENİ ---
export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Hata:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p) => setCart([...cart, p]);
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };
  const clearCart = () => setCart([]);

  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/" className="logo">🚀 TechPro</Link>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Ürün veya kategori ara..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="cart-status">
            <span>Sepet: <b>{cart.length}</b></span>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} searchTerm={searchTerm} />} />
        <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
      </Routes>
    </div>
  );
}