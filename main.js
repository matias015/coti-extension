//caja con precios
const $showFinalPricesBox = document.createElement("div");
$showFinalPricesBox.innerHTML = `
<div style="font-weight:700;position:fixed;bottom:0;padding:1em;background-color:gray;font-size:1.5em;">
    <p style="color:#000;"><span>precio costo:   </span><span class="value" id="precioCosto"></span></p>
    <p style="color:lightgreen;"><span>.precio 35%: $</span><span class="value" id="precio35"></span></p>
    <p style="color:lightgreen;"><span>.precio 40%: $</span><span class="value" id="precio40"></span></p>
    <p style="color:lightblue;" ><span>unidad 35%: $</span><span class="value" id="precio35Uni"></span></p>
    <p style="color:lightblue;" ><span>unidad 40%: $</span><span class="value" id="precio40Uni"></span></p>
    <p style="color:#000;cursor:pointer;" ><span>codigo    :  </span><span class="value" id="codigo"></span></p>
    </div>`;

//agregar caja a dom
document.body.appendChild($showFinalPricesBox);

//objeto con elementos contenedores de los precios finales en la box
const priceBoxElements = {
  $costPrice: document.getElementById("precioCosto"),
  $price35: document.getElementById("precio35"),
  $price40: document.getElementById("precio40"),
  $price35Uni: document.getElementById("precio35Uni"),
  $price40Uni: document.getElementById("precio40Uni"),
  $productId: document.getElementById("codigo"),
};
console.log("sdf");

//estilo de boton y input
const calcButtonStyle =
  "cursor:pointer;border-radius:0.5em;text-align:center;width:60%;background-color:green;color:#fff;padding:0.5em;margin:1.5em auto 0.5em auto;";

const calcInputStyle =
  "border-radius:0.5em;text-align:center;width:90%;color:#000;padding:0.25em;margin:0 auto 2em auto;";

//agrega a cada elemento de la pag el boton y input
const $onPageProducts = document.querySelectorAll(".producto_contenedor");

for (let product of $onPageProducts) {
  const $calcPriceButton = document.createElement("p");
  $calcPriceButton.classList.add("boton-calcular");
  $calcPriceButton.setAttribute("style", calcButtonStyle);
  $calcPriceButton.textContent = "calcular precio";

  const $uniAmountInput = document.createElement("input");
  $uniAmountInput.classList.add("cant--input");
  $uniAmountInput.setAttribute("style", calcInputStyle);

  product.appendChild($calcPriceButton);
  product.appendChild($uniAmountInput);
}

//al hacer click en windows
addEventListener("click", (e) => {
  //si se presiona el boton
  if (e.target.classList.contains("boton-calcular")) {
    let costPrice = e.target.parentElement.querySelector(".producto_precio");
    costPrice = costPrice.textContent.replaceAll("$", "");
    costPrice = parseFloat(costPrice.trim());

    //conseguir codigo
    let productId =
      e.target.parentElement.querySelector(".producto_id").textContent;

    productId = parseInt(productId.replaceAll("Código: ", ""));

    //conseguir el input de unidades
    let units = parseInt(
      e.target.parentElement.querySelector(".cant--input").value
    );

    //si es 0 o esta vacio o hay una letra, sera 1
    if (!units) units = 1;

    //calcular precios al 35 y al 40 con las unidades
    let price35 = Math.round(costPrice * 1.05 * 1.21 * 1.35 * 100) / 100;
    price35 = Math.round(price35 * 4) / 4;

    let price40 = Math.round(costPrice * 1.05 * 1.21 * 1.4 * 100) / 100;
    price40 = Math.round(price40 * 4) / 4;

    let price35Uni = Math.round((price35 / units) * 100) / 100;
    price35Uni = Math.round(price35Uni * 4) / 4;

    let price40Uni = Math.round((price40 / units) * 100) / 100;
    price40Uni = Math.round(price40Uni * 4) / 4;

    //mostrar los resultados en la box
    priceBoxElements.$costPrice.textContent = costPrice;
    priceBoxElements.$price35.textContent = price35;
    priceBoxElements.$price40.textContent = price40;
    priceBoxElements.$price35Uni.textContent = price35Uni;
    priceBoxElements.$price40Uni.textContent = price40Uni;
    priceBoxElements.$productId.textContent = productId;

    //resaltar un precio u otro dependiendo de las unidades
    if (units == 1) {
      priceBoxElements.$price35.style.backgroundColor = "transparent";
      priceBoxElements.$price40.style.backgroundColor = "black";
      priceBoxElements.$price35Uni.style.backgroundColor = "transparent";
      priceBoxElements.$price40Uni.style.backgroundColor = "transparent";
    } else {
      priceBoxElements.$price35.style.backgroundColor = "black";
      priceBoxElements.$price40.style.backgroundColor = "transparent";
      priceBoxElements.$price35Uni.style.backgroundColor = "transparent";
      priceBoxElements.$price40Uni.style.backgroundColor = "black";
    }
  }
});

//copiar precio o id al hacer click
$showFinalPricesBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("value")) {
    navigator.clipboard.writeText(e.target.textContent);
  }
});
