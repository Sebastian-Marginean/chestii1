import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 100 }, // întreprindere mică
    { duration: "30s", target: 500 }, // întreprindere medie
    { duration: "30s", target: 1000 }, // stres
  ],
};

export default function () {
  http.get("http://localhost:8000/taskuri?proiectId=1");
  sleep(1);
}
