import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import { alarm, checkmarkCircle, time } from "ionicons/icons";
import React from "react";

import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import "yup-phone";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

const Calendar = () => {
  const [showToast] = useIonToast();

  const [isOpen, setIsOpen] = React.useState(false);
  const [currentUser, setcurrentUser] = React.useState<any>();
  const [hours, setHours] = React.useState<Array<string>>([]);
  const [services, setServices] = React.useState<Array<any>>([]);
  const [barbers, setBarbers] = React.useState<Array<any>>([]);
  const [selectedBarber, setSelectedBarber] = React.useState<any>();

  // Handling states to show the consult
  const [consultDate, setConsultDate] = React.useState<any>();
  const [schedulesToShow, setSchedulesToShow] = React.useState<Array<any>>([]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "nome do produto deve ter no minimo 3 caracteres")
      .required("O nome é obrigatório"),
    phone: Yup.string()?.phone(
      "BR",
      false,
      "insira um numero de telefone válido"
    ),
    barber: Yup.string().required("O Barbeiro é obrigatório"),
    service: Yup.array().required("Selecione pelo menos um serviço"),
    date: Yup.string().required("A data é obrigatória"),
    time: Yup.string().required("Informe qual horário"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const getSchedulesToShow = async (date: any) => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("date", date);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setSchedulesToShow(data);
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

  const getServices = async () => {
    try {
      let { data: services, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (services) {
        setServices(services);
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

  const getBarbers = async () => {
    try {
      let { data: barbers, error } = await supabase.from("barbers").select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (barbers) {
        setBarbers(barbers);
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

  const gerateHours = (schedulesTimes: Array<any>) => {
    let hours: Array<string> = [];

    for (let h = 8; h < 18; h++) {
      for (let m = 0; m <= 45; m = m + 15) {
        if (h < 10 && m === 0) {
          // console.log(`0${h}:0${m}`);
          hours.push(`0${h}:0${m}`);
        } else if (h < 10) {
          // console.log(`0${h}:${m}`);
          hours.push(`0${h}:${m}`);
        } else if (h >= 10 && m === 0) {
          // console.log(`${h}:0${m}`);
          hours.push(`${h}:0${m}`);
        } else if (h >= 10) {
          // console.log(`${h}:${m}`);
          hours.push(`${h}:${m}`);
        }
      }
    }

    // removing already times scheduleds
    // eslint-disable-next-line array-callback-return
    schedulesTimes.map((time: string) => {
      let currentTime = time.substring(0, 5); //valor original = 00:00:00 estou deixando como 00:00
      let i = hours.findIndex((v) => v === currentTime);
      hours.splice(i, 1);
    });
    setHours(hours);
  };

  const handleNewSchedule = async (
    name: string,
    phone: number,
    services: Array<any>,
    date: string,
    times: Array<any>,
    barber_id: any
  ) => {
    try {
      const { data: newSchedule, error } = await supabase
        .from("schedules")
        .insert([
          {
            name: name,
            phone: phone,
            services: services,
            date: date,
            times: times,
            barber_id: barber_id,
          },
        ]);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (newSchedule) {
        await showToast({
          position: "top",
          message: "Agendado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.reload();
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

  const handleTimes = (data: any) => {
    // getting total minuts of all selected services
    let services = data?.service;

    let servicesNames: Array<any> = [];
    let totalTimeServices = 0;
    // eslint-disable-next-line array-callback-return
    services.map((service: any) => {
      totalTimeServices += service?.time;
      servicesNames.push(service?.name);
    });

    //fazer com switch case
    let count = 0;
    if (totalTimeServices > 120) {
      count = 9;
    } else if (totalTimeServices > 105) {
      count = 8;
    } else if (totalTimeServices > 90) {
      count = 7;
    } else if (totalTimeServices > 75) {
      count = 6;
    } else if (totalTimeServices > 60) {
      count = 5;
    } else if (totalTimeServices > 45) {
      count = 4;
    } else if (totalTimeServices > 30) {
      count = 3;
    } else if (totalTimeServices > 15) {
      count = 2;
    } else if (totalTimeServices === 15) {
      count = 1;
    }

    // getting the minut and hour of time selected
    let minutsTime: string = data.time.substring(data.time.length, 3);
    let hourTime: string = data.time.substring(0, 2);

    let y = 0;
    let h = Number(hourTime); //horas
    let allTimeServices = [];

    for (let i = Number(minutsTime); count >= y; i = i + 15) {
      y++; //so contador
      if (i >= 60) {
        h++;
        i = 0;
        if (h >= 10) {
          allTimeServices.push(`${h}:00`);
        } else {
          allTimeServices.push(`0${h}:00`);
        }
      } else {
        if (h >= 10) {
          allTimeServices.push(`${h}:${i}`);
        } else if (i === 0) {
          allTimeServices.push(`0${h}:0${i}`);
        } else {
          allTimeServices.push(`0${h}:${i}`);
        }
      }
    }

    //comparar allTimeServices com hours. Pois no hours so tem os horarios disponiveis e se nao bater algum horario do allTimeServices eu nao deixo agendar, pq vai ocupar um horario que nao esta disponivel

    let countAvaibleTimes = 0;
    for (let i = 0; i < allTimeServices.length; i++) {
      for (let y = 0; y < hours.length; y++) {
        if (allTimeServices[i] === hours[y]) {
          countAvaibleTimes++;
        }
      }
    }

    if (allTimeServices.length === countAvaibleTimes) {
      handleNewSchedule(
        data.name,
        data.phone,
        servicesNames,
        data.date,
        allTimeServices,
        data.barber
      );
    } else {
      showToast({
        position: "top",
        message: `Horário indisponível para o(os) serviço(os) escolhidos. tempo necessário é de ${totalTimeServices} minutos`,
        duration: 5000,
      });
    }
  };

  const onChangeDate = async (newDate: any) => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("date", newDate)
        .eq("barber_id", selectedBarber);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      let schedulesTimes: Array<any> = [];
      if (data) {
        data.map((schedule) => {
          // eslint-disable-next-line array-callback-return
          schedule?.times.map((time: any) => {
            schedulesTimes.push(time);
          });
        });

        gerateHours(schedulesTimes);
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
    const user = supabase.auth.user();
    setcurrentUser(user);
  }, []);

  React.useEffect(() => {
    getServices();
    getBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {currentUser && (
        <IonContent>
          <div className="flex items-center bg-white p-5 border-b">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/home" />
            </IonButtons>
            <IonTitle className="font-bold">Calendário</IonTitle>
          </div>
          <div className="h-screen py-10 px-5 bg-gray-100">
            <div className="grid grid-cols-[30%_1fr] gap-4 py-3">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col justify-center items-center h-32 shadow rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                <IonIcon className="mb-5 w-8 h-8 text-white" src={alarm} />

                <IonText className="text-white">Agendar</IonText>
              </div>
              <div className="flex flex-col justify-center items-center h-32 bg-white shadow rounded-3xl p-3">
                <IonText className="text-gray-500">Consultar Data</IonText>
                <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow h-10 w-full">
                  <IonInput
                    className="text-gray-500"
                    type="date"
                    onIonChange={({ detail }) => {
                      setConsultDate(detail.value);
                      getSchedulesToShow(detail.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="h-auto bg-white shadow rounded-3xl py-5">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="ml-2 text-gray-500">
                  {consultDate ? consultDate : "dd/mm/aaaa"}
                </IonText>
              </div>
              <div className="flex justify-center">
                <div className="h-[1px] w-4/5 bg-gray-500" />
              </div>
              <IonList className="w-full h-full p-5 rounded-3xl">
                {schedulesToShow.map((agendamento, index) => (
                  <Link
                    to={`/app/edit-schedule/${agendamento.id}`}
                    key={index}
                    className="grid grid-cols-3 w-full py-2"
                  >
                    <div className="flex justify-start items-center">
                      <IonIcon
                        className={`w-7 h-7 ${
                          agendamento.status === "pending"
                            ? "text-orange-700"
                            : "text-green-700"
                        }`}
                        src={checkmarkCircle}
                      />
                    </div>
                    <IonLabel className="text-gray-500">
                      {agendamento.name}
                    </IonLabel>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">
                        {agendamento.times[0]}
                      </IonLabel>
                    </div>
                  </Link>
                ))}
              </IonList>
            </div>
          </div>
          <IonModal
            isOpen={isOpen}
            initialBreakpoint={0.85}
            breakpoints={[0, 0.75, 0.85, 0.9, 1]}
          >
            <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600">
              <IonTitle className="text-white">Fazer Agendamento</IonTitle>
              <div className="p-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="ml-2 text-white"
                >
                  FECHAR
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleTimes)} className="ion-padding">
              <IonLabel className="text-gray-600" position="stacked">
                Nome
              </IonLabel>
              <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1">
                <IonInput
                  type="text"
                  className="placeholder: text-gray-600"
                  placeholder="José da Silva"
                  {...register("name")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="name"
                as={<div style={{ color: "red" }} />}
              />
              <IonLabel className="text-gray-600" position="stacked">
                Numero de telefone
              </IonLabel>
              <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1">
                <IonInput
                  type="text"
                  className="placeholder: text-gray-600"
                  placeholder="(16)99111-1111"
                  {...register("phone")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="phone"
                as={<div style={{ color: "red" }} />}
              />
              <IonLabel className="text-gray-600" position="stacked">
                Barbeiro
              </IonLabel>
              <IonSelect
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione o Barbeiro"
                onIonChange={({ detail }) => {
                  setSelectedBarber(detail.value);
                }}
                {...register("barber")}
              >
                {barbers &&
                  barbers.map((barber, index) => (
                    <IonSelectOption key={index} value={barber?.id}>
                      {barber?.full_name}
                    </IonSelectOption>
                  ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="barber"
                as={<div style={{ color: "red" }} />}
              />
              <IonLabel className="text-gray-600" position="stacked">
                Serviços
              </IonLabel>
              <IonSelect
                multiple={true}
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione os serviços.."
                {...register("service")}
              >
                {services &&
                  services.map((service, index) => (
                    <IonSelectOption
                      key={index}
                      value={{
                        id: service?.id,
                        name: service?.name,
                        time: service?.time,
                      }}
                    >
                      {service?.name}
                    </IonSelectOption>
                  ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="service"
                as={<div style={{ color: "red" }} />}
              />

              <IonLabel className="text-gray-600" position="stacked">
                Data
              </IonLabel>
              <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow h-10 w-full my-3">
                <IonInput
                  onIonChange={({ detail }) => {
                    let data = detail.value;
                    onChangeDate(data);
                  }}
                  className="text-gray-500"
                  type="date"
                  {...register("date")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="date"
                as={<div style={{ color: "red" }} />}
              />
              <IonSelect
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione o horário..."
                {...register("time")}
              >
                {hours.map((hour, index) => (
                  <IonSelectOption key={index} value={hour}>
                    {hour}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="time"
                as={<div style={{ color: "red" }} />}
              />
              <button
                type="submit"
                className="p-4 w-full rounded-3xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
              >
                AGENDAR
              </button>
            </form>
          </IonModal>
        </IonContent>
      )}
      {currentUser === undefined && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">você precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Calendar;
