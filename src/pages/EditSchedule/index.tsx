// @flow
import * as React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonRouter,
  useIonToast,
} from "@ionic/react";

import { useForm } from "react-hook-form";

import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { checkmarkCircle } from "ionicons/icons";

import ScheduleImage from "../../assets/Schedule-Time.png";

type schedules = { name: string; date: string; times: [""] };

export const EditSchedule = () => {
  const [showToast] = useIonToast();

  const [schedules, setSchedules] = React.useState<Array<schedules>>([]);
  const [status, setStatus] = React.useState<boolean>(false);

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
          setStatus(true);
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

  const handleChangeStatus = async () => {
    try {
      let newStatus = status ? "pending" : "done";
      let { data, error } = await supabase
        .from("schedules")
        .update({ status: newStatus })

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
        setStatus(!status);
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
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="flex items-center bg-white p-5 border-b">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonIcon
            className={`w-7 h-7 ${
              status ? "text-green-500" : "text-orange-500"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="my-3">
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  readonly={true}
                  value={schedules.length > 0 ? schedules[0].date : "error"}
                  className="placeholder: text-gray-900"
                />
              </div>
            </div>
            <div className="my-3">
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  value={schedules.length > 0 ? schedules[0].times[0] : "error"}
                  readonly={true}
                  className="placeholder: text-gray-900 text-center uppercase "
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleChangeStatus}
            type="submit"
            className={`p-4 w-full rounded-xl ${
              status ? "bg-green-500" : "bg-orange-500"
            } text-white my-3`}
          >
            Mudar Status
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};
