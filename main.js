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

  //style for html container inside each prod card
  let style = `<style>.containter{width: 100%;height: 100%;background-color: aqua;}</style>`

  let UI            // containt html element of ui
  let FILTEREDVALUE //global value for input filter

  let products = getProducts()

  products.forEach( prod => {
    let promo = inPromo(prod)
    let price = getPrice(prod,promo)
    let name = getName(prod)
    let units = getUnits(name)

    let cardInfo = find('div',prod)
    cardInfo.removeChild(find('.content_bulto_unidad_kilo',cardInfo))

    //calculate final prices with default values
    let [final,finalUnit] = calculate(price,units)

    // html to each card
    let html = `
    <hr style="width:90%;"/>
      <input class="unitInput unitInputSty" id="amount" type="text" value="${units}">
      <div style="width:100%" class="font flex">
          <span contenteditable class="font price" id="final">${final}</span> 
          <span contenteditable class="font price" id="units">${finalUnit}</span>
      </div>
      <p style="width: 75%;text-align:center;" class="pointer font see_all">ver todos</p>
      <p style="width: 75%;text-align:center;" class="pointer font copy">copiar</p>
      <input class="amountRef unitInputSty" type="text" value="1">

      <style>
      .price{ background-color:rgb(225,225,225); border-radius:5px; padding:0.25em}
      .pointer{ cursor:pointer }
      .font{ font-size: 1.3em; }
      .see_all{ height:23px; width:75%; background-color: rgb(255, 14, 14); color:white; border-radius:5px; }
      .copy{ width:75%; height:20px; outline: solid 3px rgb(255, 14, 14); border-radius:5px; }
      .unitInputSty{width: 90%; border-radius:5px; text-align:center;}
      .wh100{ width: 100%; height: 100%; }
      .flex{ display: flex; justify-content: space-between; align-items: center; }
      .mid{ width: 50%; height: 100%; }
      </style>`

    // create element to insert in card
    let element = newEl('div',html+style,{
      attrs:["class","wh100 flex","style","padding-top:1em;flex-direction:column;gap:1em;"]
    })

    // modified props of cards to avoid overflow and other css bugs
    modifedProdCar(prod,promo)
    prod.children[0].appendChild(element) 
  })

  UI = addUI()          // add input to default values in dom
  setChangeEvent()      // to all inputs
  setClickEvent()       // to seeall and copy buttons


  function getProducts(){
      return Array.from(findall(".producto"));
  }

  function inPromo(prod){
    if(find('.con_promo',prod)) return true
    else return false
  }

  function getPrice(prod,promo){
    if(promo){
      return find('.con_promo',prod)
        .textContent
        .replace('$','')
        .trim()
    }
    else{
      return find('.producto_precio',prod)
        .textContent
        .replace('$','')
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
      return [`$ ${val}`, `$ ${val}`]
    }
    else {
      return [`$ ${val}`, `$ ${round(price*defaultUnit*IVA*extra1/units,4)}`]
    }
  }

  function setChangeEvent(){
    window.addEventListener('change',unitChange)
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
      let prod = parent(e.target,2)
      let price = getPrice(prod)
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
    let str = name.split('')
    let value = searchVal.split('')

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
    let names = Array.from(findall('.producto div .producto_txt'))
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
      parent(name[0],2).style.backgroundColor = `rgb(${255-range},${range},0,0.5)`
    })
  }

  function resetFilter(){
    if(FILTEREDVALUE){
    FILTEREDVALUE = null
    Array.from(findall('.producto')).forEach(el=>el.style.backgroundColor='')
  }}

  function addUI(){
    // contains the inputs for change defaults porc and seeall visualizer
    const uiHtml = `
    <span style="width: 15em;text-align:center;">filtrar</span><input style="width: 14em" class="filter"/>
    <div class="seeallcontainer">
      <div class="a1">
        <p class="header">porc.</p>
        <p>25% -> </p> <p>30% -> </p>
        <p>35% -> </p> <p>40% -> </p>
        <p>45% -> </p> <p>50% -> </p>
        <p>55% -> </p> <p>60% -> </p>
      </div>
      <div class="a2">
          <p class="header">total</p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
          <p contenteditable class="showAllTotal showallnum"></p>
      </div>
      <div class="a3">
          <p contenteditable class="header">unidah</p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
          <p contenteditable class="showAllUnit showallnum"></p>
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
      attrs:['class','ui','style','background-color:lightgray;position: fixed;bottom: 0;left: 0;padding:1em;']
    })
    return find('.ui')
  }

  function copy(){
    cbcopy(ToCopy.join('\t'))
  }

  function getCopyInfo(element){
    ToCopy = []

    let priceTotal = find('#final',element).textContent
    let priceUnit = find('#units',element).textContent
    let card = parent(element)

    let name = getName(card)
    let id = getId(card)
    let units = find('.unitInput',card).value
    let amounref = find('.amountRef',card).value

    ToCopy = pushAll(ToCopy,id,name,units,priceTotal,priceUnit,amounref)
    copy()
  }

  function setClickEvent(){
    window.addEventListener('click', e => {
      
      if(targetHas(e,'see_all')){
        let prod = parent(e.target,2)
        seeAllCalc(prod)

      }

      if(targetHas(e,'copy')){
        getCopyInfo(parent(e.target))
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
    prod.style.height = '650px'
    if(!promo) prod.style.overflowX = 'hidden'
    prod.style.marginBottom = '50px'
  }

  function seeAllCalc(prod){
    // get units and price from card input
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
      totalPrices .push( round(price*value*IVA*extra1,10) )
      unitPrices  .push( round(price*value*IVA*extra1/units,10) )
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