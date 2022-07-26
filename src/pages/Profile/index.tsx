import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTitle,
  useIonToast,
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

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import { Link, useParams } from "react-router-dom";
import { ModalEditInfo } from "../../components/ModalEditInfo";
import { useAuth } from "../../contexts";
import supabase from "../../utils/supabase";

const Profile = () => {
  const [currentProfile, setCurrentProfile] = React.useState<any>([]);
  const [showToast] = useIonToast();

  const [typeModal, setTypeModal] = React.useState<string>("");
  const [modalData, setModalData] = React.useState<any>();

  //user
  const id: any = useParams();
  const { sessionUser } = useAuth();
  const [CurrentUserProfile, setCurrentUserProfile] = React.useState<boolean>();
  const [profileImage, setProfileImage] = React.useState<string>("");

  const handleRemoveCurrentAvatar = async () => {
    setProfileImage("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.storage
        .from("avatar-images")
        .remove([`public/${currentProfile[0]?.avatar_url}`]);

      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    } finally {
      await handleTakeAPicture();
    }
  };

  const handleTakeAPicture = async () => {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      let path = capturedPhoto?.path || capturedPhoto?.webPath;
      path = `${path}`;
      await uploadNewAvatar(path);
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const uploadNewAvatar = async (path: string) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();

      const filename = path.substring(path.lastIndexOf("/") + 1);

      const { data, error } = await supabase.storage
        .from("avatar-images")
        .upload(`/public/${sessionUser?.id}-${filename}`, blob, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data) {
        handleSaveAvatarFileName(`${sessionUser?.id}-${filename}`);
      }
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }

      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const handleSaveAvatarFileName = async (filename: string) => {
    try {
      if (currentProfile[0].barber) {
        const { data, error } = await supabase
          .from("barbers")
          .update([
            {
              avatar_url: filename,
            },
          ])
          .eq("id", currentProfile[0].id);

        if (data) {
          await showToast({
            position: "top",
            message: `foto de perfil adicionada com sucesso`,
            duration: 3000,
          });
          document.location.reload();
        }

        if (error) {
          await showToast({
            position: "top",
            message: `${error}`,
            duration: 3000,
          });
          console.log(error);
        }
      } else {
        const { data, error } = await supabase
          .from("client")
          .update([
            {
              avatar_url: filename,
            },
          ])
          .eq("id", currentProfile[0].id);

        if (data) {
          await showToast({
            position: "top",
            message: `foto de perfil adicionada com sucesso`,
            duration: 3000,
          });
          document.location.reload();
        }

        if (error) {
          await showToast({
            position: "top",
            message: `${error}`,
            duration: 3000,
          });
          console.log(error);
        }
      }
    } catch (error) {}
  };

  const getProfile = async () => {
    try {
      let { data, error } = await supabase
        .from("barbers")
        .select("*")

        .eq("id", id.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setCurrentProfile(data);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    } finally {
    }
  };

  const getAvatarUrl = async (avatar_url: string) => {
    const { publicURL, error } = supabase.storage
      .from("avatar-images")
      .getPublicUrl(`public/${avatar_url}`);

    if (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
    if (publicURL) {
      // console.log(publicURL);
      setProfileImage(publicURL);
    }
  };

  const editEmail = () => {
    setTypeModal("email");
    setModalData(currentProfile[0]?.email);
  };

  const editUsername = () => {
    setTypeModal("username");
    setModalData(currentProfile[0]?.full_name);
  };

  const editPhone = () => {
    setTypeModal("phone");
    setModalData(currentProfile?.phone);
  };
  const editAddress = () => {
    setTypeModal("address");
    setModalData(currentProfile[0]?.address);
  };

  React.useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getAvatarUrl(currentProfile[0]?.avatar_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  React.useEffect(() => {
    if (id.id === sessionUser?.id) {
      setCurrentUserProfile(true);
    } else {
      setCurrentUserProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div
            onClick={() => {
              id.id === sessionUser?.id
                ? handleRemoveCurrentAvatar()
                : console.log("permission denied");
            }}
            className="flex justify-center w-full"
          >
            <img
              className="w-40 h-40 rounded-full"
              src={profileImage}
              alt="profile"
            />
          </div>
          <div className="w-full">
            <IonTitle className="text-center text-white font-semibold my-5">
              {currentProfile[0]?.full_name}
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
              <p>{currentProfile[0]?.full_name}</p>
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
              <p>{currentProfile[0]?.email}</p>
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
                {currentProfile[0]?.phone
                  ? currentProfile[0]?.phone
                  : "cadastrar novo telefone"}
              </p>
            </IonLabel>
          </IonItem>
          {currentProfile[0]?.client && (
            <IonItem
              className="mt-5"
              id="open-modal4"
              key={"Twitter"}
              onClick={editAddress}
            >
              <IonIcon src={home} />
              <IonLabel className="ml-5">
                <h2>Endereço</h2>
                <p>{currentProfile[0]?.address}</p>
              </IonLabel>
            </IonItem>
          )}
        </div>
        {CurrentUserProfile && (
          <>
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
