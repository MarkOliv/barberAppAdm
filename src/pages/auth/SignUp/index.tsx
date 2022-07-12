import { IonContent, IonPage } from "@ionic/react";
import { Link } from "react-router-dom";
import hairFashionLogo from "../../../assets/hairFashion2.png";

const SignUP = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col justify-center ion-padding h-screen bg-gray-100">
          <div>
            <img src={hairFashionLogo} alt="" />
          </div>

          <Link to="register">
            <button className="p-5 w-full rounded-xl bg-cyan-500 text-white my-3">
              Cadastre-se
            </button>
          </Link>
          <Link to="/login">
            <button className="p-5 w-full rounded-xl bg-cyan-500 text-white my-3">
              Já possui uma conta ? Faça Login
            </button>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUP;
