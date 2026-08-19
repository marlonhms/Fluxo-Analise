/**
 * DATA.JS - Base de Conhecimento e Estrutura do Fluxo de Análise Técnica
 * Mapeamento completo com coordenadas de grid BPMN espaçadas e limpas (sem sobreposição).
 */

const FLOW_DATA = {
  "metadata": {
    "title": "Mapeamento de Processos | Análise Técnica & Atendimento",
    "subtitle": "Visão Executiva, Operacional e Integrada do Ciclo de Vida da Demanda",
    "version": "2.1",
    "author": "Equipe de Análise Técnica",
    "lastUpdate": "Agosto 2026"
  },
  "lanes": [
    {
      "id": "suporte",
      "name": "Suporte",
      "role": "Atendimento de 1º e 2º Nível",
      "badge": "Entrada & Triagem",
      "color": "#38BDF8",
      "height": 420,
      "bgGradient": "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(14, 165, 233, 0.01) 100%)",
      "icon": "headset",
      "description": "Recepção direta do cliente/revenda, compreensão da dor, simulação inicial e coleta obrigatória do pacote de evidências."
    },
    {
      "id": "ponto_focal",
      "name": "Ponto Focal",
      "role": "Filtro de Qualidade & Triagem Técnica",
      "badge": "Gatekeeper de Entrada",
      "color": "#818CF8",
      "height": 460,
      "bgGradient": "linear-gradient(135deg, rgba(129, 140, 248, 0.05) 0%, rgba(99, 102, 241, 0.01) 100%)",
      "icon": "filter",
      "description": "Validação da consistência das evidências, cruzamento com QPs existentes e triagem crítica antes de onerar a engenharia de análise."
    },
    {
      "id": "analise_tecnica",
      "name": "Análise Técnica",
      "role": "Diagnóstico Profundo, R&D & Homologação",
      "badge": "Engenharia de Diagnóstico",
      "color": "#34D399",
      "height": 500,
      "bgGradient": "linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%)",
      "icon": "cpu",
      "description": "Restauração de bancos de dados, mineração de logs de serviços, identificação de causa-raiz, abertura de QP no Jira, alinhamento com POs/Devs e homologação rigorosa."
    },
    {
      "id": "areas_apoio",
      "name": "Áreas de Apoio",
      "role": "Ecossistema Estratégico Integrado",
      "badge": "Stakeholders & Engenharia",
      "color": "#F59E0B",
      "height": 200,
      "bgGradient": "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.01) 100%)",
      "icon": "layers",
      "description": "Desenvolvimento, QA, POs, Sucesso da Revenda, Comercial e Financeiro impulsionados por chamados limpos e sem ruídos."
    }
  ],
  "nodes": [
    {
      "id": "sup_start",
      "lane": "suporte",
      "type": "start",
      "title": "Cliente aciona Suporte",
      "subtitle": "WhatsApp / Portal",
      "icon": "message-square",
      "x": 40,
      "y": 130,
      "details": {
        "summary": "Ponto de partida do atendimento ao cliente ou revenda.",
        "responsible": "Time de Suporte (N1)",
        "tools": [
          "WhatsApp Business API",
          "Portal de Atendimento"
        ],
        "whatWeDo": "O cliente ou revenda reporta uma dúvida, lentidão ou comportamento inesperado.",
        "checklist": [
          "Identificar CNPJ/Razão Social",
          "Identificar módulo afetado (PDV, PAY, Retaguarda)"
        ],
        "impact": "Define a primeira impressão e a urgência do atendimento."
      }
    },
    {
      "id": "sup_zendesk",
      "lane": "suporte",
      "type": "task",
      "title": "Zendesk Gera Ticket",
      "subtitle": "Protocolo Único",
      "icon": "ticket",
      "x": 170,
      "y": 130,
      "details": {
        "summary": "Criação do protocolo formal de rastreabilidade.",
        "responsible": "Sistema Zendesk / Suporte N1",
        "tools": [
          "Zendesk Support"
        ],
        "whatWeDo": "O chamado é categorizado com protocolo único para controle de SLA.",
        "checklist": [
          "Número de ticket válido",
          "Preenchimento de campos obrigatórios"
        ],
        "impact": "Garante rastreabilidade e histórico do cliente."
      }
    },
    {
      "id": "sup_interact",
      "lane": "suporte",
      "type": "task",
      "title": "Interagir e Entender Necessidade",
      "subtitle": "Diagnóstico N1",
      "icon": "users",
      "x": 360,
      "y": 130,
      "details": {
        "summary": "Compreensão da dor e do impacto operacional.",
        "responsible": "Analista de Suporte N1/N2",
        "tools": [
          "Zendesk",
          "AnyDesk / TeamViewer"
        ],
        "whatWeDo": "Identifica se é dúvida de uso, parametrização ou anomalia real.",
        "checklist": [
          "Passo a passo realizado",
          "Mensagem de erro",
          "Frequência de ocorrência"
        ],
        "impact": "Elimina até 60% das dúvidas simples sem onerar níveis superiores."
      }
    },
    {
      "id": "sup_gw_need_analysis",
      "lane": "suporte",
      "type": "decision",
      "title": "Necessário Análise?",
      "subtitle": "Triagem",
      "icon": "help-circle",
      "x": 560,
      "y": 130,
      "details": {
        "summary": "Decisão se requer simulação técnica ou resolução direta.",
        "responsible": "Analista de Suporte",
        "tools": [
          "Base de Conhecimento"
        ],
        "whatWeDo": "Se for dúvida de uso, resolve de imediato. Se houver falha, avança.",
        "checklist": [
          "Consultou FAQ/Wiki?",
          "Verificou permissões?"
        ],
        "impact": "Evita escalonamento desnecessário."
      }
    },
    {
      "id": "sup_resolve_direct",
      "lane": "suporte",
      "type": "task",
      "title": "Resolver Demanda",
      "subtitle": "Solução 1º Nível",
      "icon": "check-circle",
      "x": 560,
      "y": 20,
      "details": {
        "summary": "Resolução direta pelo próprio time de suporte.",
        "responsible": "Suporte N1/N2",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Orienta o cliente, ajusta parametrização ou envia artigo da base.",
        "checklist": [
          "Confirmação do cliente",
          "Fechamento com macro adequada"
        ],
        "impact": "Agilidade máxima (FCR - First Call Resolution elevado)."
      }
    },
    {
      "id": "sup_simulate",
      "lane": "suporte",
      "type": "task",
      "title": "Simular Internamente",
      "subtitle": "Validar se é problema",
      "icon": "play-circle",
      "x": 670,
      "y": 130,
      "details": {
        "summary": "Tentativa de reprodução em ambiente de teste padrão.",
        "responsible": "Analista de Suporte N2",
        "tools": [
          "Ambiente Local de Testes"
        ],
        "whatWeDo": "Executa o mesmo passo a passo para confirmar se o erro se repete.",
        "checklist": [
          "Mesma versão da aplicação",
          "Parâmetros idênticos"
        ],
        "impact": "Confirma se a questão é real antes de solicitar arquivos pesados."
      }
    },
    {
      "id": "sup_gw_pdv_pay",
      "lane": "suporte",
      "type": "decision",
      "title": "Demanda de PDV/PAY?",
      "subtitle": "Frente de Caixa",
      "icon": "credit-card",
      "x": 870,
      "y": 130,
      "details": {
        "summary": "Módulos fiscais e de pagamento exigem pacote rigoroso de logs.",
        "responsible": "Suporte N2",
        "tools": [
          "Checklist de Evidências"
        ],
        "whatWeDo": "Classifica se o chamado envolve frente de caixa/TEF ou retaguarda.",
        "checklist": [
          "Envolve emissão fiscal ou cartão/TEF/PIX?"
        ],
        "impact": "Logs de PDV/PAY são cruciais por serem voláteis."
      }
    },
    {
      "id": "sup_gw_need_forward",
      "lane": "suporte",
      "type": "decision",
      "title": "Necessário Enviar Análise?",
      "subtitle": "Retaguarda",
      "icon": "help-circle",
      "x": 1020,
      "y": 130,
      "details": {
        "summary": "Para retaguarda, valida se o suporte esgotou testes locais.",
        "responsible": "Suporte N2",
        "tools": [
          "Ambiente de Teste"
        ],
        "whatWeDo": "Avalia se realmente necessita de escalonamento para a Análise.",
        "checklist": [
          "Testado em outra base?",
          "Descartado dado corrompido isolado?"
        ],
        "impact": "Garante que apenas casos insolúveis no N2 sejam escalados."
      }
    },
    {
      "id": "sup_resolve_direct_2",
      "lane": "suporte",
      "type": "task",
      "title": "Resolver Demanda",
      "subtitle": "Solução N2 / Rejeição",
      "icon": "check-circle",
      "x": 1180,
      "y": 130,
      "details": {
        "summary": "Resolução e orientação ao cliente após triagem do suporte ou devolução do Ponto Focal.",
        "responsible": "Suporte N2",
        "tools": [
          "Zendesk",
          "Base de Conhecimento"
        ],
        "whatWeDo": "Aplica a solução com as orientações do laudo ou solicita evidências complementares.",
        "checklist": [
          "Confirmação com o cliente",
          "Ticket finalizado com macro"
        ],
        "impact": "Garante resolução rápida de chamados sem falha técnica comprovada."
      }
    },
    {
      "id": "sup_end_1",
      "lane": "suporte",
      "type": "end",
      "title": "Demanda Resolvida",
      "subtitle": "Fechamento",
      "icon": "check",
      "x": 1380,
      "y": 130,
      "details": {
        "summary": "Encerramento formal do chamado resolvido no primeiro nível.",
        "responsible": "Zendesk",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Ticket finalizado com pesquisa de satisfação.",
        "checklist": [
          "Pesquisa enviada"
        ],
        "impact": "SLA mantido no menor tempo possível."
      }
    },
    {
      "id": "sup_collect_evidence",
      "lane": "suporte",
      "type": "task",
      "title": "Solicitar Evidências",
      "subtitle": "Backup, Logs e Vídeo",
      "icon": "folder-archive",
      "highlight": true,
      "x": 940,
      "y": 230,
      "annotation": "Backup do banco, Logs PDV/PAY/Integra/Serviços e Vídeo da Rotina",
      "details": {
        "summary": "ETAPA CRÍTICA: Coleta obrigatória de insumos técnicos para a reprodução.",
        "responsible": "Analista de Suporte",
        "tools": [
          "Backup ZIP",
          "Logs de Serviços",
          "Gravador de Vídeo"
        ],
        "whatWeDo": "O suporte solicita e anexa no ticket todo o pacote de evidências.",
        "checklist": [
          "📁 Backup recente do banco de dados",
          "📄 Log do PDV (da data do evento)",
          "💳 Log do PAY / TEF",
          "🔄 Log do Integra / Mensageria",
          "⚙️ Log da Automação / Serviços",
          "🎥 Vídeo demonstrativo da rotina"
        ],
        "impact": "Sem esse pacote, o ticket será DEVOLVIDO pelo Ponto Focal."
      }
    },
    {
      "id": "sup_forward_focal",
      "lane": "suporte",
      "type": "task",
      "title": "Encaminhar para Ponto Focal",
      "subtitle": "Fila do Gatekeeper",
      "icon": "send",
      "x": 940,
      "y": 320,
      "details": {
        "summary": "Transferência formal do ticket para a fila do Ponto Focal.",
        "responsible": "Suporte N2",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Envia o chamado preenchido com todos os anexos e resumo do teste.",
        "checklist": [
          "Todos os anexos presentes",
          "Relato do esperado x ocorrido"
        ],
        "impact": "Passagem de bastão com SLA registrado."
      }
    },
    {
      "id": "sup_link_p01",
      "lane": "suporte",
      "type": "link",
      "title": "P01",
      "subtitle": "Para Ponto Focal",
      "icon": "arrow-down-circle",
      "x": 1140,
      "y": 320,
      "details": {
        "summary": "Ponto de conexão BPMN P01 (Suporte -> Ponto Focal).",
        "responsible": "Sistema de Fila",
        "tools": [
          "Zendesk Routing"
        ],
        "whatWeDo": "O ticket sai do Suporte e entra na esteira do Ponto Focal.",
        "checklist": [
          "Ticket atribuído ao Ponto Focal"
        ],
        "impact": "Transição contínua sem perda de contexto."
      }
    },
    {
      "id": "focal_link_p01",
      "lane": "ponto_focal",
      "type": "link",
      "title": "P01",
      "subtitle": "Do Suporte",
      "icon": "arrow-down-circle",
      "x": 40,
      "y": 60,
      "details": {
        "summary": "Início da triagem especializada do Ponto Focal.",
        "responsible": "Analista Ponto Focal",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Recebe o ticket vindo do Suporte para conferência de integridade.",
        "checklist": [
          "Descrição clara",
          "Anexos presentes"
        ],
        "impact": "Filtro inicial de qualidade para proteger a Análise Técnica."
      }
    },
    {
      "id": "focal_analyze",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Analisar Demanda do Suporte",
      "subtitle": "Auditoria do Ticket",
      "icon": "search",
      "x": 140,
      "y": 60,
      "details": {
        "summary": "Auditoria do relato e dos arquivos anexados.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk",
          "Jira Search"
        ],
        "whatWeDo": "Valida se os arquivos estão íntegros e se o relato é compreensível.",
        "checklist": [
          "Logs abrem corretamente?",
          "Versão é suportada?"
        ],
        "impact": "Identifica falhas de documentação precocemente."
      }
    },
    {
      "id": "focal_gw_test_db",
      "lane": "ponto_focal",
      "type": "decision",
      "title": "Possível Simular em Teste?",
      "subtitle": "Base Limpa",
      "icon": "database",
      "x": 340,
      "y": 60,
      "details": {
        "summary": "Verifica se pode ser reproduzido em base padrão limpa.",
        "responsible": "Ponto Focal",
        "tools": [
          "Bases Padrão"
        ],
        "whatWeDo": "Se puder ser reproduzido em base limpa, acelera o diagnóstico.",
        "checklist": [
          "Cenário depende de cadastro específico ou geral?"
        ],
        "impact": "Determina o nível de esforço do teste."
      }
    },
    {
      "id": "focal_check_qp",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Identificar se há QP Relacionada",
      "subtitle": "Busca no Jira",
      "icon": "git-pull-request",
      "x": 450,
      "y": 60,
      "details": {
        "summary": "Busca no Jira por problemas conhecidos idênticos já mapeados.",
        "responsible": "Ponto Focal",
        "tools": [
          "Jira Software"
        ],
        "whatWeDo": "Pesquisa por mensagens de erro e rotinas no Jira para evitar duplicidade.",
        "checklist": [
          "Busca por rotina no Jira",
          "Checagem de QPs abertos"
        ],
        "impact": "Economiza de 2h a 8h de diagnóstico em bugs já conhecidos."
      }
    },
    {
      "id": "focal_sim_test_db",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Simular na Base de Teste",
      "subtitle": "Ambiente Controlado",
      "icon": "play",
      "x": 650,
      "y": 60,
      "details": {
        "summary": "Execução do teste na base padrão interna.",
        "responsible": "Ponto Focal",
        "tools": [
          "Ambiente Local"
        ],
        "whatWeDo": "Realiza a rotina exata para confirmar a anomalia.",
        "checklist": [
          "Prints e evidências do teste interno"
        ],
        "impact": "Confirmação padronizada do relato."
      }
    },
    {
      "id": "focal_sim_client_db",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Simular na Base do Cliente",
      "subtitle": "Versões Diferentes",
      "icon": "layers",
      "x": 290,
      "y": 170,
      "details": {
        "summary": "Teste com a base do cliente em versões anteriores e atuais.",
        "responsible": "Ponto Focal",
        "tools": [
          "Multi-versões"
        ],
        "whatWeDo": "Verifica se foi uma regressão introduzida recentemente.",
        "checklist": [
          "Teste na versão do cliente",
          "Teste na versão mais recente"
        ],
        "impact": "Identifica se a atualização já resolve o problema."
      }
    },
    {
      "id": "focal_gw_found_qp",
      "lane": "ponto_focal",
      "type": "decision",
      "title": "Identificado QP?",
      "subtitle": "Bug Conhecido",
      "icon": "help-circle",
      "x": 490,
      "y": 170,
      "details": {
        "summary": "Decisão se o problema já possui issue no Jira.",
        "responsible": "Ponto Focal",
        "tools": [
          "Jira"
        ],
        "whatWeDo": "Se houver QP mapeada, encaminha para conferência de status.",
        "checklist": [
          "Número da QP vinculada"
        ],
        "impact": "Agilidade na resposta ao cliente."
      }
    },
    {
      "id": "focal_gw_qp_done",
      "lane": "ponto_focal",
      "type": "decision",
      "title": "QP Concluída?",
      "subtitle": "Status no Dev",
      "icon": "check-square",
      "x": 490,
      "y": 280,
      "details": {
        "summary": "Checagem do status da QP no Jira.",
        "responsible": "Ponto Focal",
        "tools": [
          "Jira Board"
        ],
        "whatWeDo": "Se a QP estiver pronta, orienta atualização. Se em aberto, vincula.",
        "checklist": [
          "Status no Jira",
          "Versão de liberação"
        ],
        "impact": "Evita retrabalho para a Análise Técnica."
      }
    },
    {
      "id": "focal_link_qp",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Vincular Chamado na QP",
      "subtitle": "Associação no Jira",
      "icon": "link",
      "x": 600,
      "y": 280,
      "details": {
        "summary": "Associação do ticket à issue existente no Jira.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk-Jira Integration"
        ],
        "whatWeDo": "Garante que o cliente seja avisado assim que a versão for liberada.",
        "checklist": [
          "Link do Zendesk inserido no Jira"
        ],
        "impact": "Rastreabilidade de clientes afetados."
      }
    },
    {
      "id": "focal_sim_ticket",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Simular e Detalhar no Ticket",
      "subtitle": "Evidência na Versão Atual",
      "icon": "file-text",
      "x": 440,
      "y": 380,
      "details": {
        "summary": "Validação na versão mais recente onde o bug já foi corrigido.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Demonstra com prints que a versão atual funciona perfeitamente.",
        "checklist": [
          "Print da versão corrigida",
          "Orientação de atualização"
        ],
        "impact": "Instrui o Suporte a orientar atualização do cliente."
      }
    },
    {
      "id": "focal_gw_need_deep",
      "lane": "ponto_focal",
      "type": "decision",
      "title": "Necessário Análise Detalhada?",
      "subtitle": "Critério de Aceite",
      "icon": "alert-triangle",
      "x": 800,
      "y": 170,
      "details": {
        "summary": "Decisão do Gatekeeper: aprovar para Análise ou rejeitar ao Suporte.",
        "responsible": "Ponto Focal",
        "tools": [
          "Critérios de Aceite"
        ],
        "whatWeDo": "Se o problema for real e possuir evidências completas, aprova.",
        "checklist": [
          "Pacote completo?",
          "Problema reproduzido?"
        ],
        "impact": "Garante que 100% dos tickets para a Análise sejam analisáveis."
      }
    },
    {
      "id": "focal_approve",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Aprovar Ticket",
      "subtitle": "Para Análise Técnica",
      "icon": "check-square",
      "x": 800,
      "y": 280,
      "details": {
        "summary": "Aprovação formal do ticket pelo Gatekeeper.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "O ticket recebe a tag de aprovado e vai para a Análise Técnica.",
        "checklist": [
          "Tags aplicadas",
          "Resumo do Ponto Focal anexado"
        ],
        "impact": "Transição com qualidade garantida."
      }
    },
    {
      "id": "focal_link_p02",
      "lane": "ponto_focal",
      "type": "link",
      "title": "P02",
      "subtitle": "Para Análise Técnica",
      "icon": "arrow-down-circle",
      "x": 1000,
      "y": 280,
      "details": {
        "summary": "Ponto de conexão BPMN P02 (Ponto Focal -> Análise Técnica).",
        "responsible": "Sistema de Fila",
        "tools": [
          "Zendesk Routing"
        ],
        "whatWeDo": "O ticket entra na fila de engenharia de diagnóstico.",
        "checklist": [
          "Ticket atribuído à Análise Técnica"
        ],
        "impact": "Início do diagnóstico aprofundado."
      }
    },
    {
      "id": "focal_reject",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Rejeitar Ticket",
      "subtitle": "Devolução ao Suporte",
      "icon": "x-circle",
      "highlight": true,
      "x": 960,
      "y": 170,
      "details": {
        "summary": "Devolução para o Suporte por falta de evidências ou inconsistência.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "O chamado é devolvido ao Suporte para coleta de evidências faltantes.",
        "checklist": [
          "Motivo claro selecionado"
        ],
        "impact": "Preserva a capacidade produtiva da Análise Técnica."
      }
    },
    {
      "id": "focal_reject_detail",
      "lane": "ponto_focal",
      "type": "task",
      "title": "Detalhar Motivo da Rejeição",
      "subtitle": "Anexar Evidências",
      "icon": "clipboard",
      "x": 1160,
      "y": 170,
      "details": {
        "summary": "Feedback educativo ao analista de Suporte.",
        "responsible": "Ponto Focal",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Descreve exatamente o que foi testado e qual arquivo faltou.",
        "checklist": [
          "Logs/prints anexados",
          "Orientações claras para o Suporte"
        ],
        "impact": "Capacitação contínua do time de atendimento."
      }
    },
    {
      "id": "tech_link_p02",
      "lane": "analise_tecnica",
      "type": "link",
      "title": "P02",
      "subtitle": "Do Ponto Focal",
      "icon": "arrow-down-circle",
      "x": 40,
      "y": 140,
      "details": {
        "summary": "Início do diagnóstico aprofundado pela equipe de Análise.",
        "responsible": "Analista Técnico",
        "tools": [
          "Zendesk",
          "Painel da Análise"
        ],
        "whatWeDo": "Recebe o chamado validado com pacote completo de evidências.",
        "checklist": [
          "Conferência dos arquivos recebidos"
        ],
        "impact": "Trabalho 100% focado em diagnóstico sem interrupções."
      }
    },
    {
      "id": "tech_analyze",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Analisar Demanda do Suporte",
      "subtitle": "Planejamento de Teste",
      "icon": "microscope",
      "x": 140,
      "y": 140,
      "details": {
        "summary": "Leitura técnica das variáveis envolvidas no chamado.",
        "responsible": "Analista Técnico Especialista",
        "tools": [
          "Ambientes Virtuais",
          "Zendesk"
        ],
        "whatWeDo": "Examina logs e versões para planejar o método de reprodução.",
        "checklist": [
          "Identificar serviços de background (Integra, Automação)"
        ],
        "impact": "Direciona a simulação para a camada exata de falha."
      }
    },
    {
      "id": "tech_gw_pdv_pay",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "Demanda de PDV/PAY?",
      "subtitle": "Ambiente Especial",
      "icon": "layers",
      "x": 340,
      "y": 140,
      "details": {
        "summary": "Define se exigirá restauração de banco SQL e emuladores de TEF.",
        "responsible": "Analista Técnico",
        "tools": [
          "SQL Server / PostgreSQL",
          "Simuladores TEF"
        ],
        "whatWeDo": "Se for PDV/PAY, restaura banco e analisa logs de serviços.",
        "checklist": [
          "Espaço em disco e emulador de PDV disponíveis"
        ],
        "impact": "Garante ambiente isolado e réplica fiel do cliente."
      }
    },
    {
      "id": "tech_download_assets",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Baixar Backup e Logs",
      "subtitle": "Extração Segura",
      "icon": "download-cloud",
      "x": 290,
      "y": 260,
      "details": {
        "summary": "Download seguro dos dados para a sandbox local.",
        "responsible": "Analista Técnico",
        "tools": [
          "Storage Seguro / Sandbox"
        ],
        "whatWeDo": "Descompacta logs e banco em diretórios estruturados.",
        "checklist": [
          "Integridade do arquivo .BAK / .ZIP verificada"
        ],
        "impact": "Preserva a integridade e privacidade sob LGPD."
      }
    },
    {
      "id": "tech_restore_logs",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Restaurar Backup e Analisar Logs",
      "subtitle": "Mineração de Eventos",
      "icon": "database",
      "x": 480,
      "y": 260,
      "details": {
        "summary": "Restauração do banco SQL e mineração profunda dos logs de eventos.",
        "responsible": "Analista Técnico",
        "tools": [
          "SQL Server Management Studio",
          "VSCode / Log Parser"
        ],
        "whatWeDo": "Busca StackTraces, exceções não tratadas, timeouts de API e deadlocks.",
        "checklist": [
          "Versão do banco compatível",
          "Timestamp cruzado com o ticket"
        ],
        "impact": "Encontra a linha exata de erro e query executada."
      }
    },
    {
      "id": "tech_sim_env",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Simular com Banco e Versões",
      "subtitle": "Isolamento da Causa Raiz",
      "icon": "play-circle",
      "highlight": true,
      "x": 670,
      "y": 260,
      "annotation": "Para simulação se faz necessário que todas as evidências sejam coletadas e enviadas corretamente",
      "details": {
        "summary": "Simulação prática reproduzindo a falha com os dados reais do cliente.",
        "responsible": "Analista Técnico",
        "tools": [
          "Ambiente de Simulação Multi-versão"
        ],
        "whatWeDo": "Executa a rotina gravando a tela e monitorando tráfego de API.",
        "checklist": [
          "Todas as evidências coletadas",
          "100% de reproducibilidade obtida"
        ],
        "impact": "Cria o cenário perfeito e à prova de falhas para o Dev."
      }
    },
    {
      "id": "tech_sim_diff_versions",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Simular em Bases e Versões",
      "subtitle": "Retaguarda & Fiscal",
      "icon": "cpu",
      "x": 480,
      "y": 140,
      "details": {
        "summary": "Simulação de módulos de retaguarda em bases de teste e do cliente.",
        "responsible": "Analista Técnico",
        "tools": [
          "Módulos Retaguarda"
        ],
        "whatWeDo": "Verifica regras fiscais, relatórios e integrações contábeis.",
        "checklist": [
          "Teste de regressão na versão recente"
        ],
        "impact": "Mapeamento rápido de divergências de cálculo."
      }
    },
    {
      "id": "tech_gw_is_bug",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "Identificado que é Problema?",
      "subtitle": "Bug Confirmado?",
      "icon": "alert-circle",
      "x": 880,
      "y": 140,
      "details": {
        "summary": "Decisão se o comportamento é bug de código ou inconsistência de base.",
        "responsible": "Analista Técnico",
        "tools": [
          "Parecer Técnico"
        ],
        "whatWeDo": "Se for bug no código, abre QP. Se for base/uso, faz laudo com solução.",
        "checklist": [
          "Comportamento documentado em vídeo e logs"
        ],
        "impact": "Evita que a Engenharia gaste tempo com o que não é bug."
      }
    },
    {
      "id": "tech_detail_analysis",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Detalhar Chamado com Análise",
      "subtitle": "Laudo Técnico",
      "icon": "file-text",
      "x": 880,
      "y": 30,
      "details": {
        "summary": "Elaboração de laudo técnico explicando a causa do comportamento.",
        "responsible": "Analista Técnico",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Registra os testes efetuados, queries de correção e orientações.",
        "checklist": [
          "Script de correção validado",
          "Prints explicativos anexados"
        ],
        "impact": "Resposta de altíssimo valor técnico para a revenda/cliente."
      }
    },
    {
      "id": "tech_return_client",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Devolutiva para Revenda/Cliente",
      "subtitle": "Orientação e Solução",
      "icon": "send",
      "x": 1070,
      "y": 30,
      "details": {
        "summary": "Envio da resposta conclusiva com orientações de resolução.",
        "responsible": "Analista Técnico / Suporte",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "O cliente recebe o laudo e orientações para regularizar a operação.",
        "checklist": [
          "Validação com o solicitante"
        ],
        "impact": "Encerramento com satisfação e aprendizado compartilhado."
      }
    },
    {
      "id": "tech_end_not_bug",
      "lane": "analise_tecnica",
      "type": "end",
      "title": "Finalizar Demanda",
      "subtitle": "Sem Alteração de Código",
      "icon": "check-circle-2",
      "x": 1270,
      "y": 30,
      "details": {
        "summary": "Fechamento do chamado que não exigiu alteração de código.",
        "responsible": "Zendesk",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Ticket finalizado com métricas salvas.",
        "checklist": [
          "Status: Resolvido"
        ],
        "impact": "Métricas de resolução rápida preservadas."
      }
    },
    {
      "id": "tech_jira_access",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Acessar Jira",
      "subtitle": "Backlog de Engenharia",
      "icon": "external-link",
      "x": 1010,
      "y": 140,
      "details": {
        "summary": "Acesso à ferramenta de gestão ágil da engenharia.",
        "responsible": "Analista Técnico",
        "tools": [
          "Atlassian Jira"
        ],
        "whatWeDo": "Navega até o projeto correspondente ao módulo afetado.",
        "checklist": [
          "Projeto correto no Jira selecionado"
        ],
        "impact": "Ponte direta entre atendimento e desenvolvimento."
      }
    },
    {
      "id": "tech_open_qp",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Abrir QP",
      "subtitle": "Quality Problem",
      "icon": "plus-circle",
      "x": 1190,
      "y": 140,
      "details": {
        "summary": "Criação formal da issue de problema de qualidade.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira Issue Tracker"
        ],
        "whatWeDo": "Cria a issue classificando tipo, severidade, módulo e versão afetada.",
        "checklist": [
          "Campos obrigatórios preenchidos",
          "Versão afetada informada"
        ],
        "impact": "Entrada oficial no fluxo ágil do Dev."
      }
    },
    {
      "id": "tech_doc_qp",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Documentar QP",
      "subtitle": "Cenários e Testes Realizados",
      "icon": "file-code",
      "highlight": true,
      "x": 1370,
      "y": 140,
      "details": {
        "summary": "ETAPA DE OURO: Documentação detalhada para o desenvolvedor.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira Markdown",
          "Vídeos MP4",
          "Logs Tratados",
          "Bancos Sanitizados"
        ],
        "whatWeDo": "Insere passo a passo para reproduzir (1, 2, 3...), logs e banco.",
        "checklist": [
          "Passo a passo numerado sem ambiguidades",
          "Stack trace do log anexada",
          "Vídeo anexado",
          "Base restaurada disponível na rede para o dev"
        ],
        "impact": "Reduz o tempo de correção do Dev em até 70%."
      }
    },
    {
      "id": "tech_gw_type",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "QP de Ajuste ou Melhoria?",
      "subtitle": "Classificação",
      "icon": "git-branch",
      "x": 1570,
      "y": 140,
      "details": {
        "summary": "Bug vai direto para a fila do PO; Melhoria vai para estimativa.",
        "responsible": "Analista Técnico / PO da Análise",
        "tools": [
          "Jira"
        ],
        "whatWeDo": "Se for bug, vai para o PO. Se melhoria, vai para comitê de estimativa.",
        "checklist": [
          "Classificação correta de Issue Type"
        ],
        "impact": "Garante priorização adequada no roadmap."
      }
    },
    {
      "id": "tech_po_estimate",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "PO da Análise Discute QP",
      "subtitle": "Reunião de Estimativa",
      "icon": "users",
      "x": 1520,
      "y": 260,
      "details": {
        "summary": "Defesa técnica e de negócio da melhoria solicitada.",
        "responsible": "PO da Análise Técnica",
        "tools": [
          "Reunião de Estimativa / Refinement"
        ],
        "whatWeDo": "Apresenta volume de clientes impactados e benefício da melhoria.",
        "checklist": [
          "Volume de chamados correlatos",
          "Estimativa de Story Points"
        ],
        "impact": "Voz do cliente e da revenda representada na engenharia."
      }
    },
    {
      "id": "tech_gw_approved_est",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "QP Aprovada na Estimativa?",
      "subtitle": "Viabilidade",
      "icon": "check-circle",
      "x": 1720,
      "y": 260,
      "details": {
        "summary": "Decisão colegiada se a melhoria entra no roadmap.",
        "responsible": "Comitê de POs e Engenharia",
        "tools": [
          "Jira Roadmap"
        ],
        "whatWeDo": "Se aprovada, entra na fila do PO responsável.",
        "checklist": [
          "Alocação em release futuro"
        ],
        "impact": "Alinhamento transparente com clientes e revendas."
      }
    },
    {
      "id": "tech_send_po_queue",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Enviar QP para Fila do PO",
      "subtitle": "PO do PDV / Retaguarda",
      "icon": "inbox",
      "x": 1720,
      "y": 140,
      "details": {
        "summary": "Atribuição formal da QP ao Product Owner do módulo.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira Backlog"
        ],
        "whatWeDo": "A QP entra no backlog para ser priorizada e desenvolvida na sprint.",
        "checklist": [
          "Notificação ao PO responsável"
        ],
        "impact": "Início do ciclo de desenvolvimento."
      }
    },
    {
      "id": "tech_wait_dev_1",
      "lane": "analise_tecnica",
      "type": "event",
      "title": "Aguardar Devolutiva da QP",
      "subtitle": "Validação da Correção",
      "icon": "clock",
      "x": 1920,
      "y": 140,
      "details": {
        "summary": "Tempo de espera enquanto o Dev programa a correção.",
        "responsible": "Desenvolvimento / QA",
        "tools": [
          "Jira Sprint Board",
          "GitLab / GitHub"
        ],
        "whatWeDo": "Monitora os status de desenvolvimento e branch da correção.",
        "checklist": [
          "Acompanhamento de prazos de sprint"
        ],
        "impact": "Governança do tempo de ciclo do bug."
      }
    },
    {
      "id": "tech_gw_qp_completed",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "QP Concluída?",
      "subtitle": "Liberado pelo Dev",
      "icon": "code",
      "x": 2060,
      "y": 140,
      "details": {
        "summary": "Verificação se a build com a correção foi gerada.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira Status (Ready for QA)"
        ],
        "whatWeDo": "Se o dev finalizou, avança para verificação técnica.",
        "checklist": [
          "Versão da build gerada pelo pipeline CI/CD"
        ],
        "impact": "Gatilho para início da homologação técnica."
      }
    },
    {
      "id": "tech_verify_dev",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Verificar Retorno do Dev",
      "subtitle": "Leitura do Patch",
      "icon": "file-check",
      "x": 2010,
      "y": 260,
      "details": {
        "summary": "Leitura do comentário do desenvolvedor sobre a alteração.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira / Git Commit Notes"
        ],
        "whatWeDo": "Entende o que foi alterado e o impacto colateral potencial.",
        "checklist": [
          "Entender a lógica do ajuste aplicado"
        ],
        "impact": "Permite planejar testes de regressão direcionados."
      }
    },
    {
      "id": "tech_sim_fixed",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Simular na Versão Corrigida",
      "subtitle": "Testes de Homologação",
      "icon": "play-circle",
      "highlight": true,
      "x": 2190,
      "y": 260,
      "details": {
        "summary": "Teste prático da correção na base do cliente e em bases padrão.",
        "responsible": "Analista Técnico",
        "tools": [
          "Ambiente de Homologação"
        ],
        "whatWeDo": "Executa o cenário original e testa casos de borda e regressão.",
        "checklist": [
          "O bug original foi 100% extinto?",
          "As rotinas vizinhas continuam funcionando?"
        ],
        "impact": "Garantia absoluta de qualidade antes da liberação ao cliente."
      }
    },
    {
      "id": "tech_gw_homologated",
      "lane": "analise_tecnica",
      "type": "decision",
      "title": "QP Homologada?",
      "subtitle": "Aprovado no Reteste",
      "icon": "shield-check",
      "x": 2390,
      "y": 260,
      "details": {
        "summary": "Decisão rigorosa de homologação: aprovação definitiva ou devolução.",
        "responsible": "Analista Técnico",
        "tools": [
          "Critérios de Homologação"
        ],
        "whatWeDo": "Se passar 100%, homologa e libera. Se falhar, reprova para o Dev.",
        "checklist": [
          "Evidências do teste com sucesso anexadas"
        ],
        "impact": "Blindagem do cliente contra correções incompletas."
      }
    },
    {
      "id": "tech_homologate_success",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Homologar QP e Retornar Chamado",
      "subtitle": "Aprovação Final",
      "icon": "award",
      "highlight": true,
      "x": 2500,
      "y": 260,
      "details": {
        "summary": "Conclusão com chave de ouro do ciclo da demanda.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira (Status: Closed / Released)",
          "Zendesk"
        ],
        "whatWeDo": "Homologa a QP e responde ao ticket com a versão de atualização.",
        "checklist": [
          "Versão oficial liberada registrada",
          "Orientação de download/atualização enviada ao cliente"
        ],
        "impact": "Entrega de valor real com resolução definitiva."
      }
    },
    {
      "id": "tech_end_success",
      "lane": "analise_tecnica",
      "type": "end",
      "title": "Finalizar Demanda",
      "subtitle": "Sucesso e Qualidade",
      "icon": "check-circle",
      "x": 2700,
      "y": 260,
      "details": {
        "summary": "Encerramento formal do chamado e arquivamento.",
        "responsible": "Zendesk / Suporte",
        "tools": [
          "Zendesk"
        ],
        "whatWeDo": "Demanda concluída, alimentando métricas de qualidade de software.",
        "checklist": [
          "Pesquisa de satisfação disparada"
        ],
        "impact": "Retroalimentação positiva da qualidade do produto."
      }
    },
    {
      "id": "tech_doc_failed_tests",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Documentar Testes Realizados",
      "subtitle": "Report de Falha no Reteste",
      "icon": "alert-octagon",
      "x": 2340,
      "y": 370,
      "details": {
        "summary": "Registro de evidências da falha na versão compilada.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira / Gravador de Tela"
        ],
        "whatWeDo": "Grava vídeo e logs demonstrando onde a correção falhou.",
        "checklist": [
          "Logs com a nova falha",
          "Vídeo comprovando a não conformidade"
        ],
        "impact": "Evita discussão de 'na minha máquina funciona'."
      }
    },
    {
      "id": "tech_return_dev_failed",
      "lane": "analise_tecnica",
      "type": "task",
      "title": "Retornar ao Tester/Dev",
      "subtitle": "QP Não Homologada",
      "icon": "rotate-ccw",
      "x": 2530,
      "y": 370,
      "details": {
        "summary": "Devolução da QP no Jira para o desenvolvedor.",
        "responsible": "Analista Técnico",
        "tools": [
          "Jira (Status: Reopened / Failed QA)"
        ],
        "whatWeDo": "Reabre a issue com as evidências do teste que falhou.",
        "checklist": [
          "Notificação ao desenvolvedor e PO"
        ],
        "impact": "Prioridade imediata no retrabalho do desenvolvedor."
      }
    },
    {
      "id": "tech_wait_dev_2",
      "lane": "analise_tecnica",
      "type": "event",
      "title": "Aguardar Nova Devolutiva",
      "subtitle": "Re-correção",
      "icon": "clock",
      "x": 2720,
      "y": 370,
      "details": {
        "summary": "Espera pelo segundo patch de correção do Dev.",
        "responsible": "Desenvolvimento",
        "tools": [
          "Jira"
        ],
        "whatWeDo": "Acompanha a reanálise do desenvolvedor.",
        "checklist": [
          "Nova build gerada"
        ],
        "impact": "Retorno ao ciclo de homologação."
      }
    }
  ],
  "connections": [
    {
      "from": "sup_start",
      "to": "sup_zendesk",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "sup_zendesk",
      "to": "sup_interact",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "sup_interact",
      "to": "sup_gw_need_analysis",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "sup_gw_need_analysis",
      "to": "sup_resolve_direct",
      "fromPort": "top",
      "toPort": "bottom",
      "label": "NÃO"
    },
    {
      "from": "sup_gw_need_analysis",
      "to": "sup_simulate",
      "fromPort": "right",
      "toPort": "left",
      "label": "SIM"
    },
    {
      "from": "sup_resolve_direct",
      "to": "sup_end_1",
      "fromPort": "right",
      "toPort": "top",
      "waypoints": [
        {
          "x": 1402,
          "y": 48,
          "lane": "suporte"
        }
      ]
    },
    {
      "from": "sup_simulate",
      "to": "sup_gw_pdv_pay",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "sup_gw_pdv_pay",
      "to": "sup_collect_evidence",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM",
      "waypoints": [
        {
          "x": 894,
          "y": 200,
          "lane": "suporte"
        },
        {
          "x": 1012,
          "y": 200,
          "lane": "suporte"
        }
      ]
    },
    {
      "from": "sup_gw_pdv_pay",
      "to": "sup_gw_need_forward",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "sup_gw_need_forward",
      "to": "sup_resolve_direct_2",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "sup_gw_need_forward",
      "to": "sup_collect_evidence",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM",
      "waypoints": [
        {
          "x": 1044,
          "y": 200,
          "lane": "suporte"
        },
        {
          "x": 1012,
          "y": 200,
          "lane": "suporte"
        }
      ]
    },
    {
      "from": "sup_resolve_direct_2",
      "to": "sup_end_1",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "sup_collect_evidence",
      "to": "sup_forward_focal",
      "fromPort": "bottom",
      "toPort": "top"
    },
    {
      "from": "sup_forward_focal",
      "to": "sup_link_p01",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_link_p01",
      "to": "focal_analyze",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_analyze",
      "to": "focal_gw_test_db",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_gw_test_db",
      "to": "focal_check_qp",
      "fromPort": "right",
      "toPort": "left",
      "label": "SIM"
    },
    {
      "from": "focal_gw_test_db",
      "to": "focal_sim_client_db",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "NÃO",
      "waypoints": [
        {
          "x": 364,
          "y": 135,
          "lane": "ponto_focal"
        },
        {
          "x": 362,
          "y": 135,
          "lane": "ponto_focal"
        }
      ]
    },
    {
      "from": "focal_check_qp",
      "to": "focal_sim_test_db",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_sim_test_db",
      "to": "focal_gw_need_deep",
      "fromPort": "right",
      "toPort": "top",
      "waypoints": [
        {
          "x": 824,
          "y": 88,
          "lane": "ponto_focal"
        }
      ]
    },
    {
      "from": "focal_sim_client_db",
      "to": "focal_gw_found_qp",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_gw_found_qp",
      "to": "focal_gw_need_deep",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "focal_gw_found_qp",
      "to": "focal_gw_qp_done",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM"
    },
    {
      "from": "focal_gw_qp_done",
      "to": "focal_link_qp",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "focal_gw_qp_done",
      "to": "focal_sim_ticket",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM"
    },
    {
      "from": "focal_link_qp",
      "to": "focal_approve",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_sim_ticket",
      "to": "focal_reject",
      "fromPort": "right",
      "toPort": "bottom",
      "waypoints": [
        {
          "x": 584,
          "y": 440,
          "lane": "ponto_focal"
        },
        {
          "x": 1032,
          "y": 440,
          "lane": "ponto_focal"
        }
      ]
    },
    {
      "from": "focal_gw_need_deep",
      "to": "focal_approve",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM"
    },
    {
      "from": "focal_gw_need_deep",
      "to": "focal_reject",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "focal_approve",
      "to": "focal_link_p02",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_reject",
      "to": "focal_reject_detail",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "focal_reject_detail",
      "to": "sup_resolve_direct_2",
      "fromPort": "top",
      "toPort": "bottom",
      "label": "Retorno",
      "waypoints": [
        {
          "x": 1232,
          "y": -20,
          "lane": "ponto_focal"
        },
        {
          "x": 1252,
          "y": 220,
          "lane": "suporte"
        }
      ]
    },
    {
      "from": "tech_link_p02",
      "to": "tech_analyze",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_analyze",
      "to": "tech_gw_pdv_pay",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_pdv_pay",
      "to": "tech_sim_diff_versions",
      "fromPort": "right",
      "toPort": "left",
      "label": "NÃO"
    },
    {
      "from": "tech_gw_pdv_pay",
      "to": "tech_download_assets",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM",
      "waypoints": [
        {
          "x": 364,
          "y": 220,
          "lane": "analise_tecnica"
        },
        {
          "x": 362,
          "y": 220,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_download_assets",
      "to": "tech_restore_logs",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_restore_logs",
      "to": "tech_sim_env",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_sim_diff_versions",
      "to": "tech_gw_is_bug",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_sim_env",
      "to": "tech_gw_is_bug",
      "fromPort": "right",
      "toPort": "bottom",
      "waypoints": [
        {
          "x": 904,
          "y": 288,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_gw_is_bug",
      "to": "tech_detail_analysis",
      "fromPort": "top",
      "toPort": "bottom",
      "label": "NÃO"
    },
    {
      "from": "tech_detail_analysis",
      "to": "tech_return_client",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_return_client",
      "to": "tech_end_not_bug",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_is_bug",
      "to": "tech_jira_access",
      "fromPort": "right",
      "toPort": "left",
      "label": "SIM"
    },
    {
      "from": "tech_jira_access",
      "to": "tech_open_qp",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_open_qp",
      "to": "tech_doc_qp",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_doc_qp",
      "to": "tech_gw_type",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_type",
      "to": "tech_send_po_queue",
      "fromPort": "right",
      "toPort": "left",
      "label": "SIM (Ajuste)"
    },
    {
      "from": "tech_gw_type",
      "to": "tech_po_estimate",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "NÃO (Melhoria)",
      "waypoints": [
        {
          "x": 1594,
          "y": 220,
          "lane": "analise_tecnica"
        },
        {
          "x": 1592,
          "y": 220,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_po_estimate",
      "to": "tech_gw_approved_est",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_approved_est",
      "to": "tech_send_po_queue",
      "fromPort": "top",
      "toPort": "bottom",
      "label": "SIM"
    },
    {
      "from": "tech_gw_approved_est",
      "to": "tech_end_success",
      "fromPort": "bottom",
      "toPort": "bottom",
      "label": "NÃO",
      "waypoints": [
        {
          "x": 1744,
          "y": 440,
          "lane": "analise_tecnica"
        },
        {
          "x": 2722,
          "y": 440,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_send_po_queue",
      "to": "tech_wait_dev_1",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_wait_dev_1",
      "to": "tech_gw_qp_completed",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_qp_completed",
      "to": "tech_wait_dev_1",
      "fromPort": "top",
      "toPort": "top",
      "label": "NÃO",
      "waypoints": [
        {
          "x": 2084,
          "y": 100,
          "lane": "analise_tecnica"
        },
        {
          "x": 1942,
          "y": 100,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_gw_qp_completed",
      "to": "tech_verify_dev",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "SIM"
    },
    {
      "from": "tech_verify_dev",
      "to": "tech_sim_fixed",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_sim_fixed",
      "to": "tech_gw_homologated",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_gw_homologated",
      "to": "tech_homologate_success",
      "fromPort": "right",
      "toPort": "left",
      "label": "SIM"
    },
    {
      "from": "tech_gw_homologated",
      "to": "tech_doc_failed_tests",
      "fromPort": "bottom",
      "toPort": "top",
      "label": "NÃO"
    },
    {
      "from": "tech_doc_failed_tests",
      "to": "tech_return_dev_failed",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_return_dev_failed",
      "to": "tech_wait_dev_2",
      "fromPort": "right",
      "toPort": "left"
    },
    {
      "from": "tech_wait_dev_2",
      "to": "tech_gw_qp_completed",
      "fromPort": "bottom",
      "toPort": "bottom",
      "label": "Reanálise Dev",
      "waypoints": [
        {
          "x": 2742,
          "y": 460,
          "lane": "analise_tecnica"
        },
        {
          "x": 2084,
          "y": 460,
          "lane": "analise_tecnica"
        }
      ]
    },
    {
      "from": "tech_homologate_success",
      "to": "tech_end_success",
      "fromPort": "right",
      "toPort": "left"
    }
  ],
  "supportAreas": [
    {
      "id": "dev",
      "name": "DESENVOLVIMENTO",
      "icon": "code-2",
      "color": "#38BDF8",
      "summary": "Recebe QPs prontas, testadas e com passo a passo cirúrgico.",
      "value": "A Análise Técnica elimina 100% de ruído e 'não reproduz', permitindo que os engenheiros foquem exclusivamente em codificar a solução."
    },
    {
      "id": "impl",
      "name": "IMPLEMENTAÇÃO",
      "icon": "rocket",
      "color": "#818CF8",
      "summary": "Suporte especializado para novas operações e revendas.",
      "value": "Validação prévia de cenários complexos de migração, bancos legados e parametrizações fiscais específicas."
    },
    {
      "id": "qa",
      "name": "TESTE (QA)",
      "icon": "check-circle-2",
      "color": "#34D399",
      "summary": "Parceria direta em homologação de cenários de borda.",
      "value": "Compartilhamento de bases reais de clientes sanitizadas para criação de novos testes automatizados de regressão."
    },
    {
      "id": "revenda",
      "name": "SUCESSO DA REVENDA",
      "icon": "heart-handshake",
      "color": "#F59E0B",
      "summary": "Empoderamento técnico das revendas parceiras.",
      "value": "Devolutivas ricas que educam a revenda, aumentando a autonomia dos técnicos de campo e a satisfação do cliente final."
    },
    {
      "id": "comercial",
      "name": "COMERCIAL",
      "icon": "trending-up",
      "color": "#EC4899",
      "summary": "Retroalimentação de demandas de clientes-chave.",
      "value": "Acompanhamento ágil de tickets críticos de clientes em fase de fechamento comercial ou renovação de contrato."
    },
    {
      "id": "financeiro",
      "name": "FINANCEIRO",
      "icon": "shield-alert",
      "color": "#10B981",
      "summary": "Blindagem de dados e integridade em transações PAY/TEF.",
      "value": "Diagnóstico profundo de quebras de conciliação fiscal e pagamentos com rastreabilidade completa de logs criptografados."
    }
  ],
  "presentationSteps": [
    {
      "id": "intro",
      "title": "Visão Geral & Nosso Papel Estratégico",
      "chapter": "Capítulo 1 de 6",
      "subtitle": "A Análise Técnica como Ponte de Alta Precisão entre Atendimento e Engenharia",
      "focusNodes": [
        "sup_start",
        "focal_link_p01",
        "tech_link_p02"
      ],
      "badge": "Panorama Geral",
      "badgeColor": "#38BDF8",
      "content": {
        "headline": "Transformando relatos de suporte em engenharia de diagnóstico estruturada",
        "pillars": [
          {
            "icon": "shield-check",
            "title": "Blindagem do Dev",
            "desc": "Filtramos chamados incompletos para que os desenvolvedores foquem 100% em codificar correções definitivas.",
            "color": "#38BDF8"
          },
          {
            "icon": "microscope",
            "title": "Diagnóstico Científico",
            "desc": "Restauramos a base real do cliente e mineramos logs em nível de milissegundo para encontrar a causa raiz.",
            "color": "#818CF8"
          },
          {
            "icon": "award",
            "title": "Qualidade Garantida",
            "desc": "Homologamos rigorosamente cada alteração antes de qualquer liberação para revendas e clientes finais.",
            "color": "#34D399"
          }
        ],
        "points": [
          "O time de Análise Técnica atua como um laboratório avançado de reprodução, diagnóstico e garantia de qualidade do software.",
          "Reduzimos o tempo de resolução total transformando chamados vagos em QPs cirúrgicas prontas para desenvolvimento.",
          "Garantimos que a Revenda e o Cliente recebam laudos técnicos transparentes, scripts de correção seguros e histórico estruturado."
        ],
        "guidelines": {
          "do": "Entender que o chamado com diagnóstico de qualidade economiza dias de retrabalho para toda a empresa.",
          "dont": "Encaminhar chamados como 'repassador de e-mails' sem validação prévia dos sintomas e evidências."
        },
        "kpi": {
          "label": "Redução de Retrabalho no Dev",
          "value": "Até 70%"
        }
      },
      "speakerNotes": "Destacar para o time que a Análise Técnica é parceira direta do Suporte: nosso objetivo conjunto é resolver o cliente na raiz e nunca deixar um bug retornar."
    },
    {
      "id": "step_suporte",
      "title": "Fase 1: Entrada, Triagem & Coleta de Evidências no Suporte",
      "chapter": "Capítulo 2 de 6",
      "subtitle": "A Qualidade da Solução Depende Diretamente da Precisão da Coleta Inicial",
      "focusNodes": [
        "sup_start",
        "sup_zendesk",
        "sup_interact",
        "sup_gw_need_analysis",
        "sup_simulate",
        "sup_gw_pdv_pay",
        "sup_collect_evidence",
        "sup_forward_focal",
        "sup_resolve_direct_2",
        "sup_end_1"
      ],
      "badge": "Raia Suporte (N1/N2)",
      "badgeColor": "#38BDF8",
      "content": {
        "headline": "O Suporte é o primeiro filtro e o responsável pela coleta dos insumos de reprodução",
        "pillars": [
          {
            "icon": "database",
            "title": "Backup do Banco",
            "desc": "Arquivo .BAK ou .DUMP recente do cliente. Sem o banco, simular comportamentos específicos é inviável.",
            "color": "#38BDF8"
          },
          {
            "icon": "file-text",
            "title": "Logs de Serviços",
            "desc": "Logs do PDV, PAY/TEF, Integra e Automação da mesma data/hora do evento relatado pelo cliente.",
            "color": "#818CF8"
          },
          {
            "icon": "video",
            "title": "Vídeo da Rotina",
            "desc": "Gravação curta demonstrando exatamente o passo a passo que gerou o comportamento ou erro.",
            "color": "#F59E0B"
          }
        ],
        "points": [
          "O analista de suporte realiza a triagem inicial: valida se a questão é dúvida de uso, parametrização incorreta ou falha de sistema.",
          "Para chamados de PDV/PAY, a coleta do PACOTE DE EVIDÊNCIAS é mandatória antes de qualquer escalonamento.",
          "A simulação interna prévia no suporte descarta problemas locais da máquina do cliente ou inconsistências de rede."
        ],
        "guidelines": {
          "do": "Coletar o pacote completo (Backup + Logs de Serviços + Vídeo) e descrever o Comportamento Esperado vs Ocorrido.",
          "dont": "Enviar tickets com apenas 'Erro no PDV' ou 'Cliente reclamou de lentidão' sem anexos e sem passo a passo."
        },
        "kpi": {
          "label": "Insumos Obrigatórios Coletados",
          "value": "6 Itens"
        }
      },
      "speakerNotes": "Enfatizar com carinho e clareza para o Suporte: um chamado sem logs de serviços é impossível de analisar e será devolvido pelo Ponto Focal."
    },
    {
      "id": "step_ponto_focal",
      "title": "Fase 2: O Ponto Focal como Guardião da Esteira",
      "chapter": "Capítulo 3 de 6",
      "subtitle": "Triagem Inteligente, Cruzamento com QPs Existentes e Feedback Educativo",
      "focusNodes": [
        "focal_link_p01",
        "focal_analyze",
        "focal_gw_test_db",
        "focal_check_qp",
        "focal_sim_test_db",
        "focal_gw_found_qp",
        "focal_gw_need_deep",
        "focal_reject",
        "focal_approve"
      ],
      "badge": "Raia Ponto Focal",
      "badgeColor": "#818CF8",
      "content": {
        "headline": "Garantindo que apenas demandas estruturadas e inéditas cheguem à Análise Técnica",
        "pillars": [
          {
            "icon": "check-circle-2",
            "title": "Auditoria de Insumos",
            "desc": "Verifica se os arquivos anexados pelo suporte estão íntegros, legíveis e com o vídeo da rotina.",
            "color": "#818CF8"
          },
          {
            "icon": "search",
            "title": "Busca de QPs Ativas",
            "desc": "Pesquisa no Jira se o problema já foi identificado e está sendo corrigido pelo Desenvolvimento.",
            "color": "#38BDF8"
          },
          {
            "icon": "message-square-dashed",
            "title": "Devolutiva Educativa",
            "desc": "Se faltarem evidências, o ticket é devolvido com checklist claro do que falta coletar.",
            "color": "#F43F5E"
          }
        ],
        "points": [
          "O Ponto Focal atua como o 'Gatekeeper' de qualidade: protege a capacidade do time de análise de ser inundado por chamados incompletos.",
          "Quando o bug já é conhecido, vincula o chamado à QP existente imediatamente, economizando horas de investigação desnecessária.",
          "Apenas chamados que exigem diagnóstico aprofundado e possuem evidências completas recebem o selo P02 (Aprovado)."
        ],
        "guidelines": {
          "do": "Encarar a devolução de chamado como alinhamento de qualidade para acelerar o processo e nunca como bloqueio.",
          "dont": "Insistir no envio de chamados sem evidências, pois isso gera fila artificial e atrasa chamados prioritários."
        },
        "kpi": {
          "label": "Economia de Tempo por QP Mapeado",
          "value": "2h a 8h"
        }
      },
      "speakerNotes": "Explicar que o Ponto Focal é o melhor amigo do Suporte e da Análise: ele evita que o analista perca tempo investigando algo que o Dev já está corrigindo."
    },
    {
      "id": "step_analise_deep",
      "title": "Fase 3: Laboratório de Diagnóstico & Abertura de QP",
      "chapter": "Capítulo 4 de 6",
      "subtitle": "Restauração de Ambientes, Mineração de Logs e Especificação Cirúrgica no Jira",
      "focusNodes": [
        "tech_link_p02",
        "tech_analyze",
        "tech_download_assets",
        "tech_restore_logs",
        "tech_sim_env",
        "tech_gw_is_bug",
        "tech_jira_access",
        "tech_open_qp",
        "tech_doc_qp"
      ],
      "badge": "Raia Análise Técnica",
      "badgeColor": "#34D399",
      "content": {
        "headline": "Engenharia de precisão para reproduzir a falha e isolar a causa raiz",
        "pillars": [
          {
            "icon": "server",
            "title": "Sandbox Isolada",
            "desc": "Restauração do banco em servidor SQL seguro e configuração de simuladores fiscais/TEF.",
            "color": "#34D399"
          },
          {
            "icon": "terminal",
            "title": "Mineração de Logs",
            "desc": "Análise profunda de StackTraces, exceções e concorrência de queries SQL.",
            "color": "#38BDF8"
          },
          {
            "icon": "file-code",
            "title": "Documentação de QP",
            "desc": "Criação de issue completa no Jira com passo a passo 100% reproduzível e evidências anexadas.",
            "color": "#818CF8"
          }
        ],
        "points": [
          "O Analista Técnico baixa o banco e os logs, restaurando exatamente o cenário vivido pelo cliente na ponta.",
          "Se for inconsistência de base ou uso operacional, elabora um laudo técnico com a query de ajuste ou orientação para o Suporte/Cliente.",
          "Se for confirmado um bug de código, abre a QP no Jira com vídeo da reprodução, logs destacados e banco preparado para o desenvolvedor."
        ],
        "guidelines": {
          "do": "Entregar para o Dev um bug 100% mastigado, onde o desenvolvedor não precisa perder nenhum segundo tentando adivinhar como reproduzir.",
          "dont": "Abrir tarefas sem evidências técnicas de causa-raiz no Jira."
        },
        "kpi": {
          "label": "Taxa de Reprodução no Dev",
          "value": "100% Clara"
        }
      },
      "speakerNotes": "Demonstrar aos participantes o valor de uma QP perfeita: o desenvolvedor abre o Jira, roda o ambiente pronto e corrige o código em minutos."
    },
    {
      "id": "step_dev_cycle",
      "title": "Fase 4: O Ciclo com a Engenharia & Homologação Rigorosa",
      "chapter": "Capítulo 5 de 6",
      "subtitle": "Comitê de Estimativa com POs, Fila de Desenvolvimento e Reteste com Dados Reais",
      "focusNodes": [
        "tech_gw_type",
        "tech_po_estimate",
        "tech_send_po_queue",
        "tech_wait_dev_1",
        "tech_gw_qp_completed",
        "tech_verify_dev",
        "tech_sim_fixed",
        "tech_gw_homologated",
        "tech_doc_failed_tests",
        "tech_return_dev_failed"
      ],
      "badge": "Ciclo de Homologação",
      "badgeColor": "#F59E0B",
      "content": {
        "headline": "Garantindo que apenas correções 100% testadas cheguem à produção",
        "pillars": [
          {
            "icon": "users",
            "title": "Comitê de POs",
            "desc": "Defendemos a prioridade das melhorias e bugs junto aos Product Owners para entrada na Sprint.",
            "color": "#F59E0B"
          },
          {
            "icon": "git-pull-request",
            "title": "Reteste com Base Real",
            "desc": "Assim que o Dev conclui a alteração, retestamos a rotina na versão gerada usando o banco do cliente.",
            "color": "#34D399"
          },
          {
            "icon": "shield-alert",
            "title": "Controle de Regressão",
            "desc": "Se a correção quebrar outra rotina ou falhar, a QP é reprovada na hora com feedback técnico.",
            "color": "#F43F5E"
          }
        ],
        "points": [
          "A Análise Técnica não apenas abre o chamado: acompanhamos todo o ciclo de vida do desenvolvimento no Jira.",
          "O PO da Análise Técnica participa das reuniões de estimativa defendendo o impacto da demanda para o negócio.",
          "A homologação é o nosso selo de confiança: nenhuma correção vai para a esteira de release sem validação rigorosa."
        ],
        "guidelines": {
          "do": "Validar tanto o cenário principal corrigido quanto os cenários adjacentes para garantir que não houve efeitos colaterais.",
          "dont": "Aprovar uma correção apenas 'no papel' sem simulação prática na máquina de testes."
        },
        "kpi": {
          "label": "Zero Regressão em Produção",
          "value": "Garantia QA"
        }
      },
      "speakerNotes": "Reforçar para o time que a Análise Técnica é o último escudo da empresa antes do software chegar ao cliente final."
    },
    {
      "id": "step_conclusion",
      "title": "Fase 5: Fechamento, Devolutiva & Impacto no Ecossistema",
      "chapter": "Capítulo 6 de 6",
      "subtitle": "Valor Agregado para a Revenda, Comercial, QA e Sucesso do Cliente",
      "focusNodes": [
        "tech_homologate_success",
        "tech_end_success",
        "dev",
        "impl",
        "qa",
        "revenda",
        "comercial",
        "financeiro"
      ],
      "badge": "Impacto & Resultados",
      "badgeColor": "#10B981",
      "content": {
        "headline": "O ciclo completo gerando transparência, satisfação e evolução contínua do produto",
        "pillars": [
          {
            "icon": "store",
            "title": "Sucesso da Revenda",
            "desc": "A revenda recebe laudo detalhado com a versão oficial corrigida e orientações claras de atualização.",
            "color": "#10B981"
          },
          {
            "icon": "trending-up",
            "title": "Comercial & Retenção",
            "desc": "Resoluções estruturadas geram confiança na marca, aumentam o NPS e evitam cancelamentos (churn).",
            "color": "#38BDF8"
          },
          {
            "icon": "layers",
            "title": "Sinergia Total",
            "desc": "Suporte, Análise, Dev, QA e POs trabalham em uma esteira única, sincronizada e sem atritos.",
            "color": "#818CF8"
          }
        ],
        "points": [
          "O ticket é finalizado no Zendesk com o número da versão homologada e documentação de release notes.",
          "Os dados gerados alimentam a base de conhecimento (Playbooks e FAQs), empoderando o Suporte N1 para resolver casos similares ainda mais rápido.",
          "As Áreas de Apoio operam com previsibilidade, confiança e foco no crescimento do negócio."
        ],
        "guidelines": {
          "do": "Celebrar as entregas em conjunto e utilizar os aprendizados para fortalecer os treinamentos da equipe.",
          "dont": "Deixar o cliente sem posicionamento formal após a liberação da versão corrigida."
        },
        "kpi": {
          "label": "Satisfação e Confiabilidade",
          "value": "Nível Máximo"
        }
      },
      "speakerNotes": "Concluir a apresentação abrindo para perguntas da equipe e convidando todos a explorar o Mapa Panorâmico BPMN e o Simulador de Cenários."
    }
  ],
  "scenarios": [
    {
      "id": "scenario_rejected",
      "title": "Cenário 1: Chamado Incompleto / Sem Logs (Retrabalho)",
      "tag": "Alerta de Processo",
      "color": "#F43F5E",
      "icon": "alert-octagon",
      "description": "Cliente relata 'Erro no PDV ao finalizar venda'. Suporte abre ticket sem anexar logs dos serviços nem vídeo da rotina.",
      "path": [
        "sup_start",
        "sup_zendesk",
        "sup_interact",
        "sup_gw_need_analysis",
        "sup_simulate",
        "sup_gw_pdv_pay",
        "sup_collect_evidence",
        "sup_forward_focal",
        "sup_link_p01",
        "focal_link_p01",
        "focal_analyze",
        "focal_gw_need_deep",
        "focal_reject",
        "focal_reject_detail",
        "sup_resolve_direct_2",
        "sup_end_1"
      ],
      "outcome": {
        "status": "Ticket Devolvido com Justificativa",
        "impact": "Tempo perdido de 4 a 12 horas por falta de insumos obrigatórios.",
        "lesson": "Se o suporte tivesse coletado os logs na primeira interação, o chamado seguiria direto para a análise sem retrabalho."
      }
    },
    {
      "id": "scenario_bug_success",
      "title": "Cenário 2: Bug Crítico de PDV/PAY com Pacote Completo (Sucesso)",
      "tag": "Fluxo Ideal de Engenharia",
      "color": "#34D399",
      "icon": "check-circle-2",
      "description": "Revenda reporta rejeição de TEF com backup, logs de PDV/PAY e vídeo anexados corretamente.",
      "path": [
        "sup_start",
        "sup_zendesk",
        "sup_interact",
        "sup_gw_need_analysis",
        "sup_simulate",
        "sup_gw_pdv_pay",
        "sup_collect_evidence",
        "sup_forward_focal",
        "sup_link_p01",
        "focal_link_p01",
        "focal_analyze",
        "focal_gw_test_db",
        "focal_sim_client_db",
        "focal_gw_found_qp",
        "focal_gw_need_deep",
        "focal_approve",
        "focal_link_p02",
        "tech_link_p02",
        "tech_analyze",
        "tech_gw_pdv_pay",
        "tech_download_assets",
        "tech_restore_logs",
        "tech_sim_env",
        "tech_gw_is_bug",
        "tech_jira_access",
        "tech_open_qp",
        "tech_doc_qp",
        "tech_gw_type",
        "tech_send_po_queue",
        "tech_wait_dev_1",
        "tech_gw_qp_completed",
        "tech_verify_dev",
        "tech_sim_fixed",
        "tech_gw_homologated",
        "tech_homologate_success",
        "tech_end_success"
      ],
      "outcome": {
        "status": "QP Corrigida, Homologada e Liberada",
        "impact": "Resolução cirúrgica sem retrabalho em menos de 1 sprint.",
        "lesson": "Insumos perfeitos aceleraram o diagnóstico da Análise e permitiram correção relâmpago no Dev."
      }
    },
    {
      "id": "scenario_existing_qp",
      "title": "Cenário 3: Problema Já Mapeado em QP Existente (Atalho)",
      "tag": "Eficiência & Agilidade",
      "color": "#38BDF8",
      "icon": "git-merge",
      "description": "Cliente reporta lentidão no fechamento fiscal. Ponto Focal identifica que a equipe de dev já está concluindo a QP no Jira.",
      "path": [
        "sup_start",
        "sup_zendesk",
        "sup_interact",
        "sup_gw_need_analysis",
        "sup_simulate",
        "sup_gw_pdv_pay",
        "sup_collect_evidence",
        "sup_forward_focal",
        "sup_link_p01",
        "focal_link_p01",
        "focal_analyze",
        "focal_gw_test_db",
        "focal_sim_client_db",
        "focal_gw_found_qp",
        "focal_gw_qp_done",
        "focal_link_qp",
        "focal_approve",
        "focal_link_p02"
      ],
      "outcome": {
        "status": "Chamado Vinculado a QP Existente",
        "impact": "Zero tempo de diagnóstico desperdiçado.",
        "lesson": "O Ponto Focal poupou horas de investigação desnecessária associando o ticket à issue ativa."
      }
    },
    {
      "id": "scenario_feature_request",
      "title": "Cenário 4: Solicitação de Melhoria de Retaguarda (Roadmap)",
      "tag": "Evolução do Produto",
      "color": "#F59E0B",
      "icon": "lightbulb",
      "description": "Revenda solicita novo filtro no relatório de DRE com base nas demandas de múltiplos clientes.",
      "path": [
        "sup_start",
        "sup_zendesk",
        "sup_interact",
        "sup_gw_need_analysis",
        "sup_simulate",
        "sup_gw_pdv_pay",
        "sup_gw_need_forward",
        "sup_collect_evidence",
        "sup_forward_focal",
        "sup_link_p01",
        "focal_link_p01",
        "focal_analyze",
        "focal_gw_test_db",
        "focal_check_qp",
        "focal_sim_test_db",
        "focal_gw_need_deep",
        "focal_approve",
        "focal_link_p02",
        "tech_link_p02",
        "tech_analyze",
        "tech_gw_pdv_pay",
        "tech_sim_diff_versions",
        "tech_gw_is_bug",
        "tech_jira_access",
        "tech_open_qp",
        "tech_doc_qp",
        "tech_gw_type",
        "tech_po_estimate",
        "tech_gw_approved_est",
        "tech_send_po_queue"
      ],
      "outcome": {
        "status": "Melhoria Aprovada em Comitê com POs",
        "impact": "Demanda do cliente transformada em inovação oficial no produto.",
        "lesson": "O PO da Análise defendeu a viabilidade técnica e o caso de negócio no comitê de estimativa."
      }
    }
  ],
  "evidencePlaybook": [
    {
      "module": "PDV (Frente de Caixa)",
      "icon": "monitor",
      "color": "#38BDF8",
      "items": [
        {
          "name": "Log do PDV",
          "path": "C:\\Sistema\\PDV\\Logs\\PDV_YYYYMMDD.log",
          "desc": "Registra cada evento de tecla, leitor de código de barras e emissão fiscal."
        },
        {
          "name": "Backup do Banco Local",
          "path": "C:\\Sistema\\PDV\\Data\\PDV.sqlite / .FDB / .BAK",
          "desc": "Cópia compactada dos dados locais do terminal."
        },
        {
          "name": "Log do Integra / Sincronizador",
          "path": "C:\\Sistema\\PDV\\Logs\\Integra.log",
          "desc": "Histórico de comunicação entre PDV e Retaguarda."
        },
        {
          "name": "Vídeo da Rotina",
          "path": "Gravação MP4 (OBS / Windows Game Bar)",
          "desc": "Comprovação visual da tela e do comportamento do PDV."
        }
      ]
    },
    {
      "module": "PAY / TEF (Pagamentos Eletrônicos)",
      "icon": "credit-card",
      "color": "#10B981",
      "items": [
        {
          "name": "Log do PAY / Gerenciador TEF",
          "path": "C:\\Client\\Logs\\TEF_YYYYMMDD.log",
          "desc": "Rastreio das transações com adquirentes e pinpad."
        },
        {
          "name": "Log da Automação Comercial",
          "path": "C:\\Sistema\\Logs\\Automacao.log",
          "desc": "Comunicação entre o PDV e a DLL do TEF."
        },
        {
          "name": "Comprovante / NSU da Transação",
          "path": "PDF / Foto do Cupom TEF",
          "desc": "Identificador único da operadora para rastreio no gateway."
        }
      ]
    },
    {
      "module": "Retaguarda & Fiscal",
      "icon": "server",
      "color": "#818CF8",
      "items": [
        {
          "name": "Backup Completo do Banco (SQL/PG)",
          "path": "Arquivo .BAK ou .DUMP recente",
          "desc": "Permite à Análise restaurar a base idêntica do cliente no laboratório."
        },
        {
          "name": "Log de Serviços do Windows",
          "path": "C:\\Sistema\\Services\\Logs\\*.log",
          "desc": "Logs de mensageria, emissão de NF-e e conciliações automáticas."
        },
        {
          "name": "XMLs / Arquivos Relacionados",
          "path": "Arquivos de envio e retorno da SEFAZ",
          "desc": "Para auditoria de regras de validação tributária."
        }
      ]
    }
  ]
};
