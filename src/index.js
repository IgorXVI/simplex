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