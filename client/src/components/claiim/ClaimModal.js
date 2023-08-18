import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';

const ClaimModal = ({ claim, onClose }) => {
  return (
    <Modal open={Boolean(claim)} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <img src={claim.images.split(',')[0]} alt="Claim" style={{ width: '100%', height: 'auto' }} />
        <Typography variant="h6">{claim.institution.institutionName}</Typography>
        <Typography variant="body1">{claim.description}</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ClaimModal;
