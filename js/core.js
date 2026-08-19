/**
 * CORE.JS - NÚCLEO DA APLICAÇÃO WEB
 * Inicialização, Estado Global, Roteamento de Views e Atalhos Globais.
 */

// Objeto de namespace global compartilhado entre todos os módulos
window.App = window.App || {};

App.state = {
  currentView: 'presentation-view',
  currentStepIndex: 0,
  currentScenarioIndex: 0,
  simStepIndex: 0,
  simInterval: null,
  isSimPlaying: false,
  simSpeed: 1200,
  // Coordenadas 2D e Zoom do Mapa
  panX: 40,
  panY: 30,
  zoom: 0.75,
  activeFilter: 'all',
  selectedNodeId: null,
  isHighContrast: false,
  isDarkTheme: true
};

App.refreshIcons = function() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

App.switchView = function(viewId) {
  const dom = App.dom;
  const state = App.state;
  state.currentView = viewId;

  // Desfocar elementos para liberar teclas de atalho
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }

  dom.tabs.forEach(tab => {
    const isActive = tab.dataset.view === viewId;
    tab.classList.toggle('active', isActive);
  });

  dom.views.forEach(view => {
    const isActive = view.id === viewId;
    view.classList.toggle('active', isActive);
  });

  App.closeDrawer();

  if (viewId === 'map-view') {
    setTimeout(() => {
      App.fitToScreen();
      App.renderSvgConnections();
    }, 40);
  }

  if (viewId === 'scenario-view') {
    App.updateSimulationUI();
  }

  App.refreshIcons();
};

App.toggleFullscreen = function() {
  const dom = App.dom;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      document.body.classList.add('is-fullscreen');
    }).catch(err => {
      console.warn('Erro ao entrar em fullscreen:', err);
      document.body.classList.toggle('is-fullscreen');
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        document.body.classList.remove('is-fullscreen');
      }).catch(() => {
        document.body.classList.remove('is-fullscreen');
      });
    } else {
      document.body.classList.remove('is-fullscreen');
    }
  }
};

App.handleKeyboardShortcuts = function(e) {
  const state = App.state;
  const dom = App.dom;

  // Ignorar quando digitando em inputs
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === 'Escape') {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    document.body.classList.remove('is-fullscreen');
    App.closeDrawer();
    dom.modal.classList.remove('open');
    return;
  }

  if (e.key === '1') { App.switchView('presentation-view'); return; }
  if (e.key === '2') { App.switchView('map-view'); return; }
  if (e.key === '3') { App.switchView('scenario-view'); return; }
  if (e.key === '4') { App.switchView('evidence-view'); return; }

  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    App.toggleFullscreen();
    return;
  }

  if (e.key === 't' || e.key === 'T') {
    dom.btnThemeToggle.click();
    return;
  }

  if (e.key === 'c' || e.key === 'C') {
    dom.btnContrastToggle.click();
    return;
  }

  if (e.key === '?') {
    dom.modal.classList.toggle('open');
    return;
  }

  // Navegação nos slides da Apresentação
  if (state.currentView === 'presentation-view') {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      if (state.currentStepIndex < FLOW_DATA.presentationSteps.length - 1) {
        App.updatePresentationSlide(state.currentStepIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      if (state.currentStepIndex > 0) {
        App.updatePresentationSlide(state.currentStepIndex - 1);
      }
    }
  }

  // Atalhos no Mapa: Navegação suave com Teclas de Seta
  if (state.currentView === 'map-view') {
    if (e.key === '+' || e.key === '=') App.setZoom(state.zoom * 1.2);
    if (e.key === '-' || e.key === '_') App.setZoom(state.zoom * 0.8);
    if (e.key === '0') App.fitToScreen();
    if (e.key === 'ArrowRight') { state.panX -= 140; App.updateTransform(false); }
    if (e.key === 'ArrowLeft') { state.panX += 140; App.updateTransform(false); }
    if (e.key === 'ArrowUp') { state.panY += 140; App.updateTransform(false); }
    if (e.key === 'ArrowDown') { state.panY -= 140; App.updateTransform(false); }
  }

  // Navegação no Simulador
  if (state.currentView === 'scenario-view') {
    if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      App.advanceSimStep();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      App.prevSimStep();
    }
  }
};

