export const getDownloadBlobFunction = filename => (
    blob => {
        const a          = document.createElement("a");
        const url        = URL.createObjectURL(blob);
              a.href     = url;
              a.download = filename;
        
        a.click();
        URL.revokeObjectURL(url);
    }
);