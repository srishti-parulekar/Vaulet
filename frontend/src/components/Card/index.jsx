import React, { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const PaymentForm = () => {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <div className="payment-form-container" style={containerStyle}>
        <div className='left-card'>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
</div>
<div className='right-card'>
      <form style={formStyle}>
        <input
          type="text"
          name="name"
          placeholder="Cardholder Name"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={inputStyle}
        />
        <input
          type="number"
          name="number"
          placeholder="Card Number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={inputStyle}
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={inputStyle}
        />
        <input
          type="number"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={inputStyle}
        />
        <button className='cta-button' type="submit">Submit Card</button>
      </form>
      </div>
    </div>
  );
};

// Inline styles for better structure
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
//   alignItems: 'center',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const formStyle = {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '10px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  width: '100%',
};



export default PaymentForm;