App.setupEventListeners = function() {
  const dom = App.dom;
  const state = App.state;

  // Abas de navegação
  dom.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      App.switchView(tab.dataset.view);
    });
  });

  dom.drawerClose.addEventListener('click', App.closeDrawer);

  dom.btnShortcuts.addEventListener('click', () => dom.modal.classList.add('open'));
  dom.btnCloseModal.addEventListener('click', () => dom.modal.classList.remove('open'));
  dom.modal.addEventListener('click', (e) => {
    if (e.target === dom.modal) dom.modal.classList.remove('open');
  });

  // Botões de navegação na Apresentação
  dom.presBtnPrev.onclick = (e) => {
    e.stopPropagation();
    if (state.currentStepIndex > 0) {
      App.updatePresentationSlide(state.currentStepIndex - 1);
    }
  };

  dom.presBtnNext.onclick = (e) => {
    e.stopPropagation();
    if (state.currentStepIndex < FLOW_DATA.presentationSteps.length - 1) {
      App.updatePresentationSlide(state.currentStepIndex + 1);
    } else {
      App.switchView('map-view');
    }
  };

  // Botões de Salto Rápido / Navegação Panorâmica
  document.querySelectorAll('.canvas-quick-jump .jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.canvas-quick-jump .jump-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      if (target === 'all') {
        App.fitToScreen();
      } else if (target === 'suporte') {
        state.panX = 40;
        state.panY = 30;
        state.zoom = 0.85;
        App.updateTransform(true);
      } else if (target === 'ponto_focal') {
        state.panX = 40;
        state.panY = -320;
        state.zoom = 0.85;
        App.updateTransform(true);
      } else if (target === 'analise_tecnica') {
        state.panX = 40;
        state.panY = -760;
        state.zoom = 0.85;
        App.updateTransform(true);
      } else if (target === 'areas_apoio') {
        state.panX = 40;
        state.panY = -1200;
        state.zoom = 0.85;
        App.updateTransform(true);
      }
    });
  });

  // Zoom Buttons
  dom.btnZoomIn.addEventListener('click', () => App.setZoom(state.zoom * 1.2));
  dom.btnZoomOut.addEventListener('click', () => App.setZoom(state.zoom * 0.8));
  dom.btnZoomReset.addEventListener('click', App.fitToScreen);

  // Simulador Controls
  if (dom.simPrevBtn) {
    dom.simPrevBtn.addEventListener('click', () => {
      App.pauseSimulation();
      App.prevSimStep();
    });
  }
  if (dom.simPlayBtn) {
    dom.simPlayBtn.addEventListener('click', App.togglePlaySimulation);
  }
  if (dom.simStepBtn) {
    dom.simStepBtn.addEventListener('click', () => {
      App.pauseSimulation();
      App.advanceSimStep();
    });
  }
  if (dom.simResetBtn) {
    dom.simResetBtn.addEventListener('click', () => {
      App.pauseSimulation();
      state.simStepIndex = 0;
      App.updateSimulationUI();
    });
  }
  if (dom.simSpeedSelect) {
    dom.simSpeedSelect.addEventListener('change', (e) => {
      state.simSpeed = parseInt(e.target.value, 10);
      if (state.isSimPlaying) {
        App.pauseSimulation();
        App.playSimulation();
      }
    });
  }

  // Tema Claro / Escuro
  dom.btnThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    state.isDarkTheme = !document.body.classList.contains('light-theme');
    dom.themeIcon.setAttribute('data-lucide', state.isDarkTheme ? 'moon' : 'sun');
    App.refreshIcons();
  });

  // Modo Alto Contraste
  dom.btnContrastToggle.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    state.isHighContrast = document.body.classList.contains('high-contrast');
  });

  // Tela Cheia
  dom.btnFullscreen.addEventListener('click', App.toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const isFull = !!document.fullscreenElement;
    document.body.classList.toggle('is-fullscreen', isFull);
    if (dom.btnFullscreen) {
      if (isFull) {
        dom.btnFullscreen.innerHTML = `<i data-lucide="minimize" style="width: 16px; height: 16px;"></i><span>Sair da Tela Cheia</span>`;
      } else {
        dom.btnFullscreen.innerHTML = `<i data-lucide="maximize" style="width: 16px; height: 16px;"></i><span>Tela Cheia</span>`;
      }
      App.refreshIcons();
    }
  });

  // Atalhos do Teclado
  window.addEventListener('keydown', App.handleKeyboardShortcuts);
};

App.init = function() {
  App.renderPresentationDots();
  App.updatePresentationSlide(0);
  App.renderBPMNCanvas();
  App.renderScenariosGrid();
  App.selectScenario(0);
  App.renderEvidencePlaybook();
  App.setupEventListeners();
  App.setupCanvasInteractions();
  App.refreshIcons();
};

document.addEventListener('DOMContentLoaded', () => {
  // Mapear elementos DOM
  App.dom = {
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
    simPrevBtn: document.getElementById('sim-prev-btn'),
    simPlayBtn: document.getElementById('sim-play-btn'),
    simPlayLabel: document.getElementById('sim-play-label'),
    simStepBtn: document.getElementById('sim-step-btn'),
    simResetBtn: document.getElementById('sim-reset-btn'),
    simSpeedSelect: document.getElementById('sim-speed'),
    simProgressText: document.getElementById('sim-progress-text'),
    simProgressBar: document.getElementById('sim-progress-bar'),
    simTrack: document.getElementById('sim-track'),
    simActiveStepCard: document.getElementById('sim-active-step-card'),
    simOutcomeBox: document.getElementById('sim-outcome-box'),
    simOutcomeStatus: document.getElementById('sim-outcome-status'),
    simOutcomeImpact: document.getElementById('sim-outcome-impact'),
    simOutcomeLesson: document.getElementById('sim-outcome-lesson'),
    // Evidence View
    evidenceGrid: document.getElementById('evidence-grid')
  };

  App.init();
});
