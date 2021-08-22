const products = document.querySelectorAll(".producto");

const element = document.createElement("div");
element.innerHTML = `
<div style="font-weight:700;position:fixed;bottom:0;padding:1em;background-color:gray;font-size:1.5em;">
    <p style="color:#000;"><span>precio costo:   </span><span class="value" id="precioCosto"></span></p>
    <p style="color:lightgreen;"><span>.precio 35%: $</span><span class="value" id="precio35"></span></p>
    <p style="color:lightgreen;"><span>.precio 40%: $</span><span class="value" id="precio40"></span></p>
    <p style="color:lightblue;" ><span>unidad 35%: $</span><span class="value" id="precio35Uni"></span></p>
    <p style="color:lightblue;" ><span>unidad 40%: $</span><span class="value" id="precio40Uni"></span></p>
    <p style="color:#000;cursor:pointer;" ><span>codigo    :  </span><span class="value" id="codigo"></span></p>
    </div>`;

document.body.appendChild(element);

element.addEventListener("click", (e) => {
  if (e.target.classList.contains("value")) {
    navigator.clipboard.writeText(e.target.textContent);
  }
});

const calcButtonStyle =
  "cursor:pointer;border-radius:0.5em;text-align:center;width:60%;background-color:green;color:#fff;padding:0.5em;margin:1.5em auto 0.5em auto;";

const calcInputStyle =
  "border-radius:0.5em;text-align:center;width:90%;color:#000;padding:0.25em;margin:0 auto 2em auto;";

const $showPrecioCosto = document.getElementById("precioCosto");
const $showPrecio35 = document.getElementById("precio35");
const $showPrecio40 = document.getElementById("precio40");
const $showPrecio35Uni = document.getElementById("precio35Uni");
const $showPrecio40Uni = document.getElementById("precio40Uni");
const $showCode = document.getElementById("codigo");

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
    let codigo =
      e.target.parentElement.querySelector(".producto_id").textContent;

    codigo = parseInt(codigo.replaceAll("Código: ", ""));

    let unidades = parseInt(
      e.target.parentElement.querySelector(".cant--input").value
    );

    if (!unidades) unidades = 1;

    let precio35 = Math.round(precioCosto * 1.05 * 1.21 * 1.35 * 100) / 100;
    precio35 = Math.round(precio35 * 4) / 4;

    let precio40 = Math.round(precioCosto * 1.05 * 1.21 * 1.4 * 100) / 100;
    precio40 = Math.round(precio40 * 4) / 4;

    let precio35Uni = Math.round((precio35 / unidades) * 100) / 100;
    precio35Uni = Math.round(precio35Uni * 4) / 4;

    let precio40Uni = Math.round((precio40 / unidades) * 100) / 100;
    precio40Uni = Math.round(precio40Uni * 4) / 4;

    $showPrecioCosto.textContent = precioCosto;
    $showPrecio35.textContent = precio35;
    $showPrecio40.textContent = precio40;
    $showPrecio35Uni.textContent = precio35Uni;
    $showPrecio40Uni.textContent = precio40Uni;
    $showCode.textContent = codigo;

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
