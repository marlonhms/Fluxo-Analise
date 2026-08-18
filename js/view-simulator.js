/**
 * VIEW-SIMULATOR.JS — MODO 3: SIMULADOR DE CENÁRIOS ("A Jornada do Chamado")
 * Isolado: alterações aqui NÃO afetam Apresentação, Mapa ou Evidências.
 */
window.App = window.App || {};

App.renderScenariosGrid = function() {
  const dom = App.dom;
  const state = App.state;
  if (!dom.scenariosGrid) return;
  dom.scenariosGrid.innerHTML = '';

  FLOW_DATA.scenarios.forEach((scen, idx) => {
    const card = document.createElement('button');
    card.className = `scenario-card-btn ${idx === state.currentScenarioIndex ? 'active' : ''}`;
    card.style.setProperty('--scenario-color', scen.color);
    card.style.setProperty('--scenario-glow', `${scen.color}55`);
    
    card.innerHTML = `
      <span class="card-tag">${scen.tag}</span>
      <h4>${scen.title}</h4>
      <p>${scen.description}</p>
    `;

    card.onclick = function() { App.selectScenario(idx); };
    dom.scenariosGrid.appendChild(card);
  });
};

App.selectScenario = function(index) {
  const dom = App.dom;
  const state = App.state;
  App.pauseSimulation();
  state.currentScenarioIndex = index;
  state.simStepIndex = 0;

  const scen = FLOW_DATA.scenarios[index];
  if (!scen) return;

  const cards = dom.scenariosGrid.querySelectorAll('.scenario-card-btn');
  cards.forEach((c, idx) => c.classList.toggle('active', idx === index));

  App.renderScenarioTrack(scen);

  if (dom.simOutcomeStatus) {
    dom.simOutcomeStatus.textContent = scen.outcome.status;
    dom.simOutcomeStatus.className = `status-pill ${scen.color === '#34D399' ? 'success' : ''}`;
    dom.simOutcomeStatus.style.borderColor = scen.color;
    dom.simOutcomeStatus.style.color = scen.color;
  }
  if (dom.simOutcomeImpact) {
    dom.simOutcomeImpact.textContent = `Impacto: ${scen.outcome.impact}`;
  }
  if (dom.simOutcomeLesson) {
    dom.simOutcomeLesson.textContent = scen.outcome.lesson;
  }

  App.updateSimulationUI();
};

App.renderScenarioTrack = function(scenario) {
  const dom = App.dom;
  const state = App.state;
  if (!dom.simTrack) return;
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
    badge.title = `Clique para ir à Etapa ${idx + 1}: ${node.title}`;
    badge.innerHTML = `
      <span class="track-step-num">${idx + 1}</span>
      <i data-lucide="${node.icon || 'circle'}" style="width: 13px; height: 13px;"></i>
      <span>${node.title}</span>
    `;
    badge.onclick = function() {
      App.pauseSimulation();
      state.simStepIndex = idx;
      App.updateSimulationUI();
    };

    dom.simTrack.appendChild(badge);
  });

  App.refreshIcons();
};

