import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  // FIX: Add state to control when validation errors are shown.
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (!formData.firstName) newErrors.firstName = "First name is required.";
      if (!formData.lastName) newErrors.lastName = "Last name is required.";
      if (formData.username.length < 3)
        newErrors.username = "Username must be at least 3 characters.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email address.";
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must be 6+ characters and include uppercase, lowercase, number, and special character.";
      }
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";

      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0);
    };
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FIX: Trigger showing errors only on submit.
    setShowErrors(true);

    if (!isFormValid) {
      toast.error("Please correct the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      toast.success("Registration successful! Welcome.");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Registration failed.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="firstName">
            First Name
          </label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {/* FIX: Conditionally render the error message. */}
          {showErrors && errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="lastName">
            Last Name
          </label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {showErrors && errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1" htmlFor="username">
          Username
        </label>
        <Input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {showErrors && errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1" htmlFor="email">
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {showErrors && errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1" htmlFor="password">
          Password
        </label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {showErrors && errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {showErrors && errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="mt-6">
        <Button
          type="submit"
          loading={loading}
          disabled={loading} // The button is always enabled until clicked
          className="w-full"
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
