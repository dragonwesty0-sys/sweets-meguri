const form=document.querySelector('form');
const {q,region,pref,genre}=form.elements;
const cards=[...document.querySelectorAll('article')];
const reset=document.querySelector('#reset');
const count=document.querySelector('#count');
const options=[...pref.options];
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const labels=cards.map(card=>normalize(card.textContent));
function update(){
  const words=normalize(q.value).trim().split(/\s+/).filter(Boolean);
  let found=0;
  cards.forEach((card,i)=>{
    const fits=[region,pref,genre].every(field=>!field.value||card.dataset[field.name]===field.value);
    card.hidden=!(fits&&words.every(word=>labels[i].includes(word)));
    if(!card.hidden) found++;
  });
  count.textContent=found?found+'件':'条件に一致するお店がありません';
  reset.hidden=![q,region,pref,genre].some(field=>field.value);
}
function updateOptions(){
  const selected=pref.value;
  const available=options.filter(option=>!option.value||!region.value||cards.some(card=>card.dataset.pref===option.value&&card.dataset.region===region.value));
  pref.replaceChildren(...available);
  pref.value=available.some(option=>option.value===selected)?selected:'';
}
form.addEventListener('input',event=>{if(event.target===region)updateOptions();update();});
form.addEventListener('submit',event=>event.preventDefault());
reset.addEventListener('click',()=>{form.reset();updateOptions();update();q.focus();});
form.hidden=false;
update();
