import React from 'react';
import Link from 'next/link';

export default function HomeBanner() {
  return (
    <div className="p-1">
      <p
        className="font-size-display1 mt-5 text-center mx-auto text-uppercase font-color-principal"
        style={{ maxWidth: '53rem' }}
      >
        Likbay est votre nouveau partenaire de shopping avec livraison à domicile.
      </p>
      <div className="d-flex align-items-center justify-content-center mt-3 mb-5">
        <Link href="/about">
          <a className="d-flex py-3 px-3 align-items-center btn-skip">
            <p >En savoir plus</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
