import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ClaimCard = ({ claim, onClick }) => {
  return (
    <Card onClick={() => onClick(claim)}>
      <img src={claim.images.split(',')[0]} alt="Claim" />
      <CardContent>
        <Typography variant="h6">{claim.institution.institutionName}</Typography>
        <Typography variant="body2">{claim.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default ClaimCard;
