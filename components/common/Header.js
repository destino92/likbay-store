import React, { Component } from 'react';
import Link from 'next/link';
import Cart from '../cart/Cart';
import commerce from '../../lib/commerce';
import Animation from '../cart/Animation';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux'
import { clearCustomer } from '../../store/actions/authenticateActions';

const duration = 300;

const defaultStyle = {
  zIndex: '-1',
  transition: `height ${duration}ms ease-in-out`,
  height: 0
};

const transitionStyles = {
  entering: { height: '100vh' },
  entered: { height: '100vh' },
  exiting: { height: 0 },
  exited: { height: 0 }
};

const mobileMenuLinks = [
  {
    name: 'Home',
    link: '/'
  },
  {
    name: 'Shop',
    link: '/collection'
  },
  {
    name: 'A propos',
    link: '/about'
  }
];

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMobileMenu: false,
      showCart: false,
      playAddToCartAnimation: false,
      loggedIn: false,
    };

    this.header = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.setState({
      loggedIn: commerce.customer.isLoggedIn(),
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('Commercejs.Cart.Item.Added', this.handleAddToCartToggle);
  }

  toggleCart() {
    const { showCart } = this.state;
    this.setState({
      showCart: !showCart,
    });
  }

  handleScroll() {
    window.requestAnimationFrame(this.animate);
  }


  handleLogout() {
    this.props.clearCustomer();
    this.setState({
      loggedIn: false,
    });
  }

 

  toggleMobileMenu() {
    const { showMobileMenu } = this.state;
    this.setState({ showMobileMenu: !showMobileMenu });
  }


  renderLoginLogout() {
    const { customer } = this.props;
    const { loggedIn } = this.state;

    if (loggedIn) {
      return (
        <div className="d-flex align-items-center">
          { customer && customer.firstname && (
            <span className="mr-2 font-weight-regular">
              Hi, { customer.firstname }!
            </span>
          ) }
          <Link href="/account">
            <a className="font-color-black mx-2">
              My account
            </a>
          </Link>
          <button
            className="bg-transparent mr-2 font-color-black font-weight-semibold"
            type="button"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <Link href="/login">
        <a className="font-color-black login">
          Login
        </a>
      </Link>
    );
  }

  render() {
    const { showMobileMenu, showCart } = this.state;
    const { transparent, cart } = this.props;

    return (
      <header className="top-0 left-0 right-0 font-weight-semibold no-print">
        <Cart isOpen={showCart} toggle={value => this.toggleCart(value)} />
        <div
          ref={this.header}
          className={`d-flex header align-items-center justify-content-between position-relative ${
            transparent ? '' : 'invert'
          }`}
        >
          <div className="logo-container">
            <img
              src={`/icon/${showMobileMenu ? 'cross' : 'menu'}.svg`}
              onClick={this.toggleMobileMenu}
              className="w-32 mr-1 d-block d-sm-none"
              alt="Menu icon"
            />
            <Link href="/">
              <a>
                <img
                  src="/images/logo.png"
                  className="logo cursor-pointer"
                  alt="Logo"
                />
              </a>
            </Link>
          </div>
          <div className="d-none d-sm-flex">
            <Link href="/collection">
              <a className="font-color-white">Shop</a>
            </Link>
            {/*<Link href="/about">
              <a className="font-color-black">A propos</a>
            </Link>*/}
          </div>
          <div className="d-flex">
            {/* process.browser && this.renderLoginLogout() */}
            <div
              className="position-relative cursor-pointer"
              onClick={this.toggleCart}
            >
              <Animation className={`${cart.total_items !== 0 ? 'cart-count-bg' : ''}`} />
              <div className="cart-count position-absolute font-size-tiny font-weight-bold">
                {cart.total_items}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition in={showMobileMenu} timeout={duration}>
          {state => (
            <div
              className="d-sm-none position-fixed left-0 right-0 overflow-hidden"
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
                // Prevent gap being shown at bottom of mobile menu
                top: '1em'
              }}
            >
              <div
                className="position-absolute left-0 right-0 h-100vh mobile-menu-inner bg-black700 d-flex flex-column justify-content-center"
                style={{
                  // Prevent mobile menu items (e.g. Home) being hidden behind navbar on small screen heights (e.g. iPhone4 landscape of 320px height)
                  top: '4em'
                }}
              >
                {mobileMenuLinks.map((item, i) => (
                  <Link key={i} href={item.link}>
                    <a className="d-block mb-4 font-size-heading font-color-white text-center">
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Transition>
      </header>
    );
  }
}

export default connect(
  state => state,
  { clearCustomer },
)(Header);
