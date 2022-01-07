import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import ccFormat from '../../utils/ccFormat';
import commerce from '../../lib/commerce';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Checkbox from '../../components/common/atoms/Checkbox';
import Dropdown from '../../components/common/atoms/Dropdown';
import Radiobox from '../../components/common/atoms/Radiobox';
import Root from '../../components/common/Root';
import AddressForm from '../../components/checkout/common/AddressForm';
import PaymentDetails from '../../components/checkout/common/PaymentDetails';
import Loader from '../../components/checkout/Loader';
import {
  generateCheckoutTokenFromCart as dispatchGenerateCheckout,
  getShippingOptionsForCheckout as dispatchGetShippingOptions,
  setShippingOptionInCheckout as dispatchSetShippingOptionsInCheckout,
  setDiscountCodeInCheckout as dispatchSetDiscountCodeInCheckout,
  captureOrder as dispatchCaptureOrder,
} from '../../store/actions/checkoutActions';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { CardElement, Elements, ElementsConsumer } from '@stripe/react-stripe-js';

const billingOptions = ['Same as shipping Address', 'Use a different billing address'];

const checkoutSchema = Yup.object().shape({
  "first_name": Yup.string().required("Le champ Prénom ne peut pas etre vide"),
  "last_name": Yup.string().required("Le champ Nom ne peut pas etre vide"),
  "phone": Yup.string().required("Le champ Téléphone ne peut pas etre vide"),
  'name': Yup.string().required("Le champ Nom complet ne peut pas etre vide"),
  'street': Yup.string().required("Le champ Adresse ne peut pas etre vide"),
  'town_city': Yup.string().required("Le champ Ville ne peut pas etre vide"),
  'region': Yup.string().required("Le champ Région ne peut pas etre vide"),
  'shipping_method': Yup.string().required("Le champ mode de livraison ne peut pas etre vide"),
});

/**
 * Render the checkout page
 */
