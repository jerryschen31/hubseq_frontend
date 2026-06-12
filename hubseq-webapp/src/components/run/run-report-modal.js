import { useState } from 'react';
import React from "react";
import { Box, Container } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { ReportTable } from './report-table';
import { getFileCall } from '../file/file_list_api_call';
import * as path from 'path';
import { useSession } from "utils/mock-auth";

// assumes that runs are in [HOMEDIR]/runs/[runid]/...
export const RunReportModal = ({runsSelected, runInfo, props}) => {
    const [open, setOpen] = useState(false);
    const [reportFilesSummaryQC, setReportFilesSummaryQC] = useState([]);
    const [reportFilesFastQC, setReportFilesFastQC] = useState([]);
    const [reportFilesAlignQC, setReportFilesAlignQC] = useState([]);
    const [reportFilesExpressionQC, setReportFilesExpressionQC] = useState([]);
    const [reportFilesDEQC, setReportFilesDEQC] = useState([]);
    const [reportFilesGOQC, setReportFilesGOQC] = useState([]);
    const [reportFilesSingleCellQC, setReportFilesSingleCellQC] = useState([]);
    const { data: session, status } = useSession();

    let reportTableSummaryQC;
    let reportTableFastQC;
    let reportTableAlignQC;
    let reportTableExpressionQC;
    let reportTableDEQC;
    let reportTableGOQC;
    let reportTableSingleCellQC;

    const baseRunPath = "runs/";
    let runs_array = runInfo.map(d => d["runid"]);

    React.useEffect(() => {
      async function getReports(reportType, session) {
        let htmlFiles = [];
        let htmlFiles2 = [];
        let pdfFiles = [];
        let pdfFiles2 = [];
        if (reportType == "FastQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'fastqc'), session.idToken, ".html");
          setReportFilesFastQC(htmlFiles);
        } else if (reportType == "SummaryQC") {
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'rnaseq_summaryqc'), session.idToken, ".html");
          setReportFilesSummaryQC(htmlFiles);
        } else if (reportType == "ExpressionQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'expressionqc'), session.idToken, ".html");
          setReportFilesExpressionQC(htmlFiles);
        } else if (reportType == "DEQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'deqc'), session.idToken, ".html");
          setReportFilesDEQC(htmlFiles);
        } else if (reportType == "GOQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'goqc'), session.idToken, ".html");
          setReportFilesGOQC(htmlFiles);
        } else if (reportType == "AlignQC"){
          pdfFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'qorts_multi'), session.idToken, ".pdf");
          // pdfFiles2 = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'qorts'), session.idToken, ".pdf");
          setReportFilesSingleCellQC(pdfFiles);
        } else if (reportType == "SingleCellQC"){
          htmlFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'cellranger'), session.idToken, ".html");
          htmlFiles2 = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'seurat'), session.idToken, ".html");
          setReportFilesSingleCellQC(htmlFiles.concat(htmlFiles2));
        }
      }
      if (session && runsSelected){
        getReports("SummaryQC", session);
        getReports("FastQC", session);
        getReports("AlignQC", session);
        getReports("ExpressionQC", session);
        getReports("DEQC", session);
        getReports("GOQC", session);
        getReports("SingleCellQC", session);
      }
    }, [runsSelected, session]);

    const handleClickOpen = () => {
      // getJobs();
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    if (reportFilesSummaryQC){
      reportTableSummaryQC = <ReportTable title="Summary QC Reports" filelist={reportFilesSummaryQC} filetype="SummaryQC" session={session} />;
    } else {
      reportTableSummaryQC = null;
    }

    if (reportFilesFastQC && reportFilesFastQC.length > 0){
      reportTableFastQC = <ReportTable title="FASTQC Reports" filelist={reportFilesFastQC} filetype="FastQC" session={session} />;
    } else {
      reportTableFastQC = null;
    }

    if (reportFilesAlignQC && reportFilesAlignQC.length > 0){
      reportTableAlignQC = <ReportTable title="Alignment QC Reports" filelist={reportFilesAlignQC} filetype="AlignQC" session={session} />;
    } else {
      reportTableAlignQC = null;
    }

    if (reportFilesExpressionQC && reportFilesExpressionQC.length > 0){
      reportTableExpressionQC = <ReportTable title="Gene Expression Reports" filelist={reportFilesExpressionQC} filetype="ExpressionQC" session={session} />;
    } else {
      reportTableExpressionQC = null;
    }

    if (reportFilesDEQC && reportFilesDEQC.length > 0){
      reportTableDEQC = <ReportTable title="Differential Expression Reports" filelist={reportFilesDEQC} filetype="DEQC" session={session} />;
    } else {
      reportTableDEQC = null;
    }

    if (reportFilesGOQC && reportFilesGOQC.length > 0){
      reportTableGOQC = <ReportTable title="Gene Ontology Reports" filelist={reportFilesGOQC} filetype="GOQC" session={session} />;
    } else {
      reportTableGOQC = null;
    }

    if (reportFilesSingleCellQC && reportFilesSingleCellQC.length > 0){
      reportTableSingleCellQC = <ReportTable title="Single Cell Reports" filelist={reportFilesSingleCellQC} filetype="SingleCellQC" session={session} />;
    } else {
      reportTableSingleCellQC = null;
    }

    // report is specific to RNA-Seq - will generalize this modal later
    return (
        <>
        <Button startIcon={(<SearchIcon fontSize="small" />)}
        sx={{ mr: 1 }}
        onClick={handleClickOpen}> View Report
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
        <DialogTitle>Run Report for {runInfo[runsSelected]['runid']}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            {reportTableSummaryQC}
            {reportTableFastQC}
            {reportTableAlignQC}
            {reportTableExpressionQC}
            {reportTableDEQC}
            {reportTableGOQC}
            {reportTableSingleCellQC}
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
