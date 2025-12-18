const startScreen = document.getElementById('startScreen');
const fieldScreen = document.getElementById('fieldScreen');

const field = document.getElementById('field');
const players = document.querySelectorAll('.player');
const ball = document.getElementById('ball');

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn'); // 불러오기 버튼
const formation433 = document.getElementById('formation433');
const formation4231 = document.getElementById('formation4231');

let draggable = false;
let passMode = false;
let selectedPlayer = null;
let arrows = [];
let savedState = null; // 저장 상태

// 초기 위치 설정
function setInitialPositions() {
  arrows.forEach(a => a.remove());
  arrows = [];

  players.forEach(p => {
    const [top, left] = p.dataset.init.split(',');
    p.style.top = top + '%';
    p.style.left = left + '%';

    if (!p.querySelector('span')) {
      const name = document.createElement('span');
      name.textContent = '이름';
      p.appendChild(name);
    }
  });

  ball.style.top = '50%';
  ball.style.left = '50%';
}

// 드래그 기능
function makeDraggable(el) {
  let dragging = false;
  el.addEventListener('mousedown', () => {
    if (!draggable) return;
    dragging = true;
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = field.getBoundingClientRect();
    el.style.left = e.clientX - rect.left - el.offsetWidth / 2 + 'px';
    el.style.top = e.clientY - rect.top - el.offsetHeight / 2 + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
}

players.forEach(makeDraggable);
makeDraggable(ball);

// 시작 버튼
startBtn.onclick = () => {
  startScreen.classList.add('hidden');
  fieldScreen.classList.remove('hidden');
  draggable = true;
  setInitialPositions();
};

// 리셋 버튼
resetBtn.onclick = () => {
  setInitialPositions();
  draggable = true;
  selectedPlayer = null;
  passMode = false;
};

// 저장 버튼
saveBtn.onclick = () => {
  const state = {
    players: [],
    ball: { top: ball.style.top, left: ball.style.left },
    arrows: []
  };

  players.forEach(p => {
    state.players.push({
      team: p.classList.contains('teamA') ? 'A' : 'B',
      top: p.style.top,
      left: p.style.left,
      name: p.querySelector('span').textContent
    });
  });

  arrows.forEach(svg => {
    const line = svg.querySelector('line');
    state.arrows.push({
      x1: line.getAttribute('x1'),
      y1: line.getAttribute('y1'),
      x2: line.getAttribute('x2'),
      y2: line.getAttribute('y2')
    });
  });

  savedState = state;
  alert("현재 전술판 상태가 저장되었습니다!");
};

// 불러오기 버튼
loadBtn.onclick = () => {
  if (!savedState) {
    alert("저장된 데이터가 없습니다.");
    return;
  }

  arrows.forEach(a => a.remove());
  arrows = [];

  savedState.players.forEach((pState, idx) => {
    const p = players[idx];
    p.style.top = pState.top;
    p.style.left = pState.left;
    p.querySelector('span').textContent = pState.name;
  });

  ball.style.top = savedState.ball.top;
  ball.style.left = savedState.ball.left;

  savedState.arrows.forEach(a => {
    const arrow = drawArrow(a.x1, a.y1, a.x2, a.y2);
    arrow.addEventListener('click', () => {
      arrow.remove();
      arrows = arrows.filter(ar => ar !== arrow);
    });
    arrows.push(arrow);
  });

  alert("저장된 전술판 상태를 불러왔습니다!");
};

// 선수 이름 변경
players.forEach(player => {
  player.addEventListener('dblclick', () => {
    const newName = prompt('선수 이름 입력');
    if (!newName) return;
    player.querySelector('span').textContent = newName;
  });
});

// 포메이션 배치
function applyFormation(teamClass, formation) {
    const teamPlayers = Array.from(players).filter(p => p.classList.contains(teamClass));
    let positions = [];
  
    switch(formation) {
      case '4-3-3':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,15],[70,35],[70,55],[70,75],[50,30],[50,45],[50,60],[30,25],[30,45],[30,65]] :
          [[15,45],[30,15],[30,35],[30,55],[30,75],[50,30],[50,45],[50,60],[70,25],[70,45],[70,65]];
        break;
      case '4-2-3-1':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,15],[70,35],[70,55],[70,75],[50,35],[50,55],[35,25],[35,45],[35,65],[20,45]] :
          [[15,45],[30,15],[30,35],[30,55],[30,75],[50,35],[50,55],[65,25],[65,45],[65,65],[80,45]];
        break;
      case '4-4-2':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,15],[70,35],[70,55],[70,75],[50,20],[50,40],[50,60],[50,80],[30,35],[30,55]] :
          [[15,45],[30,15],[30,35],[30,55],[30,75],[50,20],[50,40],[50,60],[50,80],[70,35],[70,55]];
        break;
      case '3-5-2':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,25],[70,45],[70,65],[50,15],[50,35],[50,55],[50,75],[30,35],[30,65],[20,45]] :
          [[15,45],[30,25],[30,45],[30,65],[50,15],[50,35],[50,55],[50,75],[70,35],[70,65],[80,45]];
        break;
      case '5-3-2':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,10],[70,30],[70,50],[70,70],[70,90],[50,35],[50,55],[30,25],[30,65],[20,45]] :
          [[15,45],[30,10],[30,30],[30,50],[30,70],[30,90],[50,35],[50,55],[70,25],[70,65],[80,45]];
        break;
      case '4-5-1':
        positions = teamClass === 'teamA' ?
          [[85,45],[70,15],[70,35],[70,55],[70,75],[50,10],[50,30],[50,50],[50,70],[50,90],[30,45]] :
          [[15,45],[30,15],[30,35],[30,55],[30,75],[50,10],[50,30],[50,50],[50,70],[50,90],[70,45]];
        break;
    }
  
    teamPlayers.forEach((p,i) => {
      if(positions[i]){
        p.style.top = positions[i][0] + '%';
        p.style.left = positions[i][1] + '%';
      }
    });
  }
  
  // 버튼 이벤트 연결
  formation433.onclick = () => { applyFormation('teamA','4-3-3'); applyFormation('teamB','4-3-3'); };
  formation4231.onclick = () => { applyFormation('teamA','4-2-3-1'); applyFormation('teamB','4-2-3-1'); };
  formation442.onclick = () => { applyFormation('teamA','4-4-2'); applyFormation('teamB','4-4-2'); };
  formation352.onclick = () => { applyFormation('teamA','3-5-2'); applyFormation('teamB','3-5-2'); };
  formation532.onclick = () => { applyFormation('teamA','5-3-2'); applyFormation('teamB','5-3-2'); };
  formation451.onclick = () => { applyFormation('teamA','4-5-1'); applyFormation('teamB','4-5-1'); };
  

