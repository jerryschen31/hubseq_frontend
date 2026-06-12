//
// Backend API client.
//
// Originally this module called AWS API Gateway via `aws-api-gateway-client`.
// For the local demo it instead talks to the in-app mock backend at
// `/api/pipeline` (see src/pages/api/pipeline.js). The function signatures and
// the returned shape (`{ data }`) are unchanged, so none of the calling code
// (the various *-api-call.js helpers) had to change.
//
import axios from 'axios';

const PIPELINE_API = '/api/pipeline';

// POST a body to a backend "pathTemplate" (e.g. '/test_cors/listobjects').
// `idToken` is accepted for signature-compatibility but is unused in the demo.
export const awsPipelineAPI_POST = function (body, pathTemplate, idToken, ...rest) {
  return axios
    .post(PIPELINE_API, { path: pathTemplate, body })
    .then((res) => ({ data: res.data.data }));
};

// GET a backend "pathTemplate" (e.g. '/test_cors/getteamid').
export const awsPipelineAPI_GET = function (pathTemplate, idToken, ...rest) {
  return axios
    .get(PIPELINE_API, { params: { path: pathTemplate } })
    .then((res) => ({ data: res.data.data }));
};
