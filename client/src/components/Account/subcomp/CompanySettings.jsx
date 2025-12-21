const CompanySettings = () => {
  return (
    <form className="settings-form">
      <h3>Company Settings</h3>

      <label>Company Name</label>
      <input placeholder="Enter company name" />

      <label>City</label>
      <input placeholder="Enter city" />

      <label>Country</label>
      <input placeholder="Enter country" />

      <button type="button">Save</button>
    </form>
  );
};

export default CompanySettings;
