import React, { useContext, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  // Verifying the payment status and updating the cart
  const verifyPayment = async () => {
    if (!token) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/order/verifyStripe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            userId: localStorage.getItem('userId'),
            success, 
            orderId 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCartItems({}); // Clear cart in context after Stripe payment success
        toast.success("Payment successful, your order has been placed!");
        window.location.href = "/orders"; // Navigate and reload
      }
       else {
        toast.error("Payment failed. Please try again.");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("An error occurred while verifying your payment.");
      navigate("/cart");
    }
  };

  // Trigger payment verification after the component mounts
  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div>Loading...</div>;
};

export default Verify;
