import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Navbar,
  Login,
  SignUp,
  AllProducts,
  SingleProductView,
  Cart,
} from './index';
import { fetchAuthStatus } from '../redux/reducers/user';
import store from '../redux/store';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme, { partOptions } from '../themes';
import Particles from 'react-particles-js';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.getAuthStatus = this.getAuthStatus.bind(this);
  }

  getAuthStatus() {
    store.dispatch(fetchAuthStatus());
  }

  componentDidMount() {
    // getAuthStatus hits /api/auth and puts on the store
    this.getAuthStatus();
  }
  componentDidUpdate() {
    // getAuthStatus hits /api/auth and puts on the store
    this.getAuthStatus();
  }
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Navbar />
          <Particles className="particles" params={partOptions} />
          <div id="main">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route exact path="/" component={AllProducts} />
              <Route path="/products/:id" component={SingleProductView} />
              <Route path="/cart" component={Cart} />
              <Redirect path="/products" to="/" />
            </Switch>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Main;
