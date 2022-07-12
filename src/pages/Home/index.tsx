import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from "@ionic/react";
import { calendar, chatboxEllipses, cut, time } from "ionicons/icons";
import React from "react";

import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

const Home = () => {
  // limit is 11
  const Agendamentos = [1, 2, 3, 4, 5, 6];

  const [currentUser, setcurrentUser] = React.useState<any>();

  React.useEffect(() => {
    const user = supabase.auth.user();

    setcurrentUser(user);
  }, []);

  return (
    <IonPage>
      {currentUser && (
        <IonContent fullscreen>
          <div className=" h-screen py-10 px-5 bg-gray-100">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <IonText className="text-sm text-gray-500 mb-1 font-light">
                  Bem vindo{"(a)"}
                </IonText>
                <IonText className="text-black-200 text-2xl font-bold uppercase">
                  {currentUser?.user_metadata?.full_name}
                </IonText>
              </div>
              <div className="flex items-center">
                <Link to="/app/profile">
                  <IonAvatar className="flex items-center w-[70px] h-[70px] mr-5">
                    <img
                      src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                      alt="profile"
                    />
                  </IonAvatar>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr]  gap-4 py-5">
              <div className="flex flex-col justify-center items-center h-32 bg-amber-800 shadow rounded-xl">
                <IonIcon className="mb-5 w-8 h-8 text-white" src={calendar} />

                <IonText className="text-white">Agendar</IonText>
              </div>
              <div className="flex flex-col justify-center items-center h-32 bg-white shadow rounded-xl">
                <IonIcon
                  className="mb-5 w-8 h-8 text-gray-500"
                  src={chatboxEllipses}
                />

                <IonText className="text-gray-400">Chat</IonText>
              </div>
            </div>

            <div className="h-auto bg-white shadow rounded-xl py-5">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="text-gray-500">Agendamentos</IonText>
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

export default Home;
