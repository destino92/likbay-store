import React, {useState} from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  connectInfiniteHits,
  connectRefinementList,
  connectHierarchicalMenu,
  connectCurrentRefinements,
  connectStats,
  connectRange,
  connectSearchBox,
  Configure,
  connectHighlight,
  InstantSearch,
} from 'react-instantsearch-dom';
import { divide } from 'lodash';


const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <div className="section-filters-bar-actions mx-auto">
    <form noValidate action="" role="search" className="searchbox-form">
      <div className='input-group'>
        <input 
          className="search-box-input" 
          type="search"
          value={currentRefinement}
          onChange={event => refine(event.currentTarget.value)}
          placeholder="Rechercher vos produits" 
        />
        <span className='input-group-append'>
          <div className="searchbox-submit d-flex justify-content-center py-auto">
            <svg className="search-icon align-middle mx-auto px-auto" xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 18 18" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </span>
      </div>
      {isSearchStalled ? 'Un instant' : ''}
    </form>
  </div>
);

const ClearRefinements = ({ items, refine }) => (
  <a onClick={() => refine(items)} disabled={!items.length} className="font-weight-semibold font-color-secondaire text-center" style={{cursor:'pointer'}}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.8809 10C14.2609 10 12.1309 12.13 12.1309 14.75C12.1309 15.64 12.3809 16.48 12.8209 17.2C13.6409 18.58 15.1509 19.5 16.8809 19.5C18.6109 19.5 20.1209 18.57 20.9409 17.2C21.3809 16.49 21.6309 15.64 21.6309 14.75C21.6309 12.13 19.5109 10 16.8809 10ZM18.6809 16.52C18.5309 16.67 18.3409 16.74 18.1509 16.74C17.9609 16.74 17.7709 16.67 17.6209 16.52L16.9009 15.8L16.1509 16.55C16.0009 16.7 15.8109 16.77 15.6209 16.77C15.4309 16.77 15.2409 16.7 15.0909 16.55C14.8009 16.26 14.8009 15.78 15.0909 15.49L15.8409 14.74L15.1209 14.01C14.8309 13.72 14.8309 13.24 15.1209 12.95C15.4109 12.66 15.8909 12.66 16.1809 12.95L16.9009 13.67L17.6009 12.97C17.8909 12.68 18.3709 12.68 18.6609 12.97C18.9509 13.26 18.9509 13.74 18.6609 14.03L17.9609 14.73L18.6809 15.46C18.9809 15.75 18.9809 16.23 18.6809 16.52Z" fill="currentColor"/>
      <path d="M20.5799 4.02V6.24C20.5799 7.05 20.0799 8.06 19.5799 8.57L19.3999 8.73C19.2599 8.86 19.0499 8.89 18.8699 8.83C18.6699 8.76 18.4699 8.71 18.2699 8.66C17.8299 8.55 17.3599 8.5 16.8799 8.5C13.4299 8.5 10.6299 11.3 10.6299 14.75C10.6299 15.89 10.9399 17.01 11.5299 17.97C12.0299 18.81 12.7299 19.51 13.4899 19.98C13.7199 20.13 13.8099 20.45 13.6099 20.63C13.5399 20.69 13.4699 20.74 13.3999 20.79L11.9999 21.7C10.6999 22.51 8.90992 21.6 8.90992 19.98V14.63C8.90992 13.92 8.50992 13.01 8.10992 12.51L4.31992 8.47C3.81992 7.96 3.41992 7.05 3.41992 6.45V4.12C3.41992 2.91 4.31992 2 5.40992 2H18.5899C19.6799 2 20.5799 2.91 20.5799 4.02Z" fill="currentColor"/>
    </svg>
    Réinitialiser Filtres
  </a>
);

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

