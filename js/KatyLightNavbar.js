class KatyLightNavbar {
  constructor(params) {
    this.target=params.target;
    this.target.classList.add('KatyLight-navbar');
    this.index=0;
    this.nodeList=[];
    this.dataList=params.dataList;
    this.chooseActive=params.choose;
    this.target.addEventListener('choose',   (event)=> {
      this.index=event.detail.index;
      this.chooseActive(event.detail);
    });
    this.line =document.createElement('div');
    this.line.style.width='0';
    this.target.append(this.line);
    this.line .classList.add('line');
    for(let i=0;i<this.dataList.length;i++){
      let obj=document.createElement('div');
      obj.dataset.key=this.dataList[i].key;
      obj.dataset.index=i;
      obj.innerText=this.dataList[i].label;
      obj.classList.add('item');
      obj.onclick=  (ev)=>{
        this.go(ev)
      }
      // obj.setAttribute('onclick','go(event)')
      this.target.append(obj);
      this.nodeList.push(obj);
    }
    setTimeout(()=>{
      this.line.style.left = this.nodeList[0].offsetLeft + 'px';
      this.line.style.top = ( this.nodeList[0].offsetTop +  this.nodeList[0].clientHeight) + 'px';
      this.line.style.width = this.nodeList[0].clientWidth + 'px';
    },1)
  }
  go(e) {
    this.line.style.left = e.target.offsetLeft + 'px';
    this.line.style.top = (e.target.offsetTop + e.target.clientHeight) + 'px';
    this.line.style.width = e.target.clientWidth + 'px';
    this.doEvent({
      value:e.target.dataset.key,
      index:parseInt(e.target.dataset.index),
      label:e.target.innerText,
    })
  }
  doEvent(data){
     if (this.target.dispatchEvent) {
      this.target.dispatchEvent(new CustomEvent('choose', {
        detail:{
          value:data.value,
          index:data.index,
          label:data.label,
        }
      }));
    } else {
      this.target.fireEvent(new CustomEvent('choose', {
        detail:{
          value:data.value,
          index:data.index,
          label:data.label,
        }
      }));
    }
  }
  choose(index){
    this.line.style.left =this.nodeList[index].offsetLeft + 'px';
    this.line.style.top = (this.nodeList[index].offsetTop + this.nodeList[index].clientHeight) + 'px';
    this.line.style.width = this.nodeList[index].clientWidth + 'px';
    this.doEvent({
      value:this.nodeList[index].dataset.key,
      index:parseInt(this.nodeList[index].dataset.index),
      label:this.nodeList[index].innerText,
    })
  }
  visible(r){
    if(r){
      this.target.style.display='block'
    }else{
      this.target.style.display='none'

    }
  }
}
