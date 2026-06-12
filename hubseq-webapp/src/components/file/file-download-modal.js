import { useState } from 'react';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField, Link } from '@mui/material';
import { Download as DownloadIcon } from '../../icons/download';
import { fileDownloadCall } from './file-download-api-call';
import * as path from 'path';
// import { showSaveFilePicker } from 'native-file-system-adapter';
// import * as streamSaver from 'streamsaver';
import { awsPipelineAPI_GET } from '../../utils/aws-session';

export const FileDownloadModal = ({currentPath, selectedFiles, session, ...rest}) => {
    const [open, setOpen] = useState(false);
    const [signedUrl, setSignedUrl] = useState('');
    const [teamId, setTeamId] = useState('');

    React.useEffect(() => {
      const getTeamId = async (session) => {
        const _teamid = await awsPipelineAPI_GET('/test_cors/getteamid', session.idToken);
        setTeamId(_teamid.data);
      }
      if (session){
        getTeamId(session);
      }
    }, [session]);

    const handleClickOpen = () => {
      handleDownload();
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleDownload = async () => {
      const filePaths = selectedFiles.map((f)=>(path.join(currentPath,f)));
      // currently only support download of one file (first one checked)
      const response = await fileDownloadCall( filePaths[0], teamId, session.idToken, setSignedUrl );
    }

    return (
        <>
        <Button startIcon={(<DownloadIcon fontSize="small" />)}
        sx={{ mr: 1 }}
        onClick={handleClickOpen}> Download
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Download File from HubSeq</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Link href={signedUrl} target="_blank" download rel="noopener noreferrer">Click to download {selectedFiles[0]}</Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      </>
    );
};
