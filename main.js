const products = document.querySelectorAll(".producto_contenedor");

const element = document.createElement("div");
element.innerHTML = `
<div style="font-weight:700;position:fixed;bottom:0;padding:1em;background-color:gray;font-size:1.5em;">
    <p style="color:#000;"><span>precio costo:   </span><span id="precioCosto"></span></p>
    <p style="color:lightgreen;"><span>.precio 35%: $</span><span id="precio35"></span></p>
    <p style="color:lightgreen;"><span>.precio 40%: $</span><span id="precio40"></span></p>
    <p style="color:lightblue;" ><span>unidad 35%: $</span><span id="precio35Uni"></span></p>
    <p style="color:lightblue;" ><span>unidad 40%: $</span><span id="precio40Uni"></span></p></div>`;

document.body.appendChild(element);

const calcButtonStyle =
  "cursor:pointer;border-radius:0.5em;text-align:center;width:60%;background-color:red;color:#fff;padding:0.5em;margin:0.5em auto;";

const calcInputStyle =
  "border-radius:0.5em;text-align:center;width:90%;color:#000;padding:0.25em;margin:0 auto 2em auto;";

const $showPrecioCosto = document.getElementById("precioCosto");
const $showPrecio35 = document.getElementById("precio35");
const $showPrecio40 = document.getElementById("precio40");
const $showPrecio35Uni = document.getElementById("precio35Uni");
const $showPrecio40Uni = document.getElementById("precio40Uni");

for (let el of products) {
  const element = document.createElement("p");
  const elementInput = document.createElement("input");
  elementInput.classList.add("cant--input");
  element.textContent = "calcular precio";
  element.classList.add("calc--price");
  element.setAttribute("style", calcButtonStyle);
  elementInput.setAttribute("style", calcInputStyle);
  el.appendChild(element);
  el.appendChild(elementInput);
}

addEventListener("click", (e) => {
  if (e.target.classList.contains("calc--price")) {
    let precioCosto = e.target.parentElement.querySelector(".producto_precio");
    precioCosto = precioCosto.textContent;
    precioCosto = precioCosto.replaceAll("$", "");
    precioCosto = parseFloat(precioCosto.trim());

    let unidades = parseInt(
      e.target.parentElement.querySelector(".cant--input").value
    );

    if (!unidades) unidades = 1;

    let precio35 = Math.round(precioCosto * 1.05 * 1.21 * 1.35 * 100) / 100;
    let precio40 = Math.round(precioCosto * 1.05 * 1.21 * 1.4 * 100) / 100;
    let precio35Uni = Math.round((precio35 / unidades) * 100) / 100;
    let precio40Uni = Math.round((precio40 / unidades) * 100) / 100;
    $showPrecioCosto.textContent = precioCosto;
    $showPrecio35.textContent = precio35;
    $showPrecio40.textContent = precio40;
    $showPrecio35Uni.textContent = precio35Uni;
    $showPrecio40Uni.textContent = precio40Uni;

    if (unidades == 1) {
      $showPrecio35.style.backgroundColor = "transparent";
      $showPrecio40.style.backgroundColor = "black";
      $showPrecio35Uni.style.backgroundColor = "transparent";
      $showPrecio40Uni.style.backgroundColor = "transparent";
    } else {
      $showPrecio35.style.backgroundColor = "black";
      $showPrecio40.style.backgroundColor = "transparent";
      $showPrecio35Uni.style.backgroundColor = "transparent";
      $showPrecio40Uni.style.backgroundColor = "black";
    }
  }
});
