import React, { useState, useRef, useCallback } from 'react';
import { CloseIcon, ImageIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './icons';
import WarningModal from './WarningModal';
import SocialPreview from './SocialPreview';

const N8N_CAPTION_WEBHOOK = 'https://auto.apps.kediritechnopark.com/webhook/generate-caption';

const SchedulePostModal = ({ onClose, onSchedule }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [warning, setWarning] = useState(null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [activePreview, setActivePreview] = useState('instagram');
  const fileInputRef = useRef(null);

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
  
  const generateCaption = useCallback(async (base64Image) => {
    setIsGeneratingCaption(true);
    setCaption('');

    try {
      const response = await fetch(N8N_CAPTION_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Tidak dapat membaca isi pesan error.');
        console.error('Caption service error response:', errorBody);
        throw new Error(`Error dari layanan caption: ${response.statusText} (${response.status}). ${errorBody}`);
      }

      const responseText = await response.text();
      if (!responseText) {
          throw new Error("Menerima respons kosong dari layanan caption. Pembuatan caption mungkin gagal.");
      }

      let result;
      try {
          result = JSON.parse(responseText);
      } catch (e) {
          console.error("Gagal mem-parsing JSON caption:", responseText);
          throw new Error("Menerima respons yang tidak valid dari layanan caption.");
      }
      
      const generatedCaption = result.caption || '';
      setCaption(generatedCaption.trim());
    } catch (error) {
      console.error('Caption generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat caption otomatis. Silakan coba lagi atau isi manual.';
      setCaption(errorMessage);
    } finally {
      setIsGeneratingCaption(false);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        generateCaption(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setWarning('Silakan unggah sebuah gambar.');
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      setWarning('Silakan tentukan tanggal dan waktu penjadwalan.');
      return;
    }

    const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    // Bulatkan waktu saat ini ke bawah ke menit terdekat untuk perbandingan yang akurat
    const minimumDateTime = new Date();
    minimumDateTime.setSeconds(0, 0); // Abaikan detik dan milidetik
    minimumDateTime.setMinutes(minimumDateTime.getMinutes() + 15);

    if (selectedDateTime < minimumDateTime) {
        setWarning('Waktu penjadwalan harus minimal 15 menit dari sekarang. Silakan pilih waktu lain.');
        return;
    }

    const newPost = {
      images: [{ id: `local-${Date.now()}`, url: imagePreview }],
      caption: caption,
      date: scheduleDate,
      time: scheduleTime,
    };
    onSchedule(newPost);
  };

  const platformIcons = [
    { name: 'instagram', icon: InstagramIcon },
    { name: 'facebook', icon: FacebookIcon },
    { name: 'tiktok', icon: TikTokIcon },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Jadwalkan Postingan Baru</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <CloseIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-grow flex flex-col md:flex-row min-h-0">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} id="schedule-form-manual">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konten Media</label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                    ) : (
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <p>Klik untuk mengunggah gambar</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>

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
                  imageUrl={imagePreview} 
                  caption={caption}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              form="schedule-form-manual"
              className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              Jadwalkan
            </button>
          </div>
        </div>
      </div>
      {warning && <WarningModal message={warning} onClose={() => setWarning(null)} />}
    </>
  );
};

export default SchedulePostModal;