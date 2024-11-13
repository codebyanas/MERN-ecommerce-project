import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      // Ensure all products, including asset products, have a 'bestSeller' property
      const bestSellerItems = products.filter((product) => product.bestSeller);
      setBestSeller(bestSellerItems);
    } else {
      console.warn('Products is not an array or is undefined');
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 mb-12 text-4xl text-center">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-lg font-light text-gray-700 sm:text-lg">
          Explore our most sought-after products, curated to meet your every
          need with quality, style, and unbeatable value.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid gap-6 place-items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10">
        {bestSeller.length > 0 ? (
          bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <p>No best seller items available.</p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