class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBillingOption: billingOptions[0],

      // string property names to conveniently identify inputs related to commerce.js validation errors
      // e.g error { param: "shipping[name]"}
      'customer[first_name]': '',
      'customer[last_name]': '',
      'customer[email]': '',
      'customer[phone]': '',
      'customer[id]': null,
      'shipping[name]': '',
      'shipping[street]': '',
      'shipping[street_2]': '',
      'shipping[town_city]': '',
      'shipping[region]': '',
      'shipping[postal_zip_code]': '00242',
      'shipping[country]': 'CG',
      'billing[name]': '',
      'billing[street]': '',
      'billing[street_2]': '',
      'billing[town_city]': '',
      'billing[region]': '',
      'billing[postal_zip_code]': '',
      'billing[country]': 'CG',
      receiveNewsletter: true,
      orderNotes: '',
      countries: {},

      'fulfillment[shipping_method]': '',
      cardNumber: ccFormat('4242424242424242'),
      expMonth: '11',
      expYear: '22',
      cvc: '123',
      billingPostalZipcode: 'V6B 2V2',

      errors: {
        'fulfillment[shipping_method]': null,
        gateway_error: null,
        'customer[email]': null,
        'shipping[name]': null,
        'shipping[street]': null,
        'shipping[town_city]': null,
        'shipping[postal_zip_code]': null
      },

      discountCode: '',

      selectedGateway: 'test_gateway',
      loading: false,
      // Optional if using Stripe, used to track steps of checkout using Stripe.js
      //stripe: {
      //  paymentMethodId: null,
      //  paymentIntentId: null,
      //},
    }

    this.captureOrder = this.captureOrder.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.getAllCountries = this.getAllCountries.bind(this);
    this.toggleNewsletter = this.toggleNewsletter.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleDiscountChange = this.handleDiscountChange.bind(this);
    this.handleGatewayChange = this.handleGatewayChange.bind(this);
    this.handleCaptureSuccess = this.handleCaptureSuccess.bind(this);
    this.handleCaptureError = this.handleCaptureError.bind(this);
    this.redirectOutOfCheckout = this.redirectOutOfCheckout.bind(this);
    this.updateShippingOption = this.updateShippingOption.bind(this);
  }

  componentDidMount() {
    // if cart is empty then redirect out of checkout;
    if (this.props.cart && this.props.cart.total_items === 0) {
      this.redirectOutOfCheckout()
    }

    this.updateCustomerFromRedux();
    // on initial mount generate checkout token object from the cart,
    // and then subsequently below in componentDidUpdate if the props.cart.total_items has changed
    this.generateToken();
  }

  componentDidUpdate(prevProps, prevState) {
    // if cart items have changed then regenerate checkout token object to reflect changes.
    if (prevProps.cart && prevProps.cart.total_items !== this.props.cart.total_items && !this.props.orderReceipt) {
      // reset selected shipping option
      this.setState({
        'fulfillment[shipping_method]': '',
      })
      // regenerate checkout token object since cart has been updated
      this.generateToken();
    }

    if (this.props.customer && !prevProps.customer) {
      this.updateCustomerFromRedux();
    }

    const hasDeliveryCountryChanged = prevState['shipping[country]'] !== this.state['shipping[country]'];
    const hasDeliveryRegionChanged = prevState['shipping[region]'] !== this.state['shipping[region]'];

    // if delivery country or region have changed, and we still have a checkout token object, then refresh the token,
    // and reset the previously selected shipping method
    if ((hasDeliveryCountryChanged || hasDeliveryRegionChanged) && this.props.checkout) {
      // reset selected shipping option since previous checkout token live object shipping info
      // was set based off delivery country, deliveryRegion
      this.setState({
        'fulfillment[shipping_method]': '',
      })
      this.generateToken();
    }

    // if selected shippiing option changes, regenerate checkout token object to reflect changes
    if (
      prevState['fulfillment[shipping_method]'] !== this.state['fulfillment[shipping_method]']
      && this.state['fulfillment[shipping_method]'] && this.props.checkout
    ) {
      // update checkout token object with shipping information
      this.props.dispatchSetShippingOptionsInCheckout(
        this.props.checkout.id,
        this.state['fulfillment[shipping_method]'],
        this.state['shipping[country]'],
        this.state['shipping[region]']
      );
    }
  }

  /**
   * Uses the customer provided by redux and updates local state with customer detail (if present)
   */
  updateCustomerFromRedux() {
    // Pull the customer object from prop (provided by redux)
    const { customer } = this.props;

    // Exit early if the customer doesn't exist
    if (!customer) {
      return;
    }

    // Build a some new state to use with "setState" below
    const newState = {
      'customer[email]': customer.email,
      'customer[id]': customer.id,
    };

    if (customer.firstname) {
      newState['customer[first_name]'] = customer.firstname;
      newState['shipping[name]'] = customer.firstname;
      newState['billing[name]'] = customer.firstname;
    }

    if (customer.lastname) {
      newState['customer[last_name]'] = customer.lastname;

      // Fill in the rest of the full name for shipping/billing if the first name was also available
      if (customer.firstname) {
        newState['shipping[name]'] += ` ${customer.lastname}`;
        newState['billing[name]'] += ` ${customer.lastname}`;
      }
    }

    this.setState(newState);
  }

  /**
   * Generate a checkout token. This is called when the checkout first loads.
   */
  generateToken() {
    const { cart, dispatchGenerateCheckout, dispatchGetShippingOptions } = this.props;
    const { 'shipping[country]': country, 'shipping[region]': region } = this.state;

    // Wait for a future update when a cart ID exists
    if (typeof cart.id === 'undefined') {
      return;
    }

    return dispatchGenerateCheckout(cart.id)
      .then((checkout) => {
        // continue and dispatch getShippingOptionsForCheckout to get shipping options based on checkout.id
        this.getAllCountries(checkout);
        return dispatchGetShippingOptions(checkout.id, country, region)
      })
      .catch(error => {
        console.log('error caught in checkout/index.js in generateToken', error);
      })
  }

  redirectOutOfCheckout() {
    this.props.router.push('/');
  }

  handleGatewayChange(selectedGateway) {
    this.setState({
      selectedGateway,
    });
  }

  handleDiscountChange(e) {
    e.preventDefault();
    console.log(e.target.value);
    if (!this.state.discountCode.trim() || !this.props.checkout) {
      return;
    }

    this.props.dispatchSetDiscountCodeInCheckout(this.props.checkout.id, this.state.discountCode)
      .then(resp => {
        if (resp.valid) {
          return this.setState({
            discountCode: '',
          });
        }
        return Promise.reject(resp);
      })
      .catch(error => {
        alert('Désolé, le code de réduction n\'a pas pu être appliqué');
      });
  }

  updateShippingOption(value){
    const option = this.props.shippingOptions.find(({ description }) => description === value);
    console.log(option);
    console.log(option.id);
    this.setState({
      'fulfillment[shipping_method]': option.id,
    });
  }

  handleChangeForm(e) {
    // when input cardNumber changes format using ccFormat helper
    if (e.target.name === 'cardNumber') {
      e.target.value = ccFormat(e.target.value)
    }
    // update form's input by name in state
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Handle a successful `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureSuccess(result) {
    this.props.router.push('/checkout/confirm');
  };

  /**
   * Handle an error during a `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureError(result) {
    // Clear the initial loading state
    this.setState({ loading: false });

    let errorToAlert = '';

    // If errors are passed as strings, output them immediately
    if (typeof result === 'string') {
      alert(result);
      return;
    }

    const { data: { error = {} } } = result;

    // Handle any validation errors
    if (error.type === 'validation') {
      console.error('Error while capturing order!', error.message);

      if (typeof error.message === 'string') {
        alert(error.message);
        return;
      }

      error.message.forEach(({param, error}, i) => {
        this.setState({
          errors: {
            ...this.state.errors,
            [param]: error
          },
        });
      })

      errorToAlert = error.message.reduce((string, error) => {
        return `${string} ${error.error}`
      }, '');
    }

    // Handle internal errors from the Chec API
    if (['gateway_error', 'not_valid', 'bad_request'].includes(error.type)) {
      this.setState({
        errors: {
          ...this.state.errors,
          [(error.type === 'not_valid' ? 'fulfillment[shipping_method]' : error.type)]: error.message
        },
      })
      errorToAlert = error.message
    }

    // Surface any errors to the customer
    if (errorToAlert) {
      alert(errorToAlert);
    }
  };

  /**
   * Capture the order
   *
   * @param {Event} e
   */
  captureOrder(values) {
    //e.preventDefault();
    console.log(values);
    console.log("i have been invoked");

    // reset error states
    this.setState({
      errors: {
        'fulfillment[shipping_method]': null,
        gateway_error: null,
        'shipping[name]': null,
        'shipping[street]': null,
      },
    });

    // set up line_items object and inner variant group object for order object below
    const line_items = this.props.checkout.live.line_items.reduce((obj, lineItem) => {
      const variantGroups = lineItem.selected_options.reduce((obj, option) => {
        obj[option.group_id] = option.option_id;
        return obj;
      }, {});
      obj[lineItem.id] = { ...lineItem, variantGroups };
      return obj;
    }, {});

    const shippingAddress = {
      name: values.name,
      country: values.country,
      street: values.street,
      street_2: values.street_2,
      town_city: values.town_city,
      county_state: values.region,
      postal_zip_code: values.postal_zip_code
    }

    // construct order object
    const newOrder = {
      line_items,
      customer: {
        firstname: values.first_name,
        lastname: values.last_name,
        email: values.email || `mail${values.phone}@gmail.com`,
        phone: values.phone
      },
      // collected 'order notes' data for extra field configured in the Chec Dashboard
      extrafields: {
        extr_kd6Ll2Ay15V2mj: values.orderNotes,
      },
      // Add more to the billing object if you're collecting a billing address in the
      // checkout form. This is just sending the name as a minimum.
      billing: this.state.selectedBillingOption === 'Same as shipping Address' ? shippingAddress : {
        name: this.state['billing[name]'],
        country: this.state['billing[country]'],
        street: this.state['billing[street]'],
        street_2: this.state['billing[street_2]'],
        town_city: this.state['billing[town_city]'],
        county_state: this.state['billing[region]'],
        postal_zip_code: this.state['billing[postal_zip_code]']
      },
      shipping: shippingAddress,
      fulfillment: {
        shipping_method: this.state['fulfillment[shipping_method]']
      },
      payment: {
        gateway: this.state.selectedGateway,
      },
    }

    // If test gateway selected add necessary card data for the order to be completed.
    if (this.state.selectedGateway === 'test_gateway') {
      this.setState({
        loading: true,
      });

      newOrder.payment.card = {
        number: this.state.cardNumber,
        expiry_month: this.state.expMonth,
        expiry_year: this.state.expYear,
        cvc: this.state.cvc,
        postal_zip_code: this.state.billingPostalZipcode,
      }
    }

    // If Stripe gateway is selected, register a payment method, call checkout.capture(),
    // and catch errors that indicate Strong Customer Authentication is required. In this
    // case we allow Stripe.js to handle this verification, then re-submit
    // `checkout.capture()` using the payment method ID or payment intent ID returned at
    // each step.
    if (this.state.selectedGateway === 'stripe') {
      // Create a new Payment Method in Stripe.js
      return this.props.stripe.createPaymentMethod({
        type: 'card',
        card: this.props.elements.getElement(CardElement),
      })
        .then((response) => {
          // Check for errors from using Stripe.js, surface to the customer if found
          if (response.error) {
            this.handleCaptureError(response.error.message);
            return;
          }

          // Enable loading state now that we're finished interacting with Elements
          this.setState({
            loading: true,
          });

          // Get the payment method ID and continue with the capture request
          this.props.dispatchCaptureOrder(this.props.checkout.id, {
            ...newOrder,
            payment: {
              ...newOrder.payment,
              stripe: {
                payment_method_id: response.paymentMethod.id,
              },
            },
          })
            // If no further verification is required, go straight to the "success" handler
            .then(this.handleCaptureSuccess)
            .catch((error) => {
              // Look for "requires further verification" from the Commerce.js backend. This
              // will be surfaced as a 402 Payment Required error, with a unique type, and
              // the secret you need to continue verifying the transaction on the frontend.
              if (error.data.error.type !== 'requires_verification') {
                this.handleCaptureError(error);
                return;
              }

              this.props.stripe.handleCardAction(error.data.error.param)
                .then((result) => {
                  // Check for errors from Stripe, e.g. failure to confirm verification of the
                  // payment method, or the card was declined etc
                  if (result.error) {
                    this.handleCaptureError(result.error.message);
                    return;
                  }

                  // Verification has successfully been completed. Get the payment intent ID
                  // from the Stripe.js response and re-submit the Commerce.js
                  // `checkout.capture()` request with it
                  this.props.dispatchCaptureOrder(this.props.checkout.id, {
                    ...newOrder,
                    payment: {
                      ...newOrder.payment,
                      stripe: {
                        payment_intent_id: result.paymentIntent.id,
                      },
                    },
                  })
                    .then(this.handleCaptureSuccess)
                    .catch(this.handleCaptureError);
                });
              });
            })
        .catch(this.handleCaptureError);
    }

    // Capture the order
    this.props.dispatchCaptureOrder(this.props.checkout.id, newOrder)
      .then(this.handleCaptureSuccess)
      .catch(this.handleCaptureError);
  }

  /**
   * Fetch all available countries for shipping
   */
  getAllCountries(checkout) {
    commerce.services.localeListShippingCountries(checkout.id).then(resp => {
      this.setState({
        countries: resp.countries
      })
    }).catch(error => console.log(error))
  }

  toggleNewsletter() {
    this.setState({
      receiveNewsletter: !this.state.receiveNewsletter,
    });
  }

  /**
   * Renders payment methods and payment information
   *
   * @returns {JSX.Element}
   */
  renderPaymentDetails() {
    const { checkout, stripe, elements } = this.props;
    const { selectedGateway, cardNumber, expMonth, expYear, cvc } = this.state;

    return (
      <PaymentDetails
        gateways={checkout.gateways}
        onChangeGateway={this.handleGatewayChange}
        selectedGateway={selectedGateway}
        cardNumber={cardNumber}
        expMonth={expMonth}
        expYear={expYear}
        cvc={cvc}
        stripe={stripe}
        elements={elements}
      />
    );
  }

  render() {
    const { checkout, shippingOptions } = this.props;
    const selectedShippingOption = shippingOptions.find(({id}) => id === this.state['fulfillment[shipping_method]']);
    console.log(shippingOptions);

    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <Root>
        <Head>
          <title>Commande</title>
        </Head>

        <div className="custom-container py-5 my-4 my-sm-5">
          {/* Row */}
          <div className='row'>
            <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0">
              <div className="d-flex pb-4 breadcrumb-container">
                {/*<Link href="/collection">
                    <a className="font-color-principal font-size-caption text-decoration-underline cursor-pointer">
                      Panier
                    </a>
                  </Link>
                  <img src="/icon/arrow-right.svg" className="w-16 mx-1" alt="Arrow icon"/>*/}
                <div className="font-size-caption font-weight-bold font-color-principal cursor-pointer">
                  Commande
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0">
              {
                checkout
                && (
                  <Formik 
                        initialValues={{
                          "first_name": this.state['customer[first_name]'], 
                          "last_name": this.state['customer[last_name]'], 
                          "phone": this.state['customer[phone]'], 
                          "email": this.state['customer[email]'],
                          'name': this.state['shipping[name]'],
                          'country': this.state['shipping[country]'],
                          'region': this.state['shipping[region]'],
                          'street': this.state['shipping[street]'],
                          'street_2': this.state['shipping[street_2]'],
                          'town_city': this.state['shipping[town_city]'],
                          'postal_zip_code': this.state['shipping[postal_zip_code]'],
                          'shipping_method': '',
                          'orderNotes': ''
                        }}
                        validationSchema={checkoutSchema}
                        onSubmit={values => this.captureOrder(values)}
                  >
                    {({ setFieldValue, errors, values }) => (
                      <Form id='checkout-form' className='checkout-form'>
                        {console.log(errors)}
                        {console.log(values)}
                        <p className="font-size-subheader font-color-secondaire font-weight-semibold mb-4">
                          Client
                        </p>
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-3 form-group">
                            <label className="w-100">
                              <p className="mb-1 font-size-caption font-color-light form-label">
                                Prénom*
                              </p>
                              <Field type="text" name="first_name" autoComplete="prénom" className={`w-100 form-control`} />
                              <ErrorMessage component="span" name="first_name" className="font-color-danger" />
                            </label>
                          </div>
                          <div className="col-12 col-sm-6 mb-3">
                            <label className="w-100">
                              <p className="mb-1 font-size-caption font-color-light">
                                Nom de famille*
                              </p>
                              <Field type="text" name="last_name" autoComplete="family-name" className={`w-100 form-control`} />
                              <ErrorMessage component="span" name="last_name" className="font-color-danger" />
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-3">
                            <label className="w-100">
                              <p className="mb-1 font-size-caption font-color-light">
                                Telephone*
                              </p>
                              <Field
                                type="text"
                                name="phone"
                                autoComplete="tel"
                                className={`w-100 form-control`}
                              />
                              <ErrorMessage component="span" name="phone" className="font-color-danger" />
                            </label>
                          </div>
                          <div className="col-12 col-sm-6 mb-3">
                            <label className="w-100">
                              <p className="mb-1 font-size-caption font-color-light">
                                Email address
                              </p>
                              <Field
                                type="email"
                                name="email"
                                autoComplete="email"
                                className={`w-100 form-control`}
                              />
                            </label>
                          </div>
                        </div>
                        <p className="font-size-subheader font-weight-semibold mb-4 font-color-secondaire">
                          Adresse de livraison
                        </p>
                        <div className="mb-5">
                          <AddressForm
                            type="shipping"
                            countries={this.state.countries}
                            name={values.name}
                            country={ values.country}
                            region={values.region}
                            street={values.street}
                            street2={values.street_2}
                            townCity={values.town_city}
                            postalZipCode={values.postal_zip_code}
                            setFieldValue={setFieldValue}
                          />
                          <div className="row">
                            <div className="col-12 mb-3">
                              <label className="w-100">
                                <p className="mb-1 font-size-caption font-color-light">
                                  Mode de livraison*
                                </p>
                                <Dropdown
                                  placeholder="Selectionner Mode de livraison"
                                  name="shipping_method"
                                  value={values.shipping_method}
                                  onChange={setFieldValue}
                                  updateOption={this.updateShippingOption}
                                >
                                  {
                                    shippingOptions && shippingOptions.map(option => (
                                      <option key={option.id} value={option.description}>
                                      { `${option.description} - ${option.price.formatted_with_code}` }
                                      </option>
                                    ))
                                  }
                                </Dropdown>
                                <ErrorMessage component="span" name="shipping_method" className="font-color-danger" />
                              </label>
                            </div>
                          </div>
                          {/*<div
                            onClick={this.toggleNewsletter}
                            className="d-flex mb-4 flex-nowrap cursor-pointer"
                          >
                            <Checkbox
                              onClick={this.toggleNewsletter}
                              checked={this.state.receiveNewsletter}
                              className="mr-3"
                            />
                            <p>
                              Receive our news, restocking, good plans and news in your mailbox!
                              Rest assured, you will not be flooded, we only send one newsletter
                              per month approximately 🙂
                            </p>
                          </div>*/}
                          <label className="w-100 mb-3">
                            <p className="mb-1 font-size-caption font-color-light">
                              Notes de commande (facultatif)
                            </p>
                            <textarea name="orderNotes" className="w-100 form-control" />
                          </label>
                        </div>

                        {/* this.renderPaymentDetails() */}

                        {/* Billing Address */}
                        { checkout.collects && checkout.collects.billing_address && <>
                          <p className="font-size-subheader font-weight-semibold mb-3">
                            Billing Address
                          </p>
                          <div className="border border-color-gray400 mb-5">
                            {billingOptions.map((value, index) => (
                              <label
                                key={index}
                                onClick={() => this.setState({ selectedBillingOption: value })}
                                className={`p-3 d-flex align-items-center cursor-pointer ${index !==
                                  billingOptions.length - 1 && 'borderbottom border-color-gray500'}`}
                              >
                                <Radiobox
                                  checked={this.state.selectedBillingOption === value}
                                  onClick={() => this.setState({ selectedValue: value })}
                                  className="mr-3"
                                />
                                <p className="font-weight-medium">{value}</p>
                              </label>
                            ))}
                          </div>
                          {this.state.selectedBillingOption === 'Use a different billing address' && (
                            <AddressForm
                              type="billing"
                              countries={this.state.countries}
                              name={this.state['billing[name]']}
                              country={ this.state['billing[country]']}
                              region={this.state['billing[region]']}
                              street={this.state['billing[street]']}
                              street2={this.state['billing[street_2]']}
                              townCity={this.state['billing[town_city]']}
                              postalZipCode={this.state['billing[postal_zip_code]']}
                            />
                          )}
                        </>}
                      </Form>
                    )}
                  </Formik>
                )
              }
            </div>

            <div className="col-12 col-lg-5 col-md-10 offset-md-1 mt-4 mt-lg-0">
              <div className="bg-brand200 p-lg-5 p-3 checkout-summary">
                <div className="borderbottom font-size-subheader border-color-principal font-color-principal pb-2 font-weight-semibold">
                  Votre commande
                </div>
                <div className="pt-3 borderbottom border-color-gray400">
                  {(checkout.live ? checkout.live.line_items : []).map((item, index, items) => {
                    return (
                      <div
                        key={item.id}
                        className="d-flex mb-2"
                      >
                        { (item && item.media)
                          && (<img className="checkout__line-item-image mr-2" src={item.media.source} alt={item.product_name}/>)
                        }
                        <div className="d-flex flex-grow-1">
                          <div className="flex-grow-1">
                            <p className="font-weight-semibold font-color-principal">
                              {item.product_name}
                            </p>
                            <p className="font-color-light">Quantité: {item.quantity}</p>
                            <div className="d-flex justify-content-between mb-2">
                              {item.selected_options.map((option) =>
                                <p key={option.group_id} className="font-color-light font-weight-small">
                                  {option.group_name}: {option.option_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right font-color-secondaire font-weight-medium">
                            {item.line_total.formatted_with_symbol}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="row py-3 borderbottom border-color-gray400">
                  <input
                    name="discountCode"
                    onChange={this.handleChangeForm}
                    value={this.state.discountCode}
                    placeholder="Carte cadeau ou code de réduction"
                    className="mr-2 col coupon"
                  />
                  <button
                    className="font-color-white border-none font-weight-semibold px-4 col-auto btn-valid"
                    disabled={!this.props.checkout || undefined}
                    onClick={this.handleDiscountChange}
                  >
                    Appliquer
                  </button>
                </div>
                <div className="py-3 borderbottom border-color-principal">
                  {[
                    {
                      name: 'Total',
                      amount: checkout.live ? checkout.live.subtotal.formatted_with_symbol : '',
                    },
                    {
                      name: 'Impôt',
                      amount: checkout.live ? checkout.live.tax.amount.formatted_with_symbol : '',
                    },
                    {
                      name: 'Expédition',
                      amount: selectedShippingOption ? `${selectedShippingOption.description} - ${selectedShippingOption.price.formatted_with_symbol}` : 'Aucun mode d\'expédition sélectionné',
                    },
                    {
                      name: 'Remise',
                      amount: (checkout.live && checkout.live.discount && checkout.live.discount.code) ? `Economiser ${checkout.live.discount.amount_saved.formatted_with_symbol}` : 'Aucun code de réduction appliqué',
                    }
                  ].map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                      <p>{item.name}</p>
                      <p className="text-right font-weight-medium">
                        {item.amount}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                  <p className="font-size-title font-weight-semibold">
                    Montant total
                  </p>
                  <p className="text-right font-weight-semibold font-size-title">
                    { checkout.live ? checkout.live.total.formatted_with_symbol : '' }
                  </p>
                </div>
                <p className="checkout-error">
                  { !selectedShippingOption ? 'Selectionner une option de livraison!' : '' }
                </p>
                <button
                  type="submit"
                  form="checkout-form"
                  className="font-color-white w-100 border-none h-56 font-weight-semibold d-lg-block btn-valid"
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}

CheckoutPage.propTypes = {
  orderReceipt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  checkout: PropTypes.object,
  cart: PropTypes.object,
  shippingOptions: PropTypes.array,
  dispatchGenerateCheckout: PropTypes.func,
  dispatchGetShippingOptions: PropTypes.func,
  dispatchSetDiscountCodeInCheckout: PropTypes.func,
}

// If using Stripe, this provides context to the page so we can use `stripe` and
// `elements` as props.
{/*const InjectedCheckoutPage = (passProps) => {
  return (
    <Elements stripe={passProps.stripe}>
      <ElementsConsumer>
        { ({ elements, stripe }) => (
          <CheckoutPage {...passProps} stripe={stripe} elements={elements} />
        ) }
      </ElementsConsumer>
    </Elements>
  );
};
*/}
export default withRouter(
  connect(
    ({ checkout: { checkoutTokenObject, shippingOptions }, cart, customer, orderReceipt }) => ({
      checkout: checkoutTokenObject,
      customer,
      shippingOptions,
      cart,
      orderReceipt,
    }),
    {
      dispatchGenerateCheckout,
      dispatchGetShippingOptions,
      dispatchSetShippingOptionsInCheckout,
      dispatchSetDiscountCodeInCheckout,
      dispatchCaptureOrder,
    },
  )(CheckoutPage),
);
