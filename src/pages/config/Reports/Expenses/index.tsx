// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  useIonRouter,
} from "@ionic/react";

import { Link } from "react-router-dom";

import { bagAdd, chevronBackOutline, wallet } from "ionicons/icons";
import { useAuth } from "../../../../contexts";
import { ErrorMessage } from "@hookform/error-message";

const Expenses = () => {
  const { sessionUser } = useAuth();
  const router = useIonRouter();

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Adicionar Despesa</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <form>
                  <IonLabel className="text-gray-600" position="stacked">
                    Nome da Despesa
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <IonInput type="text" placeholder="Fornecedor Fulano" />
                  </div>

                  <IonLabel className="text-gray-600" position="stacked">
                    Descrição
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <IonTextarea placeholder="Descreva sobre oque é esta despesa" />
                  </div>

                  <IonLabel className="text-gray-600" position="stacked">
                    Valor Total
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
                    <p className="text-gray-500">R$</p>
                    <IonInput type={"text"} placeholder="50.15" />
                  </div>

                  <button
                    type="submit"
                    className="p-4 w-full rounded-xl text-white my-3 bg-gradient-to-l from-green-800 to-green-700"
                  >
                    Adicionar
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">você precisa estar logado</p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Expenses;
