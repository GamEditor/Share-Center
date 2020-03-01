let isuploading = false;    // user can not upload another file when an upload in progress

function uploadToServer(form, uploadProgressDisplayer, progresstext, filestableid, loadinggifid, directoryDisplayerId, emptyFolderBackgroundId)
{
    let formData = new FormData(form);

    if(!isuploading)
    {
        if(formData.get('file').name == "")
            alert('select a file first!');  // if no file is selected or uploading last file is finished
        else
        {
            isuploading = true;

            let xhr = new XMLHttpRequest();
            xhr.open(form.method, form.action, true);
            
            xhr.upload.addEventListener('progress', function(ev)
            {
                let progress = Math.max(ev.loaded / ev.total * 100).toFixed(2);
        
                if (ev.lengthComputable)
                {
                    uploadProgressDisplayer.style.width = progress + '%'; // showing upload progress in page
                    progresstext.innerHTML = progress + '%';

                    if(progress == 100)
                    {
                        form.reset();           // reset() will empty all form information
                        isuploading = false;    // enable user to upload again
                        getListOfFiles(filestableid, loadinggifid, directoryDisplayerId, emptyFolderBackgroundId); // updating list of files after upload finished
                    }
                }
                else
                {
                    uploadProgressDisplayer.style.width = 0;
                    console.log('the length is not calcutable!');
                }
            });

            xhr.send(formData);
        }
    }
    else
        alert('another upload on progress!');  // if no file is selected or uploading last file is finished
}