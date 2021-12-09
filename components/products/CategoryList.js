import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';

/**
 * Renders a list of categories and the number of products in each category. Used for product list
 * view sidebars.
 */
export default connect(({ categories }) => ({ categories }))(
  ({ categories, current, className }) => (
    <div className={className}>
      <h3 className="font-size-title font-weight-medium mb-3">Produits</h3>
      <ul style={{ 'listStyleType': 'none' }} className="pl-0">
        { categories.filter(category => current === category.id).map(category => (
          <li key={category.slug}>
            <Link href={`/collection#${category.slug}`}>
              <a
                style={{ 'fontWeight': 'bold' }}
                key={category.id} className="pb-2 cursor-pointer font-color-secondaire"
              >
                { category.name }{"     "}<span className="badge rounded-pill bg-principal font-color-white">{ category.products }</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
);
