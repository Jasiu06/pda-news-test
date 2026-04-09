let maxSeats = 644;
let activeDraggedParty = null;

let parties = [
  { name: "ISPN",                    seats: 4,   color: "#d2ffc7", inCoalition: true },
  { name: "People's Dem. Alliance",  seats: 11,  color: "#fc0f0f", inCoalition: true },
  { name: "MOTTAINAI",               seats: 15,  color: "#22c55e", inCoalition: true },
  { name: "New African Alliance",    seats: 36,  color: "#3ae0d8", inCoalition: true },
  { name: "GLAND",                   seats: 13,  color: "#a054c7", inCoalition: true },
  { name: "FRILN",                   seats: 48,  color: "#f59e0b", inCoalition: false },
  { name: "ABPL",                    seats: 91,  color: "#2563eb", inCoalition: true },
  { name: "NDF",                     seats: 56,  color: "#08992e", inCoalition: false },
  { name: "Southern Renewal Party",  seats: 84,  color: "#eab308", inCoalition: false },
  { name: "Naija Patriotic Army",    seats: 29,  color: "#000000", inCoalition: false },
  { name: "Salam!",                  seats: 121, color: "#55e67b", inCoalition: false },
  { name: "Neo Omu Aro",             seats: 12,  color: "#450b0b", inCoalition: false },
  { name: "FFA",                     seats: 21,  color: "#e6e285", inCoalition: false },
  { name: "Group of the People",     seats: 83,  color: "#093314", inCoalition: false }
];

