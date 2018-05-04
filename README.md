# granittsync-dataflow
Innovasjonsdag-prosjekt for å teste om vi kan lage automatisk layout av dataflyt-diagram

## Oppsett
- Installer node.js fra https://nodejs.org/en/download/
- Installer Graphviz fra https://www.graphviz.org/download/
- Legg graphviz/bin-katalogen inn i path
- i prosjekt-katalogen, kjør "npm init"

## Generer flytdiagram
Kjør
```
node dataflowJson2Dot.js | dot -Tpdf > GranittSyncDataFlow.pdf

## PowerShell
Kjører du med PowerShell, sett OutputEncoding = 'ASCII':
```
$PSDefaultParameterValues['Out-File:Encoding'] = 'ascii'