App.updateSimulationUI = function() {
  const dom = App.dom;
  const state = App.state;
  const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
  if (!scen) return;

  const totalSteps = scen.path.length;
  const currentIdx = state.simStepIndex;
  const currentNodeId = scen.path[currentIdx];
  const node = FLOW_DATA.nodes.find(n => n.id === currentNodeId);
  const lane = node ? FLOW_DATA.lanes.find(l => l.id === node.lane) : null;

  // 1. Atualizar Barra de Progresso e Texto
  if (dom.simProgressText) {
    dom.simProgressText.textContent = `Etapa ${currentIdx + 1} de ${totalSteps}`;
  }
  if (dom.simProgressBar) {
    const pct = Math.round(((currentIdx + 1) / totalSteps) * 100);
    dom.simProgressBar.style.width = `${pct}%`;
    dom.simProgressBar.style.background = scen.color || '#38BDF8';
  }

  // 2. Atualizar Trilho de Badges
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

  // 3. Renderizar Card Detalhado da Etapa Ativa (Live Step Spotlight)
  if (dom.simActiveStepCard && node && lane) {
    const toolsHtml = (node.details.tools && node.details.tools.length > 0)
      ? node.details.tools.map(t => `<span class="sim-tool-tag"><i data-lucide="wrench" style="width: 11px; height: 11px;"></i> ${t}</span>`).join('')
      : '<span style="font-size: 11.5px; color: var(--text-muted);">Nenhuma ferramenta externa necessária</span>';

    const checklistHtml = (node.details.checklist && node.details.checklist.length > 0)
      ? node.details.checklist.map(c => `
          <div class="sim-checklist-item">
            <i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: ${lane.color}; flex-shrink: 0;"></i>
            <span>${c}</span>
          </div>
        `).join('')
      : '<div style="font-size: 12px; color: var(--text-muted);">Sem checklist adicional nesta fase.</div>';

    dom.simActiveStepCard.style.borderColor = lane.color;
    dom.simActiveStepCard.innerHTML = `
      <div class="sim-card-header">
        <div class="sim-card-lane-badge" style="background: ${lane.color}18; color: ${lane.color}; border: 1px solid ${lane.color}44;">
          <i data-lucide="${lane.icon || 'shield'}" style="width: 14px; height: 14px;"></i>
          <span>${lane.name} • ${lane.badge || lane.role}</span>
        </div>
        <div class="sim-card-step-badge">
          <span>Etapa ${currentIdx + 1} de ${totalSteps}</span>
          <span class="sim-node-type">${(node.type || 'TASK').toUpperCase()}</span>
        </div>
      </div>

      <div class="sim-card-title-row">
        <div class="sim-card-icon" style="background: ${lane.color}22; color: ${lane.color};">
          <i data-lucide="${node.icon || 'activity'}" style="width: 24px; height: 24px;"></i>
        </div>
        <div>
          <h3>${node.title}</h3>
          <p class="sim-card-subtitle">${node.subtitle || node.details.summary}</p>
        </div>
      </div>

      <div class="sim-card-body-grid">
        <div class="sim-col-main">
          <div class="sim-section-box">
            <h5><i data-lucide="activity" style="width: 13px; height: 13px; color: ${lane.color};"></i> O que acontece neste momento</h5>
            <p class="sim-what-we-do">${node.details.whatWeDo}</p>
          </div>

          <div class="sim-section-box">
            <h5><i data-lucide="check-square" style="width: 13px; height: 13px; color: ${lane.color};"></i> Checklist & Validações do Ticket</h5>
            <div class="sim-checklist-grid">
              ${checklistHtml}
            </div>
          </div>
        </div>

        <div class="sim-col-side">
          <div class="sim-side-item">
            <span class="sim-side-label">Responsável da Ação</span>
            <span class="sim-side-value" style="color: ${lane.color}; font-weight: 600;">
              <i data-lucide="user-check" style="width: 14px; height: 14px;"></i>
              ${node.details.responsible}
            </span>
          </div>

          <div class="sim-side-item">
            <span class="sim-side-label">Ferramentas / Sistemas</span>
            <div class="sim-tools-wrap">
              ${toolsHtml}
            </div>
          </div>

          <div class="sim-impact-box" style="border-left: 3px solid ${node.type === 'gateway' ? '#F59E0B' : lane.color};">
            <span class="sim-impact-label">
              <i data-lucide="zap" style="width: 12px; height: 12px;"></i>
              ${node.type === 'gateway' ? 'Ponto de Decisão / Gateway' : 'Impacto no Fluxo'}
            </span>
            <p class="sim-impact-text">${node.details.impact}</p>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Atualizar Botões de Controle
  if (dom.simPrevBtn) {
    dom.simPrevBtn.disabled = (currentIdx === 0);
  }
  if (dom.simStepBtn) {
    dom.simStepBtn.disabled = (currentIdx >= totalSteps - 1);
  }

  if (dom.simPlayBtn) {
    if (currentIdx >= totalSteps - 1) {
      dom.simPlayBtn.innerHTML = `<i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i><span>Reiniciar</span>`;
    } else if (state.isSimPlaying) {
      dom.simPlayBtn.innerHTML = `<i data-lucide="pause" style="width: 15px; height: 15px;"></i><span>Pausar</span>`;
    } else {
      dom.simPlayBtn.innerHTML = `<i data-lucide="play" style="width: 15px; height: 15px;"></i><span>${currentIdx === 0 ? 'Iniciar Simulação' : 'Continuar'}</span>`;
    }
  }

  // 5. Destacar Outcome Box quando atingir o final
  if (dom.simOutcomeBox) {
    const isEnd = (currentIdx >= totalSteps - 1);
    dom.simOutcomeBox.classList.toggle('final-step-glow', isEnd);
  }

  App.refreshIcons();
};

App.advanceSimStep = function() {
  const state = App.state;
  const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
  if (!scen) return;
  if (state.simStepIndex < scen.path.length - 1) {
    state.simStepIndex++;
    App.updateSimulationUI();
  } else {
    App.pauseSimulation();
  }
};

App.prevSimStep = function() {
  const state = App.state;
  if (state.simStepIndex > 0) {
    state.simStepIndex--;
    App.updateSimulationUI();
  }
};

App.togglePlaySimulation = function() {
  const state = App.state;
  const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
  if (!scen) return;

  if (state.simStepIndex >= scen.path.length - 1) {
    state.simStepIndex = 0;
    App.updateSimulationUI();
    App.playSimulation();
    return;
  }

  if (state.isSimPlaying) {
    App.pauseSimulation();
  } else {
    App.playSimulation();
  }
};

App.playSimulation = function() {
  const state = App.state;
  state.isSimPlaying = true;
  App.updateSimulationUI();

  if (state.simInterval) clearInterval(state.simInterval);
  state.simInterval = setInterval(() => {
    const scen = FLOW_DATA.scenarios[state.currentScenarioIndex];
    if (state.simStepIndex < scen.path.length - 1) {
      state.simStepIndex++;
      App.updateSimulationUI();
    } else {
      App.pauseSimulation();
    }
  }, state.simSpeed);
};

App.pauseSimulation = function() {
  const state = App.state;
  state.isSimPlaying = false;
  if (state.simInterval) {
    clearInterval(state.simInterval);
    state.simInterval = null;
  }
  App.updateSimulationUI();
};
