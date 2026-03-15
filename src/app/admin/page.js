"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false); // NEW: Homepage toggle
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState([]);

  const CLOUDINARY_CLOUD_NAME = "dbufkrdoe"; 
  const CLOUDINARY_UPLOAD_PRESET = "ayeshas_preset";

  const fetchInventory = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    setInventory(items);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image!");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const cloudinaryData = await cloudinaryRes.json();

      await addDoc(collection(db, "products"), {
        name: productName,
        price: price || "",
        imageUrl: cloudinaryData.secure_url,
        isFeatured: isFeatured, // NEW: Saves the toggle state to database!
        createdAt: new Date(),
      });

      alert("Product added!");
      setProductName('');
      setPrice('');
      setImage(null);
      setIsFeatured(false);
      document.getElementById('file-upload').value = "";
      
      fetchInventory();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteDoc(doc(db, "products", id));
      fetchInventory(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-24 font-sans text-[#1A1515]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-gray-300 pb-6">
          <h1 className="text-4xl font-serif font-bold">Ayesha's Admin</h1>
          <p className="text-gray-600 mt-2">Manage your live website inventory.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* UPLOAD FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-serif font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#b76e79] bg-transparent" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price (Optional)</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Leave blank if not needed" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#b76e79] bg-transparent" />
              </div>
              
              {/* NEW: FEATURED TOGGLE */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 accent-[#b76e79] cursor-pointer" />
                <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Show on Homepage (Featured 4)
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Photo</label>
                <input id="file-upload" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1A1515] file:text-white hover:file:bg-[#b76e79] file:cursor-pointer" required />
              </div>
              <button type="submit" disabled={isUploading} className={`w-full py-4 rounded-full uppercase tracking-widest text-xs font-bold transition-colors mt-8 text-white ${isUploading ? 'bg-gray-400' : 'bg-[#1A1515] hover:bg-[#b76e79]'}`}>
                {isUploading ? 'Uploading...' : 'Upload to Website'}
              </button>
            </form>
          </div>

          {/* LIVE INVENTORY LIST */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Current Inventory</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {inventory.length === 0 ? (
                <p className="text-gray-500 italic">No products uploaded yet.</p>
              ) : (
                inventory.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-lg" alt={item.name} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        {/* NEW: Shows a star if it's on the homepage */}
                        {item.isFeatured && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">⭐ Homepage</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.price || "No price set"}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-xs text-red-500 font-bold uppercase tracking-wider hover:underline">
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}