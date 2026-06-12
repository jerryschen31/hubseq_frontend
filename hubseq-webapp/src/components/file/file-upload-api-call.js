//
// File upload helper.
//
// Production: fetched Cognito temp credentials and PUT the file to S3 via a
// presigned URL. Demo: POSTs the file (as text) to the local mock S3 endpoint
// (/api/file), which adds it to the in-memory bucket so it appears in the file
// explorer after a refresh.
//
// Signature is unchanged: fileUploadCall(myfile, fileObj, teamid, idToken)
//
import axios from 'axios';

export async function fileUploadCall(myfile, fileObj, teamid, idToken) {
  let content = '';
  try {
    // Read the selected file's contents as text (fine for the demo's small
    // sample files). Binary uploads still register an object of the right size.
    if (fileObj && typeof fileObj.text === 'function') {
      content = await fileObj.text();
    }
  } catch (e) {
    content = '';
  }

  const response = await axios.post('/api/file', { path: myfile, content });
  return response.data;
}
