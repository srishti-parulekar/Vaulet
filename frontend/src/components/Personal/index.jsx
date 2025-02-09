import React, { useState, useEffect } from "react";
import Card from "../Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import api from "../../api";
import "./Personal.css"
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO Code", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size (km²)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },

];

function createData(name, code, population, size) {
  return { name, code, population, size };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("United States", "US", 327167434, 9833520),
];

const Personal = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openContributionPopup, setOpenContributionPopup] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [state, setState] = useState({
    balance: "",
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleOpenContributionPopup = () => {
    setOpenContributionPopup(true);
  };

  const handleCloseContributionPopup = () => {
    setOpenContributionPopup(false);
  };

  const handleContributionSubmit = async (event) => {
    event.preventDefault();
    try {
      // Calculate the new balance
      const updatedBalance =
        parseFloat(state.balance) + parseFloat(contributionAmount);

      const res = await api.put("/api/personal-vault/update/", {
        balance: updatedBalance,
        number: state.number,
        name: state.name,
        expiry: state.expiry,
        cvc: state.cvc,
      });

      setState((prev) => ({
        ...prev,
        balance: res.data.balance || updatedBalance,
      }));

      alert(`Contributed $${contributionAmount} to your personal vault.`);
      setOpenContributionPopup(false);
      setContributionAmount("");
    } catch (error) {
      console.error("Failed to update personal vault balance: ", error);
      alert("Error updating card details.");
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/personal-vault/detail/");
        const { balance, number, name, expiry, cvc } = res.data;

        setState({
          balance: balance,
          number: number || "",
          name: name || "",
          expiry: expiry || "",
          cvc: cvc || "",
        });
      } catch (error) {
        console.error("Failed to fetch balance: ", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="account-balance-container">
      <section className="account-balance" style={{ minHeight: "500px" }}>
        <h3 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
          My Account & Balance
        </h3>
        <div className="balance-card">
          <h4>Total Balance</h4>
          <p>${state.balance}</p>
          <p>123-456-7890 | April 2028</p>
          <Button
            variant="contained"
            onClick={handleOpenContributionPopup}
            sx={{
              backgroundColor: "rgb(91, 112, 87)", // Default shade of green
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgb(75, 111, 68)", // Slightly darker green on hover
              },
              marginInlineRight: "2rem",
            }}
          >
            Contribute to Personal Vault
          </Button>
        </div>

        {/* Contribution Popup */}
        <Dialog
          open={openContributionPopup}
          onClose={handleCloseContributionPopup}
        >
          <DialogTitle className="hero-title--gradient">Contribute to Personal Vault</DialogTitle>
          <DialogContent>
            <form onSubmit={handleContributionSubmit} style={formStyle}>
              <TextField
                label="Enter Amount in Rupees"
                fullWidth
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
              />
              <button variant="contained" type="submit">
              Save
            </button>
            </form>
          </DialogContent>
        </Dialog>

        <section className="account-balance">
        <Card />
        </section>
      </section>

      {/* Popup for Card Update */}
      <section className="account-balance">
      <h3 className="hero-title--gradient" style={{fontSize: "2rem"}}>Transactions</h3>
      <section className="transaction-history">
          
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow hover key={row.code}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.format && typeof row[column.id] === "number"
                            ? column.format(row[column.id])
                            : row[column.id] || "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </section>
        
      </section>
    </div>
  );
};


const formStyle = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "10px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  width: "100%",
};

export default Personal;
