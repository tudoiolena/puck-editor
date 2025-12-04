export const FileUpload = {
  fields: {
    name: { type: 'text' as const, label: 'Field Name' },
    label: { type: 'text' as const, label: 'Label' },
    required: {
      type: 'radio' as const,
      options: [
        { label: 'Required', value: true },
        { label: 'Optional', value: false },
      ],
    },
    accept: {
      type: 'select' as const,
      label: 'File Types',
      options: [
        { label: 'All Files', value: '*' },
        { label: 'Images Only', value: 'image/*' },
        { label: 'Documents Only', value: '.pdf,.doc,.docx,.txt' },
        { label: 'Images & Documents', value: 'image/*,.pdf,.doc,.docx,.txt' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    maxSize: {
      type: 'select' as const,
      label: 'Max File Size',
      options: [
        { label: '1 MB', value: 1024 * 1024 },
        { label: '5 MB', value: 5 * 1024 * 1024 },
        { label: '10 MB', value: 10 * 1024 * 1024 },
        { label: '25 MB', value: 25 * 1024 * 1024 },
        { label: '50 MB', value: 50 * 1024 * 1024 },
      ],
    },
    helperText: { type: 'text' as const, label: 'Helper Text' },
  },
  defaultProps: {
    name: 'file',
    label: 'Upload File',
    required: false,
    accept: '*',
    maxSize: 5 * 1024 * 1024, // 5MB
    helperText: '',
  },
  render: (props) => {
    const { name, label, required, accept, maxSize, helperText } = props;
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const acceptText =
      accept === '*'
        ? 'All files'
        : accept === 'image/*'
          ? 'Images only'
          : accept === '.pdf,.doc,.docx,.txt'
            ? 'Documents only'
            : accept === 'image/*,.pdf,.doc,.docx,.txt'
              ? 'Images and documents'
              : 'Custom types';

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={name}
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id={name}
                  name={name}
                  type="file"
                  className="sr-only"
                  accept={accept === 'custom' ? '' : accept}
                  required={required}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              {acceptText} up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
        {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
};
