let ultimoResultado = "";

function calcular() {
    const pesoInput = document.getElementById("peso").value;
    const peso = parseFloat(pesoInput);
    const paciente = document.getElementById("paciente").value;
    const midazolamTipo = document.getElementById("midazolam").value;

    // 1. Trava de Segurança Contra Erros Grosseiros de Digitação
    if (isNaN(peso) || peso <= 1) {
        alert("⚠️ Erro: Por favor, insira um peso válido maior que 1 kg.");
        return;
    }
    if (peso > 220) {
        alert("⚠️ Alerta de Segurança: O peso inserido excede o limite máximo configurado para segurança (220 kg). Verifique a digitação.");
        return;
    }

    // 2. Geração de Mensagens de Alerta Clínico/Padrão
    let badgeAlerta = "";
    if (peso >= 110) {
        badgeAlerta = `<div class="badge badge-warning">⚠️ Alerta: Obesidade / Ajuste de dose por peso ideal pode ser necessário</div>`;
    } else if (peso <= 7 && paciente === "crianca") {
        badgeAlerta = `<div class="badge badge-info">💡 Atenção: Baixo peso (Avaliar rigorosamente a margem de segurança)</div>`;
    }

    // Cálculos de Ketamina (Dose: 1 mg/kg | Concentração: 50 mg/mL)
    const ketaminaDose = peso * 1.0;
    const ketaminaVol = ketaminaDose / 50;

    // Cálculos de Dexmedetomidina (Dose: 1 mcg/kg | Concentração: 100 mcg/mL)
    const dexDose = peso * 1.0;
    const dexVol = dexDose / 100;

    // Cálculos de Midazolam
    let midDose;
    if (midazolamTipo === "im") {
        midDose = peso * 0.15;
    } else {
        midDose = (paciente === "crianca") ? (37.5 / 20) * peso : peso;
    }

    // Lógica de apresentação do Midazolam (IM vs Oral)
    let midazolamTextoLinha = "";
    let midazolamHtmlCard = "";

    if (midazolamTipo === "im") {
        const midVol = midDose / 5; // Concentração injetável standard: 5 mg/mL
        midazolamTextoLinha = `Midazolam (IM): ${midDose.toFixed(1)} mg | ${midVol.toFixed(2)} mL`;
        midazolamHtmlCard = `<div class="small">${midDose.toFixed(1)} mg | ${midVol.toFixed(2)} mL</div>`;
    } else {
        // VIA ORAL: Baseado no comprimido padrão de mercado de 15 mg
        const COMPRIMIDO_MG = 15;
        const fracaoMedica = midDose / COMPRIMIDO_MG;
        let instrucaoFracionamento = "";

        if (fracaoMedica <= 0.35) {
            // Próximo de 0.25 (1/4 de comprimido = 3.75mg)
            instrucaoFracionamento = "Cortar o comprimido em 4 partes (¼) e administrar apenas 1 parte.";
        } else if (fracaoMedica > 0.35 && fracaoMedica <= 0.65) {
            // Próximo de 0.5 (Metade do comprimido = 7.5mg)
            instrucaoFracionamento = "Cortar o comprimido ao meio (½) e administrar apenas 1 parte.";
        } else if (fracaoMedica > 0.65 && fracaoMedica <= 0.85) {
            // Próximo de 0.75 (3/4 de comprimido = 11.25mg)
            instrucaoFracionamento = "Cortar o comprimido em 4 partes e administrar 3 partes (¾).";
        } else if (fracaoMedica > 0.85 && fracaoMedica <= 1.25) {
            // Próximo de 1 comprimido inteiro = 15mg
            instrucaoFracionamento = "Administrar 1 comprimido inteiro.";
        } else if (fracaoMedica > 1.25 && fracaoMedica <= 1.6) {
            // Próximo de 1 comprimido e meio = 22.5mg
            instrucaoFracionamento = "Administrar 1 comprimido inteiro + metade (½) de outro.";
        } else {
            // Doses muito altas de via oral comprimido
            instrucaoFracionamento = `Administrar aprox. ${Math.round(fracaoMedica * 2) / 2} comprimidos (Dose calculada: ${midDose.toFixed(1)} mg).`;
        }

        midazolamTextoLinha = `Midazolam (Oral): ${midDose.toFixed(1)} mg (${instrucaoFracionamento})`;
        midazolamHtmlCard = `
            <div class="small"><b>Dose Alvo:</b> ${midDose.toFixed(1)} mg (Ref: Comprimido de 15 mg)</div>
            <div class="conduta-oral" style="margin-top: 5px; color: #007aff; font-size: 13px; font-weight: 600;">📋 Conduta: ${instrucaoFracionamento}</div>
        `;
    }

    // String para cópia limpa
    let alertaTexto = peso >= 110 ? "\n[ALERTA: Obesidade - Avaliar Dose]" : "";
    ultimoResultado = `SEDACAO ODONTO PRO${alertaTexto}

Peso: ${peso} kg

Ketamina: ${ketaminaDose.toFixed(1)} mg | ${ketaminaVol.toFixed(2)} mL
${midazolamTextoLinha}
Dexmedetomidina: ${dexDose.toFixed(1)} mcg | ${dexVol.toFixed(2)} mL`.trim();

    // Renderização no HTML
    document.getElementById("resultado").innerHTML = `
        ${badgeAlerta}

        <div class="result-card">
            <div class="title">Ketamina</div>
            <div class="small">${ketaminaDose.toFixed(1)} mg | ${ketaminaVol.toFixed(2)} mL</div>
        </div>

        <div class="result-card">
            <div class="title">Midazolam (Via ${midazolamTipo.toUpperCase()})</div>
            ${midazolamHtmlCard}
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
    if (!ultimoResultado) return;
    navigator.clipboard.writeText(ultimoResultado)
        .then(() => alert("Copiado!"))
        .catch(() => alert("Erro ao copiar."));
}

function novoPaciente() {
    document.getElementById("peso").value = "";
    document.getElementById("resultado").innerHTML = "";
    ultimoResultado = "";
}

function emergencia() {
    const pesoInput = document.getElementById("peso").value;
    const peso = parseFloat(pesoInput);
    const paciente = document.getElementById("paciente").value;

    if (isNaN(peso) || peso <= 1 || peso > 220) {
        alert("Insira um peso válido (entre 2 e 220 kg) para gerar o protocolo de emergência.");
        return;
    }

    const tipo = paciente === "crianca" ? "CRIANÇA" : "ADULTO";
    const statusObesidade = peso >= 110 ? "\n⚠️ NOTA: Paciente com Obesidade" : "";

    const texto = `🚨  EMERGÊNCIA
${statusObesidade}
Paciente: ${tipo}
Peso: ${peso} kg

•  Suspender sedação
•  Via aérea pérvia
•  Oxigênio
•  Monitorização contínua

🔄 REVERSÃO:
Midazolam → Flumazenil
Opioides → Naloxona
Dexmedetomidina → Suporte
Ketamina → Suporte`.trim();

    ultimoResultado = texto;

    document.getElementById("resultado").innerHTML = `
        <div class="result-card emergency">
            <div class="title">🚨  Emergência</div>
            <pre>${texto}</pre>
        </div>
        <button class="btn-green" onclick="copiar()">📋 Copiar Protocolo</button>
        <button class="btn-red" onclick="novoPaciente()">Voltar</button>
    `;
}