import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";
import { bag, calendar, chatbubbles, cut, time } from "ionicons/icons";
import React, { ChangeEvent, ChangeEventHandler } from "react";

import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

const Calendar = () => {
  // limit is 11
  const Agendamentos = [1, 2, 3, 4, 5, 6];

  const [currentUser, setcurrentUser] = React.useState<any>();

  const [date, setDate] = React.useState<any>();

  React.useEffect(() => {
    const user = supabase.auth.user();
    setcurrentUser(user);
  }, []);

  return (
    <IonPage>
      {currentUser && (
        <IonContent>
          <div className="flex items-center bg-white p-5 border-b">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/home" />
            </IonButtons>
            <IonTitle className="font-bold">Calendário</IonTitle>
          </div>
          <div className="h-screen py-10 px-5 bg-gray-100">
            <div className="grid grid-cols-[30%_1fr] gap-4 py-3">
              <div className="flex flex-col justify-center items-center h-32 bg-amber-800 shadow rounded-xl">
                <IonIcon className="mb-5 w-8 h-8 text-white" src={calendar} />

                <IonText className="text-white">Agendar</IonText>
              </div>
              <div className="flex flex-col justify-center items-center h-32 bg-white shadow rounded-xl p-3">
                <IonText className="text-gray-500">Consultar Data</IonText>
                <div className="flex justify-center items-center bg-gray-200 rounded-xl shadow h-10 w-full">
                  <IonInput
                    className="text-gray-500"
                    type="date"
                    onIonChange={({ detail }) => {
                      setDate(detail.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="h-auto bg-white shadow rounded-xl py-5">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="ml-2 text-gray-500">
                  {date ? date : "dd/mm/aaaa"}
                </IonText>
              </div>
              <div className="flex justify-center">
                <div className="h-[1px] w-4/5 bg-gray-500" />
              </div>
              <IonList className="w-full h-full p-5 rounded-xl">
                {Agendamentos.map((agendamento, index) => (
                  <div key={index} className="grid grid-cols-3 w-full py-2">
                    <div className="flex justify-start items-center">
                      <IonIcon className="w-6 h-6 text-gray-500" src={cut} />
                    </div>
                    <IonLabel className="text-gray-500">Segunda-feira</IonLabel>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">8:00</IonLabel>
                    </div>
                  </div>
                ))}
              </IonList>
            </div>
          </div>
        </IonContent>
      )}
      {currentUser == undefined && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">você precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Calendar;
