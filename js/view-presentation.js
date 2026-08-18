/**
 * VIEW-PRESENTATION.JS — MODO 1: APRESENTAÇÃO GUIADA
 * Isolado: alterações aqui NÃO afetam Mapa, Simulador ou Evidências.
 */
window.App = window.App || {};

App.renderPresentationDots = function() {
  const dom = App.dom;
  dom.presDotsContainer.innerHTML = '';
  FLOW_DATA.presentationSteps.forEach((step, idx) => {
    const dot = document.createElement('div');
    dot.className = `step-dot ${idx === 0 ? 'active' : ''}`;
    dot.title = step.title;
    dot.onclick = () => App.updatePresentationSlide(idx);
    dom.presDotsContainer.appendChild(dot);
  });
};

App.updatePresentationSlide = function(index) {
  const state = App.state;
  const dom = App.dom;
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

  App.renderMiniNodes(step.focusNodes);
  App.refreshIcons();
};

App.renderMiniNodes = function(focusNodeIds) {
  const dom = App.dom;
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
      item.onclick = function(e) { e.stopPropagation(); App.openNodeDrawer(node); };
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
      item.onclick = function(e) { e.stopPropagation(); App.openSupportAreaDrawer(area); };
    }

    dom.presMiniNodes.appendChild(item);
  });
};
