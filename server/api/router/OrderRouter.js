const router = require('express').Router();
const { Order, User, Product, OrderProduct } = require('../../db/index');

// GET API/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Product, through: { attributes: ['productQuantity'] } },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
  }
});

// POST API/orders
router.post('/', async (req, res, next) => {
  try {
    const orderProducts = req.body.orderProducts;
    const userId = req.session.userId;
    const order = await Order.addUpdateCart(orderProducts, userId);
    res.json(order);
    console.log('Order updated successfully:', order.id, 'Total:', order.orderTotal);
  } catch (error) {
    console.error(error);
  }
});

// POST API/orders/checkout
router.post('/checkout', async (req, res, next) => {
  try {
    const orderDetails = req.body.order;
    const order = await Order.checkout(orderDetails);
    res.json(order);
    console.log('Checkout successful:', order.id, 'Status:', order.status);
  } catch (error) {
    console.error(error);
  }
});
// /api/orders/:id (specific order, which includes products)
// router.get('/orders/:id', async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error);
//   }
// });

// NOT TESTED YET
// // /api/orders/:id (specific order, which includes products)
// router.get('/orders/:id', async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       where: { id: req.params.id },
//       include: { models: ['OrderProduct', 'Product', 'Session'] },
//     });
//     res.json(order);
//   } catch (e) {
//     console.log(e =>
//       console.error(`Could not get Order:${req.params.id} from database`, e)
//     );
//     res.sendStatus(500);
//   }
// });

// /api/users/:id/orders (all orders of a user)
// router.get('/users/:id/orders', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     const orders = await user.getOrders();
//     res.json(orders);
//   } catch (e) {
//     console.log(e =>
//       console.error(
//         `Could not get User:${req.params.id}'s Orders from database`,
//         e
//       )
//     );
//     res.sendStatus(500);
//   }
// });

// /api/users/:id/orders/:id (specific order of a user, which includes products)
// router.get('/users/:id/orders/:orderId', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     const orders = await user.getOrders();
//     const order = orders.filter(_order => _order.id === req.params.orderId)[0];
//     res.json(order);
//   } catch (e) {
//     console.log(e =>
//       console.error(
//         `Could not get User:${req.params.id}'s Order:${req.params.userId} from database`,
//         e
//       )
//     );
//     res.status(500);
//   }
// });

//post routes

//update routes
// router.get('/users/:id/orders/:orderId', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     const orders = await user.getOrders();
//     const order = orders.filter(_order => _order.id === req.params.orderId)[0];
//     res.json(order);
//   } catch (e) {
//     console.log(e =>
//       console.error(
//         `Could not get User:${req.params.id}'s Order:${
//           req.params.userId
//         } from database`,
//         e
//       )
//     );
//     res.sendStatus(500);
//   }
// });

module.exports = router;
