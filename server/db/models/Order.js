const Sequelize = require('sequelize');
const db = require('../connection');

const PENDING = 'PENDING';
const COMPLETE = 'COMPLETE';

const Order = db.define('order', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  orderTotal: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      isInt: true,
    },
  },
  status: {
    type: Sequelize.ENUM(PENDING, COMPLETE),
    defaultValue: PENDING,
  },
});

Order.addUpdateCart = async function(orderProducts, userId) {
  try {
    const [order] = await Order.findOrCreate({where: {userId, status: PENDING} });

    let tempOrderTotal = order.orderTotal;

    const productObj = orderProducts[0];

    const { product, quantity } = productObj;
    const Product = db.models.product;
    const OrderProduct = db.models.orderProduct;

    // get price from db instead of trusting the price contained in client request
    const foundProduct = await Product.findByPk(product.id)
    let price = foundProduct.price;
    tempOrderTotal += price;

    // if product exists in cart, update quantity. else add product
    const [joinRow] = await OrderProduct.findOrCreate({where: {orderId: order.id, productId: foundProduct.id}});
    await joinRow.update({
      productQuantity: joinRow.productQuantity + quantity,
    });

    // in either case, update the order total
    const updatedOrder = await order.update({ orderTotal: tempOrderTotal });

    const orderProducts = await OrderProduct.findAll({where: {orderId: updatedOrder.id}});
    const cartLen = orderProducts.length;
    let cart = {};
    cart.orderProducts = orderProducts;
    cart.cartLen = cartLen;
    return cart;

  } catch (error) {
    console.error(error);
  } 
}

Order.checkout = async function (id) {
  try {
    const User = db.models.user;
    const foundOrder = Order.findOne({where: {id}, include: [User]});
    const { user } = foundOrder;
    const { addressLine1, city, state, zipCode } = user;
    
    const products = await foundOrder.getProducts();
    if (!products.length) {
      console.error('Cannot checkout with an empty cart');
    } else if (!(addressLine1 || city || state || zipCode)) {
      console.error('Cannot checkout without an address');
    }
      else {
        const completeOrder = await foundOrder.update({status: COMPLETE});
        return completeOrder;
      }
    } catch (error) {
        console.error(error);
  }
}

module.exports = Order;
