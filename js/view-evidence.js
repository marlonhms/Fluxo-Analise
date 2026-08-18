/**
 * VIEW-EVIDENCE.JS — MODO 4: GUIA DE EVIDÊNCIAS & DRAWER LATERAL
 * Isolado: alterações aqui NÃO afetam Apresentação, Mapa ou Simulador.
 */
window.App = window.App || {};

App.renderEvidencePlaybook = function() {
  const dom = App.dom;
  if (!dom.evidenceGrid) return;
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
};

App.openNodeDrawer = function(node) {
  const dom = App.dom;
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
        if (prevNode) { App.openNodeDrawer(prevNode); App.centerOnNode(prevNode.id); }
      };
    }
  }
  const btnFocus = document.getElementById('drawer-btn-focus');
  if (btnFocus) {
    btnFocus.onclick = function() {
      App.centerOnNode(node.id);
    };
  }
  if (nextConn) {
    const btnNext = document.getElementById('drawer-btn-next');
    if (btnNext) {
      btnNext.onclick = function() {
        const nextNode = FLOW_DATA.nodes.find(n => n.id === nextConn.to);
        if (nextNode) { App.openNodeDrawer(nextNode); App.centerOnNode(nextNode.id); }
      };
    }
  }

  // FORÇA O DRAWER A ABRIR
  dom.drawer.classList.add('open');
  dom.drawer.style.transform = 'translateX(0)';
  dom.drawer.style.visibility = 'visible';
  dom.drawer.style.pointerEvents = 'auto';
  App.refreshIcons();
};

App.openSupportAreaDrawer = function(area) {
  const dom = App.dom;
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
  App.refreshIcons();
};

App.closeDrawer = function() {
  const dom = App.dom;
  const state = App.state;
  if (!dom.drawer) return;
  dom.drawer.classList.remove('open');
  dom.drawer.style.transform = 'translateX(100%)';
  state.selectedNodeId = null;
  document.querySelectorAll('.flow-node').forEach(node => {
    node.classList.remove('active-highlight');
  });
  document.querySelectorAll('.flow-edge').forEach(edge => {
    edge.classList.remove('active-edge');
  });
};
