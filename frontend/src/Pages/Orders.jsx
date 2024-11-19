import { useContext, useState, useEffect } from 'react';
import Title from '../Components/Title';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    if (!token) {
      toast.error('Please login to view orders.');
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/order/userOrders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
        }),
      });

      const data = await response.json();
      if (data.success) {
        const allOrdersItem = data.orders.map((item) => ({
          ...item,
          status: item.status || 'Pending', // Default status if not present
          payment: item.payment || false,
          paymentMethod: item.paymentMethod || 'Unknown',
          date: new Date(item.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }));
        setOrderData(allOrdersItem.reverse());
      } else {
        console.error('User have no orders or Unable to fetch orders')
      }
    } catch (error) {
      toast.error('Error fetching orders: ' + error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="pt-16 border-t">
      <div className="mb-3 text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500">You have no orders.</p>
      ) : (
        <div>
          {orderData.map((order, index) => {
            const productData = products?.find((product) => product._id === order.items[0]?._id);
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productData?.image[0] || '/placeholder.png'}
                    alt={productData?.name || 'Product Image'}
                    className="w-16 sm:w-20"
                  />

                  <div>
                    <p className="sm:text-base font-medium">{productData?.name || 'Unknown Product'}</p>
                    <div className="flex items-center gap-5 mt-2 text-base text-gray-700">
                      <p>
                        {currency}
                        {productData?.price || 'N/A'}
                      </p>
                      <p>Quantity: {order.items.length}</p>
                      <p>Size: {order.items[0]?.size || 'N/A'}</p>
                    </div>
                    <p className="mt-2">
                      Date: <span className="text-gray-400">{order.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-400"></p>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700">
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
