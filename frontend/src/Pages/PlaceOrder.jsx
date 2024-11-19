import { useContext, useEffect, useState } from "react";
import CartTotal from "../Components/CartTotal"; // Replace with your actual CartTotal path
import Title from "../Components/Title"; // Replace with your Title component path
import { assets } from "../assets/assets"; // Replace with your assets path
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod"); // Default payment method
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent continuous requests
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    navigate,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const placeOrder = async (orderData) => {
    const endpoint = method === "cod" ? "/order/place" : "/order/stripe";
    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      // Clear the cart after placing the order, regardless of the payment method
      if (data.success) {
        setCartItems({});
        if (method === "cod") {
          navigate("/orders");
        } else if (method === "stripe" && data.session_url) {
          window.location.replace(data.session_url); // Redirect to Stripe
        }
      } else {
        toast.error(data.message || "Order placement failed.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // Enable the form again
    }
  };
  

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!token || !localStorage.getItem("userId")) {
      toast.error("Please login to place an order.");
      return;
    }

    const orderItems = [];
    Object.entries(cartItems).forEach(([itemId, sizes]) => {
      Object.entries(sizes).forEach(([size, quantity]) => {
        if (quantity > 0) {
          const item = products.find((product) => product._id === itemId);
          if (item) {
            orderItems.push({ ...item, size, quantity });
          }
        }
      });
    });

    if (!orderItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderData = {
      userId: localStorage.getItem("userId"),
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
      paymentMethod: method,
      origin: window.location.origin,
    };

    setIsSubmitting(true); // Prevent further submissions
    placeOrder(orderData);
  };

  useEffect(() => {
    if (isSubmitting) {
      toast.info("Processing your order...");
    }
  }, [isSubmitting]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min:h[80vh] border-t">
      {/* Left-Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
      </div>

      {/* Right-Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment Method */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" /> 
              {/* Stripe button */}
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-16 py-3 text-sm">
              {isSubmitting ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
