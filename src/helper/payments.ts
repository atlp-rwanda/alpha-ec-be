import Database from '../database';

export const updateOrderStatus = async (orderId: string) => {
  const productOrders = await Database.ProductOrder.findAll({
    where: { orderId },
  });

  const allPaid = productOrders.every(order => order.status === 'accepted');

  const order = await Database.Order.findByPk(orderId);
  if (!order) {
    return;
  }

  if (allPaid) {
    await order.update({ status: 'accepted' });
  } else {
    await order.update({ status: 'pending' });
  }
  await order.save();
};
