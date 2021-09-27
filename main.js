// funciones y vars

function Main() {
  //func para extrar datos del prod y calc precio final
  const calc_product_price = (e, element) => {
    //definir variables para luego compleatar los campos en pricebox
    let item_name;
    let cost_price;
    let pric_35;
    let price_40;
    let price_35_uni;
    let price_40_uni;
    let product_id;
    let units;

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
    $box_item_units.textContent = units;
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
  $show_prices_box.innerHTML = `<div id="showbox" class="box">
  <p>
      <span class="item" contenteditable id="item"></span>
  </p>

  <p class="units">
      <span>unidades: </span>
      <span style="color:blue;" contenteditable id="unidades" ></span>
  </p> 

  <p class="costo">
      <span>precio costo: $  </span>
      <span class="value" id="precioCosto"></span>
  </p>

  <p class="no-unit-price">
      <span>.precio 35%: $</span>
      <span contenteditable class="value" id="precio35"> </span>
  </p>

  <p class="no-unit-price">
      <span>.precio 40%: $</span>
      <span contenteditable class="value" id="precio40"></span>
  </p>

  <p class="unit-price">
      <span>unidad 35%: $</span>
      <span contenteditable class="value" id="precio35Uni"></span>
  </p>

  <p class="unit-price">
      <span>unidad 40%: $</span>
      <span contenteditable class="value" id="precio40Uni"></span>
  </p>

  <p class="code">
      <span>codigo: </span>
      <span class="value" id="codigo"></span>
  </p>

  <button class="copiar copiar-boton">copiar uni</button>
  <button class="copiarind copiar-boton">copiar ind</button>
  <button class="cambiar-lado copiar-boton">cambiar lado</button>

</div>;

<style>
  .box{
      box-shadow:1px 1px 5px 0px black;
      font-weight:700;
      position:fixed;
      bottom:0;
      max-width:25vw;
      background-color:rgb(150, 150, 150);
      font-size:16px;
  }

  .item{
    background-color:rgb(200, 200, 200);
    padding:0.5em;
    font-size:0.75em;
  }

  .units{
      padding:0.5em;
      background-color:rgb(175, 175, 175);
      color:#000;
      font-size: 0.75em;
  }

  .costo{
    padding:0.5em;
    font-size: 1em;
  }

  .no-unit-price{
    padding:0 0.5em;
    font-size: 1em;
    color:lightgreen;
  }
  .unit-price{
    padding:0 0.5em;
    font-size: 1em;
    color:lightblue;
  }
  
  .code{
    color:#000;
    padding:0.75em;
    font-size: 0.75em;
  }

  .copiar-boton{
    border-radius:4px;
    margin:0.5em;
    border:none;
    outline:none;
    background-color: #fff;
    color:#000;
    font-size: 0.75em;
    cursor: pointer;
  }

  .copiar-boton:hover{
    background-color: #000;
    color: #fff;
  }

  .cambiar-lado{
    background-color:rgb(190, 190, 190);
  }

  .derecha{
    right:0;
  }
  

</style>`;

  //agregar caja a dom
  document.body.appendChild($show_prices_box);

  //objeto con elementos contenedores de los precios finales en la box
  let $box_container = document.getElementById("showbox");
  let $box_item_name = document.getElementById("item");
  let $box_item_units = document.getElementById("unidades");
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
    $calc_price_button.textContent = "calcular";

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
      let id = $box_product_id.textContent;
      let name = $box_item_name.textContent;
      let price_35 = $box_price_35.textContent;
      let price_40_uni = $box_price_40_uni.textContent;
      let units = $box_item_units.textContent;

      let to_copy = `${id}${next}${name.trim()}${next}${units}${next}${price_35}${next}${price_40_uni}`;
      navigator.clipboard.writeText(to_copy);
    }

    if (e.target.classList.contains("copiarind")) {
      let id = $box_product_id.textContent;
      let name = $box_item_name.textContent;
      let price_40 = $box_price_40.textContent;
      let price_40_uni = price_40;
      let units = $box_item_units.textContent;

      let to_copy = `${id}${next}${name.trim()}${next}${units}${next}${price_40}${next}${price_40_uni}`;
      navigator.clipboard.writeText(to_copy);
    }

    if (e.target.classList.contains("cambiar-lado")) {
      $box_container.classList.toggle("derecha");
    }
  });
}

// let $box_item_name = document.getElementById("item");
//   let $box_item_name = document.getElementById("unidades");
//   let $box_cost_price = document.getElementById("precioCosto");
//   let $box_price_35 = document.getElementById("precio35");
//   let $box_price_40 = document.getElementById("precio40");
//   let $box_price_35_uni = document.getElementById("precio35Uni");
//   let $box_price_40_uni = document.getElementById("precio40Uni");
//   let $box_product_id = document.getElementById("codigo");

function closeIt() {
  for (let product of $on_page_products) {
    $calc_price_button = product.querySelector(".boton-calcular");
    $uni_amount_input = product.querySelector(".cant--input");

    product.removeChild($calc_price_button);
    product.removeChild($uni_amount_input);
  }
}
window.onbeforeunload = closeIt;

Main();
