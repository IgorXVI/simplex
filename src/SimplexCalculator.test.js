/* eslint-env jest */

const SimplexCalculator = require("./SimplexCalculator")

describe("Simplex calculator tests", () => {

    it("should calculate correctly for example 1", () => {
        const simplexCalculator = SimplexCalculator()

        const result = simplexCalculator.calcSimplex({
            Z: { x1: -5, x2: -6, B: 0, Z: 1 },
            restrictions: [{ xF1: 1, x1: 2, x2: 1, B: 50 }, { xF2: 1, x1: 1, x2: 1, B: 90 }]
        })

        expect(result).toEqual({
            ZResult: 300,
            basicVars: { x2: 50, xF2: 40 },
            nonBasicVars: { x1: 0, xF1: 0 }
        })
    })

    it("should calculate correctly for example 2", () => {
        const simplexCalculator = SimplexCalculator()

        const result = simplexCalculator.calcSimplex({
            Z: { x1: -1, x2: -2, x3: -3, B: 0, Z: 1 },
            restrictions: [
                { xF1: 1, x1: 1, x2: 2, x3: 1, B: 40 },
                { xF2: 1, x1: 2, x2: 3, B: 30 },
                { xF3: 1, x2: 4, x3: 2, B: 20 }
            ]
        })

        expect(result).toEqual({
            ZResult: 45,
            basicVars: { x1: 15, x3: 10, xF1: 15 },
            nonBasicVars: { x2: 0, xF2: 0, xF3: 0 }
        })
    })

})