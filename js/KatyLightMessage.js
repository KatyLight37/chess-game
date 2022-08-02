class KatyLightMessage{
  constructor(param) {
    this.box=param.box;
    this.box.classList.add('KatyLight-message-box')

  }
  info (txt){
    this.base('INFO',txt);
  }
  warn (txt){
    this.base('WARN',txt);
  }
  success (txt){
    this.base('SUCCESS',txt);
  }
  error (txt){
    this.base('ERROR',txt);
  }
  primary (txt){
    this.base('PRIMARY',txt);
  }
  yellow (txt){
    this.base('YELLOW',txt);
  }
  base (type,txt){
    let div = document.createElement('div');
    div.classList.add('item');
    switch (type){
      case "WARN":
        div.classList.add('warn');
        break;
      case "INFO":
        div.classList.add('info');

        break;
      case "SUCCESS":
        div.classList.add('success');

        break;
      case "ERROR":
        div.classList.add('error');

        break;
      case "PRIMARY":
        div.classList.add('primary');

        break;
        case "YELLOW":
        div.classList.add('yellow');

        break;
    }
    div.innerText = txt;
    this.box.append(div);
    div.classList.add('show');
    setTimeout(() => {
      div.classList.remove('show');
      div.classList.add('hide');
      setTimeout(() => {
        div.remove();
      }, 1500);
    }, 3000);
  }
}
