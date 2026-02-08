import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_RESTAURANTS, CREATE_ORDER } from '@/lib/graphql/queries';
import Toast from '@/components/Toast';
import CountryFlag from '@/components/CountryFlag';

export default function Restaurants() {
  const router = useRouter();
  const { data, loading } = useQuery(GET_RESTAURANTS, {
    fetchPolicy: 'network-only', // Always fetch fresh data from server
  });
  const [createOrder] = useMutation(CREATE_ORDER);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userCountry, setUserCountry] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
    setUserRole(localStorage.getItem('userRole') || '');
    setUserCountry(localStorage.getItem('userCountry') || '');
  }, []);

  const addToCart = (restaurantId: string, menuItem: any) => {
    setSelectedRestaurant(restaurantId);
    const existing = cart.find(item => item.menuItemId === menuItem.id);
    if (existing) {
      setCart(cart.map(item => 
        item.menuItemId === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menuItemId: menuItem.id, quantity: 1, name: menuItem.name, price: menuItem.price }]);
    }
    setToast({ message: `${menuItem.name} added to cart`, type: 'success' });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = async () => {
    if (!selectedRestaurant || cart.length === 0) return;
    try {
      const result = await createOrder({
        variables: {
          restaurantId: selectedRestaurant,
          items: cart.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
        },
        refetchQueries: ['GetMyOrders'],
        awaitRefetchQueries: true,
      });
      
      if (result.data) {
        setToast({ message: 'Order created successfully!', type: 'success' });
        setCart([]);
        setSelectedRestaurant(null);
        setTimeout(() => router.push('/orders'), 1500);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to create order', type: 'error' });
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
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
          <button onClick={() => router.push('/orders')} className="text-blue-600 hover:underline">
            My Orders
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
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {data?.restaurants.map((restaurant: any) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
                    <p className="text-gray-600">{restaurant.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {restaurant.menuItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:border-blue-500 transition">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600 text-lg">${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => addToCart(restaurant.id, item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🛒 Cart
                {cart.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
                )}
              </h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="border-b pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{item.name}</span>
                          <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, -1)}
                              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Create Order
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
