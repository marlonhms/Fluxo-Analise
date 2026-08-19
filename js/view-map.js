/**
 * VIEW-MAP.JS — MODO 2: MAPA PANORÂMICO BPMN
 * Isolado: alterações aqui NÃO afetam Apresentação, Simulador ou Evidências.
 * O zoom via mouse wheel está configurado APENAS no canvas-wrapper,
 * sem capturar eventos de outras views.
 */
window.App = window.App || {};

// Offsets Y das raias no board (em px)
const LANE_TOP_OFFSETS = {
  suporte: 20,
  ponto_focal: 430,
  analise_tecnica: 900,
  areas_apoio: 1450
};

App.setupCanvasInteractions = function() {
  const dom = App.dom;
  const state = App.state;

  const mapTarget = dom.mapView || dom.canvasWrapper;
  if (mapTarget) {
    // Wheel zoom: EXCLUSIVO ao mapa panorâmico, sem vazar para outras views
    mapTarget.addEventListener('wheel', (e) => {
      if (state.currentView !== 'map-view') return;
      if (e.target.closest('#details-drawer') && dom.drawer && dom.drawer.classList.contains('open')) return;

      e.preventDefault();

      const rect = (dom.canvasWrapper || mapTarget).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.14 : 0.86;
      App.setZoom(state.zoom * zoomFactor, mouseX, mouseY);
    }, { passive: false });

    // Drag to pan
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let panStartX = 0, panStartY = 0;
    const dragTarget = dom.canvasWrapper || mapTarget;

    dragTarget.addEventListener('mousedown', (e) => {
      if (state.currentView !== 'map-view') return;
      if (e.button !== 0) return;
      if (e.target.closest('.flow-node') || e.target.closest('.support-card') || e.target.closest('.jump-btn') || e.target.closest('.tool-btn')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      panStartX = state.panX;
      panStartY = state.panY;
      dragTarget.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      state.panX = panStartX + dx;
      state.panY = panStartY + dy;
      App.updateTransform(false);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        dragTarget.style.cursor = 'grab';
      }
    });
  }
};

App.updateTransform = function(smooth = false) {
  const dom = App.dom;
  const state = App.state;
  if (!dom.diagramBoard) return;
  if (smooth) {
    dom.diagramBoard.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { if (dom.diagramBoard) dom.diagramBoard.style.transition = 'none'; }, 300);
  } else {
    dom.diagramBoard.style.transition = 'none';
  }
  dom.diagramBoard.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  if (dom.zoomValue) {
    dom.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  }
};

App.setZoom = function(newZoom, centerX = null, centerY = null) {
  const state = App.state;
  const dom = App.dom;
  const minZoom = 0.25;
  const maxZoom = 2.5;
  const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
  if (clampedZoom === state.zoom) return;

  if (centerX === null || centerY === null) {
    const rect = dom.canvasWrapper ? dom.canvasWrapper.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    centerX = rect.width / 2;
    centerY = rect.height / 2;
  }

  state.panX = centerX - (centerX - state.panX) * (clampedZoom / state.zoom);
  state.panY = centerY - (centerY - state.panY) * (clampedZoom / state.zoom);
  state.zoom = clampedZoom;
  App.updateTransform(false);
};

App.fitToScreen = function() {
  const state = App.state;
  const dom = App.dom;
  const rect = dom.canvasWrapper.getBoundingClientRect();
  if (rect.width === 0) return;

  const boardWidth = 3000;
  const boardHeight = 1880;
  const scaleX = (rect.width - 60) / boardWidth;
  const scaleY = (rect.height - 80) / boardHeight;
  const idealZoom = Math.max(0.35, Math.min(1.05, Math.min(scaleX, scaleY)));

  state.zoom = idealZoom;
  state.panX = (rect.width - boardWidth * idealZoom) / 2;
  state.panY = (rect.height - boardHeight * idealZoom) / 2;
  App.updateTransform(true);
};

App.centerOnNode = function(nodeId) {
  const state = App.state;
  const dom = App.dom;
  const node = FLOW_DATA.nodes.find(n => n.id === nodeId);
  if (!node) return;

  const laneOffsetTop = LANE_TOP_OFFSETS[node.lane] || 0;
  const nodeBoardX = 200 + node.x;
  const nodeBoardY = laneOffsetTop + node.y;

  const rect = dom.canvasWrapper.getBoundingClientRect();
  state.zoom = Math.max(0.9, state.zoom);
  state.panX = (rect.width / 2) - (nodeBoardX + 70) * state.zoom;
  state.panY = (rect.height / 2) - (nodeBoardY + 30) * state.zoom;

  App.updateTransform(true);
  App.highlightSingleNode(nodeId);
};

