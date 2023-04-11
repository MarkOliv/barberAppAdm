// @flow
import * as React from "react";

import { IonContent, IonIcon, IonImg, IonPage, IonTitle } from "@ionic/react";

import { Link } from "react-router-dom";

import { chevronBackOutline, image } from "ionicons/icons";
import { useAuth } from "../../contexts";
import whatsappIcon from "../../assets/whatsapp.svg";
const Barbearia = () => {
  const { sessionUser } = useAuth();

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/home"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">BARBEARIA</IonTitle>
              </Link>

              <div className="flex flex-wrap items-center justify-center ion-padding">
                <div className="flex justify-center items-center h-40  w-full bg-[#D9D9D9] rounded-3xl shadow">
                  <IonIcon
                    className="mb-5 w-20 h-20 text-[#929292]"
                    src={image}
                  />
                </div>

                {/* utilizar table igual foi utilizado no site base rosa, mesmo esquema, mesmo código. */}
                <div className="flex justify-center items-center w-full my-10 rounded-3xl overflow-hidden shadow">
                  <table className="w-full text-sm text-left ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-0 px-6"></th>
                        <th scope="col" className="py-0 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#929292] ">
                        <th
                          scope="row"
                          className="py-4 px-6 font-bold text-md text-gray-900 whitespace-nowrap md:text-base md:px-2 xl:px-6 xl:text-lg"
                        >
                          Nome
                        </th>
                        <td className="py-4 px-6 text-md md:text-sm md:px-2">
                          asdasd
                        </td>
                      </tr>
                      <tr className="bg-[#D9D9D9] ">
                        <th
                          scope="row"
                          className="py-4 px-6 font-bold text-md text-gray-900 whitespace-nowrap md:text-base md:px-2 xl:px-6 xl:text-lg"
                        >
                          Endereço
                        </th>
                        <td className="py-4 px-6 text-md md:text-sm md:px-2">
                          asdasd
                        </td>
                      </tr>
                      <tr className="bg-[#929292] ">
                        <th
                          scope="row"
                          className="py-4 px-6 font-bold text-md text-gray-900 whitespace-nowrap md:text-base md:px-2 xl:px-6 xl:text-lg"
                        >
                          Horário
                        </th>
                        <td className="py-4 px-6 text-md md:text-sm md:px-2">
                          asdasd
                        </td>
                      </tr>
                      <tr className="bg-[#D9D9D9] ">
                        <th
                          scope="row"
                          className="py-4 px-6 font-bold text-md text-gray-900 whitespace-nowrap md:text-base md:px-2 xl:px-6 xl:text-lg"
                        >
                          Whatsapp
                        </th>
                        <td className="py-4 px-6 text-md md:text-sm md:px-2">
                          asdasd
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* esse botão será do wpp também */}
                <div
                  className={`flex justify-center p-4 w-full rounded-3xl text-white my-5 bg-gradient-to-l font-bold ${"from-green-800 to-green-700"}`}
                >
                  EDITAR
                </div>
                <div
                  className={`flex justify-center p-4 w-full rounded-3xl text-white my-5 bg-gradient-to-l font-bold ${"from-blue-800 to-blue-700"}`}
                >
                  ABRIR NO MAPA
                </div>

                {/* para fazer o botão flutuante utilizar mesmo código do site baserosa tmb */}
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

export default Barbearia;
