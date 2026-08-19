/**
 * VIEW-MAP.JS — MODO 2: MAPA PANORÂMICO BPMN
 * Isolado: alterações aqui NÃO afetam Apresentação, Simulador ou Evidências.
 * O zoom via mouse wheel está configurado APENAS no canvas-wrapper,
 * sem capturar eventos de outras views.
 */
window.App = window.App || {};

// Offsets Y exatos das raias no board (em px)
const LANE_TOP_OFFSETS = {
  suporte: 20,
  ponto_focal: 470,
  analise_tecnica: 960,
  areas_apoio: 1490
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
  if (!dom.canvasWrapper) return;
  const rect = dom.canvasWrapper.getBoundingClientRect();
  if (rect.width === 0) return;

  const boardWidth = 3100;
  const boardHeight = 1800;
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
  if (!dom.connectionsSvg) return;

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
      <marker id="arrowhead-indigo" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
        <polygon points="0 1, 9 4.5, 0 8" fill="#818CF8"/>
      </marker>
      <marker id="arrowhead-amber" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
        <polygon points="0 1, 9 4.5, 0 8" fill="#F59E0B"/>
      </marker>
    </defs>
  `;

  FLOW_DATA.connections.forEach(conn => {
    const fromNode = FLOW_DATA.nodes.find(n => n.id === conn.from);
    const toNode = FLOW_DATA.nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return;

    const fromAnchors = App.getNodeAnchors(fromNode);
    const toAnchors = App.getNodeAnchors(toNode);

    let fromPort = conn.fromPort;
    let toPort = conn.toPort;

    if (!fromPort || !toPort) {
      const dx = toAnchors.center.x - fromAnchors.center.x;
      const dy = toAnchors.center.y - fromAnchors.center.y;
      if (Math.abs(dx) >= Math.abs(dy)) {
        fromPort = dx > 0 ? 'right' : 'left';
        toPort = dx > 0 ? 'left' : 'right';
      } else {
        fromPort = dy > 0 ? 'bottom' : 'top';
        toPort = dy > 0 ? 'top' : 'bottom';
      }
    }

    const p1 = fromAnchors[fromPort];
    const p2 = toAnchors[toPort];

    const points = [p1];

    if (conn.waypoints && conn.waypoints.length > 0) {
      conn.waypoints.forEach(wp => {
        let wx = wp.x;
        let wy = wp.y;
        if (wp.lane) {
          wx = 200 + wp.x;
          wy = (LANE_TOP_OFFSETS[wp.lane] || 0) + wp.y;
        }
        points.push({ x: wx, y: wy });
      });
    } else {
      // Orthogonal path generation
      if (fromPort === 'right' && toPort === 'left') {
        if (Math.abs(p1.y - p2.y) >= 4) {
          const midX = p1.x + (p2.x - p1.x) * 0.5;
          points.push({ x: midX, y: p1.y });
          points.push({ x: midX, y: p2.y });
        }
      } else if (fromPort === 'bottom' && toPort === 'top') {
        if (Math.abs(p1.x - p2.x) >= 4) {
          const midY = p1.y + (p2.y - p1.y) * 0.5;
          points.push({ x: p1.x, y: midY });
          points.push({ x: p2.x, y: midY });
        }
      } else if (fromPort === 'top' && toPort === 'bottom') {
        if (Math.abs(p1.x - p2.x) >= 4) {
          const midY = p1.y + (p2.y - p1.y) * 0.5;
          points.push({ x: p1.x, y: midY });
          points.push({ x: p2.x, y: midY });
        }
      } else if (fromPort === 'bottom' && toPort === 'left') {
        points.push({ x: p1.x, y: p2.y });
      } else if (fromPort === 'right' && toPort === 'top') {
        points.push({ x: p2.x, y: p1.y });
      } else if (fromPort === 'right' && toPort === 'bottom') {
        points.push({ x: p2.x, y: p1.y });
      } else if (fromPort === 'top' && toPort === 'left') {
        points.push({ x: p1.x, y: p2.y });
      } else {
        const midX = p1.x + (p2.x - p1.x) * 0.5;
        points.push({ x: midX, y: p1.y });
        points.push({ x: midX, y: p2.y });
      }
    }

    points.push(p2);

    // Build SVG path string
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.id = `edge-${conn.from}-${conn.to}`;
    path.setAttribute('class', 'flow-edge');

    let markerId = 'arrowhead';
    if (conn.label) {
      if (conn.label.includes('NÃO')) markerId = 'arrowhead-red';
      else if (conn.label.includes('SIM')) markerId = 'arrowhead-green';
      else if (conn.label.includes('Retorno')) markerId = 'arrowhead-indigo';
      else if (conn.label.includes('Melhoria')) markerId = 'arrowhead-amber';
    }
    path.setAttribute('marker-end', `url(#${markerId})`);
    path.setAttribute('d', d);
    dom.connectionsSvg.appendChild(path);

    // Render pill label badge
    if (conn.label) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      let typeClass = 'is-neutral';
      if (conn.label.includes('NÃO')) typeClass = 'is-nao';
      else if (conn.label.includes('SIM')) typeClass = 'is-sim';
      else if (conn.label.includes('Retorno') || conn.label.includes('Reanálise')) typeClass = 'is-retorno';
      g.setAttribute('class', `edge-label-group ${typeClass}`);

      // Compute midpoint of the first major segment
      let labelX = (points[0].x + points[1].x) / 2;
      let labelY = (points[0].y + points[1].y) / 2;

      if (points.length >= 2 && Math.abs(points[0].x - points[1].x) < 4) {
        // Vertical first segment: offset to right
        labelX = points[0].x + 22;
        labelY = (points[0].y + points[1].y) / 2;
      } else if (points.length >= 2 && Math.abs(points[0].y - points[1].y) < 4) {
        // Horizontal first segment: offset slightly above
        labelX = (points[0].x + points[1].x) / 2;
        labelY = points[0].y - 12;
      }

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'edge-label-bg');
      const textLen = conn.label.length * 7.5 + 16;
      rect.setAttribute('x', -textLen / 2);
      rect.setAttribute('y', -10);
      rect.setAttribute('width', textLen);
      rect.setAttribute('height', 20);
      rect.setAttribute('rx', 6);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'edge-label-text');
      text.textContent = conn.label;

      g.setAttribute('transform', `translate(${labelX}, ${labelY})`);
      g.appendChild(rect);
      g.appendChild(text);
      dom.connectionsSvg.appendChild(g);
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