App.renderBPMNCanvas = function() {
  const dom = App.dom;
  const state = App.state;
  dom.swimlaneContainer.innerHTML = '';

  FLOW_DATA.lanes.forEach(lane => {
    const laneElem = document.createElement('div');
    laneElem.className = `swimlane ${lane.id}`;
    laneElem.id = `lane-${lane.id}`;
    laneElem.style.background = lane.bgGradient;

    const header = document.createElement('div');
    header.className = 'swimlane-header';
    header.innerHTML = `
      <span class="lane-badge" style="background: ${lane.color}22; color: ${lane.color};">${lane.badge}</span>
      <h3 style="color: ${lane.color};">${lane.name}</h3>
      <p>${lane.role}</p>
    `;

    const content = document.createElement('div');
    content.className = 'lane-content';
    content.id = `content-${lane.id}`;

    if (lane.id === 'areas_apoio') {
      const grid = document.createElement('div');
      grid.className = 'support-cards-grid';

      FLOW_DATA.supportAreas.forEach(area => {
        const card = document.createElement('div');
        card.className = 'support-card';
        card.style.setProperty('--card-color', area.color);
        card.innerHTML = `
          <div class="card-head">
            <div class="card-icon" style="color: ${area.color}; background: ${area.color}15;">
              <i data-lucide="${area.icon || 'layers'}" style="width: 15px; height: 15px;"></i>
            </div>
            <span>${area.name}</span>
          </div>
          <p>${area.summary}</p>
        `;
        card.onclick = function(e) {
          e.stopPropagation();
          App.openSupportAreaDrawer(area);
        };
        grid.appendChild(card);
      });

      content.appendChild(grid);
    } else {
      const laneNodes = FLOW_DATA.nodes.filter(n => n.lane === lane.id);
      laneNodes.forEach(node => {
        const nodeElem = App.createBPMNNodeElement(node);
        content.appendChild(nodeElem);

        if (node.annotation) {
          const annot = document.createElement('div');
          annot.className = 'flow-annotation-box';
          annot.style.left = `${node.x + 155}px`;
          annot.style.top = `${node.y - 10}px`;
          annot.textContent = node.annotation;
          content.appendChild(annot);
        }
      });
    }

    laneElem.appendChild(header);
    laneElem.appendChild(content);
    dom.swimlaneContainer.appendChild(laneElem);
  });

  App.renderSvgConnections();
};

App.createBPMNNodeElement = function(node) {
  const el = document.createElement('div');
  el.id = `node-${node.id}`;
  el.className = `flow-node ${node.type} ${node.highlight ? 'highlight-gold' : ''}`;
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;

  if (node.type === 'decision') {
    el.innerHTML = `
      <div class="diamond-shape">
        <div class="diamond-icon">
          <i data-lucide="${node.icon || 'help-circle'}" style="width: 16px; height: 16px;"></i>
        </div>
      </div>
      <div class="decision-label">${node.title}</div>
    `;
  } else if (node.type === 'start') {
    el.innerHTML = `
      <i data-lucide="${node.icon || 'play'}" style="width: 18px; height: 18px;"></i>
      <div class="event-label">${node.title}</div>
    `;
  } else if (node.type === 'end') {
    el.innerHTML = `
      <i data-lucide="${node.icon || 'check'}" style="width: 18px; height: 18px;"></i>
      <div class="event-label">${node.title}</div>
    `;
  } else if (node.type === 'link') {
    el.innerHTML = `<span>${node.title}</span>`;
    el.title = node.subtitle || node.title;
  } else if (node.type === 'event') {
    el.innerHTML = `
      <i data-lucide="${node.icon || 'clock'}" style="width: 18px; height: 18px;"></i>
      <div class="event-label">${node.title}</div>
    `;
  } else {
    el.innerHTML = `
      <div class="node-icon-box">
        <i data-lucide="${node.icon || 'circle'}" style="width: 14px; height: 14px;"></i>
      </div>
      <div class="task-text-box">
        <div class="node-title">${node.title}</div>
        <div class="node-subtitle" title="${node.subtitle || ''}">${node.subtitle || ''}</div>
      </div>
    `;
  }

  el.onclick = function(e) {
    e.stopPropagation();
    App.openNodeDrawer(node);
    App.highlightSingleNode(node.id);
  };

  return el;
};

