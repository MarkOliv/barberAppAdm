import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTitle,
} from "@ionic/react";
import {
  chevronBackOutline,
  home,
  mail,
  person,
  phonePortrait,
  settingsSharp,
} from "ionicons/icons";
import React from "react";

import { Link } from "react-router-dom";
import { ModalEditInfo } from "../../components/ModalEditInfo";
import supabase from "../../utils/supabase";

const Profile = () => {
  const [currentUser, setcurrentUser] = React.useState<any>();

  const [typeModal, setTypeModal] = React.useState<string>("");
  const [modalData, setModalData] = React.useState<any>();

  const editEmail = () => {
    setTypeModal("email");
    setModalData(currentUser.email);
  };

  const editUsername = () => {
    setTypeModal("username");
    setModalData(currentUser?.user_metadata?.full_name);
  };

  const editPhone = () => {
    setTypeModal("phone");
    setModalData(currentUser?.phone);
  };
  const editAddress = () => {
    setTypeModal("address");
    setModalData(currentUser?.user_metadata?.address);
  };

  React.useEffect(() => {
    const user = supabase.auth.user();
    setcurrentUser(user);
  }, []);
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-wrap justify-center rounded-b-3xl p-5 bg-gradient-to-l from-green-800 to-green-600">
          <div className="flex items-center w-full mb-5">
            <Link to={"/app/home"}>
              <IonIcon
                className="w-6 h-6 text-white"
                src={chevronBackOutline}
              />
            </Link>
            <IonTitle className="font-semibold text-center text-white">
              Perfil
            </IonTitle>
            <Link to={"/settings"}>
              <IonIcon className="w-6 h-6 text-white" src={settingsSharp} />
            </Link>
          </div>
          <div className="flex justify-center w-full">
            <img
              className="w-40 rounded-full"
              src="https://blog.unyleya.edu.br/wp-content/uploads/2017/12/saiba-como-a-educacao-ajuda-voce-a-ser-uma-pessoa-melhor.jpeg"
              alt="profile"
            />
          </div>
          <div className="w-full">
            <IonTitle className="text-center text-white font-semibold my-5">
              {currentUser?.user_metadata?.full_name}
            </IonTitle>
          </div>
        </div>
        {/* content */}
        <div className="p-5">
          <IonItem
            className="mt-5 mb-3"
            id="open-modal"
            key={"Nome"}
            onClick={editUsername}
          >
            <IonIcon src={person} />
            <IonLabel className="ml-5">
              <h2>Nome</h2>
              <p>{currentUser?.user_metadata?.full_name}</p>
            </IonLabel>
          </IonItem>
          <IonItem
            className="mt-5 mb-3"
            id="open-modal2"
            key={"email"}
            onClick={editEmail}
          >
            <IonIcon src={mail} />
            <IonLabel className="ml-5">
              <h2>Email</h2>
              <p>{currentUser?.email}</p>
            </IonLabel>
          </IonItem>
          <IonItem
            className="mt-5 mb-3"
            id="open-modal3"
            key={"Phone"}
            onClick={editPhone}
          >
            <IonIcon src={phonePortrait} />
            <IonLabel className="ml-5">
              <h2>Phone</h2>
              <p>
                {currentUser?.phone
                  ? currentUser?.phone
                  : "cadastrar novo telefone"}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem
            className="mt-5"
            id="open-modal4"
            key={"Twitter"}
            onClick={editAddress}
          >
            <IonIcon src={home} />
            <IonLabel className="ml-5">
              <h2>Endereço</h2>
              <p>{currentUser?.user_metadata?.address}</p>
            </IonLabel>
          </IonItem>
        </div>

        <IonModal
          trigger="open-modal"
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
        >
          <ModalEditInfo type={typeModal} data={modalData} />
        </IonModal>
        <IonModal
          trigger="open-modal2"
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
        >
          <ModalEditInfo type={typeModal} data={modalData} />
        </IonModal>
        <IonModal
          trigger="open-modal3"
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
        >
          <ModalEditInfo type={typeModal} data={modalData} />
        </IonModal>
        <IonModal
          trigger="open-modal4"
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
        >
          <ModalEditInfo type={typeModal} data={modalData} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
