// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { chevronBackOutline, mailOpen, mailUnread } from "ionicons/icons";
import { useAuth } from "../../contexts";
import supabase from "../../utils/supabase";

const Notifications = () => {
  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();

  const [allNotifications, setAllNotifications] = React.useState<Array<any>>(
    []
  );

  const getNotifications = async () => {
    try {
      let { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("for", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (notifications) {
        setAllNotifications(notifications);
      }
    } catch (error) {
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    }
  };

  const handleChangeStatusNotification = async (id: string) => {
    try {
      let { data: notifications, error } = await supabase
        .from("notifications")
        .update({ status: "read" })
        .eq("id", id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }
    } catch (error) {
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const mySubscription = supabase
      .from("notifications")
      .on("INSERT", (payload) => {
        setAllNotifications((current) => [...current, payload.new]);
        console.log("it has news");
      })
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const mySubscription = supabase
      .from("notifications")
      .on("UPDATE", (payload) => {
        getNotifications();
      })
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

                <IonTitle className="font-bold">Notificações</IonTitle>
              </Link>
              <div className="py-10 px-5">
                {allNotifications.map((notification, index) => (
                  <>
                    {notification?.status === "read" && (
                      <IonItem
                        key={index}
                        className="mt-5 mb-3 bg-white rounded-3xl shadow-md border-b border-r border-green-500 h-20 flex items-center"
                        lines="none"
                        id="open-modal"
                      >
                        <IonIcon className="text-green-500" src={mailOpen} />
                        <IonLabel className="ml-5">
                          <h2>{notification?.message}</h2>
                        </IonLabel>
                      </IonItem>
                    )}
                  </>
                ))}

                {/* UNREAD */}
                <IonTitle className="text-gray-500">Não lidas</IonTitle>
                {allNotifications.map((notification, index) => (
                  <>
                    {notification?.status === "unread" && (
                      <IonItem
                        key={index}
                        className="mt-5 mb-3 bg-white rounded-3xl shadow-md border-b border-r border-orange-500 h-20 flex items-center"
                        lines="none"
                        id="open-modal"
                        onClick={() => {
                          handleChangeStatusNotification(notification?.id);
                        }}
                      >
                        <IonIcon className="text-orange-500" src={mailUnread} />
                        <IonLabel className="ml-5">
                          <h2>{notification?.message}</h2>
                        </IonLabel>
                      </IonItem>
                    )}
                  </>
                ))}
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

export default Notifications;
