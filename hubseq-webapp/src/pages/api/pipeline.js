//
// Mock HubSeq pipeline API.
//
// Single endpoint that stands in for the production AWS API Gateway. The
// frontend (src/utils/aws-session.js) calls it with:
//
//   POST /api/pipeline   { path: "/test_cors/<op>", body: {...} }
//   GET  /api/pipeline?path=/test_cors/getteamid
//
// and receives `{ data: ... }`, matching the old aws-api-gateway-client shape.
//
import { dispatch } from '../../server/mock-backend';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { path: pathTemplate, body } = req.body || {};
      return res.status(200).json(dispatch(pathTemplate, body || {}, 'POST'));
    }
    if (req.method === 'GET') {
      const pathTemplate = req.query.path;
      return res.status(200).json(dispatch(pathTemplate, {}, 'GET'));
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[mock pipeline api] error:', err);
    return res.status(500).json({ error: String(err && err.message) });
  }
}
