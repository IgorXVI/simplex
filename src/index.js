/* 
Regras:
1 - deve ser de maximização

2 - todas restrições <=

3 - não negatividade


Passos:
1 - Igualar função objetivo a 0, mantendo o Z positivo

2 - transformar restrições em equações com variável de folga somadas no fim

3 - construir tabela de cálculo com o cabeçalho de cada coluna sendo
    uma variável, incluindo varivaveis de folga, o Z,
    e o B sendo o resultado de cada equação

4 - cada linha da tabela é uma equação (incluindo função objetivo),
    com o valor de cada coluna sendo o índice para cada variável na equação,
    se a equação não tiver a variável, o índice é 0

5 - indentificar posição na tabela da variavel que entra: a que tem o menor valor negativo na linha Z

6 - dividir os Bs pelo número na mesma linha na coluna da variável que entra

7 - o B dividido pela variável que entra que tiver o menor valor vai ser a variável que sai

8 - identificar elemento pivo: está no cruzamento da coluna da variável que entra com
    a coluna da variável que sai

9 - dividir linha que tem a variável que sai pelo elemento pivo

10 - linha que foi dividida vai substituir a linha antiga e é a nova linha pivo

11 - calcular novos valores para as outras linhas

12 - multiplicar a linha pivo pelo inverso da variavel da coluna que entra na nova linha que vai ser calculada

13 - somar linha que vai ser calculada com a linha pivo que foi multiplicada no passo 12

14 - resultado vai substituir a linha que foi calculada na nova tabela

15 - repetir passos 12, 13 e 14 para todas as linhas que não foram calculadas

16 - construir nova tabela com os resultados

17 - repetir passos 5 a 16 até encontrar solução ótima: nenhum valor negativo na linha do Z

18 - achar variáveis basicas: coluna só tem 0 e 1

19 - zerar variáveis não basicas

20 - converter váriaveis básicas no valor de B

21 - substituir variáveis básicas na equação do Z
*/

const readlineSync = require("readline-sync")

const FunctionParser = require("./FunctionParser")
const RestrictionParser = require("./RestrictionParser")
const ZParser = require("./ZParser")
const Reader = require("./Reader")
const SimplexCalculator = require("./SimplexCalculator")
const Presenter = require("./Presenter")

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

const simplexCalculator = SimplexCalculator()

const presenter = Presenter({
    log: console.log
})

const Z = reader.readZ()
const restrictions = reader.readRestrictions()

const result = simplexCalculator.calcSimplex({
    Z,
    restrictions
})

presenter.present(result)