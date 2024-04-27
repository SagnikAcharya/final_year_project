
function myCheckbox() {
    var inputBox=document.querySelectorAll("#auto");
    var checkBox=document.querySelectorAll("#flexSwitchCheckDefault");
    console.log(inputBox);
        if ( checkBox.checked == true ) {
           inputBox.setAttribute("disabled","disabled");
        } else {
           inputBox.removeAttribute("disabled");
        }
}