# POLÍTICA DE SEGURANÇA DA INFORMAÇÃO (PSI)

**EMPRESA**: EZ Studios Tecnologia Educacional Ltda.  
**VERSÃO**: 1.0  
**DATA**: 14 de Janeiro de 2026  
**RESPONSÁVEL**: [SEU NOME] - Diretor de Tecnologia  
**APROVAÇÃO**: [DATA] - Conselho Administrativo  
**PRÓXIMA REVISÃO**: 14 de Janeiro de 2027

---

## SUMÁRIO EXECUTIVO

Esta Política de Segurança da Informação (PSI) estabelece diretrizes, procedimentos e controles para proteger informações e sistemas da EZ Studios, com foco especial em **dados de menores de idade** (conformidade LGPD/COPPA).

### Objetivos

1. **Confidencialidade**: Garantir que informações sejam acessadas apenas por pessoas autorizadas
2. **Integridade**: Assegurar que dados não sejam alterados indevidamente
3. **Disponibilidade**: Manter sistemas acessíveis quando necessário
4. **Conformidade**: Atender LGPD, COPPA, ISO 27001

### Escopo

Aplica-se a:
- Todos os funcionários, estagiários e prestadores de serviço
- Todos os sistemas, aplicações e infraestrutura
- Todos os dados (especialmente de menores)

---

## PARTE I: CLASSIFICAÇÃO DE INFORMAÇÕES

### 1.1 Níveis de Classificação

| Nível | Descrição | Exemplos | Controles |
|-------|-----------|----------|-----------|
| **PÚBLICO** | Informações divulgáveis | Marketing, blog posts | Nenhum especial |
| **INTERNO** | Uso interno da empresa | Políticas, procedimentos | Acesso restrito a funcionários |
| **CONFIDENCIAL** | Informações sensíveis | Código-fonte, contratos | Criptografia, NDA |
| **RESTRITO** | Dados de menores, financeiros | CPF, dados bancários, dados de crianças | Criptografia forte, auditoria, LGPD compliance |

### 1.2 Dados de Menores (RESTRITO)

**Classificação Especial**: Todos os dados de usuários menores de 18 anos são automaticamente classificados como **RESTRITO**.

**Dados Coletados**:
- ✅ Nome (apelido permitido)
- ✅ Data de nascimento
- ✅ Email dos pais/responsáveis
- ✅ Progresso educacional
- ✅ Criações (mapas, código)

**Dados PROIBIDOS**:
- ❌ CPF da criança
- ❌ Endereço residencial completo
- ❌ Telefone pessoal
- ❌ Dados biométricos
- ❌ Dados sensíveis (raça, religião, saúde)

---

## PARTE II: CONTROLES DE ACESSO

### 2.1 Princípio do Menor Privilégio

**Regra**: Usuários têm apenas os acessos **mínimos necessários** para suas funções.

**Exemplo**:
```
Desenvolvedor Frontend → Acesso ao código UI (não ao banco de dados)
Desenvolvedor Backend → Acesso ao banco de dados (não a dados de produção)
Suporte → Acesso a logs (não a dados pessoais)
```

### 2.2 Autenticação Multi-Fator (MFA)

**Obrigatório para**:
- Acesso a sistemas de produção
- Acesso a dados de menores
- Acesso administrativo (AWS, GitHub, etc.)

**Métodos Aceitos**:
- Aplicativo autenticador (Google Authenticator, Authy)
- Chave de segurança física (YubiKey)
- SMS (apenas como fallback)

### 2.3 Gestão de Senhas

**Requisitos Mínimos**:
- Mínimo 12 caracteres
- Letras maiúsculas e minúsculas
- Números e símbolos
- Não reutilizar senhas antigas
- Trocar a cada 90 dias

**Ferramentas Obrigatórias**:
- Gerenciador de senhas corporativo (1Password, LastPass)
- Proibido armazenar senhas em texto plano

