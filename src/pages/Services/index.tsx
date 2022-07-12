import { OverlayEventDetail } from "@ionic/core";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  bag,
  calendar,
  chatboxEllipses,
  chatbubbles,
  cut,
  home,
  mail,
  person,
  phonePortrait,
  time,
} from "ionicons/icons";
import React, { useRef, useState } from "react";

import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

const Services = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <>
          <IonHeader>
            <IonToolbar className="flex items-center h-20">
              <IonButtons slot="start">
                <IonBackButton defaultHref="/app/home" />
              </IonButtons>
              <IonTitle className="font-bold">Serviços</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <div className=" h-screen py-10 px-5 bg-gray-100">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col justify-center items-center h-32 col-span-2 bg-amber-800 shadow rounded-xl"
              >
                <IonIcon className="mb-5 w-8 h-8 text-white" src={cut} />

                <IonText className="text-white">Cadastrar novo serviço</IonText>
              </div>

              {/* serviços */}
              <div className="bg-white shadow rounded-xl">
                {Agendamentos.map(() => (
                  <IonItem
                    className="mt-5 mb-2 rounded-xl"
                    lines="none"
                    key={"Nome"}
                  >
                    {/* lista dos serviços */}
                    <div className="grid grid-cols-3  ">
                      <div className="flex items-center">
                        <IonText className="text-sm">corte de cabelo</IonText>
                      </div>
                      <div className="flex items-center justify-center">
                        <IonText className="text-sm">Cabelo</IonText>
                      </div>
                      <div className="flex items-center justify-end">
                        <IonText className="text-sm">R$15,00</IonText>
                      </div>
                    </div>
                  </IonItem>
                ))}
              </div>
            </div>
            <IonModal isOpen={isOpen}>
              <div className="flex justify-around p-3 bg-amber-800">
                <IonTitle className="text-white">
                  Cadastrar novo serviço
                </IonTitle>
                <div className="p-2">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="ml-2 text-white"
                  >
                    FECHAR
                  </button>
                </div>
              </div>

              <div className="ion-padding">
                <IonLabel className="text-gray-600" position="stacked">
                  Nome
                </IonLabel>
                <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                  <IonInput
                    type="text"
                    className="placeholder: text-gray-600"
                    placeholder="Corte de cabelo simples"
                    autocomplete={"email"}
                  />
                </div>
                <div className="py-5">
                  <IonLabel className="text-gray-600" position="stacked">
                    Categoria
                  </IonLabel>

                  <IonSelect
                    className="bg-gray-200 rounded-xl placeholder: text-gray-700 mt-3"
                    placeholder="Selecione a categoria"
                  >
                    <IonSelectOption value="apples">Cabelo</IonSelectOption>
                    <IonSelectOption value="oranges">Barba</IonSelectOption>
                  </IonSelect>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <IonLabel className="text-gray-600" position="stacked">
                      Tempo em minutos
                    </IonLabel>

                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        type={"number"}
                        className="placeholder: text-gray-600"
                        placeholder="20 minutos"
                        autocomplete={"email"}
                      />
                    </div>
                  </div>
                  <div>
                    <IonLabel className="text-gray-600" position="stacked">
                      Preço
                    </IonLabel>

                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonLabel className="text-gray-400">R$</IonLabel>
                      <IonInput
                        type={"number"}
                        className="placeholder: text-gray-600"
                        placeholder="15,50"
                        autocomplete={"email"}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="p-4 w-full rounded-xl bg-amber-800 text-white my-5"
                >
                  SALVAR
                </button>
              </div>
            </IonModal>
          </IonContent>
        </>
      )}
      {currentUser === undefined && (
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

export default Services;
