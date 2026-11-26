const form=document.querySelector('form');
const {q,region,pref,genre}=form.elements;
const cards=[...document.querySelectorAll('article')];
const reset=document.querySelector('#reset');
const more=document.querySelector('#more');
const pageSize=28;
let limit=pageSize;
const count=document.querySelector('#count');
const options=[...pref.options];
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const labels=cards.map(card=>normalize(card.textContent));
function update(){
  const words=normalize(q.value).trim().split(/\s+/).filter(Boolean);
  let found=0;
  cards.forEach((card,i)=>{
    const fits=[region,pref,genre].every(field=>!field.value||card.dataset[field.name]===field.value);
    const matches=fits&&words.every(word=>labels[i].includes(word));
    if(matches) found++;
    card.hidden=!matches||found>limit;
  });
  count.textContent=found?found+'件'+(found>limit?'（'+limit+'件表示）':''):'条件に一致するお店がありません';
  more.hidden=found<=limit;
  reset.hidden=![q,region,pref,genre].some(field=>field.value);
}
function updateOptions(){
  const selected=pref.value;
  const available=options.filter(option=>!option.value||!region.value||cards.some(card=>card.dataset.pref===option.value&&card.dataset.region===region.value));
  pref.replaceChildren(...available);
  pref.value=available.some(option=>option.value===selected)?selected:'';
}
form.addEventListener('input',event=>{limit=pageSize;if(event.target===region)updateOptions();update();});
form.addEventListener('submit',event=>event.preventDefault());
reset.addEventListener('click',()=>{limit=pageSize;form.reset();updateOptions();update();q.focus();});
more.addEventListener('click',()=>{
  const previous=limit;
  limit+=pageSize;
  update();
  cards.filter(card=>!card.hidden)[previous]?.querySelector('a')?.focus();
});
form.hidden=false;
update();
