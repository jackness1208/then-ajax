import './demo.scss';

const wDemo = ():void => {
  const orgClass = 'demo-circlebox__img';
  const logoEl = document.querySelector(`.${orgClass}`);
  let padding:number = 0;
  const runner = () => {
    const current = ++padding % 4;
    if (logoEl) {
      logoEl.className = `${orgClass} demo-circlebox__img--type${current}`;
    }
  };

  setInterval(runner, 1000);
  runner();
  
  console.log('hello demo');
};
export default wDemo;