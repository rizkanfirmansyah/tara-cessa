export default function setFormEmpty() {
  let textVal = document.querySelectorAll(`#modal form input[type="text"]`);
  let numVal = document.querySelectorAll(`#modal form input[type="number"]`);
  document.querySelector(`#modal form input[type="radio"]`)?.setAttribute("checked", "false");
  document.querySelector(`#modal form input[type="checkbox"]`)?.setAttribute("checked", "false");
  document.querySelector(`#modal form textarea`)?.setAttribute("value", "");
  let opt = document.querySelectorAll(`#modal form select option`);

  for (let index = 0; index < opt.length; index++) {
    const element = opt[index];
    element?.removeAttribute("selected");
  }
  for (let index = 0; index < textVal.length; index++) {
    const element = textVal[index];
    element?.setAttribute("value", "");
  }
  for (let index = 0; index < numVal.length; index++) {
    const element = numVal[index];
    element?.setAttribute("value", "0");
  }
}
