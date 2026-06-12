/**
 * Backend tests for the mock HubSeq API.
 *
 * @jest-environment node
 */
const backend = require('../src/server/mock-backend');

describe('mock S3 listing (listObjects)', () => {
  test('lists top-level folders and files S3-style', () => {
    const { data } = backend.dispatch('/test_cors/listobjects', { path: '' });
    const folders = data.CommonPrefixes.map((p) => p.Prefix);
    const files = data.Contents.map((c) => c.Key);

    expect(folders).toEqual(
      expect.arrayContaining(['project_alpha/', 'project_beta/', 'reference/', 'runs/'])
    );
    expect(files).toContain('welcome.txt');
    // a nested file must NOT appear at the root level
    expect(files).not.toContain('project_alpha/README.txt');
  });

  test('descends into a subfolder', () => {
    const { data } = backend.dispatch('/test_cors/listobjects', { path: 'project_alpha/' });
    expect(data.CommonPrefixes.map((p) => p.Prefix)).toContain('project_alpha/rnaseq/');
    expect(data.Contents.map((c) => c.Key)).toContain('project_alpha/README.txt');
  });

  test('searchpattern filters by substring', () => {
    const { data } = backend.dispatch('/test_cors/listobjects', {
      path: 'project_alpha/rnaseq/raw/',
      searchpattern: 'R1',
    });
    const names = data.Contents.map((c) => c.Key);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n.includes('R1'))).toBe(true);
  });
});

describe('tables (gettable)', () => {
  test('runs table is nested once and has the seeded run', () => {
    const { data } = backend.dispatch('/test_cors/gettable', { table: 'runs' });
    expect(Array.isArray(data)).toBe(true);
    const runs = data[0];
    expect(runs.map((r) => r.runid)).toContain('run-rnaseq-001');
  });

  test('jobs table is keyed by runid', () => {
    const { data } = backend.dispatch('/test_cors/gettable', { table: 'jobs' });
    const jobs = data[0];
    expect(jobs.some((j) => j.runid === 'run-rnaseq-001')).toBe(true);
  });
});

describe('getteamid', () => {
  test('returns the demo team id', () => {
    const { data } = backend.dispatch('/test_cors/getteamid', {}, 'GET');
    expect(data).toBe('demo-team');
  });
});

describe('compute: runModule via the mock shell script', () => {
  test('runs a module, records a job + run, and writes an output object', () => {
    const runid = `run-test-${Date.now()}`;
    const { data } = backend.dispatch('/test_cors/batchjob', {
      module: 'fastqc',
      input: 'project_alpha/rnaseq/raw/sample1_R1.fastq.gz',
      runid,
      sampleid: 'sample1',
    });

    expect(data.runid).toBe(runid);
    expect(data.stdout).toContain('HubSeq mock module report');

    // the new run shows up in the runs table
    const runs = backend.dispatch('/test_cors/gettable', { table: 'runs' }).data[0];
    expect(runs.map((r) => r.runid)).toContain(runid);

    // the output file is browsable in the mock S3
    const listing = backend.dispatch('/test_cors/listobjects', {
      path: `runs/${runid}/fastqc/`,
    }).data;
    expect(listing.Contents.map((c) => c.Key)).toContain(
      `runs/${runid}/fastqc/sample1.fastqc.report.csv`
    );
  });
});

describe('compute: runPipeline executes each module', () => {
  test('creates a run with one job per module and output folders', () => {
    const runid = `run-pipe-${Date.now()}`;
    const { data } = backend.dispatch('/test_cors/batchpipeline', {
      pipeline: 'rnaseq:mouse',
      modules: 'fastqc,rnastar,deseq2',
      input: 'project_alpha/rnaseq/raw/sample1_R1.fastq.gz',
      runid,
      sampleids: 'sample1,sample1,cohort',
    });

    expect(data.modules).toEqual(['fastqc', 'rnastar', 'deseq2']);
    expect(data.results).toHaveLength(3);

    const folders = backend.dispatch('/test_cors/listobjects', {
      path: `runs/${runid}/`,
    }).data.CommonPrefixes.map((p) => p.Prefix);
    expect(folders).toEqual(
      expect.arrayContaining([
        `runs/${runid}/fastqc/`,
        `runs/${runid}/rnastar/`,
        `runs/${runid}/deseq2/`,
      ])
    );
  });
});

describe('metadata get/set', () => {
  test('sets then reads back tags for an object', () => {
    backend.dispatch('/test_cors/setmetadata', {
      objects: 'welcome.txt',
      tags: { project: 'demo', organism: 'mouse' },
    });
    const { data } = backend.dispatch('/test_cors/getmetadata', { objects: 'welcome.txt' });
    const tags = data[0]; // array of {Key, Value} for the first requested object
    const asObj = Object.fromEntries(tags.map((t) => [t.Key, t.Value]));
    expect(asObj.project).toBe('demo');
    expect(asObj.organism).toBe('mouse');
  });
});

describe('updatejobstatus advances RUNNING -> COMPLETE', () => {
  test('no RUNNING jobs remain after an update', () => {
    backend.dispatch('/test_cors/updatejobstatus', {});
    const jobs = backend.dispatch('/test_cors/gettable', { table: 'jobs' }).data[0];
    expect(jobs.every((j) => j.status !== 'RUNNING')).toBe(true);
  });
});

describe('object get/put', () => {
  test('putObject then getObject round-trips content', () => {
    backend.putObject('uploads/hello.txt', 11, 'hello world');
    const obj = backend.getObject('uploads/hello.txt');
    expect(obj).not.toBeNull();
    expect(obj.content).toBe('hello world');
  });
});
