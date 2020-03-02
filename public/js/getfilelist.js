/**
 * request files
 * @param filesContainerId the place of showing files at innerHTML.
 * @param loadingGifId until waiting for response from server, this (gif) image will be displayed.
 * @param directoryDisplayerId a container for showing current path
 * @param emptyFolderBackgroundId if a folder is empty, then a background will be displayed
 */
function getListOfFiles(refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId)
{
    const emptyFolderBackground = document.getElementById(emptyFolderBackgroundId);
    const filesholder = document.getElementById(filesContainerId);
    const loadinggif = document.getElementById(loadingGifId);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState < 4)
        {
            filesholder.innerHTML = "";
            loadinggif.style.display = "block";
        }
        
        if(this.readyState == 4 && this.status == 200)
        {
            // parsing server response
            const response = JSON.parse(this.responseText);
            let files = '';
            
            // checking empty response
            if(response.length == 1 && !response[0].name)
            {
                emptyFolderBackground.style.display = 'block';
                loadinggif.style.display = "none";
            }
            else if(response.length > 0)
            {
                emptyFolderBackground.style.display = 'none';

                // creating files elements on an string
                for(let i = 0; i < response.length; i++)
                {
                    files += 
                    '<div class="file" id="file-' + i + '" title="Size: ' + response[i].size + '\nUpload Date: ' + new Date(response[i].uploadDate) + '">\
                        <span class="helper"></span>\
                        <img src="/public/img/' + response[i].filetype + '-icon.png">' + response[i].name + '\
                    </div>';
                }
                
                // attaching created elements to dom
                filesholder.innerHTML = files;
                
                // hiding loading gif
                loadinggif.style.display = "none";
                
                // adding custom attributes to elements
                for(let i = 0; i < response.length; i++)
                {
                    let file = document.getElementById('file-' + i);
                    
                    let type = document.createAttribute('type');
                    let path = document.createAttribute('path');
                    
                    type.value = response[i].filetype;
                    path.value = encodeURI(response[i].path + '/' + response[i].name);
                    
                    file.setAttributeNode(type);
                    file.setAttributeNode(path);

                    if(file.getAttribute('type') == 'file')
                    {
                        file.addEventListener('dblclick', function(ev)
                        {
                            openFile(file.getAttribute('path'));
                        });
                    }
                    else
                    {
                        file.addEventListener('dblclick', function(ev)
                        {
                            openFolder(file.getAttribute('path'), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
                        });
                    }
                }
            }
            else
            {
                loadinggif.style.display = "none";  // hiding loading gif
            }

            // showing directory on ui
            makeDirectoryElements(response[0].path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
        }
    };
    
    // sending get files request to server
    xhr.open("GET", "files-list", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

function openFile(path)
{
    window.open(path);
}

function openFolder(path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId)
{
    const emptyFolderBackground = document.getElementById(emptyFolderBackgroundId);
    const filesholder = document.getElementById(filesContainerId);
    const loadinggif = document.getElementById(loadingGifId);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState < 4)
        {
            filesholder.innerHTML = "";
            loadinggif.style.display = "block";
        }

        if(this.readyState == 4 && this.status == 200)
        {
            // parsing server response
            const response = JSON.parse(this.responseText);
            let files = '';

            // checking empty response
            if(response.length == 1 && !response[0].name)
            {
                emptyFolderBackground.style.display = 'block';
                loadinggif.style.display = "none";
            }
            else if(response.length > 0)
            {
                emptyFolderBackground.style.display = 'none';

                // creating files elements on an string
                for(let i = 0; i < response.length; i++)
                {
                    files += 
                    '<div class="file" id="file-' + i + '" title="Size: ' + response[i].size + '\nUpload Date: ' + new Date(response[i].uploadDate) + '">\
                    <span class="helper"></span>\
                    <img src="/public/img/' + response[i].filetype + '-icon.png">' + response[i].name + '\
                    </div>';
                }
                
                // attaching created elements to dom
                filesholder.innerHTML = files;
                
                // hiding loading gif
                loadinggif.style.display = "none";
                
                // adding custom attributes to elements
                for(let i = 0; i < response.length; i++)
                {
                    let file = document.getElementById('file-' + i);
                    
                    let type = document.createAttribute('type');
                    let path = document.createAttribute('path');
                    
                    type.value = response[i].filetype;
                    path.value = encodeURI(response[i].path + '/' + response[i].name);
                    
                    file.setAttributeNode(type);
                    file.setAttributeNode(path);
                    
                    if(file.getAttribute('type') == 'file')
                    {
                        file.addEventListener('dblclick', function(ev)
                        {
                            openFile(file.getAttribute('path'));
                        });
                    }
                    else
                    {
                        file.addEventListener('dblclick', function(ev)
                        {
                            openFolder(file.getAttribute('path'), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
                        });
                    }
                }
            }
            else
            {
                loadinggif.style.display = "none";  // hiding loading gif
            }

            // showing directory on ui
            makeDirectoryElements(response[0].path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
        }
    };

    // sending get files request to server
    xhr.open("GET", "files-list?path=" + path, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

function makeDirectoryElements(path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId)
{
    var directoryDisplayer = document.getElementById(directoryDisplayerId);
    const refreshButton = document.getElementById(refreshButtonId);

    var folders = path.split('/');
    var result = '';

    for(let i = 0; i < folders.length; i++)
    {
        result += '<span id="dir-' + i + '" class="directory">' + folders[i] + '</span>/';
    }

    directoryDisplayer.innerHTML = result.substring(0, result.length - 1);

    // when click on directory name, that previous folder will be open
    // if last directory (current opened folder) so hasn't onclick listener
    for(let i = 0; i < folders.length - 1; i++)
    {
        let dir = document.getElementById('dir-' + i);
        let pathAttribute = document.createAttribute('path');
        
        let path = '';
        for(let j = 0; j <= i; j++)
            path += folders[j] + '/';

        pathAttribute.value = encodeURI(path.substring(0, path.length - 1));
        
        dir.setAttributeNode(pathAttribute);
        
        dir.addEventListener('click', function(ev)
        {
            openFolder(dir.getAttribute('path'), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
        });
    }

    refreshButton.setAttribute('path', path);
}