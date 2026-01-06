
import ProfilePic from "./ProfilePic"; // ✅ ADD

const ProfileSidebar = ({ user, setUser }) => {
  const fullName = [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="profile-sidebar">

      {/* ✅ REPLACED IMAGE BLOCK */}
      <ProfilePic user={user} setUser={setUser} />

      <h3>{user?.username}</h3>
      <p>{fullName}</p>

      <div className="profile-stats">
        <div><strong>32</strong><span>Applied</span></div>
        <div><strong>26</strong><span>Won</span></div>
        <div><strong>6</strong><span>Active</span></div>
      </div>
    </div>
  );
};

export default ProfileSidebar;

