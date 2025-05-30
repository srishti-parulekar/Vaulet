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
    <>
    {/* <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        padding: '1.5rem',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    ></div> */}
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
    </>
  );
};

export default MyVaults;