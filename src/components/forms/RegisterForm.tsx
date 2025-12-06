import { useState } from "react";
import type{ FormEvent, ChangeEvent } from "react"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}
const BASE_URL = import.meta.env.VITE_BASE_URL

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
// const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const value = e.target.value;
//   // Only allow numbers
//   if (/^[0-9]*$/.test(value)) {
//     setFormData(prev => ({
//       ...prev,
//       phone: value
//     }));
//   }
// };
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
   let  id =localStorage.getItem('userId')

    try {
      const response = await axios.put(`${BASE_URL}users/${id}`,formData,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      toast.success('Registration successful!',{
         duration:2000
      });
      navigate('/')

    } catch (err) {
      setError( 'Something went wrong. Please try again. or check if email is already used');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* <div className="col-lg-12 mb-25">
          <input
            name="phone"
            maxLength={10}
            value={formData.phone}
            onChange={handlePhoneChange}
            className="input"
            type="text"
            placeholder="Enter your Phone Number"
            required
          />
        </div> */}
        <div className="col-lg-12 mb-25">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input"
            type="text"
            placeholder="Enter your First Name"
            required
          />
        </div>
        <div className="col-lg-12 mb-25">
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input"
            type="text"
            placeholder="Enter your Last Name"
            required
          />
        </div>
        <div className="col-lg-12 mb-25">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            type="email"
            placeholder="Enter your Email"
            required
          />
        </div>

        <div className="col-lg-12">
          <button type="submit" className="tg-btn w-100" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </form>
  );
};

export default RegisterForm;