### 2.4 Controle de Acesso a Dados de Menores

**Acesso Restrito**:
- Apenas 3 pessoas autorizadas (CTO, DPO, Suporte Sênior)
- Acesso registrado em log de auditoria
- Justificativa obrigatória para cada acesso
- Revisão trimestral de acessos

**Procedimento de Acesso**:
```
1. Funcionário solicita acesso via ticket
2. Gestor aprova (ou nega) em 24h
3. Acesso concedido por tempo limitado (máx 7 dias)
4. Ação registrada em log imutável
5. Notificação ao DPO (Data Protection Officer)
```

---

## PARTE III: CRIPTOGRAFIA

### 3.1 Dados em Trânsito

**Obrigatório**:
- TLS 1.3 (mínimo TLS 1.2)
- Certificados SSL válidos
- HSTS (HTTP Strict Transport Security)

**Proibido**:
- HTTP sem criptografia
- TLS 1.0 ou 1.1 (obsoletos)
- Certificados auto-assinados em produção

### 3.2 Dados em Repouso

**Banco de Dados**:
- Criptografia AES-256 em nível de disco
- Criptografia em nível de campo para dados RESTRITO
- Chaves gerenciadas por KMS (AWS Key Management Service)

**Backups**:
- Criptografia AES-256
- Armazenamento em múltiplas regiões geográficas
- Teste de restauração trimestral

### 3.3 Chaves Criptográficas

**Gestão**:
- Rotação automática a cada 90 dias
- Armazenamento em HSM (Hardware Security Module) ou KMS
- Separação de chaves (desenvolvimento vs produção)

**Proibido**:
- Chaves hardcoded no código-fonte
- Chaves em repositórios Git
- Compartilhamento de chaves por email/Slack

---

## PARTE IV: DESENVOLVIMENTO SEGURO

### 4.1 Segurança no Ciclo de Vida (SDLC)

**Fases**:

1. **Design**: Threat modeling, análise de riscos
2. **Desenvolvimento**: Code review, análise estática (SAST)
3. **Teste**: Testes de segurança, análise dinâmica (DAST)
4. **Deploy**: Scan de vulnerabilidades, configuração segura
5. **Operação**: Monitoramento, resposta a incidentes

### 4.2 Code Review

**Obrigatório**:
- Todo código passa por revisão de pelo menos 1 desenvolvedor sênior
- Foco em: SQL injection, XSS, CSRF, autenticação, autorização
- Ferramentas: SonarQube, ESLint, Bandit (Python)

### 4.3 Dependências de Terceiros

**Gestão de Bibliotecas**:
- Scan automático de vulnerabilidades (Dependabot, Snyk)
- Atualização mensal de dependências
- Proibido usar bibliotecas com vulnerabilidades críticas

### 4.4 Secrets Management

**Proibido**:
- Senhas, API keys, tokens em código-fonte
- Credenciais em arquivos de configuração versionados

**Obrigatório**:
- Uso de variáveis de ambiente
- Secrets em vault (AWS Secrets Manager, HashiCorp Vault)

---

## PARTE V: INFRAESTRUTURA E REDES

### 5.1 Segmentação de Rede

**Ambientes Separados**:
```
┌─────────────────────────────────────┐
│  PRODUÇÃO (Isolado)                 │
│  - Dados reais de usuários          │
│  - Acesso restrito                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  STAGING (Dados anonimizados)       │
│  - Testes pré-produção              │
│  - Acesso por desenvolvedores       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  DESENVOLVIMENTO (Dados sintéticos) │
│  - Desenvolvimento local            │
│  - Acesso livre                     │
└─────────────────────────────────────┘
```

### 5.2 Firewall e Proteção de Rede

**Regras**:
- Deny all por padrão
- Allow apenas portas necessárias (80, 443, 22)
- IP whitelisting para acesso administrativo
- WAF (Web Application Firewall) ativo

### 5.3 Monitoramento e Logs

