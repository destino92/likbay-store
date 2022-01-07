import React, { Component } from 'react';
import PropTypes from 'prop-types';
import commerce from '../../../lib/commerce';
import Dropdown from '../../common/atoms/Dropdown';
import { Field, ErrorMessage } from 'formik';

export default class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subdivisions: {},
    };

    this.getRegions = this.getRegions.bind(this);
  }

  componentDidMount() {
    this.getRegions(this.props.country);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasDeliveryCountryChanged = prevProps.country !== this.props.country;

    // refresh list of regions when delivery country has changed
    if (hasDeliveryCountryChanged) {
      this.getRegions(this.props.country);
    }
  }

  /**
   * Fetch available shipping regions for the chosen country
   *
   * @param {string} country
   */
   getRegions(country) {
    commerce.services.localeListSubdivisions(country).then(resp => {
      this.setState({
        subdivisions: resp.subdivisions
      })
    }).catch(error => console.log(error))
  }


  render() {
    const {
      type,
      countries,
      country,
      region,
      name,
      townCity,
      street,
      street2,
      postalZipCode,
      setFieldValue
    } = this.props;

    return (
      <>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Nom Complet*
              </p>
              <Field type='text' name="name" autoComplete="name" className="w-100 form-control" />
              <ErrorMessage component="span" name="name" className="font-color-danger" />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Pays*
              </p>
              <Dropdown
                name="country"
                placeholder="Selectionner le pays"
                value={country}
                disabled
              >
                {
                  Object.entries(countries).map(([code, name]) => (
                    <option value={code} key={code}>
                      { name }
                    </option>
                  ))
                }
              </Dropdown>
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">Ville*</p>
              <Field type='text' name="town_city" autoComplete="address-level2" className="w-100 form-control" />
              <ErrorMessage component="span" name="town_city" className="font-color-danger" />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Adresse ligne 1*
              </p>
              <Field
                type="text"
                autoComplete="street-address"
                name="street"
                className={`w-100 form-control`}
                placeholder="Rue, quartier, arrondissement ..."
              />
              <ErrorMessage component="span" name="street" className="font-color-danger" />
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Adresse ligne 2 (optionnelle)
              </p>
              <Field
                type="text"
                name="street_2"
                className="w-100 form-control"
                placeholder="Appartement, numéro de suite, etc."
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Région
              </p>
              <Dropdown
                placeholder="Select a region"
                name="region"
                value={region}
                onChange={setFieldValue}
              >
                {
                  Object.entries(this.state.subdivisions).map(([code, name]) => (
                    <option key={code} value={code}>
                    { name }
                    </option>
                  ))
                }
              </Dropdown>
              <ErrorMessage component="span" name="region" className="font-color-danger" />
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                Code postal*
              </p>
              <Field
                type="text"
                autoComplete="postal-code"
                name="postal_zip_code"
                value={postalZipCode}
                className="w-100 form-control"
                disabled
              />
            </label>
          </div>
        </div>
      </>
    );
  }
}

AddressForm.propTypes = {
  type: PropTypes.string,
  countries: PropTypes.any,
  country: PropTypes.string,
  region: PropTypes.string,
  name: PropTypes.string,
  townCity: PropTypes.string,
  street: PropTypes.string,
  street2: PropTypes.string,
  postalZipCode: PropTypes.string,
}
