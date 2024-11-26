import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import os from "os";

export const meta: MetaFunction = () => {
  return [
    { title: "Oppdrift frontend" },
    { name: "description", content: "Statusside" },
  ];
};

interface ServiceStatus {
  name: string;
  status: string;
  message: string;
  serviceUrl: string | null;
  machineName: string | null;
}

interface LoaderData {
  services: ServiceStatus[];
}

export const loader: LoaderFunction = async (a): Promise<LoaderData> => {
  const coreApiUrl = process.env.OPPDRIFT_CORE_API_URL;
  let coreApiStatus: ServiceStatus;
  if (!coreApiUrl) {
    coreApiStatus = {
      name: "Oppdrift kjernesystem",
      status: "error",
      message: `Miljøvariabelen OPPDRIFT_CORE_API_URL er ikke satt`,
      serviceUrl: coreApiUrl ?? null,
      machineName: null,
    };
  } else {
    try {
      const coreApiResponse = await fetch(`${coreApiUrl}/status`);
      const coreApiData = await coreApiResponse.json();
      coreApiStatus = {
        name: "Oppdrift kjernesystem",
        status: coreApiData.status,
        machineName: coreApiData.machineName,
        message: coreApiData.message,
        serviceUrl: coreApiUrl,
      };
    } catch {
      coreApiStatus = {
        name: "Oppdrift kjernesystem",
        status: "error",
        machineName: null,
        message: `Oppdrift kjernesystem svarte ikke`,
        serviceUrl: coreApiUrl,
      };
    }
  }

  const frontendStatus: ServiceStatus = {
    name: "Oppdrift frontend",
    status: "ok",
    message: "Frontend kjører som den skal!",
    serviceUrl: a.request.url,
    machineName: os.hostname(),
  };

  return {
    services: [frontendStatus, coreApiStatus],
  };
};

export default function Index() {
  const { services } = useLoaderData<LoaderData>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <h2>Tjenester</h2>
        <div className="flex flex-col gap-4 max-w-60">
          {services.map((service) => (
            <div key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.status}</p>
              <p>{service.machineName}</p>
              <a href={service.serviceUrl ?? ""}>{service.serviceUrl}</a>
              <p>{service.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
