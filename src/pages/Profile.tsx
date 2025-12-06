import React, { useEffect, useState } from "react";
import HeaderSix from "../layouts/headers/HeaderSix";
import FooterSix from "../layouts/footers/FooterSix";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

const BASE_URL = import.meta.env.VITE_BASE_URL;
    const role = localStorage.getItem("UserType");

interface UserPreferences {
  preferredTransport: string[];
  preferredDestinations: string[];
  language?: string;
}

interface AgentRating {
  average: number;
  totalReviews: number;
}

interface AgentDocument {
  name: string;
  url: string;
}

interface AgentData {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  phone: string;
  alternatePhone: string;
  profileImage: string;
  experienceYears: number;
  specialties: string[];
  preferredLanguages: string[];
  certifications: string[];
  bio: string;
  status: string;
  availabilityStatus: string;
  totalBookingsHandled: number;
  assignedBookingIds: string[];
  assignedTourIds: string[];
  isDisabled: boolean;
  verificationStatus: string;
  wallet: number;
  documents: AgentDocument[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
  rating: AgentRating;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
}

interface User {
  phoneOtp: { attempts: number };
  preferences: UserPreferences;
  _id: string;
  firstName: string;
  phone: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
  email?: string;
  lastName?: string;
  fullName: string;
  id: string;
  avatarUrl?: string;
  bio?: string;
  createdBy?: string;
  updatedBy?: string;
  agents?: AgentData;
}

// Update form data interface
interface UpdateUserData {
  firstName: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  preferences: UserPreferences;
  createdBy?: string;
  updatedBy?: string;
}

// Agent update data interface - matching backend payload
interface UpdateAgentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  profileImage: string;
  experienceYears: number;
  specialties: string[];
  preferredLanguages: string[];
  certifications: string[];
  bio: string;
  availabilityStatus: string;
  // Note: The following fields are not included as they are likely
  // auto-managed by the backend or not meant to be updated via profile
  // status: string;
  // rating: AgentRating;
  // totalBookingsHandled: number;
  // assignedBookingIds: string[];
  // assignedTourIds: string[];
  // documents: AgentDocument[];
  // notes: string;
  // isDisabled: boolean;
}



