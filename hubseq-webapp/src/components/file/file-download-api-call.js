//
// File download helper.
//
// Production: fetched Cognito temp credentials and generated an S3 presigned
// URL with the modular AWS SDK. Demo: the "signed URL" is simply our local mock
// S3 endpoint (/api/file), which streams the object's mock contents.
//
// Signature is unchanged: fileDownloadCall(myfile, teamid, idToken, setSignedUrl)
//
export async function fileDownloadCall(myfile, teamid, idToken, setSignedUrl) {
  // The mock backend's object keys are not team-prefixed, so use the raw key.
  const url = `/api/file?path=${encodeURIComponent(myfile)}`;
  if (typeof setSignedUrl === 'function') {
    setSignedUrl(url);
  }
  return url;
}
