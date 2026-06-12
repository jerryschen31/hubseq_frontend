import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function ProductValues() {
  return (
    <div style={{ backgroundColor: '#E0E0E0'}}>
    <Typography sx={{ mt: 8, mb: 0, backgroundColor: '#E0E0E0'}} variant="h4" align="center" component="h4">
      <p>Store your sequencing data in HubSeq,</p>we will take care of the rest
    </Typography>
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: '#E0E0E0' }}
    >
      <Container sx={{ mt: 8, mb: 20, display: 'flex', position: 'relative' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/images/qualitycontrol.jpeg"
                alt="suitcase"
                sx={{ height: 150, borderRadius: 3, border: 1, borderColor: 'black' }}
              />
              <Typography variant="h5" color="#0C090A" align="center" sx={{ my: 5 }}>
                Automated QC
              </Typography>
              <Typography variant="h6" color="#0C090A" align="center">
                {
                  'HubSeq automates the quality control processing of all sequencing samples'
                }

                {
                  ', providing a comprehensive summary report of QC metrics for all samples.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/images/bioinformatics.svg"
                alt="graph"
                sx={{ height: 150, border: 1, borderRadius: 3 }}
              />
              <Typography variant="h5" color="#0C090A" align="center" sx={{ my: 5 }}>
                Bioinformatics Pipelines
              </Typography>
              <Typography variant="h6" color="#0C090A" align="center">
                {
                  'HubSeq provides end-to-end processing pipelines for all of the common sequencing assays'
                }

                {
                  ', with a configurable easy-to-use interface.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/images/datareport-unsplash.jpg"
                alt="clock"
                sx={{ height: 150, borderRadius: 3 }}
              />
              <Typography variant="h5" color="#0C090A" align="center" sx={{ my: 5 }}>
                Detailed Reports
              </Typography>
              <Typography variant="h6" color="#0C090A" align="center">
                {
                  'HubSeq provides automated reports and visualizations of results for common sequencing assays'
                }

                {
                  ', with integrated data notebooks and servers to facilitate downstream data analysis.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/images/backup-unsplash.jpg"
                alt="clock"
                sx={{ height: 150, borderRadius: 3 }}
              />
              <Typography variant="h5" color="#0C090A" align="center" sx={{ my: 5 }}>
                Secure Data Backup
              </Typography>
              <Typography variant="h6" color="#0C090A" align="center">
                {
                  'Full secure backup of all data files and results'
                }

                {
                  ', so that your lab will never lose your most critical data.'
                }
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </div>
  );
}

export default ProductValues;
