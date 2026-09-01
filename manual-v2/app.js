const views=[...document.querySelectorAll('[data-view]')];
const routeLinks=[...document.querySelectorAll('[data-route]')];
const drawer=document.querySelector('#nav-drawer');
const detailSheet=document.querySelector('#detail-sheet');

function route(){
  const name=location.hash.slice(1)||'home';
  const active=views.some(view=>view.dataset.view===name)?name:'home';
  views.forEach(view=>view.hidden=view.dataset.view!==active);
  routeLinks.forEach(link=>link.classList.toggle('active',link.dataset.route===active));
  drawer.hidden=true;document.querySelector('#menu-button').setAttribute('aria-expanded','false');
}
window.addEventListener('hashchange',route);route();
document.querySelector('#menu-button').addEventListener('click',()=>{drawer.hidden=!drawer.hidden;document.querySelector('#menu-button').setAttribute('aria-expanded',String(!drawer.hidden));});
document.querySelector('#drawer-close').addEventListener('click',()=>drawer.hidden=true);
drawer.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>drawer.hidden=true));

const learnSteps=[
  {kicker:'STEP 1 · 실행',title:'대상 도면에서 FlowWork 열기',body:'AutoCAD에서 작업할 DWG를 연 뒤 명령창에 FLOWWORK를 입력합니다.',action:'왼쪽에 FlowWork 팔레트가 열리는지 확인합니다.',check:'팔레트 상단의 현재 도면이 작업하려는 DWG와 같아야 합니다.',image:'../manual/assets/images/FlowWork_0116_centered.png',focus:[0.7,13.5,22.3,9.2],label:'FLOWWORK 실행'},
  {kicker:'STEP 2 · 수집',title:'현재 도면을 다시 읽기',body:'팔레트 상단의 ‘도면 정보 수집’을 눌러 관로선과 주변 문자를 분석합니다.',action:'수집이 끝날 때까지 도면을 전환하지 않습니다.',check:'총 관로 수가 예상 수량과 비슷한지 먼저 확인합니다.',image:'../manual/assets/images/FlowWork_0116_centered.png',focus:[1.4,20.1,20.8,3.3],label:'도면 정보 수집'},
  {kicker:'STEP 3 · 검증',title:'오류 관로부터 선택하기',body:'관로 목록에서 빨간 오류를 먼저, 노란 경고를 다음으로 선택합니다.',action:'선택한 관로번호와 도면 강조, DETAIL 제목이 같은지 봅니다.',check:'도면과 DETAIL이 동일한 한 관로를 가리키면 다음으로 진행합니다.',image:'../manual/assets/images/FlowWork_0116_centered.png',focus:[1.4,29.7,20.8,21.2],label:'문제 관로 선택'},
  {kicker:'STEP 4 · 수정',title:'원인을 확인한 뒤 수정 방법 선택',body:'DETAIL의 진단과 도면 표시를 비교해 매핑 오류인지 방향 오류인지 구분합니다.',action:'문자가 틀리면 수동 매핑, 값은 맞고 방향만 반대면 방향 변경을 검토합니다.',check:'수정 전·후 값과 도면의 원본 문자가 일치해야 합니다.',image:'../manual/assets/images/FlowWork_direct_mapping_candidates.png',focus:[1.4,52.4,20.8,36.5],label:'진단 · 수정'},
  {kicker:'STEP 5 · 저장',title:'재수집하고 결과 저장',body:'수정 후 도면을 다시 수집하고 오류와 경고를 재확인합니다.',action:'FlowWork 입력용 JSON 또는 검토용 CSV를 선택해 저장합니다.',check:'예상 관로 수, 설명되지 않은 오류, 표본 값과 저장 위치를 확인합니다.',image:'../manual/assets/images/FlowWork_menu_screen.png',focus:[2,15,25,34],label:'결과 저장'}
];
let learnIndex=0;
let activeLearnFocus=learnSteps[0].focus;
const dots=document.querySelector('#step-dots');
learnSteps.forEach((_,index)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`${index+1}단계`);button.addEventListener('click',()=>selectLearn(index));dots.append(button);});
function positionLearnFocus(){
  const image=document.querySelector('#learn-image');const focus=document.querySelector('#learn-focus');const host=image.parentElement;
  if(!image.naturalWidth||!image.naturalHeight||!host.clientWidth||!host.clientHeight)return;
  const imageRatio=image.naturalWidth/image.naturalHeight;const hostRatio=host.clientWidth/host.clientHeight;
  const renderWidth=hostRatio>imageRatio?host.clientHeight*imageRatio:host.clientWidth;
  const renderHeight=hostRatio>imageRatio?host.clientHeight:host.clientWidth/imageRatio;
  const offsetX=(host.clientWidth-renderWidth)/2;const offsetY=(host.clientHeight-renderHeight)/2;
  const [left,top,width,height]=activeLearnFocus;
  focus.style.left=`${offsetX+renderWidth*left/100}px`;focus.style.top=`${offsetY+renderHeight*top/100}px`;
  focus.style.width=`${renderWidth*width/100}px`;focus.style.height=`${renderHeight*height/100}px`;
}
function selectLearn(index){
  learnIndex=Math.max(0,Math.min(learnSteps.length-1,index));const step=learnSteps[learnIndex];
  document.querySelector('#learn-progress').textContent=`${learnIndex+1} / ${learnSteps.length}`;
  document.querySelector('#learn-kicker').textContent=step.kicker;document.querySelector('#learn-title').textContent=step.title;document.querySelector('#learn-body').textContent=step.body;document.querySelector('#learn-action').textContent=step.action;document.querySelector('#learn-check').textContent=step.check;document.querySelector('#learn-image').src=step.image;document.querySelector('#focus-label').textContent=step.label;
  activeLearnFocus=step.focus;positionLearnFocus();
  [...dots.children].forEach((dot,i)=>dot.classList.toggle('active',i===learnIndex));
  document.querySelector('#learn-prev').disabled=learnIndex===0;document.querySelector('#learn-next').textContent=learnIndex===learnSteps.length-1?'문제 해결로 이동 →':'다음 단계 →';
}
document.querySelector('#learn-image').addEventListener('load',positionLearnFocus);
window.addEventListener('resize',positionLearnFocus);
document.querySelector('#learn-prev').addEventListener('click',()=>selectLearn(learnIndex-1));
document.querySelector('#learn-next').addEventListener('click',()=>{if(learnIndex===learnSteps.length-1)location.hash='solve';else selectLearn(learnIndex+1);});selectLearn(0);

