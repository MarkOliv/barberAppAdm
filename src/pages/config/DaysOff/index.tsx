// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  useIonRouter,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts";
import {
  beer,
  chatbox,
  chevronBackOutline,
  documentLock,
  restaurant,
} from "ionicons/icons";

const DaysOff = () => {
  const { sessionUser } = useAuth();

  const router = useIonRouter();

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Day Off</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"Categorias"}
                  onClick={() => {
                    router.push("/app/config/daysoff/lunch-time");
                  }}
                >
                  <IonIcon src={restaurant} />
                  <IonLabel className="ml-5">
                    <h2>Meu horário de almoço</h2>
                  </IonLabel>
                </IonItem>
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"Especialidades"}
                >
                  <IonIcon src={beer} />
                  <IonLabel className="ml-5">Adicionar Folga</IonLabel>
                </IonItem>
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

export default DaysOff;
