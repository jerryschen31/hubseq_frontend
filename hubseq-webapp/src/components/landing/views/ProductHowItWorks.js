import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#BDBDBD',
  px: 5,
  paddingTop: 5,
  paddingBottom: 5,
  borderRadius: 3,
};

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
};

const image = {
  height: 55,
  my: 4,
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: '#E0E0E0', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 5,
          mb: 10,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h3" sx={{ mb: 5 }}>
          Simple, Transparent Pricing
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Box sx={item}>
                <Typography variant="h3" align="center" sx={{ mb: 1 }}>
                  Basic Plan
                </Typography>
                <Typography variant="h5" align="center">
                  <p>$1200/mo.</p>
                </Typography>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                <p>per lab</p>
                </Typography>
                <Typography variant="h7" align="center" sx={{ mb: 1 }}>
                  <p>5 TB data storage</p>
                </Typography>
                <Typography variant="h7" align="center">
                  <p>Up to 10 active users</p>
                  <p>Unlimited guest users</p>
                  <p>Bioinformatics workflows for all standard assays</p>
                  <p>Integration with one sequencer</p>
                  <p>Full secure backup of all data and results</p>
                  <p>Dedicated support team</p>
                  <p>Extra storage for $100 / TB</p>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={item}>
                <Typography variant="h3" align="center" sx={{ mb: 1 }}>
                  Enterprise Plan
                </Typography>
                <Typography variant="h5" align="center">
                  <p>$3500/mo.</p>
                </Typography>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                <p>per lab</p>
                </Typography>
                <Typography variant="h7" align="center" sx={{ mb: 1 }}>
                  <p>20 TB data storage</p>
                </Typography>
                <Typography variant="h7" align="center">
                  <p>Up to 50 active users</p>
                  <p>Unlimited guest users</p>
                  <p>Bioinformatics workflows for all standard assays</p>
                  <p>Custom workflow for one assay</p>
                  <p>Integration with up to five sequencers</p>
                  <p>Integrated server and data notebooks</p>
                  <p>Full secure backup of all data and results</p>
                  <p>Dedicated support team</p>
                  <p>Extra storage for $100 / TB</p>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          href="http://www.hubseq.com"
          sx={{ mt: 5, backgroundColor: "#36454F", borderRadius: 8, border: 1, borderColor: "#E0E0E0" }}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