const collectItems=[
  {key:'pipe',kicker:'PIPE GEOMETRY',title:'관로선이 모든 수집의 기준입니다',summary:'설정된 관로선 레이어의 선을 읽고 시작점과 끝점을 노드로 만듭니다.',source:'설정된 관로선 레이어의 Polyline과 양 끝점',result:'선의 START는 상류 필드, END는 하류 필드의 기준점이 됩니다.',warning:'방향은 높이값으로 자동 결정하지 않습니다. 현재 CAD 선의 시작점 → 끝점이 FlowWork의 START → END입니다.'},
  {key:'name',kicker:'PIPE NAME',title:'관로선 주변에서 관번호를 찾습니다',summary:'관번호 레이어의 문자 중 관로선에 가까우면서 설정된 탐색 허용거리 안에 있는 후보를 비교합니다.',source:'관번호 레이어의 문자와 설정된 관번호 접두어',result:'인식한 문자열을 DETAIL의 관로번호로 연결합니다.',warning:'수동 지정한 M-NAME이 있으면 자동 거리 매칭보다 먼저 적용됩니다. 잘못 연결됐다면 원본 문자와 관로번호를 함께 확인하세요.'},
  {key:'ground',kicker:'GROUND ELEVATION',title:'지반고는 관로 양 끝점에서 각각 찾습니다',summary:'START와 END 노드를 중심으로 지반고 레이어의 유효 문자를 찾고 가까운 후보를 배정합니다.',source:'지반고 레이어의 문자 · 기본 접두어 GH, G.H, EL · 설정된 검색 반경',result:'START 문자는 상류 지반고, END 문자는 하류 지반고에 들어갑니다.',warning:'괄호만 있는 문자는 지반고 후보에서 제외됩니다. 반경 밖이거나 파싱되지 않으면 0.00m와 지반고 누락 경고가 기록되며 M-GL로 직접 지정할 수 있습니다.'},
  {key:'invert',kicker:'INVERT ELEVATION',title:'관저고도 START와 END에서 따로 수집합니다',summary:'관저고 레이어의 문자를 각 노드 주변에서 찾습니다. 실패하면 지반고 레이어의 복합 문자에서 괄호 안 값을 보조로 확인합니다.',source:'관저고 레이어의 INV, I 표기 또는 지반고 복합 문자의 괄호 값',result:'START 문자는 상류 관저고, END 문자는 하류 관저고에 들어갑니다.',warning:'누락 시 0.00m와 관저고 누락 경고가 기록됩니다. M-INV로 해당 끝점의 문자를 직접 지정한 뒤 재수집해 확인하세요.'},
  {key:'spec',kicker:'DIAMETER & LENGTH',title:'관경과 연장은 관로선 주변 제원 문자에서 분리합니다',summary:'제원 레이어의 가까운 문자를 찾은 뒤 관경 접두어와 연장 접두어를 각각 해석합니다.',source:'HP·D·Ø 등의 관경 표기와 L=·L: 등의 연장 표기',result:'숫자를 분리해 DETAIL의 관경(mm)과 연장(m)에 각각 저장합니다.',warning:'연장을 읽지 못하면 CAD 선의 실측 길이를 임시 적용하고 경고합니다. 관경을 읽지 못하면 D600을 임시 적용하고 경고하므로 정상 수집값으로 오해하면 안 됩니다.'}
];
let collectIndex=0;
function positionCollectMarks(){
  const image=document.querySelector('.collect-image-wrap img');const host=image.parentElement;if(!image.naturalWidth||!host.clientWidth)return;
  const imageRatio=image.naturalWidth/image.naturalHeight;const hostRatio=host.clientWidth/host.clientHeight;const width=hostRatio>imageRatio?host.clientHeight*imageRatio:host.clientWidth;const height=hostRatio>imageRatio?host.clientHeight:host.clientWidth/imageRatio;const offsetX=(host.clientWidth-width)/2;const offsetY=(host.clientHeight-height)/2;
  document.querySelectorAll('[data-box]').forEach(mark=>{const [x,y,w,h]=mark.dataset.box.split(',').map(Number);mark.style.left=`${offsetX+width*x/100}px`;mark.style.top=`${offsetY+height*y/100}px`;mark.style.width=`${width*w/100}px`;mark.style.height=`${height*h/100}px`;});
}
function selectCollect(index){
  collectIndex=(index+collectItems.length)%collectItems.length;const item=collectItems[collectIndex];
  document.querySelectorAll('[data-collect]').forEach(button=>button.classList.toggle('active',button.dataset.collect===item.key));
  document.querySelectorAll('[data-mark]').forEach(mark=>mark.classList.toggle('active',mark.dataset.mark===item.key));
  document.querySelector('#collect-kicker').textContent=item.kicker;document.querySelector('#collect-title').textContent=item.title;document.querySelector('#collect-summary').textContent=item.summary;document.querySelector('#collect-source').textContent=item.source;document.querySelector('#collect-result').textContent=item.result;document.querySelector('#collect-warning').textContent=item.warning;
}
document.querySelectorAll('[data-collect]').forEach((button,index)=>button.addEventListener('click',()=>selectCollect(index)));
document.querySelector('#collect-prev').addEventListener('click',()=>selectCollect(collectIndex-1));document.querySelector('#collect-next').addEventListener('click',()=>selectCollect(collectIndex+1));selectCollect(0);
document.querySelector('.collect-image-wrap img').addEventListener('load',positionCollectMarks);window.addEventListener('resize',positionCollectMarks);positionCollectMarks();

