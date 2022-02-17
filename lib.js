function len(x) {
  if (typeof x == 'number') {
    return x.toString().length
  }
  if (typeof x == 'object') {
    return Object.entries(x).length
  }
  else {
    return x.length
  }
}

function newEl(t, c, p) {
  const e = document.createElement(t)
  e.textContent = c
  if (p.clss) e.classList.add(p.clss)
  if (p.attrs) {
    for (let i = 0; i < p.attrs.length;) {
      e.setAttribute(p.attrs[i], p.attrs[i + 1])
      i = i + 2
    }
  }
  if (p.parent) p.parent.appendChild(e)
  else return e
}

function log(text, ...vals) {
  if (typeof text != 'string') {
    console.log(text, ...vals)
    return 0
  }
  let cont = 0
  if (vals === undefined) vals = []
  for (let i = 0; i < text.length; i++) {
    if (text[i] == '{' && text[i + 1] == '}') {
      text = text.replace('{}', vals[cont])
      cont++
    }
  }
  console.log(text)
}

function logl(text, vals) {
  let cont = 0
  if (vals === undefined) vals = []
  for (let i = 0; i < text.length; i++) {
    if (text[i] == '{' && text[i + 1] == '}') {
      text = text.replace('{}', vals[cont])
      cont++
    }
  }
  console.log(text);
}

function exist(id, cb,parent) {
  if(!parent) parent = document

  if (parent.querySelector(id)) {
    if (cb) return cb(true)
    else return true
  }
  else{
    if (cb) return cb(false)
    else return false
  }
}

function find(id, parent) {
  if (parent) return parent.querySelector(id)
  else return document.querySelector(id)
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

function readDataAtt(x, attr) {
  return x.dataset[attr]
}

function targetClass(e) {
  return e.target.className[0]
}

function targetHas(e, clss) {
  if (e.target.classList.contains(clss)) return true
  else return false
}

function getJSON(url, cb) {
  let data = fetch(url)
    .then(res => res.json())
    .then(res => cb(null, res))
    .catch(err => cb(err, null))
}

function supported(api, cb) {
  if (api in navigator) {
    if (cb) cb(true)
    return true
  } else {
    if (cb) cb(false)
    return false
  }
}

function getPos(cb, ops) {
  if (!('geolocation' in navigator)) return cb('not supported', null)
  if (!ops) ops = {}
  navigator.geolocation.getCurrentPosition(pos => {
    let crs = pos.coords
    return cb(null, {
      altitude: crs.altitude,
      speed: crs.speed,
      accuracy: crs.accuracy,
      lat: crs.latitude,
      long: crs.longitude,
      timestamp: pos.timestamp
    })
  }, (err) => cb(err, null), ops)
}

function posWatch(cb, options) {
  if (!('geolocation' in navigator)) return 0
  if (!options) options = {}
  return navigator.geolocation.watchPosition(pos => {
    let crs = pos.coords
    return cb({
      altitude: crs.altitude,
      speed: crs.speed,
      accuracy: crs.accuracy,
      lat: crs.latitude,
      long: crs.longitude,
      timestamp: pos.timestamp
    })
  }, (err) => cb(err, null), ops)
}

function posStopWatch(id) {
  navigator.geolocation.clearWatch(id);
}

function callFunc(fun, ...args) {
  window[fun](...args)
}

function redirect(to) {
  window.location.replace(to)
}

function cbcopy(text) {
  navigator.clipboard.writeText(text)
    .catch(() => console.log('there was a problem'))
}

function sum(arr) {
  return arr.reduce((a, b) => a + b)
}

function sort(arr, reverse) {
  if (!reverse) reverse = false
  if (reverse === true) return arr.sort((a, b) => b - a)
  else return arr.sort((a, b) => a - b)
}

function randsort(arr) {
  return arr.sort((a, b) => Math.random() - 0.5)
}

function uniques(arr) {
  return [...new Set(arr)]
}

function notif(title, args) {
  let allowed = Notification.requestPermission()
    .then(status => status === 'granted')
    .then(status => {
      if (!status) return 0
    })

  new Notification(title, args)
}

function priceFormat(num,sym){
  num = num.toString()
  if(num.includes('.')){
    let [int,float] = num.split('.')
    let outputInt=[]
    let cont = 0
    for(let c of int.split('').reverse()){
      outputInt.unshift(c)
      if(cont === 2) {
        outputInt.unshift('.')
        cont = 0
      }
      else cont++
    } 
    if(!sym) sym = ''
    return (`${sym} ${outputInt.join('')},${float}`);
  }
  else{
    console.log(num);
  }
}
export function worker(f,msgcb){
  let w = new Worker(f)
  w.addEventListener('message',e=>msgcb(e.data),false)
  return w
}
export function activeWorker(msgcb){
  self.addEventListener('message',(e)=>msgcb(e.data))
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

//aqui lo hecho en spck

function pushAll(arr,...el){
  for(let e of el){
    arr.push(e)
  }
  return arr
}