import React from 'react';
import { connect } from 'react-redux';
import { CartFunctional } from './index';
import { checkout } from '../redux/reducers/order';

class Cart extends React.Component {
  //   componentDidMount() {
  //     // get the cart items upon mount
  //     console.log(this.props);
  //   }
  render() {
    const { cart } = this.props;
    return <CartFunctional cart={cart} checkout={checkout} />;
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
  };
};

const mapDispatchToProps = dispatch => ({
  checkout: (orderId, status) => dispatch(checkout(orderId, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
