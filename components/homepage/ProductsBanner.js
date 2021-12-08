import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ProductRow from '../products/ProductRow';
import { connect } from 'react-redux';

class ProductsBanner extends Component {
  render() {
    const { products } = this.props;

    return (
      <div className="custom-container py-5 my-5">
        <div className="d-flex flex-column align-items-center mb-5 pb-4">
          <p className="font-color-medium mb-4">
            Présentation de nos derniers produits
          </p>
          <p
            className="text-center font-size-display1 mb-3 font-weight-medium font-color-principal"
            style={{ maxWidth: '32rem' }}
          >
            Jettez un coup d&#39;oeil.
          </p>
          <Link href="/collection">
            <a className="d-flex py-3 px-3 align-items-center font-color-white bg-secondaire" style={{borderRadius: "40px"}}>
              <p>Voir plus</p>
            </a>
          </Link>
        </div>
        <ProductRow products={products.slice(0, 4)} />
      </div>
    );
  }
}

ProductsBanner.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

ProductsBanner.defaultProps = {
  products: [],
};

export default connect(state => state)(ProductsBanner);
