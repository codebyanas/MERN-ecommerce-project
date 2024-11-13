import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { products as assetProducts } from '../assets/assets'; // Rename to avoid naming conflict
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// 9:54:50

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
  const [token, setToken] = useState([]);
  const [products, setProducts] = useState(assetProducts); // Initialize with asset products

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size]
        ? (cartData[itemId][size] += 1)
        : (cartData[itemId][size] = 1);
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

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
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = products.find((product) => product._id === item);
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await fetch(`${backendUrl}/product/list`);
      const data = await response.json();
      console.log('Fetched products:', data);

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
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
