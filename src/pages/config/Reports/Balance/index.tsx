// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
} from "@ionic/react";

import { Link } from "react-router-dom";

import { calendar, chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../../../contexts";

import { Chart } from "react-google-charts";

const Balance = () => {
  const { sessionUser } = useAuth();

  const options = {
    title: "Balanço do mês",
  };

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/reports"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Balanço Financeiro</IonTitle>
              </Link>

              <div className="py-10 px-5">
                <div
                  className="flex flex-wrap justify-center items-center mt-5 mb-3 p-3 bg-white rounded-3xl shadow h-24"
                  key={"Especialidades"}
                >
                  <p>Selecione a data</p>
                  <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full">
                    <IonInput
                      className="text-gray-500"
                      placeholder="dd/mm/aaaa"
                      type={"month"}
                    />
                    <IonIcon className="mr-5 text-gray-500" src={calendar} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <IonItem
                    className="mt-5 mb-3 bg-white rounded-3xl shadow shadow-green-500 h-20 flex items-center"
                    lines="none"
                    id="open-modal"
                    key={"Especialidades"}
                  >
                    <IonLabel className="ml-5">
                      <p>RECEITA</p>
                      <h2>R$2546,00</h2>
                    </IonLabel>
                  </IonItem>

                  <IonItem
                    className="mt-5 mb-3 bg-white rounded-3xl shadow shadow-red-500 h-20 flex items-center"
                    lines="none"
                    id="open-modal"
                    key={"Especialidades"}
                  >
                    <IonLabel className="ml-5">
                      <p>DESPESA</p>
                      <h2>R$1440,00</h2>
                    </IonLabel>
                  </IonItem>
                </div>

                <div className="flex justify-center bg-white rounded-3xl p-3">
                  <Chart
                    chartType="PieChart"
                    data={[
                      ["balanceType", "Value"],
                      ["Receitas", 2546],
                      ["Despesas", 1440],
                    ]}
                    options={options}
                    width="100%"
                    height="300px"
                  />
                </div>
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

export default Balance;
