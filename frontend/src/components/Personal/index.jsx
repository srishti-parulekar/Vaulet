import React from 'react'
import Card from "../../components/Card"

const Personal = () => {
  return (
    <div className="account-balance-container" >
          <section className="account-balance" style={{minHeight: '500px'}}>
            <h3 className="hero-title--gradient" style={{fontSize: "2rem"}}>My Account & Balance</h3>
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
            <h3 className="hero-title--gradient" style={{fontSize: "2rem"}}>Transactions</h3>
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
  )
}

export default Personal