**Logs Obrigatórios**:
- Acesso a sistemas (quem, quando, o quê)
- Alterações em dados de menores
- Tentativas de login falhadas
- Erros de aplicação

**Retenção**:
- Logs de segurança: 2 anos
- Logs de acesso a dados de menores: 5 anos (LGPD)
- Logs de aplicação: 90 dias

**Ferramentas**:
- SIEM (Security Information and Event Management)
- Alertas automáticos para atividades suspeitas

---

## PARTE VI: BACKUP E RECUPERAÇÃO DE DESASTRES

### 6.1 Política de Backup

**Frequência**:
- **Banco de dados**: Backup completo diário + incremental a cada 6h
- **Código-fonte**: Versionamento Git (backup automático)
- **Configurações**: Backup semanal

**Armazenamento**:
- 3 cópias (regra 3-2-1)
- 2 mídias diferentes (disco + nuvem)
- 1 cópia offsite (região geográfica diferente)

### 6.2 Plano de Recuperação de Desastres (DRP)

**RTO (Recovery Time Objective)**: 4 horas  
**RPO (Recovery Point Objective)**: 6 horas

**Cenários Cobertos**:
- Falha de servidor
- Ataque ransomware
- Desastre natural (incêndio, inundação)
- Erro humano (deleção acidental)

**Testes**:
- Simulação trimestral de recuperação
- Documentação atualizada de procedimentos

---

## PARTE VII: RESPOSTA A INCIDENTES

### 7.1 Definição de Incidente

**Incidente de Segurança**:
- Acesso não autorizado a dados
- Vazamento de informações
- Ataque DDoS
- Malware/ransomware
- Violação de LGPD/COPPA

### 7.2 Equipe de Resposta (CSIRT)

**Composição**:
- **Líder**: CTO
- **Técnico**: Desenvolvedor Sênior
- **Jurídico**: Advogado de Proteção de Dados
- **Comunicação**: Gerente de Marketing

### 7.3 Procedimento de Resposta

**Fases**:

1. **Detecção** (0-1h)
   - Identificar incidente
   - Acionar CSIRT

2. **Contenção** (1-4h)
   - Isolar sistemas afetados
   - Bloquear acessos suspeitos

3. **Erradicação** (4-24h)
   - Remover causa raiz
   - Aplicar patches

4. **Recuperação** (24-48h)
   - Restaurar sistemas
   - Validar integridade

5. **Pós-Incidente** (48h+)
   - Análise de causa raiz
   - Lições aprendidas
   - Atualização de políticas

### 7.4 Notificação de Violação (LGPD)

**Prazo**: 72 horas após detecção

**Notificar**:
- ANPD (Autoridade Nacional de Proteção de Dados)
- Titulares afetados (pais/responsáveis)
- Imprensa (se >1000 afetados)

**Conteúdo da Notificação**:
- Natureza da violação
- Dados afetados
- Medidas tomadas
- Contato para esclarecimentos

---

## PARTE VIII: CONFORMIDADE E AUDITORIA

### 8.1 LGPD (Lei Geral de Proteção de Dados)

**DPO (Data Protection Officer)**:
- Nome: [A definir]
- Email: dpo@ezstudios.com
- Responsabilidades: Supervisionar conformidade, atender titulares

**Direitos dos Titulares**:
- Acesso aos dados
- Correção de dados incorretos
- Eliminação de dados (direito ao esquecimento)
- Portabilidade de dados
- Revogação de consentimento

**Procedimento**:
- Solicitação via email ou formulário web
- Resposta em até 15 dias
- Gratuito (primeira solicitação)

### 8.2 COPPA (Children's Online Privacy Protection Act)

**Aplicável**: Se atender usuários dos EUA

**Requisitos**:
- Consentimento parental verificável
- Notificação clara sobre coleta de dados
- Não condicionar participação à coleta excessiva
- Segurança de dados

### 8.3 Auditorias

