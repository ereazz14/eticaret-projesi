const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// --- SAHTE VERİTABANI (RAM'de durur) ---
let products = [
    { id: 1, name: "Oyun Bilgisayarı", price: 45000, category: "Bilgisayar", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" },
    { id: 2, name: "Kablosuz Kulaklık", price: 6500, category: "Aksesuar", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: 3, name: "Mekanik Klavye", price: 5200, category: "Aksesuar", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { id: 4, name: "Oyuncu Mouse", price: 1550, category: "Aksesuar", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80" }
];

// 1. Tüm Ürünleri Getir
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. Yeni Ürün Ekle (Sepet mantığı gibi düşün)
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        image: "https://via.placeholder.com/150"
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Sunucuyu Başlat
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu (Mock Modunda) ${PORT} portunda çalışıyor...`);
});