const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    fetchUserData();
    // Only fetch bookings if user is not Agent
      fetchBookings();
  }, [userData?.role]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const id = localStorage.getItem("userId");
      if (!id) {
        throw new Error("User ID not found ");
      }
      const res = await axios.get(`${BASE_URL}users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(res.data.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingLoading(true);
      const id = localStorage.getItem("userId");
      if (!id) throw new Error("User ID not found");

      const res = await axios.get(`${BASE_URL}bookings/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId: id }
      });

      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("hasCountedBefore");
    localStorage.removeItem("UserType");
    navigate("/login");
  };

  const handleUpdateUser = async (updateData: UpdateUserData | UpdateAgentData) => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) {
        throw new Error("User ID not found");
      }

      let res;
      if (userData?.role === "Agent") {
        // Update agent profile using the agents endpoint
        const agentId = userData.agents?._id;
        if (!agentId) throw new Error("Agent ID not found");
        
        res = await axios.put(`${BASE_URL}agents/${agentId}`, updateData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // Update regular user profile
        res = await axios.put(`${BASE_URL}users/${id}`, updateData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      // Refresh user data after successful update
      await fetchUserData();
      toast.success("Profile updated successfully!");
      return res.data;
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      throw error;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="tg-blog-sidebar-box">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading profile data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="tg-blog-sidebar-box">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="tg-blog-sidebar-box">
          <div className="alert alert-warning" role="alert">
            No user data found.
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardView user={userData} />;
      case "edit-profile":
        return <EditProfileView user={userData} onUpdate={handleUpdateUser} />;
      case "my-bookings":
        return <MyBookingsView bookings={bookings} loading={bookingLoading} />;
      default:
        return <DashboardView user={userData} />;
    }
  };

  // Get user's first initial for fallback
  const getUserInitial = () => {
    if(role === "Agent" && userData?.agents){
      return userData.agents.firstName?.[0]?.toUpperCase() || "A";
    }
    return userData?.firstName?.[0]?.toUpperCase() || "U";
  };

  // Get user's full name or fallback
  const getUserFullName = () => {
    if(role === "Agent" && userData?.agents){
      return `${userData.agents.fullName}`;
    }
    return userData?.fullName || "User";
  };

  // Get user's email or fallback
  const getUserEmail = () => {
  if(role === "Agent" && userData?.agents){
      return userData.agents.email || "Loading...";
    }
    return userData?.email || "Loading...";
  };

  // Get avatar URL - prefer agent profile image if available
  const getAvatarUrl = () => {
    if (userData?.role === "Agent" && userData.agents?.profileImage) {
      return userData.agents.profileImage;
    }
    return userData?.avatarUrl;
  };

  const [imageError, setImageError] = useState(false);


const EditProfileView = ({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (data: UpdateUserData | UpdateAgentData) => void;
}) => {
  const isAgent = user.role === "Agent";
  const agentData = user.agents;

  // Common form state
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName || "",
    email: user.email || "",
    avatarUrl: user.avatarUrl || "",
    bio: user.bio || "",
    preferences: {
      preferredTransport: user.preferences.preferredTransport.join(", "),
      preferredDestinations: user.preferences.preferredDestinations.join(", "),
      language: user.preferences.language || "",
    },
  });

  // Agent specific form state
  const [agentFormData, setAgentFormData] = useState({
    firstName: agentData?.firstName || "",
    lastName: agentData?.lastName || "",
    email: agentData?.email || "",
    phone: agentData?.phone || "",
    alternatePhone: agentData?.alternatePhone || "",
    profileImage: agentData?.profileImage || "",
    experienceYears: agentData?.experienceYears || 0,
    specialties: agentData?.specialties.join(", ") || "",
    preferredLanguages: agentData?.preferredLanguages.join(", ") || "",
    certifications: agentData?.certifications.join(", ") || "",
    bio: agentData?.bio || "",
    availabilityStatus: agentData?.availabilityStatus || "Available",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (isAgent) {
        const updateData: UpdateAgentData = {
          firstName: agentFormData.firstName,
          lastName: agentFormData.lastName,
          email: agentFormData.email,
          phone: agentFormData.phone,
          alternatePhone: agentFormData.alternatePhone,
          profileImage: agentFormData.profileImage,
          experienceYears: agentFormData.experienceYears,
          specialties: agentFormData.specialties
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
          preferredLanguages: agentFormData.preferredLanguages
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
          certifications: agentFormData.certifications
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
          bio: agentFormData.bio,
          availabilityStatus: agentFormData.availabilityStatus,
        };
        await onUpdate(updateData);
      } else {
        // Update regular user data
        const updateData: UpdateUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          email: formData.email || undefined,
          avatarUrl: formData.avatarUrl || undefined,
          bio: formData.bio || undefined,
          preferences: {
            preferredTransport: formData.preferences.preferredTransport
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item),
            preferredDestinations: formData.preferences.preferredDestinations
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item),
            language: formData.preferences.language || undefined,
          },
          createdBy: user.createdBy,
          updatedBy: user.updatedBy,
        };
        await onUpdate(updateData);
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (isAgent && name.startsWith("agent.")) {
      const agentField = name.split(".")[1];
      setAgentFormData((prev) => ({
        ...prev,
        [agentField]: name === "agent.experienceYears" ? parseInt(value) || 0 : value,
      }));
    } else if (name.startsWith("preferences.")) {
      const prefField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="tg-blog-sidebar-box">
      <h4 className="tg-blog-sidebar-title mb-30">
        {isAgent ? "Edit Agent Profile" : "Edit Profile"}
      </h4>
      {message && (
        <div
          className={`alert alert-${
            message.type === "success" ? "success" : "danger"
          } mb-3`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row">
          {isAgent ? (
            // Agent Edit Form
            <>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>First Name *</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.firstName"
                    value={agentFormData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Last Name *</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.lastName"
                    value={agentFormData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Email Address *</label>
                  <input
                    className="input"
                    type="email"
                    name="agent.email"
                    value={agentFormData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Phone *</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.phone"
                    value={agentFormData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Alternate Phone</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.alternatePhone"
                    value={agentFormData.alternatePhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Profile Image URL</label>
                  <input
                    className="input"
                    type="url"
                    name="agent.profileImage"
                    value={agentFormData.profileImage}
                    onChange={handleChange}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Experience Years *</label>
                  <input
                    className="input"
                    type="number"
                    name="agent.experienceYears"
                    value={agentFormData.experienceYears}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Availability Status</label>
                  <select
                    className="input"
                    name="agent.availabilityStatus"
                    value={agentFormData.availabilityStatus}
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Specialties (comma separated)</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.specialties"
                    value={agentFormData.specialties}
                    onChange={handleChange}
                    placeholder="Adventure, Cultural, Beach, Luxury"
                  />
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Preferred Languages (comma separated)</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.preferredLanguages"
                    value={agentFormData.preferredLanguages}
                    onChange={handleChange}
                    placeholder="English, Spanish, French, German"
                  />
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Certifications (comma separated)</label>
                  <input
                    className="input"
                    type="text"
                    name="agent.certifications"
                    value={agentFormData.certifications}
                    onChange={handleChange}
                    placeholder="IATA Certified, Travel Advisor License, Tourism Diploma"
                  />
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Bio</label>
                  <textarea
                    className="input"
                    name="agent.bio"
                    value={agentFormData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your experience as a travel agent, your expertise, and what makes you unique..."
                  />
                </div>
              </div>
            </>
          ) : (
            // Regular User Edit Form
            <>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>First Name *</label>
                  <input
                    className="input"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Last Name</label>
                  <input
                    className="input"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Email Address</label>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Avatar URL</label>
                  <input
                    className="input"
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Bio</label>
                  <textarea
                    className="input"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Preferred Transport (comma separated)</label>
                  <input
                    className="input"
                    type="text"
                    name="preferences.preferredTransport"
                    value={formData.preferences.preferredTransport}
                    onChange={handleChange}
                    placeholder="Flight, Cab, Train"
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Preferred Language</label>
                  <input
                    className="input"
                    type="text"
                    name="preferences.language"
                    value={formData.preferences.language}
                    onChange={handleChange}
                    placeholder="English"
                  />
                </div>
              </div>
              <div className="col-12 mb-20">
                <div className="tg-checkout-form-input">
                  <label>Preferred Destinations</label>
                  <input
                    className="input"
                    type="text"
                    name="preferences.preferredDestinations"
                    value={formData.preferences.preferredDestinations}
                    onChange={handleChange}
                    placeholder="Bali, Goa, Manali"
                  />
                </div>
              </div>
            </>
          )}
          <div className="col-12 mt-20">
            <button type="submit" className="tg-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? "Updating..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const DashboardView = ({ user }: { user: User }) => {
  const isAgent = role === "Agent";
  const agentData = user.agents;

  return (
    <div className="tg-blog-sidebar-box">
      <h4 className="tg-blog-sidebar-title mb-30">
        {isAgent ? "Agent Dashboard" : "Account Overview"}
      </h4>
      <div className="tg-checkout-form-wrapper">
        <div className="row">
          {/* Common User Fields */}
          <div className="col-md-6 mb-20">
            <strong>Full Name:</strong>
            <p>{getUserFullName()}</p>
          </div>
          <div className="col-md-6 mb-20">
            <strong>Phone:</strong>
            <p>
              {user.phone}
              {user.isPhoneVerified ? (
                <span className="ms-2 badge bg-success">Verified</span>
              ) : (
                <span className="ms-2 badge bg-warning text-dark">
                  Not Verified
                </span>
              )}
            </p>
          </div>
          <div className="col-md-6 mb-20">
            <strong>Member Since:</strong>
            <p>
              {new Date(user.createdAt).toLocaleDateString("en-Gb", {
                day: "2-digit",
                month: "numeric",
                year: "2-digit",
              })}
            </p>
          </div>
          <div className="col-md-6 mb-20">
            <strong>Profile Status:</strong>
            <p>
              <span
                className={`badge ${
                  user.status === "Pending" ? "bg-info" : "bg-light text-dark"
                }`}
              >
                {user.status}
              </span>
            </p>
          </div>
          <div className="col-md-6 mb-20">
            <strong>Role:</strong>
            <p>{user.role}</p>
          </div>

          {/* Agent Specific Fields */}
          {isAgent && agentData && (
            <>
              <div className="col-md-6 mb-20">
                <strong>Agent Email:</strong>
                <p>{agentData.email}</p>
              </div>
              <div className="col-md-6 mb-20">
                <strong>Experience:</strong>
                <p>{agentData.experienceYears} years</p>
              </div>
              <div className="col-md-6 mb-20">
                <strong>Availability:</strong>
                <p>
                  <span
                    className={`badge ${
                      agentData.availabilityStatus === "Available"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {agentData.availabilityStatus}
                  </span>
                </p>
              </div>
              <div className="col-md-6 mb-20">
                <strong>Verification Status:</strong>
                <p>
                  <span
                    className={`badge ${
                      agentData.verificationStatus === "Verified"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {agentData.verificationStatus}
                  </span>
                </p>
              </div>
              <div className="col-md-6 mb-20">
                <strong>Total Bookings Handled:</strong>
                <p>{agentData.totalBookingsHandled}</p>
              </div>
              <div className="col-md-6 mb-20">
                <strong>Rating:</strong>
                <p>
                  {agentData.rating.average > 0
                    ? `${agentData.rating.average}/5 (${agentData.rating.totalReviews} reviews)`
                    : "No ratings yet"}
                </p>
              </div>
              {agentData.specialties.length > 0 && (
                <div className="col-12 mb-20">
                  <strong>Specialties:</strong>
                  <p>{agentData.specialties.join(", ")}</p>
                </div>
              )}
              {agentData.preferredLanguages.length > 0 && (
                <div className="col-12 mb-20">
                  <strong>Preferred Languages:</strong>
                  <p>{agentData.preferredLanguages.join(", ")}</p>
                </div>
              )}
              {agentData.certifications.length > 0 && (
                <div className="col-12 mb-20">
                  <strong>Certifications:</strong>
                  <p>{agentData.certifications.join(", ")}</p>
                </div>
              )}
              {agentData.bio && (
                <div className="col-12 mb-20">
                  <strong>Bio:</strong>
                  <p>{agentData.bio}</p>
                </div>
              )}
            </>
          )}

          {/* Regular User Fields */}
          {!isAgent && (
            <>
              {user.email && (
                <div className="col-md-6 mb-20">
                  <strong>Email:</strong>
                  <p>{user.email}</p>
                </div>
              )}
              {user.bio && (
                <div className="col-12 mb-20">
                  <strong>Bio:</strong>
                  <p>{user.bio}</p>
                </div>
              )}
              <div className="col-12 mb-20">
                <strong>Preferred Transport:</strong>
                <p>
                  {user.preferences.preferredTransport.join(", ") ||
                    "None specified"}
                </p>
              </div>
              <div className="col-12 mb-20">
                <strong>Preferred Destinations:</strong>
                <p>
                  {user.preferences.preferredDestinations.join(", ") ||
                    "None specified"}
                </p>
              </div>
              {user.preferences.language && (
                <div className="col-12 mb-20">
                  <strong>Preferred Language:</strong>
                  <p>{user.preferences.language}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const MyBookingsView = ({ bookings, loading }: { bookings: any[]; loading: boolean }) => {
  return (
    <div className="tg-blog-sidebar-box">
      <h4 className="tg-blog-sidebar-title mb-30">My Bookings</h4>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border"></div>
          <p className="mt-2">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-muted">You have no bookings yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Sr No.</th>
                <th>Package</th>
                <th>Date</th>
                <th>Travelers</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any, i: number) => (
                <tr key={b._id}>
                  <td>{i + 1}</td>
                  <td>{b.selectedPackageId.packageName || "N/A"}  ({b.bookingType})</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td>{b.numberOfTravelers}</td>
                  <td>{b.finalAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.bookingStatus === "Confirmed"
                          ? "bg-success"
                          : b.bookingStatus === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};





  return (
    <>
      <SEO pageTitle={"User Profile"} />

      <HeaderSix />
      <main>
        <section className="tg-blog-area pt-20 pb-120">
          <div className="container">
            <div className="row">
              {/* --- Sidebar --- */}
              <div className="col-lg-4">
                <aside className="tg-blog-sidebar me-lg-4">
                  <div className="tg-blog-sidebar-box text-center mb-40">
                    <div className="position-relative d-inline-block">
                      {getAvatarUrl() && !imageError ? (
                        <img
                          src={getAvatarUrl()}
                          alt={getUserFullName()}
                          className="rounded-circle mb-3 border"
                          width="120"
                          height="120"
                          style={{
                            objectFit: "cover",
                            border: "4px solid #e9ecef",
                          }}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div
                          className="rounded-circle mb-3 border d-flex align-items-center justify-content-center"
                          style={{
                            width: "120px",
                            height: "120px",
                            border: "4px solid #e9ecef",
                            backgroundColor: "#0d6efd",
                            color: "white",
                            fontSize: "48px",
                            fontWeight: "bold",
                          }}
                        >
                          {getUserInitial()}
                        </div>
                      )}
                    </div>
                    <h4 className="tg-blog-sidebar-title">
                      {getUserFullName()}
                    </h4>
                    <p className="mb-30">{getUserEmail()}</p>
                    {userData?.bio && (
                      <p className="text-muted mb-30">{userData.bio}</p>
                    )}

                    <div className="tg-blog-categories-list text-start">
                      <ul className="list-unstyled">
                        <li>
                          <button
                            className="profile-nav-link"
                            onClick={() => setActiveTab("dashboard")}
                          >
                            <i className="fas fa-th-large me-3"></i> Dashboard
                          </button>
                        </li>
                        <li>
                          <button
                            className="profile-nav-link"
                            onClick={() => setActiveTab("edit-profile")}
                          >
                            <i className="fas fa-user-edit me-3"></i> Edit
                            Profile
                          </button>
                        </li>
                        {/* Only show My Bookings tab for non-Agent users */}
                          <li>
                            <button
                              className="profile-nav-link"
                              onClick={() => setActiveTab("my-bookings")}
                            >
                              <i className="fas fa-receipt me-3"></i> My Bookings
                            </button>
                          </li>
                        <li className="mt-20">
                          <button
                            onClick={handleLogOut}
                            className="profile-nav-link text-danger"
                          >
                            <i className="fas fa-sign-out-alt me-3"></i> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="col-lg-8">{renderContent()}</div>
            </div>
          </div>
        </section>
      </main>
      <FooterSix />
    </>
  );
};

export default UserProfilePage;