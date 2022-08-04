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
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts";
import {
  analytics,
  chevronBackOutline,
  cut,
  helpCircle,
  logOut,
  pricetags,
} from "ionicons/icons";
import supabase from "../../../utils/supabase";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const Config = () => {
  const { sessionUser } = useAuth();
  const router = useIonRouter();
  const [showToast] = useIonToast();

  const [currentUser, setcurrentUser] = React.useState<any>();
  const [avatarUrl, setAvatarUrl] = React.useState<any>();

  const handleRemoveCurrentAvatar = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.storage
        .from("avatar-images")
        .remove([`public/${currentUser[0]?.avatar_url}`]);

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
      if (currentUser[0].barber) {
        const { data, error } = await supabase
          .from("barbers")
          .update([
            {
              avatar_url: filename,
            },
          ])
          .eq("id", sessionUser?.id);

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
          .from("clients")
          .update([
            {
              avatar_url: filename,
            },
          ])
          .eq("id", sessionUser?.id);

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
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      if (sessionUser?.user_metadata?.barber) {
        let { data: barber, error } = await supabase
          .from("barbers")
          .select("*")
          .eq("id", sessionUser?.id);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
        }

        if (barber) {
          await setcurrentUser(barber);
        }
      } else {
        let { data: client, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", sessionUser?.id);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
        }

        if (client) {
          await setcurrentUser(client);
        }
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  React.useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setAvatarUrl(currentUser ? currentUser[0].avatar_url : "");
  }, [currentUser]);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to={`/app/home`}
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Configurações</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <IonItem
                  lines="none"
                  className="flex items-center rounded-3xl my-2 shadow h-32 bg-white"
                >
                  <div onClick={handleRemoveCurrentAvatar} slot="start">
                    <img
                      alt="profilePicture"
                      className="rounded-full w-20 h-20"
                      src={
                        avatarUrl
                          ? `https://eikbnmphzjoeopujpnnt.supabase.co/storage/v1/object/public/avatar-images/public/${avatarUrl}`
                          : ""
                      }
                    />
                  </div>
                  <IonLabel>
                    <h2>{currentUser ? currentUser[0]?.full_name : "error"}</h2>
                    <p>{currentUser ? currentUser[0]?.phone : "error"}</p>
                  </IonLabel>
                </IonItem>

                {sessionUser?.user_metadata?.barber && (
                  <>
                    <IonItem
                      className="mt-5 mb-3 bg-white rounded-3xl shadow"
                      lines="none"
                      id="open-modal"
                      onClick={() => {
                        router.push("/app/config/categories");
                      }}
                    >
                      <IonIcon src={pricetags} />
                      <IonLabel className="ml-5">
                        <h2>Categorias</h2>
                        <p>Cadastrar categorias de produtos e serviços</p>
                      </IonLabel>
                    </IonItem>

                    <IonItem
                      className="mt-5 mb-3 bg-white rounded-3xl shadow"
                      lines="none"
                      id="open-modal"
                      onClick={() => {
                        router.push("/app/config/specialties");
                      }}
                    >
                      <IonIcon src={cut} />
                      <IonLabel className="ml-5">
                        <h2>Especialidades</h2>
                        <p>Especialidade para barbeiros</p>
                      </IonLabel>
                    </IonItem>

                    <IonItem
                      className="mt-5 mb-3 bg-white rounded-3xl shadow"
                      lines="none"
                      id="open-modal"
                      onClick={() => {
                        router.push("/app/config/reports");
                      }}
                    >
                      <IonIcon src={analytics} />
                      <IonLabel className="ml-5">
                        <h2>Relatórios</h2>
                        <p>Balanço Financeiro</p>
                      </IonLabel>
                    </IonItem>
                  </>
                )}

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow"
                  lines="none"
                  id="open-modal"
                  onClick={() => {
                    router.push("/app/config/help");
                  }}
                >
                  <IonIcon src={helpCircle} />
                  <IonLabel className="ml-5">
                    <h2>Central de Ajuda, </h2>
                    <p>Fale conosco, política de privacidade</p>
                  </IonLabel>
                </IonItem>
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow"
                  lines="none"
                  id="open-modal"
                  key={"Sair"}
                  onClick={async () => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    let { error } = await supabase.auth.signOut();
                  }}
                >
                  <IonIcon src={logOut} />
                  <IonLabel className="ml-5">
                    <h2>Sair</h2>
                  </IonLabel>
                </IonItem>
                <div className="w-full flex justify-center items-center text-gray-400">
                  <p>Mark Oliv</p>
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

export default Config;
