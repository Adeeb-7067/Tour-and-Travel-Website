import { useEffect, useState } from "react";
import NiceSelect from "../../../ui/NiceSelect";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchPackageById } from "../../../redux/features/placeDetailSlice";
import {  useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

interface CustomAddOn {
  description: string;
  name: string;
  optional: boolean;
  price: number;
}

interface FormData {
  date: string;
  time: string;
  adult: number;
  youth: number;
  children: number;
  extras: {
    [key: string]: boolean;
  };
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

const FeatureSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.placeDetail);
  const params = useParams();
  const packageId = params.id;
  // console.log(data)
  useEffect(() => {
    if (packageId) {
      dispatch(fetchPackageById(packageId));
    }
  }, [dispatch, packageId]);

  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "12:00",
    adult: 0,
    youth: 0,
    children: 0,
    extras: {},
  });

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [travelerForms, setTravelerForms] = useState<TravelerInfo[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    specialRequests: ""
  });
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [currentProcessing, setCurrentProcessing] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const userId = localStorage.getItem('userId') || '';

  const genderOptions = ["Male", "Female", "Other"];
  const idProofOptions = ["Passport", "Driver's License", "National ID", "Birth Certificate", "Aadhaar Card", "Other"];
  const navigate = useNavigate()
  // Initialize extras based on customAddOns when data loads
  useEffect(() => {
    if (data?.customAddOns && data.customAddOns.length > 0) {
      const initialExtras: { [key: string]: boolean } = {};
      data.customAddOns.forEach((addon: CustomAddOn) => {
        const key = addon.name.replace(/\s+/g, '_').toLowerCase();
        initialExtras[key] = false;
      });
      setFormData(prev => ({
        ...prev,
        extras: initialExtras
      }));
    }
  }, [data?.customAddOns]);

  // Handle modal body overflow
  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBookingModal]);

  // Handle select changes
  const selectHandler = (value: any, name: string) => {
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: Number(value.value) }));
  };

  // Handle checkbox changes for dynamic addons
