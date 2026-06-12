import styled from '@emotion/styled';
import { AppBar, Button, Box, Toolbar } from '@mui/material';
import Image from 'next/image';
import { signIn } from "utils/mock-auth"

const LandingNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const LandingNavbar = (props) => {
  const { ...other } = props;

  return (
    <>
      <LandingNavbarRoot
        sx={{
          left: {
            lg: 0
          },
          width: {
            lg: '100%'
          },
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
            backgroundColor: 'neutral.900'
          }}
        >
          <Box>
            <div>
              <Image src="/static/hubseq-logo-darker.svg" alt="HubSeq" width="150" height="80" />
            </div>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ color: 'white' }}>
          <Button fullWidth color='inherit' onClick={() => signIn("cognito", { callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL })} variant="outlined">
            Login
          </Button>
          </Box>
        </Toolbar>
      </LandingNavbarRoot>
    </>
  );
};

LandingNavbar.propTypes = {
};
