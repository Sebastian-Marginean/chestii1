// import Imagine from "next/image";

// // Componenta principala pentru pagina de start
// export default function Acasa() {
//   return (
//     <section className="flex min-h-screen flex-col items-center justify-center p-20 dark:bg-indigo-950">
//       hi
//     </section>
//   );
// }
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/acasa");
  return null;
}
