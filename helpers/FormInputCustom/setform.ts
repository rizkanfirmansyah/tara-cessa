export default function setFormValue(name: string, value: any, type?: string) {
  let formElement = document.querySelectorAll(`.modal form [name='${name}']`);
  if (!formElement) {
    console.error(`Form not found for selector: ${`#modal form [name='${name}']`}`);
    return;
  }

  for (let i = 0; i < formElement.length; i++) {
    formElement[i].setAttribute("value", value);
  }
  if (type == "select") {
    let formElement = document.querySelectorAll(`#modal form [name='${name}'] option[value='${value}']`);
    for (let i = 0; i < formElement.length; i++) {
      formElement[i].setAttribute("selected", "true");
    }
  }
  if (type == "textarea") {
    let formElement = document.querySelectorAll(`#modal form [name='${name}']`);
    for (let i = 0; i < formElement.length; i++) {
      formElement[i].setAttribute("placeholder", value);
    }
  }
}
