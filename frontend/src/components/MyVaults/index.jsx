import React, { useState, useEffect } from "react";
import Vault from "../Vault";
import api from "../../api";
import "./MyVaults.css";

const MyVaults = () => {
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    getVaults();
  }, []);

  const getVaults = () => {
    api
      .get("/api/vault/check/")
      .then((res) => setVaults(res.data))
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

  const handleVaultUpdate = () => {
    getVaults(); 
  };

  return (
    <div className="vault-section">
      {vaults.map((vaultItem) => (
        <Vault
          key={vaultItem.id}
          vault={vaultItem}
          onDelete={deleteVault}
          onUpdate={handleVaultUpdate}
        />
      ))}
    </div>
  );
};

export default MyVaults;