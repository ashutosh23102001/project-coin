const Tabs = ({ activeTab, setActiveTab }) => {
  return (
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
        Company Settings
      </button>
    </div>
  );
};

export default Tabs;
