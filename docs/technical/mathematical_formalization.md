# FORMALIZAÇÃO MATEMÁTICA - MOTOR EZ STUDIOS

**DOCUMENTO**: Especificação Algébrica e Estocástica  
**VERSÃO**: 1.0  
**AUTOR**: Antigravity AI (Protocolo Entropia Zero)

---

## 1. WAVE FUNCTION COLLAPSE (WFC)

O WFC é tratado como um problema de satisfação de restrições (CSP) em uma grade finita.

### 1.1 Entropia de Shannon (H)

Para cada célula $i$ na grade, a entropia é calculada para determinar o próximo ponto de colapso:

$$H(i) = -\sum_{j=1}^{n} p_j \log_2(p_j)$$

Onde:
- $n$ é o número de tiles possíveis para a célula $i$.
- $p_j$ é a probabilidade relativa do tile $j$, baseada em seu peso $w_j$:
  $$p_j = \frac{w_j}{\sum w}$$

**Regra de Seleção**: O motor seleciona a célula com a menor entropia diferente de zero para colapsar primeiro ($H_{min} > 0$).

### 1.2 Colapso e Propagação (Arc Consistency)

Quando uma célula é colapsada para um estado único $T$, as restrições são propagadas para os vizinhos imediatos $V = \{N, S, E, O\}$.

Seja $A \subset \Sigma$ o conjunto de tiles permitidos em uma célula vizinha. Após o colapso do vizinho em direção $d$, o novo conjunto $A'$ é:

$$A' = A \cap \{ t \in \Sigma \mid \exists (T, t, d) \in \text{Regras} \}$$

Se $A' = \emptyset$, ocorre uma **Contradição de Entropia**, e o algoritmo deve retroceder ou reiniciar.

---

## 2. BINARY SPACE PARTITIONING (BSP)

O BSP é utilizado para subdivisão recursiva de um hiperplano 2D (espaço do mapa).

### 2.1 Função de Divisão Recursiva

Seja um retângulo $R$ definido por $(x, y, w, h)$. A divisão ocorre se $w > w_{min} \times 2$ ou $h > h_{min} \times 2$.

A posição de corte $k$ é escolhida aleatoriamente dentro de um intervalo de segurança $s$:

$$k \in [ \text{size}_{min}, \text{total}_{size} - \text{size}_{min} ]$$

A profundidade da árvore $d$ define o número máximo de partições $N$:
$$N_{max} = 2^d$$

---

## 3. COMPILADOR DE INTENÇÃO (INTENT ALGEBRA)

O compilador atua como uma função de transformação $f$ que mapeia a intenção do usuário $I$ em um plano de geração $G$.

### 3.1 Vetor de Intenção

$$I = \begin{bmatrix} \text{Dificuldade} \\ \text{Densidade} \\ \text{Bioma} \\ \text{Complexidade} \end{bmatrix}$$

### 3.2 Transformação para Regras

O compilador converte o vetor $I$ em parâmetros para os motores core:

- **Densidade** $\rightarrow$ Modifica os pesos $w_j$ no WFC.
- **Complexidade** $\rightarrow$ Define a profundidade $d$ no BSP.
- **Bioma** $\rightarrow$ Seleciona o subconjunto de tiles $\Sigma_{subset}$.

$$f(I) \Rightarrow \{ \Sigma, w, d, w_{min} \}$$

---

## 4. OTIMIZAÇÃO LUAU (OPCODES)

Para garantir a execução eficiente no Roblox, o código gerado segue o princípio de redução de custo de busca em tabelas globais.

### 4.1 Teoria do Cache Import

O uso de `local v3 = Vector3.new` vs `Vector3.new` em um loop de $n$ iterações:

- **Custo Global**: $O(n \times \text{hash\_lookup})$
- **Custo Local**: $O(1 \times \text{hash\_lookup} + n \times \text{register\_access})$

O compilador automaticamente injeta "imports locais" para todas as funções matemáticas e construtores de tipos do Roblox para atingir o estado de **Entropia Zero de Execução**.
