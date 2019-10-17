/**
 * request files due to the type
 * @param filestableid the place of showing files at innerHTML.
 * @param loadinggifid until waiting for response from server, this (gif) image will be displayed.
 */
function getListOfFiles(filestableid, loadinggifid)
{
    const fileholder = document.getElementById(filestableid);
    const loadinggif = document.getElementById(loadinggifid);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState < 4)
        {
            fileholder.innerHTML = "";
            loadinggif.style.display = "block";
        }
        
        if(this.readyState == 4 && this.status == 200)
        {
            const response = JSON.parse(this.responseText);
            let files = '<tr><th>Files</th></tr>';

            for(let i = 0; i < response.length; i++)
                files += 
                `<tr>
                    <td title="Size: ${response[i].size}\nUpload Date: ${new Date(response[i].uploadDate)}">
                        <a href="${encodeURI(response[i].name)}" download>
                            ${response[i].name}
                        </a>
                    </td>
                </tr>\n`;

            loadinggif.style.display = "none";
            fileholder.innerHTML = files;
        }
    };
    
    xhr.open("GET", "files-list", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}