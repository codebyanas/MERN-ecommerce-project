import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { products as assetProducts } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [products, setProducts] = useState(assetProducts); // Initialize with asset products

  const addToCart = async (itemId, size) => {
    // Validate if size is correctly selected
    if (!size || size.trim() === "") {
      toast.error('Please select a size');
      return;
    }

    if (token) {
      try {
        // Make a request to the backend addToCart endpoint
        const response = await fetch(`${backendUrl}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token if required for auth
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'), // Assuming you store userId in localStorage
            itemId,
            size
          })
        });
  
        const data = await response.json();
  
        if (data.success) {
          // Update local cart data
          let cartData = structuredClone(cartItems);
          if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
          } else {
            cartData[itemId] = { [size]: 1 };
          }
          setCartItems(cartData);
          toast.success('Added to cart successfully!');
        } else {
          toast.error(data.message || 'Failed to add item to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const getUserCart = async () => {
    if (token) {
      try {
        const response = await fetch(`${backendUrl}/cart/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'), // Assuming you store userId in localStorage
          })
        });
  
        const data = await response.json();
  
        if (data.success) {
          setCartItems(data.cartData);
        } else {
          setCartItems({});
        }
      } catch (error) {
        console.error('Error fetching user cart:', error);
        toast.error('An error occurred while fetching user cart. Please try again.');
      }
    }
  }

  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    try {
      // Clone the cart items to avoid direct mutation
      let cartData = structuredClone(cartItems);
  
      // Check if item and size exist before updating
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
  
      setCartItems(cartData); // Update the state
  
      if (token) {
        const response = await fetch(`${backendUrl}/cart/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token if required for auth
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'), // Prefer parameter but fallback to localStorage
            itemId,
            size,
            quantity,
          }),
        });
  
        // Check if the response was successful
        if (!response.ok) {
          const errorMessage = (await response.json()).message || 'Failed to update cart quantity';
          toast.error(errorMessage);
          return;
        }
  
        const data = await response.json();
        if (data.success) {
          toast.success(`Updated cart successfully!`);
        } else {
          toast.error(data.message || 'Failed to update cart quantity');
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
  

  const getCartAmount = () => {
    if (products.length <= 0) {
      return 0; // No products, no amount
    }
  
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId) || { price: 0 };
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
    return totalAmount;
  };
  

  const getProductsData = async () => {
    try {
      const response = await fetch(`${backendUrl}/product/list`);
      const data = await response.json();
      // console.log('Fetched products:', data);

      if (data.success && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(assetProducts); // Fallback to asset products if no data is retrieved
        console.warn('Using default products due to fetch issue');
      }
    } catch (error) {
      setProducts(assetProducts); // Set asset products on fetch error
      toast.error('An error occurred while fetching products. Please try again.');
    }
  };
  

  useEffect(() => {
    getProductsData();
  }, []);

  const structuredClone = (obj) => JSON.parse(JSON.stringify(obj));

  const applyFilter = () => {
    let filteredProdCopy = [...products];
    if (category && category !== 'all') {
      filteredProdCopy = filteredProdCopy.filter((product) =>
        product.category.includes(category)
      );
    }
    if (subCategory && subCategory !== 'all') {
      filteredProdCopy = filteredProdCopy.filter((product) =>
        product.subCategory.includes(subCategory)
      );
    }
    if (search) {
      filteredProdCopy = filteredProdCopy.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilterProducts(filteredProdCopy);
  };

  useEffect(() => {
    if (token && localStorage.getItem('token')) {
      getUserCart(localStorage.getItem('token'));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder,
    orders,
    navigate,
    backendUrl,
    token,
    setToken
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
