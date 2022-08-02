class KatyLightDragBox {
  constructor(param) {
    this.target = null
    this.box = document.getElementById(param.target)
    this.box.classList.add('kl-dropbox')
    this.data = JSON.parse(JSON.stringify(param.data))
    this.isDrag = false
    for (let i = 0; i < this.data.length; i++) {
      let div = document.createElement('div')
      div.classList.add('item')
      div.dataset.index = i.toString()
      div.innerText = this.data[i].name
      this.box.append(div)
      this.beginItemZ = this.beginItem.bind(this)
      this.endItemZ = this.endItem.bind(this)
      div.addEventListener('mousedown', this.beginItemZ)
      div.addEventListener('mouseup', this.endItemZ)
    }
    this.nodeList = this.box.querySelectorAll('.item')//nodeList 与array不同
    this.shadow = document.createElement('div')
    this.shadow.classList.add('shadow')
    this.box.append(this.shadow)
  }

  beginItem(e) {
    this.target = e.target
    this.cIndex = parseInt(e.target.dataset.index)
    this.isDrag = true
    this.target.classList.add('drag')
    this.shadow.classList.add('drag')
    this.target.style.left = e.clientX - 35 + 'px'
    this.target.style.top = e.clientY - 35 + 'px'
    for (let i = 0; i < this.nodeList.length; i++) {
      this.nodeList[i].dataset.index = i.toString()
    }
    this.openMove(true)
  }

  move(e) {
    this.target.style.left = e.x - 35 + 'px'
    this.target.style.top = e.y - 35 + 'px'
    let rect = this.box.getBoundingClientRect()
    if ((e.x > rect.left && e.x < rect.right && e.y > rect.top && e.y < rect.bottom) && (e.x - rect.left < this.shadow.offsetLeft || e.x - rect.left > this.shadow.offsetLeft + this.shadow.offsetWidth)) {
      for (let i = 0; i < this.nodeList.length; i++) {
        if (this.nodeList[i].dataset.index !== this.cIndex.toString()) {
          if (e.x - rect.left > this.nodeList[i].offsetLeft && e.x - rect.left < this.nodeList[i].offsetLeft + this.nodeList[i].offsetWidth) {
            this.box.insertBefore(this.shadow, this.nodeList[i])
            this.sIndex = i
            return
          }
        }
      }
      if (this.cIndex < this.nodeList.length - 1) {
        this.box.append(this.shadow)
        this.sIndex = this.nodeList.length - 1
      } else {
        this.box.append(this.shadow)
        this.sIndex = this.nodeList.length - 1
      }
    }
  }

  openMove(t) {
    if (t) {
      this.scrollEventZ = this.scrollEvent.bind(this)
      this.moveZ = this.move.bind(this)
      document.addEventListener('scroll', this.scrollEventZ)
      document.addEventListener('mousemove', this.moveZ)
    } else {
      document.removeEventListener('mousemove', this.moveZ)
      document.removeEventListener('scroll', this.scrollEventZ)
    }
  }

  endItem(e) {
    this.openMove(false)
    this.target = e.target
    this.target.classList.remove('drag')
    this.shadow.classList.remove('drag')
    this.target.style.left = 0
    this.target.style.top = 0
    this.isDrag = false
    if (e.x < this.box.getBoundingClientRect().left || e.x > this.box.getBoundingClientRect().right || e.y < this.box.getBoundingClientRect().top || e.y > this.box.getBoundingClientRect().bottom) {
    } else {
      this.box.insertBefore(this.target, this.shadow)
      let o = this.data.splice(this.cIndex, 1)[0]
      if (this.cIndex < this.sIndex) {
        this.data.splice(this.sIndex - 1, 0, o)
      } else {
        this.data.splice(this.sIndex, 0, o)
      }
      this.nodeList = this.box.querySelectorAll('.item')
      for (let i = 0; i < this.nodeList.length; i++) {
        this.nodeList[i].dataset.index = i.toString()
      }
    }
  }

  scrollEvent() {
    this.openMove(false)
    this.target.classList.remove('drag')
    this.target.dataset.index = this.nodeList.length.toString()
    this.isDrag = false
  }
}
