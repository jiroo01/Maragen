import React from 'react';
import { ExclamationTriangleIcon } from './icons';

const WarningModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-bold text-gray-900">
                      Peringatan Penjadwalan
                  </h3>
                  <div className="mt-2">
                      <p className="text-sm text-gray-600">
                      {message}
                      </p>
                  </div>
              </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
            >
                Mengerti
            </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;