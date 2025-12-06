import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false); 
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const savedData = localStorage.getItem("contactFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        ...parsedData,
        message: "", 
      });
      setSaveInfo(true);
    }
  }, []);

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle checkbox change
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveInfo(e.target.checked);

    if (!e.target.checked) {
      // Remove saved data immediately if unchecked
      localStorage.removeItem("contactFormData");
    }
  };

  // 🔹 Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill all fields", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      const payload = {
        ...formData,
        ...(userId ? { userId } : {}),
      };

      const response = await axios.post(`${BASE_URL}/contactUs`, payload,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success("Message sent successfully!", { position: "top-center" });

        if (saveInfo) {
          localStorage.setItem(
            "contactFormData",
            JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            })
          );
        }

       setFormData({
        name:'',
        email:'',
        phone:'',
        message:'',
       })
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="contact-form">
      <div className="row">
        <div className="col-lg-6 mb-25">
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            disabled={loading}
            required
          />
        </div>

        <div className="col-lg-6 mb-25">
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            disabled={loading}
            required
          />
        </div>

        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="text"
            name="phone"
            value={formData.phone}
             onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}   
            maxLength={10}
            onChange={handleChange}
            placeholder="Contact Number"
            disabled={loading}
          />
        </div>

        <div className="col-lg-12">
          <textarea
            className="textarea mb-5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            disabled={loading}
          ></textarea>

          <div className="review-checkbox d-flex align-items-center mb-25">
            <input
              name="checkbox"
              className="tg-checkbox"
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={handleCheckbox}
              disabled={loading}
            />
            <label htmlFor="saveInfo" className="tg-label">
              Save my name, email, and Contact in this browser for the next time
              I comment.
            </label>
          </div>

          <button type="submit" className="tg-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          <p className="ajax-response mb-0 pt-10"></p>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
