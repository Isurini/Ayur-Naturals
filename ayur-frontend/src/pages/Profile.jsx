import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    contactNumber: "",
    profilePicture: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    
    //  Fetch profile from backend (auto-fill after login)
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // auto-display signup details
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setUser({ ...user, profilePicture: file });
    }
  };

  // Validation
  const validate = () => {
    let newErrors = {};
    if (!user.firstName.trim()) newErrors.firstName = "First name is required";
    if (!user.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!user.birthday.trim()) newErrors.birthday = "Birthday is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      newErrors.email = "Invalid email address";
    if (!/^[0-9]{10,15}$/.test(user.contactNumber))
      newErrors.contactNumber = "Invalid contact number";
    return newErrors;
  };

  // Save profile
  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("birthday", user.birthday);
      formData.append("contactNumber", user.contactNumber);
      if (user.profilePicture instanceof File) {
        formData.append("profilePicture", user.profilePicture);
      }

      await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/users/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear();
        window.location.href = "/signup"; // Redirect after delete
      } catch (err) {
        console.error("Error deleting account:", err);
      }
    }
  };

  return (
    <div className="profile-container" style={{ display: "flex", padding: "20px" }}>
      {/* Left Section - Profile Picture */}
      <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid #ccc", padding: "20px" }}>
        <img
          src={previewImage || user.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <h3>User</h3>
        <button style={{ display: "block", margin: "10px auto", padding: "10px", background: "black", color: "white" }}>
          Account
        </button>
        <button style={{ display: "block", margin: "10px auto", padding: "10px" }}>
          Change Password
        </button>
      </div>

      {/* Right Section - Account Details */}
      <div style={{ flex: 2, padding: "20px" }}>
        <h2>Account Details</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>First Name</label>
            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" />
            {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name</label>
            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" />
            {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Birthday</label>
          <input type="date" name="birthday" value={user.birthday} onChange={handleChange} />
          {errors.birthday && <p style={{ color: "red" }}>{errors.birthday}</p>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Contact Number</label>
          <input type="text" name="contactNumber" value={user.contactNumber} onChange={handleChange} placeholder="Contact Number" />
          {errors.contactNumber && <p style={{ color: "red" }}>{errors.contactNumber}</p>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email Address</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="example@gmail.com" disabled />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={handleSave} style={{ padding: "10px 20px", background: "black", color: "white", borderRadius: "20px" }}>
            Save
          </button>
          <button style={{ padding: "10px 20px", background: "gray", color: "white", borderRadius: "20px" }}>
            Cancel
          </button>
        </div>

        <button onClick={handleDelete} style={{ marginTop: "20px", padding: "10px 20px", background: "black", color: "white", borderRadius: "20px" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;