**Frequência**:
- **Interna**: Trimestral
- **Externa**: Anual (se receita >R$ 5M)

**Escopo**:
- Conformidade com PSI
- Testes de penetração (pentest)
- Revisão de acessos
- Análise de logs

**Auditor Externo**: Empresa certificada ISO 27001

---

## PARTE IX: TREINAMENTO E CONSCIENTIZAÇÃO

### 9.1 Treinamento Obrigatório

**Frequência**: Anual + onboarding de novos funcionários

**Conteúdo**:
- Política de Segurança da Informação
- LGPD e proteção de dados de menores
- Phishing e engenharia social
- Senhas seguras e MFA
- Resposta a incidentes

**Formato**:
- Curso online (2 horas)
- Teste de conhecimento (mínimo 80% de acerto)
- Certificado de conclusão

### 9.2 Campanhas de Conscientização

**Mensais**:
- Email com dicas de segurança
- Simulação de phishing
- Cartazes no escritório

---

## PARTE X: PENALIDADES

### 10.1 Violações

**Exemplos**:
- Compartilhar senha
- Acessar dados sem autorização
- Não reportar incidente
- Violar NDA

**Consequências**:
- 1ª vez: Advertência verbal
- 2ª vez: Advertência escrita
- 3ª vez: Suspensão
- Grave: Demissão por justa causa + processo criminal

### 10.2 Multas LGPD

**Valores**:
- Até R$ 50 milhões por infração
- Até 2% do faturamento anual

**Responsabilidade**:
- Empresa é responsável
- Funcionário pode responder criminalmente

---

## PARTE XI: CONTATOS

### 11.1 Equipe de Segurança

**CTO (Chief Technology Officer)**:
- Nome: [SEU NOME]
- Email: cto@ezstudios.com
- Telefone: [Telefone]

**DPO (Data Protection Officer)**:
- Nome: [A definir]
- Email: dpo@ezstudios.com
- Telefone: [Telefone]

**CSIRT (Computer Security Incident Response Team)**:
- Email: security@ezstudios.com
- Telefone 24/7: [Telefone]

### 11.2 Denúncias

**Canal Anônimo**:
- Email: denuncia@ezstudios.com
- Formulário web: ezstudios.com/denuncia
- Garantia de anonimato

---

## PARTE XII: REVISÃO E ATUALIZAÇÃO

### 12.1 Ciclo de Revisão

**Frequência**: Anual ou quando:
- Mudança significativa na infraestrutura
- Nova regulamentação
- Incidente de segurança grave

**Responsável**: CTO + DPO

### 12.2 Controle de Versões

| Versão | Data | Alterações | Aprovado por |
|--------|------|------------|--------------|
| 1.0 | 14/01/2026 | Versão inicial | [Nome] |
| | | | |

---

## ANEXOS

- **Anexo A**: Checklist de Conformidade LGPD
- **Anexo B**: Checklist de Conformidade COPPA
- **Anexo C**: Procedimento de Resposta a Incidentes (detalhado)
- **Anexo D**: Formulário de Solicitação de Acesso a Dados
- **Anexo E**: Termo de Confidencialidade (NDA)

---

## APROVAÇÃO

**Elaborado por**:  
[SEU NOME] - CTO  
Data: 14/01/2026

**Aprovado por**:  
[NOME] - CEO  
Data: ___/___/2026

**Revisado por**:  
[NOME] - Advogado de Proteção de Dados  
Data: ___/___/2026

---

**NOTA**: Esta política deve ser revisada por advogado especializado em Proteção de Dados e por consultor de segurança da informação antes de implementação.

**Custos de Implementação**:
- Consultoria em segurança: R$ 15.000-30.000
- Ferramentas (SIEM, WAF, etc.): R$ 5.000-15.000/mês
- Auditoria externa: R$ 20.000-50.000/ano
- Seguro cibernético: R$ 10.000-30.000/ano
- **TOTAL Ano 1**: R$ 105.000-230.000
