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
import supabase from "../../../../utils/supabase";

const Balance = () => {
  const [consultDate, setConsultDate] = React.useState<any>();
  const [allCashFlow, setAllCashFlow] = React.useState<Array<any>>([]);
  const [consultDateCashFlow, setConsultDateAllCashFlow] = React.useState<
    Array<any>
  >([]);

  const [creditCashs, setCreditCashs] = React.useState<Number>();
  const [debitCashs, setDebitCashs] = React.useState<Number>();

  const { sessionUser } = useAuth();

  const options = {
    title: "Balanço do mês",
  };

  const getCashFlow = async () => {
    try {
      let { data: cashFlow, error } = await supabase
        .from("cashFlow")
        .select("*");

      if (cashFlow) {
        setAllCashFlow(cashFlow);
      }
    } catch (error) {}
  };

  const handleFilterDate = async () => {
    setConsultDateAllCashFlow([]);
    try {
      allCashFlow?.map((cashFlow) => {
        let date = `${cashFlow?.created_at}`;
        if (date?.includes(consultDate)) {
          setConsultDateAllCashFlow((current) => [...current, cashFlow]);
        }
      });
    } catch (error) {}
  };

  const handleCashs = () => {
    try {
      let debitTotalValue = 0;
      let creditTotalValue = 0;

      consultDateCashFlow.map((cashFlow) => {
        if (cashFlow?.type === "debit") {
          debitTotalValue += Number(cashFlow?.total_value);
        } else {
          creditTotalValue += Number(cashFlow?.total_value);
        }
      });
      setCreditCashs(Number(creditTotalValue.toFixed(2)));
      setDebitCashs(Number(debitTotalValue.toFixed(2)));
    } catch (error) {}
  };

  React.useEffect(() => {
    getCashFlow();
  }, []);

  React.useEffect(() => {
    handleFilterDate();
  }, [allCashFlow, consultDate]);

  React.useEffect(() => {
    handleCashs();
  }, [consultDateCashFlow]);

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
                <div className="flex flex-wrap justify-center items-center mt-5 mb-3 p-3 bg-white rounded-3xl shadow h-24">
                  <p>Selecione a data</p>
                  <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full">
                    <IonInput
                      className="text-gray-500"
                      placeholder="dd/mm/aaaa"
                      type={"month"}
                      onIonChange={({ detail }) => {
                        setConsultDate(detail?.value);
                      }}
                    />
                    <IonIcon className="mr-5 text-gray-500" src={calendar} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <IonItem
                    className="mt-5 mb-3 bg-white rounded-3xl shadow shadow-green-500 h-20 flex items-center"
                    lines="none"
                    id="open-modal"
                  >
                    <IonLabel className="ml-5">
                      <p>RECEITA</p>
                      <h2>R${creditCashs}</h2>
                    </IonLabel>
                  </IonItem>

                  <IonItem
                    className="mt-5 mb-3 bg-white rounded-3xl shadow shadow-red-500 h-20 flex items-center"
                    lines="none"
                    id="open-modal"
                  >
                    <IonLabel className="ml-5">
                      <p>DESPESA</p>
                      <h2>R${debitCashs}</h2>
                    </IonLabel>
                  </IonItem>
                </div>

                <div className="flex justify-center bg-white rounded-3xl p-3">
                  <Chart
                    chartType="PieChart"
                    data={[
                      ["balanceType", "Value"],
                      ["Receitas", creditCashs],
                      ["Despesas", debitCashs],
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
