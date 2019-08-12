import axios from 'axios';

// Constants
const ORDER_REQUEST = 'ORDER_REQUEST';
const ORDER_REQUEST_FAILURE = 'ORDER_REQUEST_FAILURE';
const GET_ORDER = 'GET_ORDER';
const GET_ORDERS = 'GET_ORDERS';
const CHECKOUT = 'CHECKOUT';

// Action Creators
const fetchingOrderData = () => ({
    type: ORDER_REQUEST,
});

const fetchingOrderDataError = error => ({
    type: ORDER_REQUEST_FAILURE,
    error: 'Failed to fetch order data',
    payload: error,
});

const getOrder = (order) => ({
    type: GET_ORDER,
		order,
		status: order.status,
  });

const getOrders = (orders, status = null) => ({
    type: GET_ORDERS,
		orders,
		status,
});

const postCheckout = (orderDetails) => ({
  type: CHECKOUT,
  orderDetails,
})

// Thunks
export const postOrder = order => dispatch => {
    axios.post('/api/orders', order)
    .then(({ data }) => {
      dispatch(getOrder(data));
    })
    .catch(error => console.log(error))
}

export const fetchOrdersByStatus = orderStatus => dispatch => {
    dispatch(fetchingOrderData());
    axios
      .get(`/api/orders?${orderStatus}`)
      .then(({ data }) => dispatch(getOrders(data)))
      .catch(error => dispatch(fetchingOrderDataError(error)));
  };

export const fetchOrdersByUser = user => dispatch => {
    dispatch(fetchingOrderData());
    axios
      .get(`/api/users/${user.id}/orders`)
      .then(({ data }) => dispatch(getOrders(data)))
      .catch(error => dispatch(fetchingOrderDataError(error)));
}

export const fetchOrder = (order, user) => dispatch => {
    dispatch(fetchingOrderData());
    axios
			.get(`/api/users/${user.id}/orders/${order.id}`)
			.then(({ data }) => dispatch(getOrder(data)))
			.catch(error => dispatch(fetchingOrderDataError(error)));
};

export const checkout = (orderDetails) => dispatch => {
  const { order } = orderDetails;
  axios
  .post(`/api/orders/checkout/${order.id}`, orderDetails)
  .then(({ data }) => {
    dispatch(postCheckout(data));
  })
  .catch(error => console.log(error))
}

// Reducers
const initialState = {
    orders: [],
		order: {},
		carts: [],
		cart: {},
    isFetching: false,
}

const orders = (state = initialState, action) => {
    switch (action.type) {
      case ORDER_REQUEST:
        return { ...state, isFetching: true };
      case GET_ORDERS:
					if (action.status === 'PENDING') {
						return { ...state, carts: action.orders, isFetching: false };
					} else {
						return { ...state, orders: action.orders, isFetching: false };
					}
			case GET_ORDER:
				if (action.status === 'PENDING') {
					return { ...state, cart: action.order, isFetching: false };
				} else {
					return { ...state, order: action.order, isFetching: false };
          }
      case CHECKOUT:
        return {...state, cart: {}};
      default:
        return state;
    }
  };

export default orders;