const CustomCheckbox = ({
  item,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
}) => {
  const [checked, setChecked] = useState(false);

  return  <div className="checkbox-line" onClick={event => {
            event.preventDefault();
            setChecked(!checked)
            refine(item.value);
          }}>
            <div className="checkbox-wrap">
              <input id={`category-${item.value}`} name={`category_${item.value}`} aria-describedby="checkbox" type="checkbox" className="w-4 h-4 rounded mr-2" checked={checked} readOnly />
              <div className="checkbox-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className='icon-cross'>
                  <g data-name="Layer 2">
                    <g data-name="close">
                      <rect width="12" height="12" transform="rotate(180 12 12)" opacity="0"/>
                      <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/>
                    </g>
                  </g>
                </svg>
              </div>
              <label htmlFor="checkbox">
                  {isFromSearch ? (
                    <CustomHighlight attribute="label" hit={item} />
                  ) : (
                    item.label
                  )}
              </label>
            </div>
            <p className="checkbox-line-text badge badge-pill">{item.count}</p>
        </div>
}

const HierarchicalMenu = ({ items, refine, createURL }) => (
  <ul>
    {items.map(item => (
      <li key={item.label}>
        <a
          href={createURL(item.value)}
          style={{ fontWeight: item.isRefined ? 'bold' : '' }}
          onClick={event => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          {item.label} <span className="badge badge-pill bg-secondaire font-color-white">{item.count}</span>
        </a>
        {item.items && (
          <HierarchicalMenu
            items={item.items}
            refine={refine}
            createURL={createURL}
          />
        )}
      </li>
    ))}
  </ul>
);

const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);

const RefinementList = ({
  searchable,
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  limit,
  showMoreLimit,
  showMore
}) => 
{ 
  const [extended, setExtended] = useState(false);
  const listLimit = extended ? showMoreLimit : limit;

  return (<div className="sidebar-box-items">
    <ul style={{listStyle: 'none'}}>
      <li key="search-list">
        {searchable && <input
          type="search"
          onChange={event => searchForItems(event.currentTarget.value)}
          className='search-box-input mb-3'
          placeholder="Rechercher"
        />}
      </li>
      {items.slice(0, listLimit).map(item => (
          <li key={item.objectID}>
            <CustomCheckbox item={item} refine={refine} createURL={createURL} isFromSearch={isFromSearch} searchForItems />
          </li>
      ))}
    </ul>
    {showMore && (
      <button onClick={() => setExtended(!extended)} className="h-40 px-3 btn-skip w-100">
        {extended ? 'Voir moins' : 'Voir plus'}
      </button>
    )}
  </div>);
}

const CustomRefinementList = connectRefinementList(RefinementList);

const CustomSearchBox = connectSearchBox(SearchBox);

const RangeInput = ({ currentRefinement, min, max, precision, refine }) => (
  <div className='sidebar-box-items small-space'> 
    <form className="d-flex items-center form-input-small">
      {console.log(currentRefinement)}
      <input
            type="number"
            min={min}
            max={max}
            step={1 / Math.pow(10, precision)}
            value={currentRefinement.min || ''}
            onChange={event =>
              refine({
                ...currentRefinement,
                min: event.currentTarget.value,
              })
            }
            className="number-filter"
            placeholder="Min"
          />
      {/*<span className="mx-4">à</span>*/}
      <input
            type="number"
            min={min}
            max={max}
            step={1 / Math.pow(10, precision)}
            value={currentRefinement.max || ''}
            onChange={event =>
              refine({
                ...currentRefinement,
                max: event.currentTarget.value,
              })
            }
            className="number-filter"
            placeholder="Max"
          />
    </form>
  </div> 
);

const CustomRangeInput = connectRange(RangeInput);

