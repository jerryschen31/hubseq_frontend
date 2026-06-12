import Head from 'next/head';
import React from 'react';
import { Box, Container } from '@mui/material';
import { RunListResults } from '../components/run/run-list-results';
import { RunListToolbar } from '../components/run/run-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
//import RunList from '../components/run/run-list-api-call';
import { getRunsCall } from '../components/run/run-list-api-call';
import { useState } from 'react';
// import { runs } from '../__mocks__/runs';
import { useSession } from "utils/mock-auth";

const Runs = () => {
  const [runsSelected, setRunsSelected] = useState([]);
  const [runInfo, setRunInfo] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const { data: session, status } = useSession();

  async function getRuns(idToken) {
    const newruns = await getRunsCall(idToken);
    setRunInfo(newruns);
    setFilteredResults(newruns);
  }

  React.useEffect(() => {
    if (session) {
      getRuns(session.idToken);
    }
  }, [session]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchValue !== '') {
      const filteredData = runInfo.filter((item) => {
        return Object.values(item.runid).join('').toLowerCase().includes(searchValue.toLowerCase())
        })
      setFilteredResults(filteredData)
    } else {
      setFilteredResults(runInfo)
    }
  }

  return(
    <>
      <Head>
        <title>
        HubSeq | Runs
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
          <RunListToolbar searchInput={searchInput} searchItems={searchItems} runsSelected={runsSelected} setRunsSelected={setRunsSelected} runInfo={runInfo} setRunInfo={setRunInfo} session={session} />
          <Box sx={{ mt: 3 }}>
            <RunListResults runs={filteredResults} setRunsSelected={setRunsSelected} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Runs.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Runs;
