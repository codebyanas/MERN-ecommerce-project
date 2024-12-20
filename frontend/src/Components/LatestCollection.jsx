import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const latest = products.slice(0, 10);
      setLatestProducts(latest);
    } else {
      console.warn("Products is not an array or is undefined");
      setLatestProducts([]); // Reset latestProducts to an empty array if products is not valid
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our newest arrivals that blend style and comfort. Explore the
          latest trends in fashion, curated just for you.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((product, idx) => (
          <ProductItem
            key={product._id || idx} // Fallback to index if _id is missing
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
