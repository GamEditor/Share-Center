/**
 * request files
 * @param filestableid the place of showing files at innerHTML.
 * @param loadinggifid until waiting for response from server, this (gif) image will be displayed.
 */
function getListOfFiles(filestableid, loadinggifid)
{
    const filesholder = document.getElementById(filestableid);
    const loadinggif = document.getElementById(loadinggifid);

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
            // checking empty response
            if(!this.responseText)
            {
                loadinggif.style.display = "none";
                return;
            }

            // parsing server response
            const response = JSON.parse(this.responseText);
            let files = '';

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
                        download(file.getAttribute('path'));
                    });
                }
                else
                {
                    file.addEventListener('dblclick', function(ev)
                    {
                        openFolder(file.getAttribute('path'), filestableid, loadinggifid);
                    });
                }
            }
        }
    };
    
    // sending get files request to server
    xhr.open("GET", "files-list", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

function download(path)
{
    window.open(path);
}

function openFolder(path, filestableid, loadinggifid)
{
    const filesholder = document.getElementById(filestableid);
    const loadinggif = document.getElementById(loadinggifid);

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
            // checking empty response
            if(!this.responseText)
            {
                loadinggif.style.display = "none";
                return;
            }
    
            // parsing server response
            const response = JSON.parse(this.responseText);
            let files = '';
    
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
                        download(file.getAttribute('path'));
                    });
                }
                else
                {
                    file.addEventListener('dblclick', function(ev)
                    {
                        openFolder(file.getAttribute('path'), filestableid, loadinggifid);
                    });
                }
            }
        }
    };

    // sending get files request to server
    xhr.open("GET", "files-list?path=" + path, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}