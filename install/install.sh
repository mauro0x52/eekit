#!/bin/bash

# ------------------------------------------------------------------------------
# Instala a porratoda
# ------------------------------------------------------------------------------
# Script para instalar o ambiente de producao em nodejs quando houver
# alteracoes no codigo do serviço.
# ------------------------------------------------------------------------------

source config.sh

# Funcao principal
install() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando instalacao dos serviços"
    echo "------------------------------------------------------------"
    echo ""

    for SERVICE in ${CONFIG_SERVICES[@]}
    do
        cd $CONFIG_PROJECT_FOLDER/$SERVICE

        # config.js
        if [ ! -f config.js ];
        then
            cp config.js.default config.js
            echo "--- config.js copiado"
        else
            echo "--- config.js já existe"

            CONFIGJS_MODDATE=$(stat -c %Y config.js)
            CONFIGJSDEFAULT_MODDATE=$(stat -c %Y config.js.default)
            if [ ${CONFIGJSDEFAULT_MODDATE} -gt ${CONFIGJS_MODDATE} ]
            then
                echo -e "\033[31m" #vermelho
                echo "--- seu config.js está desatualizado!"
                echo -e "\033[37m" #branco
            fi
        fi

        # instala pacotes
        echo "-- Instalando pacotes"
        npm install
        npm update
    done
}

# Chamada da funcao
install
