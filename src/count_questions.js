
import fs from 'fs';
const rawData = fs.readFileSync('c:\\Users\\EvandroCesarToniolo\\Projetos_Antigravity\\02_PROJETOS\\PRJ-25-Prova Matermatica\\saga-matemagica\\src\\db_bncc.json', 'utf8');
const data = JSON.parse(rawData);

console.log("=== RESUMO DE ESTOQUE DE PERGUNTAS ===");
for (const year in data.bncc_content) {
    console.log(`\nANO ESCOLAR: ${year}`);
    for (const subject in data.bncc_content[year]) {
        console.log(`- ${subject}: ${data.bncc_content[year][subject].length} perguntas`);
    }
}
