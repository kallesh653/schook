import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Button, Grid,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const SmsManagementSimple = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
    };

    const testFunction = () => {
        showMessage('SMS Management is working!', 'success');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    📱 SMS Management System
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Send SMS notifications to students and parents
                </Typography>
            </Box>

            {/* Test Card */}
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, textAlign: 'center', borderRadius: '16px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                SMS System Ready
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                The SMS management system is successfully loaded and ready to use.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={testFunction}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    borderRadius: '25px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Test SMS System
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Snackbar for messages */}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setMessage('')}
                    severity={messageType}
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>

            {/* Loading indicator */}
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <Card sx={{ p: 3, borderRadius: '16px', textAlign: 'center' }}>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="h6">Loading...</Typography>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

export default SmsManagementSimple;