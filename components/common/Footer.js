import React from 'react';

const Footer = () => (
  <footer className="pt-5">
    <div className="custom-container mb-5 pb-5 pt-5">
      <div className="row">
        <div className="col-12 col-sm-6 col-md-4">
          <p className="font-size-display1 mb-4">
            Likbay
          </p>
          <div className="d-flex font-color-medium mb-5 pb-3 pb-md-0 mb-md-0">
            <div className="pr-5">
              <a
                href=""
                className="mb-3 d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Manuel d&#39;utilisation
              </a>
              <a
                href=""
                className="d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Caractéristiques
              </a>
            </div>
            <div>
              <a
                href="#"
                className="mb-3 d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                A propos
              </a>
              <a
                href="#"
                className="d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Communauté
              </a>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <p className="font-size-display1 mb-4">
            Socialisons
          </p>
          <div className="d-flex font-color-medium mb-5 pb-3 pb-md-0 mb-md-0">
            <div className="pr-5">
              <a
                href="https://twitter.com/LikbayC"
                className="mb-3 d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://www.instagram.com/likbay/"
                className="d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
            <div>
              <a
                href="https://www.facebook.com/likbay.co"
                className="mb-3 d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/in/likbay-group-576ab71b7/"
                className="d-block font-color-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <p className="font-size-display1 mb-3">
            Newsletter
          </p>
          <div className="position-relative">
            <input
              className="borderbottom border-color-gray400 h-48 w-100 px-3"
              placeholder="Adresse Email"
            />
            <button className="bg-transparent position-absolute right-0 top-50 translateY--50 pr-2 h-48">
              <img src="/icon/arrow-long-right.svg" className="w-24" alt="Arrow icon"/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="pt-md-2">
      <div className="bg-brand300">
        <div className="custom-container d-flex flex-column flex-md-row align-items-center justify-content-between">
          {/*<div className="pt-2 pb-0 pt-md-2 pb-md-4 d-flex align-items-center flex-wrap justify-content-center">
            <a
              href="https://app.netlify.com/start/deploy?repository=https://github.com/chec/commercejs-nextjs-demo-store"
              className="font-color-brand font-size-caption text-uppercase text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Deploy to Netlify
            </a>
            <p className="px-2 font-color-brand font-size-caption">-</p>
            <a
              href="https://github.com/chec/commercejs-nextjs-demo-store"
              className="font-color-brand font-size-caption text-uppercase text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone in GitHub
            </a>
            <p className="px-2 font-color-brand font-size-caption">-</p>
            <a
              href="https://github.com/chec/commercejs-nextjs-demo-store"
              className="font-color-brand font-size-caption text-uppercase text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </div>*/}
          <div className="font-color-brand font-size-caption py-4 text-right">
          <a
              href="https://commercejs.com/"
              className="font-color-brand font-size-caption text-uppercase text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              &copy; { new Date().getFullYear() } Likbay.
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
