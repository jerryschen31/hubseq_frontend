import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import Image from 'next/image';
import { signIn } from "utils/mock-auth"

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

function AppAppBar() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: '#0C090A' }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href={process.env.NEXT_PUBLIC_NEXTAUTH_URL}
            sx={{ fontSize: 24 }}
          >
            <div style={{paddingTop: 10, paddingRight: 8}} >
              <Image src="/static/hubseq-logo-darker.svg" alt="HubSeq" width="180" height="100" />
            </div>
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{mr: 2 }} color='inherit' onClick={() => signIn("cognito", { callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL })} variant="outlined">
            Login
          </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;

/*
        <Button sx={{mr: 2, backgroundColor: "#073763" }} color='inherit' variant="outlined">
          <a href="http://www.hubseq.com" style={{ color: "inherit", textDecoration: 'none' }}>Signup</a>
        </Button>
*/
