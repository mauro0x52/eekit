#!/bin/bash

# ------------------------------------------------------------------------------
# Start All
# ------------------------------------------------------------------------------
# Script iniciar todos os serviços
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh

# Funcao principal
startAll() {
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando serviços"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER

    for SERVICE in ${CONFIG_SERVICES[@]}
    do
        cd $SERVICE
        echo "- Iniciando $SERVICE"
        forever start ${SERVICE,,}.js
        echo
        cd ..
    done
}

# Chamada da funcao
startAll