const areas=[
  {count:'A · START HERE',title:'도면 수집과 설정',summary:'현재 도면을 다시 읽고 작업을 시작하는 영역입니다.',action:'활성 도면을 확인하고 ‘도면 정보 수집’을 누르세요.',result:'수집이 끝나면 B의 수량과 C의 관로 목록, D의 상세 정보가 갱신됩니다.',detail:'도면이나 설정을 변경한 뒤에는 다시 수집해야 결과에 반영됩니다. 예상 관로 수가 크게 다르면 개별 오류보다 레이어 설정부터 확인하세요.'},
  {count:'B · FIRST CHECK',title:'수집 수량 먼저 판단',summary:'개별 문제를 보기 전에 수집 결과가 기대한 규모인지 확인합니다.',action:'총 관로 수를 도면의 예상 수량과 비교하세요.',result:'정상·경고 수를 보고 C에서 먼저 확인할 대상을 정할 수 있습니다.',detail:'오류 관로는 총 관로 수에 포함되지만 별도 오류 합계 카드가 없을 수 있습니다. C 목록의 빨간 상태 아이콘을 함께 확인하세요.'},
  {count:'C · SELECT A PIPE',title:'문제 관로 선택',summary:'수집된 관로 중 실제로 점검할 한 건을 고릅니다.',action:'빨간 오류를 먼저 선택하고 노란 경고를 다음으로 확인하세요.',result:'선택 관로가 바뀌면 도면 강조와 D의 값·진단이 함께 갱신됩니다.',detail:'상태 아이콘만 보고 바로 수정하지 마세요. 선택 관로번호, 도면 강조와 DETAIL 제목이 같은지 먼저 확인합니다.'},
  {count:'D · DIAGNOSE',title:'값과 진단으로 원인 확인',summary:'선택 관로의 값, 오류 원인과 수정 메뉴를 확인합니다.',action:'진단 메시지를 읽고 도면의 원본 문자와 DETAIL 값을 비교하세요.',result:'매핑 오류면 수동 매핑, 방향 오류면 변경 전·후 확인으로 연결됩니다.',detail:'방향 변경은 화살표만 뒤집지 않습니다. 상·하류 연결, 지반고와 관저고가 함께 교환되므로 실행 전에 반드시 값을 비교해야 합니다.'}
];
function selectArea(index){const area=areas[index];document.querySelectorAll('[data-area]').forEach((button,i)=>button.classList.toggle('active',i===index));document.querySelector('#area-count').textContent=area.count;document.querySelector('#area-title').textContent=area.title;document.querySelector('#area-summary').textContent=area.summary;document.querySelector('#area-action').textContent=area.action;document.querySelector('#area-result').textContent=area.result;document.querySelector('#area-more').dataset.detail=area.detail;}
document.querySelectorAll('[data-area]').forEach((button,index)=>button.addEventListener('click',()=>selectArea(index)));selectArea(0);
function openDetail(title,html){document.querySelector('#detail-title').textContent=title;document.querySelector('#detail-content').innerHTML=`<p>${html}</p>`;detailSheet.hidden=false;}
document.querySelector('#detail-button').addEventListener('click',()=>openDetail('FlowWork 상세 설명','기본 화면은 실제 이미지와 직접 체험에 집중합니다. 기능별 판단 기준, 용어와 주의사항은 현재 학습 화면에 맞춰 이 패널에서 제공합니다.'));
document.querySelector('#area-more').addEventListener('click',event=>openDetail(document.querySelector('#area-title').textContent,event.currentTarget.dataset.detail));
document.querySelector('#detail-close').addEventListener('click',()=>detailSheet.hidden=true);

const lightbox=document.querySelector('#lightbox');document.querySelectorAll('[data-expand-image]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#lightbox-image').src=button.dataset.expandImage;lightbox.hidden=false;}));document.querySelector('#lightbox-close').addEventListener('click',()=>lightbox.hidden=true);lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.hidden=true;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){drawer.hidden=true;detailSheet.hidden=true;lightbox.hidden=true;}});
document.querySelectorAll('[data-problem]').forEach(button=>button.addEventListener('click',()=>openDetail(button.querySelector('b').textContent,'이 문제의 실제 해결 체험은 다음 제작 구간에서 추가합니다. 원인 확인 → 실제 화면 대조 → 수정 선택 → 재수집 확인의 순서로 구성할 예정입니다.')));
