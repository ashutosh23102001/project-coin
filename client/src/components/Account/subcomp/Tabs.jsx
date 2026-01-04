const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="tabs">
    <button
      className={activeTab === "account" ? "active" : ""}
      onClick={() => setActiveTab("account")}
    >
      Account Settings
    </button>

    <button
      className={activeTab === "company" ? "active" : ""}
      onClick={() => setActiveTab("company")}
    >
      Personal Settings
    </button>


    <button
      className={activeTab === "Contact" ? "active" : ""}
      onClick={() => setActiveTab("Contact")}
    >
      Contact Details
    </button>

  </div>
);

export default Tabs;
