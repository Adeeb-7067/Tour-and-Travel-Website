// FeatureSidebar.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilterData,
  updateSelectedFilters,
  clearAllFilters,
  selectFilterData,
  selectSelectedFilters,
  selectFilterLoading,
} from "../../../redux/features/placeSlice";
import PriceRange from "./PriceRange";

interface FeatureSidebarProps {
  onFilterChange: (filters: any) => void;
}

// Configuration for how many items to show initially for each filter type
const INITIAL_ITEMS_TO_SHOW = 5;

const FeatureSidebar = ({ onFilterChange }: FeatureSidebarProps) => {
  const dispatch = useDispatch();

  // 🔹 Redux State
  const filterData = useSelector(selectFilterData);
  const selectedFilters = useSelector(selectSelectedFilters);
  const filterLoading = useSelector(selectFilterLoading);
  const [isPriceChange, setIsPriceChange] = useState(false);

  // 🔹 Duration range state
  const [durationRange, setDurationRange] = useState<number[]>([]);
  const [isDurationChange, setIsDurationChange] = useState(false);

  // 🔹 Price range state
  const [priceRange, setPriceRange] = useState<number[]>([]);

  // 🔹 State to track expanded filter sections
  const [expandedSections, setExpandedSections] = useState<{
    city: boolean;
    country: boolean;
    duration: boolean;
    ratings: boolean;
  }>({
    city: false,
    country: false,
    duration: false,
    ratings: false,
  });

  // 🔹 Fetch filter data on mount
  useEffect(() => {
    dispatch(fetchFilterData() as any);
  }, [dispatch]);

  useEffect(() => {
    if (filterData.priceFilter) {
      const min = filterData.priceFilter.min;
      const max = filterData.priceFilter.max;
      setPriceRange([min, max]);

      // If we have selected prices, update the range to match
      if (selectedFilters.prices && selectedFilters.prices.length === 2) {
        setPriceRange(selectedFilters.prices as [number, number]);
      }
    }
  }, [filterData.priceFilter, selectedFilters.prices]);

  // 🔹 Initialize duration range from filter data or selected filters
  useEffect(() => {
    if (filterData.duration) {
      const min = filterData.duration.min ?? 0;
      const max = filterData.duration.max ?? 40;
      setDurationRange([min, max]);

      if (selectedFilters.durations && selectedFilters.durations.length === 2) {
        setDurationRange(selectedFilters.durations as [number, number]);
      }
    }
  }, [filterData.duration, selectedFilters.durations]);

  // 🔹 Handle checkbox changes
  const handleFilterChange = (
    filterType: string,
    value: string | number,
    isChecked: boolean
  ) => {
    dispatch(updateSelectedFilters({ filterType, value, isChecked, prices: null }));
  };

  // 🔹 Handle price range changes
  const handlePriceRangeChange = (values: number[]) => {
    setIsPriceChange(true);
    setPriceRange(values);
  };

  // 🔹 Handle duration range changes
  const handleDurationRangeChange = (values: number[]) => {
    setIsDurationChange(true);
    setDurationRange(values);
  };

  // 🔹 Apply price range filter
  const applyPriceRange = () => {
    dispatch(updateSelectedFilters({
      filterType: "price",
      value: priceRange,
      isChecked: true,
      prices: priceRange as [number, number]
    }));
  };

  // 🔹 Apply duration range filter
  const applyDurationRange = () => {
    dispatch(updateSelectedFilters({
      filterType: "duration",
      value: durationRange,
      isChecked: true,
      prices: durationRange as [number, number]
    }));
  };

  // 🔹 Apply all filters
  const handleApplyFilters = () => {
    // Apply price range first
    if (isPriceChange) {
      applyPriceRange();
      setIsPriceChange(true);
    }
    // Apply duration range if changed
    if (isDurationChange) {
      applyDurationRange();
      setIsDurationChange(true);
    }
    const pricheChanged = isPriceChange ? priceRange : null;
    const durationChanged = isDurationChange ? durationRange : null;
    setTimeout(() => {
      onFilterChange({
        ...selectedFilters,
        prices: pricheChanged,
        durations: durationChanged,
      });
    }, 0);
  };

  // 🔹 Clear all filters
  const handleClearAll = () => {
    // Reset price range using direct access
    if (filterData.priceFilter) {
      setIsPriceChange(false);
      setPriceRange([filterData.priceFilter.min, filterData.priceFilter.max]);
    } else {
      setPriceRange([]);
    }

    // Reset duration range
    if (filterData.duration) {
      setIsDurationChange(false);
      setDurationRange([filterData.duration.min, filterData.duration.max]);
    } else {
      setDurationRange([]);
    }

    dispatch(clearAllFilters());
    onFilterChange({
      cities: [],
      countries: [],
      durations: [],
      ratings: [],
      prices: [],
    });
  };

  // 🔹 Toggle expanded state for a filter section
  const toggleExpanded = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 🔹 Helper function to get items to display for a filter section
  const getItemsToDisplay = (items: any[], section: keyof typeof expandedSections) => {
    if (expandedSections[section] || items.length <= INITIAL_ITEMS_TO_SHOW) {
      return items;
    }
    return items.slice(0, INITIAL_ITEMS_TO_SHOW);
  };

  // Calculate min and max from price filter data
  const priceMin = filterData.priceFilter?.min || 0;
  const priceMax = filterData.priceFilter?.max || 1000;

  if (filterLoading) {
    return (
      <div className="col-xl-3 col-lg-4 order-last order-lg-first">
        <div className="tg-filter-sidebar mb-40 top-sticky">
          <div className="text-center py-4">Loading filters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-xl-3 col-lg-4 order-last order-lg-first">
      <div className="tg-filter-sidebar mb-40 top-sticky">
        <div className="tg-filter-item">
          {/* === Buttons === */}
          <div className="d-flex gap-2 mb-4">
            <button
              onClick={handleApplyFilters}
              className="tg-btn"
              style={{
                padding: '5px',
                paddingInline: '4px',
                fontSize: '0.8rem',
                textTransform: 'none'
              }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearAll}
              style={{
                padding: '5px',
                paddingInline: '4px',
                fontSize: '0.8rem'
              }}
            >
              Clear All
            </button>
          </div>

          {/* === City === */}
          <h4 className="tg-filter-title mb-15">Destination (City)</h4>
          <ul className="tg-filter-list">
            {getItemsToDisplay(filterData.city, 'city').map((city, i) => (
              <li key={city._id}>
                <div className="checkbox d-flex">
                  <input
                    className="tg-checkbox"
                    type="checkbox"
                    id={`city_${i}`}
                    checked={selectedFilters.cities.includes(city._id)}
                    onChange={(e) =>
                      handleFilterChange("city", city._id, e.target.checked)
                    }
                  />
                  <label htmlFor={`city_${i}`} className="tg-label">
                    {city.cityName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
          {filterData.city.length > INITIAL_ITEMS_TO_SHOW && (
            <button
              onClick={() => toggleExpanded('city')}
              className="tg-view-more-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '5px 0',
                textDecoration: 'underline'
              }}
            >
              {expandedSections.city ? 'View Less' : 'View More'}
            </button>
          )}

          <span className="tg-filter-border mt-25 mb-25"></span>

          {/* === Country === */}
          <h4 className="tg-filter-title mb-15">Country</h4>
          <ul className="tg-filter-list">
            {getItemsToDisplay(filterData.country, 'country').map((country, i) => (
              <li key={country._id}>
                <div className="checkbox d-flex">
                  <input
                    className="tg-checkbox"
                    type="checkbox"
                    id={`country_${i}`}
                    checked={selectedFilters.countries.includes(country._id)}
                    onChange={(e) =>
                      handleFilterChange("country", country._id, e.target.checked)
                    }
                  />
                  <label htmlFor={`country_${i}`} className="tg-label">
                    {country.countryName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
          {filterData.country.length > INITIAL_ITEMS_TO_SHOW && (
            <button
              onClick={() => toggleExpanded('country')}
              className="tg-view-more-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '5px 0',
                textDecoration: 'underline'
              }}
            >
              {expandedSections.country ? 'View Less' : 'View More'}
            </button>
          )}

          <span className="tg-filter-border mt-25 mb-25"></span>

          {/* === Duration (Range) === */}
          <h4 className="tg-filter-title mb-15">Duration (Days)</h4>
          <div className="tg-price-range mb-20">
            <PriceRange
              STEP={1}
              MIN={filterData.duration?.min ?? 0}
              MAX={filterData.duration?.max ?? 40}
              values={durationRange}
              handleChanges={handleDurationRangeChange}
            />
            <div className="d-flex align-items-center justify-content-between mt-20">
              <span className="tg-price-text">{durationRange[0]}</span>
              <span className="tg-price-text">{durationRange[1]}</span>
            </div>
          </div>

          <span className="tg-filter-border mt-25 mb-25"></span>

          {/* === Price Range === */}
          <h4 className="tg-filter-title mb-15">Price Range</h4>
          <div className="tg-price-range mb-20">
            <PriceRange
              STEP={10}
              MIN={priceMin}
              MAX={priceMax}
              values={priceRange}
              handleChanges={handlePriceRangeChange}
            />
            <div className="d-flex align-items-center justify-content-between mt-20">
              <span className="tg-price-text">{priceRange[0]}</span>
              <span className="tg-price-text">{priceRange[1]}</span>
            </div>
          </div>

          <span className="tg-filter-border mt-25 mb-25"></span>

          {/* === Ratings === */}
          <h4 className="tg-filter-title mb-15">Ratings</h4>
          <ul className="tg-filter-list">
            {getItemsToDisplay(filterData.ratings, 'ratings').map((rating, i) => (
              <li key={i}>
                <div className="checkbox d-flex">
                  <input
                    className="tg-checkbox"
                    type="checkbox"
                    id={`rating_${i}`}
                    checked={selectedFilters.ratings.includes(rating)}
                    onChange={(e) =>
                      handleFilterChange("rating", rating, e.target.checked)
                    }
                  />
                  <label htmlFor={`rating_${i}`} className="tg-listing-rating-icon">
                    {Array.from({ length: rating }).map((_, idx) => (
                      <i key={idx} className="fa-sharp fa-solid fa-star"></i>
                    ))}
                    <span style={{ color: 'black' }}>({rating})</span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
          {filterData.ratings.length > INITIAL_ITEMS_TO_SHOW && (
            <button
              onClick={() => toggleExpanded('ratings')}
              className="tg-view-more-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '5px 0',
                textDecoration: 'underline'
              }}
            >
              {expandedSections.ratings ? 'View Less' : 'View More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureSidebar;