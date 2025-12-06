import {  useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const RegisterFormAgent = () => {


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    profileImage: "",
    experienceYears: "",
    specialties: "",
    preferredLanguages: "",
    certifications: "",
    bio: "",
    
  });

  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen,setConfirmDialogOpen]=useState(false)
  const navigate = useNavigate();





 useEffect(() => {
  const phone = localStorage.getItem("phone");
  if (phone) {
    setFormData(prev => ({ ...prev, phone })); // update only the phone field
  }
}, []);


  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        preferredLanguages: formData.preferredLanguages
          .split(",")
          .map((l) => l.trim()),
        certifications: formData.certifications.split(",").map((c) => c.trim()),
        status: "Active",
        availabilityStatus: "Available",
        userId: localStorage.getItem("userId"),
      };

      const res = await axios.post(`${BASE_URL}agents`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res);

      toast.success("Agent registered successfully!");

      setConfirmDialogOpen(true)
      
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>

      {/* Row 1 */}
      <div className="row">
        <div className="col-lg-6 mb-3">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input w-100"
            placeholder="First Name"
            required
          />
        </div>

        <div className="col-lg-6 mb-3">
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input w-100"
            placeholder="Last Name"
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="col-lg-12 mb-3">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="input w-100"
            placeholder="Email"
            required
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="row">
        <div className="col-lg-6 mb-3">
          <input
            name="text"
            value={formData.phone}
            disabled
            onChange={(e) => {
              // Remove non-numeric characters
              const numericValue = e.target.value.replace(/\D/g, '');
              setFormData((prev) => ({ ...prev, phone: numericValue }));
            }}
            maxLength={10}
            className="input w-100"
            placeholder="Phone"
            required
          />
        </div>

        {/* <div className="col-lg-6 mb-3">
      <input
        name="alternatePhone"
        value={formData.alternatePhone}
        onChange={handleChange}
        className="input w-100"
        placeholder="Alternate Phone"
      />
    </div> */}
        <div className="col-lg-6 mb-3">
          <input
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            className="input w-100"
            placeholder="Experience "
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="row">
        {/* <div className="col-lg-6 mb-3">
      <input
        name="profileImage"
        value={formData.profileImage}
        onChange={handleChange}
        className="input w-100"
        placeholder="Profile Image URL"
      />
    </div> */}

        {/* <div className="col-lg-6 mb-3">
      <input
        name="experienceYears"
        value={formData.experienceYears}
        onChange={handleChange}
        className="input w-100"
        placeholder="Experience (Years)"
      />
    </div> */}
      </div>

      {/* Row 5 */}
      <div className="row">
        <div className="col-lg-6 mb-3">
          <input
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            className="input w-100"
            placeholder="Specialties"
          />
        </div>

        <div className="col-lg-6 mb-3">
          <input
            name="preferredLanguages"
            value={formData.preferredLanguages}
            onChange={handleChange}
            className="input w-100"
            placeholder="Languages"
          />
        </div>
      </div>

      {/* Row 6 */}
      <div className="row">
        <div className="col-lg-12 mb-3">
          <input
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="input w-100"
            placeholder="Certifications "
          />
        </div>
      </div>

      {/* Row 7 */}
      <div className="row">
        <div className="col-lg-12 mb-3">
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="input w-100 h-80"
            placeholder="Short Bio"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button className="tg-btn w-100" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Register Agent"}
      </button>

    </form>
  {confirmDialogOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px 40px",
        borderRadius: "10px",
        textAlign: "center",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ color: "#4CAF50", marginBottom: "15px" }}>
        Agent Created Successfully
      </h2>
      <p style={{ marginBottom: "20px", color: "#333" }}>
        You can login after the admin approves your account.
      </p>
      <button
        onClick={() =>{
           setConfirmDialogOpen(false)
           navigate("/login");

        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
   </>
  );


};

export default RegisterFormAgent;
