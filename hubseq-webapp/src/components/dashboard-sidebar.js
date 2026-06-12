import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Folder as FolderIcon } from '../icons/folder';
import { Terminal as TerminalIcon } from '../icons/terminal';
import { Modules as ModulesIcon } from '../icons/modules';
import { Runs as RunsIcon } from '../icons/runs';
import { Notebook as NotebookIcon } from '../icons/notebook';
import { Lock as LockIcon } from '../icons/lock';
import { Cog as CogIcon } from '../icons/cog';
import { Selector as SelectorIcon } from '../icons/selector';
import { User as UserIcon } from '../icons/user';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Menu as MenuIcon } from '../icons/menu';
import { useSession } from "utils/mock-auth";
import { useState } from 'react';
import { awsPipelineAPI_GET } from '../utils/aws-session';
// import { Logo } from './logo';
import Image from 'next/image';
import { NavItem } from './nav-item';

const items = [
  {
    href: '/files',
    icon: (<FolderIcon fontSize="small" />),
    title: 'File Explorer'
  },
  {
    href: '/runs',
    icon: (<RunsIcon fontSize="Large" />),
    title: 'Runs'
  },
  // {
  //   href: '/modules',
  //   icon: (<ModulesIcon fontSize="small" />),
  //   title: 'Modules'
  // },
  // {
  //   href: '/terminal',
  //   icon: (<TerminalIcon fontSize="small" />),
  //   title: 'Terminal'
  // },
  // {
  //   href: '/notebook',
  //   icon: (<NotebookIcon fontSize="small" />),
  //   title: 'Notebook'
  // },
  // {
  //   href: '/settings',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Settings'
  // },
  // {
  //   href: '/account',
  //   icon: (<UserIcon fontSize="small" />),
  //   title: 'Account'
  // },
  // {
  //   href: '/login',
  //   icon: (<LockIcon fontSize="small" />),
  //   title: 'Login'
  // },
  // {
  //   href: '/404',
  //   icon: (<XCircleIcon fontSize="small" />),
  //   title: 'Error'
  // }
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });
  const { data: session, status } = useSession();
  const [teamId, setTeamId] = useState('Team');

  useEffect(
    () => {
      const getTeamId = async (session) => {
        const _teamid = await awsPipelineAPI_GET('/test_cors/getteamid', session.idToken);
        setTeamId(_teamid.data);
      }
      if (session){
        getTeamId(session);
      }
      if (!router.isReady) {
        return;
      }
      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath, session]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
              <div>
                <Image src="/static/hubseq-logo-darker.svg" alt="HubSeq" width="180" height="100" />
              </div>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  <b>{teamId}</b>
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Tier
                  {' '}
                  : Premium
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Typography
            color="neutral.100"
            variant="subtitle2"
          >
            Need more features?
          </Typography>
          <NextLink
            href="https://material-kit-pro-react.devias.io/"
            passHref
          >
            <Button
              color="secondary"
              component="a"
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              Submit Request
            </Button>
          </NextLink>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 230
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 230
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
