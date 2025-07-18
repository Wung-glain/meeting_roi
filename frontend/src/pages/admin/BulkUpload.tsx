import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";


const BulkUploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus('Uploading...');
    // Simulate file upload
    setTimeout(() => {
      console.log('Uploading file:', selectedFile.name);
      setUploadStatus(`File "${selectedFile.name}" uploaded successfully! (Mock)`);
      setSelectedFile(null); // Clear selected file after upload
    }, 2000);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Bulk Data Upload</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <UploadCloud size={24} className="mr-2 text-indigo-500" /> Upload Meeting Data (CSV)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Upload your meeting data in CSV format to analyze in bulk.
        </p>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200 dark:hover:file:bg-indigo-800"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Selected file: {selectedFile.name}</p>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === 'Uploading...'}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploadStatus === 'Uploading...' ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={20} /> Uploading...
              </span>
            ) : (
              'Upload Data'
            )}
          </button>
          {uploadStatus && uploadStatus !== 'Uploading...' && (
            <p className={`text-sm ${uploadStatus.includes('successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BulkUploadSection;