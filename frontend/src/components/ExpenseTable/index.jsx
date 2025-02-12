import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { IoAddCircleOutline } from "react-icons/io5";
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

const ExpenseTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expenses, setExpenses] = useState([]);

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCategoryChange = async (expenseId, newValue) => {
        try {
            await api.patch(`/api/expenses/${expenseId}/`, { category: newValue });
            setExpenses(expenses.map(expense => 
                expense.id === expenseId 
                    ? { ...expense, category: newValue }
                    : expense
            ));
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
        } catch (error) {
            console.error("Failed to update necessity level:", error);
        }
    };

    const tableStyles = {
        '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            color: 'white',
        },
        '& .MuiTableCell-root': {
            color: 'white',
            borderColor: 'white',
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
        '& .MuiSelect-root': {
            color: 'white',
            '&:before': {
                borderColor: 'white',
            },
        },
        '& .MuiSelect-icon': {
            color: 'white',
        },
    };

    return (
        <Paper 
            sx={{ 
                width: '95%', 
                overflow: 'hidden', 
                height: '100%',
                backgroundColor: 'transparent',
                ...tableStyles
            }}
        >
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ 
                                        minWidth: column.minWidth,
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        borderColor: 'white'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => {
                                return (
                                    <TableRow 
                                        hover 
                                        role="checkbox" 
                                        tabIndex={-1} 
                                        key={expense.id}
                                    >
                                        {columns.map((column) => {
                                            if (column.id === 'category') {
                                                return (
                                                    <TableCell 
                                                        key={column.id} 
                                                        align={column.align}
                                                        sx={{
                                                            color: 'white',
                                                            borderColor: 'white'
                                                        }}
                                                    >
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
                                                    </TableCell>
                                                );
                                            }
                                            if (column.id === 'necessity_level') {
                                                return (
                                                    <TableCell 
                                                        key={column.id} 
                                                        align={column.align}
                                                        sx={{
                                                            color: 'white',
                                                            borderColor: 'white'
                                                        }}
                                                    >
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
                                                    </TableCell>
                                                );
                                            }
                                            const value = expense[column.id];
                                            return (
                                                <TableCell 
                                                    key={column.id} 
                                                    align={column.align}
                                                    sx={{
                                                        color: 'white',
                                                        borderColor: 'white'
                                                    }}
                                                >
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value || "N/A"}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={expenses.length}
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
    );
}

export default ExpenseTable;