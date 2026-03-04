import { createRoot } from 'react-dom/client';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <FaCheckCircle className="text-white text-xl" />;
            case 'error': return <FaExclamationCircle className="text-white text-xl" />;
            case 'warning': return <FaExclamationTriangle className="text-white text-xl" />;
            default: return <FaInfoCircle className="text-white text-xl" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className={`${getBgColor()} rounded-lg shadow-lg overflow-hidden w-80 transition-all duration-300`}>
            <div className="p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white">{message}</p>
                    </div>
                    <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                        <FaTimes />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = `toast-${Date.now()}`;
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    container.appendChild(toastElement);

    const root = createRoot(toastElement);

    const removeToast = () => {
        root.unmount();
        toastElement.remove();
    };

    root.render(<Toast message={message} type={type} onClose={removeToast} />);

    setTimeout(removeToast, 3000);
};

window.showToast = showToast;
