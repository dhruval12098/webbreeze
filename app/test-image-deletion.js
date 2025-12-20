'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { deleteImageFromStorage, getFileNameFromUrl } from '../lib/imageService';

export default function TestImageDeletion() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState('');

  const testFileNameExtraction = () => {
    const extracted = getFileNameFromUrl(imageUrl);
    setFileName(extracted);
  };

  const testDeletion = async () => {
    try {
      const deleteResult = await deleteImageFromStorage(imageUrl, supabase);
      setResult(deleteResult);
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Image Deletion</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Image URL:</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter full image URL"
        />
      </div>
      
      <div className="mb-4">
        <button 
          onClick={testFileNameExtraction}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Extract Filename
        </button>
        
        <button 
          onClick={testDeletion}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Test Deletion
        </button>
      </div>
      
      {fileName && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <strong>Extracted Filename:</strong> {fileName}
        </div>
      )}
      
      {result && (
        <div className={`mb-4 p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <strong>Result:</strong> 
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}