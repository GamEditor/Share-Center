function initRefreshButton(id)
{
    let pathAttribute = document.createAttribute('path');
    pathAttribute.value = '';
    
    document.getElementById(id).setAttributeNode(pathAttribute);
}