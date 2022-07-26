// @flow
import * as React from "react";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { checkmarkCircle } from "ionicons/icons";

import ScheduleImage from "../../assets/Schedule-Time.png";

type schedules = { name: string; date: string; times: [""]; price: 0 };

export const EditSchedule = () => {
  const [showToast] = useIonToast();

  const [schedules, setSchedules] = React.useState<Array<schedules>>([]);
  const [status, setStatus] = React.useState<string>();

  //scheduleId
  const id: any = useParams();

  const getSchedules = async () => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("id", id.scheduleId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setSchedules(data);
        if (data[0].status === "done") {
          setStatus("done");
        } else if (data[0].status === "pending") {
          setStatus("pending");
        } else if (data[0].status === "canceled") {
          setStatus("canceled");
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

  const handleCancelSchedule = async () => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .update({ status: "canceled" })

        .eq("id", id.scheduleId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setStatus("canceled");
        await showToast({
          position: "top",
          message: "Status alterado com sucesso",
          duration: 3000,
        });
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

  React.useEffect(() => {
    getSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // React.useEffect(() => {
  //   console.log(schedules);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [schedules]);

  return (
    <IonPage>
      <IonContent>
        <div className="flex items-center bg-white p-5 border-b">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonIcon
            className={`w-7 h-7 ${
              status === "done"
                ? "text-green-700"
                : status === "pending"
                ? "text-orange-700"
                : "text-red-700"
            }`}
            src={checkmarkCircle}
          />
          <IonTitle className="font-bold">Agendamento</IonTitle>
        </div>
        <img src={ScheduleImage} alt="" />
        <div className="ion-padding">
          <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
            <IonInput
              type="text"
              className=""
              readonly={true}
              value={schedules.length > 0 ? schedules[0].name : "Error"}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="my-3 col-span-2">
              <div
                id="date"
                className="flex items-center bg-gray-200 rounded-xl p-3 mt-3"
              >
                <IonInput
                  type={"text"}
                  readonly={true}
                  value={schedules.length > 0 ? schedules[0].date : "error"}
                  className="placeholder: text-gray-900"
                />
              </div>
            </div>
            <div id="price" className="my-3">
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  readonly={true}
                  value={
                    schedules.length > 0 ? "R$ " + schedules[0].price : "error"
                  }
                  className="placeholder: text-gray-900"
                />
              </div>
            </div>
          </div>
          <p className=" flex justify-center items-center">às</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="my-3">
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  readonly={true}
                  value={schedules.length > 0 ? schedules[0].times[0] : "error"}
                  className="placeholder: text-gray-900"
                />
              </div>
            </div>
            <div className="my-3">
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  value={
                    schedules.length > 0
                      ? schedules[0].times[schedules[0]?.times.length - 1]
                      : "error"
                  }
                  readonly={true}
                  className="placeholder: text-gray-900 text-center uppercase "
                />
              </div>
            </div>
          </div>

          {status !== "canceled" && (
            <>
              <button
                type="submit"
                className={`p-4 w-full rounded-xl ${
                  status === "done"
                    ? "bg-gradient-to-l from-green-800 to-green-700"
                    : "bg-gradient-to-l from-orange-800 to-orange-600"
                } text-white my-3`}
              >
                {status === "done"
                  ? "Marcar como Pendente"
                  : "Marcar como Finalizado"}
              </button>
              <button
                onClick={handleCancelSchedule}
                type="submit"
                className={
                  "p-4 w-full rounded-xl bg-gradient-to-l from-red-500 to-red-700 text-white my-3"
                }
              >
                Desagendar
              </button>
            </>
          )}
          {status === "canceled" && (
            <div className="flex justify-center items-center w-full rounded-3xl shadow bg-red-500 p-10 uppercase text-white">
              <IonLabel className="text-center">
                Este agendamento foi Cancelado
              </IonLabel>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
