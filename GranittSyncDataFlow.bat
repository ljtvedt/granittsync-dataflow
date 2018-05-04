node .\dataflowJson2Dot.js > GranittSyncDataFlow.gv
dot -Tsvg -o GranittSyncDataFlow.svg GranittSyncDataFlow.gv
dot -Tpdf -o GranittSyncDataFlow.pdf GranittSyncDataFlow.gv
start GranittSyncDataFlow.svg