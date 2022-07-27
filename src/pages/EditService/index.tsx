// @flow
import * as React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonBackButton,
  IonButtons,
  IonContent,
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

export const EditService = () => {
  const [showToast] = useIonToast();

  const id: any = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serviceId, setServiceId] = React.useState(id?.ServiceId);
  const [currentService, setCurrentService] = React.useState<any>();

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "nome do serviço deve ter no minimo 3 caracteres")
      .required("O nome é obrigatório"),
    category: Yup.string().required("A categoria é obrigatória"),
    time: Yup.number()
      .min(5, "O tempo de serviço deve ser maior que 5")
      .required("Informe quanto tempo leva o serviço"),
    price: Yup.number().required("Informe quanto custa o serviço"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewService = async (data: any) => {
    try {
      const { data: newServiceData, error } = await supabase
        .from("services")
        .update([
          {
            name: data?.name,
            category: data?.category,
            time: data?.time,
            price: data?.price,
          },
        ])
        .eq("id", serviceId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (newServiceData) {
        await showToast({
          position: "top",
          message: "Serviço atualizado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.replace("/app/services/");
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    } finally {
    }
  };

  const getService = async () => {
    try {
      let { data: service, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId);

      if (service) {
        setCurrentService(service[0]);
      }

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
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
    getService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <IonPage>
      <IonContent>
        <div className="flex items-center bg-white p-5 border-b">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/services" />
          </IonButtons>
          <IonTitle className="font-bold">Editar</IonTitle>
        </div>
        <form onSubmit={handleSubmit(handleNewService)} className="ion-padding">
          <IonLabel className="text-gray-900" position="stacked">
            Nome
          </IonLabel>
          <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
            <IonInput
              type="text"
              className="placeholder: text-gray-900"
              placeholder={`${currentService?.name}`}
              {...register("name")}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            as={<div style={{ color: "red" }} />}
          />
          <div className="py-5">
            <IonLabel className="text-gray-900" position="stacked">
              Categoria
            </IonLabel>

            <IonSelect
              className="bg-gray-200 rounded-xl placeholder:text-gray-900 mt-3"
              placeholder={`${currentService?.category}`}
              {...register("category")}
            >
              <IonSelectOption value="cabelo">Cabelo</IonSelectOption>
              <IonSelectOption value="barba">Barba</IonSelectOption>
            </IonSelect>
            <ErrorMessage
              errors={errors}
              name="category"
              as={<div style={{ color: "red" }} />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <IonLabel className="text-gray-900" position="stacked">
                Tempo em minutos
              </IonLabel>

              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"number"}
                  className="placeholder: text-gray-900"
                  placeholder={`${currentService?.time} minutos`}
                  {...register("time")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="time"
                as={<div style={{ color: "red" }} />}
              />
            </div>
            <div>
              <IonLabel className="text-gray-900" position="stacked">
                Preço
              </IonLabel>

              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonLabel className="text-gray-400">R$</IonLabel>
                <IonInput
                  type={"number"}
                  className="placeholder: text-gray-900"
                  placeholder={`${currentService?.price}`}
                  {...register("price")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="price"
                as={<div style={{ color: "red" }} />}
              />
            </div>
          </div>
          <button
            type="submit"
            className="p-4 w-full rounded-xl bg-amber-800 text-white my-5"
          >
            SALVAR
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
};
