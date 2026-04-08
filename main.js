//check for local storage default vars
let defaultTotal = localStorage.getItem('defaultTotal') || 1.4
let defaultUnit = localStorage.getItem('defaultUnit') || 1.35

function main(){
  // global value to copy
  let ToCopy = []

  //iva and others
  let IVA = localStorage.getItem('iva') || 1.21;
  let extra1 = localStorage.getItem('extra1') || 1.05
  let extra2 = 1

  //seeall actual
  let ActualSeeAllPrice = null
  let ActualSeeAllUnits = null

  //values to calc seeall
  const PorcValues = [1.25,1.3,1.35,1.4,1.45,1.5,1.55,1.6]

  let UI            // containt html element of ui
  let FILTEREDVALUE //global value for input filter

  let products = getProducts()

  products.forEach( prod => {
    let promo = inPromo(prod)
    let price = getPrice(prod,promo)
    let name = getName(prod)
    let units = getUnits(name)

    let bulto = find('.content_bulto_unidad_kilo',prod)
    if(bulto) prod.removeChild(bulto)

    //calculate final prices with default values
    let [final,finalUnit] = calculate(price,units)

    // html to each card
    let html = `
      <div class="coti-panel">
        <div class="coti-input-group">
            <span class="coti-lbl">Unidades:</span>
            <input class="unitInput coti-inp-full" id="amount" type="text" value="${units}">
        </div>

        <div class="coti-price-list">
            <div class="coti-price-row">
                <span class="coti-lbl-sm">Venta Total</span>
                <span contenteditable class="coti-val" id="final">${final}</span> 
            </div>
        </div>

        <div class="coti-price-list">
            <div class="coti-price-row highlight">
                <span class="coti-lbl-sm">Por Unidad</span>
                <span contenteditable class="coti-val" id="units">${finalUnit}</span>
            </div>
        </div>
        
        <div class="coti-actions">
            <button type="button" class="pointer coti-btn see_all">Ver todos</button>
            <button type="button" class="pointer coti-btn outline copy">Copiar</button>
        </div>
        
        <div class="coti-input-group-sm">
            <span class="coti-lbl-sm" style="margin:0;">Ref:</span>
            <input class="amountRef coti-inp-sm" type="text" value="1">
        </div>
      </div>

      <style>
      .coti-panel { background: #fdfdfd; padding: 10px; margin-top: auto; display: flex; flex-direction: column; gap: 8px; width: 100%; box-sizing: border-box; }
      .coti-input-group { display: flex; flex-direction: column; gap: 4px; width: 100%; }
      .coti-lbl { font-size: 13px; color: #555; font-weight: bold; margin: 0; }
      .coti-inp-full { width: 100%; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 6px; font-weight: bold; font-size: 14px; box-sizing: border-box; }
      .coti-price-list { display: flex; flex-direction: column; gap: 5px; width: 100%; }
      .coti-price-row { background: #f1f3f5; border-radius: 6px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e9ecef; }
      .coti-price-row.highlight { background: #e3f2fd; border: 1px solid #bbdefb; }
      .coti-price-row.highlight .coti-val { color: #1565c0; }
      .coti-lbl-sm { font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; margin: 0; }
      .coti-val { font-size: 15px; font-weight: 800; color: #333; }
      .coti-actions { display: flex; gap: 6px; width: 100%; margin-top: 2px; }
      .coti-btn { flex: 1; border: none; padding: 6px; border-radius: 4px; font-weight: bold; font-size: 12px; color: white; background: #e03131; cursor: pointer; transition: 0.2s; }
      .coti-btn:hover { background: #c92a2a; }
      .coti-btn.outline { background: transparent; color: #e03131; outline: 1px solid #e03131; }
      .coti-btn.outline:hover { background: #fff5f5; }
      .coti-input-group-sm { display: flex; justify-content: flex-end; align-items: center; width: 100%; margin-top: 2px; }
      .coti-inp-sm { width: 40px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 2px; font-size: 11px; margin-left: 5px; }
      .pointer { cursor: pointer; }
      </style>`

    // create element to insert in card
    let element = newEl('div',html,{
      attrs:["class","coti-ext-wrapper"]
    })

    // modified props of cards to avoid overflow and other css bugs
    modifedProdCar(prod,promo)
    // append inside .caja_productos (first child of .producto)
    prod.appendChild(element) 
  })

  UI = addUI()          // add input to default values in dom
  setChangeEvent()      // to all inputs
  setClickEvent()       // to seeall and copy buttons


  function getProducts(){
      // Exclude the outer wrapper; select the actual product divs
      return Array.from(findall(".caja_productos"));
  }

  function inPromo(prod){
    // New site uses .producto_precio_promo or similar; fall back gracefully
    if(find('.con_promo',prod) || find('.producto_precio_promo',prod)) return true
    else return false
  }

  function getPrice(prod,promo){
    if(promo){
      let promoEl = find('.con_promo',prod) || find('.producto_precio_promo',prod)
      return promoEl
        .textContent
        .replace('$','')
        .replace(',','.')
        .trim()
    }
    else{
      return find('.producto_precio',prod)
        .textContent
        .replace('$','')
        .replace(',','.')
        .trim()
  }}

  function getName(prod){
      let name = find('.producto_txt',prod)
      name.setAttribute('contenteditable','true')
      return name.textContent.trim()
  }

  function getId(prod){
    return find('.producto_id',prod)
    .textContent
    .replace('Código:','')
    .trim()
  }

  function getUnits(name){
      let regexp = / x\d+/g;
      let match = regexp.exec(name);
      
      if (match){
          units = take(match,-1);
          units = parseInt(units.replaceAll("x", "").trim());
      }
      else units = 1;
      return units
  }

  function calculate(price,units){
    let val = round(price*defaultTotal*IVA*extra1,100)
    
    if(units === 1 || units === '1'){
      return [`$ ${val.toLocaleString()}`, `$ ${val.toLocaleString()}`]
    }
    else {
      return [`$ ${val.toLocaleString()}`, `$ ${round(price*defaultUnit*IVA*extra1/units,4).toLocaleString()}`]
    }
  }

  function setChangeEvent(){
    window.addEventListener('change', unitChange)
  }

  function validateUnit(unit){
    let regexp = /^([0-9]+)((,)?(\.)?)([0-9]+)?$/g
    if(unit.match(regexp)) {
      return unit.replaceAll(',','.')
    }
    else return 1
  }

  function unitChange(e){
    // if input change is the default for total porcentage set the value on local storage
    if(targetHas(e,'setDefault')){
      let value = parseFloat(e.target.value)
      localStorage.setItem('defaultTotal',value)
    }
    // the same for unit input
    else if(targetHas(e,'setDefaultUnit')){
      let value = parseFloat(e.target.value)
      localStorage.setItem('defaultUnit',value)
    }

    else if(targetHas(e,'setIva')){
      let value = parseFloat(e.target.value)
      localStorage.setItem('iva',value)
    }

    else if(targetHas(e,'setExtra1')){
      let value = parseFloat(e.target.value)
      localStorage.setItem('extra1',value)
    }

    //if its the input of some product
    else if(targetHas(e,'unitInput')){
      let newUnit = validateUnit(e.target.value)
      //get info
      // e.target is .unitInput -> parent(1)=.coti-row -> parent(2)=.coti-panel -> parent(3)=.coti-ext-wrapper -> parent(4)=.caja_productos
      let prod = parent(e.target,4)
      let promo = inPromo(prod)
      let price = getPrice(prod,promo)
      // calc new prices
      let [final,unit] = calculate(price,newUnit)
      // set him in doc
      find('#final',prod).textContent = final
      find('#units',prod).textContent = unit
    }

    else if(targetHas(e,'filter')){
      let val = e.target.value.trim()

      //if theres less than 3 elements in screen or is already filtered
      if (products.length < 3 || val == FILTEREDVALUE) return
      if (val == '') return resetFilter()
      else mark(val)
    }
  }

  function search(name,searchVal){
    
    let str = name.toLowerCase().split('')
    let value = searchVal.toLowerCase().split('')

    let matches = 0

    let i = 0

    while(i<value.length){
      let index = str.indexOf(value[i])
      if(index!=-1){
        if(value[i+1]==str[index+1]){
          if(value[i+2]==str[index+2]){
            matches+=4
            str.splice(index,3)
          }
          else{
            matches+=2
            str.splice(index,2)
          }
        }
        else{
          matches+=0.5
          str.splice(index,1)
        }
      }
      //else matches--
      i++
    }
    return matches
  }

  function mark(val){
    FILTEREDVALUE = val
    let names = Array.from(findall('.caja_productos .producto_txt'))
    let matches= []
    names.forEach(name => {
      matches.push([name,search(name.textContent,val)])
    })
    matches = matches.sort((a,b) => b[1]-a[1])
    let max = matches[0][1]
    let min = take(matches,-1)[1]
    if(min<0) min = 0
    if(min == max) return resetFilter()
    matches.forEach(name=>{
      let range = scale(name[1], min, max, 0, 255)
      // name[0] is .producto_txt -> parent(1) = .caja_productos
      parent(name[0],1).style.backgroundColor = `rgb(${255-range},${range},0,0.5)`
    })
  }

  function resetFilter(){
    if(FILTEREDVALUE){
    FILTEREDVALUE = null
    Array.from(findall('.caja_productos')).forEach(el=>el.style.backgroundColor='')
  }}

  function addUI(){
    // contains the inputs for change defaults porc and seeall visualizer
    const uiHtml = `
    <span style="width: 15em;text-align:center;">filtrar</span><input style="width: 14em" class="filter"/>
    <div class="seeallcontainer">
      <div class="a1">
        <div class="header">porc.</div>
        <div>25% -> </div> <div>30% -> </div>
        <div>35% -> </div> <div>40% -> </div>
        <div>45% -> </div> <div>50% -> </div>
        <div>55% -> </div> <div>60% -> </div>
      </div>
      <div class="a2">
          <div class="header">total</div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
          <div contenteditable class="showAllTotal showallnum"></div>
      </div>
      <div class="a3">
          <div class="header">unidah</div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
          <div contenteditable class="showAllUnit showallnum"></div>
      </div>
      <div class="swiper pointer"><</div>
    </div>


    <style>
      .swiper{ background-color:gray; border-radius:3px; width:20px; text-align:center; height:100px;line-height:100px;}
      .swiped{ transform: translateX(-21em) }
      .header{ padding-bottom:1em; }
      .seeallcontainer{ font-size:1.25em; font-weight:600; display: flex; align-items:center;width: 100%; height: 100%; }
      .a1{ grid-column:0/1; padding: 1em}
      .a2{ grid-column:1/2; padding: 1em}
      .a3{ grid-column:2/3; padding: 1em}
      .showallnum{ cursor:pointer }
      .showallnum:hover{ color:red; }
      </style>
    <input value="${defaultTotal}" style="width: 8em" class="setDefault" type="text" >
    <input value="${defaultUnit}" type="text" style="width: 8em" class="setDefaultUnit">
    <br/>
    <input value="${IVA}" type="text" style="width: 8em" class="setIva">
    <input value="${extra1}" type="text" style="width: 8em" class="setExtra1">
    `
    
    newEl('div',uiHtml,{
      parent:document.body,
      attrs:['class','ui','style','background-color: #e8d9d9;position: fixed;bottom: 0.5rem;left: 0.5rem;padding:1em;border-radius: 7px;border: 1px solid #0000003d;']
    })
    return find('.ui')
  }

  function copy(){
    cbcopy(ToCopy.join('\t'))
  }

  function getCopyInfo(element){
    // element is already .caja_productos
    ToCopy = []

    let priceTotal = find('#final',element).textContent
    let priceUnit = find('#units',element).textContent

    let name = getName(element)
    let id = getId(element)
    let units = find('.unitInput',element).value
    let amounref = find('.amountRef',element).value

    ToCopy = pushAll(ToCopy,id,name,units,priceTotal,priceUnit,amounref)
    copy()
  }

  function setClickEvent(){
    window.addEventListener('click', e => {
      
      if(targetHas(e,'see_all')){
        e.preventDefault()
        e.stopPropagation()
        // e.target(.see_all) -> parent(1)=.coti-actions -> parent(2)=.coti-panel -> parent(3)=.coti-ext-wrapper -> parent(4)=.caja_productos
        let prod = parent(e.target,4)
        seeAllCalc(prod)

      }

      if(targetHas(e,'copy')){
        e.preventDefault()
        e.stopPropagation()
        // e.target(.copy) -> parent(1)=.coti-actions -> parent(2)=.coti-panel -> parent(3)=.coti-ext-wrapper -> parent(4)=.caja_productos
        getCopyInfo(parent(e.target,4))
      }

      if(targetHas(e,'swiper')){
        UI.classList.toggle('swiped')
      }

      if(targetHas(e,'showAllTotal')){
        let value = e.target.textContent

        if(ToCopy[3] === `$ ${value}` || value === '') return
        ToCopy[3] = `$ ${e.target.textContent}`
        copy()
      }

      if(targetHas(e,'showAllUnit')){
        let value = e.target.textContent

        if(ToCopy[4] === `$ ${value}` || value === '') return
        ToCopy[4] = `$ ${value}`
        copy()
      }
    })
  }

  function modifedProdCar(prod,promo){
    // prod is now .caja_productos; adjust its parent .producto too
    prod.style.height = 'auto'
    prod.style.marginBottom = '10px'
    let prodWrapper = prod.parentElement
    if(prodWrapper) {
      prodWrapper.style.height = 'auto'
      prodWrapper.style.marginBottom = '50px'
    }
  }

  function seeAllCalc(prod){
    // prod is .caja_productos
    let units = find('.unitInput',prod).value
    let price = getPrice(prod,inPromo(prod))

    //if are equal to previous seeall calc dont do it again
    if(price == ActualSeeAllPrice && units == ActualSeeAllUnits) return
    
    //else update values
    ActualSeeAllPrice = price
    ActualSeeAllUnits = units

    let totalPrices = []
    let unitPrices = []

    //for each porcentage calc the price of total and unit
    for(let value of PorcValues){
      console.log(round(price*value*IVA*extra1,10).toLocaleString());
      
      totalPrices .push( round(price*value*IVA*extra1,10).toLocaleString() )
      unitPrices  .push( round(price*value*IVA*extra1/units,10).toLocaleString() )
    }
    seeallSetValues(totalPrices,unitPrices)
  }

  function seeallSetValues(totalPrices,unitPrices){
    let totalElements = findall('.showAllTotal')
    let unitElements = findall('.showAllUnit')

    fillContent(totalElements,totalPrices)
    fillContent(unitElements,unitPrices)

    UI.classList.remove('swiped')
  }


  ////////////////////////////////////////////////////////////////////
  function find(id, parent) {
    if (parent) return parent.querySelector(id)
    else return document.querySelector(id)
  }

  function findall(id, parent) {
    if (parent) return parent.querySelectorAll(id)
    else return document.querySelectorAll(id)
  }

  function newEl(tag, cont, props) {
    if(!props) props = {}
    const e = document.createElement(tag)
    e.innerHTML = cont
    if (props.clss) e.classList.add(props.clss)
    if (props.attrs) {
      for (let i = 0; i < props.attrs.length;) {
        e.setAttribute(props.attrs[i], props.attrs[i + 1])
        i = i + 2
      }
    }
    if (props.parent) props.parent.appendChild(e)
    else return e
  }
  
  function round(val,div){
    return Math.round(val * div) / div;
  }

  function parent(el, deep) {
    if (!deep) deep = 1
    while (deep > 0) {
      el = el.parentElement
      if (!el) console.log('cant find parent')
      deep--
    }
    return el
  }

  function targetHas(e, clss) {
    if (e.target.classList.contains(clss)) return true
    else return false
  }

  function fillContent (elements,content){
    for(let i in elements){
      elements[i].textContent = content[i]
    }
  };

  function take(arr,i){
    if(i<0) i = arr.length + i
    return arr[i]
  }
  
  function pushAll(arr,...el){
    for(let e of el){
      arr.push(e)
    }
    return arr
  }

  function cbcopy(text) {
    navigator.clipboard.writeText(text)
      .catch(() => console.log('no anda :('))
  }

  function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
}

if(!document.querySelector('.ui')) main()

