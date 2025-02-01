import React, { useState, useEffect } from "react";
import api from "../../api";
import Vault from "../../components/Vault";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Home.css";
import Card from "../../components/Card"
function Home() {
  const [vault, setVault] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target_amount, setTargetAmount] = useState(0);
  const [current_amount, setCurrentAmount] = useState(0);
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(!open);

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

  const createVault = (e) => {
    e.preventDefault();
    api
      .post("/api/vault/", {
        description,
        title,
        target_amount,
        current_amount,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Vault created!");
          setTitle("");
          setDescription("");
          setTargetAmount(0);
          setCurrentAmount(0);
          getVaults();
        } else {
          alert("Failed to create vault!");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error occurred while creating the vault.");
      });
  };

  return (
    <>
      <Header handleDrawerOpen={handleDrawerOpen} />
      <div className="main-layout">
        <Sidebar open={open} />
        <div className="content-container">
        <div className="topBlur"></div>
        <div className="bottomBlur"></div>
        <main className="main-content">
          


        <div className="account-balance-container" >
          <section className="account-balance" style={{minHeight: '500px'}}>
            <h3>My Account & Balance</h3>
            <div className="balance-card">
              <h4>Total Balance</h4>
              <p>$5,254.50</p>
              <p>123-456-7890 | April 2028</p>
            </div>
            {/* <div className="card-info">
            
            </div> */}
            {/* <button>History</button>
            <button>Top-up</button> */}
            <section className="transaction-history">
            <h3>Transaction</h3>
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fauget Cafe</td>
                  <td>Today</td>
                  <td>$500</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Claudia Store</td>
                  <td>Today</td>
                  <td>$1000</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Chidi Barber</td>
                  <td>Today</td>
                  <td>$500</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Cahaya Dewi</td>
                  <td>Today</td>
                  <td>$1000</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </section>
          </section>
          <section className="account-balance">
        <Card />
        </section>
          
        </div>
        
      </main>
          <div className="form-div">
            <form className="form-container" onSubmit={createVault}>
              <h1>Create Vault</h1>
              <input
                className="form-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="form-input"
                placeholder="Tell us about your goal here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                className="form-input"
                type="number"
                placeholder="Target Amount"
                value={target_amount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
              <input
                className="form-input"
                type="number"
                placeholder="Current Amount"
                value={current_amount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                required
              />
              <button className="cta-button" type="submit">
                Submit
              </button>
            </form>
          </div>
          <div className="vault-section">
            <h2>Vaults</h2>
            {vault.map((vaultItem) => (
              <Vault vault={vaultItem} onDelete={deleteVault} key={vaultItem.id} />
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Home;
