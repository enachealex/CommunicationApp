// The only links the desktop app ever opens: a Google search for one of the result styles.
// The main process refuses anything else, so even a script injected into the page cannot use
// openExternal to launch another protocol (file:, ms-settings:, a custom handler) or program.
function isAllowedExternalUrl(value) {
  let url;
  try {
    url = new URL(String(value));
  } catch {
    return false;
  }
  return (
    url.protocol === 'https:' &&
    url.hostname === 'www.google.com' &&
    url.port === '' &&
    url.username === '' &&
    url.password === '' &&
    url.pathname === '/search'
  );
}

module.exports = { isAllowedExternalUrl };
