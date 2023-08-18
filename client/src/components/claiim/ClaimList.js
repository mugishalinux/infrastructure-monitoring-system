import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ClaimCard from './ClaimCard';
import ClaimModal from './ClaimModal';
import claimData from './claimData'; // Your data goes here

const ClaimList  = ({ claim }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);

  const openModal = (claim) => {
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };

  return (
    <div>
      <Grid container spacing={3}>
        {claimData.map((claim) => (
          <Grid item xs={12} sm={6} md={4} key={claim.id}>
            <ClaimCard claim={claim} onClick={openModal} />
          </Grid>
        ))}
      </Grid>
      <ClaimModal claim={selectedClaim} onClose={closeModal} />
    </div>
  );
};

export default ClaimList;
