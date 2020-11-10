Calculador de Simplex
=============

Como usar
-------------
### Setup
Seguir os seguintes passos:
                
1. Instalar nodejs com versão >= 12.19.0
2. Baixar o repositório
3. Abrir o terminal na raíz do repositório
4. Rodar o comando "npm i"
5. Rodar o comando "npm run dev"

### Inputs
O programa vai pedir 3 inputs:
                
1. Z =
2. Numero de restricoes:
3. Restricao (número):

O input 1 é a função objetivo.<br/>
Exemplo: 5x1 + 3x2 + 4x3 -x4<br/>

O input 2 é um número inteiro que representa a quantidade de restrições. Exemplo: 2<br/>

O input 3 é repeitdo **n** vezes, com **n** sendo o número de restrições informado no input 2.<br/>
Exemplo:<br/>
Restricao 1: x1 + x2 + x3 + x4 <= 600<br/>
Restricao 2: 2x1 + x3 <= 280<br/>

### Outpus
Depois que os inputs forem informados o programa vai 3 outpus, que são o resultado do cálculo do simplex:
                
1. Valor otimo para Z:
2. Variaveis basicas:
3. Variaveis nao basicas:

Exemplo:<br/>
Valor otimo para Z: 300<br/>
Variaveis basicas:<br/>
x2 = 50<br/>
xF2 = 40<br/>
Variaveis nao basicas:<br/>
x1 = 0<br/>
xF1 = 0<br/>

### Limitações
O programa só funciona se as variaveis informadas forem x**N**, com **N** sendo um número inteiro.
Exemplos: x1, x2, x3

Código
-------------
### Passos do simplex
O código foi feito com base nos passos para a resolução do simplex:

1. Igualar função objetivo a 0, mantendo o Z positivo

2. Transformar restrições em equações com variável de folga somadas no fim

3. Construir tabela de cálculo com o cabeçalho de cada coluna sendo
    uma variável, incluindo varivaveis de folga, o Z,
    e o B sendo o resultado de cada equação

4. Cada linha da tabela é uma equação (incluindo função objetivo),
    com o valor de cada coluna sendo o índice para cada variável na equação,
    se a equação não tiver a variável, o índice é 0

5. Indentificar posição na tabela da variavel que entra: a que tem o menor valor negativo na linha Z

6. Dividir os Bs pelo número na mesma linha na coluna da variável que entra

7. O B dividido pela variável que entra que tiver o menor valor vai ser a variável que sai

8. Identificar elemento pivo: está no cruzamento da coluna da variável que entra com
    a coluna da variável que sai

9. Dividir linha que tem a variável que sai pelo elemento pivo

10. A linha que foi dividida vai substituir a linha antiga e é a nova linha pivo

11. Calcular novos valores para as outras linhas

12. Multiplicar a linha pivo pelo inverso da variavel da coluna que entra na nova linha que vai ser calculada

13. Somar linha que vai ser calculada com a linha pivo que foi multiplicada no passo 12

14. Resultado vai substituir a linha que foi calculada na nova tabela

15. Repetir passos 12, 13 e 14 para todas as linhas que não foram calculadas

16. Construir nova tabela com os resultados

17. Repetir passos 5 a 16 até encontrar solução ótima: nenhum valor negativo na linha do Z

18. Achar variáveis basicas: coluna só tem 0 e 1

19. Zerar variáveis não basicas

20. Converter váriaveis básicas no valor de B

### FunctionParser.js
Essa classe transforma a string que o usuário informa no terminal em um objeto que o calculador de simplex pode usar.
Exemplo:
```javascript
const FunctionParser = require("./FunctionParser")

const functionParser = FunctionParser()

const result = functionParser.parseLinearFunction("Z - 5x1 - 3x2 - 4x3 + x4 = 0")

console.log(result)
//{ Z: 1, x1: -5, x2: -3, x3: -4, x4: 1, B: 0 }
```

### RestrictionParser.js
Essa classe transforma o input que o usuário informa para uma restrição em um objeto que o calculador de simplex pode usar.
Exemplo:
```javascript
const FunctionParser = require("./FunctionParser")
const RestrictionParser = require("./RestrictionParser")

const functionParser = FunctionParser()

const restrictionParser = RestrictionParser({
    functionParser
})

const result = restrictionParser.parseRestriction("2x1 + x2 <= 50")

console.log(result)
//{ x1: 2, x2: 1, xF1: 1, B: 50 }
```

### ZParser.js
Essa classe transforma o input que o usuário informa para o Z em um objeto que o calculador de simplex pode usar.
Exemplo:
```javascript
const FunctionParser = require("./FunctionParser")
const ZParser = require("./ZParser")

const functionParser = FunctionParser()

const zParser = ZParser({
    functionParser
})

const result = functionParser.parseZ("5x1 + 6x2")

console.log(result)
//{ Z: 1, x1: -5, x2: -6, B: 0 }
```

### Reader.js
Essa classe lê os inputs do usuário pelo terminal.
Exemplo:
```javascript
const readlineSync = require("readline-sync")

const FunctionParser = require("./FunctionParser")
const RestrictionParser = require("./RestrictionParser")
const ZParser = require("./ZParser")
const Reader = require("./Reader")

const functionParser = FunctionParser()

const restrictionParser = RestrictionParser({
    functionParser
})

const zParser = ZParser({
    functionParser
})

const reader = Reader({
    readlineSync,
    restrictionParser,
    zParser
})

const Z = reader.readZ()

console.log(Z)

//{ Z: 1, x1: -5, x2: -6, B: 0 }

const restrictions = reader.readRestrictions()

console.log(restrictions)

/*
[
	{ x1: 2, x2: 1, xF1: 1, B: 50 },
	{ x1: 1, x2: 1, xF2: 1, B: 90 }
]
*/
```

### SimplexCalculator.js
Essa classe calcula o resultado do simplex.
Exemplo:
```javascript
const SimplexCalculator = require("./SimplexCalculator")

const simplexCalculator = SimplexCalculator()

const result = simplexCalculator.calcSimplex({
	Z: { x1: -5, x2: -6, B: 0, Z: 1 },
	restrictions: [
		{ xF1: 1, x1: 2, x2: 1, B: 50 },
		{ xF2: 1, x1: 1, x2: 1, B: 90 }
	]
})

console.log(result)

/*
{
	ZResult: 300,
	basicVars: { x2: 50, xF2: 40 },
	nonBasicVars: { x1: 0, xF1: 0 }
}
*/
```

### Presenter.js
Essa classe mostra o resultado dos cálculos para o usuário.
Exemplo:
```javascript
const Presenter = require("./Presenter")

const presenter = Presenter({
    log: console.log
})

presenter.present({
	ZResult: 300,
	basicVars: { x2: 50, xF2: 40 },
	nonBasicVars: { x1: 0, xF1: 0 }
})

/*
Valor otimo para Z: 300
Variaveis basicas:
x2 = 50
xF2 = 40
Variaveis nao basicas:
x1 = 0
xF1 = 0
*/
```