// 패스/움직임 기능
players.forEach(player => {
  player.addEventListener('click', () => {
    if (!draggable) return;

    if (!passMode) {
      selectedPlayer = player;
      passMode = true;
      player.style.boxShadow = '0 0 10px 3px yellow';
    } else {
      const startRect = selectedPlayer.getBoundingClientRect();
      const endRect = player.getBoundingClientRect();
      const fieldRect = field.getBoundingClientRect();

      const x1 = startRect.left + startRect.width / 2 - fieldRect.left;
      const y1 = startRect.top + startRect.height / 2 - fieldRect.top;
      const x2 = endRect.left + endRect.width / 2 - fieldRect.left;
      const y2 = endRect.top + endRect.height / 2 - fieldRect.top;

      const arrow = drawArrow(x1, y1, x2, y2);
      arrow.addEventListener('click', () => {
        arrow.remove();
        arrows = arrows.filter(a => a !== arrow);
      });
      arrows.push(arrow);

      selectedPlayer.style.boxShadow = '';
      selectedPlayer = null;
      passMode = false;
    }
  });
});

// 화살표 그리기
function drawArrow(x1, y1, x2, y2) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('style','position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto;');

  const defs = document.createElementNS(svgNS,'defs');
  const marker = document.createElementNS(svgNS,'marker');
  marker.setAttribute('id','arrowhead'+arrows.length);
  marker.setAttribute('markerWidth','10');
  marker.setAttribute('markerHeight','7');
  marker.setAttribute('refX','0');
  marker.setAttribute('refY','3.5');
  marker.setAttribute('orient','auto');

  const polygon = document.createElementNS(svgNS,'polygon');
  polygon.setAttribute('points','0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill','yellow');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const line = document.createElementNS(svgNS,'line');
  line.setAttribute('x1',x1);
  line.setAttribute('y1',y1);
  line.setAttribute('x2',x2);
  line.setAttribute('y2',y2);
  line.setAttribute('stroke','yellow');
  line.setAttribute('stroke-width','3');
  line.setAttribute('marker-end','url(#arrowhead'+arrows.length+')');

  svg.appendChild(line);
  field.appendChild(svg);
  return svg;
}
