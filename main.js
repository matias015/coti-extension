// funciones y vars

//definir variables para luego compleatar los campos en pricebox
let item_name;
let cost_price;
let pric_35;
let price_40;
let price_35_uni;
let price_40_uni;
let product_id;
let units;

//func para extrar datos del prod y calc precio final
const calc_product_price = (e, element) => {
  let selected_product;
  if (element) {
    selected_product = element.querySelector(".producto");
  } else {
    selected_product = e.target.parentElement.querySelector(".producto");
  }

  //precio costo
  cost_price = selected_product.querySelector(".producto_precio");
  cost_price = cost_price.textContent.replaceAll("$", "");
  cost_price = parseFloat(cost_price.trim());

  //nombre producto
  item_name = selected_product.querySelector(".producto_txt").textContent;

  //conseguir codigo
  product_id = selected_product.querySelector(".producto_id").textContent;

  product_id = parseInt(product_id.replaceAll("Código: ", ""));

  //conseguir el input de unidades
  units = parseFloat(
    selected_product.parentElement.querySelector(".cant--input").value
  );

  //si es 0 o esta vacio o hay una letra, sera 1
  if (!units) units = 1;

  //calcular precios al 35 y al 40 con las unidades
  price_35 = Math.round(cost_price * 1.05 * 1.21 * 1.35 * 100) / 100;
  price_35 = Math.round(price_35 * 4) / 4;

  price_40 = Math.round(cost_price * 1.05 * 1.21 * 1.4 * 100) / 100;
  price_40 = Math.round(price_40 * 4) / 4;

  price_35_uni = Math.round((price_35 / units) * 100) / 100;
  price_35_uni = Math.round(price_35_uni * 4) / 4;

  price_40_uni = Math.round((price_40 / units) * 100) / 100;
  price_40_uni = Math.round(price_40_uni * 4) / 4;

  //mostrar los resultados en la box
  $box_item_name.textContent = item_name;
  $box_cost_price.textContent = cost_price;
  $box_price_35.textContent = price_35;
  $box_price_40.textContent = price_40;
  $box_price_35_uni.textContent = price_35_uni;
  $box_price_40_uni.textContent = price_40_uni;
  $box_product_id.textContent = product_id;

  bg_color_select(units);
};

const bg_color_select = (units) => {
  //resaltar un precio u otro dependiendo de las unidades
  if (units == 1) {
    $box_price_35.style.backgroundColor = "transparent";
    $box_price_40.style.backgroundColor = "black";
    $box_price_35_uni.style.backgroundColor = "transparent";
    $box_price_40_uni.style.backgroundColor = "transparent";
  } else {
    $box_price_35.style.backgroundColor = "black";
    $box_price_40.style.backgroundColor = "transparent";
    $box_price_35_uni.style.backgroundColor = "transparent";
    $box_price_40_uni.style.backgroundColor = "black";
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

// MAIN

//caja con precios
let $show_prices_box = document.createElement("div");
$show_prices_box.innerHTML = `
<div style="font-weight:700;position:fixed;bottom:0;max-width:25vw;padding:1em;background-color:gray;font-size:1.5em;">
    <p style="color:#000;" ><span id="item"></span></p></br>
    <p style="color:#000;"><span>precio costo: $  </span><span class="value" id="precioCosto"></span></p>
    <p style="color:lightgreen;"><span>.precio 35%: $</span><span class="value" id="precio35"></span></p>
    <p style="color:lightgreen;"><span>.precio 40%: $</span><span class="value" id="precio40"></span></p>
    <p style="color:lightblue;" ><span>unidad 35%: $</span><span class="value" id="precio35Uni"></span></p>
    <p style="color:lightblue;" ><span>unidad 40%: $</span><span class="value" id="precio40Uni"></span></p>
    <p style="color:#000;cursor:pointer;" ><span>codigo    :  </span><span class="value" id="codigo"></span></p>
    <button class="copiar">copiar uni</button><button class="copiarind">copiar ind</button>
    </div>`;

//agregar caja a dom
document.body.appendChild($show_prices_box);

//objeto con elementos contenedores de los precios finales en la box

let $box_item_name = document.getElementById("item");
let $box_cost_price = document.getElementById("precioCosto");
let $box_price_35 = document.getElementById("precio35");
let $box_price_40 = document.getElementById("precio40");
let $box_price_35_uni = document.getElementById("precio35Uni");
let $box_price_40_uni = document.getElementById("precio40Uni");
let $box_product_id = document.getElementById("codigo");

//estilo de boton y input
let calc_button_style =
  "cursor:pointer;border-radius:0.5em;text-align:center;width:60%;background-color:green;color:#fff;padding:0.5em;margin:1.5em auto 0.5em auto;";

let calc_input_style =
  "border-radius:0.5em;text-align:center;width:90%;color:#000;padding:0.25em;margin:0 auto 2em auto;";

//cada elemento de la pag
const $on_page_products = document.querySelectorAll(".producto_contenedor");

//agrega a cada elemento de la pag el boton y input
for (let product of $on_page_products) {
  const $calc_price_button = document.createElement("p");
  $calc_price_button.classList.add("boton-calcular");
  $calc_price_button.setAttribute("style", calc_button_style);
  $calc_price_button.textContent = "boton-calcular";

  const $uni_amount_input = document.createElement("input");
  $uni_amount_input.classList.add("cant--input");
  $uni_amount_input.setAttribute("style", calc_input_style);

  product.appendChild($calc_price_button);
  product.appendChild($uni_amount_input);
}

if ($on_page_products.length === 1) {
  calc_product_price(null, $on_page_products[0]);
}

let next = "	";
let next_excel = "	";
//copiar precio o id al hacer click
//let xd = 1;

//al hacer click en el boton
addEventListener("click", (e) => {
  if (e.target.classList.contains("boton-calcular"))
    calc_product_price(e, null);

  if (e.target.classList.contains("copiar")) {
    let to_copy = `${product_id}${next}${item_name.trim()}${next}-${next}${price_35}${next}${price_40_uni}`;
    navigator.clipboard.writeText(to_copy);
  }

  if (e.target.classList.contains("copiarind")) {
    let to_copy = `${product_id}${next}${item_name.trim()}${next}-${next}${price_40}${next}${price_40}`;
    navigator.clipboard.writeText(to_copy);
  }
});
