import React from "react";
import "./Vault.css";
function Vault ({vault, onDelete}){

    const formattedDate = new Date(vault.created_at).toLocaleDateString("en-US")
    //gets rid of additional info like timezone from the date string

    return <div className="vault-container">
        <p className="vault-title">{vault.title}</p>
        <p className="vault-description">{vault.description}</p>
        <p className="vault-amount">{vault.target_amount}</p>
        <p className="vault-amount">{vault.current_amount}</p>
        <p className="vault-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(vault.id)}>
            Delete
            </button>

    </div>

}

export default Vault;