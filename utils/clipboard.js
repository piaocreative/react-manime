import log from '../utils/logging'

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    log.info('Fallback: Copying text command was ' + msg);
  } catch (err) {
    log.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
const copyTextToClipboard = text => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text).then(function() {
    log.info('Async: Copying to clipboard was successful!');
  }, function(err) {
    log.error('Async: Could not copy text: ', err);
  });
}

export {
  copyTextToClipboard
}