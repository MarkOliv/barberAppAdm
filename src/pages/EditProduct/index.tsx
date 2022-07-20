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

export const EditProduct = () => {
  const [showToast] = useIonToast();

  const id: any = useParams();

  const [productId, setProductId] = React.useState(id?.ProductId);
  const [currentProduct, setCurrentProduct] = React.useState<any>();

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "nome do serviço deve ter no minimo 3 caracteres")
      .required("O nome é obrigatório"),
    category: Yup.string().required("A categoria é obrigatória"),
    code: Yup.string().min(
      3,
      "O código do produto deve ter no minimo 3 caracteres"
    ),
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

  const handleNewProduct = async (data: any) => {
    try {
      const { data: newServiceData, error } = await supabase
        .from("products")
        .update([
          {
            name: data?.name,
            category: data?.category,
            code: data?.code,
            price: data?.price,
          },
        ])
        .eq("id", productId);

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
          message: "Produto atualizado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.replace("/app/products/");
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

  const getProduct = async () => {
    try {
      let { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId);

      if (product) {
        setCurrentProduct(product[0]);
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
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <IonPage>
      <IonContent>
        <div className="flex items-center bg-white p-5 border-b">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/products" />
          </IonButtons>
          <IonTitle className="font-bold">Editar</IonTitle>
        </div>
        <form onSubmit={handleSubmit(handleNewProduct)} className="ion-padding">
          <IonLabel className="text-gray-900" position="stacked">
            Nome
          </IonLabel>
          <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
            <IonInput
              type="text"
              className="placeholder: text-gray-900"
              placeholder={`${currentProduct?.name}`}
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
              placeholder={`${currentProduct?.category}`}
              {...register("category")}
            >
              <IonSelectOption value="shampoos">Shampoos</IonSelectOption>
              <IonSelectOption value="condicionadores">
                Condicionadores
              </IonSelectOption>
              <IonSelectOption value="cremes">Cremes</IonSelectOption>
              <IonSelectOption value="bebidas">Bebidas</IonSelectOption>
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
                Código do produto
              </IonLabel>

              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type={"text"}
                  className="placeholder: text-gray-900"
                  placeholder={`${currentProduct?.code}`}
                  {...register("code")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="code"
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
                  placeholder={`${currentProduct?.price}`}
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
            className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
          >
            SALVAR
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
};
