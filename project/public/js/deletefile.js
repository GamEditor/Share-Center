/**
 * Deleting files on server
 * @param {The relative path of file on server} directory 
 * @param {The actual and full file name} filename 
 * @param {An html element for blocking user actions by coming forward} blockpanel 
 */
function deletefile(directory, filename, blockpanelID) {
    let bpanel = document.getElementById(blockpanelID);

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState < 4) {
            bpanel.style = "zindex = 100;"
        }

        if (this.readyState == 4 && this.status == 200) {
            bpanel.style = "zindex = -100;"
        } else if (this.readyState == 4 && this.status != 200) {
            window.location.reload();
        }
    };

    xhr.open("DELETE", "filedir", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}