import React, { useState, useEffect } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Card,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import api from '../../api';

const CATEGORY_CHOICES = [
    { value: 'FOOD', label: 'Food & Dining' },
    { value: 'TRANSPORT', label: 'Transportation' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'HEALTH', label: 'Healthcare' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'OTHER', label: 'Other' },
];

const NECESSITY_LEVELS = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Essential' },
];

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO Code', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 170, align: 'right' },
    { id: 'amount', label: 'Amount', minWidth: 170, align: 'right' },
    { id: 'created_at', label: 'Date', minWidth: 170, align: 'right' },
    { id: 'category', label: 'Category', minWidth: 170, align: 'right' },
    { id: 'necessity_level', label: 'Necessity Level', minWidth: 170, align: 'right' },
];

const tableStyles = {
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
        borderColor: 'rgba(255, 255, 255, 0.8)',
        color: 'white',
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '& .MuiSelect-root': {
        color: 'white',
        '&:before': {
            borderColor: 'white',
        },
    },
    '& .MuiSelect-icon': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: 'white',
    },
    '& .MuiMenuItem-root': {
        color: 'black',
    },
};

const ExpenseTable = ({ onCreateExpense }) => {
    const [openContributionPopup, setOpenContributionPopup] = useState(false);
    const [contributionAmount, setContributionAmount] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState({
        name: '',
        amount: '',
        category: 'OTHER',
        necessity_level: 1,
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/api/expenses/check/');
                setExpenses(response.data);
            }
            catch (error) {
                console.error("Failed to fetch expenses: ", error);
            }
        };

        fetchExpenses();
    }, []);

    const handleOpenContributionPopup = () => {
        setOpenContributionPopup(true);
    };
    
    const handleCloseContributionPopup = () => {
        setOpenContributionPopup(false);
    };
    
    const handleContributionSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await api.post("/api/expenses/check/", {
                ...formState,
                amount: parseFloat(contributionAmount)
            });
            
            setExpenses([res.data, ...expenses]);
            alert(`Your expense of $${contributionAmount} is recorded.`);
            setOpenContributionPopup(false);
            setContributionAmount("");
            setFormState({
                name: '',
                amount: '',
                category: 'OTHER',
                necessity_level: 1,
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
        } catch (error) {
            console.error("Failed to record expense: ", error);
            alert("Failed to record expense.");
        }
    };
    
    const handleCategoryChange = async (expenseId, newValue) => {
        try {
            await api.patch(`/api/expenses/${expenseId}/`, { category: newValue });
            setExpenses(expenses.map(expense => 
                expense.id === expenseId 
                    ? { ...expense, category: newValue }
                    : expense
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update category:", error);
        }
    };

    const handleNecessityChange = async (expenseId, newValue) => {
        try {
            await api.patch(`/api/expenses/${expenseId}/`, { necessity_level: newValue });
            setExpenses(expenses.map(expense => 
                expense.id === expenseId 
                    ? { ...expense, necessity_level: newValue }
                    : expense
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update necessity level:", error);
        }
    };

    const getCategoryLabel = (value) => {
        return CATEGORY_CHOICES.find(cat => cat.value === value)?.label || value;
    };

    const getNecessityLabel = (value) => {
        return NECESSITY_LEVELS.find(level => level.value === value)?.label || value;
    };

    return (
        <Card 
            sx={{ 
                width: '100%',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
        >
            <Dialog
                open={openContributionPopup}
                onClose={handleCloseContributionPopup}
            >
                <DialogTitle className="hero-title--gradient">Add New Expense</DialogTitle>
                <DialogContent>
                    <form 
                        onSubmit={handleContributionSubmit} 
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "10px"
                        }}
                    >
                        <TextField
                            label="Name"
                            fullWidth
                            value={formState.name}
                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                            required
                        />
                        <TextField
                            label="Amount in Rupees"
                            fullWidth
                            type="number"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            required
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            value={formState.description}
                            onChange={(e) => setFormState({...formState, description: e.target.value})}
                        />
                        <FormControl fullWidth>
                            <Select
                                value={formState.category}
                                onChange={(e) => setFormState({...formState, category: e.target.value})}
                            >
                                {CATEGORY_CHOICES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" type="submit">
                            Save
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <TableContainer>
                <Table sx={tableStyles}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow 
                            sx={{ 
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                zIndex: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                }
                            }}
                        >
                            <TableCell colSpan={columns.length} sx={{ height: '64px', padding: 0 }}>
                                <Button
                                    fullWidth
                                    onClick={handleOpenContributionPopup}
                                    sx={{
                                        height: '100%',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        }
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <IoAddCircleOutline size={20} />
                                        <span>Add New Expense</span>
                                    </div>
                                </Button>
                            </TableCell>
                        </TableRow>
                        {expenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => (
                                <TableRow key={expense.id}>
                                    {columns.map((column) => {
                                        if (column.id === 'category') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {editingId === expense.id ? (
                                                        <FormControl fullWidth variant="standard">
                                                            <Select
                                                                value={expense.category}
                                                                onChange={(e) => handleCategoryChange(expense.id, e.target.value)}
                                                                sx={{ color: 'white' }}
                                                            >
                                                                {CATEGORY_CHOICES.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <div 
                                                            style={{ cursor: 'pointer' }} 
                                                            onClick={() => setEditingId(expense.id)}
                                                        >
                                                            {getCategoryLabel(expense.category)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                            );
                                        }
                                        if (column.id === 'necessity_level') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {editingId === expense.id ? (
                                                        <FormControl fullWidth variant="standard">
                                                            <Select
                                                                value={expense.necessity_level}
                                                                onChange={(e) => handleNecessityChange(expense.id, e.target.value)}
                                                                sx={{ color: 'white' }}
                                                            >
                                                                {NECESSITY_LEVELS.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <div 
                                                            style={{ cursor: 'pointer' }} 
                                                            onClick={() => setEditingId(expense.id)}
                                                        >
                                                            {getNecessityLabel(expense.necessity_level)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                            );
                                        }
                                        const value = expense[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value || "N/A"}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                sx={{
                    color: 'white',
                    '& .MuiTablePagination-select': {
                        color: 'white',
                    },
                    '& .MuiTablePagination-selectIcon': {
                        color: 'white',
                    },
                    '& .MuiTablePagination-displayedRows': {
                        color: 'white',
                    },
                    '& .MuiIconButton-root': {
                        color: 'white',
                    },
                }}
            />
        </Card>
    );
};

export default ExpenseTable;