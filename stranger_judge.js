const express = require('express');
const bodyParser = require('body-parser');
const { wasm: wasm_tester } = require('circom_tester');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const PASS = "pass";
const FAIL = "fail";

async function runCircuit(circuitPath, input) {
    const circuit = await wasm_tester(circuitPath, {
        output: path.join(__dirname, "./test/generated"),
        // recompile: true,
    });
    try {
        const witness = await circuit.calculateWitness({ in: input });
        await circuit.checkConstraints(witness);
        return PASS;
    } catch (error) {
        return error.toString();
    }
}

async function runCircuitMustFail(circuitPath, input) {
    const circuit = await wasm_tester(circuitPath, {
        output: path.join(__dirname, "./test/generated"),
        // recompile: true,
    });
    try {
        const witness = await circuit.calculateWitness({ in: input });
        await circuit.checkConstraints(witness);
        return FAIL;
    } catch (error) {
        return error.toString();
    }
}

// Example inputs {"l1": "123", "l2": ["1", "2", "3"], "l3": "123"}
// Test with curl
// curl -X POST http://localhost:3000/judge -H "Content-Type: application/json" -d '{"l1": "123", "l2": ["1", "2", "3"], "l3": "123"}'

app.post('/judge', async (req, res) => {
    // random number for logging
    const identifier = Math.floor(Math.random() * 100000000000);
    const inputs = req.body;
    console.log("identifier", identifier, "inputs", inputs);

    let result = FAIL;

    // Level 1
    result = await runCircuit(path.join(__dirname, "test/level1_test.circom"), inputs.l1);
    if (result != PASS) {
        res.json({ success: false });
        return;
    }

    // Level 2 - Round 1
    result = await runCircuit(path.join(__dirname, "test/level2_test.circom"), inputs.l2[0]);
    if (result != PASS) {
        res.json({ success: false });
        return;
    }

    // Level 2 - Round 2
    result = await runCircuitMustFail(path.join(__dirname, "test/level2_test.circom"), inputs.l2[1]);
    if ((result.includes("Assert Failed") && !result.includes("Bit")) === false) {
        res.json({ success: false });
        return;
    }

    // Level 2 - Round 3
    result = await runCircuitMustFail(path.join(__dirname, "test/level2_test.circom"), inputs.l2[2]);
    if ((result.includes("Assert Failed") && result.includes("Bit")) === false) {
        res.json({ success: false });
        return;
    }

    // Level 3
    if (inputs.l3.length <= 68) {
        res.json({ success: false });
        return;
    }
    result = await runCircuit(path.join(__dirname, "test/level3_test.circom"), inputs.l3);
    if (result != PASS) {
        res.json({ success: false });
        return;
    }

    res.json({ success: true });
    console.log("identifier", identifier, "success");
    return;
});

const port = 3000;
app.listen(port, () => {
    console.log(`Stranger Judge Service running on port ${port}`);
});