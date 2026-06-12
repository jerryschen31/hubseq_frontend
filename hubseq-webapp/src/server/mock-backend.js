//
// Mock HubSeq backend logic.
//
// Implements the operations the production app used to call against AWS API
// Gateway + Lambda. Each exported function corresponds to one of the API
// "pathTemplate" routes the frontend uses (see src/utils/aws-session.js):
//
//   /test_cors/listobjects   -> listObjects   (mock S3 bucket listing)
//   /test_cors/gettable      -> getTable      (runs / jobs tables)
//   /test_cors/getteamid     -> getTeamId
//   /test_cors/getmetadata   -> getMetadata
//   /test_cors/setmetadata   -> setMetadata
//   /test_cors/batchjob      -> runModule     (single module via shell script)
//   /test_cors/batchpipeline -> runPipeline   (a sequence of modules)
//   /test_cors/updatejobstatus -> updateJobStatus
//
const path = require('path');
const { execFileSync } = require('child_process');
const { store, fmt, makeFile } = require('./mock-store');

const MODULE_SCRIPT = path.join(process.cwd(), 'mock-modules', 'run-module.sh');

const basename = (key) => key.replace(/\/$/, '').split('/').pop();

// ---------------------------------------------------------------------------
// S3-style object listing (delimiter = '/')
// ---------------------------------------------------------------------------
function listObjects(prefixRaw, searchpattern) {
  const prefix = prefixRaw || '';
  const commonPrefixes = new Set();
  const contents = [];

  for (const obj of store.files) {
    if (!obj.Key.startsWith(prefix)) continue;
    const rest = obj.Key.slice(prefix.length);
    if (rest === '') continue;

    const slash = rest.indexOf('/');
    if (slash >= 0) {
      // nested -> a folder directly under `prefix`
      commonPrefixes.add(prefix + rest.slice(0, slash + 1));
    } else {
      // a file directly under `prefix`
      if (searchpattern && !obj.Key.toLowerCase().includes(searchpattern.toLowerCase())) {
        continue;
      }
      contents.push({
        Key: obj.Key,
        LastModified: obj.LastModified,
        Size: obj.Size,
      });
    }
  }

  return {
    CommonPrefixes: Array.from(commonPrefixes)
      .sort()
      .map((Prefix) => ({ Prefix })),
    Contents: contents.sort((a, b) => a.Key.localeCompare(b.Key)),
  };
}

// ---------------------------------------------------------------------------
// Tables: runs / jobs
// ---------------------------------------------------------------------------
function getTable(table) {
  // The frontend reads `response.data[0]`, so the array is nested once.
  if (table === 'runs') return [store.runs.map((r) => ({ ...r }))];
  if (table === 'jobs') return [store.jobs.map((j) => ({ ...j }))];
  return [[]];
}

function getTeamId() {
  return store.teamId;
}

// ---------------------------------------------------------------------------
// Object metadata (tags)
// ---------------------------------------------------------------------------
function getMetadata(objectsCsv) {
  const objects = (objectsCsv || '').split(',').filter(Boolean);
  // One array of {Key, Value} tag objects per requested file.
  return objects.map((objKey) => {
    const tags = store.metadata[objKey] || {
      organism: objKey.includes('mm10') || objKey.includes('mouse') ? 'mouse' : 'human',
      filetype: basename(objKey).split('.').slice(1).join('.') || 'unknown',
    };
    return Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
  });
}

function setMetadata(objectsCsv, tags) {
  const objects = (objectsCsv || '').split(',').filter(Boolean);
  for (const objKey of objects) {
    store.metadata[objKey] = { ...(store.metadata[objKey] || {}), ...tags };
  }
  return objects.map((objKey) => ({ object: objKey, tags: store.metadata[objKey] }));
}

// ---------------------------------------------------------------------------
// Compute: run a module / pipeline by invoking the mock shell script
// ---------------------------------------------------------------------------
function runOneModule(module, input, output, sampleid) {
  let stdout;
  try {
    stdout = execFileSync('bash', [MODULE_SCRIPT, module, input, output, sampleid], {
      encoding: 'utf8',
    });
  } catch (err) {
    stdout = `# module ${module} failed: ${err.message}\n`;
  }

  // Persist the module output as a virtual S3 object so it shows up in the
  // file explorer under the run's output folder.
  const outKey = `${output.replace(/\/$/, '')}/${sampleid}.${module}.report.csv`;
  store.files.push(makeFile(outKey, Buffer.byteLength(stdout, 'utf8'), stdout));
  return { module, sampleid, output: outKey, stdout };
}

function runModule({ module, input, output, sampleid, runid, submitted }) {
  const rid = runid || `run-${module}-${Date.now().toString().slice(-6)}`;
  const sid = sampleid || basename(input || 'sample').split('.')[0] || 'sample';
  const outPath = output || `runs/${rid}/${module}`;

  const result = runOneModule(module, input || '', outPath, sid);

  store.jobs.push({
    jobid: `job-${Date.now().toString().slice(-6)}`,
    runid: rid,
    module,
    sampleid: sid,
    submitted: submitted || fmt(new Date()),
    status: 'COMPLETE',
  });
  if (!store.runs.find((r) => r.runid === rid)) {
    store.runs.unshift({
      runid: rid,
      date_submitted: submitted || fmt(new Date()),
      pipeline_module: module,
      status: 'COMPLETE',
    });
  }
  return { runid: rid, ...result };
}

function runPipeline({ pipeline, modules, input, runid, sampleids, submitted }) {
  const rid = runid || `run-${Date.now().toString().slice(-6)}`;
  const moduleList = (modules || '').split(',').map((m) => m.trim()).filter(Boolean);
  const inputList = (input || '').split(',').map((s) => s.trim()).filter(Boolean);
  const sampleList = String(sampleids || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const results = [];
  moduleList.forEach((module, i) => {
    const sid = sampleList[i] || sampleList[0] || `sample${i + 1}`;
    const inp = inputList[i] || inputList[0] || '';
    const outPath = `runs/${rid}/${module}`;
    results.push(runOneModule(module, inp, outPath, sid));
    store.jobs.push({
      jobid: `job-${Date.now().toString().slice(-6)}-${i}`,
      runid: rid,
      module,
      sampleid: sid,
      submitted: submitted || fmt(new Date()),
      status: 'COMPLETE',
    });
  });

  store.runs.unshift({
    runid: rid,
    date_submitted: submitted || fmt(new Date()),
    pipeline_module: pipeline || moduleList.join(','),
    status: 'COMPLETE',
  });

  return { runid: rid, pipeline: pipeline || null, modules: moduleList, results };
}

function updateJobStatus() {
  // Advance any RUNNING jobs/runs to COMPLETE, simulating polling AWS Batch.
  let updated = 0;
  for (const job of store.jobs) {
    if (job.status === 'RUNNING') {
      job.status = 'COMPLETE';
      updated += 1;
    }
  }
  for (const run of store.runs) {
    if (run.status === 'RUNNING') run.status = 'COMPLETE';
  }
  return { updated };
}

// Read a single object's content (used by the mock S3 download endpoint).
function getObject(key) {
  return store.files.find((o) => o.Key === key) || null;
}

// Create / overwrite an object (used by the mock S3 upload endpoint).
function putObject(key, size, content) {
  const existing = store.files.find((o) => o.Key === key);
  if (existing) {
    existing.Size = size;
    existing.LastModified = fmt(new Date());
    if (content != null) existing.content = content;
    return existing;
  }
  const obj = makeFile(key, size, content);
  store.files.push(obj);
  return obj;
}

// ---------------------------------------------------------------------------
// Dispatcher: maps an API pathTemplate + body to a response { data }
// ---------------------------------------------------------------------------
function dispatch(pathTemplate, body = {}, method = 'POST') {
  switch (pathTemplate) {
    case '/test_cors/listobjects':
      return { data: listObjects(body.path, body.searchpattern) };
    case '/test_cors/gettable':
      return { data: getTable(body.table) };
    case '/test_cors/getteamid':
      return { data: getTeamId() };
    case '/test_cors/getmetadata':
      return { data: getMetadata(body.objects) };
    case '/test_cors/setmetadata':
      return { data: setMetadata(body.objects, body.tags || {}) };
    case '/test_cors/batchjob':
      return { data: runModule(body) };
    case '/test_cors/batchpipeline':
      return { data: runPipeline(body) };
    case '/test_cors/updatejobstatus':
      return { data: updateJobStatus() };
    default:
      return { data: { error: `unknown path: ${pathTemplate}` } };
  }
}

module.exports = {
  dispatch,
  listObjects,
  getTable,
  getTeamId,
  getMetadata,
  setMetadata,
  runModule,
  runPipeline,
  updateJobStatus,
  getObject,
  putObject,
};
