//
// In-memory mock data store for the HubSeq demo backend.
//
// This replaces the production AWS infrastructure:
//   - S3 buckets  -> `files` (a flat list of object keys, S3 style)
//   - DynamoDB     -> `runs` / `jobs` tables
//   - object tags  -> `metadata`
//
// State lives for the lifetime of the dev server process. It is intentionally
// module-level (a singleton) so every API route shares the same data and
// mutations (uploads, pipeline runs) are visible across requests.
//

const now = () => new Date();

const fmt = (d) => {
  // "YYYY-MM-DD HH:MM" — matches the shape the UI splits on a space.
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
};

// A virtual S3 object. `key` is the full path inside the bucket (no leading
// slash); folders are implied by '/' in keys.
const f = (key, size, content) => ({
  Key: key,
  Size: size,
  LastModified: fmt(now()),
  content: content || `# ${key}\n(mock file contents for the HubSeq demo)\n`,
});

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

// A small but realistic bioinformatics workspace plus one fully-populated,
// completed RNA-seq pipeline run so the Runs page + report viewers have data.
const seedFiles = () => [
  f('welcome.txt', 412,
    'Welcome to the HubSeq demo workspace!\n\n' +
    'This is a mock S3 bucket. Browse the project folders on the left,\n' +
    'select FASTQ files to run a pipeline, or open the Runs page to see\n' +
    'previously completed analyses.\n'),

  // ----- project_alpha: an RNA-seq project with raw reads -----
  f('project_alpha/README.txt', 240,
    'project_alpha\n=============\nMouse RNA-seq, 2 samples, paired-end.\n'),
  f('project_alpha/samplesheet.csv', 180,
    'sample,condition,replicate\nsample1,control,1\nsample2,treated,1\n'),
  f('project_alpha/rnaseq/raw/sample1_R1.fastq.gz', 10485760),
  f('project_alpha/rnaseq/raw/sample1_R2.fastq.gz', 10485760),
  f('project_alpha/rnaseq/raw/sample2_R1.fastq.gz', 12582912),
  f('project_alpha/rnaseq/raw/sample2_R2.fastq.gz', 12582912),

  // ----- project_beta: a ChIP-seq project -----
  f('project_beta/notes.txt', 96, 'ChIP-seq: H3K27ac vs input.\n'),
  f('project_beta/chipseq/raw/input_R1.fastq.gz', 8388608),
  f('project_beta/chipseq/raw/h3k27ac_R1.fastq.gz', 9437184),

  // ----- reference genomes -----
  f('reference/genomes/hg38.fa', 3200000000, '>chr1\nNNNNNNNNNN...\n'),
  f('reference/genomes/mm10.fa', 2700000000, '>chr1\nNNNNNNNNNN...\n'),

  // ----- a completed RNA-seq run with full outputs (for the Runs page) -----
  f('runs/run-rnaseq-001/rnaseq_summaryqc/summaryqc.report.csv', 4096,
    'sample,total_reads,pct_aligned,pct_dup\nsample1,30412233,0.94,0.12\nsample2,28991002,0.93,0.14\n'),
  f('runs/run-rnaseq-001/rnastar/sample1.Aligned.sortedByCoord.out.bam', 524288000),
  f('runs/run-rnaseq-001/rnastar/sample2.Aligned.sortedByCoord.out.bam', 498073600),
  f('runs/run-rnaseq-001/rnastar/sample1.ReadsPerGene.out.tab', 81920,
    'gene_id\tcounts\nENSMUSG00000000001\t1423\nENSMUSG00000000003\t0\n'),
  f('runs/run-rnaseq-001/rnastar/sample2.ReadsPerGene.out.tab', 81920,
    'gene_id\tcounts\nENSMUSG00000000001\t1190\nENSMUSG00000000003\t2\n'),
  f('runs/run-rnaseq-001/expressionqc/expressionqc.counts_matrix.csv', 65536,
    'gene_id,sample1,sample2\nENSMUSG00000000001,1423,1190\n'),
  f('runs/run-rnaseq-001/deseq2/deseq2.results.csv', 131072,
    'gene_id,log2FoldChange,pvalue,padj\nENSMUSG00000000001,1.82,0.0001,0.003\n'),
  f('runs/run-rnaseq-001/david_go/davidgo.goterms.txt', 24576,
    'GO_term\tdescription\tpvalue\nGO:0006955\timmune response\t1e-08\n'),
];

const seedRuns = () => {
  const t1 = new Date(Date.now() - 1000 * 60 * 60 * 26); // ~yesterday
  const t2 = new Date(Date.now() - 1000 * 60 * 60 * 3);
  const t3 = new Date(Date.now() - 1000 * 60 * 20);
  return [
    {
      runid: 'run-rnaseq-001',
      date_submitted: fmt(t1),
      pipeline_module: 'rnaseq:mouse',
      status: 'COMPLETE',
    },
    {
      runid: 'run-fastqc-014',
      date_submitted: fmt(t2),
      pipeline_module: 'fastqc',
      status: 'COMPLETE',
    },
    {
      runid: 'run-chipseq-007',
      date_submitted: fmt(t3),
      pipeline_module: 'chipseq:human',
      status: 'RUNNING',
    },
  ];
};

const seedJobs = () => {
  const t1 = new Date(Date.now() - 1000 * 60 * 60 * 26);
  const t3 = new Date(Date.now() - 1000 * 60 * 20);
  return [
    { jobid: 'job-0001', runid: 'run-rnaseq-001', module: 'rnastar', sampleid: 'sample1', submitted: fmt(t1), status: 'COMPLETE' },
    { jobid: 'job-0002', runid: 'run-rnaseq-001', module: 'rnastar', sampleid: 'sample2', submitted: fmt(t1), status: 'COMPLETE' },
    { jobid: 'job-0003', runid: 'run-rnaseq-001', module: 'deseq2', sampleid: 'cohort', submitted: fmt(t1), status: 'COMPLETE' },
    { jobid: 'job-0004', runid: 'run-rnaseq-001', module: 'david_go', sampleid: 'cohort', submitted: fmt(t1), status: 'COMPLETE' },
    { jobid: 'job-0101', runid: 'run-chipseq-007', module: 'bwa', sampleid: 'h3k27ac', submitted: fmt(t3), status: 'RUNNING' },
  ];
};

// `globalThis` keeps the singleton alive across Next.js hot reloads in dev.
const store = globalThis.__HUBSEQ_MOCK_STORE__ || {
  files: seedFiles(),
  runs: seedRuns(),
  jobs: seedJobs(),
  metadata: {}, // key -> { tagKey: tagValue }
  teamId: 'demo-team',
};
globalThis.__HUBSEQ_MOCK_STORE__ = store;

module.exports = { store, fmt, makeFile: f };
