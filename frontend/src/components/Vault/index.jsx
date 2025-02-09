import React from "react";
import "./Vault.css";

function Vault({ vault, onDelete }) {
  const formattedDate = new Date(vault.created_at).toLocaleDateString("en-US");

  return (
    <div className="balance-card">
      <p className="vault-title" >{vault.title}</p>
      <p className="vault-description">{vault.description}</p>
      <div className="vault-amounts">
        <p className="vault-target-amount">
          <strong>Target Amount: </strong>${vault.target_amount}
        </p>
        <p className="vault-current-amount">
          <strong>Current Amount: </strong>${vault.current_amount}
        </p>
      </div>
      <p className="vault-date">Created on: {formattedDate}</p>
      <button className="cta-button" onClick={() => onDelete(vault.id)}>
        Delete Vault
      </button>
    </div>
  );
}

export default Vault;
