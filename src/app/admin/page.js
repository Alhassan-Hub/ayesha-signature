"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products'); 

  // Products State
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false); 
  const [isBestseller, setIsBestseller] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState([]);

  // NEW: Editing State
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Reviews State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isReviewUploading, setIsReviewUploading] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);

  const CLOUDINARY_CLOUD_NAME = "dbufkrdoe"; 
  const CLOUDINARY_UPLOAD_PRESET = "ayeshas_preset";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsAuthenticated(true);
    else { alert('Incorrect Password'); setPassword(''); }
  };

  const fetchData = async () => {
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapProducts = await getDocs(qProducts);
    const items = [];
    snapProducts.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    setInventory(items);

    const qReviews = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snapReviews = await getDocs(qReviews);
    const revs = [];
    snapReviews.forEach((doc) => revs.push({ id: doc.id, ...doc.data() }));
    setReviewsList(revs);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  // RESET FORM HELPER
  const resetForm = () => {
    setProductName(''); setPrice(''); setDescription(''); 
    setImage(null); setIsFeatured(false); setIsBestseller(false);
    setEditingProductId(null); setExistingImageUrl('');
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = "";
  };

  // HANDLE EDIT CLICK
  const handleEditClick = (item) => {
    setEditingProductId(item.id);
    setProductName(item.name || '');
    setPrice(item.price || '');
    setDescription(item.description || '');
    setExistingImageUrl(item.imageUrl || '');
    setIsFeatured(item.isFeatured || false);
    setIsBestseller(item.isBestseller || false);
    setImage(null); 
    // Scroll Ayesha to the top smoothly so she sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // HANDLE SUBMIT (CREATE OR UPDATE)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // If we are NOT editing, an image is required.
    if (!image && !editingProductId) return alert("Please select a photo first!");
    
    setIsUploading(true);
    try {
      let finalImageUrl = existingImageUrl;

      // If she selected a new image, upload it
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        const cloudinaryData = await cloudinaryRes.json();
        finalImageUrl = cloudinaryData.secure_url;
      }

      const productData = {
        name: productName,
        price: price || "",
        description: description || "", 
        imageUrl: finalImageUrl,
        isFeatured: isFeatured,
        isBestseller: isBestseller,
      };

      if (editingProductId) {
        // UPDATE EXISTING ITEM
        await updateDoc(doc(db, "products", editingProductId), productData);
        alert("Changes saved successfully!");
      } else {
        // ADD NEW ITEM
        productData.createdAt = new Date();
        await addDoc(collection(db, "products"), productData);
        alert("New product added!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error); alert("Failed to save. Please check your connection.");
    } finally { setIsUploading(false); }
  };

  const handleProductDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteDoc(doc(db, "products", id));
      if (editingProductId === id) resetForm(); // Clear form if she deleted what she was editing
      fetchData(); 
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewText) return alert("Please fill out both fields.");
    setIsReviewUploading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: reviewerName, text: `"${reviewText}"`, initial: reviewerName.charAt(0).toUpperCase(), createdAt: new Date(),
      });
      alert("Review added!"); setReviewerName(''); setReviewText(''); fetchData();
    } catch (error) { console.error(error); } finally { setIsReviewUploading(false); }
  };

  const handleReviewDelete = async (id, name) => {
    if (window.confirm(`Delete review from ${name}?`)) {
      await deleteDoc(doc(db, "reviews", id)); fetchData(); 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#2C2424] mb-2">Ayesha's Admin</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">Authorized Access Only</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input type="password" placeholder="Enter Passcode" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b-2 border-gray-200 py-3 text-center text-xl focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent tracking-widest" autoFocus />
            <button type="submit" className="w-full py-4 bg-[#2C2424] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#DDA7A5] transition-colors shadow-lg">Unlock Studio</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5] p-6 md:p-12 font-sans text-[#2C2424]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2424]">Management Studio</h1>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors">Lock & Log Out</button>
        </header>

        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
          <button onClick={() => {setActiveTab('products'); resetForm();}} className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'text-[#DDA7A5] border-b-2 border-[#DDA7A5]' : 'text-gray-400 hover:text-[#2C2424]'}`}>🛍️ Products</button>
          <button onClick={() => setActiveTab('reviews')} className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'text-[#DDA7A5] border-b-2 border-[#DDA7A5]' : 'text-gray-400 hover:text-[#2C2424]'}`}>⭐ Client Reviews</button>
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start animate-in fade-in duration-300">
            
            {/* LEFT SIDE: THE FORM (Now Sticky!) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-serif font-bold text-[#2C2424]">
                  {editingProductId ? 'Editing Item' : 'Upload New Item'}
                </h2>
                {editingProductId && (
                  <button onClick={resetForm} className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200">Cancel Edit</button>
                )}
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Product Name *</label><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent text-sm font-bold" required /></div>
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Price (Optional)</label><input type="text" value={price} placeholder="e.g. Le 150,000" onChange={(e) => setPrice(e.target.value)} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent text-sm" /></div>
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Details (Optional)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent text-sm h-24 resize-none mt-2" /></div>
                
                {/* CHECKBOXES */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-4 p-4 bg-[#FDF8F5] rounded-xl border border-[#DDA7A5]/20">
                    <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 accent-[#DDA7A5] cursor-pointer mt-1" />
                    <div>
                      <label htmlFor="featured" className="text-sm font-bold text-[#2C2424] cursor-pointer block">Feature on Homepage</label>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Show in the 4 spots on the front page.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" id="bestseller" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="w-5 h-5 accent-[#DDA7A5] cursor-pointer mt-1" />
                    <div>
                      <label htmlFor="bestseller" className="text-sm font-bold text-[#2C2424] cursor-pointer block">Set as Shop Bestseller</label>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Highlights this item in the massive spotlight on the Shop page.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Product Photo {editingProductId ? '(Optional)' : '*'}
                  </label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#DDA7A5] transition-colors bg-gray-50 group cursor-pointer">
                    <input id="file-upload" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{image ? '✅' : '📸'}</span>
                    <span className="text-xs font-bold text-gray-600 text-center">{image ? image.name : "Tap to select a new image"}</span>
                  </div>
                  {editingProductId && !image && existingImageUrl && (
                    <p className="text-[10px] text-[#DDA7A5] mt-2 italic font-bold text-center">Keeping existing photo. Upload a new one above to replace it.</p>
                  )}
                </div>

                <button type="submit" disabled={isUploading} className={`w-full py-5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-lg mt-4 ${isUploading ? 'bg-gray-300 text-gray-500' : (editingProductId ? 'bg-[#DDA7A5] text-white hover:bg-[#2C2424]' : 'bg-[#2C2424] text-white hover:bg-[#DDA7A5]')}`}>
                  {isUploading ? 'Saving...' : (editingProductId ? 'Save Changes' : 'Publish to Website')}
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: THE LIST (Natural scrolling now) */}
            <div className="lg:col-span-7 pb-20">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-serif font-bold text-[#2C2424]">Current Inventory</h2><span className="text-xs font-bold bg-[#DDA7A5]/10 text-[#DDA7A5] px-3 py-1 rounded-full">{inventory.length} Items</span></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inventory.length === 0 ? (<div className="col-span-2 text-center py-20 bg-white rounded-[2rem] border border-gray-100"><p className="text-gray-400 italic text-sm">Your store is empty.</p></div>) : (
                  inventory.map((item) => (
                    <div key={item.id} className={`flex flex-col bg-white p-4 rounded-3xl shadow-sm border transition-all ${editingProductId === item.id ? 'border-[#DDA7A5] ring-4 ring-[#DDA7A5]/10' : 'border-gray-100 hover:shadow-md'}`}>
                      
                      {/* Visible Action Buttons for Ayesha */}
                      <div className="flex justify-between items-center mb-3 px-1 gap-2">
                        <button onClick={() => handleEditClick(item)} className="flex-1 py-2 bg-gray-50 text-[#DDA7A5] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#DDA7A5] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => handleProductDelete(item.id, item.name)} className="flex-1 py-2 bg-gray-50 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-colors">Delete</button>
                      </div>

                      <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4"><img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} /></div>
                      
                      <div className="flex-1 flex flex-col px-1">
                        <h3 className="font-bold text-sm text-[#2C2424] mb-1">{item.name}</h3>
                        <p className="text-xs text-[#DDA7A5] font-bold tracking-widest mb-3">{item.price || "No Price Set"}</p>
                        
                        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                          {item.isFeatured && <span className="text-[9px] bg-[#2C2424] text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">★ Front Page</span>}
                          {item.isBestseller && <span className="text-[9px] bg-[#DDA7A5] text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">🔥 Bestseller</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start animate-in fade-in duration-300">
            <div className="lg:col-span-5 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-6">
              <h2 className="text-xl font-serif font-bold mb-6 text-[#2C2424]">Post a Customer Review</h2>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Customer Name (e.g. Fatima S.) *</label><input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent text-sm" required /></div>
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Their Review *</label><textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Type what they said..." className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-[#DDA7A5] transition-colors bg-transparent text-sm h-32 resize-none mt-2" required /></div>
                <button type="submit" disabled={isReviewUploading} className={`w-full py-5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-lg mt-4 ${isReviewUploading ? 'bg-gray-300 text-gray-500' : 'bg-[#DDA7A5] text-white hover:bg-[#2C2424]'}`}>
                  {isReviewUploading ? 'Posting...' : 'Post to Homepage'}
                </button>
              </form>
            </div>
            
            <div className="lg:col-span-7 pb-20">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-serif font-bold text-[#2C2424]">Live Reviews</h2><span className="text-xs font-bold bg-[#DDA7A5]/10 text-[#DDA7A5] px-3 py-1 rounded-full">{reviewsList.length} Active</span></div>
              <div className="flex flex-col gap-4">
                {reviewsList.length === 0 ? (<div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100"><p className="text-gray-400 italic text-sm">No custom reviews. Showing demo reviews on homepage.</p></div>) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group">
                      <button onClick={() => handleReviewDelete(rev.id, rev.name)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-[10px] font-bold tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full">Delete</button>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#DDA7A5]/20 rounded-full flex items-center justify-center text-[#DDA7A5] font-serif font-bold text-xl">{rev.initial}</div>
                        <h4 className="font-bold text-[#2C2424] text-sm uppercase tracking-widest">{rev.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 italic leading-relaxed">{rev.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}