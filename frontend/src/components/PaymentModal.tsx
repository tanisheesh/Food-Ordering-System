import { useState } from 'react';

const PAYMENT_PROCESSING_TIME = 5000;

interface PaymentModalProps {
  paymentMethods: any[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ paymentMethods, onConfirm, onCancel }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!selectedPayment) return;
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, PAYMENT_PROCESSING_TIME));
    
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {isProcessing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Please wait while we process your payment</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-semibold mb-4">No payment methods available</p>
                <p className="text-gray-600 mb-4">Please add a payment method first</p>
                <button
                  onClick={onCancel}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method: any) => (
                    <label
                      key={method.id}
                      className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                        selectedPayment === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-semibold">{method.cardHolder}</span>
                      <p className="text-sm text-gray-600 font-mono ml-6">
                        {method.cardNumber.slice(0, 4)} {method.cardNumber.slice(4, 8)} {method.cardNumber.slice(8, 12)} {method.cardNumber.slice(12, 16)}
                      </p>
                      <p className="text-xs text-gray-500 ml-6">Expires: {method.expiryDate}</p>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedPayment || isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Pay Now
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
