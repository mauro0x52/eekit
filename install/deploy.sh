#!/bin/bash

# ------------------------------------------------------------------------------
# Deploy da porratoda
# ------------------------------------------------------------------------------
# Script para atualizar o ambiente de producao em nodejs quando houver
# alteracoes no codigo do serviço.
#
# Exemplos de crontab:
#
#     A cada 10 minutos
#     */10 * * * * cd /path/to/deploy/folder/; bash deploy.sh;
# ------------------------------------------------------------------------------

source config.sh

# Funcao principal
deploy() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando deploy dos serviços"
    echo "------------------------------------------------------------"
    echo ""

    echo "- Puxando alteracoes..."
    git fetch

    echo ""
    echo "- Verificando alteracoes..."
    GIT_UPDATES_TOTAL=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c a/)
    echo "-- $GIT_UPDATES_TOTAL atualizacoes encontradas."

    if [ $GIT_UPDATES_TOTAL != 0 ]
    then

        echo ""
        echo "------------------------------------------------------------"
        echo "Atualizando codigo"
        echo "------------------------------------------------------------"
        echo ""
        git pull $CONFIG_GIT_REPOSITORY $CONFIG_GIT_BRANCH

        echo ""
        echo "------------------------------------------------------------"
        echo "Reiniciando serviços"
        echo "------------------------------------------------------------"
        echo ""

        cd $CONFIG_PROJECT_FOLDER

        for SERVICE in ${CONFIG_SERVICES[@]}
        do
            cd $SERVICE
            echo "- Atualizando $SERVICE"
            forever stop $SERVICE.js

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

            # atualiza pacotes
            echo "-- Instalando e atualizando pacotes"
            npm install &>/dev/null &
            npm update &>/dev/null &

            echo "-- Reiniciando serviço..."
            forever start $SERVICE.js
            echo
            cd ..
        done
    else
        echo
        echo "- Nenhuma alteração encontrada"
        echo
    fi
}

# Chamada da funcao
deploy