const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    extras: {
      ...prev.extras,
      [name]: checked,
    },
  }));
};


  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Calculate base price for adults
    if (data?.basePricePerPerson) {
      const adultPrice = parseFloat(data.basePricePerPerson.toString()) || 0;
      total += formData.adult * adultPrice;
    }
    
    // Calculate price for children
    if (data?.childPrice) {
      const childPrice = parseFloat(data.childPrice.toString()) || 0;
      total += formData.children * childPrice;
    }
   
    // Calculate addons price
    if (data?.customAddOns) {
      data.customAddOns.forEach((addon: CustomAddOn) => {
        const key = addon.name.replace(/\s+/g, '_').toLowerCase();
        if (formData.extras[key]) {
          total += addon.price;
        }
      });
    }
     
    return total;
  };

  const handleBookNowClick = () => {
    if (formData.adult === 0 && formData.children === 0) {
      toast.error("Please select at least one adult or child"); 
      return;
    }

    if (!formData.date) {
      toast.error("Please select a check-in date");
      return;
    }

    const adultForms: TravelerInfo[] = Array(formData.adult).fill(null).map(() => ({
      name: "",
      age: 0,
      gender: "",
      idProofType: "",
      idProofNumber: "",
      specialNotes: "",
      isChild: false
    }));

    const childForms: TravelerInfo[] = Array(formData.children).fill(null).map(() => ({
      name: "",
      age: 0,
      gender: "",
      idProofType: "",
      idProofNumber: "",
      specialNotes: "",
      isChild: true
    }));

    setTravelerForms([...adultForms, ...childForms]);
    setActiveTab("customer");
    setShowBookingModal(true);
  };

  // Handle customer info changes
  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTravelerInputChange = (travelerIndex: number, field: keyof TravelerInfo, value: string | number | boolean) => {
    setTravelerForms(prev => 
      prev.map((traveler, index) => 
        index === travelerIndex ? { ...traveler, [field]: value } : traveler
      )
    );
  };

  // Direct booking function
  const handleDirectBooking = async () => {
  try {
    setCurrentProcessing(true);

    // ========== VALIDATIONS ==========
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error("Please fill all required customer information fields");
      setActiveTab("customer");
      setCurrentProcessing(false);
      return;
    }

    for (let i = 0; i < travelerForms.length; i++) {
      const traveler = travelerForms[i];

      if (
        !traveler.name ||
        !traveler.age ||
        !traveler.gender ||
        !traveler.idProofType ||
        !traveler.idProofNumber
      ) {
        const travelerType = traveler.isChild ? "child" : "adult";
        toast.error(`Please fill all required fields for ${travelerType} traveler ${i + 1}`);
        setActiveTab("travelers");
        setCurrentProcessing(false);
        return;
      }

      if (traveler.isChild && traveler.age >= 12) {
        toast.error(`Child traveler ${i + 1} must be under 12 years old`);
        setActiveTab("travelers");
        setCurrentProcessing(false);
        return;
      }
    }

    // Format date
    const formatDateForBackend = (dateString: string) =>
      new Date(dateString).toISOString();

    // ========== BOOKING DATA ==========
    const bookingData = {
      userId: localStorage.getItem("userId"),
      packageId: packageId,
      adults: formData.adult,
      children: formData.children,
      checkInDate: formatDateForBackend(formData.date),
      selectedAddOns: data?.customAddOns
        ?.filter((addon: CustomAddOn) => {
          const key = addon.name.replace(/\s+/g, "_").toLowerCase();
          return formData.extras[key];
        })
        .map((addon: CustomAddOn) => ({
          name: addon.name,
          price: addon.price,
          description: addon.description,
        })) || [],
      totalAmount: calculateTotal(),
      customerInfo,
      travelerDetails: travelerForms,
    };

    // ================================
    // 1️⃣ HIT CHECKOUT API (backend creates order)
    // ================================
    const res = await fetch(`${BASE_URL}checkout/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(bookingData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      toast.error(responseData?.message || "Booking failed");
      return;
    }



toast.success("Booking created! Opening payment...");

const {
  razorpayOrder,
  razorpayKeyId,
  bookingIds,
} = responseData;

// Razorpay checkout config
const options = {
  key: razorpayKeyId,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  name: "Tours & Travel Booking",
  description: "Package Booking Payment",
  order_id: razorpayOrder.id,

  handler: async function (resp: any) {
    const verifyRes = await fetch(`${BASE_URL}checkout/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        bookingIds,
        razorpay_payment_id: resp.razorpay_payment_id,
        razorpay_order_id: resp.razorpay_order_id,
        razorpay_signature: resp.razorpay_signature,
      }),
    });

    const verifyData = await verifyRes.json();
    if (verifyRes.ok) {
      toast.success("Payment Successful 🎉");
      setShowBookingModal(false);
      navigate('/')

    } else {
      toast.error(verifyData?.message || "Payment verification failed!");
    }
  },

  prefill: {
    name: customerInfo.name,
    email: customerInfo.email,
    contact: customerInfo.phone,
  },

  theme: {
    color: "#3399cc",
  },
};

