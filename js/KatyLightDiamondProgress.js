class  KatyLightDiamondsProgress {
  //设置参数
  constructor(option) {
    this.total = option.total || 12;
    this.value = option.value || 6;
    this.master = option.master;
    this.totalWidth = option.master.clientWidth;
    this.master.classList.add('KatyLight-diamond-progress');
    if (((this.total - 1) * 56 + 16) > this.totalWidth) {
      let a=Math.floor((this.totalWidth - 32) / (this.total - 1));
      this.spacingZ = a > 17 ?a: 17;
      this.spacing = a- 16;
    }else{
      this.spacing = 40;
      this.spacingZ = 56;
    }

    this.domCreate();
  }
  setTotal(val) {
    if(this.tt){
      clearInterval(this.tt);
      this.tt=null;
    }
    if(this.tt2){
      clearTimeout(this.tt2);
      this.tt2=null;
    }
    this.total = val;
    this.domCreate();

  }
  setValue(val) {
    val = val < 0 ? 0 : val;
    val = val < this.total ? val : this.total;
    if(this.tt){
      clearInterval(this.tt);
      this.tt=null;
    }
    if(this.tt2){
      clearTimeout(this.tt2);
      this.tt2=null;
    }
    if (this.value < val) {
      this.plus(val);
    }
    if (this.value > val) {
      this.cut(val);
    }
  }
  cut(val) {
    let index = this.value;
    this.value = val;
    let kf=index-val;
    let mm=Math.floor(100/kf);
    this.tt = setInterval(() => {
      index--;
      if (!(index < val)) {
        this.dotList[index].classList.remove('ac');
      } else {
        clearInterval(this.tt);
      }
      if (index === 0) {
        clearInterval(this.tt);
      }
    }, mm);
    this.tt2 = setTimeout(()=>{
      if (this.value === 0) {
        this.line.style.width = 0 + 'px';
      }else{
        this.line.style.width = ((val-1) * this.spacingZ + 16) + 'px';
      }
      clearTimeout(this.tt2);
    },mm)
  }
  plus(val) {
    let dotList = this.master.querySelectorAll('.dot');
    let kf=val- this.value;
    let index = this.value - 1;
    this.value = val;

    let mm=Math.floor(100/kf);
    this. tt = setInterval(() => {
      index++;
      if (index < val) {
        dotList[index].classList.add('ac');
      } else {
        clearTimeout(this.tt);
      }

    }, mm);
    this.line.style.width = ((val-1) * this.spacingZ + 16) + 'px';



  }


  domCreate() {

    this.master.innerHTML = `<div class="l"><div class="i"></div></div>`;
    for (let i = 0; i < this.total; i++) {
      let div = document.createElement('div');
      div.classList.add('dot');

      if (i !== 0) {
        div.style.marginLeft = this.spacing + 'px';

      }
      if (i < this.value) {
        div.classList.add('ac');
      }
      this.master.appendChild(div);
    }
    this.dotList = this.master.querySelectorAll('.dot');
    let af = ((this.value - 1) * this.spacingZ + 16) + 'px';
    console.log(this.value)
    console.log(af)
    this.master.querySelectorAll('.l')[0].style.width=((this.total - 1) * this.spacingZ + 16) + 'px';
    this.line = this.master.querySelectorAll('.i')[0];
    this.line.style.width = af;
  }


}

function KatyLightDiamondsProgressCreate(option) {
  return new KatyLightDiamondsProgress(option)
}
