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
    GIT_UPDATES_TOTAL=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c '\+\+\+ b\/')
    echo "-- $GIT_UPDATES_TOTAL atualizacoes encontradas."

    if [ $GIT_UPDATES_TOTAL != 0 ]
    then

        declare -A SERVICES_UPDATES
        declare -A SERVICES_PACKAGES_UPDATES

        echo ""
        echo "------------------------------------------------------------"
        echo "Verificando atualizacoes"
        echo "------------------------------------------------------------"
        echo ""

        cd $CONFIG_PROJECT_FOLDER

        for SERVICE in ${CONFIG_SERVICES[@]}
        do
            cd $SERVICE
            echo "- Verificando atualizacoes de $SERVICE"

            GIT_UPDATES_SERVICE=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c '\+\+\+ b\/'$SERVICE)

            echo "-- $GIT_UPDATES_SERVICE atualizacoes encontradas"

            SERVICES_UPDATES[$SERVICE]=$GIT_UPDATES_SERVICE
            if [ $GIT_UPDATES_SERVICE != 0 ]
            then

                GIT_UPDATES_PACKAGE=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c '\+\+\+ b\/'$SERVICE'\/package\.json')
                SERVICES_PACKAGES_UPDATES[$SERVICE]=$GIT_UPDATES_PACKAGE
            fi

            echo
            cd ..
        done

        echo ""
        echo "------------------------------------------------------------"
        echo "Atualizando codigo"
        echo "------------------------------------------------------------"
        echo ""
        git pull $CONFIG_GIT_REPOSITORY $CONFIG_GIT_BRANCH


        echo ""
        echo "------------------------------------------------------------"
        echo "Reiniciando os serviços"
        echo "------------------------------------------------------------"
        echo ""

        for SERVICE in ${CONFIG_SERVICES[@]}
        do
            cd $SERVICE

            if [ ${SERVICES_UPDATES[$SERVICE]} != 0 ]
            then

                echo "- Reiniciando $SERVICE"

                # config.js
                if [ ! -f config.js ];
                then
                    cp config.js.default config.js
                    echo "--- config.js copiado"
                else
                    CONFIGJS_MODDATE=$(stat -c %Y config.js)
                    CONFIGJSDEFAULT_MODDATE=$(stat -c %Y config.js.default)
                    if [ ${CONFIGJSDEFAULT_MODDATE} -gt ${CONFIGJS_MODDATE} ]
                    then
                        echo -e "\033[31m--- seu config.js está desatualizado! \033[37m"
                    fi
                fi

                if [ ${SERVICES_PACKAGES_UPDATES[$SERVICE]} != 0 ]
                then
                    # atualiza pacotes
                    echo "-- Instalando e atualizando pacotes"
                    npm install >/dev/null
                    echo "--- Pacotes instalados"
                    npm upd-ate >/dev/null
                    echo "-- Pacotes atualizados"
                fi

                echo "-- Reiniciando serviço..."
                forever stop $SERVICE.js
                echo "--- Serviço $SERVICE parado"
                forever start $SERVICE.js
                echo "--- Serviço $SERVICE reiniciado"
            fi

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
