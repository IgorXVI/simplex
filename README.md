Calculador de Simplex
=============

Como usar
-------------
###Setup
Seguir os seguintes passos:
                
1. Instalar nodejs com versão >= 12.19.0
2. Baixar o repositório
3. Abrir o terminal na raíz do repositório
4. Rodar o comando "npm i"
5. Rodar o comando "npm run dev"

###Inputs
O programa vai pedir 3 inputs:
                
1. Z =
2. Numero de restricoes:
3. Restricao (número):

O input 1 é a função objetivo.
Exemplo: 5x1 + 3x2 + 4x3 -x4

O input 2 é um número inteiro que representa a quantidade de restrições. Exemplo: 2

O input 3 é repeitdo **n** vezes, com **n** sendo o número de restrições informado no input 2.
Exemplo:
Restricao 1: x1 + x2 + x3 + x4 <= 600
Restricao 2: 2x1 + x3 <= 280

###Outpus
Depois que os inputs forem informados o programa vai 3 outpus, que são o resultado do cálculo do simplex:
                
1. Valor otimo para Z:
2. Variaveis basicas:
3. Variaveis nao basicas:

Exemplo:
Valor otimo para Z: 300
Variaveis basicas:
x2 = 50
xF2 = 40
Variaveis nao basicas:
x1 = 0
xF1 = 0

###Limitações
O programa só funciona se as variaveis informadas forem x**N**, com **N** sendo um número inteiro.
Exemplos: x1, x2, x3

Código
-------------
###FunctionParser.js
Essa classe transforma a string que o usuário informa no terminal em um objeto que o calculador de simplex pode usar.
Exemplo:
```javascript
const FunctionParser = require("./FunctionParser")

const functionParser = FunctionParser()

const result = functionParser.parseLinearFunction("Z - 5x1 - 3x2 - 4x3 + x4 = 0")

console.log(result)
//{ Z: 1, x1: -5, x2: -3, x3: -4, x4: 1, B: 0 }
```

###RestrictionParser.js
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

###ZParser.js
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