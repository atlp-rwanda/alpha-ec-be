import { cartProductInterface } from '../database/models/cart';
import Database from '../database';

export const calculateTotal = async (
  products: cartProductInterface[]
): Promise<number> => {
  const prices: Promise<number>[] = products.map(async product => {
    const data = await Database.Product.findOne({
      where: { id: product.productId },
      attributes: ['price'],
    });

    if (!data) return 0;

    return data.price * product.quantity;
  });
  const total = (await Promise.all(prices)).reduce(
    (acc, price) => acc + price,
    0
  );
  return total;
};

export const formatCartItems = async (products: cartProductInterface[]) => {
  const formattedProducts = await Promise.all(
    products.map(async product => {
      const data = await Database.Product.findOne({
        where: { id: product.productId },
        attributes: ['id', 'name', 'price', 'images'],
      });

      if (!data) return null;

      return {
        ...data.dataValues,
        quantity: product.quantity,
      };
    })
  );

  return formattedProducts.filter(product => product !== null);
};
