import React, { useState, useEffect } from "react";
import Vault from "../../components/Vault";
import api from "../../api";
import "./MyVaults.css";  // Add this import


const MyVaults = () => {
  const [vault, setVault] = useState([]);
  useEffect(() => {
    getVaults();
  }, []);

  const getVaults = () => {
    api
      .get("/api/vault/")
      .then((res) => setVault(res.data))
      .catch((err) => alert(err));
  };

  const deleteVault = (id) => {
    api
      .delete(`/api/vault/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Vault deleted!");
        getVaults();
      })
      .catch((error) => alert(error));
  };
  return (
    <div className="vault-section">
  {vault.map((vaultItem) => (
    <Vault vault={vaultItem} onDelete={deleteVault} key={vaultItem.id} />
  ))}
</div>


  );
};

export default MyVaults;