function updateChart() {
  const assignedSeats = parties.reduce((sum, p) => sum + parseInt(p.seats || 0), 0);
  const unassignedSeats = Math.max(0, maxSeats - assignedSeats);
  const chartTotal = Math.max(maxSeats, assignedSeats);
  
  const govSeats = parties.filter(p => p.inCoalition).reduce((sum, p) => sum + parseInt(p.seats || 0), 0);
  const majorityNeeded = Math.floor(maxSeats / 2) + 1;
  const superMajorityNeeded = Math.floor((maxSeats * 2) / 3) + 1;
  
  const hasMajority = govSeats >= majorityNeeded;
  const hasSuperMajority = govSeats >= superMajorityNeeded;

  const svg = document.getElementById('parliament-svg');
  if (!svg) return;
  svg.innerHTML = '';
  
  const cx = 200;
  const cy = 200;
  const r0 = 60;  
  const r1 = 180; 

  const renderParties = [];
  parties.forEach((p, idx) => { if (p.inCoalition) renderParties.push({ party: p, originalIndex: idx }); });
  parties.forEach((p, idx) => { if (!p.inCoalition) renderParties.push({ party: p, originalIndex: idx }); });
  
  if (unassignedSeats > 0) {
    renderParties.push({ party: { name: "Unassigned", seats: unassignedSeats, color: "rgba(255,255,255,0.15)" }, originalIndex: -1 });
  }

  if (chartTotal > 0) {
    let rows = Math.max(3, Math.ceil(Math.sqrt(chartTotal / 3)));
    if (chartTotal > 800) rows = Math.ceil(Math.sqrt(chartTotal / 4)); 
    
    let rowRadii = [];
    let totalArc = 0;
    for(let i=0; i<rows; i++) {
        let r = r0 + (i * (r1 - r0) / Math.max(1, rows - 1));
        rowRadii.push(r);
        totalArc += Math.PI * r;
    }
    
    let seatsRemaining = chartTotal;
    let seatsPerRow = rowRadii.map((r, i) => {
        if (i === rows - 1) return seatsRemaining;
        let seats = Math.round(chartTotal * (Math.PI * r) / totalArc);
        if (seats > seatsRemaining) seats = seatsRemaining;
        seatsRemaining -= seats;
        return seats;
    });
    
    let positions = [];
    seatsPerRow.forEach((seats, rowIndex) => {
        let r = rowRadii[rowIndex];
        for(let i=0; i<seats; i++) {
            let angle = seats === 1 ? Math.PI / 2 : Math.PI - (i / (seats - 1)) * Math.PI;
            positions.push({
                x: cx + r * Math.cos(angle),
                y: cy - r * Math.sin(angle),
                angle: angle
            });
        }
    });
    
    positions.sort((a, b) => b.angle - a.angle);
    
    const maxDotRadius = ((r1 - r0) / rows) / 2 * 0.8; 
    const dotRadius = Math.min(maxDotRadius, (Math.PI * r1) / seatsPerRow[rows-1] / 2 * 0.8);

    let dotIndex = 0;
    renderParties.forEach((item) => {
      const party = item.party;
      const pIdx = item.originalIndex;
      const seats = parseInt(party.seats || 0);

      for(let i=0; i<seats; i++) {
          if(dotIndex >= positions.length) break;
          const pos = positions[dotIndex];
          
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', pos.x);
          circle.setAttribute('cy', pos.y);
          circle.setAttribute('r', dotRadius);
          
          if (party.name === "Unassigned") {
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', party.color);
            circle.setAttribute('stroke-width', Math.max(1, dotRadius * 0.3));
            circle.style.cursor = "default";
          } else {
            circle.setAttribute('fill', party.color);
            circle.dataset.partyIndex = pIdx; 
            
            if (activeDraggedParty === party) {
              circle.style.cursor = 'grabbing';
            } else {
              circle.style.cursor = 'grab';
            }
            
            if (party.inCoalition) {
              circle.setAttribute('stroke', 'rgba(255,255,255,0.8)');
              circle.setAttribute('stroke-width', Math.max(1, dotRadius * 0.25));
            } else {
              circle.setAttribute('fill-opacity', '0.25');
            }

            let clickStartTime = 0;
            let startX, startY;

            circle.addEventListener('mousedown', (e) => {
              activeDraggedParty = party;
              clickStartTime = Date.now();
              startX = e.clientX;
              startY = e.clientY;
              circle.style.cursor = 'grabbing';
              
              const onMouseMove = (moveEvent) => {
                if (!activeDraggedParty) return;
                const currentPIdx = parties.indexOf(activeDraggedParty);
                const elemBelow = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
                if (elemBelow && elemBelow.tagName === 'circle' && elemBelow.dataset.partyIndex !== undefined) {
                  const targetPIdx = parseInt(elemBelow.dataset.partyIndex);
                  if (targetPIdx !== -1 && targetPIdx !== currentPIdx) {
                    const movedItem = parties.splice(currentPIdx, 1)[0];
                    parties.splice(targetPIdx, 0, movedItem);
                    fullRender();
                  }
                }
              };

              const onMouseUp = (upEvent) => {
                const dragDuration = Date.now() - clickStartTime;
                const dragDist = Math.sqrt(Math.pow(upEvent.clientX - startX, 2) + Math.pow(upEvent.clientY - startY, 2));
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                activeDraggedParty = null;
                circle.style.cursor = 'grab';
                if (dragDuration < 250 && dragDist < 5) {
                  party.inCoalition = !party.inCoalition;
                  fullRender();
                }
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            });
          }
          svg.appendChild(circle);
          dotIndex++;
      }
    });

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy - r0 + 10);
    line.setAttribute('x2', cx);
    line.setAttribute('y2', cy - r1 - 10);
    line.setAttribute('stroke', 'var(--line-strong)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(line);
  }

  let counterColor = assignedSeats > maxSeats ? "var(--red)" : "var(--ink)";
  const totalCounter = document.getElementById('total-seat-counter');
  if (totalCounter) {
    totalCounter.innerHTML = `<span style="color:${counterColor}">${assignedSeats}</span> / ${maxSeats} Seats`;
  }
  
  let statusText = assignedSeats > maxSeats ? "OVER CAPACITY" : (hasSuperMajority ? "SUPERMAJORITY" : (hasMajority ? "MAJORITY" : "MINORITY"));
  let statusClass = assignedSeats > maxSeats ? "majority-error" : (hasSuperMajority ? "majority-super" : (hasMajority ? "majority-yes" : "majority-no"));
  let neededText = hasSuperMajority ? `${superMajorityNeeded} needed` : `${majorityNeeded} needed`;

  let axisHtml = `<div class="status-axis"><div class="status-axis-inner">`;
  renderParties.forEach(item => {
    const p = item.party;
    const pSeats = parseInt(p.seats || 0);
    if (pSeats > 0) {
      let pct = (pSeats / maxSeats) * 100;
      let opacity = (p.name !== "Unassigned" && p.inCoalition) ? '1' : '0.25';
      axisHtml += `<div class="status-axis-segment" style="width: ${pct}%; background-color: ${p.color}; opacity: ${opacity};" title="${p.name} (${p.seats})"></div>`;
    }
  });
  axisHtml += `</div>
    <div class="axis-marker majority-marker" style="left: ${(majorityNeeded / maxSeats) * 100}%;"></div>
    <div class="axis-marker supermajority-marker" style="left: ${(superMajorityNeeded / maxSeats) * 100}%;"></div>
  </div>`;

  const statusPanel = document.getElementById('status-panel');
  if (statusPanel) {
    statusPanel.innerHTML = `
      <div class="status-panel-top">
        <div class="status-stat"><span class="status-label">Gov. Seats</span><span class="status-value">${govSeats}</span></div>
        <div class="status-stat" style="text-align: right;">
          <span class="status-label">Status</span>
          <span class="status-majority-text ${statusClass}">${maxSeats === 0 ? 'NO DATA' : statusText}</span>
          <span style="font-family:'IBM Plex Mono', monospace; font-size:9px; color:var(--muted);">${neededText}</span>
        </div>
      </div>
      ${axisHtml}
    `;
  }
}

function renderSidebar() {
  const list = document.getElementById('party-editor-list');
  if (!list) return;
  list.innerHTML = '';

  parties.forEach((party, index) => {
    const row = document.createElement('div');
    row.className = 'party-row' + (party.inCoalition ? ' is-in-coalition' : '');
    row.dataset.index = index;
    row.innerHTML = `
      <div class="party-row-top">
        <div class="drag-handle" title="Drag to reorder">⋮</div>
        <input type="color" class="party-color" data-index="${index}" value="${party.color}">
        <input type="text" class="party-name" data-index="${index}" value="${party.name}" placeholder="Party Name">
        <button class="party-remove" data-index="${index}" aria-label="Remove Party">×</button>
      </div>
      <div class="party-row-bottom">
        <div class="party-seats-controls">
          <span style="margin-right: 6px;">Seats:</span>
          <button class="seat-btn minus-btn" data-index="${index}">−</button>
          <input type="text" inputmode="numeric" pattern="[0-9]*" class="party-seats" data-index="${index}" value="${party.seats}">
          <button class="seat-btn plus-btn" data-index="${index}">+</button>
        </div>
        <label class="party-coalition-wrap">
          <input type="checkbox" class="party-coalition" data-index="${index}" ${party.inCoalition ? 'checked' : ''}>
          In Government
        </label>
      </div>
    `;
    list.appendChild(row);
  });

  attachEditorListeners();
}

function fullRender() {
  renderSidebar();
  updateChart();
}

function attachEditorListeners() {
  document.querySelectorAll('.party-name').forEach(input => {
    input.addEventListener('input', (e) => {
      parties[e.target.dataset.index].name = e.target.value;
    });
  });

  document.querySelectorAll('.party-color').forEach(input => {
    input.addEventListener('input', (e) => {
      parties[e.target.dataset.index].color = e.target.value;
      updateChart(); 
    });
  });

  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pIndex = parseInt(e.target.dataset.index);
      let currentSeats = parseInt(parties[pIndex].seats || 0);
      if (currentSeats > 0) {
        parties[pIndex].seats = currentSeats - 1;
        document.querySelector(`.party-seats[data-index="${pIndex}"]`).value = parties[pIndex].seats;
        updateChart();
      }
    });
  });

  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pIndex = parseInt(e.target.dataset.index);
      let currentSeats = parseInt(parties[pIndex].seats || 0);
      
      let otherSeatsTotal = 0;
      parties.forEach((p, idx) => {
        if (idx !== pIndex) otherSeatsTotal += parseInt(p.seats || 0);
      });
      const maxAllowed = maxSeats - otherSeatsTotal;

      if (currentSeats < maxAllowed) {
        parties[pIndex].seats = currentSeats + 1;
        document.querySelector(`.party-seats[data-index="${pIndex}"]`).value = parties[pIndex].seats;
        updateChart();
      }
    });
  });

  document.querySelectorAll('.party-seats').forEach(input => {
    input.addEventListener('focus', function() { this.select(); });

    input.addEventListener('input', (e) => {
      const pIndex = parseInt(e.target.dataset.index);
      let rawVal = e.target.value.replace(/\D/g, ''); 
      
      if (rawVal === "") {
        parties[pIndex].seats = 0;
        updateChart();
        return;
      }

      let newSeats = parseInt(rawVal, 10);
      let otherSeatsTotal = 0;
      parties.forEach((p, idx) => {
        if (idx !== pIndex) otherSeatsTotal += parseInt(p.seats || 0);
      });

      const maxAllowed = maxSeats - otherSeatsTotal;
      if (newSeats > maxAllowed) newSeats = maxAllowed;
      
      e.target.value = newSeats; 
      parties[pIndex].seats = newSeats;
      updateChart();
    });

    input.addEventListener('blur', (e) => {
      const pIndex = parseInt(e.target.dataset.index);
      e.target.value = parties[pIndex].seats; 
      updateChart();
    });
  });

  document.querySelectorAll('.party-coalition').forEach(input => {
    input.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      parties[e.target.dataset.index].inCoalition = isChecked;
      const row = e.target.closest('.party-row');
      if (isChecked) row.classList.add('is-in-coalition');
      else row.classList.remove('is-in-coalition');
      updateChart(); 
    });
  });

  document.querySelectorAll('.party-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      parties.splice(e.target.dataset.index, 1);
      fullRender(); 
    });
  });

  let draggedIndex = null;

  document.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('mouseenter', function() {
      this.closest('.party-row').setAttribute('draggable', 'true');
    });
    handle.addEventListener('mouseleave', function() {
      this.closest('.party-row').removeAttribute('draggable');
    });
  });

  document.querySelectorAll('.party-row').forEach(row => {
    row.addEventListener('dragstart', function(e) {
      draggedIndex = parseInt(this.dataset.index);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => this.classList.add('dragging'), 0);
    });

    row.addEventListener('dragend', function() {
      this.classList.remove('dragging');
      document.querySelectorAll('.party-row').forEach(r => r.classList.remove('drag-over'));
      this.removeAttribute('draggable');
    });

    row.addEventListener('dragover', function(e) {
      e.preventDefault(); 
      this.classList.add('drag-over');
    });

    row.addEventListener('dragleave', function() {
      this.classList.remove('drag-over');
    });

    row.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      const targetIndex = parseInt(this.dataset.index);
      
      if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const movedItem = parties.splice(draggedIndex, 1)[0];
        parties.splice(targetIndex, 0, movedItem);
        fullRender();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const maxSeatsInput = document.getElementById('input-max-seats');
  const addPartyBtn = document.getElementById('btn-add-party');

  if (maxSeatsInput) {
    maxSeatsInput.value = maxSeats;
    maxSeatsInput.disabled = true; 
  }

  if (addPartyBtn) {
    addPartyBtn.addEventListener('click', () => {
      const assignedSeats = parties.reduce((sum, p) => sum + parseInt(p.seats || 0), 0);
      const remainingSeats = maxSeats - assignedSeats;
      const newPartySeats = Math.min(10, remainingSeats); 
      
      parties.push({ name: "New Faction", seats: newPartySeats, color: "#ffffff", inCoalition: false });
      fullRender();
    });
  }

  fullRender();
});
