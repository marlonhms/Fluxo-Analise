/**
 * APP.JS - LÓGICA DA APLICAÇÃO WEB INTERATIVA
 * Apresentação Guiada Rica & Instrucional para Suporte, Gestão e Engenharia.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração e Estado Global
  const state = {
    currentView: 'presentation-view',
    currentStepIndex: 0,
    currentScenarioIndex: 0,
    simStepIndex: 0,
    simInterval: null,
    isSimPlaying: false,
    simSpeed: 1200,
    // Coordenadas 2D e Zoom
    panX: 40,
    panY: 30,
    zoom: 0.75,
    activeFilter: 'all',
    selectedNodeId: null,
    isHighContrast: false,
    isDarkTheme: true
  };

  // Alturas e Offsets Y das raias no board (em px)
  const LANE_TOP_OFFSETS = {
    suporte: 20,
    ponto_focal: 430,
    analise_tecnica: 900,
    areas_apoio: 1450
  };

  // Elementos do DOM
  const dom = {
    tabs: document.querySelectorAll('.mode-tab'),
    views: document.querySelectorAll('.view-container'),
    // Drawer
    drawer: document.getElementById('details-drawer'),
    drawerClose: document.getElementById('btn-close-drawer'),
    drawerTitle: document.getElementById('drawer-title'),
    drawerSubtitle: document.getElementById('drawer-subtitle'),
    drawerLaneBadge: document.getElementById('drawer-lane-badge'),
    drawerNodeType: document.getElementById('drawer-node-type'),
    drawerWhatWeDo: document.getElementById('drawer-what-we-do'),
    drawerResponsible: document.getElementById('drawer-responsible'),
    drawerToolsList: document.getElementById('drawer-tools-list'),
    drawerChecklistBox: document.getElementById('drawer-checklist-box'),
    drawerImpact: document.getElementById('drawer-impact'),
    // Modal
    modal: document.getElementById('shortcuts-modal'),
    btnShortcuts: document.getElementById('btn-shortcuts'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    // Header controls
    btnFullscreen: document.getElementById('btn-fullscreen'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    btnContrastToggle: document.getElementById('btn-contrast-toggle'),
    // Presentation View
    presChapter: document.getElementById('pres-chapter'),
    presBadge: document.getElementById('pres-badge'),
    presTitle: document.getElementById('pres-title'),
    presSubtitle: document.getElementById('pres-subtitle'),
    presHeadline: document.getElementById('pres-headline'),
    presPillarsGrid: document.getElementById('pres-pillars-grid'),
    presPointsList: document.getElementById('pres-points-list'),
    presGuideDo: document.getElementById('pres-guide-do'),
    presGuideDont: document.getElementById('pres-guide-dont'),
    presKpiVal: document.getElementById('pres-kpi-val'),
    presKpiLbl: document.getElementById('pres-kpi-lbl'),
    presSpeakerNotes: document.getElementById('pres-speaker-notes'),
    presDotsContainer: document.getElementById('pres-dots-container'),
    presBtnPrev: document.getElementById('pres-btn-prev'),
    presBtnNext: document.getElementById('pres-btn-next'),
    presMiniNodes: document.getElementById('pres-mini-nodes'),
    // Map View / Canvas
    mapView: document.getElementById('map-view'),
    canvasWrapper: document.getElementById('canvas-wrapper'),
    diagramBoard: document.getElementById('diagram-board'),
    swimlaneContainer: document.getElementById('swimlane-container'),
    connectionsSvg: document.getElementById('connections-svg'),
    zoomValue: document.getElementById('zoom-value'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    laneFilterPills: document.querySelectorAll('.lane-filter-pill'),
    // Scenario View
    scenariosGrid: document.getElementById('scenarios-grid'),
    simPlayBtn: document.getElementById('sim-play-btn'),
    simPlayIcon: document.getElementById('sim-play-icon'),
    simPlayLabel: document.getElementById('sim-play-label'),
    simStepBtn: document.getElementById('sim-step-btn'),
    simResetBtn: document.getElementById('sim-reset-btn'),
    simSpeedSelect: document.getElementById('sim-speed'),
    simProgressText: document.getElementById('sim-progress-text'),
    simTrack: document.getElementById('sim-track'),
    simOutcomeStatus: document.getElementById('sim-outcome-status'),
    simOutcomeImpact: document.getElementById('sim-outcome-impact'),
    simOutcomeLesson: document.getElementById('sim-outcome-lesson'),
    // Evidence View
    evidenceGrid: document.getElementById('evidence-grid')
  };

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  function init() {
    renderPresentationDots();
    updatePresentationSlide(0);
    renderBPMNCanvas();
    renderScenariosGrid();
    selectScenario(0);
    renderEvidencePlaybook();
    setupEventListeners();
    setupCanvasInteractions();
    refreshIcons();
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // ==========================================================================
  // VIEWPORT 2D ENGINE (TRANSFORM DIRETO SEM RASTERIZAÇÃO)
  // ==========================================================================
  function updateTransform(smooth = false) {
    if (smooth) {
      dom.diagramBoard.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        dom.diagramBoard.style.transition = 'none';
      }, 300);
    } else {
      dom.diagramBoard.style.transition = 'none';
    }

    dom.diagramBoard.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    dom.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function setZoom(newZoom, centerX = null, centerY = null) {
    const minZoom = 0.25;
    const maxZoom = 2.5;
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    if (clampedZoom === state.zoom) return;

    if (centerX === null || centerY === null) {
      const rect = dom.canvasWrapper.getBoundingClientRect();
      centerX = rect.width / 2;
      centerY = rect.height / 2;
    }

    state.panX = centerX - (centerX - state.panX) * (clampedZoom / state.zoom);
    state.panY = centerY - (centerY - state.panY) * (clampedZoom / state.zoom);
    state.zoom = clampedZoom;

    updateTransform(false);
  }

  function fitToScreen() {
    const rect = dom.canvasWrapper.getBoundingClientRect();
    if (rect.width === 0) return;

    const boardWidth = 3000;
    const boardHeight = 1880;

    const scaleX = (rect.width - 60) / boardWidth;
    const scaleY = (rect.height - 80) / boardHeight;
    const idealZoom = Math.max(0.35, Math.min(1.05, Math.min(scaleX, scaleY)));

    state.zoom = idealZoom;
    state.panX = Math.max(20, (rect.width - boardWidth * idealZoom) / 2);
    state.panY = 25;

    updateTransform(true);
  }

  function centerOnNode(nodeId) {
    const node = FLOW_DATA.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const laneOffsetTop = LANE_TOP_OFFSETS[node.lane] || 0;
    const nodeBoardX = 200 + node.x;
    const nodeBoardY = laneOffsetTop + node.y;

    const rect = dom.canvasWrapper.getBoundingClientRect();
    state.zoom = Math.max(0.9, state.zoom);
    state.panX = (rect.width / 2) - (nodeBoardX + 70) * state.zoom;
    state.panY = (rect.height / 2) - (nodeBoardY + 30) * state.zoom;

    updateTransform(true);
    highlightSingleNode(nodeId);
  }

  // ==========================================================================
  // ZOOM POR SCROLL DO MOUSE (CANVAS) & ROLAGEM DOS SLIDES
  // ==========================================================================
  function setupCanvasInteractions() {
    if (dom.canvasWrapper) {
      dom.canvasWrapper.addEventListener('wheel', (e) => {
        if (state.currentView !== 'map-view') return;
        if (e.target.closest('#details-drawer') && dom.drawer.classList.contains('open')) return;

        e.preventDefault();

        const rect = dom.canvasWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY < 0 ? 1.14 : 0.86;
        setZoom(state.zoom * zoomFactor, mouseX, mouseY);
      }, { passive: false });
    }

    const presStage = document.querySelector('.presentation-stage');
    if (presStage) {
      presStage.addEventListener('wheel', (e) => {
        if (state.currentView === 'presentation-view') {
          presStage.scrollTop += e.deltaY;
        }
      }, { passive: true });
    }
  }

  // ==========================================================================
  // NAVEGAÇÃO DE VIEWS / MODOS
  // ==========================================================================
  function switchView(viewId) {
    state.currentView = viewId;
    
    dom.tabs.forEach(tab => {
      const isActive = tab.dataset.view === viewId;
      tab.classList.toggle('active', isActive);
    });

    dom.views.forEach(view => {
      const isActive = view.id === viewId;
      view.classList.toggle('active', isActive);
    });

    closeDrawer();

    if (viewId === 'map-view') {
      setTimeout(() => {
        fitToScreen();
        renderSvgConnections();
      }, 40);
    }

    refreshIcons();
  }

  // ==========================================================================
  // MODO 1: APRESENTAÇÃO GUIADA (SLIDES & STORYTELLING RICO)
  // ==========================================================================
  function renderPresentationDots() {
    dom.presDotsContainer.innerHTML = '';
    FLOW_DATA.presentationSteps.forEach((step, idx) => {
      const dot = document.createElement('div');
      dot.className = `step-dot ${idx === 0 ? 'active' : ''}`;
      dot.title = step.title;
      dot.onclick = () => updatePresentationSlide(idx);
      dom.presDotsContainer.appendChild(dot);
    });
  }

  function updatePresentationSlide(index) {
    if (index < 0 || index >= FLOW_DATA.presentationSteps.length) return;
    state.currentStepIndex = index;
    const step = FLOW_DATA.presentationSteps[index];

    dom.presChapter.textContent = step.chapter;
    dom.presBadge.textContent = step.badge;
    dom.presBadge.style.color = step.badgeColor;
    dom.presTitle.textContent = step.title;
    dom.presSubtitle.textContent = step.subtitle;
    dom.presHeadline.textContent = step.content.headline;
    dom.presHeadline.style.borderColor = step.badgeColor;

    // Render 3 Pillars Grid
    if (dom.presPillarsGrid) {
      dom.presPillarsGrid.innerHTML = '';
      if (step.content.pillars && step.content.pillars.length > 0) {
        dom.presPillarsGrid.style.display = 'grid';
        step.content.pillars.forEach(pillar => {
          const card = document.createElement('div');
          card.className = 'pillar-card';
          card.style.setProperty('--pillar-color', pillar.color);
          card.innerHTML = `
            <div class="pillar-card-head">
              <div class="pillar-card-icon" style="background: ${pillar.color}18; color: ${pillar.color};">
                <i data-lucide="${pillar.icon || 'star'}" style="width: 15px; height: 15px;"></i>
              </div>
              <h4 style="color: ${pillar.color};">${pillar.title}</h4>
            </div>
            <p>${pillar.desc}</p>
          `;
          dom.presPillarsGrid.appendChild(card);
        });
      } else {
        dom.presPillarsGrid.style.display = 'none';
      }
    }

    // Points List
    dom.presPointsList.innerHTML = '';
    step.content.points.forEach(point => {
      const li = document.createElement('li');
      li.innerHTML = `<i data-lucide="check-circle" class="check-icon" style="width: 17px; height: 17px; color: ${step.badgeColor};"></i><span>${point}</span>`;
      dom.presPointsList.appendChild(li);
    });

    // Guidelines (Do's & Don'ts)
    if (dom.presGuideDo && dom.presGuideDont) {
      if (step.content.guidelines) {
        dom.presGuideDo.textContent = step.content.guidelines.do;
        dom.presGuideDont.textContent = step.content.guidelines.dont;
      }
    }

    dom.presKpiVal.textContent = step.content.kpi.value;
    dom.presKpiVal.style.color = step.badgeColor;
    dom.presKpiLbl.textContent = step.content.kpi.label;
    dom.presSpeakerNotes.textContent = step.speakerNotes;

    // Dots
    const dots = dom.presDotsContainer.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
      if (idx === index) {
        dot.style.background = step.badgeColor;
        dot.style.boxShadow = `0 0 12px ${step.badgeColor}`;
      } else {
        dot.style.background = '';
        dot.style.boxShadow = '';
      }
    });

    // Buttons
    dom.presBtnPrev.disabled = index === 0;
    const btnLabel = dom.presBtnNext.querySelector('span');
    if (btnLabel) {
      if (index === FLOW_DATA.presentationSteps.length - 1) {
        btnLabel.textContent = 'Finalizar & Abrir Mapa';
      } else {
        btnLabel.textContent = 'Próxima Etapa';
      }
    }

    renderMiniNodes(step.focusNodes);
    refreshIcons();
  }

  function renderMiniNodes(focusNodeIds) {
    dom.presMiniNodes.innerHTML = '';
    
    focusNodeIds.forEach(nodeId => {
      const node = FLOW_DATA.nodes.find(n => n.id === nodeId);
      const area = FLOW_DATA.supportAreas.find(a => a.id === nodeId);

      const item = document.createElement('div');
      item.className = 'mini-node-item';

      if (node) {
        const lane = FLOW_DATA.lanes.find(l => l.id === node.lane);
        item.innerHTML = `
          <div class="node-badge-circle" style="background: ${lane?.color || '#38BDF8'}22; color: ${lane?.color || '#38BDF8'};">
            <i data-lucide="${node.icon || 'circle'}" style="width: 13px; height: 13px;"></i>
          </div>
          <div class="mini-info">
            <h5>${node.title}</h5>
            <p>${node.subtitle || lane?.name || ''}</p>
          </div>
        `;
        item.onclick = function(e) { e.stopPropagation(); openNodeDrawer(node); };
      } else if (area) {
        item.innerHTML = `
          <div class="node-badge-circle" style="background: ${area.color}22; color: ${area.color};">
            <i data-lucide="${area.icon || 'layers'}" style="width: 13px; height: 13px;"></i>
          </div>
          <div class="mini-info">
            <h5>${area.name}</h5>
            <p>${area.summary}</p>
          </div>
        `;
        item.onclick = function(e) { e.stopPropagation(); openSupportAreaDrawer(area); };
      }

      dom.presMiniNodes.appendChild(item);
    });
  }

  // ==========================================================================
  // MODO 2: MAPA PANORÂMICO BPMN
  // ==========================================================================
  function renderBPMNCanvas() {
    dom.swimlaneContainer.innerHTML = '';

    FLOW_DATA.lanes.forEach(lane => {
      const laneElem = document.createElement('div');
      laneElem.className = `swimlane ${lane.id}`;
      laneElem.id = `lane-${lane.id}`;
      laneElem.style.background = lane.bgGradient;

      // Header da raia
      const header = document.createElement('div');
      header.className = 'swimlane-header';
      header.innerHTML = `
        <span class="lane-badge" style="background: ${lane.color}22; color: ${lane.color};">${lane.badge}</span>
        <h3 style="color: ${lane.color};">${lane.name}</h3>
        <p>${lane.role}</p>
      `;

      // Conteúdo da raia
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
            openSupportAreaDrawer(area);
          };

          grid.appendChild(card);
        });

        content.appendChild(grid);
      } else {
        const laneNodes = FLOW_DATA.nodes.filter(n => n.lane === lane.id);

        laneNodes.forEach(node => {
          const nodeElem = createBPMNNodeElement(node);
          content.appendChild(nodeElem);

          // Anotação flutuante
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

    renderSvgConnections();
  }

  function createBPMNNodeElement(node) {
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

    // CLIQUE DIRETO NO CARD
    el.onclick = function(e) {
      e.stopPropagation();
      openNodeDrawer(node);
      highlightSingleNode(node.id);
    };

    return el;
  }

  // ==========================================================================
  // CONEXÕES SVG DETERMINÍSTICAS
  // ==========================================================================
  function getNodeAnchors(node) {
    const laneOffsetTop = LANE_TOP_OFFSETS[node.lane] || 0;
    const lanePaddingLeft = 200;

    const localX = lanePaddingLeft + node.x;
    const localY = laneOffsetTop + node.y;

    let width = 144;
    let height = 56;

    if (node.type === 'decision') {
      width = 48;
      height = 48;
    } else if (['start', 'end', 'link', 'event'].includes(node.type)) {
      width = 44;
      height = 44;
    }

    return {
      left: { x: localX, y: localY + height / 2 },
      right: { x: localX + width, y: localY + height / 2 },
      top: { x: localX + width / 2, y: localY },
      bottom: { x: localX + width / 2, y: localY + height },
      center: { x: localX + width / 2, y: localY + height / 2 }
    };
  }

  function renderSvgConnections() {
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

      const fromAnchors = getNodeAnchors(fromNode);
      const toAnchors = getNodeAnchors(toNode);

      const dx = toAnchors.center.x - fromAnchors.center.x;
      const dy = toAnchors.center.y - fromAnchors.center.y;

      let p1 = fromAnchors.right;
      let p2 = toAnchors.left;

      if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx > 0) {
          p1 = fromAnchors.right;
          p2 = toAnchors.left;
        } else {
          p1 = fromAnchors.left;
          p2 = toAnchors.right;
        }
      } else {
        if (dy > 0) {
          p1 = fromAnchors.bottom;
          p2 = toAnchors.top;
        } else {
          p1 = fromAnchors.top;
          p2 = toAnchors.bottom;
        }
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

        if (Math.abs(p1.x - p2.x) < 20) {
          labelX = p1.x + 16;
          labelY = p1.y + (p2.y - p1.y) * 0.4;
        }

        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);

        if (conn.label.includes('NÃO')) {
          text.setAttribute('fill', '#F43F5E');
        } else if (conn.label.includes('SIM')) {
          text.setAttribute('fill', '#34D399');
        } else {
          text.setAttribute('fill', '#94A3B8');
        }

        dom.connectionsSvg.appendChild(text);
      }
    });
  }

  function highlightSingleNode(nodeId) {
    state.selectedNodeId = nodeId;
    
    document.querySelectorAll('.flow-node').forEach(node => {
      const isSelected = node.id === `node-${nodeId}`;
      node.classList.toggle('active-highlight', isSelected);
    });

    document.querySelectorAll('.flow-edge').forEach(edge => {
      const isConnected = edge.id.startsWith(`edge-${nodeId}-`) || edge.id.endsWith(`-${nodeId}`);
      edge.classList.toggle('active-edge', isConnected);
    });
  }

  // ==========================================================================
  // MODO 3: SIMULADOR DE CENÁRIOS
  // ==========================================================================
  function renderScenariosGrid() {
    dom.scenariosGrid.innerHTML = '';

    FLOW_DATA.scenarios.forEach((scen, idx) => {
      const card = document.createElement('button');
      card.className = `scenario-card-btn ${idx === 0 ? 'active' : ''}`;
      card.style.setProperty('--scenario-color', scen.color);
      card.style.setProperty('--scenario-glow', `${scen.color}55`);
      
      card.innerHTML = `
        <span class="card-tag">${scen.tag}</span>
        <h4>${scen.title}</h4>
        <p>${scen.description}</p>
      `;

      card.onclick = function() { selectScenario(idx); };
      dom.scenariosGrid.appendChild(card);
    });
  }

  function selectScenario(index) {
    pauseSimulation();
    state.currentScenarioIndex = index;
    state.simStepIndex = 0;

    const scen = FLOW_DATA.scenarios[index];

    const cards = dom.scenariosGrid.querySelectorAll('.scenario-card-btn');
    cards.forEach((c, idx) => c.classList.toggle('active', idx === index));

    renderScenarioTrack(scen);

    dom.simOutcomeStatus.textContent = scen.outcome.status;
    dom.simOutcomeStatus.className = `status-pill ${scen.color === '#34D399' ? 'success' : ''}`;
    dom.simOutcomeStatus.style.borderColor = scen.color;
    dom.simOutcomeStatus.style.color = scen.color;
    dom.simOutcomeImpact.textContent = `Impacto: ${scen.outcome.impact}`;
    dom.simOutcomeLesson.textContent = scen.outcome.lesson;

    updateSimulationUI();
    refreshIcons();
  }

  function renderScenarioTrack(scenario) {
    dom.simTrack.innerHTML = '';
    scenario.path.forEach((nodeId, idx) => {
      const node = FLOW_DATA.nodes.find(n => n.id === nodeId);
      if (!node) return;

      if (idx > 0) {
        const arrow = document.createElement('div');
        arrow.className = 'track-arrow';
        arrow.innerHTML = '→';
        dom.simTrack.appendChild(arrow);
      }

      const badge = document.createElement('div');
      badge.className = `track-node-badge ${idx === 0 ? 'current' : ''}`;
      badge.id = `track-node-${idx}`;
      badge.innerHTML = `
        <i data-lucide="${node.icon || 'circle'}" style="width: 12px; height: 12px;"></i>
        <span>${node.title}</span>
      `;
      badge.onclick = function() {
        pauseSimulation();
        state.simStepIndex = idx;
        updateSimulationUI();
        openNodeDrawer(node);
      };

      dom.simTrack.appendChild(badge);
    });

    refreshIcons();
  }

  function updateSimulationUI() {
    const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
    const totalSteps = scen.path.length;
    const currentIdx = state.simStepIndex;

    dom.simProgressText.textContent = `Etapa ${currentIdx + 1} de ${totalSteps}`;

    scen.path.forEach((nodeId, idx) => {
      const badge = document.getElementById(`track-node-${idx}`);
      if (!badge) return;

      badge.classList.remove('passed', 'current');
      if (idx < currentIdx) {
        badge.classList.add('passed');
      } else if (idx === currentIdx) {
        badge.classList.add('current');
        badge.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    if (currentIdx >= totalSteps - 1) {
      pauseSimulation();
      dom.simPlayIcon.setAttribute('data-lucide', 'rotate-ccw');
      dom.simPlayLabel.textContent = 'Reiniciar';
    } else {
      dom.simPlayIcon.setAttribute('data-lucide', state.isSimPlaying ? 'pause' : 'play');
      dom.simPlayLabel.textContent = state.isSimPlaying ? 'Pausar' : 'Continuar';
    }

    refreshIcons();
  }

  function advanceSimStep() {
    const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
    if (state.simStepIndex < scen.path.length - 1) {
      state.simStepIndex++;
      updateSimulationUI();
    } else {
      pauseSimulation();
    }
  }

  function togglePlaySimulation() {
    const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
    if (state.simStepIndex >= scen.path.length - 1) {
      state.simStepIndex = 0;
      updateSimulationUI();
    }

    if (state.isSimPlaying) {
      pauseSimulation();
    } else {
      playSimulation();
    }
  }

  function playSimulation() {
    state.isSimPlaying = true;
    dom.simPlayIcon.setAttribute('data-lucide', 'pause');
    dom.simPlayLabel.textContent = 'Pausar';
    refreshIcons();

    if (state.simInterval) clearInterval(state.simInterval);
    state.simInterval = setInterval(() => {
      const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
      if (state.simStepIndex < scen.path.length - 1) {
        state.simStepIndex++;
        updateSimulationUI();
      } else {
        pauseSimulation();
      }
    }, state.simSpeed);
  }

  function pauseSimulation() {
    state.isSimPlaying = false;
    if (state.simInterval) {
      clearInterval(state.simInterval);
      state.simInterval = null;
    }
    dom.simPlayIcon.setAttribute('data-lucide', 'play');
    dom.simPlayLabel.textContent = 'Continuar';
    refreshIcons();
  }

  // ==========================================================================
  // MODO 4: GUIA DE EVIDÊNCIAS
  // ==========================================================================
  function renderEvidencePlaybook() {
    dom.evidenceGrid.innerHTML = '';

    FLOW_DATA.evidencePlaybook.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'module-guide-card';

      card.innerHTML = `
        <div class="mod-header">
          <div class="mod-icon" style="color: ${mod.color}; background: ${mod.color}15;">
            <i data-lucide="${mod.icon}" style="width: 18px; height: 18px;"></i>
          </div>
          <div>
            <h3 style="color: ${mod.color};">${mod.module}</h3>
            <span style="font-size: 11px; color: var(--text-secondary);">${mod.items.length} itens obrigatórios</span>
          </div>
        </div>
        <div class="items-accordion">
          ${mod.items.map(item => `
            <div class="evidence-item-box">
              <div class="item-title">${item.name}</div>
              <div class="item-path" title="Caminho">${item.path}</div>
              <div class="item-desc">${item.desc}</div>
            </div>
          `).join('')}
        </div>
      `;

      dom.evidenceGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // DRAWER LATERAL (ABRE COM DETALHES DE QUALQUER NÓ)
  // ==========================================================================
  function openNodeDrawer(node) {
    if (!node) return;
    const lane = FLOW_DATA.lanes.find(l => l.id === node.lane);

    dom.drawerTitle.textContent = node.title || 'Etapa do Processo';
    dom.drawerSubtitle.textContent = node.subtitle || '';
    dom.drawerLaneBadge.textContent = lane?.name || node.lane || 'Processo';
    dom.drawerLaneBadge.style.color = lane?.color || '#38BDF8';
    dom.drawerLaneBadge.style.background = `${lane?.color || '#38BDF8'}20`;
    dom.drawerNodeType.textContent = (node.type || 'TASK').toUpperCase();

    const whatWeDoText = node.details?.whatWeDo || node.details?.summary || (node.type === 'decision' ? `Ponto de decisão do processo: ${node.title}. Avalia as evidências para direcionar a demanda.` : 'Execução padronizada da atividade conforme procedimento operacional.');
    dom.drawerWhatWeDo.textContent = whatWeDoText;

    dom.drawerResponsible.textContent = node.details?.responsible || lane?.role || 'Equipe Responsável';
    dom.drawerResponsible.style.color = lane?.color || '#38BDF8';

    dom.drawerToolsList.innerHTML = '';
    if (node.details?.tools && node.details.tools.length > 0) {
      node.details.tools.forEach(tool => {
        const tag = document.createElement('span');
        tag.className = 'tool-tag';
        tag.textContent = tool;
        dom.drawerToolsList.appendChild(tag);
      });
    } else {
      dom.drawerToolsList.innerHTML = '<span class="tool-tag">Zendesk</span><span class="tool-tag">Jira</span>';
    }

    dom.drawerChecklistBox.innerHTML = '';
    if (node.details?.checklist && node.details.checklist.length > 0) {
      const chkSection = document.getElementById('drawer-checklist-section');
      if (chkSection) chkSection.style.display = 'flex';
      node.details.checklist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `<span class="dot">✓</span><span>${item}</span>`;
        dom.drawerChecklistBox.appendChild(div);
      });
    } else {
      const chkSection = document.getElementById('drawer-checklist-section');
      if (chkSection) chkSection.style.display = 'none';
    }

    dom.drawerImpact.textContent = node.details?.impact || 'Garante a rastreabilidade e a integridade da demanda em todo o fluxo.';

    // Botões de navegação no final do Drawer
    let drawerActions = document.getElementById('drawer-nav-actions');
    if (!drawerActions) {
      drawerActions = document.createElement('div');
      drawerActions.id = 'drawer-nav-actions';
      drawerActions.style.cssText = 'display: flex; gap: 8px; margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--border-subtle);';
      const drawerBody = dom.drawer.querySelector('.drawer-body');
      if (drawerBody) drawerBody.appendChild(drawerActions);
    }

    const nextConn = FLOW_DATA.connections.find(c => c.from === node.id);
    const prevConn = FLOW_DATA.connections.find(c => c.to === node.id);

    drawerActions.innerHTML = `
      ${prevConn ? `<button class="jump-btn" id="drawer-btn-prev" style="flex: 1; font-size: 11px; padding: 7px;">← Anterior</button>` : ''}
      <button class="jump-btn" id="drawer-btn-focus" style="flex: 1; font-size: 11px; padding: 7px; border-color: #38BDF8; color: #38BDF8;">🎯 Centralizar</button>
      ${nextConn ? `<button class="jump-btn" id="drawer-btn-next" style="flex: 1; font-size: 11px; padding: 7px;">Próximo →</button>` : ''}
    `;

    if (prevConn) {
      const btnPrev = document.getElementById('drawer-btn-prev');
      if (btnPrev) {
        btnPrev.onclick = function() {
          const prevNode = FLOW_DATA.nodes.find(n => n.id === prevConn.from);
          if (prevNode) { openNodeDrawer(prevNode); centerOnNode(prevNode.id); }
        };
      }
    }
    const btnFocus = document.getElementById('drawer-btn-focus');
    if (btnFocus) {
      btnFocus.onclick = function() {
        centerOnNode(node.id);
      };
    }
    if (nextConn) {
      const btnNext = document.getElementById('drawer-btn-next');
      if (btnNext) {
        btnNext.onclick = function() {
          const nextNode = FLOW_DATA.nodes.find(n => n.id === nextConn.to);
          if (nextNode) { openNodeDrawer(nextNode); centerOnNode(nextNode.id); }
        };
      }
    }

    // FORÇA O DRAWER A ABRIR
    dom.drawer.classList.add('open');
    dom.drawer.style.transform = 'translateX(0)';
    dom.drawer.style.visibility = 'visible';
    dom.drawer.style.pointerEvents = 'auto';
    refreshIcons();
  }

  function openSupportAreaDrawer(area) {
    if (!area) return;
    dom.drawerTitle.textContent = area.name;
    dom.drawerSubtitle.textContent = 'Área de Apoio & Engenharia Integrada';
    dom.drawerLaneBadge.textContent = 'Integração';
    dom.drawerLaneBadge.style.color = area.color;
    dom.drawerLaneBadge.style.background = `${area.color}20`;
    dom.drawerNodeType.textContent = 'ECOSSISTEMA';

    dom.drawerWhatWeDo.textContent = area.value || area.summary;
    dom.drawerResponsible.textContent = `Time de ${area.name}`;
    dom.drawerResponsible.style.color = area.color;

    dom.drawerToolsList.innerHTML = `
      <span class="tool-tag">Jira Agile</span>
      <span class="tool-tag">Zendesk</span>
      <span class="tool-tag">Comitê de POs</span>
    `;

    const chkSection = document.getElementById('drawer-checklist-section');
    if (chkSection) chkSection.style.display = 'none';
    dom.drawerImpact.textContent = `A Análise Técnica atua como filtro de precisão, blindando o time de ${area.name} contra retrabalho.`;

    const drawerActions = document.getElementById('drawer-nav-actions');
    if (drawerActions) drawerActions.innerHTML = '';

    dom.drawer.classList.add('open');
    dom.drawer.style.transform = 'translateX(0)';
    dom.drawer.style.visibility = 'visible';
    dom.drawer.style.pointerEvents = 'auto';
    refreshIcons();
  }

  function closeDrawer() {
    dom.drawer.classList.remove('open');
    dom.drawer.style.transform = 'translateX(100%)';
    state.selectedNodeId = null;
    document.querySelectorAll('.flow-node').forEach(node => {
      node.classList.remove('active-highlight');
    });
    document.querySelectorAll('.flow-edge').forEach(edge => {
      edge.classList.remove('active-edge');
    });
  }

  // ==========================================================================
  // EVENT LISTENERS & ATALHOS DO TECLADO
  // ==========================================================================
  function setupEventListeners() {
    // Abas de navegação
    dom.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchView(tab.dataset.view);
      });
    });

    dom.drawerClose.addEventListener('click', closeDrawer);

    dom.btnShortcuts.addEventListener('click', () => dom.modal.classList.add('open'));
    dom.btnCloseModal.addEventListener('click', () => dom.modal.classList.remove('open'));
    dom.modal.addEventListener('click', (e) => {
      if (e.target === dom.modal) dom.modal.classList.remove('open');
    });

    // Botões de navegação na Apresentação
    dom.presBtnPrev.onclick = (e) => {
      e.stopPropagation();
      if (state.currentStepIndex > 0) {
        updatePresentationSlide(state.currentStepIndex - 1);
      }
    };

    dom.presBtnNext.onclick = (e) => {
      e.stopPropagation();
      if (state.currentStepIndex < FLOW_DATA.presentationSteps.length - 1) {
        updatePresentationSlide(state.currentStepIndex + 1);
      } else {
        switchView('map-view');
      }
    };

    // Botões de Salto Rápido / Navegação Panorâmica
    document.querySelectorAll('.canvas-quick-jump .jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.canvas-quick-jump .jump-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.dataset.target;
        if (target === 'all') {
          fitToScreen();
        } else if (target === 'suporte') {
          state.panX = 40;
          state.panY = 30;
          state.zoom = 0.85;
          updateTransform(true);
        } else if (target === 'ponto_focal') {
          state.panX = 40;
          state.panY = -320;
          state.zoom = 0.85;
          updateTransform(true);
        } else if (target === 'analise_tecnica') {
          state.panX = 40;
          state.panY = -760;
          state.zoom = 0.85;
          updateTransform(true);
        } else if (target === 'areas_apoio') {
          state.panX = 40;
          state.panY = -1200;
          state.zoom = 0.85;
          updateTransform(true);
        }
      });
    });

    // Zoom Buttons
    dom.btnZoomIn.addEventListener('click', () => setZoom(state.zoom * 1.2));
    dom.btnZoomOut.addEventListener('click', () => setZoom(state.zoom * 0.8));
    dom.btnZoomReset.addEventListener('click', fitToScreen);

    // Simulador Controls
    dom.simPlayBtn.addEventListener('click', togglePlaySimulation);
    dom.simStepBtn.addEventListener('click', () => {
      pauseSimulation();
      advanceSimStep();
    });
    dom.simResetBtn.addEventListener('click', () => {
      pauseSimulation();
      state.simStepIndex = 0;
      updateSimulationUI();
    });
    dom.simSpeedSelect.addEventListener('change', (e) => {
      state.simSpeed = parseInt(e.target.value, 10);
      if (state.isSimPlaying) {
        pauseSimulation();
        playSimulation();
      }
    });

    // Tema Claro / Escuro
    dom.btnThemeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      state.isDarkTheme = !document.body.classList.contains('light-theme');
      dom.themeIcon.setAttribute('data-lucide', state.isDarkTheme ? 'moon' : 'sun');
      refreshIcons();
    });

    // Modo Alto Contraste
    dom.btnContrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      state.isHighContrast = document.body.classList.contains('high-contrast');
    });

    // Tela Cheia
    dom.btnFullscreen.addEventListener('click', toggleFullscreen);

    // Atalhos do Teclado
    window.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Erro ao entrar em fullscreen:', err);
      });
      dom.btnFullscreen.innerHTML = `<i data-lucide="minimize" style="width: 16px; height: 16px;"></i><span>Sair da Tela Cheia</span>`;
    } else {
      document.exitFullscreen();
      dom.btnFullscreen.innerHTML = `<i data-lucide="maximize" style="width: 16px; height: 16px;"></i><span>Tela Cheia</span>`;
    }
    refreshIcons();
  }

  function handleKeyboardShortcuts(e) {
    if (e.key === 'Escape') {
      closeDrawer();
      dom.modal.classList.remove('open');
      return;
    }

    if (e.key === '1') switchView('presentation-view');
    if (e.key === '2') switchView('map-view');
    if (e.key === '3') switchView('scenario-view');
    if (e.key === '4') switchView('evidence-view');

    if (e.key === 'f' || e.key === 'F') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        toggleFullscreen();
      }
    }

    if (e.key === 't' || e.key === 'T') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        dom.btnThemeToggle.click();
      }
    }

    if (e.key === 'c' || e.key === 'C') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        dom.btnContrastToggle.click();
      }
    }

    if (e.key === '?') {
      dom.modal.classList.toggle('open');
    }

    // Navegação nos slides
    if (state.currentView === 'presentation-view') {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (state.currentStepIndex < FLOW_DATA.presentationSteps.length - 1) {
          updatePresentationSlide(state.currentStepIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (state.currentStepIndex > 0) {
          updatePresentationSlide(state.currentStepIndex - 1);
        }
      }
    }

    // Atalhos no Mapa: Navegação suave com Teclas de Seta
    if (state.currentView === 'map-view') {
      if (e.key === '+' || e.key === '=') setZoom(state.zoom * 1.2);
      if (e.key === '-' || e.key === '_') setZoom(state.zoom * 0.8);
      if (e.key === '0') fitToScreen();
      if (e.key === 'ArrowRight') { state.panX -= 140; updateTransform(false); }
      if (e.key === 'ArrowLeft') { state.panX += 140; updateTransform(false); }
      if (e.key === 'ArrowUp') { state.panY += 140; updateTransform(false); }
      if (e.key === 'ArrowDown') { state.panY -= 140; updateTransform(false); }
    }

    // Navegação no Simulador
    if (state.currentView === 'scenario-view') {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        advanceSimStep();
      }
    }
  }

  init();
});
