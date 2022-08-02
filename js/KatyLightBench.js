class KatyLightBench {
  constructor(param) {
    this.target = null
    this.benchInfo = param.benchInfo
    this.box = document.getElementById(param.source)
    this.bench = document.getElementById(param.target)
    this.rightButton = false
    let d = document.createElement('div')
    d.classList.add('move')
    this.bench.append(d)
    this.item = d
    this.box.classList.add('kl-workbench-box')
    this.bench.classList.add('kl-workbench')
    this.preCompose = param.preCompose
//这里不要用深拷贝
    this.data = param.data
    /*let ac = JSON.parse(JSON.stringify(param.data))
    for (let i = 0; i < ac.length; i++) {
      this.data.push(ac[i])
    }*/
    this.isDrag = false
    this.beginItemZ = this.beginItem.bind(this)
    this.endItemZ = this.endItem.bind(this)
    this.beginChangeZ = this.beginChange.bind(this)
    this.endChangeZ = this.endChange.bind(this)
    this.scrollEventZ = this.scrollEvent.bind(this)
    this.moveZ = this.move.bind(this)
    this.scrollEventCZ = this.scrollEventC.bind(this)
    this.moveCZ = this.moveC.bind(this)
    this.delItemZ = this.delItem.bind(this)
    for (let i = 0; i < this.data.length; i++) {
      let div = document.createElement('div')
      div.classList.add('item')
      div.dataset.index = i.toString()
      let txt = document.createElement('div')
      txt.classList.add('txt')
      txt.innerText = this.data[i].name
      div.append(txt)
      let quantity = document.createElement('div')
      quantity.classList.add('quantity')
      quantity.innerText = this.data[i].quantity || 1
      div.append(quantity)
      this.box.append(div)
      div.addEventListener('mousedown', this.beginItemZ)
      div.addEventListener('mouseup', this.endItemZ)
    }
    this.nodeList = this.box.querySelectorAll('.item')//静态nodeList 与array不同

    let sl = param.sl || [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
    this.benchData = new Map()
    this.itemList = []
    for (let i = 0; i < sl.length; i++) {
      let row = document.createElement('div')
      row.classList.add('row')
      for (let j = 0; j < sl[i].length; j++) {
        let div = document.createElement('div')
        let z = i * 3 + j
        div.dataset.index = z.toString()
        switch (sl[i][j]) {
          case 0:
            div.classList.add('empty')
            break
          case 1:
            div.classList.add('item')
            let txt = document.createElement('div')
            txt.classList.add('txt')
            div.append(txt)
            let quantity = document.createElement('div')
            quantity.classList.add('quantity')
            div.append(quantity)
            this.itemList.push(div)

            break
          case 2:
            div.classList.add('treasure')
            break
        }
        row.append(div)
      }
      this.bench.append(row)
    }
    this.kIndex = -1
  }

  kill() {
    this.nodeList = this.box.querySelectorAll('.item')//静态nodeList 与array不同
    this.nodeList.forEach(item => {
      item.removeEventListener('mousedown', this.beginItemZ)
      item.removeEventListener('mouseup', this.endItemZ)
      item.remove()
    })
    document.removeEventListener('mousemove', this.moveZ)
    document.removeEventListener('scroll', this.scrollEventZ)
    this.box.remove()
  }

  beginChange(e) {
    let index
    if (e.target.dataset.index) {
      index = parseInt(e.target.dataset.index)
    } else {
      index = parseInt(e.target.parentElement.dataset.index)
    }
    this.rightButton = event.button !== 0
    this.item.innerText = this.benchData.get(index).name
    this.openMoveC(true)
    this.qIndex = index
    this.item.classList.add('drag')
    this.cIndex = parseInt(e.target.dataset.index)
    this.item.style.left = e.clientX - 35 + 'px'
    this.item.style.top = e.clientY - 35 + 'px'
  }

  endChange(e) {
    this.openMoveC(false)
    this.item.classList.remove('drag')
    this.item.style.left = 0
    this.item.style.top = 0
    this.isDrag = false
    let rect = this.bench.getBoundingClientRect()
    if (e.x < rect.left || e.x > rect.right || e.y < rect.top || e.y > rect.bottom) {

      let div = document.createElement('div')
      div.classList.add('item')
      div.dataset.index = (this.data.length - 1).toString()
      let txt = document.createElement('div')
      txt.classList.add('txt')
      txt.innerText = this.benchData.get(this.qIndex).name
      div.append(txt)
      let quantity = document.createElement('div')
      quantity.classList.add('quantity')
      quantity.innerText = this.benchData.get(this.qIndex).quantity || 1
      div.append(quantity)
      this.box.append(div)
      div.addEventListener('mousedown', this.beginItemZ)
      div.addEventListener('mouseup', this.endItemZ)
      this.data.push(this.benchData.get(this.qIndex))
      this.itemList[this.qIndex].classList.remove('has')
      this.itemList[this.qIndex].querySelector('.quantity').innerText = ''
      this.itemList[this.qIndex].querySelector('.txt').innerText = ''
      this.itemList[this.qIndex].removeEventListener('mousedown', this.beginChangeZ)
      this.benchData.delete(this.qIndex)
      let t = this.preCompose()
      this.benchInfo.innerText = t.name
    } else {
      if (this.kIndex !== -1 && this.qIndex !== this.kIndex) {
        this.itemList[this.kIndex].classList.remove('hover')
        if (this.rightButton) {

          let c = this.benchData.get(this.qIndex).quantity || 1
          if (c > 1) {
            console.log('一般')
            this.substitutionItem2(this.qIndex, this.kIndex)
          } else {
            this.substitutionItem(this.qIndex, this.kIndex)
          }

        } else {
          this.substitutionItem(this.qIndex, this.kIndex)

        }
      }

    }
  }

  rebuild(param) {
    if (param.data) {
      this.nodeList = this.box.querySelectorAll('.item')//静态nodeList 与array不同
      this.endComposeBench()
      this.data = []
      let ac = JSON.parse(JSON.stringify(param.data))
      for (let i = 0; i < ac.length; i++) {
        this.data.push(ac[i])
      }
      this.target = null
      this.nodeList.forEach(item => {
        item.removeEventListener('mousedown', this.beginItemZ)
        item.removeEventListener('mouseup', this.endItemZ)
        item.remove()
      })
      document.removeEventListener('mousemove', this.moveZ)
      document.removeEventListener('scroll', this.scrollEventZ)
      for (let i = 0; i < this.data.length; i++) {
        let div = document.createElement('div')
        div.classList.add('item')
        div.dataset.index = i.toString()
        let txt = document.createElement('div')
        txt.classList.add('txt')
        txt.innerText = this.data[i].name
        div.append(txt)
        let quantity = document.createElement('div')
        quantity.classList.add('quantity')
        quantity.innerText = this.data[i].quantity || 1
        div.append(quantity)
        this.box.append(div)
        div.addEventListener('mousedown', this.beginItemZ)
        div.addEventListener('mouseup', this.endItemZ)
      }
    }
  }

  putItem(o) {

    this.data.push(o)
    let div = document.createElement('div')
    div.classList.add('item')
    div.dataset.index = (this.data.length - 1).toString()
    let txt = document.createElement('div')
    txt.classList.add('txt')
    txt.innerText = o.name
    div.append(txt)
    let quantity = document.createElement('div')
    quantity.classList.add('quantity')
    quantity.innerText = o.quantity || 1
    div.append(quantity)
    this.box.append(div)
    div.addEventListener('mousedown', this.beginItemZ)
    div.addEventListener('mouseup', this.endItemZ)
  }

  beginItem(e) {
    if (e.target.dataset.index) {
      this.target = e.target
      this.cIndex = parseInt(e.target.dataset.index)

    } else {
      this.target = e.target.parentElement
      this.cIndex = parseInt(e.target.parentElement.dataset.index)

    }
    this.isDrag = true
    this.target.classList.add('drag')

    this.target.style.left = e.clientX - 35 + 'px'
    this.target.style.top = e.clientY - 35 + 'px'
    this.openMove(true)
  }

  endComposeBench() {
    console.log(this.benchData)
    this.benchData.forEach((v,k)=>{
      console.log(k)
      let t=this.benchData.get(k).quantity||1;
      if(t<2){
        this.itemList[k].classList.remove('has')
        this.itemList[k].querySelector('.quantity').innerText = ''
        this.itemList[k].querySelector('.txt').innerText = ''
        this.benchData.delete(k)
      }else{
        this.benchData.get(k).quantity--;
        this.itemList[k].querySelector('.quantity').innerText = this.benchData.get(k).quantity.toString();
      }
    })
    let t = this.preCompose()
    this.benchInfo.innerText = t.name




  }

  clearBench() {
    this.itemList.forEach(item => {
      item.classList.remove('has')
      item.querySelector('.quantity').innerText = ''
      item.querySelector('.txt').innerText = ''

    })

    this.benchData.forEach((v, k) => {
      let o = this.benchData.get(k)
      this.putItem(o)
      this.benchData.delete(k)
    })

  }

  move(e) {
    this.target.style.left = e.x - 35 + 'px'
    this.target.style.top = e.y - 35 + 'px'
    let rect = this.bench.getBoundingClientRect()
    if ((
      e.x > rect.left
      && e.x < rect.right
      && e.y > rect.top
      && e.y < rect.bottom)
    ) {

      for (let i = 0; i < this.itemList.length; i++) {
        if (
          !this.benchData.has(i) &&
          e.x - rect.left > this.itemList[i].offsetLeft
          && e.x - rect.left < this.itemList[i].offsetLeft + this.itemList[i].offsetWidth
          && e.y - rect.top > this.itemList[i].offsetTop
          && e.y - rect.top < this.itemList[i].offsetTop + this.itemList[i].offsetHeight
        ) {

          if (this.kIndex !== i) {
            if (this.kIndex !== -1) {
              this.itemList[this.kIndex].classList.remove('hover')
            }
            this.itemList[i].classList.add('hover')
            this.kIndex = i
          }

          return
        }
      }

    }
    if (this.kIndex !== -1) {
      this.itemList[this.kIndex].classList.remove('hover')
      this.kIndex = -1
    }

  }

  moveC(e) {
    this.item.style.left = e.x - 35 + 'px'
    this.item.style.top = e.y - 35 + 'px'
    let rect = this.bench.getBoundingClientRect()
    if ((
      e.x > rect.left
      && e.x < rect.right
      && e.y > rect.top
      && e.y < rect.bottom)
    ) {
      for (let i = 0; i < this.itemList.length; i++) {
        if (
          !this.benchData.has(i) &&
          e.x - rect.left > this.itemList[i].offsetLeft
          && e.x - rect.left < this.itemList[i].offsetLeft + this.itemList[i].offsetWidth
          && e.y - rect.top > this.itemList[i].offsetTop
          && e.y - rect.top < this.itemList[i].offsetTop + this.itemList[i].offsetHeight
        ) {

          if (this.kIndex !== i) {
            if (this.kIndex !== -1) {
              this.itemList[this.kIndex].classList.remove('hover')
            }
            this.itemList[i].classList.add('hover')
            this.kIndex = i
          }

          return
        }

      }
    }
    if (this.kIndex !== -1) {
      this.itemList[this.kIndex].classList.remove('hover')
      this.kIndex = -1
    }

  }

  sortItem(z) {
    let dd, ac = []
    dd = new Map()
    for (let i = 0; i < this.data.length; i++) {
      if (dd.has(this.data[i].id)) {
        dd.get(this.data[i].id).quantity += this.data[i].quantity || 1
      } else {
        dd.set(this.data[i].id, { ...this.data[i], quantity: this.data[i].quantity || 1 })
      }
    }
    dd.forEach((v, k) => {
      ac.push(v)
    })
    switch (z) {
      case 2:
        ac.sort(function(a, b) {
          return b.grade - a.grade
        })
        break
      case 3:
        ac.sort(function(a, b) {
          return b.quantity - a.quantity
        })
        break
      default:
        break
    }
    this.data = ac
    this.nodeList = this.box.querySelectorAll('.item')
    for (let i = 0; i < this.data.length; i++) {
      this.nodeList[i].querySelector('.txt').innerText = this.data[i].name
      this.nodeList[i].querySelector('.quantity').innerText = this.data[i].quantity
    }
    let k = this.data.length
    for (let i = k; i < this.nodeList.length; i++) {
      this.nodeList[i].remove()
    }
    return this.data;//重赋值
  }

  openMove(t) {
    if (t) {
      document.addEventListener('scroll', this.scrollEventZ)
      document.addEventListener('mousemove', this.moveZ)
    } else {
      document.removeEventListener('mousemove', this.moveZ)
      document.removeEventListener('scroll', this.scrollEventZ)
    }
  }

  openMoveC(t) {
    if (t) {
      document.addEventListener('mouseup', this.endChangeZ)
      document.addEventListener('scroll', this.scrollEventCZ)
      document.addEventListener('mousemove', this.moveCZ)
    } else {
      document.removeEventListener('mouseup', this.endChangeZ)
      document.removeEventListener('mousemove', this.moveCZ)
      document.removeEventListener('scroll', this.scrollEventCZ)
    }
  }

  delItem(e) {
    let index = parseInt(e.target.parentElement.dataset.index)
    this.data.push(JSON.parse(JSON.stringify(this.benchData.get(index))))
    let div = document.createElement('div')
    div.classList.add('item')
    let i = this.data.length - 1
    div.dataset.index = i.toString()
    div.innerText = this.data[i].name
    this.box.append(div)
    div.addEventListener('mousedown', this.beginItemZ)
    div.addEventListener('mouseup', this.endItemZ)
    this.itemList[index].classList.remove('has')
    this.itemList[index].querySelector('.quantity').innerText = ''
    this.itemList[index].querySelector('.txt').innerText = ''
    this.benchData.delete(index)
    // this.itemList[index].querySelector('.del').removeEventListener('click', this.delItemZ)
    this.itemList[index].removeEventListener('mousedown', this.beginChangeZ)

  }

  delItem2(index) {
    this.data.push(this.benchData.get(index))
    let div = document.createElement('div')
    div.classList.add('item')
    let i = this.data.length - 1
    div.dataset.index = i.toString()
    let txt = document.createElement('div')
    txt.classList.add('txt')
    txt.innerText = this.data[i].name
    div.append(txt)
    let quantity = document.createElement('div')
    quantity.classList.add('quantity')
    quantity.innerText = this.data[i].quantity || 1
    div.append(quantity)
    this.box.append(div)

    div.addEventListener('mousedown', this.beginItemZ)
    div.addEventListener('mouseup', this.endItemZ)
    this.itemList[index].classList.remove('has')
    this.itemList[index].querySelector('.quantity').innerText = ''
    this.itemList[index].querySelector('.txt').innerText = ''
    // this.itemList[index].querySelector('.del').removeEventListener('click', this.delItemZ)
    this.itemList[index].removeEventListener('mousedown', this.beginChangeZ)
    this.benchData.delete(index)
  }

  substitutionItem(a, b) {
    //a->b
    this.itemList[a].classList.remove('has')
    this.itemList[a].querySelector('.quantity').innerText = ''
    this.itemList[a].querySelector('.txt').innerText = ''
    this.benchData.set(b, this.benchData.get(a))
    // this.itemList[a].querySelector('.del').removeEventListener('click', this.delItemZ)
    this.itemList[a].removeEventListener('mousedown', this.beginChangeZ)
    this.benchData.delete(a)
    this.itemList[b].classList.add('has')
    this.itemList[b].querySelector('.quantity').innerText = this.benchData.get(this.kIndex).quantity || 1
    this.itemList[b].querySelector('.txt').innerText = this.benchData.get(b).name
    // this.itemList[b].querySelector('.del').addEventListener('click', this.delItemZ)
    this.itemList[b].addEventListener('mousedown', this.beginChangeZ)
    let t = this.preCompose()
    this.benchInfo.innerText = t.name
    console.log(this.benchData)

  }

  substitutionItem2(a, b) {
    let count = Math.floor(this.benchData.get(a).quantity / 2)
    this.benchData.get(a).quantity -= count
    this.itemList[a].querySelector('.quantity').innerText = this.benchData.get(a).quantity.toString()
    this.benchData.set(b, JSON.parse(JSON.stringify(this.benchData.get(a))))
    this.benchData.get(b).quantity = count
    this.itemList[b].classList.add('has')
    this.itemList[b].querySelector('.quantity').innerText = this.benchData.get(this.kIndex).quantity || 1
    this.itemList[b].querySelector('.txt').innerText = this.benchData.get(b).name
    this.itemList[b].addEventListener('mousedown', this.beginChangeZ)
    let t = this.preCompose()
    this.benchInfo.innerText = t.name
    console.log(this.benchData)

  }

  endItem(e) {
    if (e.target.dataset.index) {
      this.target = e.target
      this.cIndex = parseInt(e.target.dataset.index)

    } else {
      this.target = e.target.parentElement
      this.cIndex = parseInt(e.target.parentElement.dataset.index)

    }
    this.openMove(false)

    this.target.classList.remove('drag')
    this.target.style.left = 0
    this.target.style.top = 0
    this.isDrag = false
    let rect = this.bench.getBoundingClientRect()
    if (e.x < rect.left || e.x > rect.right || e.y < rect.top || e.y > rect.bottom) {

    } else {
      if (this.kIndex !== -1) {
        this.nodeList = this.box.querySelectorAll('.item')
        this.benchData.set(this.kIndex, JSON.parse(JSON.stringify(this.data[this.cIndex])))
        console.log(this.benchData)
        this.itemList[this.kIndex].querySelector('.txt').innerText = this.data[this.cIndex].name
        this.itemList[this.kIndex].dataset.index = this.kIndex
        this.itemList[this.kIndex].classList.add('has')
        this.itemList[this.kIndex].querySelector('.quantity').innerText = this.benchData.get(this.kIndex).quantity || 1
        this.itemList[this.kIndex].addEventListener('mousedown', this.beginChangeZ)
        // this.itemList[this.kIndex].querySelector('.del').addEventListener('click', this.delItemZ)
        this.itemList[this.kIndex].dataset.index = this.kIndex.toString()
        this.data.splice(this.cIndex, 1)
        this.nodeList[this.cIndex].removeEventListener('mousedown', this.beginItemZ)
        this.nodeList[this.cIndex].removeEventListener('mouseup', this.endItemZ)
        this.nodeList[this.cIndex].remove()
        this.itemList[this.kIndex].classList.remove('hover')
        this.nodeList = this.box.querySelectorAll('.item')//静态nodeList 与array不同

        for (let i = 0; i < this.nodeList.length; i++) {
          this.nodeList[i].dataset.index = i.toString()
        }

        let t = this.preCompose()

        this.benchInfo.innerText = t.name
      }

    }
  }

  itemKill(e) {

  }

  scrollEvent() {
    this.openMove(false)
    this.target.classList.remove('drag')
    // this.target.dataset.index = this.nodeList.length.toString()
    this.isDrag = false
  }

  scrollEventC() {
    this.openMove(false)
    this.item.classList.remove('drag')
    this.isDrag = false
  }
}
