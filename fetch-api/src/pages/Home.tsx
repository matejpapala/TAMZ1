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
} from "@ionic/react";
import React, { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const [username, setUsername] = useState("default_value");
  const [url, setUrl] = useState("https://homel.vsb.cz/~mor03/TAMZ/TAMZ22.php");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState("");
  const [error, setError] = useState("");
  const [secondResponse, setSecondResponse] = useState("");

  const handleAuthorizedToken = async () => {
    try {
      setError("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unkown error");
    }
  };

  const handleGetToken = async () => {
    try {
      setError("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unkown error");
    }
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
