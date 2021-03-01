export default function downloadCSVFile({ file, filename = 'filename' }) {
  const blob = new Blob([file]);
  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
  const result = filename.split(';filename=')[1];
  if (result && result.endsWith('.csv')) {
    filename = result;
  } else {
    filename = `${result || filename}.csv`;
  }
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
    a.download = filename;
    document.body.appendChild(a);
    // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }
}

export const downloadFiles = ({ file, filename = 'filename', type }) => {
  const blob = new Blob([file]);
  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
  const result = filename.split(';filename=')[1];
  if (result && result.endsWith(`.${type}`)) {
    filename = result;
  } else {
    filename = `${result || filename}.${type}`;
  }
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
    a.download = filename;
    document.body.appendChild(a);
    // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }
};
