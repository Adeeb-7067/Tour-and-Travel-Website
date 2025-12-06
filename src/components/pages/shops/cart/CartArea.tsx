/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';

interface CartItem {
  _id: string;
  adults: number;
  checkInDate: string;
  children: number;
  itemTotal: number;
  packageId: {
    _id: string;
    packageName: string;
    packageType: string;
    cityIds: string[];
    durationDays: number;
  };
  quantity: number;
  selectedAddOns: any[];
}

interface TravelerInfo {
  name: string;
  age: number;
  gender: string;
  idProofType: string;
  idProofNumber: string;
  specialNotes: string;
  isChild: boolean;
}



const CartArea = () => {
  const [mounted, setMounted] = useState(false);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [travelerForms, setTravelerForms] = useState<{ [packageId: string]: TravelerInfo[] }>({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    specialRequests: ""
  });
  const [currentProcessing, setCurrentProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("customer");

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const userId = localStorage.getItem('userId');

  const genderOptions = ["Male", "Female", "Other"];
  const idProofOptions = ["Passport", "Driver's License", "National ID", "Birth Certificate", "Aadhaar Card", "Other"];

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, []);

  useEffect(() => {
  if (showCheckoutModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [showCheckoutModal]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/cart/${userId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartData(res.data.data?.items || []);
    } catch (error) {
      console.log(error);
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`${BASE_URL}/cart/${userId}/${itemId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.log("Error removing item:", error);
    }
  };

  const calculateTotal = () => {
    return cartData.reduce((total, item) => total + item.itemTotal, 0);
  };

  const formatPrice = (price: number) => {
    return `${(price)}`;
  };

  // Initialize traveler forms when opening checkout modal
  const handleCheckoutClick = () => {
    const initialForms: { [packageId: string]: TravelerInfo[] } = {};

    cartData.forEach((item) => {
      const adultForms: TravelerInfo[] = Array(item.adults).fill(null).map(() => ({
        name: "",
        age: 0,
        gender: "",
        idProofType: "",
        idProofNumber: "",
        specialNotes: "",
        isChild: false
      }));

      const childForms: TravelerInfo[] = Array(item.children).fill(null).map(() => ({
        name: "",
        age: 0,
        gender: "",
        idProofType: "",
        idProofNumber: "",
        specialNotes: "",
        isChild: true
      }));

      initialForms[item.packageId._id] = [...adultForms, ...childForms];
    });

    setTravelerForms(initialForms);
    setActiveTab("customer");
    setShowCheckoutModal(true);
  };

  // Handle customer info changes
  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTravelerInputChange = (packageId: string, travelerIndex: number, field: keyof TravelerInfo, value: string | number | boolean) => {
    setTravelerForms(prev => ({
      ...prev,
      [packageId]: prev[packageId].map((traveler, index) => 
        index === travelerIndex ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  interface Tab {
    id: string;
    label: string;
    icon: string;
    subtitle?: string;
  }

  const getTabs = (): Tab[] => {
    const tabs: Tab[] = [
      { id: "customer", label: "Primary Contact", icon: "" }
    ];

    Object.keys(travelerForms).forEach((packageId, index) => {
      const travelers = travelerForms[packageId];
      const adultCount = travelers.filter(t => !t.isChild).length;
      const childCount = travelers.filter(t => t.isChild).length;
      
      tabs.push({
        id: `package-${packageId}`,
        label: `Package ${index + 1}`,
        subtitle: `${adultCount}A ${childCount}C`,
        icon: ""
      });
    });

    return tabs;
  };

  // Get package name by ID
  const getPackageName = (packageId: string) => {
    const item = cartData.find(item => item.packageId._id === packageId);
    return item?.packageId.packageName || "Unknown Package";
  };

  // Get package details by ID
  const getPackageDetails = (packageId: string) => {
    const item = cartData.find(item => item.packageId._id === packageId);
    return item;
  };

 
const handleCheckoutSubmit = async () => {
  try {
    setCurrentProcessing(true);

    // Validate customer info
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      alert("Please fill all required customer information fields");
      setActiveTab("customer");
      setCurrentProcessing(false);
      return;
    }

    // Validate traveler forms
    for (const packageId in travelerForms) {
      const travelers = travelerForms[packageId];
      for (let i = 0; i < travelers.length; i++) {
        const traveler = travelers[i];
        if (
          !traveler.name ||
          !traveler.age ||
          !traveler.gender ||
          !traveler.idProofType ||
          !traveler.idProofNumber
        ) {
          const travelerType = traveler.isChild ? "child" : "adult";
          alert(
            `Please fill all required fields for ${travelerType} traveler ${
              i + 1
            } in ${getPackageName(packageId)}`
          );
          setActiveTab(`package-${packageId}`);
          setCurrentProcessing(false);
          return;
        }

        // Validate age for children
        if (traveler.isChild && traveler.age >= 12) {
          alert(
            `Child traveler ${
              i + 1
            } must be under 12 years old in ${getPackageName(packageId)}`
          );
          setActiveTab(`package-${packageId}`);
          setCurrentProcessing(false);
          return;
        }
      }
    }

    // Prepare data for backend
    const checkoutData = {
      customerInfo,
      travelerDetailsMap: travelerForms,
    };

    console.log("Sending checkout data:", checkoutData);

    const response = await axios.post(`${BASE_URL}/checkout/${userId}`, checkoutData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    });

    // ✅ Handle success response
    if (response.status === 200 || response.status === 201) {
      const checkoutId = response.data?.checkoutId;
      toast.success("Checkout successful!");
      window.location.href = `/checkout?ref=${checkoutId}`;

    } else {
      console.error("Unexpected response:", response);
      toast.error("Something went wrong, please try again.");
    }

  } catch (error) {
    console.error("Error during checkout:", error);
    if (axios.isAxiosError(error)) {
      alert(
        error.response?.data?.message ||
          "There was an error processing your checkout. Please try again."
      );
    } else {
      alert("Unexpected error occurred.");
    }
  } finally {
    setCurrentProcessing(false);
  }
};

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="cart-area pb-100 pt-105">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-area pb-100 pt-105">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {cartData.length === 0 ? (
                <div className="mb-30">
                  <div className="empty_bag text-center">
                    <p className="py-3">Your Bag is Empty</p>
                    <Link to={"/tour-grid-1"} className="tg-btn">
                      Go To Shop
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row gutter-y-30 gx-5">
                    <div className="tg-cart-table-content table-responsive mb-30">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Package</th>
                            <th>Adults/Children</th>
                            <th>Check-in Date</th>
                            <th className="price">Price</th>
                            <th className="subtotal">Subtotal</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartData.map((item: CartItem) => (
                            <tr key={item._id}>
                              <td className="product-thumbnail">
                                <Link className="texts" to={`/tour-details/${item.packageId._id}`}>
                                  {item.packageId.packageName}
                                </Link>
                                <div className="package-type">
                                  <small>{item.packageId.packageType} • {item.packageId.durationDays} days</small>
                                </div>
                              </td>
                              <td className="guest-info">
                                <div>Adults: {item.adults}</div>
                                <div>Children: {item.children}</div>
                              </td>
                              <td className="checkin-date">
                                {new Date(item.checkInDate).toLocaleDateString("en-Gb",{
                                  day:'2-digit',
                                  month:'numeric',
                                  year:'2-digit'
                                })}
                              </td>
                              <td className="product-price2">
                                <span className="amount">{formatPrice(item.itemTotal / item.quantity)}</span>
                              </td>
                          
                              <td className="product-subtotal">
                                <span className="amount">{formatPrice(item.itemTotal)}</span>
                              </td>
                              <td className="product-remove">
                                <a 
                                  onClick={() => handleRemoveItem(item._id)} 
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="fa fa-times"></i>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row justify-content-end">
                      <div className="col-xl-3 col-lg-4 col-md-5">
                        <div className="tg-cart-page-total mb-20">
                          <ul className="mb-20">
                            <li>Subtotal <span>{formatPrice(calculateTotal())}</span></li>
                            <li>Total <span>{formatPrice(calculateTotal())}</span></li>
                          </ul>
                          <div className="d-flex justify-content-end">
                            <button 
                              onClick={handleCheckoutClick}
                              className="tg-btn mb-10"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCheckoutModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          inset:0
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '0',
            borderRadius: '8px',
            maxWidth: '1200px',
            width: '70%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0 }}>Traveler Information</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 0,
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation" style={{
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8f9fa',
              height:'50px',
              overflow:"none"

            }}>
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '0 1rem',
                 height:'50px'

              }}>
                {getTabs().map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '1rem 1.5rem',
                      border: 'none',
                      backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                      color: activeTab === tab.id ? 'white' : '#333',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderBottom: activeTab === tab.id ? '3px solid #0056b3' : '3px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tab.label}</div>
                      {tab.subtitle && (
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{tab.subtitle}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="tab-content" style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem'
            }}>
              {activeTab === "customer" && (
                <div className="customer-info">
                  <h4 className="mb-4">Primary Contact Information</h4>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={customerInfo.name}
                        onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                        required
                        style={{
                          height:'40px'
                        }}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        required
                         onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}   
                         style={{
                          height:'40px'
                        }}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        required
                         style={{
                          height:'40px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={customerInfo.specialRequests}
                        onChange={(e) => handleCustomerInfoChange('specialRequests', e.target.value)}
                        placeholder="Any special requirements or requests..."
                        
                      />
                    </div>
                  </div>

                  <div className="navigation-buttons" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '2rem'
                  }}>
                    <div></div> {/* Empty div for spacing */}
                    <button
                      onClick={() => {
                        const tabs = getTabs();
                        const nextTab = tabs[1]; // First package tab
                        if (nextTab) setActiveTab(nextTab.id);
                      }}
                      className="tg-btn"
                    >
                      Next: Traveler Details →
                    </button>
                  </div>
                </div>
              )}

              {Object.entries(travelerForms).map(([packageId, travelers]) => (
                <div key={packageId} className={`package-travelers ${activeTab === `package-${packageId}` ? '' : 'd-none'}`}>
                  <div className="package-header mb-4">
                    <h4>{getPackageName(packageId)}</h4>
                    <p className="text-muted">
                      Check-in: {getPackageDetails(packageId) ? new Date(getPackageDetails(packageId)!.checkInDate).toLocaleDateString("en-Gb",{
                                  day:'2-digit',
                                  month:'numeric',
                                  year:'2-digit'
                                }) : 'N/A'} • 
                      Duration: {getPackageDetails(packageId)?.packageId.durationDays} days
                    </p>
                  </div>

                  <div className="travelers-container">
                    {travelers.map((traveler, travelerIndex) => (
                      <div key={travelerIndex} className="traveler-form mb-4 p-4" style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '8px',
                        backgroundColor: traveler.isChild ? '#f8f9fa' : 'white'
                      }}>
                        <div className="traveler-header mb-3" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '0.5rem',
                          borderBottom: '1px solid #eee'
                        }}>
                          <h5 style={{ 
                            margin: 0, 
                            color: traveler.isChild ? '#6c757d' : '#000',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            {traveler.isChild ? `Child ${travelerIndex + 1}` : `Adult ${travelerIndex + 1}`}
                          </h5>
                          <span className="badge" style={{
                            backgroundColor: traveler.isChild ? '#6c757d' : '#007bff',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {traveler.isChild ? 'Child' : 'Adult'}
                          </span>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.name}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'name', e.target.value)}
                              required
                               style={{
                          height:'40px'
                        }}
                            />
                          </div>
                          <div className="col-md-2 mb-3">
                            <label className="form-label">Age *</label>
                            <input
                              type="text"
                              className="form-control"
                              min="0"
                              max={traveler.isChild ? "11" : "100"}
                              value={traveler.age || ''}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'age', parseInt(e.target.value) || 0)}
                              required
                               onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}   
                               style={{
                          height:'40px'
                        }}
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Gender *</label>
                            <select
                              className="form-control"
                              value={traveler.gender}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'gender', e.target.value)}
                              required
                               style={{
                          height:'40px'
                        }}
                            >
                              <option value="">Select Gender</option>
                              {genderOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">ID Proof Type *</label>
                            <select
                              className="form-control"
                              value={traveler.idProofType}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'idProofType', e.target.value)}
                              required
                               style={{
                          height:'40px'
                        }}
                            >
                              <option value="">Select ID Type</option>
                              {idProofOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">ID Proof Number *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.idProofNumber}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'idProofNumber', e.target.value)}
                              required
 onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}                               style={{
                          height:'40px'
                        }}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Special Notes</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.specialNotes}
                              onChange={(e) => handleTravelerInputChange(packageId, travelerIndex, 'specialNotes', e.target.value)}
                              placeholder="Allergies, dietary restrictions, etc."
                               style={{
                          height:'40px'
                        }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="navigation-buttons" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '2rem'
                  }}>
                    <button
                      onClick={() => {
                        const tabs = getTabs();
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        const prevTab = tabs[currentIndex - 1];
                        if (prevTab) setActiveTab(prevTab.id);
                      }}
                      className="tg-btn"
                      style={{ backgroundColor: '#6c757d', border: 'none' }}
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={() => {
                        const tabs = getTabs();
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        const nextTab = tabs[currentIndex + 1];
                        if (nextTab) {
                          setActiveTab(nextTab.id);
                        } else {
                          // Last tab - proceed to checkout
                          handleCheckoutSubmit();
                        }
                      }}
                      className="tg-btn"
                    >
                      {getTabs().findIndex(tab => tab.id === activeTab) === getTabs().length - 1 
                        ? (currentProcessing ? 'Processing...' : 'Complete Checkout')
                        : 'Next →'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartArea;