//
// Mock S3 object endpoint.
//
// Replaces the production flow of "Cognito temp credentials -> S3 presigned
// URL". The frontend download/upload helpers (file-download-api-call.js /
// file-upload-api-call.js) treat this route's URL as the "signed URL".
//
//   GET  /api/file?path=<key>          -> download object contents
//   POST /api/file   { path, content } -> upload / create object
//
import { getObject, putObject } from '../../server/mock-backend';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const key = req.query.path;
    if (!key) return res.status(400).send('missing path');
    const obj = getObject(key);
    if (!obj) return res.status(404).send(`not found: ${key}`);

    const filename = key.split('/').pop();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(obj.content != null ? obj.content : `mock contents of ${key}\n`);
  }

  if (req.method === 'POST') {
    const { path: key, content } = req.body || {};
    if (!key) return res.status(400).json({ error: 'missing path' });
    const text = content != null ? String(content) : `uploaded ${key}\n`;
    const obj = putObject(key, Buffer.byteLength(text, 'utf8'), text);
    return res.status(200).json({ ok: true, key: obj.Key, size: obj.Size });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'method not allowed' });
}