App.getNodeAnchors = function(node) {
  const laneOffsetTop = LANE_TOP_OFFSETS[node.lane] || 0;
  const lanePaddingLeft = 200;
  const localX = lanePaddingLeft + node.x;
  const localY = laneOffsetTop + node.y;

  let width = 144, height = 56;
  if (node.type === 'decision') { width = 48; height = 48; }
  else if (['start', 'end', 'link', 'event'].includes(node.type)) { width = 44; height = 44; }

  return {
    left: { x: localX, y: localY + height / 2 },
    right: { x: localX + width, y: localY + height / 2 },
    top: { x: localX + width / 2, y: localY },
    bottom: { x: localX + width / 2, y: localY + height },
    center: { x: localX + width / 2, y: localY + height / 2 }
  };
};

App.renderSvgConnections = function() {
  const dom = App.dom;
  dom.connectionsSvg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 1, 8 4, 0 7" fill="#64748B"/>
      </marker>
      <marker id="arrowhead-red" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
        <polygon points="0 1, 9 4.5, 0 8" fill="#F43F5E"/>
      </marker>
      <marker id="arrowhead-green" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
        <polygon points="0 1, 9 4.5, 0 8" fill="#34D399"/>
      </marker>
    </defs>
  `;

  FLOW_DATA.connections.forEach(conn => {
    const fromNode = FLOW_DATA.nodes.find(n => n.id === conn.from);
    const toNode = FLOW_DATA.nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return;

    const fromAnchors = App.getNodeAnchors(fromNode);
    const toAnchors = App.getNodeAnchors(toNode);
    const dx = toAnchors.center.x - fromAnchors.center.x;
    const dy = toAnchors.center.y - fromAnchors.center.y;

    let p1 = fromAnchors.right, p2 = toAnchors.left;
    if (Math.abs(dx) >= Math.abs(dy)) {
      p1 = dx > 0 ? fromAnchors.right : fromAnchors.left;
      p2 = dx > 0 ? toAnchors.left : toAnchors.right;
    } else {
      p1 = dy > 0 ? fromAnchors.bottom : fromAnchors.top;
      p2 = dy > 0 ? toAnchors.top : toAnchors.bottom;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.id = `edge-${conn.from}-${conn.to}`;
    path.setAttribute('class', 'flow-edge');

    let markerId = 'arrowhead';
    if (conn.label && conn.label.includes('NÃO')) markerId = 'arrowhead-red';
    else if (conn.label && conn.label.includes('SIM')) markerId = 'arrowhead-green';
    path.setAttribute('marker-end', `url(#${markerId})`);

    let d = '';
    if (Math.abs(p1.y - p2.y) < 6) {
      d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    } else if (Math.abs(p1.x - p2.x) < 6) {
      d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    } else {
      if (dx > 0) {
        const midX = p1.x + (p2.x - p1.x) * 0.5;
        d = `M ${p1.x} ${p1.y} H ${midX} V ${p2.y} H ${p2.x}`;
      } else {
        const offsetDown = Math.max(p1.y, p2.y) + 40;
        d = `M ${p1.x} ${p1.y} V ${offsetDown} H ${p2.x} V ${p2.y}`;
      }
    }

    path.setAttribute('d', d);
    dom.connectionsSvg.appendChild(path);

    if (conn.label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'edge-label-badge');
      text.textContent = conn.label;
      let labelX = p1.x + (p2.x - p1.x) * 0.3;
      let labelY = p1.y - 8;
      if (Math.abs(p1.x - p2.x) < 20) { labelX = p1.x + 16; labelY = p1.y + (p2.y - p1.y) * 0.4; }
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      if (conn.label.includes('NÃO')) text.setAttribute('fill', '#F43F5E');
      else if (conn.label.includes('SIM')) text.setAttribute('fill', '#34D399');
      else text.setAttribute('fill', '#94A3B8');
      dom.connectionsSvg.appendChild(text);
    }
  });
};

App.highlightSingleNode = function(nodeId) {
  App.state.selectedNodeId = nodeId;
  document.querySelectorAll('.flow-node').forEach(node => {
    node.classList.toggle('active-highlight', node.id === `node-${nodeId}`);
  });
  document.querySelectorAll('.flow-edge').forEach(edge => {
    const isConnected = edge.id.startsWith(`edge-${nodeId}-`) || edge.id.endsWith(`-${nodeId}`);
    edge.classList.toggle('active-edge', isConnected);
  });
};
