import React, { useState, useEffect } from 'react';
import { CloseIcon, InstagramIcon, FacebookIcon, TikTokIcon, ExclamationTriangleIcon } from './icons';
import WarningModal from './WarningModal';
import SocialPreview from './SocialPreview';

const N8N_CAPTION_WEBHOOK = 'https://auto.apps.kediritechnopark.com/webhook/generate-caption';

const ConfirmationModal = ({ images, onClose, onSchedulePost, rejectedImageCount, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [warning, setWarning] = useState(null);
  const [activePreview, setActivePreview] = useState('instagram');
  const [isRejectWarningVisible, setIsRejectWarningVisible] = useState(false);
  
  const currentImage = images[currentIndex];

  const getMinScheduleTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    return now;
  };
  
  const minScheduleDate = getMinScheduleTime();
  const today = minScheduleDate.toISOString().split('T')[0];
  const currentTime = minScheduleDate.toTimeString().slice(0, 5);

  const [scheduleDate, setScheduleDate] = useState(today);
  const [scheduleTime, setScheduleTime] = useState(currentTime);

  useEffect(() => {
    const generateCaption = async () => {
      if (currentImage) {
        setIsGeneratingCaption(true);
        setCaption(''); // Reset caption untuk gambar baru

        try {
          const response = await fetch(N8N_CAPTION_WEBHOOK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: currentImage.url }),
          });

          if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Tidak dapat membaca isi pesan error.');
            throw new Error(`Error dari layanan caption: ${response.statusText} (${response.status}). ${errorBody}`);
          }
          
          const responseText = await response.text();
          if (!responseText) {
              throw new Error("Menerima respons kosong dari layanan caption.");
          }

          let result;
          try {
              result = JSON.parse(responseText);
          } catch (e) {
              throw new Error("Menerima respons yang tidak valid dari layanan caption.");
          }

          const generatedCaption = result.caption || '';
          setCaption(generatedCaption.trim());
        } catch (error) {
          console.error('Caption generation failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'Gagal membuat caption otomatis.';
          setCaption(errorMessage);
        } finally {
          setIsGeneratingCaption(false);
        }
      }
    };

    generateCaption();
  }, [currentImage]);
  
  const scheduleAndFinalize = () => {
    const newPost = {
      images: [currentImage],
      caption: caption,
      date: scheduleDate,
      time: scheduleTime,
    };
    onSchedulePost(newPost);
    if (onFinish) onFinish();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!scheduleDate || !scheduleTime) {
      setWarning('Silakan tentukan tanggal dan waktu penjadwalan.');
      return;
    }

    const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    const minimumDateTime = new Date();
    minimumDateTime.setSeconds(0, 0); 
    minimumDateTime.setMinutes(minimumDateTime.getMinutes() + 15);

    if (selectedDateTime < minimumDateTime) {
      setWarning('Waktu penjadwalan harus minimal 15 menit dari sekarang. Silakan pilih waktu lain.');
      return;
    }
    
    const isLastImage = currentIndex === images.length - 1;

    if (isLastImage) {
        if (rejectedImageCount > 0) {
            setIsRejectWarningVisible(true); // Tampilkan peringatan dan berhenti
        } else {
            scheduleAndFinalize(); // Tidak ada gambar ditolak, langsung selesaikan
        }
    } else {
        // Bukan gambar terakhir, jadwalkan dan lanjutkan
        const newPost = {
            images: [currentImage],
            caption: caption,
            date: scheduleDate,
            time: scheduleTime,
        };
        onSchedulePost(newPost);
        setCurrentIndex(currentIndex + 1);
    }
  };

  const handleConfirmRejectionAndFinish = () => {
    scheduleAndFinalize();
    setIsRejectWarningVisible(false);
  };
  
  const handleDownloadImage = async () => {
    if (!currentImage) return;
    
    setWarning(null);

    try {
      const response = await fetch(currentImage.url);
      if (!response.ok) {
        throw new Error('Gagal mengambil data gambar dari server.');
      }
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = blob.type.split('/')[1] || 'png';
      link.setAttribute('download', `maragen-ai-${currentImage.id}.${fileExtension}`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setWarning("Gagal mengunduh gambar. Mungkin ada masalah dengan jaringan atau server gambar.");
    }
  };

  const platformIcons = [
    { name: 'instagram', icon: InstagramIcon },
    { name: 'facebook', icon: FacebookIcon },
    { name: 'tiktok', icon: TikTokIcon },
  ];

  const isLastImage = currentIndex === images.length - 1;
  
  if (!currentImage) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              Jadwalkan Postingan ({currentIndex + 1} dari {images.length})
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <CloseIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-grow flex flex-col md:flex-row min-h-0">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                <h3 className="font-semibold text-gray-700 mb-2">Gambar yang Disetujui:</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
                {images.map((img, index) => (
                    <img 
                      key={img.id} 
                      src={img.url} 
                      alt="Approved Thumbnail" 
                      className={`rounded-lg object-cover aspect-square transition-all duration-200 ${
                        index === currentIndex ? 'ring-4 ring-teal-500 ring-offset-2 scale-105' : 'opacity-50 hover:opacity-100 cursor-pointer'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                ))}
                </div>
                
                <form onSubmit={handleSubmit} id="schedule-form">
                    <div className="mb-4">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                        <textarea
                            id="caption"
                            rows={4}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                            placeholder={isGeneratingCaption ? "Caption Sedang di generate oleh Maragen..." : "Tulis sesuatu..."}
                            disabled={isGeneratingCaption}
                        ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                            <input
                                type="date"
                                id="schedule-date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 mb-1">Waktu Publikasi</label>
                            <input
                                type="time"
                                id="schedule-time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                </form>
            </div>
            
            {/* Right Side: Preview */}
            <div className="w-full md:w-1/2 bg-slate-100 p-6 flex flex-col justify-center items-center overflow-y-auto">
              <div className="w-full max-w-sm mx-auto">
                <div className="flex justify-center items-center gap-2 mb-4 p-1 bg-gray-200 rounded-full">
                  {platformIcons.map(p => (
                    <button 
                      key={p.name}
                      onClick={() => setActivePreview(p.name)}
                      className={`p-2 rounded-full transition-colors duration-200 ${activePreview === p.name ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:bg-gray-300'}`}
                      aria-label={`Preview on ${p.name}`}
                    >
                      <p.icon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
                <SocialPreview 
                  platform={activePreview} 
                  imageUrl={currentImage.url} 
                  caption={caption}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100"
              >
                  Unduh Gambar
              </button>
              <button
                  type="submit"
                  form="schedule-form"
                  className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                  {isLastImage ? 'Jadwalkan & Selesai' : 'Jadwalkan & Lanjutkan'}
              </button>
          </div>
        </div>
      </div>

      {isRejectWarningVisible && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[70]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
            <div className="p-6">
              <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-bold text-gray-900">
                          Konfirmasi Hapus
                      </h3>
                      <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Anda akan menjadwalkan postingan terakhir. Ini juga akan menghapus <strong>{rejectedImageCount} gambar yang ditolak</strong> secara permanen. Apakah Anda yakin?
                          </p>
                      </div>
                  </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleConfirmRejectionAndFinish}
                >
                    Bodo Amat
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsRejectWarningVisible(false)}
                >
                    Kembali
                </button>
            </div>
          </div>
        </div>
      )}

      {warning && <WarningModal message={warning} onClose={() => setWarning(null)} />}
    </>
  );
};

export default ConfirmationModal;