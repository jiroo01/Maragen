import React, { useState, useCallback } from 'react';
import ImageCard from './ImageCard';
import ConfirmationModal from './ConfirmationModal';

const N8N_IMAGE_WEBHOOK = 'https://auto.apps.kediritechnopark.com/webhook/input';

// Fungsi helper untuk mengubah URL Google Drive
const formatGoogleDriveUrl = (url) => {
  if (typeof url === 'string' && url.includes('drive.google.com/uc?id=')) {
    const fileId = url.split('id=')[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
};


const ImageGenerator = ({ onSchedulePost }) => {
  const [prompt, setPrompt] = useState('Majestic anime cat with piercing green eyes, black fur, serene expression, sitting under a full moon, traditional Japanese art influence, mystical atmosphere.');
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedImages, setApprovedImages] = useState([]);

  const handleGenerateImages = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Mohon masukkan deskripsi gambar.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImages([]);

    try {
      const response = await fetch(N8N_IMAGE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Tidak dapat membaca isi pesan error.');
        console.error('Server error response:', errorBody);
        throw new Error(`Error dari server: ${response.statusText} (${response.status}). ${errorBody}`);
      }

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error("Menerima respons kosong dari server. Pembuatan gambar mungkin gagal di backend. Silakan coba lagi.");
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Gagal mem-parsing respons JSON:", responseText);
        throw new Error("Menerima respons yang tidak valid dari server. Respon bukanlah format JSON yang benar.");
      }
      
      let imageUrls = null;

      if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && result[0] !== null) {
        imageUrls = result[0];
      } 
      else if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
        imageUrls = result;
      }

      if (imageUrls) {
        // === PERUBAHAN UTAMA ADA DI DALAM BLOK INI ===
        const generatedImages = Object.entries(imageUrls).map(([id, url]) => {
          if (typeof url === 'string' && url.startsWith('http')) {
            return {
              id: id,
              url: formatGoogleDriveUrl(url), // Menggunakan fungsi helper
              status: 'pending',
            };
          }
          return null;
        }).filter((img) => img !== null);

        if (generatedImages.length > 0) {
          setImages(generatedImages);
        } else {
           throw new Error("Respons diterima, tetapi tidak berisi URL gambar yang valid.");
        }
      } else {
        console.error("Unexpected response format from n8n:", result);
        throw new Error("Format respons tidak terduga. Harap periksa output alur kerja n8n Anda.");
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  // ... sisa kode Anda (handleImageStatusChange, handleConfirmSelection, dst.) tidak perlu diubah ...
  const handleImageStatusChange = useCallback((id, status) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, status } : img
      )
    );
  }, []);
  
  const handleConfirmSelection = useCallback(() => {
    const approved = images.filter(img => img.status === 'approved');
    const reviewed = images.filter(img => img.status !== 'pending');

    if (images.length > 0 && reviewed.length === 0) {
      alert("Silakan tinjau (setujui/tolak) setidaknya satu gambar sebelum melanjutkan.");
      return;
    }
    
    if (approved.length > 0) {
      setApprovedImages(approved);
      setIsModalOpen(true);
    } else if (reviewed.length > 0) {
      // User has reviewed images, but none are approved. This means they are all rejected.
      if (window.confirm("Anda yakin ingin menolak semua gambar? Ini akan menghapusnya dari tampilan saat ini.")) {
        setImages([]); // Reset the images
      }
    }
  }, [images]);

  const handlePostSuccessfullyScheduled = (newPost) => {
    // 1. Memanggil prop asli untuk memperbarui kalender di App
    onSchedulePost(newPost);
    
    // 2. Menghapus gambar yang baru saja dijadwalkan dari state komponen ini
    if (newPost.images && newPost.images.length > 0) {
      const scheduledImageId = newPost.images[0].id;
      setImages(prevImages => prevImages.filter(img => img.id !== scheduledImageId));
    }
  };

  const handleFinishScheduling = () => {
    // Fungsi ini dipanggil setelah gambar terakhir dijadwalkan,
    // untuk membersihkan semua gambar yang ditolak.
    setImages(prev => prev.filter(img => img.status !== 'rejected'));
  };

  const handleCloseModal = () => {
    // Fungsi ini sekarang HANYA untuk menutup modal (berfungsi sebagai tombol "batal").
    // Ini TIDAK LAGI menghapus gambar apa pun dari tampilan utama. Ini memperbaiki bug.
    setIsModalOpen(false);
    setApprovedImages([]); // Membersihkan ini aman karena akan dibangun kembali.
  };

  const rejectedImageCount = images.filter(img => img.status === 'rejected').length;

  return (
    <>
      <div className="p-8">
        <h2 className="text-4xl font-bold text-gray-800">Buat Gambar AI</h2>
        <p className="mt-2 text-gray-600">Masukkan deskripsi untuk membuat gambar.</p>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Deskripsikan gambar yang ingin Anda buat..."
            className="w-full p-3 border border-gray-300 rounded-lg transition duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            rows={3}
          />
          <button
            onClick={handleGenerateImages}
            disabled={isGenerating}
            className="mt-4 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Membuat Gambar...
              </div>
            ) : 'Buat Gambar'}
          </button>
        </div>

        {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {images.length > 0 && (
          <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {images.map(image => (
                      <ImageCard key={image.id} image={image} onStatusChange={handleImageStatusChange} />
                  ))}
              </div>
              <div className="mt-8 flex justify-end">
                  <button
                      onClick={handleConfirmSelection}
                      className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-all duration-200"
                  >
                      Konfirmasi
                  </button>
              </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <ConfirmationModal 
            images={approvedImages}
            onClose={handleCloseModal}
            onSchedulePost={handlePostSuccessfullyScheduled}
            rejectedImageCount={rejectedImageCount}
            onFinish={handleFinishScheduling}
        />
      )}
    </>
  );
};

export default ImageGenerator;