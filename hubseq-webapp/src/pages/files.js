import React from 'react';
import Head from 'next/head';
import { Box, Container, Tooltip } from '@mui/material';
import { getFileCall } from '../components/file/file_list_api_call';
import { FileListResults } from '../components/file/file-list-results';
import FileList from '../components/file/file_list_api_call';
import { FileListToolbar } from '../components/file/file-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { useState } from 'react';
import { addTrailingSlash } from '../utils/jsutils';
import { useSession } from "utils/mock-auth"

const Files = () => {
  const [filesSelected, setFilesSelected] = useState([]);
  const [shownFiles, setShownFiles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  // home path
  const [currentPath, setCurrentPath] = useState(""); // "www.hubseq.com/assets/"
  const { data: session, status } = useSession();

  async function getFiles(path, idToken) {
    const newfiles = await getFileCall(path, idToken);
    setShownFiles(newfiles);
    setFilteredResults(newfiles);
    setSearchInput("");
  }

  React.useEffect(() => {
    if (session) {
    getFiles(currentPath, session.idToken);
    }
  }, [session]);

  const upOnePath = (path) => {
      const pathSplit = addTrailingSlash(path).split('/');
      if (pathSplit.length > 1){
        const newPath = addTrailingSlash(pathSplit.slice(0,pathSplit.length-2).join('/'));
        setCurrentPath(newPath);
        getFiles(newPath, session.idToken);
      }
  }

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchValue !== '') {
      const filteredData = shownFiles.filter((item) => {
        return Object.values(item.Key).join('').toLowerCase().includes(searchValue.toLowerCase())
        })
      setFilteredResults(filteredData)
    } else {
      setFilteredResults(shownFiles)
    }
  }

  const displayPath = (cpath) => {
    return "~/"+cpath;
  }

  return(
    <>
      <Head>
        <title>
        HubSeq | File Explorer
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <FileListToolbar searchInput={searchInput} searchItems={searchItems} currentPath={currentPath} filesSelectedInfo={shownFiles.filter(val => filesSelected.includes(val.id))} filesSelected={filesSelected} setFilesSelected={setFilesSelected} session={session} />
          <Box sx={{ mt: 2 }}> &nbsp;&nbsp;&nbsp; <b>Current Folder:</b> {displayPath(currentPath)} &nbsp;&nbsp; [<Tooltip title="Go up one folder" placement="top-start"><u onClick={() => upOnePath(currentPath)}>Back</u></Tooltip>] </Box>
          <Box sx={{ mt: 3 }}>
            <FileListResults files={filteredResults} setFiles={setShownFiles} setFilteredResults={setFilteredResults} setSearchInput={setSearchInput} currentPath={currentPath} setFilesSelected={setFilesSelected} setCurrentPath={setCurrentPath} session={session}/>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Files.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Files;
