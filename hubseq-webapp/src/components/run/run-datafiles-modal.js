import { useState } from 'react';
import React from "react";
import { Box, Container } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import { Download as DownloadIcon } from '../../icons/download';
import { ReportTable } from './report-table';
import { getFileCall } from '../file/file_list_api_call';
import * as path from 'path';
import { useSession } from "utils/mock-auth";

// assumes that runs are in [HOMEDIR]/runs/[runid]/...
export const RunDataFilesModal = ({runsSelected, runInfo, props}) => {
    const [open, setOpen] = useState(false);
    const [dataFilesSummaryQC, setDataFilesSummaryQC] = useState([]);
    const [dataFilesAlignment, setDataFilesAlignment] = useState([]);
    const [dataFilesGeneExpression, setDataFilesGeneExpression] = useState([]);
    const [dataFilesAlignQC, setDataFilesAlignQC] = useState([]);
    const [dataFilesExpressionQC, setDataFilesExpressionQC] = useState([]);
    const [dataFilesDESeq2, setDataFilesDESeq2] = useState([]);
    const [dataFilesDAVIDGO, setDataFilesDAVIDGO] = useState([]);
    const [dataFilesSingleCell, setDataFilesSingleCell] = useState([]);
    const { data: session, status } = useSession();
    const baseRunPath = "runs/";

    let dataTableSummaryQC;
    let dataTableAlignment;
    let dataTableGeneExpression;
    let dataTableAlignQC;
    let dataTableExpressionQC;
    let dataTableDESeq2;
    let dataTableDAVIDGO;
    let dataTableSingleCell;

    let runs_array = runInfo.map(d => d["runid"]);

    React.useEffect(() => {
      async function getReports(reportType, session) {
        let dataFiles = [];
        let dataFiles2 = [];
        if (reportType == "SummaryQC") {
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'rnaseq_summaryqc'), session.idToken, ".csv");
          setDataFilesSummaryQC(dataFiles);
        } else if (reportType == "Alignment"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'rnastar'), session.idToken, ".bam");
          setDataFilesAlignment(dataFiles);
        } else if (reportType == "GeneExpression"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'rnastar'), session.idToken, ".tab");
          setDataFilesGeneExpression(dataFiles);
        } else if (reportType == "ExpressionQC"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'expressionqc'), session.idToken, ".csv");
          setDataFilesExpressionQC(dataFiles);
        } else if (reportType == "DESeq2"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'deseq2'), session.idToken, ".csv");
          setDataFilesDESeq2(dataFiles);
        } else if (reportType == "DAVIDGO"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'david_go'), session.idToken, ".txt");
          setDataFilesDAVIDGO(dataFiles);
        } else if (reportType == "SingleCell"){
          dataFiles = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'cellranger'), session.idToken, ".csv");
          dataFiles2 = await getFileCall(path.join(baseRunPath,runInfo[runsSelected]['runid'],'seurat'), session.idToken, ".rds");
          setDataFilesSingleCell(dataFiles.concat(dataFiles2));
        }
      }
      if (session && runsSelected){
        getReports("SummaryQC", session);
        getReports("Alignment", session);
        getReports("GeneExpression", session);
        getReports("ExpressionQC", session);
        getReports("DESeq2", session);
        getReports("DAVIDGO", session);
        getReports("SingleCell", session);
      }
    }, [runsSelected, session]);

    const handleClickOpen = () => {
      // getJobs();
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    if (dataFilesSummaryQC && dataFilesSummaryQC.length > 0){
      dataTableSummaryQC = <ReportTable title="Summary QC Data Files" filelist={dataFilesSummaryQC} filetype="SummaryQC" session={session} />;
    } else {
      dataTableSummaryQC = null;
    }

    if (dataFilesAlignment && dataFilesAlignment.length > 0){
      dataTableAlignment = <ReportTable title="Alignment Data Files" filelist={dataFilesAlignment} filetype="Alignment" session={session} />;
    } else {
      dataTableAlignment = null;
    }

    if (dataFilesGeneExpression && dataFilesGeneExpression.length > 0){
      dataTableGeneExpression = <ReportTable title="Gene Expression Data Files" filelist={dataFilesGeneExpression} filetype="GeneExpression" session={session} />;
    } else {
      dataTableGeneExpression = null;
    }

    if (dataFilesExpressionQC && dataFilesExpressionQC.length > 0){
      dataTableExpressionQC = <ReportTable title="Expression QC Data Files" filelist={dataFilesExpressionQC} filetype="ExpressionQC" session={session} />;
    } else {
      dataTableExpressionQC = null;
    }

    if (dataFilesDESeq2 && dataFilesDESeq2.length > 0){
      dataTableDESeq2 = <ReportTable title="Differential Expression Data Files" filelist={dataFilesDESeq2} filetype="DESeq2" session={session} />;
    } else {
      dataTableDESeq2 = null;
    }

    if (dataFilesDAVIDGO && dataFilesDAVIDGO.length > 0){
      dataTableDAVIDGO = <ReportTable title="Gene Ontology Data Files" filelist={dataFilesDAVIDGO} filetype="DAVIDGO" session={session} />;
    } else {
      dataTableDAVIDGO = null;
    }

    if (dataFilesSingleCell && dataFilesSingleCell.length > 0){
      dataTableSingleCell = <ReportTable title="SingleCell Data Files" filelist={dataFilesSingleCell} filetype="SingleCell" session={session} />;
    } else {
      dataTableSingleCell = null;
    }

    // report is specific to RNA-Seq - will generalize this modal later
    return (
        <>
        <Button startIcon={(<DownloadIcon fontSize="small" />)}
        sx={{ mr: 1 }}
        onClick={handleClickOpen}> Get Data Files
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
        <DialogTitle>Data Files for {runInfo[runsSelected]['runid']}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            {dataTableSummaryQC}
            {dataTableAlignment}
            {dataTableGeneExpression}
            {dataTableExpressionQC}
            {dataTableDESeq2}
            {dataTableDAVIDGO}
            {dataTableSingleCell}
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
