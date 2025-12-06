import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [_isAuthenticated, setIsAuthenticated] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    localStorage.setItem("phone", phone);

    try {
      if (step === "phone") {
        const res = await axios.post(`${BASE_URL}users/phone/send-otp`, {
          phone,
          role: userType
        });
        if (res.status !== 200) throw new Error("Failed to send OTP");
        setStep("otp");
      } else {
        const res = await axios.post(`${BASE_URL}users/phone/verify-otp`, {
          phone,
          otp,
        });
        if (res.status !== 200) throw new Error("Invalid OTP");

        if (res.status === 200) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("userId", res.data.data.userId);
          localStorage.setItem('UserType', res.data.data.role);
          if (res.data.data.needsProfileUpdate === false) {
            toast.success("Logged in successfully", {
              duration: 2000,
            });
            if (userType === "Agent" && res.data.data.isVerified === false) {
              setConfirmDialogOpen(true)
              return;
            }
            setIsAuthenticated(true);
            navigate("/");
          } else {
            toast.success("OTP verified. Please complete your profile.", {
              duration: 2000,
            });
            setIsAuthenticated(true);
            navigate("/register");
          }
        }
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      let newOtp = otp.split("");
      newOtp[index] = value;
      newOtp = newOtp.slice(0, 6);
      setOtp(newOtp.join(""));

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        (nextInput as HTMLInputElement)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      (prevInput as HTMLInputElement)?.focus();
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === "phone" && (
        <div className="mb-40 mt-40">
          <input
            type="text"
            maxLength={10}
            value={phone}
            onChange={handlePhoneChange}
            className="input"
            placeholder="Enter your phone number"
          />
          <select
            required
            className="input mt-3"
            style={{
              width: "100%",
            }}
            value={userType}
            name="userType"
            id="userType"
            onChange={(e) => { setUserType(e.target.value) }}
          >
            <option value="">Select User</option>
            <option value="Traveler">Traveler</option>
            <option value="Agent">Agent</option>
          </select>
        </div>
      )}

      {step === "otp" && (
        <div className="d-flex justify-content-center gap-2">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={otp[index]}
              maxLength={1}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className=" input"
              style={{
                width: "50px",
                height: "50px",
                fontSize: "15px",
                marginBottom: "25px",
              }}
            />
          ))}
        </div>
      )}

      <button type="submit" className="tg-btn w-100" disabled={loading}>
        {loading
          ? "Processing..."
          : step === "phone"
            ? "Send OTP"
            : "Verify OTP"}
      </button>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
              onClick={() => {
                setConfirmDialogOpen(false)
                window.location.reload();

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
    </form>
  );
};

export default LoginForm;
