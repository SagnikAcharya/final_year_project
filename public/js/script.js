
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



let blur = document.querySelectorAll('.qrBlur');
let btn = document.querySelectorAll('.myBtn');
btn[0].addEventListener('click', function () {
      blur[0].classList.remove("qrBlur");
      blur[0].classList.add("qrNotBLur");
      btn[0].innerHTML = "Student QR";
})

