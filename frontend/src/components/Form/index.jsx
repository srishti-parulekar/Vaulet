import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "./Form.css";
import LoadingIndicator from "../LoadingIndicator";
function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        // Check if card details are already set
        const cardRes = await api.get("/api/personal-vault/detail/");
        const { number, name, expiry, cvc } = cardRes.data;

        // Navigate based on the presence of card details
        if (!number || !name || !expiry || !cvc) {
          navigate("/carddetails");
        } else {
          navigate("/home"); // Redirect directly if details are already set
        }
      } else {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail || "Registration failed"}`);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topBlur"></div>
      <div className="bottomBlur"></div>
      <div className="form-div">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="hero-title--gradient">
            <h1>{name}</h1>
          </div>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {loading && <LoadingIndicator />}
          <button className="cta-button" type="submit">
            {name}
          </button>
        </form>
      </div>
    </>
  );
}

export default Form;