const InfiniteHits = ({ 
  hits,
  hasPrevious,
  refinePrevious,
  hasMore,
  refineNext,
}) => (
  <div>
    <div className="catalog_btns">
      {hasPrevious && <button onClick={refinePrevious} className="h-56 px-3 btn-skip">
        Précédents
      </button>}
    </div>
    <div className='catalog_row'>
      <div className="catalog_wrapper">
        <div className="catalog_list">
          {
            hits.map(hit => (
              <div className="catalog_card" key={hit.objectID}>
                <div className="card_preview">
                  {/*<Link href={`/product/${hit.link}`}> */} 
                  <img src={`${hit.image}`} />
                  {/*</Link>*/}
                </div>
                <Link href={`/product/${hit.link}`}>
                  <div className="card_link">
                    <div className="card_body">
                      <div className="card_line">
                        <div className="card_title">
                          <CustomHighlight attribute="name" hit={hit} />
                        </div>
                        <div className="card_price">
                          {hit.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <div className="catalog_btns">
      {hasMore && <button onClick={refineNext} className="h-56 px-3 btn-valid">
        Suivants
      </button>}
    </div>
  </div>
);

const CustomInfiniteHits = connectInfiniteHits(InfiniteHits);
/*HitComponent.propTypes = {
  hit: PropTypes.object,
};*/

const Stats = ({ processingTimeMS, nbHits, nbSortedHits, areHitsSorted }) => (
  <p className="text-xs">
    {areHitsSorted && nbHits !== nbSortedHits
      ? `${nbSortedHits.toLocaleString()} résultats pertinents triés par ${nbHits.toLocaleString()} trouvé en ${processingTimeMS.toLocaleString()} ms`
      : `${nbHits.toLocaleString()} résultats trouvés en ${processingTimeMS.toLocaleString()} ms`}
  </p>
);

const CustomStats = connectStats(Stats);

const Highlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map(
        (part, index) =>
          part.isHighlighted ? (
            <span key={index} className="font-color-secondaire font-weight-semibold">{part.value}</span>
          ) : (
            <span key={index}>{part.value}</span>
          )
      )}
    </span>
  );
};

const CustomHighlight = connectHighlight(Highlight);

class ProductList extends React.Component {
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  };

  render() {
    return (
      <InstantSearch
        searchClient={this.props.searchClient}
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
        createURL={this.props.createURL}
        indexName={this.props.indexName}
        onSearchParameters={this.props.onSearchParameters}
        {...this.props}
      >
        <Configure hitsPerPage={6} />
        <div className="container">
          <div className="row">
            <div className="col header-search">
              <CustomSearchBox />
            </div>
          </div>
          <div className='row'>
            {/*<main>*/}
                <div className="col-sm" style={{flexShrink: 0, padding: '32px 20px'}}>
                  <div className="border-t border-solid py-8 mt-6">
                    <div className="font-weight-semibold sidebar-box-title">Categories</div>
                    {/*<CustomRefinementList attribute="category" />*/}
                    <CustomRefinementList 
                      searchable 
                      attribute="category" 
                      limit={10}
                      showMoreLimit={20}
                      showMore={true} 
                    />
                  </div>
                  <div className="border-t border-solid py-8 mt-6">
                    <div className="font-weight-semibold sidebar-box-title">Marque</div>
                    <CustomRefinementList attribute="marque" 
                      searchable
                      limit={10}
                      showMoreLimit={20}
                      showMore={true} 
                    />
                  </div>
                  {/*<div className="border-t border-solid py-8">
                      <div className="font-weight-semibold sidebar-box-title">Échelle des prix</div>
                      <CustomRangeInput attribute="price" />
                  </div>*/}
                  <div className='pt-4'>
                    <CustomClearRefinements />
                  </div>
                </div>
                <div className="col-sm col-md-8">
                  <header className="border-b border-solid flex justify-end mb-8 py-8 items-center">
                    <div>
                      <CustomStats />
                    </div>
                  </header>
                  <CustomInfiniteHits />
                </div>
            {/*</main>*/}
          </div>
        </div>
      </InstantSearch>
    );
  }
}

export default ProductList;




/*import Link from "next/link";

import Product from "./Product";

export default function ProductList({ products }) {
  if (!products) return null;
  console.log(products);
  return (
    <ul>
      {products.map((product) => (
        
        <li key={product.permalink}>
          <Link href={`/products/${product.permalink}`}>
            <a>
              <Product {...product} />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}*/