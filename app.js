let ultimoResultado = "";

function calcular() {

    let peso = parseFloat(document.getElementById("peso").value);
    let paciente = document.getElementById("paciente").value;
    let midazolamTipo = document.getElementById("midazolam").value;

    if (!peso || peso <= 0) {
        alert("Peso inválido");
        return;
    }

    let ketaminaDose = peso * 1.0;
    let ketaminaVol = ketaminaDose / 50;

    let dexDose = peso * 1.0;
    let dexVol = dexDose / 100;

    let midDose;

    if (midazolamTipo === "im") {
        midDose = peso * 0.15;
    } else {
        midDose = (paciente === "crianca")
            ? (37.5 / 20) * peso
            : peso;
    }

    let midVol = midDose / 5;

    ultimoResultado = `
SEDACAO ODONTO PRO

Peso: ${peso} kg

Ketamina: ${ketaminaDose.toFixed(1)} mg | ${ketaminaVol.toFixed(2)} mL
Midazolam: ${midDose.toFixed(1)} mg | ${midVol.toFixed(2)} mL
Dexmedetomidina: ${dexDose.toFixed(1)} mcg | ${dexVol.toFixed(2)} mL
`;

    document.getElementById("resultado").innerHTML = `

<div class="result-card">
<div class="title">Ketamina</div>
<div class="small">${ketaminaDose.toFixed(1)} mg | ${ketaminaVol.toFixed(2)} mL</div>
</div>

<div class="result-card">
<div class="title">Midazolam</div>
<div class="small">${midDose.toFixed(1)} mg | ${midVol.toFixed(2)} mL</div>
</div>

<div class="result-card">
<div class="title">Dexmedetomidina</div>
<div class="small">${dexDose.toFixed(1)} mcg | ${dexVol.toFixed(2)} mL</div>
</div>

<button class="btn-green" onclick="copiar()">📋 Copiar</button>
<button class="btn-red" onclick="novoPaciente()">🔄 Novo</button>
`;
}

function copiar() {
    navigator.clipboard.writeText(ultimoResultado);
    alert("Copiado");
}

function novoPaciente() {
    document.getElementById("peso").value = "";
    document.getElementById("resultado").innerHTML = "";
    ultimoResultado = "";
}

function emergencia() {

    let peso = parseFloat(document.getElementById("peso").value);
    let paciente = document.getElementById("paciente").value;

    if (!peso) {
        alert("Informe peso");
        return;
    }

    let tipo = paciente === "crianca" ? "CRIANÇA" : "ADULTO";

    let texto = `
🚨 EMERGÊNCIA

Paciente: ${tipo}
Peso: ${peso} kg

• Suspender sedação
• Via aérea pérvia
• Oxigênio
• Monitorização contínua

🔄 REVERSÃO:
Midazolam → Flumazenil
Opioides → Naloxona
Dexmedetomidina → Suporte
Ketamina → Suporte
`;

    ultimoResultado = texto;

    document.getElementById("resultado").innerHTML = `

<div class="result-card emergency">

<div class="title">🚨 Emergência</div>

<pre>${texto}</pre>

</div>

<button class="btn-green" onclick="copiar()">📋 Copiar Protocolo</button>
<button class="btn-red" onclick="novoPaciente()">Voltar</button>
`;
}