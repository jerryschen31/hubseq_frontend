import { useState } from 'react';
import React from "react";
import { Box, Container } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import { Upload as UploadIcon } from '../../icons/upload';
// import JobList from './job-list-api-call';
import { jobsCall } from './job-list-api-call';
import { ReportTable } from './report-table';
import { getFileCall } from '../file/file_list_api_call';
import * as path from 'path';

// assumes that runs are in [HOMEDIR]/runs/[runid]/...
export const RunReportModal = ({runsSelected, runInfo, props}) => {
    const [open, setOpen] = useState(false);
    const [reportFilesFastQC, setReportFilesFastQC] = useState([]);
    const [reportFilesExpressionQC, setReportFilesExpressionQC] = useState([]);
    const [reportFilesDEQC, setReportFilesDEQC] = useState([]);
    const [reportFilesGOQC, setReportFilesGOQC] = useState([]);

    const baseRunPath = "tranquis/runs/"; // replace with teamid later

    let run_report_button;
    let runs_array = runInfo.map(d => d["runid"]);

    React.useEffect(() => {
      async function getReports(reportType) {
        let htmlFiles = [];
        console.log('REPORT RUNS SELECTED: ', runsSelected);
        console.log('REPORT RUNS INFO: ', runInfo);
        // console.log('the file call: ', path.join(baseRunPath,runInfo[runsSelected]['runid'],'fastqc'));
        if (reportType == "FastQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'fastqc'), ".html");
          setReportFilesFastQC(htmlFiles);
        } else if (reportType == "ExpressionQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'expressionqc'), ".html");
          setReportFilesExpressionQC(htmlFiles);
        } else if (reportType == "DEQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'deqc'), ".html");
          setReportFilesDEQC(htmlFiles);
        } else if (reportType == "GOQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'goqc'), ".html");
          setReportFilesGOQC(htmlFiles);
        }
      }
      if (runsSelected){
        getReports("FastQC");
        getReports("ExpressionQC");
        getReports("DEQC");
        getReports("GOQC");
      }
    }, [runsSelected]);

    const handleClickOpen = () => {
      // getJobs();
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

      // upload button - always show
    run_report_button = <Button startIcon={(<UploadIcon fontSize="small" />)}
                          sx={{ mr: 1 }}
                          onClick={handleClickOpen}> Run Report
                  </Button>

    // report is specific to RNA-Seq - will generalize this modal later
    return (
        <>
        <Button startIcon={(<UploadIcon fontSize="small" />)}
        sx={{ mr: 1 }}
        onClick={handleClickOpen}> View Report
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
        <DialogTitle>Run Report for {runInfo[runsSelected]['runid']}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            <ReportTable title="FASTQC Reports" filelist={reportFilesFastQC} filetype="FastQC" />
            <ReportTable title="Gene Expression QC Reports" filelist={reportFilesExpressionQC} filetype="ExpressionQC" />
            <ReportTable title="Differential Expression QC Reports" filelist={reportFilesDEQC} filetype="DEQC" />
            <ReportTable title="Gene Ontology QC Reports" filelist={reportFilesGOQC} filetype="GOQC" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      </>
    );
};
