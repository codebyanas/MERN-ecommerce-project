import { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      console.log('Token is null');
      return;
    }
    if (!backendUrl) {
      console.log('BackendUrl is null');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/order/list`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log(data);

        setOrders(data.orders);
      } else {
        toast.error('Error fetching orders:', data.message);
      }

    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Fetch error:', error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await fetch(backendUrl + "/order/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          orderId, 
          status: event.target.value
         }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        await fetchAllOrders();
      } else {
        // eslint-disable-next-line no-undef
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-undef
      toast.error("An error occurred while updating the status");
    }
  };
  
  useEffect(() => {
      if (token) {
        fetchAllOrders();
      }
    }, [token]);

    return (
      <div>
        <h3>Order Page</h3>
        <div>
          {orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}>
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <p className="py-0.5" key={index}>
                          {item.name} X {item.quantity} <span>{item.size}</span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="py-0.5" key={index}>
                          {item.name} X {item.quantity} <span>{item.size}</span> ,
                        </p>
                      );
                    }
                  })}
                </div>
                <div>
                  <p className="mt-3 mb-2 font-medium">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                </div>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">
                  Items : {order.items.length}
                </p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">
                {currency}
                {order.amount}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold">
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

