import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonTextarea,
} from "@ionic/react";
import React, { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const [username, setUsername] = useState("default_value");
  const [url, setUrl] = useState("https://homel.vsb.cz/~mor03/TAMZ/TAMZ22.php");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState("");
  const [secondResponse, setSecondResponse] = useState("");
  const [joke, setJoke] = useState("Use button to get joke");

  const handleAuthorizedToken = async () => {
    setSecondResponse("");

    if (!decodedToken) {
      throw new Error("First you must get your tokne");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const text = await response.text();
    setSecondResponse(text);
  };

  const handleGetToken = async () => {
    const timestamp = Date.now();
    const requestUrl = `${url}?user=${encodeURIComponent(username)}&timestamp=${timestamp}`;
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const text = await response.text();
    const cleanToken = text.trim();

    setToken(cleanToken);
    setDecodedToken(atob(cleanToken));
  };

  const getJoke = async () => {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?format=txt");
    const text = await response.text();
    setJoke(text);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fetch API</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            onIonInput={(e) => setUsername(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">URL</IonLabel>
          <IonInput
            value={url}
            onIonInput={(e) => setUrl(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Decoded token</IonLabel>
          <IonInput value={decodedToken} readonly />
        </IonItem>
        <IonButton expand="block" onClick={handleGetToken}>
          Get token
        </IonButton>
        <IonButton
          expand="block"
          onClick={handleAuthorizedToken}
          disabled={!decodedToken}
        >
          Send authorized request
        </IonButton>
        <IonItem>
          <IonLabel position="stacked">Second response</IonLabel>
          <IonInput value={secondResponse} readonly />
        </IonItem>
        <IonItem>
          <h1>Joke API</h1>
          <IonLabel position="stacked">Your joke</IonLabel>
          <IonTextarea value={joke} readonly autoGrow />
        </IonItem>
        <IonButton expand="block" onClick={getJoke}>
          Get joke
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
