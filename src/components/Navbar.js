import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { postLogout } from '../redux/reducers/user';

// Material UI requirements
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LocalDrink from '@material-ui/icons/LocalDrink';
import { withStyles } from '@material-ui/core/styles';

// apparently MakeStyles isn't needed when styling a class component
// using Material UI's makeStyles to create style objects
const styles = () => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

class Navbar extends React.Component {
  render() {
    const { logout, loggedIn, classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Link to="/">
              <LocalDrink color="primary" style={{ marginRight: '15px' }} />
            </Link>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              component={Link}
              to="/"
              style={{ textDecoration: 'none' }}
            >
              BEEROTOPIA
            </Typography>
            {loggedIn ? (
              <div>
                <Button color="inherit" onClick={() => logout()}>
                  Logout
                </Button>
                <IconButton
                  edge="end"
                  aria-label="Account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
            ) : (
              <div>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/signup" color="inherit">
                  Sign Up
                </Button>
                <Button component={Link} to="/cart" color="inherit">
                  {this.props.cartLen
                    ? `Cart (${this.props.cartLen})`
                    : 'Cart (0)'}
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.users.loggedInUser,
  loggedIn: state.users.loggedIn,
  cartLen: state.orders.cartLen, // doesn't work yet TODO
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => {
    dispatch(postLogout(ownProps.history));
  },
});

// proptypes to do typechecking
Navbar.propTypes = {
  loggedInUser: PropTypes.object,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const StyledNavbar = withStyles(styles)(Navbar);
const ConnectedNavbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledNavbar);

export default withRouter(ConnectedNavbar);
