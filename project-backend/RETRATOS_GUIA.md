# Guia de Proporções — Retratos de Personagens

## Proporção padrão

Use imagens em **3:4** (portrait). Exemplos de tamanhos:

- 600 × 800 px
- 750 × 1000 px
- 900 × 1200 px

---

## Posicionamento do rosto no arquivo

O card de personagem tem dois modos de exibição. O posicionamento do rosto no arquivo de imagem afeta como ele aparece em cada modo.

### Card normal (vivo / desaparecido)

O frame exibe o retrato inteiro em proporção 3:4. Qualquer centralização funciona bem.

```
┌──────────────┐
│              │
│   👤 ROSTO   │  ← funciona em qualquer posição vertical
│              │
│    corpo     │
└──────────────┘
```

### Card lápide (status Morto)

Os **26% inferiores do frame são reservados para a inscrição gravada** (nome + ano). Apenas os 74% superiores mostram o retrato.

```
┌──────────────┐  ← topo do frame
│   👤 ROSTO   │  ← ZONA IDEAL  (0 – 55% da altura da imagem)
│ ombros/busto │  ← ZONA OK     (55 – 74%)
├──────────────┤  ← inscrição começa aqui
│  NOME · ANO  │  ← não visível no retrato
└──────────────┘
```

**Regra prática:** o rosto da personagem deve estar no **terço superior** do arquivo de imagem. O corpo pode preencher abaixo normalmente.

---

## O que evitar

| Problema | Causa |
|----------|-------|
| Rosto cortado no card lápide | Rosto centralizado na metade da imagem — a inscrição cobre o queixo |
| Imagem esticada/deformada | Proporção diferente de 3:4 usada sem recorte prévio |
| Retrato vazio no card | Imagem não carregada no slot — clique no frame para adicionar |

---

## Recorte rápido (referência)

Se a imagem original for quadrada (1:1), recorte adicionando espaço **abaixo** do rosto para chegar em 3:4. Não comprima verticalmente.

Se a imagem for paisagem (mais larga que alta), recorte centralizando o rosto horizontalmente antes de ajustar para 3:4.

---

## Reencuadramento no app

Após subir a imagem, é possível ajustar o enquadramento diretamente no card:

1. Passe o mouse sobre o retrato
2. Dê **duplo clique** para entrar no modo de reencuadramento
3. Arraste para reposicionar · scroll para zoom
4. Clique fora para salvar o enquadramento

Esse ajuste é salvo por personagem e persiste entre sessões.
