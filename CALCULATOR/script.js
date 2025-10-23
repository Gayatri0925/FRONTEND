const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.textContent === '='){
      try{ display.value = eval(display.value); }catch{ display.value='Error'; }
    } else { display.value += btn.textContent; }
  });
});
