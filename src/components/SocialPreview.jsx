import React from 'react';

const InstagramPreview = ({ imageUrl, caption }) => (
    <div className="bg-white border border-gray-300 rounded-lg w-full max-w-sm overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center p-3 border-b">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full"></div>
            <span className="ml-3 font-semibold text-sm text-gray-800">akun_anda</span>
        </div>
        
        {/* Image */}
        <div className="w-full bg-gray-200">
             <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover aspect-square" />
        </div>

        {/* Actions */}
        <div className="p-3 flex items-center gap-4 text-gray-800">
            {/* Heart, Comment, Share icons */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </div>

        {/* Caption */}
        <div className="px-3 pb-3">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                <span className="font-semibold">akun_anda</span> {caption}
            </p>
        </div>
    </div>
);

const FacebookPreview = ({ imageUrl, caption }) => (
    <div className="bg-white border border-gray-300 rounded-lg w-full max-w-sm overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center p-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
            <div className="ml-3">
                <p className="font-semibold text-sm text-gray-900">Nama Anda</p>
                <p className="text-xs text-gray-500">Baru Saja</p>
            </div>
        </div>

        {/* Caption */}
        <div className="px-3 pb-2 text-sm text-gray-800 whitespace-pre-wrap">
            {caption}
        </div>
        
        {/* Image */}
         <div className="w-full bg-gray-200">
            <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover max-h-[400px]" />
        </div>

        {/* Actions */}
        <div className="flex justify-around p-2 border-t mt-2 text-gray-600 font-medium text-sm">
            <button className="flex-1 text-center py-2 rounded-md hover:bg-gray-100">Suka</button>
            <button className="flex-1 text-center py-2 rounded-md hover:bg-gray-100">Komentari</button>
            <button className="flex-1 text-center py-2 rounded-md hover:bg-gray-100">Bagikan</button>
        </div>
    </div>
);

const TikTokPreview = ({ imageUrl, caption }) => (
    <div className="bg-black w-full max-w-[250px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-gray-800">
        <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <p className="font-bold text-sm">@akun_anda</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{caption}</p>
        </div>

        {/* Side Actions */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 text-white">
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg></div>
                <span className="text-xs font-semibold">12.3K</span>
            </div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.864 8.864 0 01-4.255-.949L2 18l1.395-3.72a8.282 8.282 0 01-.893-3.28C2.5 6.134 6.082 3 10.5 3c4.418 0 8 2.134 8 7z" clipRule="evenodd"></path></svg></div>
                <span className="text-xs font-semibold">1.2K</span>
            </div>
        </div>
    </div>
);

const SocialPreview = ({ platform, imageUrl, caption }) => {
    if (!imageUrl) {
        return (
            <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <p>Pratinjau akan muncul di sini</p>
            </div>
        );
    }

    switch (platform) {
        case 'instagram':
            return <InstagramPreview imageUrl={imageUrl} caption={caption} />;
        case 'facebook':
            return <FacebookPreview imageUrl={imageUrl} caption={caption} />;
        case 'tiktok':
            return <TikTokPreview imageUrl={imageUrl} caption={caption} />;
        default:
            return <InstagramPreview imageUrl={imageUrl} caption={caption} />;
    }
};

export default SocialPreview;