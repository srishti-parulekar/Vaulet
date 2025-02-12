import React, { useState, useEffect } from "react";
import api from "../../api";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
    { id: "transaction_type", label: "Transaction Type", minWidth: 170 },
    { id: "amount", label: "Amount", minWidth: 100 },
    { id: "description", label: "Description", minWidth: 170 },
    { id: "created_at", label: "Date", minWidth: 170, format: (value) => new Date(value).toLocaleString() },
];

const Transactions = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get("/api/transactions/check/");
                setTransactions(response.data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const tableStyles = {
        '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            color: 'white',
            boxShadow: 'none',
        },
        '& .MuiTableCell-root': {
            color: 'white',
            borderColor: 'white',
            backgroundColor: 'transparent',
        },
        '& .MuiTablePagination-root': {
            color: 'white',
        },
        '& .MuiTablePagination-select': {
            color: 'white',
        },
        '& .MuiTablePagination-selectIcon': {
            color: 'white',
        },
        '& .MuiTablePagination-actions': {
            color: 'white',
            '& .MuiIconButton-root': {
                color: 'white',
            },
        },
        '& .MuiTableRow-hover': {
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
            },
        },
    };

    const containerStyles = {
        display: "flex", 
        flexDirection: "column",
        '& .hero-title--gradient': {
            fontSize: "2rem",
            color: 'white',
            marginBottom: '1rem',
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", padding: "1rem"}}>
            <h3 className="hero-title--gradient" style={{fontSize: "2rem"}}>
                Your Latest Contributions
            </h3>
            <div className="account-balance" style={{ border: "0.05rem solid #ffffff", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <Paper 
                    sx={{ 
                        width: "100%", 
                        overflow: "hidden",
                        backgroundColor: 'transparent',
                        ...tableStyles
                    }}
                >
                    <TableContainer sx={{ maxHeight: 550 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell 
                                            key={column.id} 
                                            sx={{ 
                                                minWidth: column.minWidth,
                                                backgroundColor: 'transparent',
                                                color: 'white',
                                                borderColor: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((transaction) => (
                                        <TableRow 
                                            hover 
                                            key={transaction.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                }
                                            }}
                                        >
                                            {columns.map((column) => (
                                                <TableCell 
                                                    key={column.id} 
                                                    sx={{ 
                                                        minWidth: column.minWidth,
                                                        backgroundColor: 'transparent',
                                                        color: 'white',
                                                        borderColor: 'white'
                                                    }}
                                                >
                                                    {column.format && typeof transaction[column.id] === "string"
                                                        ? column.format(transaction[column.id])
                                                        : transaction[column.id] || "N/A"}
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
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            color: 'white',
                            borderColor: 'white'
                        }}
                    />
                </Paper>
            </div>
        </div>
    );
}

export default Transactions;