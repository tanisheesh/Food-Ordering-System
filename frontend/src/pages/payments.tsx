import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_PAYMENT_METHODS, ADD_PAYMENT_METHOD, UPDATE_PAYMENT_METHOD, DELETE_PAYMENT_METHOD } from '@/lib/graphql/queries';
import Toast from '@/components/Toast';
import CountryFlag from '@/components/CountryFlag';

export default function Payments() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_PAYMENT_METHODS, {
    fetchPolicy: 'network-only',
  });
  const [addPaymentMethod] = useMutation(ADD_PAYMENT_METHOD);
  const [updatePaymentMethod] = useMutation(UPDATE_PAYMENT_METHOD);
  const [deletePaymentMethod] = useMutation(DELETE_PAYMENT_METHOD);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userCountry, setUserCountry] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
    setUserRole(localStorage.getItem('userRole') || '');
    setUserCountry(localStorage.getItem('userCountry') || '');
  }, []);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCardNumber('');
    setCardHolder('');
    setExpiryMonth('');
    setExpiryYear('');
  };

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setCardNumber(formatCardNumber(method.cardNumber));
    setCardHolder(method.cardHolder);
    const [month, year] = method.expiryDate.split('/');
    setExpiryMonth(month);
    setExpiryYear(year);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await deletePaymentMethod({ 
        variables: { id },
        refetchQueries: ['GetPaymentMethods'],
        awaitRefetchQueries: true,
      });
      setToast({ message: 'Payment method deleted successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      setToast({ message: 'Card number must be 16 digits', type: 'error' });
      return;
    }
    if (!expiryMonth || !expiryYear) {
      setToast({ message: 'Please enter expiry date', type: 'error' });
      return;
    }
    const monthNum = parseInt(expiryMonth);
    if (monthNum < 1 || monthNum > 12) {
      setToast({ message: 'Month must be between 01 and 12', type: 'error' });
      return;
    }
    const expiryDate = `${expiryMonth.padStart(2, '0')}/${expiryYear}`;
    
    try {
      if (editingId) {
        await updatePaymentMethod({ 
          variables: { 
            id: editingId, 
            cardNumber: cleanCardNumber, 
            cardHolder, 
            expiryDate 
          },
          refetchQueries: ['GetPaymentMethods'],
          awaitRefetchQueries: true,
        });
        setToast({ message: 'Payment method updated successfully!', type: 'success' });
      } else {
        await addPaymentMethod({ 
          variables: { cardNumber: cleanCardNumber, cardHolder, expiryDate },
          refetchQueries: ['GetPaymentMethods'],
          awaitRefetchQueries: true,
        });
        setToast({ message: 'Payment method added successfully!', type: 'success' });
      }
      resetForm();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const canManagePayments = userRole === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {userName} • {userRole}
            {userRole !== 'ADMIN' && userCountry && (
              <>
                {' • '}
                <CountryFlag country={userCountry} size={16} />
                {userCountry === 'INDIA' ? 'India' : 'America'}
              </>
            )}
          </p>
        </div>
        <div className="space-x-4">
          <button onClick={() => router.push('/restaurants')} className="text-blue-600 hover:underline">
            Restaurants
          </button>
          <button onClick={() => router.push('/orders')} className="text-blue-600 hover:underline">
            My Orders
          </button>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-2xl">
        {canManagePayments && (
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : editingId ? 'Edit Payment Method' : 'Add Payment Method'}
          </button>
        )}

        {showForm && (
          <form onSubmit={handleAddPayment} className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-2 border rounded font-mono"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">16 digits</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card Holder</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={expiryMonth}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                      const num = parseInt(val);
                      if (val === '' || (num >= 1 && num <= 12)) {
                        setExpiryMonth(val);
                      }
                    }}
                    className="w-20 px-4 py-2 border rounded text-center"
                    placeholder="MM"
                    maxLength={2}
                    required
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="text"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="w-20 px-4 py-2 border rounded text-center"
                    placeholder="YY"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {editingId ? 'Update Payment Method' : 'Add Payment Method'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading payment methods...</p>
        ) : data?.myPaymentMethods.length === 0 ? (
          <p className="text-gray-500">No payment methods added</p>
        ) : (
          <div className="space-y-4">
            {data?.myPaymentMethods.map((method: any) => (
              <div key={method.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{method.cardHolder}</p>
                    <p className="text-gray-600 font-mono">
                      {method.cardNumber.slice(0, 4)} {method.cardNumber.slice(4, 8)} {method.cardNumber.slice(8, 12)} {method.cardNumber.slice(12, 16)}
                    </p>
                    <p className="text-sm text-gray-500">Expires: {method.expiryDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                        Default
                      </span>
                    )}
                    {canManagePayments && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(method)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(method.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!canManagePayments && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-800">Only admins can add or modify payment methods.</p>
          </div>
        )}
      </div>
    </div>
  );
}
