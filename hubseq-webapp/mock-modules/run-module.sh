#!/usr/bin/env bash
#
# Mock HubSeq compute module.
#
# In production, each pipeline module (fastqc, bwa, rnastar, deseq2, ...) ran as
# a containerized job on AWS Batch. For the local demo we stand in for that with
# this single shell script: it takes a module name, an input path and an output
# path, "processes" the input, and emits a small mock result file to stdout.
#
# The Node mock backend (src/server/mock-backend.js) invokes this script and
# captures stdout as the module's output artifact, which then shows up in the
# mock S3 file explorer.
#
# Usage: run-module.sh <module> <input> <output> <sampleid>
#
set -euo pipefail

MODULE="${1:-unknown}"
INPUT="${2:-}"
OUTPUT="${3:-}"
SAMPLEID="${4:-sample}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

emit_header() {
  echo "# HubSeq mock module report"
  echo "# module:    ${MODULE}"
  echo "# sample:    ${SAMPLEID}"
  echo "# input:     ${INPUT}"
  echo "# output:    ${OUTPUT}"
  echo "# generated: ${TIMESTAMP}"
  echo ""
}

emit_header

case "${MODULE}" in
  fastqc)
    echo "metric,value"
    echo "total_sequences,$(( (RANDOM % 5000000) + 20000000 ))"
    echo "pct_gc,$(( (RANDOM % 20) + 40 ))"
    echo "per_base_quality,PASS"
    echo "adapter_content,PASS"
    ;;
  bwa|rnastar|align)
    echo "metric,value"
    echo "reads_mapped,$(( (RANDOM % 5000000) + 25000000 ))"
    echo "pct_aligned,0.9$(( RANDOM % 9 ))"
    echo "output_bam,${OUTPUT%/}/${SAMPLEID}.sorted.bam"
    ;;
  deseq2|deqc)
    echo "gene_id,log2FoldChange,pvalue,padj"
    echo "ENSMUSG00000000001,1.8$(( RANDOM % 9 )),0.000$(( RANDOM % 9 )),0.00$(( RANDOM % 9 ))"
    echo "ENSMUSG00000000049,-2.1$(( RANDOM % 9 )),0.001,0.01"
    ;;
  david_go|goqc)
    echo "GO_term,description,pvalue"
    echo "GO:0006955,immune response,1e-0$(( (RANDOM % 8) + 1 ))"
    echo "GO:0008150,biological process,3e-05"
    ;;
  *)
    echo "status,message"
    echo "ok,module ${MODULE} completed on ${SAMPLEID}"
    ;;
esac