const rzp = new (window as any).Razorpay(options);
rzp.open();

  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Error during booking");
  } finally {
    setCurrentProcessing(false);
  }
};




  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return `${price.toFixed(2)}`;
    }
    return price;
  };

  const tabs = [
    { id: "customer", label: "Contact Info", icon: "" },
    { id: "travelers", label: "Traveler Details", icon: "", subtitle: `${formData.adult}A ${formData.children}C` }
  ];

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <h4 className="tg-tour-about-title title-2 mb-15">Book This Tour</h4>

        {/* Date Input */}
        <div className="tg-booking-form-parent-inner mb-10">
          <div className="tg-tour-about-date p-relative">
            <label htmlFor="time" style={{fontSize:'14px', marginInline:'4px'}}>Check-In Date</label>
            <input
              className="input"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* Ticket Sections */}
        <div className="tg-tour-about-border-doted mb-15"></div>
        <div className="tg-tour-about-tickets-wrap mb-15">
          {[
            { label: "Adult", price: data?.basePricePerPerson, name: "adult" },
            { label: "Children", price: data?.childPrice, name: "children" },
          ].map((ticket) => (
            <div key={ticket.name} className="tg-tour-about-tickets mb-10">
              <div className="tg-tour-about-tickets-adult">
                <span>{ticket.label}</span>
                <p className="mb-0" style={{fontSize:'12px'}}>
                  ({ticket.label === "Children" ? "Below 13 years" : "14+ years"}){" "}
                  <span style={{fontSize:'10px',fontWeight:'bold'}}>{formatPrice(ticket.price || 0)}</span>
                </p>
              </div>
              <div className="tg-tour-about-tickets-quantity">
                <NiceSelect
                  className="select item-first "
                  placeholder=""
                  options={Array.from({ length: 8 }, (_, i) => ({
                    value: String(i),
                    text: String(i),
                  }))}
                  defaultCurrent={0}
                  onChange={(value: any) => selectHandler(value, ticket.name)}
                  name={ticket.name}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Extras from customAddOns */}
        {data?.customAddOns && data.customAddOns.length > 0 && (
          <>
            <div className="tg-tour-about-border-doted mb-15"></div>
            <div className="tg-tour-about-extra mb-10">
              <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
                Add Extra:
              </span>
              <div className="tg-filter-list">
                <ul>
                  {data.customAddOns.map((addon: CustomAddOn) => {
                    const key = addon.name.replace(/\s+/g, '_').toLowerCase();
                    return (
                      <li key={addon.name}>
                        <div className="checkbox d-flex">
                          <input
                            className="tg-checkbox"
                            type="checkbox"
                            id={key}
                            name={key}
                            checked={formData.extras[key] || false}
                            onChange={handleCheckbox}
                          />
                          <label htmlFor={key} className="">
                            <div>
                              <h6 style={{fontSize:'14px'}}>{addon.name}</h6>
                              <p className="" style={{fontSize:'10px',lineHeight:'12px'}}>
                                {addon.description}
                              </p>
                            </div>
                          </label>
                        </div>
                        <strong className="quantity">{addon.price.toFixed(2)}</strong>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Total & Submit */}
        <div className="tg-tour-about-border-doted mb-15"></div>
        <div className="tg-tour-about-coast d-flex align-items-center flex-wrap justify-content-between mb-20">
          <span className="tg-tour-about-sidebar-title d-inline-block">
            Total Cost:
          </span>
          <h5 className="total-price">{calculateTotal().toFixed(2)}</h5>
        </div>

        <button
          type="button"
          className="tg-btn tg-btn-switch-animation w-100"
          onClick={handleBookNowClick}
        >
          Book Now
        </button>
      </form>

      {/* Booking Modal */}
      {showBookingModal && createPortal(
      <div className="modal-overlay" style={{
          position: 'fixed',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
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
            zIndex:99999,

          }}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0,padding:0 }}>Complete Your Booking</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 0,
                  width: '30px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div className="tab-navigation" style={{
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8f9fa',
            }}>
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '0 1rem',
              }}>
                {tabs.map((tab) => (
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
                      height:'50px',
                      borderBottom: activeTab === tab.id ? '3px solid #0056b3' : '3px solid transparent',
                    }}
                  >
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
              {/* Package Details Tab */}
              {/* {activeTab === "package" && (
                <div className="package-details">
                  <h4 className="mb-4">Booking Summary</h4>
                  <div className="booking-summary p-4" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <h5>{data?.packageName}</h5>
                    <p><strong>Check-in Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                    <p><strong>Adults:</strong> {formData.adult}</p>
                    <p><strong>Children:</strong> {formData.children}</p>
                    <p><strong>Total Amount:</strong> ${calculateTotal().toFixed(2)}</p>
                    
                    {data?.customAddOns && data.customAddOns.filter((addon: CustomAddOn) => {
                      const key = addon.name.replace(/\s+/g, '_').toLowerCase();
                      return formData.extras[key];
                    }).length > 0 && (
                      <div>
                        <strong>Add-ons:</strong>
                        <ul>
                          {data.customAddOns.filter((addon: CustomAddOn) => {
                            const key = addon.name.replace(/\s+/g, '_').toLowerCase();
                            return formData.extras[key];
                          }).map((addon: CustomAddOn) => (
                            <li key={addon.name}>{addon.name} - ${addon.price}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="navigation-buttons" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '2rem'
                  }}>
                    <button
                      onClick={() => setActiveTab("customer")}
                      className="tg-btn"
                    >
                      Next: Contact Info →
                    </button>
                  </div>
                </div>
              )} */}

              {activeTab === "customer" && (
                <div className="customer-info">
                  <h4 className="mb-4">Primary Contact Information</h4>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={customerInfo.phone}
onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ""); // remove non-digits
    handleCustomerInfoChange("phone", onlyNumbers);
  }}                        required
                        maxLength={10}
                        style={{
                          height:'40px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    {/* <button
                      onClick={() => setActiveTab("customer")}
                      className="tg-btn"
                      style={{ backgroundColor: '#6c757d', border: 'none' }}
                    >
                      ← Previous
                    </button> */}
                    <button
                      onClick={() => setActiveTab("travelers")}
                      className="tg-btn"
                    >
                      Next: Traveler Details →
                    </button>
                  </div>
                </div>
              )}

              {/* Traveler Details Tab */}
              {activeTab === "travelers" && (
                <div className="travelers-info">
                  <h4 className="mb-4">Traveler Details</h4>
                  
                  <div className="travelers-container">
                    {travelerForms.map((traveler, travelerIndex) => (
                      <div key={travelerIndex} className="traveler-form mb-4 p-4" style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '8px',
                        backgroundColor: traveler.isChild ? '#f8f9fa' : 'white'
                      }}>
                        <div className="traveler-header mb-3">
                          <h5 style={{ margin: 0, color: traveler.isChild ? '#6c757d' : '#000' }}>
                            {traveler.isChild ? `Child ${travelerIndex + 1}` : `Adult ${travelerIndex + 1}`}
                          </h5>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.name}
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'name', e.target.value)}
                              required
                              style={{
                                height:'40px'
                              }}
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Age *</label>
                            <input
                              type="text"
                              className="form-control"
                              min="0"
                              max={traveler.isChild ? "11" : "100"}
                              value={traveler.age || ''}
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'age', parseInt(e.target.value) || 0)}
                              required
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
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'gender', e.target.value)}
                              required
                            >
                              <option value="">Select Gender</option>
                              {genderOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">ID Proof Type *</label>
                            <select
                              className="form-control"
                              value={traveler.idProofType}
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'idProofType', e.target.value)}
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
                          <div className="col-md-6 mb-3">
                            <label className="form-label">ID Proof Number *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.idProofNumber}
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'idProofNumber', e.target.value)}
                              required
                              style={{
                                height:'40px'
                              }}
                           
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12 mb-3">
                            <label className="form-label">Special Notes</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveler.specialNotes}
                              onChange={(e) => handleTravelerInputChange(travelerIndex, 'specialNotes', e.target.value)}
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
                      onClick={() => setActiveTab("customer")}
                      className="tg-btn"
                      style={{ backgroundColor: '#6c757d', border: 'none' }}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleDirectBooking}
                      className="tg-btn"
                      disabled={currentProcessing}
                    >
                      {currentProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        ,document.body
      )}
    </>
  );
};

export default FeatureSidebar;