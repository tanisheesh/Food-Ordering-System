import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_MY_ORDERS, CHECKOUT_ORDER, CANCEL_ORDER, GET_PAYMENT_METHODS } from '@/lib/graphql/queries';
import Toast from '@/components/Toast';
import PaymentModal from '@/components/PaymentModal';
import CountryFlag from '@/components/CountryFlag';

export default function Orders() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: 'network-only',
  });
  const { data: paymentData } = useQuery(GET_PAYMENT_METHODS, {
    fetchPolicy: 'network-only',
  });
  const [checkoutOrder] = useMutation(CHECKOUT_ORDER);
  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userCountry, setUserCountry] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
    setUserRole(localStorage.getItem('userRole') || '');
    setUserCountry(localStorage.getItem('userCountry') || '');
  }, []);

  const handleCheckoutClick = (orderId: string) => {
    const paymentMethods = paymentData?.myPaymentMethods || [];
    if (paymentMethods.length === 0) {
      setToast({ message: 'Please add a payment method first', type: 'error' });
      return;
    }
    setSelectedOrderId(orderId);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      await checkoutOrder({ 
        variables: { orderId: selectedOrderId },
        refetchQueries: ['GetMyOrders'],
        awaitRefetchQueries: true,
      });
      setShowPaymentModal(false);
      setToast({ message: 'Payment successful! Order confirmed.', type: 'success' });
    } catch (err: any) {
      setShowPaymentModal(false);
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder({ 
        variables: { orderId },
        refetchQueries: ['GetMyOrders'],
        awaitRefetchQueries: true,
      });
      setToast({ message: 'Order cancelled successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const canCheckout = userRole === 'ADMIN' || userRole === 'MANAGER';
  const canCancel = userRole === 'ADMIN' || userRole === 'MANAGER';

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showPaymentModal && (
        <PaymentModal
          paymentMethods={paymentData?.myPaymentMethods || []}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
      
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
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
          <button onClick={() => router.push('/payments')} className="text-blue-600 hover:underline">
            Payments
          </button>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data?.myOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <button
              onClick={() => router.push('/restaurants')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.myOrders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      Ordered by: {order.user.name} ({order.user.role})
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-medium">{item.menuItem.name} <span className="text-gray-500">x{item.quantity}</span></span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl">Total: <span className="text-green-600">${order.totalAmount.toFixed(2)}</span></span>
                  <div className="space-x-2">
                    {order.status === 'PENDING' && canCheckout && (
                      <button
                        onClick={() => handleCheckoutClick(order.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Checkout & Pay
                      </button>
                    )}
                    {order.status === 'PENDING' && canCancel && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
