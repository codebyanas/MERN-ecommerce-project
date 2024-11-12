import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

function List({ token }) {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await fetch(`${backendUrl}/product/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data.success) {
        // Update to access products array within the data object
        setList(data.products || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Fetch list error:", error);
      toast.error("An error occurred while fetching the product list.");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/product/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        // Re-fetch the product list after deletion
        fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Remove product error:", error);
      toast.error("An error occurred while removing the product.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {Array.isArray(list) && list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img
                className="w-12"
                src={item.image[0]} // Use the first image URL directly
                alt={item.name}
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <p
                className="text-lg text-right cursor-pointer md:text-center text-red-500"
                onClick={() => removeProduct(item._id)}
              >
                X
              </p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </>
  );
}

export default List;
