const file = document.getElementsByName("file")[0];
const width = document.getElementsByName("width")[0];
const height = document.getElementsByName("height")[0];
const submitButton = document.getElementById("submitButton");

height.addEventListener("input", (event) => {
    if (file.value.length >= 2 && width.value.length >= 2 && event.target.value.length >= 2) { 
        submitButton.disabled = false;
    }  else {
        submitButton.disabled = true;
    }
});