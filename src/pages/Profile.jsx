import { useEffect, useRef, useState } from "react";
import { Camera, Mail, UserRound, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || ""
  );

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(user?.name || "");
    setProfileImage(user?.profileImage || "");
  }, [user?.name, user?.profileImage]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Limit image size to 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/auth/profile", {
        name: trimmedName,
        profileImage,
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (err) {
      console.error("Profile update failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter =
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <AppLayout>
      <div className="profile-grid">
        <section className="panel profile-card">
          <div className="profile-cover" />

          <div className="profile-avatar-wrap">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-avatar profile-image"
              />
            ) : (
              <div className="profile-avatar">
                {avatarLetter}
              </div>
            )}

            <button
              className="camera-btn"
              type="button"
              aria-label="Change profile photo"
              onClick={handleImageClick}
            >
              <Camera size={16} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <h2>{name || "Your Name"}</h2>

          <p>{user?.email}</p>

          <span className="profile-badge">
            TaskFlow Member
          </span>
        </section>

        <section className="panel profile-form-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">ACCOUNT</span>
              <h2>Personal information</h2>
            </div>
          </div>

          <form
            className="settings-form"
            onSubmit={save}
          >
            <label>
              <span>
                <UserRound size={15} />
                Full name
              </span>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </label>

            <label>
              <span>
                <Mail size={15} />
                Email
              </span>

              <input
                value={user?.email || ""}
                disabled
              />
            </label>

            {error && (
              <p className="profile-error">
                {error}
              </p>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={saving}
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Saved
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                "Save changes"
              )}
            </button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}